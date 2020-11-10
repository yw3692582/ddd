<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>实时数据</span>
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
			<el-table id='out-table' border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
			 :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass" style="width: 100%">
				<el-table-column prop="station_id" label="台站编号" align="center">
				</el-table-column>
				<el-table-column prop="district" label="所属区县" align="center">
				</el-table-column>
				<el-table-column prop="station_name" label="站点名称" align="center">
				</el-table-column>
				<el-table-column prop="status_time" label="监测时间" align="center" :formatter="formatter">
				</el-table-column>
				<el-table-column prop="soil_volume[0]" label="20cm体积含水量(%)" align="center">
				</el-table-column>
				<el-table-column prop="soil_volume[1]" label="40cm体积含水量(%)" align="center">
				</el-table-column>
				<el-table-column prop="soil_moisture[0]" label="20cm相对湿度(%)" align="center">
				</el-table-column>
				<el-table-column prop="soil_moisture[1]" label="40cm相对湿度(%)" align="center">
				</el-table-column>
			</el-table>
			<el-pagination :current-page.sync="currentPage1" background :page-size="pagesize" layout="total, prev, pager, next, jumper"
			 :total="getTableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import FileSaver from "file-saver"
	import XLSX from "xlsx"
	export default {
		data() {
			return {
				district: '',
				station: '',
				currentPage1: null,
				times: [],
				pagesize: 12,
				currpage: 1,
				options: [],
				stations: [],
				tableData: [],
				districts: [],
				tips:null
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
							start + '至' + end + '实时数据' + ".xlsx"
						)
						this.openTip()
					} catch (e) {
						if (typeof console !== "undefined") console.log(e, wbout);
					}
					if (wbout) {
						this.tips.close()
						this.pagesize = 12
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
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			Inquire() { //查询事件
				this.currentPage1 = 1
				this.currpage = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_features", {
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
				this.$ajax.post("/chongqing_features", {
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
				this.$ajax.post("/chongqing_features", {
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
				this.$ajax.post("/chongqing_features", {
						start: this.times[0],
						end: this.times[1],
						district: '',
						station_id: '',
					})
					.then(res => {
						let data = res.data.records
						console.log(data)
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
		},
		mounted() {
			this.time()
			this.tableDatas()
			this.initDatas()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/input.css");
	@import url("../../static/soilcss/soilrealtimedata.css");
	@import url("../../static/soilcss/table.css");
</style>
