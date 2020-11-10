<template>
	<div>
		<div class="table-wrapper">
			<el-input v-model="searchTableInfo" prefix-icon="el-icon-search" size="mini" placeholder="输入关键字搜索" />
			<el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" border style="width: 100%"
			 @cell-click="cellClick" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass"
			 :cell-style="setCellStyle" @cell-mouse-enter="mouseEnter" @cell-mouse-leave="mouseLeave">
				<el-table-column prop="obs_time" fixed align="center" label="监测时间" :formatter="dataFormatter" min-width="100px">
				</el-table-column>
				<el-table-column prop="station_name" fixed align="center" label="台站名称" min-width="200px">
				</el-table-column>
				<el-table-column prop="station_id" fixed align="center" label="台站编号">
				</el-table-column>
				<el-table-column prop="at_at1" align="center" label="气温°C">
				</el-table-column>
				<el-table-column prop="ah_rh1" align="center" label="相对湿度%" :formatter="formatAh">
				</el-table-column>
				<el-table-column prop="av_avg1mhv" align="center" label="分钟能见度m">
				</el-table-column>
				<el-table-column prop="wd_iwd" align="center" label="瞬时风向°">
				</el-table-column>
				<el-table-column prop="ws_iws1" align="center" label="瞬时风速m/s">
				</el-table-column>
				<el-table-column prop="rs_ct10" align="center" label="10cm路基温度°C">
				</el-table-column>
				<el-table-column prop="rs_rst" align="center" label="路面温度°C">
				</el-table-column>
				<el-table-column prop="rw_ift" align="center" label="冰层厚度mm">
				</el-table-column>
				<el-table-column prop="rw_wft" align="center" label="水膜厚度mm">
				</el-table-column>
				<el-table-column prop="rw_sft" align="center" label="雪层厚度mm">
				</el-table-column>
				<el-table-column prop="mntrnfl" align="center" label="分钟降水mm">
				</el-table-column>
				<el-table-column prop="wetslipcoef" align="center" label="湿滑系数">
				</el-table-column>
				<el-table-column prop="mainclctrvltgval" align="center" label="电源电压V">
				</el-table-column>
				<el-table-column prop="rw_trs" align="center" label="路面状况">
				</el-table-column>
			</el-table>
			<el-pagination background :current-page.sync="currentPage1" :page-size="pagesize" layout="total, prev, pager, next, jumper"
			 :total="tableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<div class="draw_status">
			<el-dialog :close-on-click-modal="false" :destroy-on-close="true" :visible.sync="dialogDataVisible" width="90vw">
				<div id="visi_tu" class="kEchars" style="height: 60vh;width: 89vw;"></div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogDataVisible: false,
				pagesize: 0,
				currpage: 1,
				currentPage1: null,
				searchTableInfo: '',
				getSearchInfo: []
			}
		},
		computed: {
			tableData() {
				let searchTableInfo = this.searchTableInfo
				if (searchTableInfo) {
					this.currpage = 1
					this.currentPage1 = 1
					return this.getSearchInfo.filter(data => {
						return Object.keys(data).some(key => {
							return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
						})
					})
				}
				return this.getSearchInfo
			},
		},
		methods: {
			mouseEnter(row, column, cell, event){//鼠标移入
				switch(column.property){
					case 'obs_time':
					case 'station_name':
					case 'station_id':
					case 'rw_trs':
					return
				}
				if (cell.style.color == 'red') {
					cell.style.backgroundColor = '#09223d'
					return
				}
				cell.style.color = '#409EFE'
				cell.style.backgroundColor = '#09223d'
			},
			mouseLeave(row, column, cell, event){//鼠标移出
				switch(column.property){
					case 'obs_time':
					case 'station_name':
					case 'station_id':
					case 'rw_trs':
					return
				}
				if (cell.style.color == 'red') {
					cell.style.backgroundColor = '#071125'
					return
				}
				cell.style.color = '#3dcee9'
				cell.style.backgroundColor = '#071125'
			},
			cellClick(row, column, cell, event) {//单击单元格
				switch(column.property){
					case 'obs_time':
					case 'station_name':
					case 'station_id':
					case 'rw_trs':
					return
				}
				this.dialogDataVisible = true
				// let Labels = column.label
				let Labels = {
					eid:row.eid,
					station_name:row.station_name,
					station_id:row.station_id,
					label:column.label
				}
				let start_time = Date.now() - 30 * 86400000
				let end_time = Date.now()
				let eids = []
				let columns = []
				eids[0] = row.eid
				columns[0] = column.property
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/traffic_line",{
					start_time:start_time,
					end_time:end_time,
					eid:eids,
					column:columns
				})
					.then(res=>{
						let Data = res.data.records
						this.$nextTick(() => {
							this.drawVisi_Tu(Data,Labels)
						})
					})
					.catch(e=>{
						console.log(e)
					})
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			formatAh(row, column){
				if (row.ah_rh1) {
					return parseInt(row.ah_rh1)
				}
			},
			setCellStyle: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (row.status === 0) {
					return {
						"color": "red"
					}
				}
			},
			getRowClass(
				row,
				column,
				rowIndex,
				columnIndex
			) {
				return "background:rgba(7, 17, 37, 1);color:#ECECEC;border-color: #04476E;";
			},
			status() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/get_status')
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.clear()
							this.$router.push('/')
							return
						}
						let Data = res.data.records
						this.getSearchInfo = Data
						this.$nextTick(() => {
							this.resoution()
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			dataFormatter(row, column) {
				if (row.obs_time) {
					return moment(row.obs_time * 1000).format("MM-DD HH:mm")
				}
			},
			resoution() {
				// let width = screen.width
				// switch (width) {
				// 	case 1600:
				// 	case 1440:
				// 		this.pagesize = 13
				// 		break
				// 	case 1360:
				// 	case 1366:
				// 		this.pagesize = 10
				// 		break
				// 	default:
						this.pagesize = this.getSearchInfo.length
				// }
			},
			drawVisi_Tu(Data,Label) {
				let myChart = echarts.init(document.getElementById('visi_tu'))
				let colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
				console.log(Data)
				let max_visi = Math.max(...Data.data) + Math.max(...Data.data) * 0.01
				let min_visi = Math.min(...Data.data) - Math.min(...Data.data) * 0.01
				console.log(max_visi,min_visi)
				let option = {
					title: {
						text: Label.label,
						subtext: Label.station_name + '一个月数据',
						textStyle: {
							fontSize: 16,
							fontWeight: 400,
							color: '#556677'
						},
						left: 'center',
						// top: '5%'
					},
					legend: {
						icon: 'circle',
						top: '5%',
						right: '5%',
						itemWidth: 6,
						itemGap: 20,
						textStyle: {
							color: '#556677',
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							label: {
								show: true,
								backgroundColor: '#fff',
								color: '#556677',
								borderColor: 'rgba(0,0,0,0)',
								shadowColor: 'rgba(0,0,0,0)',
								shadowOffsetY: 0
							},
							lineStyle: {
								width: 1
							}
						},
						backgroundColor: '#fff',
						textStyle: {
							color: '#556677',
						},
						padding: [10, 10],
						extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
					},
					grid: {
						top: '15%'
					},
					dataZoom: [{
							type: 'slider',
							show: true,
							filterMode: 'empty',
							textStyle: {
								color: '#556677'
							}
						},
						{
							type: 'inside',
							xAxisIndex: [0],
							start: 1,
							end: 35
						},
					],
					xAxis: [{
						type: 'category',
						data: Data.time,
						axisLine: {
							lineStyle: {
								color: '#556677'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							// 修改步长
							interval: 'auto',
							textStyle: {
								color: '#556677',
							},
							fontSize: 12,
							margin: 10
						},
						axisPointer: {
							label: {
								padding: [0, 0, 2, 0],
								margin: 10,
								fontSize: 12,
								backgroundColor: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#fff' // 0% 处的颜色
									}, {
										offset: 0.86,
										color: '#fff' // 0% 处的颜色
									}, {
										offset: 0.86,
										color: '#33c0cd' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#33c0cd' // 100% 处的颜色
									}],
									global: false // 缺省为 false
								}
							}
						},
						boundaryGap: false
					}],
					yAxis: [{
						type: 'value',
						min: Math.floor(min_visi),
						max: Math.ceil(max_visi),
						axisTick: {
							show: false
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#556677'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#556677',
							}
						},
						splitLine: {
							show: false
						}
					}, {
						type: 'value',
						position: 'right',
						axisTick: {
							show: false
						},
						axisLabel: {
							textStyle: {
								color: '#556677',
							},
							formatter: '{value}'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#556677'
							}
						},
						splitLine: {
							show: false
						}
					}],
					series: [{
						name: Label.label,
						type: 'line',
						data: Data.data,
						symbolSize: 1,
						symbol: 'circle',
						smooth: true,
						yAxisIndex: 0,
						showSymbol: false,
						lineStyle: {
							width: 5,
							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
									offset: 0,
									color: '#9effff'
								},
								{
									offset: 1,
									color: '#9E87FF'
								}
							]),
							shadowColor: 'rgba(158,135,255, 0.3)',
							shadowBlur: 10,
							shadowOffsetY: 20
						},
						itemStyle: {
							normal: {
								color: colorList[0],
								borderColor: colorList[0]
							}
						}
					}]
				};
				myChart.setOption(option);
				window.onresize =  myChart.resize
			},
		},
		mounted() {
			// this.resoution()
			this.status()
		}
	}
</script>
<style scoped>
	@import url("../../static/css/status.css");
</style>
