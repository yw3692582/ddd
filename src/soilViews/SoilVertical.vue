<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>纵向分析</span>
		</div>
		<hr color="#04476e" />
		<div class="center">
			<span class="demonstration">监测时间1：</span>
			<el-date-picker v-model="start" value-format="timestamp" type="date" placeholder="选择日期">
			</el-date-picker>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span class="demonstration">监测时间2：</span>
			<el-date-picker v-model="end" value-format="timestamp" type="date" placeholder="选择日期">
			</el-date-picker>
			<el-button icon="el-icon-search" @click='Inquire'>查询</el-button>
			<el-button icon="el-icon-download" @click='exportExcel'>导出</el-button>
		</div>
		<br />
		<div class="soil_ver">
			<el-radio v-model="radio" label="20">20CM</el-radio>
			<el-radio v-model="radio" label="40">40CM</el-radio>
		</div>
		<br />
		<div>
			<B style="color: white;font-size: 17px;">重庆市全区域{{starts}}和{{ends}}<span style="font-size: 24px;color: #009F95;">{{radio}}CM</span>相对湿度数据对比分析</B>
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
				<el-table-column prop="address" label="站点地址" align="center" min-width="250">
				</el-table-column>
				<el-table-column align="center">
					<template slot="header" slot-scope="scope">
					    <span>{{starts}}</span>
					</template>
					<el-table-column label="最大值" align="center">
						<template slot-scope="scope">
						    <span v-if="radio == '20'">{{scope.row.soil_volume_start_20_max}}</span>
							<span v-else>{{scope.row.soil_volume_start_40_max}}</span>
						</template>
					</el-table-column>
					<el-table-column label="最小值" align="center">
						<template slot-scope="scope">
						    <span v-if="radio == '20'">{{scope.row.soil_volume_start_20_min}}</span>
							<span v-else>{{scope.row.soil_volume_start_40_min}}</span>
						</template>
					</el-table-column>
					<el-table-column label="平均值" align="center">
						<template slot-scope="scope">
						    <span v-if="radio == '20'">{{scope.row.soil_volume_start_20_avg}}</span>
							<span v-else>{{scope.row.soil_volume_start_40_avg}}</span>
						</template>
					</el-table-column>
					<el-table-column label="墒情状况" align="center">
						<template slot-scope="scope">
							<span v-html="formatStartMoisture(scope.row)"></span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column align="center">
					<template slot="header" slot-scope="scope">
					    <span>{{ends}}</span>
					</template>
					<el-table-column label="最大值" align="center">
						<template slot-scope="scope">
						    <span v-if="radio == '20'">{{scope.row.soil_volume_end_20_max}}</span>
							<span v-else>{{scope.row.soil_volume_end_40_max}}</span>
						</template>
					</el-table-column>
					<el-table-column label="最小值" align="center">
						<template slot-scope="scope">
						    <span v-if="radio == '20'">{{scope.row.soil_volume_end_20_min}}</span>
							<span v-else>{{scope.row.soil_volume_end_40_min}}</span>
						</template>
					</el-table-column>
					<el-table-column label="平均值" align="center">
						<template slot-scope="scope">
						    <span v-if="radio == '20'">{{scope.row.soil_volume_end_20_avg}}</span>
							<span v-else>{{scope.row.soil_volume_end_40_avg}}</span>
						</template>
					</el-table-column>
					<el-table-column label="墒情状况" align="center">
						<template slot-scope="scope">
							<span v-html="formatEndMoisture(scope.row)"></span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="变化情况" align="center">
					<template slot-scope="scope">
						<span v-html="formatVariety(scope.row)"></span>
					</template>
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
	export default{
		data(){
			return{
				tableData:[],
				currentPage1:null,
				pagesize:10,
				currpage:1,
				start: 0,
				end: 0,
				radio:'20',
				starts: 0,
				ends: 0,
				tips:null
			}
		},
		computed: {
			getTableData() {
				return this.tableData
			},
		},
		methods:{
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
					let start = moment(this.start).format("YYYY年MM月DD日")
					let end = moment(this.end).format("YYYY年MM月DD日")
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
							start + '与' + end + this.radio + 'CM纵向分析数据' + ".xlsx"
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
			formatStartMoisture(moisture){//格式化墒情状况
				let moistures;
				let content;
				if (this.radio == '20') {
					moistures = moisture.soil_volume_start_20_avg
				}else{
					moistures = moisture.soil_volume_start_40_avg
				}
				if (moistures < 50) {
					content = `<span style="color:red;">干旱</span>`
					return content
				}else if(moistures < 60){
					content = `<span style="color:#8bbc67;">不足</span>`
					return content
				}else if(moistures < 80){
					content = `<span style="color:green;">适宜</span>`
					return content
				}else{
					content = `<span style="color:#409EFF;">过多</span>`
					return content
				}
			},
			formatEndMoisture(moisture){//格式化墒情状况
				let moistures;
				let content;
				if (this.radio == '20') {
					moistures = moisture.soil_volume_end_20_avg
				}else{
					moistures = moisture.soil_volume_end_40_avg
				}
				if (moistures < 50) {
					content = `<span style="color:red;">干旱</span>`
					return content
				}else if(moistures < 60){
					content = `<span style="color:#8bbc67;">不足</span>`
					return content
				}else if(moistures < 80){
					content = `<span style="color:green;">适宜</span>`
					return content
				}else{
					content = `<span style="color:#409EFF;">过多</span>`
					return content
				}
			},
			formatVariety(variety){//格式化变化状况
				let varietys;
				let content;
				if (this.radio == '20') {
					varietys = variety.soil_volume_end_20_avg - variety.soil_volume_start_20_avg 
				}else{
					varietys = variety.soil_volume_end_40_avg - variety.soil_volume_start_40_avg
				}
				if (varietys < 0) {
					content = `<span style="color:red;">下降</span>`
					return content
				}else if (varietys == 0){
					return '持平'
				}else{
					content = `<span style="color:green;">上升</span>`
					return content
				}
			},
			Inquire(){//点击查询事件
				this.currpage = 1
				this.currentPage1 = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/vertical_statistic", {
						day_1:[this.start,this.start+86400000],
						day_2:[this.end,this.end+86400000],
						district: '',
						station_id: '',
					})
					.then(res => {
						let data = res.data.records
						if (data) {
							this.starts = moment(this.start).format("YYYY年MM月DD日")
							this.ends = moment(this.end).format("YYYY年MM月DD日")
							this.tableData = data
						}else{
							this.$message({
								type:'warning',
								message:'当天无数据！'
							})
							return
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			formatter(row, column) { //格式化监测时间
				let time = row.obs_time
				return moment(time * 1000).format("YYYY-MM-DD")
			},
			tableDatas() { //获取默认数据
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/vertical_statistic", {
						day_1:[this.start,this.start+86400000],
						day_2:[this.end,this.end+86400000],
						district: '',
						station_id: '',
					})
					.then(res => {
						let data = res.data.records
						if (data) {
							this.tableData = data
						}else{
							this.$message({
								type:'warning',
								message:'当天无数据！'
							})
							return
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			time(){
				let times = new Date(new Date().toLocaleDateString()).getTime()
				this.start = times - 7 * 86400000
				this.end = times
				this.starts = moment(this.start).format("YYYY年MM月DD日")
				this.ends = moment(times).format("YYYY年MM月DD日")
			}
		},
		mounted() {
			this.time()
			this.tableDatas()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/solihorizontal.css");
	@import url("../../static/soilcss/input.css");
	@import url("../../static/soilcss/table.css");
</style>
