<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>到报监控</span>
		</div>
		<hr color="#04476e" />
		<div class="soil_center_top">
			<Three ref="threeCircel"></Three>
		</div>
		<div class="center">
			<span class="demonstration">台站名称：</span>
			<el-select v-model="station" clearable placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span class="demonstration">监测时间：</span>
			<el-date-picker v-model="times" value-format="timestamp" type="date" placeholder="选择日期">
			</el-date-picker>
			<el-button icon="el-icon-search" @click='Inquire'>查询</el-button>
		</div>
		<div class="table-wrapper">
			<el-table border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)" :row-style="getRowClass"
			 :header-row-style="getRowClass" :header-cell-style="getRowClass" style="width: 100%">
				<el-table-column prop="station_id" label="站点编号" align="center">
				</el-table-column>
				<el-table-column prop="station_name" label="站点名称" align="center">
				</el-table-column>
				<el-table-column prop="obs_time" label="监测时间" align="center" :formatter="formatter">
				</el-table-column>
				<el-table-column prop="lat_lon[0]" label="经度(°)" align="center">
				</el-table-column>
				<el-table-column prop="lat_lon[1]" label="纬度(°)" align="center">
				</el-table-column>
				<el-table-column label="到报率" align="center">
					<template slot-scope="scope">
						<el-progress :percentage="scope.row.report_rate" :color="customColorMethod"></el-progress>
					</template>
				</el-table-column>
				<el-table-column label="缺报时间" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page.sync="currentPage1" background :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="getTableData.length">
			</el-pagination>
		</div>
		<div class="arr_dialog">
			<el-dialog title="近24小时到/缺报时次详情" :visible.sync="dialogVisible" width="80vw" destroy-on-close>
				<div id="Arrival" style="width: 70vw;height: 50vh;"></div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Three from './ThreeCircle.vue'
	export default {
		data() {
			return {
				dialogVisible: false,
				tableData: [],
				currpage: 1,
				pagesize: 10,
				currentPage1:null,
				options: [],
				station: '',
				times: new Date(new Date().toLocaleDateString()).getTime(),
			}
		},
		components: {
			Three
		},
		computed: {
			getTableData() {
				return this.tableData
			}
		},
		methods: {
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#081b39;color:white;border-color: #04476E;";
			},
			handleEdit(index, row) {// 点击查看到报的详细信息
				this.dialogVisible = true
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/get_report",{
					station_id:row.station_id,
					time:this.times
				})
					.then(res=>{
						this.$nextTick(() => {
							this.drawArrival(res.data.records)
						})
					})
					.catch(e=>{
						console.log(e)
					})
			},
			customColorMethod(percentage) { //格式化到报率
				if (percentage < 20) {
					return '#E01F28';
				} else if (percentage < 70) {
					return '#e6a23c';
				} else {
					return '#67c23a';
				}
			},
			formatter(row, column) { //格式化监测时间
				let time = row.obs_time
				return moment(time * 1000).format("YYYY-MM-DD")
			},
			Inquire(){ //查询单台站数据
				if (this.times === null) {
					this.times = new Date(new Date().toLocaleDateString()).getTime()
				}
				this.currentPage1 = 1
				this.currpage = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/report_rate",{
					station_id:this.station,
					time:this.times
				})
					.then(res=>{
						let data = res.data.records
						this.tableData = data
					})
					.catch(e=>{
						console.log(e)
					})
			},
			drawArrival(Data) { //到/缺报时次详情
				let myChart = echarts.init(document.getElementById('Arrival'));
				let option = {
					title: {
						text: '24小时到/缺报时次详情',
						show:false
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(params, ticket, callback) {
							let name = params[0].name
							let seriesName = params[0].seriesName
							let value = params[0].value
							switch (value) {
								case 1:
									value = '是'
									break;
								case 0:
									value = '否'
									break;
								default:
									value = '未到此时间'
							}
							return '时间-' + name + '<br />' + seriesName + '：' + value
						}
					},
					legend: {
						data: ['是否到报']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						data: [
							'00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
							'11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
							'22:00', '23:00'
						]
					},
					yAxis: {
						type: 'value',
						show: false
					},
					series: [{
						name: '是否到报',
						type: 'line',
						data: Data
					}]
				};
				myChart.setOption(option);
				// 如果页面中有一个图表，则采用此方法
				window.onresize = myChart.resize
			},
			initDatas() { //地图站点
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/report_rate",{
					station_id:'',
					time:this.times
				})
					.then(res => {
						let data = res.data.records
						this.tableData = data
						data.find(Data => {
							this.options.push({
								value:Data.station_id,
								label:Data.station_name
							})
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			initData() { // 到/缺报
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/soil_map")
					.then(res => {
						let data = res.data.records
						data.find(Data => {
							if (Data.obs_time == null) {
								this.$refs.threeCircel.messReport += 1
							}
							switch(Data.status){
								case 1:
									this.$refs.threeCircel.online += 1
									break
								default:
									this.$refs.threeCircel.offline += 1
							}
						})
						this.$refs.threeCircel.online_percentage = Math.round((this.$refs.threeCircel.online / data.length) * 10000) / 100
						this.$refs.threeCircel.off_percentage = Math.round((this.$refs.threeCircel.offline / data.length) * 10000) / 100
						this.$refs.threeCircel.mee_percentage = Math.round((this.$refs.threeCircel.messReport / data.length) * 10000) / 100
					})
					.catch(e => {
						console.log(e)
					})
			},
		},
		mounted() {
			this.initDatas()
			this.initData()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soilarrival.css");
	@import url("../../static/soilcss/table.css");
	@import url("../../static/soilcss/input.css");
</style>
