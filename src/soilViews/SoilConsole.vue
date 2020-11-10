<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>地图监控</span>
		</div>
		<hr color="#04476e" />
		<div class="soil_center">
			<div class="center_left">
				<div class="left_top">
					<!-- 三个圆圈 -->
					<Three ref="threeCircel"></Three>
				</div>
				<div class="left_bottom">
					<!-- 地图 -->
					<div id="container"></div>
				</div>
			</div>
			<div class="center_right">
				<!-- 区县站点到报统计 -->
				<div>
					<div id="mess_report" style="width: 100%;height: 45vh;"></div>
				</div>
				<!-- 区县站点数量统计 -->
				<div>
					<div id="distributed" style="width: 100%;height: 45vh;"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Three from './ThreeCircle.vue'
	export default {
		data() {
			return {
				map: null,
				polygon: [],
				messReports: {}, //区县到报统计
				titles: [],
				markers: [],
				startIcon:[],
				infoWindows:[]
			}
		},
		components: {
		   Three
		},
		methods: {
			init() { // 初始化地图
				let _this = this
				_this.map = new AMap.Map("container", {
					resizeEnable: true,
					center: [107.983524, 30.026571],
					zoom: 7,
					mapStyle: "amap://styles/a2425e25c6fe2c4e890047477c3445ec",
				})
				_this.addMarker()
				_this.Mask()
				_this.click_sign()
				_this.info_window()
			},
			addMarker() { // 实例化站点图标
				this.map.clearMap()
				for (let i = 0, len = this.titles.length; i < len; i++) {
					let img = ''
					if (this.titles[i].status == 1) {
						img = '/static/warning_icon/normal_green.png'
					} else {
						img = '/static/warning_icon/normal_orange.png'
					}
					if (this.titles[i].obs_time === null) {
						img = '/static/warning_icon/normal_red.png'
					}
					var startIcons = new AMap.Icon({
						// 图标尺寸
						size: new AMap.Size(25, 34),
						// 图标的取图地址
						image: img,
						// 图标所用图片大小
						imageSize: new AMap.Size(24, 24),
						// 图标偏移量
						imageOffset: new AMap.Pixel(0, 0)
					});
					this.startIcon.push(startIcons)
				}
				for (let i = 0, len = this.titles.length; i < len; i++) {
					var marker = new AMap.Marker({
						map: this.map,
						icon: this.startIcon[i],
						position: this.titles[i].lat_lon,
						offset: new AMap.Pixel(-13, -20),
						extData: {
							eid: this.titles[i].eid
						}
					});
					this.markers.push(marker)
				}
			},
			click_sign() { // 鼠标移入移出站点
				for (let i = 0, len = this.markers.length; i < len; i++) {
					this.markers[i].on('mouseover', () => { //鼠标移入
						this.map.setDefaultCursor("pointer");
						this.infoWindows[i].open(this.map, this.markers[i].getPosition());
					});
					this.markers[i].on('mouseout', () => { //鼠标移出
						this.map.setDefaultCursor("default");
						this.infoWindows[i].close()
					});
				}
			},
			info_window() { //地图弹窗内容
				for (let i = 0, len = this.titles.length; i < len; i++) {
					let infoWindow = new AMap.InfoWindow({
						isCustom: true, //使用自定义窗体
						content: this.createInfoWindow(this.titles[i].station_name,
														this.titles[i].station_id,
														this.titles[i].obs_time,
														this.titles[i].status,
														this.titles[i].lat_lon,
														this.titles[i].soil_volume,
														this.titles[i].soil_moisture),
						// 弹窗位置
						offset: new AMap.Pixel(13, -35)
					});
					this.infoWindows.push(infoWindow)
				}
			},
			createInfoWindow(station_name, station_id, time, status, lat_lon, soil_volume, soil_moisture) { //地图自定义窗口
				let latlon = lat_lon
				let soilVolume = soil_volume
				let soilMoisture = soil_moisture
				if (time === null) {
					time = '缺报'
					status = '缺报'
					soilVolume = []
					soilMoisture = []
					soilMoisture[0] = '缺报'
					soilMoisture[1] = '缺报'
					soilVolume[0] = '缺报'
					soilVolume[1] = '缺报'
				}else{
					time = moment((time) * 1000).format("YYYY-MM-DD HH:mm:ss")
					status = '到报'
				}
				let info = document.createElement("div");
				info.className = "custom-info input-card content-window-card";
			
				//可以通过下面的方式修改自定义窗体的宽高
				info.style.width = "280px";
				// 定义顶部标题
				let top = document.createElement("div");
				let titleD = document.createElement("div");
				top.className = "info-top";
				titleD.innerHTML = station_name + '——' + station_id;
			
				top.appendChild(titleD);
				info.appendChild(top);
			
				// 定义中部内容
				let middle = document.createElement("div");
				middle.className = "info-middle";
				middle.style.backgroundColor = 'rgba(0,0,0,0.2)';
				middle.innerHTML = '监测时间：' + '<span>' + time + '</span>' + '<br />' +  
									'数据状态：' + '<span>' + status + '</span>' + '<br />' + 
									'经度：' + '<span>' + latlon[0] + '</span>' + '&nbsp;' + '纬度：' + '<span>' + latlon[1] + '</span>' + '<br />' +
									'20cm体积含水量：' + '<span>' + soilVolume[0] + '</span>' + '&nbsp;' + '40cm体积含水量：' + '<span>' + soilVolume[1] + '</span>' + '<br />' +
									'20cm相对湿度：'+ '<span>' +  soilMoisture[0] + '</span>' + '&nbsp;' + '40cm相对湿度：' + '<span>' + soilMoisture[1] + '</span>'
				info.appendChild(middle);
			
				// 定义底部内容
				let bottom = document.createElement("div");
				bottom.className = "info-bottom";
				bottom.style.position = 'relative';
				bottom.style.top = '0px';
				bottom.style.margin = '0 auto';
				let sharp = document.createElement("img");
				sharp.src = "static/img/sharp.png";
				bottom.appendChild(sharp);
				info.appendChild(bottom);
				return info;
			},
			Mask() { // 添加遮罩层-固定显示重庆市
				let _this = this
				new AMap.DistrictSearch({
					extensions: 'all',
					subdistrict: 0
				}).search('重庆市', function(status, result) {
					let outer = [
						new AMap.LngLat(-360, 90, true),
						new AMap.LngLat(-360, -90, true),
						new AMap.LngLat(360, -90, true),
						new AMap.LngLat(360, 90, true),
					];
					let holes = result.districtList[0].boundaries
					let pathArray = [
						outer
					];
					pathArray.push.apply(pathArray, holes)
					_this.polygon = new AMap.Polygon({
						pathL: pathArray,
						strokeColor: 'rgb(20,164,173)',
						strokeWeight: 4,
						strokeOpacity: 0.5,
						fillColor: '#081b39',
						fillOpacity: 1,
						strokeStyle: 'dashed',
						strokeDasharray: [10, 2, 10]
					});
					_this.polygon.setPath(pathArray);
					_this.map.add(_this.polygon);
				})
			},
			mess() { //区县站点到报统计
				let myChart = echarts.init(document.getElementById('mess_report'));
				let option = {
					title: {
						text: '区县站点到报统计',
						top: '4%',
						left: '4%',
						textStyle: {
							color: '#fff',
							fontSize: 24
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					xAxis: {
						show: false,
					},
					grid: {
						top: '15%',
						bottom: '10%',
						left: '5%',
						right: '15%',
						containLabel: true
					},
					legend: {
						data: ["到报", "缺报"],
						top: '5%',
						right: '5%',
						textStyle: {
							color: '#ffffff',
							fontSize: 14,
							lineHeight: 20,
							rich: {
								percent: {
									color: '#fff',
									fontSize: 16,
								},
							},
						},
					},
					yAxis: {
						type: 'category',
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							margin: 20,
							textStyle: {
								color: '#fff',
								fontSize: 16,
							}
						},
						data: this.messReports.district
					},
					series: [{
							name: '到报',
							data: this.messReports.success,
							type: 'bar',
							stack: 'one',
							itemStyle: {
								borderWidth: 1,
								barBorderRadius: 10
							},
							emphasis: {
								itemStyle: {}
							}
						},
						{
							name: '缺报',
							data: this.messReports.failure,
							type: 'bar',
							stack: 'one', //堆叠
							barWidth: 15,
							itemStyle: {
								borderWidth: 1, //用border设置两个柱形图之间的间距
								barBorderRadius: 10
							},
							emphasis: {
								itemStyle: {}
							}

						}
					]
				};
				myChart.setOption(option);
				window.addEventListener('resize', () => {
					myChart.resize()
				})
			},
			distributed() { //区县站点数量分布
				let myChart = echarts.init(document.getElementById('distributed'));
				let option = {
					title: {
						text: '区县站点数量分布',
						left: '4%',
						textStyle: {
							color: '#fff',
							fontSize: 24
						}
					},
					grid: {
						left: '7%',
						right: '4%',
						bottom: '3%',
						top: '11%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01],
						show: false
					},
					yAxis: {
						type: 'category',
						inverse: true,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							margin: 20,
							textStyle: {
								color: '#fff',
								fontSize: 16
							}
						},
						data: this.messReports.district
					},
					series: [{
						name: '2011年',
						type: 'bar',
						barWidth: 15,
						label: {
							show: true,
							position: 'right',
							textStyle: {
								fontSize: 16,
								color: '#ffffff'
							}
						},
						itemStyle: {
							barBorderRadius: 10
						},
						data: this.messReports.total
					}]
				};
				myChart.setOption(option);
				// 如果页面中有多个图表，则采用此方法
				window.addEventListener('resize', () => {
					myChart.resize()
				})
			},
			initDatas() { //地图站点
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/soil_map")
					.then(res => {
						let data = res.data.records
						this.titles = data
						data.find(Data => {
							if (Data.obs_time === null) {
								this.$refs.threeCircel.messReport += 1
							}
							switch (Data.status) {
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
						this.$nextTick(() => {
							this.init() //渲染地图
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			on_off() { //区县到报统计
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/soil_data_receive")
					.then(res => {
						let data = res.data.records
						this.messReports = data
						this.$nextTick(() => {
							this.mess()
							this.distributed()
						})
					})
					.catch(e => {
						console.log(e)
					})
			}
		},
		mounted() {
			this.initDatas()
			this.on_off()
		},
		beforeDestroy() {
			this.map.destroy()
		},
	}
</script>
<style>
	@import url("../../static/soilcss/info.css");
</style>
<style scoped>
	@import url("../../static/soilcss/soilconsole.css");
</style>
