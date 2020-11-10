<template>
	<div class="box">
		<div>
			<div class="station">
				<span class="demonstration">选择台站：</span>
				<el-select v-model="station" clearable placeholder="请选择台站">
					<el-option v-for="item in stations" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</el-select>
			</div>
			<div class="fea">
				<span class="demonstration">选择要素：</span>
				<el-select v-model="feature[0]" clearable placeholder="请选择要素">
					<el-option v-for="item in elements" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</el-select>
			</div>
			<div class="time">
				<span class="demonstration">选择时间：</span>
				<el-date-picker clearable v-model="time" value-format="timestamp" type="daterange" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</div>
			<el-button type="primary" style="display: inline;" @click="Inquire()">查询</el-button>
		</div>
		<div class="tu">
			<div>
				<div id="chartss" class="kEchars" style="height: 500px;width: 1500px;margin: 0 auto;"></div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				time: [],
				elements: [],
				stations: [],
				SoilDatas: [],
				feature: [],
				featuress: ['第一层', '第二层', '第三层', '第四层', '第五层', '第六层', '第七层', '第八层'],
				station: '',
			}
		},
		methods: {
			Inquire() {//查询点击事件
				if (this.time.length === 0 || this.feature.length === 0 || this.station.length === 0) {
					this.$message({
						type: 'warning',
						message: '参数不能为空'
					})
					return
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/line_data", {
						eid: this.station,
						column: this.feature,
						start_time: this.time[0],
						end_time: (this.time[1]) + 86400000
					})
					.then(res => {
						this.SoilDatas = res.data.records
						this.$nextTick(() => {
							this.drawS()
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			drawS() {
				let myChart = echarts.init(document.getElementById('chartss'));
				let colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#0f9b0f', '#f64f59', '#f953c6', '#FFD200']
				// 数据
				let list = []
				for (let i = 0; i < this.SoilDatas.length; i++) {
					for (let key in this.SoilDatas[i]) {
						list.push(this.SoilDatas[i][key][1])
					}
				}
				// 要素
				let feature = this.featuress
				// 时间
				let option = {
					// backgroundColor: '#fff',
					title: {
						text: '土壤设备数据分析',
						textStyle: {
							fontSize: 18,
							// fontWeight: 400,
							color: '#ffffff'
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
							color: '#ffffff'
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
								width: 0
							}
						},
						backgroundColor: '#fff',
						textStyle: {
							color: '#5c6c7c'
						},
						padding: [10, 10],
						extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
					},
					grid: {
						top: '15%'
					},
					xAxis: [{
						type: 'category',
						data: this.SoilDatas[0]['1'][0],
						axisLine: {
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							interval: 'auto',
							textStyle: {
								color: '#ffffff'
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
						axisTick: {
							show: false
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#DCE2E8'
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
								color: '#ffffff'
							},
							formatter: '{value}'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						splitLine: {
							show: false
						}
					}],
					dataZoom: [{
							type: 'slider',
							show: true,
							xAxisIndex: [0],
							start: 1,
							end: 35,
							textStyle:{
								color:'#ffffff'
							}
						},
						{
							type: 'inside',
							xAxisIndex: [0],
							start: 1,
							end: 35
						},
					],
					series: []
				};
				let depth = feature.slice(0, list.length)
				for (let i = 0; i < list.length; i++) {
					option.series.push({
						name: depth[i],
						type: 'line',
						data: list[i],
						symbolSize: 1,
						symbol: 'circle',
						smooth: true,
						yAxisIndex: 0,
						showSymbol: false,
						lineStyle: {
							width: 3,
							color: colorList[i],
						},
						itemStyle: {
							normal: {
								color: colorList[i],
								borderColor: colorList[i]
							}
						}
					})
				}
				myChart.setOption(option);
			},
			features() {
				// 要素配置
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/reverse_features')
					.then(res => {
						this.elements = res.data.records.soil
					})
					.catch(e => {
						console.log(e)
					})
			},
			equ() {
				// 台站配置
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/equip_name', {
						e_code: '0102'
					})
					.then(res => {
						let datas = res.data.records
						for (let i = 0; i < datas.length; i++) {
							if ((datas[i].key).includes('DZN2')) {
								this.stations.push(datas[i])
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			resolution() {
				// 电脑分辨率宽度
				let com_width = screen.width
				let kEchars = document.querySelectorAll(".kEchars")[0]
				// 浏览器宽度
				let width = document.body.clientWidth
				kEchars.style.width = width * 0.75 + 'px'
				switch (com_width) {
					case 1600:
					case 1440:
						kEchars.style.height = '450px'
						break
					case 1400:
						kEchars.style.height = '450px'
						break
					case 1366:
					case 1360:
						kEchars.style.height = '320px'
						break
					default:
						kEchars.style.height = '500px'
				}
			},
		},
		mounted() {
			this.resolution()
			this.features()
			this.equ()
		}
	};
</script>

<style scoped>
	@import url("../../static/css/statistical.css");
</style>
