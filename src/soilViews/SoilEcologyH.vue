<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>生态横向分析</span>
		</div>
		<hr color="#04476e" />
		<div class="center">
			<span class="demonstration">监测时间：</span>
			<el-date-picker v-model="times" value-format="timestamp" type="date" placeholder="选择日期">
			</el-date-picker>
			<el-button icon="el-icon-search" @click='Inquire'>查询</el-button>
			<el-button icon="el-icon-download" @click='exportExcel'>导出</el-button>
		</div>
		<br />
		<div>
			<B style="color: white;font-size: 17px;">重庆市全区域{{title_time}}墒情数据对比分析表</B>
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
				<el-table-column prop="obs_time" label="监测时间" align="center" :formatter="formatter" min-width="140">
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
				times: 0,
				pagesize: 10,
				currpage: 1,
				currentPage1: null,
				tableData: [],
				title_time:null
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
					let start = moment(this.times).format("YYYY年MM月DD日")
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
							start + '生态横向分析数据' + ".xlsx"
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
				let start = this.times
				let end = this.times + 86400000
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_statistic", {
						start: start,
						end: end,
						district: '',
						station_id: '',
					})
					.then(res => {
						let data = res.data.records
						this.title_time = this.titleTime()
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
				this.times = end
			},
			formatter(row, column) { //格式化监测时间
				let time = row.obs_time
				return moment(time * 1000).format("YYYY-MM-DD")
			},
			tableDatas() { //获取默认数据
				let start = this.times
				let end = this.times + 86400000
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/chongqing_statistic", {
						start: start,
						end: end,
						district: '',
						station_id: '',
					})
					.then(res => {
						let data = res.data.records
						this.title_time = this.titleTime()
						this.tableData = data
					})
					.catch(e => {
						console.log(e)
					})
			},
			titleTime(){ // 显示时间
				let time = moment(this.times).format("YYYY年MM月DD日")
				return time
			}
		},
		mounted() {
			this.time()
			this.tableDatas()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soliecologyh.css");
	@import url("../../static/soilcss/input.css");
	@import url("../../static/soilcss/table.css");
</style>
