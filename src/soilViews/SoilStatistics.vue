<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>统计数据</span>
		</div>
		<hr color="#04476e" />
		<div class="center">
			<span class="demonstration">所属区县：</span>
			<el-select v-model="district" clearable placeholder="请选择" @change="seleChange">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span class="demonstration">站点名称：</span>
			<el-select v-model="station" clearable placeholder="请选择" @change="stationChange">
				<el-option v-for="item in stations" :key="item.station_id" :label="item.station_name" :value="item.station_id">
				</el-option>
			</el-select>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span class="demonstration">选择日期查询：</span>
			<el-date-picker v-model="times" value-format="timestamp" type="daterange" range-separator="至" start-placeholder="开始日期"
			 end-placeholder="结束日期">
			</el-date-picker>
			<el-button icon="el-icon-search" @click='Inquire'>查询</el-button>
			<el-button icon="el-icon-download" @click='exportExcel'>导出</el-button>
		</div>
		<br />
		<div class="table-wrapper">
			<el-table id="out-table" border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)" :row-style="getRowClass"
			 :header-row-style="getRowClass" :header-cell-style="getRowClass" style="width: 100%">
				<el-table-column prop="station_id" label="台站编号" align="center">
				</el-table-column>
				<el-table-column prop="district" label="所属县区" align="center">
				</el-table-column>
				<el-table-column prop="station_name" label="站点名称" align="center" min-width="140">
				</el-table-column>
				<el-table-column label="20cm体积含水量(%)" align="center">
					<el-table-column prop="soil_volume_20_max" label="最大值" align="center">
					</el-table-column>
					<el-table-column prop="soil_volume_20_min" label="最小值" align="center">
					</el-table-column>
					<el-table-column prop="soil_volume_20_avg" label="平均值" align="center">
					</el-table-column>
				</el-table-column>
				<el-table-column label="40cm体积含水量(%)" align="center">
					<el-table-column prop="soil_volume_40_max" label="最大值" align="center">
					</el-table-column>
					<el-table-column prop="soil_volume_40_min" label="最小值" align="center">
					</el-table-column>
					<el-table-column prop="soil_volume_40_avg" label="平均值" align="center">
					</el-table-column>
				</el-table-column>
				<el-table-column label="20cm相对湿度(%)" align="center">
					<el-table-column prop="soil_moisture_20_max" label="最大值" align="center">
					</el-table-column>
					<el-table-column prop="soil_moisture_20_min" label="最小值" align="center">
					</el-table-column>
					<el-table-column prop="soil_moisture_20_avg" label="平均值" align="center">
					</el-table-column>
				</el-table-column>
				<el-table-column label="40cm相对湿度(%)" align="center">
					<el-table-column prop="soil_moisture_40_max" label="最大值" align="center">
					</el-table-column>
					<el-table-column prop="soil_moisture_40_min" label="最小值" align="center">
					</el-table-column>
					<el-table-column prop="soil_moisture_40_avg" label="平均值" align="center">
					</el-table-column>
				</el-table-column>
				<el-table-column label="数据图形" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">数据图形</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page.sync="currentPage1" background :page-size="pagesize" layout="total, prev, pager, next, jumper"
			 :total="getTableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<div class="drawsta_dialog">
			<el-dialog :visible.sync="dialogVisible" width="80vw" destroy-on-close>
				<div id="draw_static" style="width: 70vw;height: 55vh;"></div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import FileSaver from "file-saver"
	import XLSX from "xlsx"
	export default {
		data() {
			return {
				dialogVisible: false,
				district: '',
				station: '',
				times: [],
				pagesize: 10,
				currpage: 1,
				currentPage1: null,
				options: [],
				stations: [],
				tableData: [],
				districts: []
			}
		},
		computed: {
			getTableData() {
				return this.tableData
			}
		},
		methods: {
			openTip() {
				this.tips  = this.$notify({
					type:'info',
					dangerouslyUseHTMLString:true,
					showClose:false,
					duration:0,
					message: "<span style='font-size:18px;'>导出数据中...<i class='el-icon-loading'></i></span>",
				})
			},
			exportExcel() { //执行此方法导出Excel表格
				this.pagesize = this.tableData.length
				this.$nextTick(() => {
					let start = moment(this.times[0]).format("YYYY年MM月DD日")
					let end = moment(this.times[1]).format("YYYY年MM月DD日")
					var fix = document.querySelector('.el-table__fixed');
					var wb;
					if (fix) {
						wb = XLSX.utils.table_to_book(document.querySelector("#out-table").removeChild(fix))
						document.querySelector("#out-table").appendChild(fix)
					} else {
						wb = XLSX.utils.table_to_book(document.querySelector("#out-table"))
					}
					var wbout = XLSX.write(wb, {
						bookType: "xlsx",
						bookSST: true,
						type: "array"
					});
					try {
						FileSaver.saveAs(
							new Blob([wbout], {
								type: "application/octet-stream"
							}),
							// 导出的文件名称
							start + '至' + end + '统计数据' + ".xlsx"
						)
						this.openTip()
					} catch (e) {
						if (typeof console !== "undefined") console.log(e, wbout);
					}
					if (wbout) {
						this.tips.close()
						this.pagesize = 10
						this.$notify({
							type:'success',
							dangerouslyUseHTMLString:true,
							showClose:false,
							duration:1000,
							message: "<span style='font-size:18px;'>数据导出成功!</span>",
						})
					}else{
						this.openTip()
					}
					return wbout;
				})
			},
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#081b39;color:white;border-color: #04476E;";
			},
			Inquire() { //查询事件
				this.currentPage1 = 1
				this.currpage = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_statistic", {
						start: this.times[0],
						end: this.times[1],
						district: this.district,
						station_id: this.station,
					})
					.then(res => {
						let data = res.data.records
						this.tableData = data
					})
					.catch(e => {
						console.log(e)
					})
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			time() {
				let end = new Date(new Date().toLocaleDateString()).getTime()
				let start = end - 7 * 86400000
				this.times = [start, end]
			},
			formatter(row, column) { //格式化监测时间
				let time = row.status_time
				return moment(time * 1000).format("YYYY-MM-DD")
			},
			seleChange() { //选择所属区县后出现所对应的台站
				for (let item of Object.values(this.districts)) {
					for (let key of Object.keys(item)) {
						if (this.district == key) {
							this.stations = item[key]
						}
					}
				}
				if (!this.district) {
					this.stations = ''
				}
				this.currentPage1 = 1
				this.currpage = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_statistic", {
						start: this.times[0],
						end: this.times[1],
						district: this.district,
						station_id: this.station,
					})
					.then(res => {
						let data = res.data.records
						this.tableData = data
					})
					.catch(e => {
						console.log(e)
					})
			},
			stationChange() { //选择台站后发送请求
				this.currentPage1 = 1
				this.currpage = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_statistic", {
						start: this.times[0],
						end: this.times[1],
						district: this.district,
						station_id: this.station,
					})
					.then(res => {
						let data = res.data.records
						this.tableData = data
					})
					.catch(e => {
						console.log(e)
					})
			},
			tableDatas() { //获取默认数据
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_statistic", {
						start: this.times[0],
						end: this.times[1],
						district: '',
						station_id: '',
					})
					.then(res => {
						let data = res.data.records
						this.tableData = data
					})
					.catch(e => {
						console.log(e)
					})
			},
			initDatas() { //区县和站点
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/district_station")
					.then(res => {
						let data = res.data.records
						let district = [] //所属区县
						let districts = [] //区县所属台站
						for (let item of Object.entries(data)) {
							districts.push(item[1])
							for (let key of Object.keys(item[1])) {
								district.push({
									value: key,
									label: item[0]
								})
							}
						}
						this.options = district
						this.districts = districts
					})
					.catch(e => {
						console.log(e)
					})
			},
			handleEdit(index, row) { // 点击查看到报的详细信息
				this.dialogVisible = true
				this.$ajax.post("/chongqing_line", {
						start: this.times[0],
						end: this.times[1],
						station_id: row.station_id
					})
					.then(res => {
						let Datas = res.data.records
						this.$nextTick(() => {
							this.drawStatic(Datas.date, Datas.data, row.station_id, row.station_name)
						})
					})
					.catch(e => {

					})
			},
			drawStatic(Date, Datas, Id, Name) { //数据图形
				let myChart = echarts.init(document.getElementById('draw_static'))
				let fea = ['20cm体积含水量', '40cm体积含水量', '20cm相对湿度', '40cm相对湿度']
				let start = moment(this.times[0]).format("YYYY-MM-DD")
				let end = moment(this.times[1]).format("YYYY-MM-DD")
				let subtext ='站点：' + Id + '	' + '台站名称：'+ Name + '	' + '开始时间：' + start + '	' + '结束时间：' + end
				let option = {
					title: {
						text:'土壤水份要素数据',
						subtext: subtext,
						left: 'center',
					},
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '5%',
						top:'15%',
						containLabel: true
					},
					legend: {
						data: fea,
						top:'10%',
						right:'center'
					},
					toolbox: {
						show: true,
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							dataView: {
								readOnly: false
							},
							magicType: {
								type: ['line', 'bar']
							},
							restore: {},
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: Date
					},
					yAxis: {
						type: 'value',
					},
					series: []
				};
				for (let i = 0, len = Datas.length; i < len; i++) {
					option.series.push({
						name: fea[i],
						type: 'line',
						data: Datas[i],
						markPoint: {
							data: [{
									type: 'max',
									name: '最大值'
								},
								{
									type: 'min',
									name: '最小值'
								}
							]
						},
						markLine: {
							data: [{
								type: 'average',
								name: '平均值'
							}, ]
						}
					})
				}
				myChart.setOption(option)
				window.addEventListener('resize', () => {
					myChart.resize()
				})
			}
		},
		mounted() {
			this.time()
			this.tableDatas()
			this.initDatas()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soilstatistics.css");
	@import url("../../static/soilcss/input.css");
	@import url("../../static/soilcss/table.css");
</style>
