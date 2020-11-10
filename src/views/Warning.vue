<template>
	<div>
		<div style="height: 80px;" class="header">
			<div style="height: 80px;background-size: 100% 85px;" class="bg"></div>
			<div class="header_main">
				<span id="span_2" style="flex: 2;padding-top: 5px;display: flex;">{{data}}</span>
				<span id="span_2" style="flex: 7;font-size: 35px;margin-right: 170px;padding-top: 15px;">公路交通气象预警平台</span>
				<div class="header_div" style="flex: 1;padding-top: 5px;font-size: 18px;">
					<el-avatar :size="20" src="static/img/hearder.png"></el-avatar>
					<el-dropdown placement="bottom-start">
						<span class="el-dropdown-link">
							<span style="font-size: 16px; color: white;">{{this.$store.state.user_name}}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>
								<!-- @click="$router.push('/console')" -->
								<el-link @click="$router.push('/console')">控制台</el-link>
							</el-dropdown-item>
							<el-dropdown-item>
								<el-link @click="exit">退出登录</el-link>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</div>
		<div class="main">
			<div id="container"></div>
			<el-card shadow="always">
				<el-input placeholder="请输入县/区及以上城市名" id="city-name" @keyup.enter.native="gotoCity" v-model="city_name">
					<el-button id="query" slot="append" icon="el-icon-search" @click="gotoCity"></el-button>
				</el-input>
			</el-card>
			<div class="main_left_letData">
				<div id="left_main">
					<div class="left_herder">
						<i class="el-icon-refresh" @mouseover="tips" @click="live_data"></i>
						<i class="el-icon-time"></i><label>{{lookTime}}</label>
						<el-select v-model="station" placeholder="请选择台站" @change="selectStation">
							<el-option v-for="item in opStation" :key="item.eid" :label="item.station_name" :value="item.eid">
							</el-option>
						</el-select>
					</div>
					<div class="left_center">
						<el-row>
							<el-col :span="6">
								<div id="temperature" class="div1" style="width: 87px;height:260px;"></div>
							</el-col>
							<el-col :span="6">
								<div id="humidity" class="div1" style="width: 87px;height:260px;"></div>
							</el-col>
							<el-col :span="6">
								<div id="subgrade" class="div1" style="width: 87px;height:260px;"></div>
							</el-col>
							<el-col :span="6">
								<div id="road" class="div1" style="width: 87px;height:260px;"></div>
							</el-col>
						</el-row>
					</div>
					<div class="left_center_bottom">
						<el-row>
							<el-col :span="12">
								<div id="direction" style="width: 180px;height:220px;"></div>
							</el-col>
							<el-col :span="12">
								<div id="speed" style="width: 180px;height:220px;"></div>
							</el-col>
						</el-row>
					</div>
					<div class="left_center_footer">
						<el-row style="padding: 18px 0px 0px 0px;">
							<el-col :span="12">
								<div>
									<img src="/static/icon/njd.png" height="10" width="15" />
									分钟能见度：<span id="fontColor">{{av_avg1mhv}}m</span></div>
							</el-col>
							<el-col :span="12" style="padding-left: 15px;">
								<div>
									<img src="/static/icon/PM.png" height="15" width="15" />
									PM 2.5：<span id="fontColor">{{pm}}μg/m³</span></div>
							</el-col>
						</el-row>
						<el-row style="padding: 18px 0px 9px 0px;">
							<el-col :span="12">
								<div>
									<img src="/static/icon/rainfall.png" height="15" width="15" />
									分钟降水：<span id="fontColor">{{mntrnfl}}mm</span></div>
							</el-col>
							<el-col :span="12" style="padding-left: 15px;">
								<div>
									<img src="/static/icon/sh.png" height="14" width="14" />
									水膜厚度：<span id="fontColor">{{rw_wft}}mm</span></div>
							</el-col>
						</el-row>
						<el-row style="padding: 9px 0px 9px 0px;">
							<el-col :span="12">
								<div>
									<img src="/static/icon/bc.png" height="15" width="15" />
									冰层厚度：<span id="fontColor">{{rw_ift}}mm</span></div>
							</el-col>
							<el-col :span="12" style="padding-left: 15px;">
								<div>
									<img src="/static/icon/xc.png" height="15" width="15" />
									雪层厚度：<span id="fontColor">{{rw_sft}}mm</span></div>
							</el-col>
						</el-row>
						<el-row style="padding-top: 9px;">
							<el-col :span="12">
								<div>
									<img src="/static/icon/lm.png" height="15" width="15" />
									路面状况：<span id="fontColor">{{rw_trs}}</span>
								</div>
							</el-col>
							<el-col :span="12" style="padding-left: 15px;">
								<div>
									<img src="/static/icon/shxs.png" height="15" width="15" />
									湿滑系数：<span id="fontColor">{{wetslipcoef}}</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>
			<div id="quoteRate">
				<el-row>
					<el-col :span="6">
						<el-progress type="circle" :stroke-width="10" :percentage="Mete"></el-progress>
						<br>
						<span id="footer_font">气象站通信率</span>
					</el-col>
					<el-col :span="6">
						<el-progress type="circle" :stroke-width="10" :percentage="Stat"></el-progress>
						<br>
						<span id="footer_font">监控设备通信率</span>
					</el-col>
					<el-col :span="6">
						<el-progress type="circle" :stroke-width="10" :percentage="nowSta"></el-progress>
						<br>
						<span id="footer_font">当前站点到报率</span>
					</el-col>
					<el-col :span="6">
						<el-progress type="circle" :stroke-width="10" :percentage="Site"></el-progress>
						<br>
						<span id="footer_font">当前及时报率</span>
					</el-col>
				</el-row>
			</div>
		</div>
		<div id="menu" class="menu">
			<el-tooltip content="实时数据" :enterable="false" placement="top" effect="dark">
				<img src="static/img/nowDatas.png" @click="leftData" />
			</el-tooltip>
			<el-tooltip content="应急预案" :enterable="false" placement="top" effect="dark">
				<img src="static/img/finish.png" style="margin: 0px 35px 0px 35px;" @click="openTip" />
			</el-tooltip>
			<el-tooltip content="数据统计" :enterable="false" placement="top" effect="dark">
				<img src="static/img/history.png" style="margin: 0px 35px 0px 0px;" @click="centerSta" />
			</el-tooltip>
			<el-tooltip content="预警信息" :enterable="false" placement="top" effect="dark">
				<img src="static/img/history_warning.png" style="margin: 0px 35px 0px 0px;" @click="rightData" />
			</el-tooltip>
			<el-tooltip content="设备监控" :enterable="false" placement="top" effect="dark">
				<img src="static/img/equipment.png" @click="centerEqu" />
			</el-tooltip>
		</div>
		<div class="main_right_datas">
			<div id="right_main">
				<div class="right_main_header">
					<div class="right_main_header_span">
						<el-row v-if="tableData.length">
							<el-col :span="8">发生时间</el-col>
							<el-col :span="8">台站名称</el-col>
							<el-col :span="8">预警事件</el-col>
						</el-row>
						<vue-seamless-scroll v-if="tableData.length > 0" :data="tableData" :class-option="defaultOption" class="seamless-warp">
							<ul class="item">
								<li v-for="item in tableData">
									<el-row>
										<el-col :span="8"><span class="date" v-text="item.date"></span></el-col>
										<el-col :span="8"><span class="name" v-text="item.name"></span></el-col>
										<el-col :span="8"><span class="warning" v-text="item.warning"></span></el-col>
									</el-row>
								</li>
							</ul>
							<el-divider></el-divider>
						</vue-seamless-scroll>
					</div>
				</div>
				<div class="right_main_center">
					<div id="finsh" style="width: 354px; height: 280px;margin-left: 5px;"></div>
				</div>
			</div>
		</div>
		<div class="station_dialog">
			<div id="dia_station">
				<div class="dia_div">
					<ul @click="ul_his">
						<li id="tems">温度</li>
						<li id="vis">能见度</li>
						<li id="wind_speed">瞬时风速</li>
						<li id="rainFall">雨量统计图</li>
					</ul>
				</div>
				<div v-show="temperature">
					<div id="tu" class="kEchars" style="height: 500px;width: 1500px;"></div>
				</div>
				<div v-show="visi">
					<div id="visi_tu" class="kEchars" style="height: 500px;width: 1500px;"></div>
				</div>
				<div v-show="wind_speed">
					<div id="wind_tu" class="kEchars" style="height: 500px;width: 1500px;"></div>
				</div>
				<div v-show="Rain_fall">
					<div id="Rain_tu" class="kEchars" style="height: 500px;width: 1500px;"></div>
				</div>
			</div>
		</div>
		<div class="logo">
			<ul>
				<li v-for="(img,key) in img" :key="key">
					<span>{{key}}</span>
					<img :src="img">
				</li>
			</ul>
		</div>
		<div class="cen_equipment">
			<div id="layer_equipment" style="display: grid;place-items: center;">
				<div v-if="equiment" id="draw_equipment" style="width: 500px;height: 300px;"></div>
				<div v-if="equiment" id="draw_probability" style="width: 700px;height: 800px;"></div>
			</div>
		</div>
		<div class="cenSta">
			<div id="cen_sta">
				<div class="cen_ul">
					<ul @click="cen_his">
						<li id="data_sta">数据统计</li>
						<li id="data_dis">灾害种类统计</li>
					</ul>
				</div>
				<div class="cen_content" v-show="cen_sta">
					<div class="cen_header">
						<div v-show="cen_sta">
							<el-date-picker align="center" value-format="timestamp" v-model="days" type="date" placeholder="选择日期">
							</el-date-picker>
							<el-date-picker value-format="timestamp" v-model="months" type="month" placeholder="选择月"></el-date-picker>
							<el-select v-model="quarterly" clearable placeholder="请选择季度">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
							<el-date-picker value-format="timestamp" v-model="years" type="year" placeholder="选择年"></el-date-picker>
							<el-button @click="con">查询</el-button>
						</div>
					</div>
					<div class="cen_center">
						<div class="cen_left">
							<el-popover placement="right" width="600" style="text-align: center;" trigger="hover">
								<el-radio-group v-for="(item,index) in opStation" :key="index" v-model="equ_radio">
									<el-radio :label="item.eid">{{item.station_name}}</el-radio>
								</el-radio-group>
								<el-button style="font-size: 16px;width: 122px;" slot="reference">选择台站</el-button>
							</el-popover>
							<el-popover placement="right" width="200" trigger="hover">
								<el-radio-group v-for="(item,index) in fea_ele" :key="index" v-model="radio">
									<el-radio :label="item.key">{{item.value}}</el-radio>
								</el-radio-group>
								<el-button style="font-size: 16px;width: 122px;" slot="reference">选择要素</el-button>
							</el-popover>
							<!-- <div>
								<el-button style="font-size: 16px;">同点不同时</el-button>
							</div>
							<div>
								<el-button style="font-size: 16px;">同点不同时</el-button>
							</div> -->
						</div>
						<div class="cen_right">
							<div style="display: flex;">
								<div id="draw_datas" style="width: 55vw;height: 450px;"></div>
							</div>
						</div>
					</div>
				</div>
				<div v-show="disaster" style="display: grid;place-items: center;">
					<div id="draw_dis" style="width:950px;height: 500px;"></div>
				</div>
			</div>
		</div>
		<div id="info_ul">
			<!-- class="animate__animated animate__zoomIn" -->
			<ul id="my_info" class="animate__animated animate__zoomInUp">
				<li id="info_sta">
					<span>数据<br>统计</span>
				</li>
				<li id="info_station">
					<span>台站<br>信息</span>
				</li>
				<li id="info_warning">
					<span>预警<br>信息</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	// import AMap from 'AMap'
	export default {
		data() {
			return {
				equ_radio:'',
				radio: '',
				fea_ele: [{
						key: 'at_at1',
						value: '气温'
					},
					{
						key: 'rs_rst',
						value: '路面温度'
					},
					{
						key: 'rs_ct10',
						value: '路基温度'
					},
					{
						key: 'rw_wft',
						value: '水膜厚度'
					},
					{
						key: 'rw_ift',
						value: '冰层厚度'
					},
					{
						key: 'rw_sft',
						value: '雪层厚度'
					},
					{
						key: 'rw_trs',
						value: '路面状况'
					},
					{
						key: 'wetslipcoef',
						value: '湿滑系数'
					},
					{
						key: 'ah_rh1',
						value: '湿度'
					},
					{
						key: 'wd_iwd',
						value: '瞬时风向'
					},
					{
						key: 'ws_iws1',
						value: '瞬时风速'
					},
					{
						key: 'pm25',
						value: 'PM2.5'
					},
					{
						key: 'mntrnfl',
						value: '分钟降水'
					},
					{
						key: 'av_avg1mhv',
						value: '分钟能见度'
					},
				],
				cen_sta: true,
				disaster: false,
				days: '',
				months: '',
				options: [{
						value: 1,
						label: '第一季度'
					},
					{
						value: 2,
						label: '第二季度'
					},
					{
						value: 3,
						label: '第三季度'
					},
					{
						value: 4,
						label: '第四季度'
					}
				],
				years: '',
				quarterly: null,
				rate: [],
				head: [],
				left_datas: false,
				equiment: false,
				img: {
					'正常：': 'static/warning_icon/normal_green.png',
					'离线：': 'static/warning_icon/normal_gray.png',
					'路面：': 'static/warning_icon/road_red.png',
					'高温：': 'static/warning_icon/temperature_red.png',
					'降雨：': 'static/warning_icon/rainfall_red.png',
					'大风：': 'static/warning_icon/speed_red.png',
					'能见度：': 'static/warning_icon/fog_red.png'
				},
				temperature: true,
				visi: false,
				wind_speed: false,
				Rain_fall: false,
				data: '',
				timer: null,
				timers: null,
				dialogVisible: false,
				city_name: '',
				station_name: '',
				station: '',
				opStation: [],
				eid: '',
				last_eid: '',
				ws: null,
				wbst: null,
				map: null,

				lookTime: moment().format("MM月DD日 dddd"),
				Tem: 0, //气温
				Hum: 0, //湿度
				Sub: 0, //路基温度
				Road: 0, //路面温度

				Dire: 0, //瞬时风向
				Speed: 0, //瞬时风速

				av_avg1mhv: 0, //能见度
				pm: 0, //空气质量
				mntrnfl: 0, //降水
				rw_wft: 0, //水膜厚度
				rw_ift: 0, //冰层厚度
				rw_sft: 0, //雪层厚度
				rw_trs: '--', //路面状况
				wetslipcoef: 0, //湿滑系数

				Mete: 0, //气象站通信率
				Stat: 0, //监控设备通信率
				nowSta: 0, //当前站点到报率
				Site: 0, //当前及时报率
				titles: [],
				historicalDatas: [],
				VisiDatas: [],
				windSpeed: [],
				Rain: [],
				tableHeader: ['发生时间', '台站名称', '预警事件'],
				tableData: [],
				events_num: null, //预警事件总数
				_speed: null, //大风预警
				_tem: null, //高温预警
				_avg: null, //能见度预警
				_rain: null, //降雨预警
				_road: null, //路面状况预警

				markers: [], //点标记
				marker: null,
				startIcon: [], //图片
				infoWindows: [], //窗口内容
				infoYuans:[],
				polygon: [],
				online: 0,
				offline: 0,
				line: 0,
			}
		},
		updated() {
			this.drawTem()
			this.drawHum()
			this.drawSub()
			this.drawRoad()
			this.drawDire()
			this.drawSpeed()
			this.drawFinsh()
			this.info_uls()
		},
		computed: {
			defaultOption() {
				return {
					limitMoveNum: 2,
					openWatch: true,
				}
			},
		},
		methods: {
			con() {
				console.log(this.days)
				console.log(this.months)
				console.log(this.quarterly)
				console.log(this.years)
				console.log(this.radio)
				console.log(this.equ_radio)
			},
			info_uls(){
				let info_sta = $("#info_sta")[0]
				let info_station = $("#info_station")[0]
				let info_warning = $("#info_warning")[0]
				info_sta.onclick = () => {
					this.click_sign_after()
					this.map.clearInfoWindow()
				}
				info_station.onclick = () => {
					this.openTip()
					this.map.clearInfoWindow()
				}
				info_warning.onclick = () => {
					this.openTip()
					this.map.clearInfoWindow()
				}
			},
			openTip() {
				this.$notify.info({
					title: '提示',
					message: '该功能暂未完成，敬请期待！',
					showClose: false,
					duration: 3000,
					position: 'top-left'
				})
			},
			map_data() { //地图获取点标记经纬度
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/map_point")
					.then(res => {
						this.titles = res.data.records
						this.$nextTick(() => {
							this.init() //渲染地图
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			addMarker() { //地图添加标记
				this.map.clearMap();
				for (let i = 0; i < this.titles.length; i++) {
					let img = ''
					if (this.titles[i].status == 0) {
						img = '/static/warning_icon/normal_gray.png'
					} else if (this.titles[i].status == null) {
						img = '/static/warning_icon/normal_gray.png'
					} else {
						img = '/static/warning_icon/' + this.titles[i].warning_type + '_' + this.titles[i].warning_level + '.png'
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
				for (let i = 0; i < this.titles.length; i++) {
					let animation;
					switch (this.startIcon[i].Ce.image) {
						case '/static/warning_icon/normal_green.png':
						case '/static/warning_icon/normal_gray.png':
							animation = 'AMAP_ANIMATION_DROP'
							break
						default:
							animation = 'AMAP_ANIMATION_BOUNCE'
							break
					}
					var marker = new AMap.Marker({
						map: this.map,
						icon: this.startIcon[i],
						position: this.titles[i].lat_lon,
						offset: new AMap.Pixel(-13, -20),
						animation: animation,
						extData: {
							eid: this.titles[i].eid
						}
					});
					this.markers.push(marker)
				}
			},
			click_sign() { //点击地图台站
				for (let i = 0; i < this.markers.length; i++) {
					this.markers[i].on('mouseover', () => { //鼠标移入
						this.map.setDefaultCursor("pointer");
						this.infoWindows[i].open(this.map, this.markers[i].getPosition());
					});
					this.markers[i].on('mouseout', () => { //鼠标移出
						this.map.setDefaultCursor("default");
						this.infoWindows[i].close()
					});
					this.markers[i].on('click', (e) => { //点击台站
						this.map.setDefaultCursor("pointer");
						this.infoYuans[i].open(this.map, this.markers[i].getPosition());
						this.station_name = this.titles[i].station_name
						let eid = this.titles[i].eid
						this.eid = eid
					});
				}
			},
			click_sign_after(){
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/line_data", {
						eid: this.eid,
						// 气温、路面温度、10cm路基温度
						column: ["at_at1", "rs_rst", "rs_ct10"]
					})
					.then(res => {
						this.historicalDatas = res.data.records
						this.$nextTick(() => {
							let kEchars = document.querySelectorAll(".kEchars")
							let width = document.body.clientWidth
							for (let i = 0; i < kEchars.length; i++) {
								kEchars[i].style.width = width * 0.78 + 'px'
							}
							switch (width) {
								case 1680:
								case 1600:
									for (let i = 0; i < kEchars.length; i++) {
										kEchars[i].style.height = '400px'
									}
									this.dialogCenter = () => {
										let _this = this
										layer.open({
											type: 1,
											title: _this.station_name,
											area: [width * 0.78 + 'px', '478px'],
											shade: false,
											resize: false,
											maxmin: true,
											anim: 2,
											content: $("#dia_station"),
											cancel: function(index, layero){
												_this.temperature = true
												_this.visi = false
												_this.wind_speed = false
												_this.Rain_fall = false
											    layer.close(index)
											}
										})
									}
									break
								case 1400:
								case 1440:
									for (let i = 0; i < kEchars.length; i++) {
										kEchars[i].style.height = '340px'
									}
									this.dialogCenter = () => {
										let _this = this
										layer.open({
											type: 1,
											title: _this.station_name,
											area: [width * 0.78 + 'px', '418px'],
											shade: false,
											resize: false,
											maxmin: true,
											anim: 2,
											content: $("#dia_station"),
											cancel: function(index, layero){
												_this.temperature = true
												_this.visi = false
												_this.wind_speed = false
												_this.Rain_fall = false
											    layer.close(index)
											} 
										})
									}
									break
								case 1366:
									for (let i = 0; i < kEchars.length; i++) {
										kEchars[i].style.height = '280px'
									}
									this.dialogCenter = () => {
										let _this = this
										layer.open({
											type: 1,
											title: _this.station_name,
											area: [width * 0.78 + 'px', '358px'],
											shade: false,
											resize: false,
											maxmin: true,
											anim: 2,
											content: $("#dia_station"),
											cancel: function(index, layero){
												_this.temperature = true
												_this.visi = false
												_this.wind_speed = false
												_this.Rain_fall = false
											    layer.close(index)
											} 
										})
									}
									break
							}
							this.dialogCenter()
							this.drawTu()
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#0D1D4D;color:#ECECEC;";
			},
			ul_his(e) { //台站的历史数据统计
				let id = e.srcElement.id
				switch (id) {
					case 'tems':
						this.temperature = true
						this.visi = false
						this.wind_speed = false
						this.Rain_fall = false
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post("/line_data", {
								eid: this.eid,
								// 气温、路面温度、10cm路基温度
								column: ["at_at1", "rs_rst", "rs_ct10"]
							})
							.then(res => {
								this.historicalDatas = res.data.records
								this.$nextTick(() => {
									this.drawTu()
								})
							})
							.catch(e => {
								console.log(e)
							})
						break
					case 'vis':
						this.temperature = false
						this.visi = true
						this.wind_speed = false
						this.Rain_fall = false
						this.$ajax.post("/line_data", {
								eid: this.eid,
								// 能见度
								column: ["av_avg1mhv"]
							})
							.then(res => {
								this.VisiDatas = res.data.records[0].av_avg1mhv
								this.$nextTick(() => {
									this.drawVisi_Tu()
								})
							})
							.catch(e => {
								console.log(e)
							})
						break
					case 'wind_speed':
						this.temperature = false
						this.visi = false
						this.wind_speed = true
						this.Rain_fall = false
						this.$ajax.post("/line_data", {
								eid: this.eid,
								// 瞬时风速
								column: ["ws_iws1"]
							})
							.then(res => {
								this.windSpeed = res.data.records[0].ws_iws1
								this.$nextTick(() => {
									this.drawWind_Tu()
								})
							})
							.catch(e => {
								console.log(e)
							})
						break
					case 'rainFall':
						this.temperature = false
						this.visi = false
						this.wind_speed = false
						this.Rain_fall = true
						this.$ajax.post("/rain_fall_data", {
								eid: this.eid
							})
							.then(res => {
								this.Rain = res.data.records
								this.$nextTick(() => {
									this.drawRain()
								})
							})
							.catch(e => {
								console.log(e)
							})
						break
				}
			},
			cen_his(e) { //所有的数据统计
				let id = e.srcElement.id
				switch (id) {
					case 'data_sta':
						this.cen_sta = true
						this.disaster = false
						break
					default:
						this.cen_sta = false
						this.disaster = true
				}
			},
			initMapSocket() { //地图站点websocket
				let wsuri = "ws://121.36.193.217:10002/ws/statusWarningMonitor"
				this.wbst = new WebSocket(wsuri)
				this.wbst.onmessage = this.Mapsocketonmessage
				this.wbst.onopen = this.Mapsocketonopen
				this.wbst.onerror = this.Mapsocketonerror
			},
			Mapsocketonopen() { //地图websocket连接发送数据
				console.log('地图websocket连接成功')
				let username = {
					"username": this.$store.state.user_name,
				}
				this.wbst.send(JSON.stringify(username))
			},
			Mapsocketonmessage(e) { //地图websocket接收信息
				console.log('地图websocket收到信息')
				let message = e.data
				console.log(message)
			},
			Mapsocketonerror() { //地图websocket断开重连
				console.log('地图websocket断开')
				this.initMapWebSocket()
			},
			initWebSocket() { //实时数据初始化websocket
				let wsuri = "ws://121.36.193.217:10002/ws/websocket_connect"
				this.ws = new WebSocket(wsuri)
				this.ws.onmessage = this.websocketonmessage
				this.ws.onerror = this.websocketonerror
			},
			websocketonmessage(e) { //实时数据接收信息
				let re_msg = e.data
				if (re_msg.length == 20) {
					this.Tem = 0
					this.Hum = 0
					this.Sub = 0
					this.Road = 0
					this.Dire = 0
					this.Speed = 0
					this.lookTime = '该台站暂无数据'
					this.av_avg1mhv = 0
					this.pm = 0
					this.mntrnfl = 0
					this.rw_wft = 0
					this.rw_ift = 0
					this.rw_sft = 0
					this.rw_trs = '--'
					this.wetslipcoef = 0
				} else {
					let dict = JSON.parse(JSON.parse(re_msg))
					this.Tem = dict.at_at1
					this.Hum = dict.ah_rh1
					this.Sub = dict.rs_ct10
					this.Road = dict.rs_rst
					this.Dire = dict.wd_iwd
					this.Speed = dict.ws_iws1
					this.lookTime = moment((dict.obs_time) * 1000).format("MM月DD日 HH:mm:ss")
					this.av_avg1mhv = dict.av_avg1mhv
					this.pm = dict.pm25
					this.mntrnfl = dict.mntrnfl
					this.rw_wft = dict.rw_wft
					this.rw_ift = dict.rw_ift
					this.rw_sft = dict.rw_sft
					this.rw_trs = dict.rw_trs
					this.wetslipcoef = dict.wetslipcoef
				}
			},
			websocketonerror() { //断开重连
				this.initWebSocket()
			},
			selectStation(val) { //实时数据选择台站
				let old_eid = this.last_eid
				let eid = val.concat()
				this.opStation.find((Data) => {
					if (Data.eid == eid) {
						// 根据台站修改中心点
						this.map.setZoomAndCenter(13, [Data.longitude, Data.latitude]);
					}
				})
				this.eid = eid
				var messageObj = {
					"eid": eid,
					'last_eid': this.last_eid
				}
				this.last_eid = eid
				this.ws.send(JSON.stringify(messageObj))
			},
			time() {
				this.data = moment().format("YYYY年MM月DD日 dddd HH:mm:ss")
			},
			init() { // 地图
				this.map = new AMap.Map("container", {
					resizeEnable: true,
					pitchEnable: true,
					zoom: 9,
					pitch: 50,
					viewMode: '3D',
					// mapStyle: "amap://styles/85504a7fc589690aadd0fdb2d742dfca",
					mapStyle: "amap://styles/a2425e25c6fe2c4e890047477c3445ec",
					showBuildingBlock: true,
				});
				// this.z()
				// 添加控件
				this.addControls()
				this.addMarker()
				this.click_sign()
				this.info_window()
			},
			Mask() { //添加遮罩层
				let _this = this
				_this.map.remove(_this.polygon)
				let opts = {
					subdistrict: 0,
					extensions: 'all',
					level: 'city'
				}
				let district = new AMap.DistrictSearch(opts);
				district.search(_this.city_name, function(status, result) {
					var outer = [
						new AMap.LngLat(-360, 90, true),
						new AMap.LngLat(-360, -90, true),
						new AMap.LngLat(360, -90, true),
						new AMap.LngLat(360, 90, true),
					];
					var holes = result.districtList[0].boundaries
					var pathArray = [
						outer
					];
					pathArray.push.apply(pathArray, holes)
					_this.polygon = new AMap.Polygon({
						pathL: pathArray,
						strokeColor: '#00eeff',
						strokeWeight: 1,
						fillColor: '#71B3ff',
						fillOpacity: 0.5
					});
					_this.polygon.setPath(pathArray)
					_this.map.add(_this.polygon)
				})
			},
			info_window() { //地图弹窗内容
				for (let i = 0; i < this.titles.length; i++) {
					if (!this.titles[i].warning) {
						this.titles[i].warning = '地址：' + this.titles[i].address
					} else {
						this.titles[i].warning = '预警：' + this.titles[i].warning
					}
					let infoWindow = new AMap.InfoWindow({
						isCustom: true, //使用自定义窗体
						content: this.createInfoWindow(this.titles[i].station_name, this.titles[i].warning),
						// 弹窗位置
						offset: new AMap.Pixel(13, -43)
					});
					this.infoWindows.push(infoWindow)
					let infoYuan = new AMap.InfoWindow({
						isCustom: true, //使用自定义窗体
						content: this.createInfoYuan(),
						// 弹窗位置
						offset: new AMap.Pixel(13, -43)
					});
					this.infoYuans.push(infoYuan)
				}
			},
			addControls() { // 地图添加控件
				AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
					// 添加 3D 罗盘控制
					this.map.addControl(new AMap.ControlBar({
						position: {
							right: '5px',
							bottom: '4.5rem'
						},
						showZoomBar: false,
						showControlButton: true, // 是否显示倾斜、旋转按钮。默认为 true
					}));
					// 切换图层
					this.map.addControl(new BasicControl.LayerSwitcher({
						position: {
							right: '35px',
							bottom: '17rem'
						},
						theme: 'dark'
					}));
					// 缩放
					this.map.addControl(new BasicControl.Zoom({
						position: 'rb',
						theme: 'dark',
						showZoomNum: true
					}));
					// 比例尺
					this.map.addControl(new AMap.Scale({}));
				});
			},
			createInfoWindow(title, content) { //地图自定义窗口
				let info = document.createElement("div");
				info.className = "custom-info input-card content-window-card";

				//可以通过下面的方式修改自定义窗体的宽高
				info.style.width = "200px";
				// 定义顶部标题
				let top = document.createElement("div");
				let titleD = document.createElement("div");
				top.className = "info-top";
				titleD.innerHTML = title;

				top.appendChild(titleD);
				info.appendChild(top);

				// 定义中部内容
				let middle = document.createElement("div");
				middle.className = "info-middle";
				middle.style.backgroundColor = 'rgba(0,0,0,0.2)';
				middle.innerHTML = content;
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
			createInfoYuan() { //三个圆圈
				let info = document.createElement("div");
				// info.className = "yuan";
				// 定义中部内容
				let middle = document.createElement("div")
				info.className = "info-yuans"
				info.innerHTML = $("#info_ul")[0].innerHTML
				// info.appendChild(middle)
			
				return info;
			},
			gotoCity() { //地图去指定城市
				let val = this.city_name;
				if (!val) {
					this.$message({
						type: 'warning',
						message: '请输入县及其以上城市名'
					})
					this.map.remove(this.polygon)
					return
				}
				this.Mask()
				this.map.setCity(val);
			},
			leftData() { //实时数据
				layer.open({
					type: 1,
					title: '实时数据',
					area: ['370px', '763px'],
					offset: 'l',
					shade: false,
					resize: false,
					maxmin: true,
					anim: 2,
					content: $("#left_main"),
					cancel: function(index, layero) {
						layer.close(index)
					}
				})
			},
			drawTem() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.getElementById('temperature'));
				let TP_value = this.Tem
				let kd = []
				let Gradient = []
				let showValue = ''
				// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
				for (let i = 0, len = 135; i <= len; i++) {
					if (i < 10 || i > 130) {
						kd.push('')
					} else {
						if ((i - 10) % 20 === 0) {
							kd.push('-3');
						} else if ((i - 10) % 4 === 0) {
							kd.push('-1');
						} else {
							kd.push('');
						}
					}

				}
				//中间线的渐变色和文本内容
				if (TP_value > 20) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 0.5,
						color: '#E4D225'
					}, {
						offset: 1,
						color: '#E01F28'
					})
				} else if (TP_value > -20) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 1,
						color: '#E4D225'
					})
				} else {
					Gradient.push({
						offset: 1,
						color: '#93FE94'
					})
				}
				if (TP_value > 70) {
					showValue = 70
				} else {
					if (TP_value < -50) {
						showValue = -50
					} else {
						showValue = TP_value
					}
				}
				// 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
				let option = {
					// backgroundColor: '#062263',
					title: {
						text: '温度计',
						show: false
					},
					yAxis: [{
						show: false,
						data: [],
						min: 0,
						max: 135,
						axisLine: {
							show: false
						}
					}, {
						show: false,
						min: 0,
						max: 50,
					}],
					xAxis: [{
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -10,
						max: 12,
					}],
					series: [{
						name: '条',
						type: 'bar',
						// 对应上面XAxis的第一个对)象配置
						xAxisIndex: 0,
						data: [{
							value: (showValue + 60),
							label: {
								normal: {
									show: true,
									position: 'bottom',
									formatter: '{back|' + '气温:' + TP_value + '}{unit|°C}\n{downTxt|' + '}',
									rich: {
										back: {
											align: 'center',
											lineHeight: 50,
											fontSize: 14,
											fontFamily: 'digifacewide',
											color: 'white',
										},
										unit: {
											fontFamily: '微软雅黑',
											fontSize: 10,
											lineHeight: 50,
											color: 'white'
										},
									}
								}
							}
						}],
						barWidth: 10, //中间圆柱
						itemStyle: {
							normal: {
								barBorderRadius: 10,
								color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
							}
						},
						z: 2
					}, {
						name: '白框',
						type: 'bar',
						xAxisIndex: 1,
						barGap: '-100%',
						data: [134],
						barWidth: 13,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								barBorderRadius: 50,
							}
						},
						z: 1
					}, {
						name: '外框',
						type: 'bar',
						xAxisIndex: 2,
						barGap: '-100%',
						data: [135],
						barWidth: 15,
						itemStyle: {
							normal: {
								color: '#4577BA', //可修改
								barBorderRadius: 50,
							}
						},
						z: 0
					}, {
						name: '圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 0,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#93FE94', //可修改
								opacity: 1,
							}
						},
						z: 2
					}, {
						name: '白圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 1,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								opacity: 1,
							}
						},
						z: 1
					}, {
						name: '外圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 2,
						symbolSize: 23,
						itemStyle: {
							normal: {
								color: '#4577BA', //可以修改
								opacity: 1,
							}
						},
						z: 0
					}, {
						name: '刻度',
						type: 'bar',
						yAxisIndex: 0,
						xAxisIndex: 3,
						label: {
							normal: {
								show: true,
								position: 'left',
								distance: 5,
								color: 'white',
								fontSize: 10,
								formatter: function(params) {
									if (params.dataIndex > 130 || params.dataIndex < 10) {
										return '';
									} else {
										if ((params.dataIndex - 10) % 20 === 0) {
											return params.dataIndex - 60;
										} else {
											return '';
										}
									}
								}
							}
						},
						barGap: '-100%',
						data: kd,
						barWidth: 1,
						itemStyle: {
							normal: {
								color: 'white',
								barBorderRadius: 120,
								labelLine: '10',
								length: 10
							}
						},
						z: 0
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			},
			drawHum() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.getElementById('humidity'));
				let TP_value = this.Hum
				let kd = [];
				let Gradient = [];
				let showValue = '';
				// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
				for (let i = 0, len = 110; i <= len; i++) {
					if (i < 10 || i > 110) {
						kd.push('')
					} else {
						if ((i - 10) % 20 === 0) {
							kd.push('-3');
						} else if ((i - 10) % 4 === 0) {
							kd.push('-1');
						} else {
							kd.push('');
						}
					}

				}
				//中间线的渐变色和文本内容
				if (TP_value > 30) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 0.5,
						color: '#E4D225'
					}, {
						offset: 1,
						color: '#E01F28'
					})
				} else if (TP_value > 60) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 1,
						color: '#E4D225'
					})
				} else {
					Gradient.push({
						offset: 1,
						color: '#93FE94'
					})
				}
				if (TP_value > 100) {
					showValue = 100
				} else {
					if (TP_value <= 0) {
						showValue = -10
					} else {
						showValue = TP_value
					}
				}
				// 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
				let option = {
					// backgroundColor: '#062263',
					title: {
						text: '温度计',
						show: false
					},
					yAxis: [{
						show: false,
						data: [],
						min: 0,
						max: 115,
						axisLine: {
							show: false
						}
					}, {
						show: false,
						min: 0,
						max: 50,
					}],
					xAxis: [{
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -10,
						max: 12,
					}],
					series: [{
						name: '条',
						type: 'bar',
						// 对应上面XAxis的第一个对)象配置
						xAxisIndex: 0,
						data: [{
							value: (showValue + 10),
							label: {
								normal: {
									show: true,
									position: 'bottom',
									formatter: '{back|' + '湿度:' + TP_value + '}{unit|%}\n{downTxt|' + '}',
									rich: {
										back: {
											align: 'center',
											lineHeight: 50,
											fontSize: 14,
											fontFamily: 'digifacewide',
											color: 'white'
										},
										unit: {
											fontFamily: '微软雅黑',
											fontSize: 10,
											lineHeight: 50,
											color: 'white'
										},
									}
								}
							}
						}],
						barWidth: 10, //中间圆柱
						itemStyle: {
							normal: {
								barBorderRadius: 10,
								color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
							}
						},
						z: 2
					}, {
						name: '白框',
						type: 'bar',
						xAxisIndex: 1,
						barGap: '-100%',
						data: [134],
						barWidth: 13,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								barBorderRadius: 50,
							}
						},
						z: 1
					}, {
						name: '外框',
						type: 'bar',
						xAxisIndex: 2,
						barGap: '-100%',
						data: [135],
						barWidth: 15,
						itemStyle: {
							normal: {
								color: '#4577BA', //可修改
								barBorderRadius: 50,
							}
						},
						z: 0
					}, {
						name: '圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 0,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#93FE94', //可修改
								opacity: 1,
							}
						},
						z: 2
					}, {
						name: '白圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 1,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								opacity: 1,
							}
						},
						z: 1
					}, {
						name: '外圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 2,
						symbolSize: 23,
						itemStyle: {
							normal: {
								color: '#4577BA', //可以修改
								opacity: 1,
							}
						},
						z: 0
					}, {
						name: '刻度',
						type: 'bar',
						yAxisIndex: 0,
						xAxisIndex: 3,
						label: {
							normal: {
								show: true,
								position: 'left',
								distance: 5,
								color: 'white',
								fontSize: 10,
								formatter: function(params) {
									if (params.dataIndex > 110 || params.dataIndex < 10) {
										return '';
									} else {
										if ((params.dataIndex - 10) % 20 === 0) {
											return params.dataIndex - 10;
										} else {
											return '';
										}
									}
								}
							}
						},
						barGap: '-100%',
						data: kd,
						barWidth: 1,
						itemStyle: {
							normal: {
								color: 'white',
								barBorderRadius: 120,
								labelLine: '10',
								length: 10
							}
						},
						z: 0
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			},
			drawSub() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.getElementById('subgrade'));
				let TP_value = this.Sub
				let kd = [];
				let Gradient = [];
				let showValue = '';
				// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
				for (let i = 0, len = 135; i <= len; i++) {
					if (i < 10 || i > 130) {
						kd.push('')
					} else {
						if ((i - 10) % 20 === 0) {
							kd.push('-3');
						} else if ((i - 10) % 4 === 0) {
							kd.push('-1');
						} else {
							kd.push('');
						}
					}

				}
				//中间线的渐变色和文本内容
				if (TP_value > 20) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 0.5,
						color: '#E4D225'
					}, {
						offset: 1,
						color: '#E01F28'
					})
				} else if (TP_value > -20) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 1,
						color: '#E4D225'
					})
				} else {
					Gradient.push({
						offset: 1,
						color: '#93FE94'
					})
				}
				if (TP_value > 70) {
					showValue = 70
				} else {
					if (TP_value < -50) {
						showValue = -50
					} else {
						showValue = TP_value
					}
				}
				// 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
				let option = {
					// backgroundColor: '#062263',
					title: {
						text: '温度计',
						show: false
					},
					yAxis: [{
						show: false,
						data: [],
						min: 0,
						max: 135,
						axisLine: {
							show: false
						}
					}, {
						show: false,
						min: 0,
						max: 50,
					}],
					xAxis: [{
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -10,
						max: 12,
					}],
					series: [{
						name: '条',
						type: 'bar',
						// 对应上面XAxis的第一个对)象配置
						xAxisIndex: 0,
						data: [{
							value: (showValue + 60),
							label: {
								normal: {
									show: true,
									position: 'bottom',
									formatter: '{back|' + '路基:' + TP_value + '}{unit|°C}\n{downTxt|' + '}',
									rich: {
										back: {
											align: 'center',
											lineHeight: 50,
											fontSize: 14,
											fontFamily: 'digifacewide',
											color: 'white'
										},
										unit: {
											fontFamily: '微软雅黑',
											fontSize: 10,
											lineHeight: 50,
											color: 'white'
										},
									}
								}
							}
						}],
						barWidth: 10, //中间圆柱
						itemStyle: {
							normal: {
								barBorderRadius: 10,
								color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
							}
						},
						z: 2
					}, {
						name: '白框',
						type: 'bar',
						xAxisIndex: 1,
						barGap: '-100%',
						data: [134],
						barWidth: 13,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								barBorderRadius: 50,
							}
						},
						z: 1
					}, {
						name: '外框',
						type: 'bar',
						xAxisIndex: 2,
						barGap: '-100%',
						data: [135],
						barWidth: 15,
						itemStyle: {
							normal: {
								color: '#4577BA', //可修改
								barBorderRadius: 50,
							}
						},
						z: 0
					}, {
						name: '圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 0,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#93FE94', //可修改
								opacity: 1,
							}
						},
						z: 2
					}, {
						name: '白圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 1,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								opacity: 1,
							}
						},
						z: 1
					}, {
						name: '外圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 2,
						symbolSize: 23,
						itemStyle: {
							normal: {
								color: '#4577BA', //可以修改
								opacity: 1,
							}
						},
						z: 0
					}, {
						name: '刻度',
						type: 'bar',
						yAxisIndex: 0,
						xAxisIndex: 3,
						label: {
							normal: {
								show: true,
								position: 'left',
								distance: 5,
								color: 'white',
								fontSize: 10,
								formatter: function(params) {
									if (params.dataIndex > 130 || params.dataIndex < 10) {
										return '';
									} else {
										if ((params.dataIndex - 10) % 20 === 0) {
											return params.dataIndex - 60;
										} else {
											return '';
										}
									}
								}
							}
						},
						barGap: '-100%',
						data: kd,
						barWidth: 1,
						itemStyle: {
							normal: {
								color: 'white',
								barBorderRadius: 120,
								labelLine: '10',
								length: 10
							}
						},
						z: 0
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			},
			drawRoad() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.getElementById('road'));
				let TP_value = this.Road
				let kd = [];
				let Gradient = [];
				let showValue = '';
				// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
				for (let i = 0, len = 135; i <= len; i++) {
					if (i < 10 || i > 130) {
						kd.push('')
					} else {
						if ((i - 10) % 20 === 0) {
							kd.push('-3');
						} else if ((i - 10) % 4 === 0) {
							kd.push('-1');
						} else {
							kd.push('');
						}
					}

				}
				//中间线的渐变色和文本内容
				if (TP_value > 20) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 0.5,
						color: '#E4D225'
					}, {
						offset: 1,
						color: '#E01F28'
					})
				} else if (TP_value > -20) {
					Gradient.push({
						offset: 0,
						color: '#93FE94'
					}, {
						offset: 1,
						color: '#E4D225'
					})
				} else {
					Gradient.push({
						offset: 1,
						color: '#93FE94'
					})
				}
				if (TP_value > 70) {
					showValue = 70
				} else {
					if (TP_value < -50) {
						showValue = -50
					} else {
						showValue = TP_value
					}
				}
				// 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
				let option = {
					// backgroundColor: '#062263',
					title: {
						text: '温度计',
						show: false
					},
					yAxis: [{
						show: false,
						data: [],
						min: 0,
						max: 135,
						axisLine: {
							show: false
						}
					}, {
						show: false,
						min: 0,
						max: 50,
					}],
					xAxis: [{
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -110,
						max: 80,
						data: []
					}, {
						show: false,
						min: -10,
						max: 12,
					}],
					series: [{
						name: '条',
						type: 'bar',
						// 对应上面XAxis的第一个对)象配置
						xAxisIndex: 0,
						data: [{
							value: (showValue + 60),
							label: {
								normal: {
									show: true,
									position: 'bottom',
									formatter: '{back|' + '路面:' + TP_value + '}{unit|°C}\n{downTxt|' + '}',
									rich: {
										back: {
											align: 'center',
											lineHeight: 50,
											fontSize: 14,
											fontFamily: 'digifacewide',
											color: 'white'
										},
										unit: {
											fontFamily: '微软雅黑',
											fontSize: 10,
											lineHeight: 50,
											color: 'white'
										},
									}
								}
							}
						}],
						barWidth: 10, //中间圆柱
						itemStyle: {
							normal: {
								barBorderRadius: 10,
								color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
							}
						},
						z: 2
					}, {
						name: '白框',
						type: 'bar',
						xAxisIndex: 1,
						barGap: '-100%',
						data: [134],
						barWidth: 13,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								barBorderRadius: 50,
							}
						},
						z: 1
					}, {
						name: '外框',
						type: 'bar',
						xAxisIndex: 2,
						barGap: '-100%',
						data: [135],
						barWidth: 15,
						itemStyle: {
							normal: {
								color: '#4577BA', //可修改
								barBorderRadius: 50,
							}
						},
						z: 0
					}, {
						name: '圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 0,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#93FE94', //可修改
								opacity: 1,
							}
						},
						z: 2
					}, {
						name: '白圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 1,
						symbolSize: 18,
						itemStyle: {
							normal: {
								color: '#0C2E6D',
								opacity: 1,
							}
						},
						z: 1
					}, {
						name: '外圆',
						type: 'scatter',
						hoverAnimation: false,
						data: [0],
						xAxisIndex: 2,
						symbolSize: 23,
						itemStyle: {
							normal: {
								color: '#4577BA', //可以修改
								opacity: 1,
							}
						},
						z: 0
					}, {
						name: '刻度',
						type: 'bar',
						yAxisIndex: 0,
						xAxisIndex: 3,
						label: {
							normal: {
								show: true,
								position: 'left',
								distance: 5,
								color: 'white',
								fontSize: 10,
								formatter: function(params) {
									if (params.dataIndex > 130 || params.dataIndex < 10) {
										return '';
									} else {
										if ((params.dataIndex - 10) % 20 === 0) {
											return params.dataIndex - 60;
										} else {
											return '';
										}
									}
								}
							}
						},
						barGap: '-100%',
						data: kd,
						barWidth: 1,
						itemStyle: {
							normal: {
								color: 'white',
								barBorderRadius: 120,
								labelLine: '10',
								length: 10
							}
						},
						z: 0
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			},
			drawDire() {
				let myChart = echarts.init(document.getElementById('direction'));
				let val = this.Dire
				let Gradient = [{
					offset: 0,
					color: '#e100ff'
				}, {
					offset: 0.2,
					color: '#c700ff'
				}, {
					offset: 0.4,
					color: '#a400ff'
				}, {
					offset: 0.6,
					color: '#8b00ff'
				}, {
					offset: 0.8,
					color: '#8500ff'
				}, {
					offset: 1,
					color: '#7f00ff'
				}]
				let option = {
					// backgroundColor: 'rgba(6,34,99,0.1)',
					color: '#fff',
					tooltip: {
						show: false
					},
					grid: {
						left: '0%',
						right: '0%',
						bottom: '0%',
						top: '0%',
						containLabel: true,
						borderWidth: '0'
					},
					title: {
						text: "瞬时风向：" + val + '°',
						bottom: '0',
						left: 'center',
						textStyle: {
							fontSize: 12,
							color: '#fff'
						}
					},
					series: [{
							name: "最外部进度条",
							type: "gauge",
							radius: '90%',
							startAngle: '90',
							endAngle: '-269.999',
							splitNumber: 12,
							axisLine: {
								lineStyle: {
									color: [
										[val / 360, new echarts.graphic.LinearGradient(
											0, 1, 0, 0, [{
													offset: 1,
													color: 'rgba(140,27,255,0)',
												}, {
													offset: 0.5,
													color: 'rgba(140,27,255,0.2)',
												},
												{
													offset: 0,
													color: 'rgba(140,27,255,1)',
												}
											]
										)],
										[
											1, 'rgba(28,128,245,.0)'
										]
									],
									width: 5

								},
							},
							axisLabel: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							splitLine: {
								show: false,
							},
							itemStyle: {
								show: false,
							},
							detail: {
								show: false
							},
							title: { //标题
								show: false,
							},
							data: [{
								value: val,
							}],
							pointer: {
								show: false,
							},
							animationDuration: 4000,
						},
						{
							name: '瞬时风向',
							type: 'gauge',
							radius: '80%',
							startAngle: "90",
							endAngle: "-269.9",
							splitNumber: 12, // 分割段数
							z: 8,
							min: 0,
							max: 360,
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									color: [
										[1, 'yellow']
									],
									width: 0,
								},
							},
							pointer: { //指针
								show: false,
							},
							axisTick: { // 坐标轴小标记
								splitNumber: 5, // 每份split细分多少段
								length: 5, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: '#9a58ff',
									width: 1,
								}
							},
							axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
								formatter: function(v) {
									v = v.toFixed();
									switch (v + '') {
										case '0':
											return '0';
										case '90':
											return '90';
										case '180':
											return '180';
										case '270':
											return '270';
										case '360':
											return '0';
									}
								},
								textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'white',
									fontSize: 10,
								}
							},
							splitLine: { // 分隔线
								show: true, // 默认显示，属性show控制显示与否
								length: 8, // 属性length控制线长
								lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
									color: '#9a58ff',
									width: 2,
								}
							},
							detail: {
								show: false,
								textStyle: {
									fontSize: "14",
									color: 'white'
								}
							},
							title: {
								show: false,
							},
							data: [{
								value: val
							}]
						},
						{
							name: "内部阴影",
							type: "gauge",
							radius: '70%',
							startAngle: "90",
							endAngle: "-269.9",
							z: 4,
							splitNumber: 10,
							axisLine: {
								lineStyle: {
									color: [
										[val / 360, new echarts.graphic.LinearGradient(
											0, 1, 0, 0, Gradient
										)],
										[
											1, 'rgba(28,128,245,.0)'
										]
									],
									width: 40,
									opacity: 0.6
								}
							},
							axisLabel: {
								show: false,
							},
							axisTick: {
								show: false,

							},
							splitLine: {
								show: false,
							},
							itemStyle: {
								show: false,
							},
							detail: {
								formatter: function(value) {
									if (value !== 0) {
										return value + '°';
									} else {
										return 0 + '°';
									}
								},
								offsetCenter: [0, 5],
								textStyle: {
									padding: [0, 0, 5, 0],
									fontSize: 14,
									color: 'white'
								}
							},
							title: {
								show: false,
							},
							pointer: {
								show: false,
							},
							data: [{
								name: "title",
								value: val,
							}],
						},
						{
							name: '内部圆',
							type: "gauge",
							radius: "84%",
							startAngle: "90",
							endAngle: "-269.9",
							min: 0,
							max: 360,
							splitNumber: 12,
							pointer: { //指针
								show: true,
								width: 3,
								length: '80%',
							},
							detail: {
								show: false,
							},
							axisLine: {
								show: false,
								lineStyle: {
									color: [
										[1, "yellow"]
									],
									width: 2,
									opacity: 1,
								},
							},
							axisTick: {
								show: false,
							},
							splitLine: {
								show: false,

							},
							axisLabel: {
								show: false,
							},
							data: [{
								value: val,
							}],
						},
						{
							type: "gauge",
							radius: "82%",
							startAngle: "225",
							endAngle: "-134.99999",
							pointer: {
								show: true,
								color: 'red'
							},
							axisLine: {
								show: false,
								lineStyle: {
									color: 'white',
									width: 20,
									shadowOffsetX: 0,
									shadowOffsetY: 0,
									opacity: 1,
								},
							},
							axisTick: {
								show: false,
							},
							splitLine: {
								show: false,
								length: 25,
								lineStyle: {
									color: "white",
									width: 10,
									type: "solid",
								},
							},
							axisLabel: {
								show: false,
								formatter: function(v) {
									return v.toFixed(0);
								},
							},
							animationDuration: 4000,
						},
						{

							type: "gauge",
							z: 2,
							radius: "80%",
							startAngle: "225",
							endAngle: "-134.99999",
							axisLine: {
								// 坐标轴线
								lineStyle: {
									// 属性lineStyle控制线条样式
									color: [
										[1, "#9a58ff"]
									],
									fontSize: 40,
									width: 1,
									opacity: 1, //刻度背景宽度
								},
							},
							splitLine: {
								show: false,
							},
							axisLabel: {
								show: false,
								formatter: function(v) {
									return v.toFixed(0);
								},
							},
							pointer: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							detail: {
								show: false,
							},
						},
						{
							//指针上的圆
							type: 'pie',
							tooltip: {
								show: false
							},
							hoverAnimation: false,
							legendHoverLink: false,
							radius: ['0%', '25.5%'],
							center: ['50%', '50%'],
							label: {
								normal: {
									show: false
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: [{
								value: 120,
								itemStyle: {
									normal: {
										color: "#0053fb",
									},
								}
							}]
						},
					]
				};
				myChart.setOption(option);
			},
			drawSpeed() {
				let myChart = echarts.init(document.getElementById('speed'));
				let val = this.Speed
				let Gradient = [{
					offset: 1,
					color: '#e100ff'
				}, {
					offset: 0.8,
					color: '#c700ff'
				}, {
					offset: 0.6,
					color: '#a400ff'
				}, {
					offset: 0.4,
					color: '#8b00ff'
				}, {
					offset: 0.2,
					color: '#8500ff'
				}, {
					offset: 0,
					color: '#7f00ff'
				}]
				let option = {
					// backgroundColor: '#062263',
					color: '#fff',
					tooltip: {
						show: false
					},
					grid: {
						left: '0%',
						right: '0%',
						bottom: '0%',
						top: '0%',
						containLabel: true,
						borderWidth: '0'
					},
					title: {
						text: "瞬时风速：" + val + "m/s",
						bottom: '0',
						left: 'center',
						textStyle: {
							fontSize: 12,
							color: 'white'
						}
					},
					series: [{
							name: "最外部进度条",
							type: "gauge",
							radius: '90%',
							startAngle: '225',
							endAngle: '-45.999',
							splitNumber: 12,
							axisLine: {
								lineStyle: {
									color: [
										[val / 25, new echarts.graphic.LinearGradient(
											0, 1, 0, 0, [{
													offset: 0,
													color: 'rgba(140,27,255,0)',
												}, {
													offset: 0.5,
													color: 'rgba(140,27,255,0.2)',
												},
												{
													offset: 1,
													color: 'rgba(140,27,255,1)',
												}
											]
										)],
										[
											1, 'rgba(28,128,245,.0)'
										]
									],
									width: 5

								},
							},
							axisLabel: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							splitLine: {
								show: false,
							},
							itemStyle: {
								show: false,
							},
							detail: {
								show: false
							},
							title: { //标题
								show: false,
							},
							data: [{
								value: val,
							}],
							pointer: {
								show: false,
							},
							animationDuration: 4000,
						},
						{
							name: '瞬时风速',
							type: 'gauge',
							radius: '80%',
							startAngle: '225',
							endAngle: '-45.999',
							splitNumber: 5, // 分割段数
							z: 8,
							min: 0,
							max: 25,
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									color: [
										[1, 'red']
									],
									width: 0,
								},
							},
							pointer: { //指针
								show: false,
							},
							axisTick: { // 坐标轴小标记
								splitNumber: 5, // 每份split细分多少段
								length: 5, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: '#9a58ff',
									width: 1,
								}
							},
							axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
								formatter: function(v) {
									v = v.toFixed();
									switch (v + '') {
										case '0':
											return '0';
										case '5':
											return '5';
										case '10':
											return '10';
										case '15':
											return '15';
										case '20':
											return '20';
										case '25':
											return '25';
									}
								},
								textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
									color: 'white',
									fontSize: 10,
								}
							},
							splitLine: { // 分隔线
								show: true, // 默认显示，属性show控制显示与否
								length: 8, // 属性length控制线长
								lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
									color: '#9a58ff',
									width: 2,
								}
							},
							detail: {
								show: false,
								textStyle: {
									fontSize: "14",
									color: 'white'
								}
							},
							title: {
								show: false,
							},
							data: [{
								value: val
							}]
						},
						{
							name: "内部阴影",
							type: "gauge",
							radius: '70%',
							startAngle: "225",
							endAngle: "-45.999",
							z: 4,
							splitNumber: 5,
							axisLine: {
								lineStyle: {
									color: [
										[val / 25, new echarts.graphic.LinearGradient(
											0, 1, 0, 0, Gradient
										)],
										[
											1, 'rgba(28,128,245,.0)'
										]
									],
									width: 40,
									opacity: 0.6
								}
							},
							axisLabel: {
								show: false,
							},
							axisTick: {
								show: false,

							},
							splitLine: {
								show: false,
							},
							pointer: {
								show: false,
							},
							itemStyle: {
								show: false,
							},
							detail: {
								formatter: function(value) {
									if (value !== 0) {
										return value + 'm/s';
									} else {
										return 0 + 'm/s';
									}
								},
								offsetCenter: [0, 5],
								textStyle: {
									padding: [0, 0, 5, 0],
									fontSize: 14,
									color: 'white'
								}
							},
							title: {
								show: false,
							},
							data: [{
								name: "title",
								value: val,
							}],
						},
						{
							name: '内部圆-指针',
							type: "gauge",
							radius: "84%",
							startAngle: "225",
							endAngle: "-45.999",
							min: 0,
							max: 25,
							splitNumber: 5,
							pointer: { //指针
								show: true,
								width: 3,
								length: '80%',
							},
							detail: {
								show: false,
							},
							axisLine: {
								show: false,
								lineStyle: {
									color: [
										[1, "yellow"]
									],
									width: 2,
									opacity: 1,
								},
							},
							axisTick: {
								show: false,
							},
							splitLine: {
								show: false,

							},
							axisLabel: {
								show: false,
							},
							data: [{
								value: val,
							}],
						},
						{
							type: "gauge",
							radius: "82%",
							startAngle: "225",
							endAngle: "-134.99999",
							pointer: {
								show: false,
								color: 'red'
							},
							axisLine: {
								show: false,
								lineStyle: {
									color: 'white',
									width: 20,
									shadowOffsetX: 0,
									shadowOffsetY: 0,
									opacity: 1,
								},
							},
							axisTick: {
								show: false,
							},
							splitLine: {
								show: false,
								length: 25,
								lineStyle: {
									color: "white",
									width: 10,
									type: "solid",
								},
							},
							axisLabel: {
								show: false,
								formatter: function(v) {
									return v.toFixed(0);
								},
							},
							animationDuration: 4000,
						},
						{

							type: "gauge",
							z: 2,
							radius: "80%",
							startAngle: "225",
							endAngle: "-134.99999",
							axisLine: {
								// 坐标轴线
								lineStyle: {
									// 属性lineStyle控制线条样式
									color: [
										[1, "#9a58ff"]
									],
									fontSize: 40,
									width: 1,
									opacity: 1, //刻度背景宽度
								},
							},
							splitLine: {
								show: false,
							},
							axisLabel: {
								show: false,
								formatter: function(v) {
									return v.toFixed(0);
								},
							},
							pointer: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							detail: {
								show: false,
							},
						},
						{
							//指针上的圆
							type: 'pie',
							tooltip: {
								show: false
							},
							hoverAnimation: false,
							legendHoverLink: false,
							radius: ['0%', '25.5%'],
							center: ['50%', '50%'],
							label: {
								normal: {
									show: false
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: [{
								value: 120,
								itemStyle: {
									normal: {
										color: "#0053fb",
									},
								}
							}]
						},
					]
				};
				myChart.setOption(option);
			},
			drawTu() { //历史数据
				let myChart = echarts.init(document.getElementById('tu'))
				const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
				let at_rs = [...this.historicalDatas[0].at_at1[1], ...this.historicalDatas[1].rs_rst[1]]
				let max_tem = Math.max(...at_rs)
				let min_tem = Math.min(...at_rs)
				let max_rs_ct = Math.max(...this.historicalDatas[2].rs_ct10[1])
				let min_rs_ct = Math.min(...this.historicalDatas[2].rs_ct10[1])
				let option = {
					backgroundColor: 'rgba(255,255,255,0.1)',
					// backgroundColor:'rgba(13,29,77)',
					title: {
						text: '温度(单位：°C)',
						textStyle: {
							fontSize: 16,
							fontWeight: 400,
							color: '#ffffff'
						},
						left: 'center',
						top: '5%'
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
								width: 1
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
					xAxis: [{
						type: 'category',
						data: this.historicalDatas[0].at_at1[0],
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
								color: '#ffffff',
							},
							// 默认x轴字体大小
							fontSize: 12,
							// margin:文字到x轴的距离
							margin: 10
						},
						axisPointer: {
							label: {
								// padding: [11, 5, 7],
								padding: [0, 0, 2, 0],
								// 这里的margin和axisLabel的margin要一致!
								margin: 10,
								// 移入时的字体大小
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
										// offset: 0.9,
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
							// interval:2,
							min: Math.floor(min_tem) - 1,
							max: Math.ceil(max_tem) + 1,
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
									color: '#ffffff',
								}
							},
							splitLine: {
								show: false
							}
						},
						{
							type: 'value',
							// interval:1.5,
							min: Math.floor(min_rs_ct) - 1,
							max: Math.ceil(max_rs_ct) + 1,
							position: 'right',
							axisTick: {
								show: false
							},
							axisLabel: {
								textStyle: {
									color: '#ffffff',
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
						},
					],
					series: [{
							name: '气温',
							type: 'line',
							data: this.historicalDatas[0].at_at1[1],
							symbolSize: 1,
							symbol: 'circle',
							smooth: true,
							yAxisIndex: 0,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: '#9E87FF',
								shadowColor: 'rgba(158,135,255, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: '#9E87FF',
									borderColor: '#9E87FF'
								}
							}
						}, {
							name: '路面温度',
							type: 'line',
							data: this.historicalDatas[1].rs_rst[1],
							symbolSize: 1,
							symbol: 'circle',
							smooth: true,
							yAxisIndex: 0,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: '#73DDFF',
								shadowColor: 'rgba(115,221,255, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: colorList[1],
									borderColor: colorList[1]
								}
							}
						},
						{
							name: '10cm路基温度',
							type: 'line',
							data: this.historicalDatas[2].rs_ct10[1],
							symbolSize: 1,
							yAxisIndex: 1,
							symbol: 'circle',
							smooth: true,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: '#fe9a8b',
								shadowColor: 'rgba(254,154,139, 0.3)',
								shadowBlur: 10,
								shadowOffsetY: 20
							},
							itemStyle: {
								normal: {
									color: colorList[2],
									borderColor: colorList[2]
								}
							}
						}
					]
				};
				myChart.setOption(option);
			},
			drawVisi_Tu() { //能见度
				let myChart = echarts.init(document.getElementById('visi_tu'))
				let colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
				let max_visi = Math.max(...this.VisiDatas[1])
				let min_visi = Math.min(...this.VisiDatas[1])
				let option = {
					backgroundColor: 'rgba(255,255,255,0.1)',
					title: {
						text: '能见度(单位：m)',
						textStyle: {
							fontSize: 16,
							fontWeight: 400,
							color: '#ffffff'
						},
						left: 'center',
						top: '5%'
					},
					legend: {
						icon: 'circle',
						top: '5%',
						right: '5%',
						itemWidth: 6,
						itemGap: 20,
						textStyle: {
							color: '#ffffff',
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
							color: '#5c6c7c',
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
					xAxis: [{
						type: 'category',
						data: this.VisiDatas[0],
						axisLine: {
							lineStyle: {
								color: '#DCE2E8'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							// 修改步长
							interval: 'auto',
							textStyle: {
								color: '#ffffff',
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
						min: min_visi - 300,
						max: max_visi + 300,
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
								color: '#ffffff',
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
								color: '#ffffff',
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
					series: [{
						name: '能见度',
						type: 'line',
						data: this.VisiDatas[1],
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
			},
			drawWind_Tu() { //瞬时风速
				let myChart = echarts.init(document.getElementById('wind_tu'))
				let colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
				let option = {
					backgroundColor: 'rgba(255,255,255,0.1)',
					title: {
						text: '瞬时风速:(单位：m/s)',
						textStyle: {
							fontSize: 16,
							fontWeight: 400,
							color: '#ffffff'
						},
						left: 'center',
						top: '5%'
					},
					legend: {
						icon: 'circle',
						top: '5%',
						right: '5%',
						itemWidth: 6,
						itemGap: 20,
						textStyle: {
							color: '#ffffff',
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
							color: '#5c6c7c',
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
					xAxis: [{
						type: 'category',
						data: this.windSpeed[0],
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
								color: '#ffffff',
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
								color: '#ffffff',
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
								color: '#ffffff',
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
					series: [{
						name: '瞬时风速',
						type: 'line',
						data: this.windSpeed[1],
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
			},
			equip() { //台站数据
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/equip_all_info', {
						e_code: ''
					})
					.then(res => {
						// console.log(res.data)
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let equip_all = res.data.records
						for (let i = 0; i < equip_all.length; i++) {
							if (equip_all[i].e_code == '0101') {
								this.opStation.push(equip_all[i])
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			quoteRate() {
				layer.open({
					type: 1,
					title: ['到报率统计',
						'font-size:18px;display:flex;background-color: rgba(6, 34, 99, 0.1);color:white;border-bottom:none;'
					],
					area: '800px',
					offset: '80px',
					shade: false,
					resize: false,
					anim: 1,
					maxmin: true,
					content: $("#quoteRate"),
				})
			},
			historicalData() {
				layer.open({
					type: 1,
					title: ['历史数据',
						'font-size:18px;display:flex;background-color: rgba(6, 34, 99, 0.1);color:white;border-bottom:none;'
					],
					area: '800px',
					offset: 'r',
					shade: false,
					resize: false,
					anim: 2,
					maxmin: true,
					content: $("#historicalData"),
				})
			},
			resolution() { //适应分辨率
				// 电脑分辨率
				let width = screen.width
				let tu = document.querySelectorAll("#tu")
				let header_main = document.querySelectorAll(".header_main")
				let span = document.querySelectorAll("#span_2")
				let header = document.querySelectorAll(".header")
				let bg = document.querySelectorAll(".bg")
				let header_div = document.getElementsByClassName('header_div')
				switch (width) {
					case 1680:
						this.rightData = () => {
							this.drawFinsh()
							layer.open({
								type: 1,
								title: '预警信息',
								area: ['360px', '753px'],
								offset: ['70px', '73%'],
								shade: false,
								resize: false,
								maxmin: true,
								anim: 2,
								content: $("#right_main"),
							})
						}
						break
					case 1600:
						span[1].style.paddingTop = '25px'
						span[1].style.fontSize = '33px'
						span[1].style.marginRight = '150px'
						this.rightData = () => {
							this.drawFinsh()
							layer.open({
								type: 1,
								title: '预警信息',
								area: ['360px', '753px'],
								offset: ['0px', '72%'],
								shade: false,
								resize: false,
								maxmin: true,
								anim: 2,
								content: $("#right_main"),
							})
						}
						break
					case 1440:
						header_div[0].style.paddingTop = '3px'
						header[0].style.height = '60px'
						bg[0].style.height = '60px'
						bg[0].style.backgroundSize = '100% 65px'
						span[1].style.paddingTop = '8px'
						span[1].style.fontSize = '30px'
						span[1].style.marginRight = '130px'
						this.rightData = () => {
							this.drawFinsh()
							layer.open({
								type: 1,
								title: '预警信息',
								area: ['360px', '753px'],
								offset: ['0px', '69%'],
								shade: false,
								resize: false,
								maxmin: true,
								anim: 2,
								content: $("#right_main"),
							})
						}
						break
					case 1400:
						header_div[0].style.paddingTop = '3px'
						header[0].style.height = '60px'
						bg[0].style.height = '60px'
						bg[0].style.backgroundSize = '100% 65px'
						span[1].style.paddingTop = '8px'
						span[1].style.fontSize = '30px'
						span[1].style.marginRight = '130px'
						this.rightData = () => {
							this.drawFinsh()
							layer.open({
								type: 1,
								title: '预警信息',
								area: ['360px', '753px'],
								offset: ['70px', '68%'],
								shade: false,
								resize: false,
								maxmin: true,
								anim: 2,
								content: $("#right_main"),
							})
						}
						break
					case 1366:
						header_div[0].style.paddingTop = '3px'
						map[0].style.height = height + 20 + 'px'
						header[0].style.height = '60px'
						bg[0].style.height = '60px'
						span[1].style.fontSize = '28px'
						span[1].style.marginRight = '130px'
						bg[0].style.backgroundSize = '100% 65px'
						this.rightData = () => {
							this.drawFinsh()
							layer.open({
								type: 1,
								title: '预警信息',
								area: ['360px', '753px'],
								offset: ['0px', '70%'],
								shade: false,
								resize: false,
								maxmin: true,
								anim: 2,
								content: $("#right_main"),
							})
						}
						break
				}
			},
			exit() { //退出
				this.$message({
					type: 'success',
					message: '退出成功！',
					showClose: true
				})
				localStorage.removeItem('token')
				localStorage.removeItem('user_name')
				this.$router.push('/')
			},
			tips() {
				layer.tips('实时刷新数据', '.el-icon-refresh', {
					tips: [1, '#0FA6D8'], //还可配置颜色
					time: 1000
				});
			},
			drawRain() { //降雨
				let myChart = echarts.init(document.getElementById('Rain_tu'))
				let option = {
					backgroundColor: 'rgba(255,255,255,0.1)',
					title: {
						text: '雨量统计图',
						textStyle: {
							fontSize: 16,
							fontWeight: 400,
							color: '#ffffff',
						},
						left: 'center',
						top: '3%'
					},
					grid: {
						bottom: 80
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							animation: false,
							label: {
								backgroundColor: '#505765'
							}
						},
						backgroundColor: '#ffffff',
						textStyle: {
							color: '#505765',
						},
					},
					legend: {
						data: ['路面积水时间', '降雨量'],
						textStyle: {
							color: '#ffffff',
						},
						right: '15%',
						top: 20
					},
					dataZoom: [{
							show: true,
							realtime: true,
							start: 65,
							end: 85
						},
						{
							type: 'inside',
							realtime: true,
							start: 65,
							end: 85
						}
					],
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisLine: {
							onZero: false,
							color: '#ffffff'
						},
						axisLabel: {
							textStyle: {
								color: '#ffffff',
								fontSize: 12
							}
						},
						data: (this.Rain.time).map(function(str) {
							return str.replace(' ', '\n');
						})
					}],
					yAxis: [{
							name: '路面积水时间(min)',
							type: 'value',
							max: 60,
							axisLine: {
								show: true,
								lineStyle: {
									color: '#DCE2E8'
								}
							},
							axisLabel: {
								textStyle: {
									color: '#ffffff',
									fontSize: 12
								}
							},
						},
						{
							name: '降雨量(mm)',
							nameLocation: 'start',
							max: 6,
							type: 'value',
							axisLine: {
								show: true,
								lineStyle: {
									color: '#DCE2E8'
								}
							},
							axisLabel: {
								textStyle: {
									color: '#ffffff',
									fontSize: 12
								}
							},
							inverse: true
						}
					],
					series: [{
							name: '路面积水时间',
							type: 'line',
							animation: false,
							areaStyle: {},
							lineStyle: {
								width: 1
							},
							markArea: {
								silent: true,
								data: [
									[{
										xAxis: '2009/9/12\n7:00'
									}, {
										xAxis: '2009/9/22\n7:00'
									}]
								]
							},
							data: this.Rain.rain
						},
						{
							name: '降雨量',
							type: 'line',
							yAxisIndex: 1,
							animation: false,
							areaStyle: {},
							lineStyle: {
								width: 1
							},
							markArea: {
								silent: true,
								data: [
									[{
										xAxis: '2009/9/10\n7:00'
									}, {
										xAxis: '2009/9/20\n7:00'
									}]
								]
							},
							data: this.Rain.road
						}
					]
				};

				myChart.setOption(option)
			},
			live_data() { //实时数据的手动刷新
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/get_live_data", {
						eid: this.eid
					})
					.then(res => {
						let dict = res.data
						this.Tem = dict.at_at1
						this.Hum = dict.ah_rh1
						this.Sub = dict.rs_ct10
						this.Road = dict.rs_rst
						this.Dire = dict.wd_iwd
						this.Speed = dict.ws_iws1
						this.lookTime = moment((dict.obs_time) * 1000).format("MM月DD日 HH:mm:ss")
						this.av_avg1mhv = dict.av_avg1mhv
						this.pm = dict.pm25
						this.mntrnfl = dict.mntrnfl
						this.rw_wft = dict.rw_wft
						this.rw_ift = dict.rw_ift
						this.rw_sft = dict.rw_sft
						this.rw_trs = dict.rw_trs
						this.wetslipcoef = dict.wetslipcoef
					})
					.catch(e => {
						console.log(e)
					})
			},
			rightData() { //预警信息
				this.drawFinsh()
				layer.open({
					type: 1,
					title: '预警信息',
					area: ['360px', '753px'],
					offset: ['90px', '76.4%'],
					shade: false,
					resize: false,
					maxmin: true,
					anim: 2,
					content: $("#right_main"),
				})
			},
			dialogCenter() { //台站数据统计
				let _this = this
				layer.open({
					type: 1,
					title: this.station_name,
					area: ['1500px', '580px'],
					shade: false,
					resize: false,
					maxmin: true,
					anim: 2,
					content: $("#dia_station"),
					cancel: function(index, layero){
						_this.temperature = true
						_this.visi = false
						_this.wind_speed = false
						_this.Rain_fall = false
					    layer.close(index)
					} 
				})
			},
			drawFinsh() {
				let myChart = echarts.init(document.getElementById('finsh'))
				let option = {
					title: {
						text: '预警数量',
						show: false,
						textStyle: {
							color: '#fff',
						}
					},
					legend: {
						orient: 'vertical',
						show: true,
						right: '3%',
						y: 'center',
						itemWidth: 3,
						itemHeight: 30,
						itemGap: 20,
						textStyle: {
							color: '#ffffff',
							fontSize: 12,
							lineHeight: 15,
							rich: {
								percent: {
									color: '#fff',
									fontSize: 14,
								},
							},
						},
						formatter: name => {
							switch (name) {
								case '大风预警':
									return (
										'大风预警\r\n{percent|' + (this.events_num == 0 ? 0 : Math.round((this._speed / this.events_num) * 10000) /
											100) + '%} ' +
										' ' + this._speed
									);
								case '高温预警':
									return (
										'高温预警\r\n{percent|' + (this.events_num == 0 ? 0 : Math.round((this._tem / this.events_num) * 10000) / 100) +
										'%} ' +
										' ' + this._tem
									);
								case '能见度预警':
									return (
										'能见度预警\r\n{percent|' + (this.events_num == 0 ? 0 : Math.round((this._avg / this.events_num) * 10000) / 100) +
										'%} ' +
										' ' + this._avg
									);
								case '路面状况预警':
									return (
										'路面状况预警\r\n{percent|' + (this.events_num == 0 ? 0 : Math.round((this._road / this.events_num) * 10000) /
											100) + '%} ' +
										' ' + this._road
									);
								case '降雨预警':
									return (
										'降雨预警\r\n{percent|' + (this.events_num == 0 ? 0 : Math.round((this._rain / this.events_num) * 10000) / 100) +
										'%} ' +
										' ' + this._rain
									);
								default:
									break;
							}
						},
					},
					tooltip: {
						show: true,
					},
					series: [{
							type: 'pie',
							radius: ['65%', '75%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							z: 10,
							label: {
								position: 'center',
								formatter: () => {
									return '事件总数\r\n{total|' + this.events_num + '} 个';
								},
								rich: {
									total: {
										fontSize: 30,
										color: '#fff',
									},
								},
								color: '#ffffff',
								fontSize: 16,
								lineHeight: 30,
							},
							data: [{
									value: this._speed,
									name: '大风预警',
									itemStyle: {
										color: '#0286ff',
									},
								},
								{
									value: this._tem,
									name: '高温预警',
									itemStyle: {
										color: '#ffd302',
									},
								},
								{
									value: this._avg,
									name: '能见度预警',
									itemStyle: {
										color: '#fb5274',
									},
								},
								{
									value: this._road,
									name: '路面状况预警',
									itemStyle: {
										color: '#0ABFBC',
									},
								},
								{
									value: this._rain,
									name: '降雨预警',
									itemStyle: {
										color: '#0f9b0f',
									},
								}
							],
							labelLine: {
								show: false,
							},
						},
						{
							type: 'pie',
							radius: ['54%', '64%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							label: {
								show: false,
							},
							data: [{
									value: this._speed,
									name: '大风预警',
									itemStyle: {
										color: '#0286ff',
										opacity: 0.4,
									},
								},
								{
									value: this._tem,
									name: '高温预警',
									itemStyle: {
										color: '#ffd302',
										opacity: 0.4,
									},
								},
								{
									value: this._avg,
									name: '能见度预警',
									itemStyle: {
										color: '#fb5274',
										opacity: 0.4,
									},
								},
								{
									value: this._road,
									name: '路面状况预警',
									itemStyle: {
										color: '#0ABFBC',
										opacity: 0.4,
									},
								},
								{
									value: this._rain,
									name: '降雨预警',
									itemStyle: {
										color: '#0f9b0f',
										opacity: 0.4,
									},
								},
							],
							labelLine: {
								show: false,
							},
						},
						{
							type: 'pie',
							radius: ['43%', '53%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							label: {
								show: false,
							},
							data: [{
									value: this._speed,
									name: '大风预警',
									itemStyle: {
										color: '#0286ff',
										opacity: 0.1,
									},
								},
								{
									value: this._tem,
									name: '高温预警',
									itemStyle: {
										color: '#ffd302',
										opacity: 0.1,
									},
								},
								{
									value: this._avg,
									name: '能见度预警',
									itemStyle: {
										color: '#fb5274',
										opacity: 0.1,
									},
								},
								{
									value: this._road,
									name: '路面状况预警',
									itemStyle: {
										color: '#0ABFBC',
										opacity: 0.4,
									},
								},
								{
									value: this._rain,
									name: '降雨预警',
									itemStyle: {
										color: '#0f9b0f',
										opacity: 0.4,
									},
								},
							],
							labelLine: {
								show: false,
							},
						},
						{
							type: 'pie',
							radius: ['32%', '42%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							label: {
								show: false,
							},
							data: [{
									value: this._speed,
									name: '大风预警',
									itemStyle: {
										color: '#0286ff',
										opacity: 0.1,
									},
								},
								{
									value: this._tem,
									name: '高温预警',
									itemStyle: {
										color: '#ffd302',
										opacity: 0.1,
									},
								},
								{
									value: this._avg,
									name: '能见度预警',
									itemStyle: {
										color: '#fb5274',
										opacity: 0.1,
									},
								},
								{
									value: this._road,
									name: '路面状况预警',
									itemStyle: {
										color: '#0ABFBC',
										opacity: 0.4,
									},
								},
								{
									value: this._rain,
									name: '降雨预警',
									itemStyle: {
										color: '#0f9b0f',
										opacity: 0.4,
									},
								},
							],
							labelLine: {
								show: false,
							},
						},
						{
							type: 'pie',
							radius: ['21%', '31%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							label: {
								show: false,
							},
							data: [{
									value: this._speed,
									name: '大风预警',
									itemStyle: {
										color: '#0286ff',
										opacity: 0.1,
									},
								},
								{
									value: this._tem,
									name: '高温预警',
									itemStyle: {
										color: '#ffd302',
										opacity: 0.1,
									},
								},
								{
									value: this._avg,
									name: '能见度预警',
									itemStyle: {
										color: '#fb5274',
										opacity: 0.1,
									},
								},
								{
									value: this._road,
									name: '路面状况预警',
									itemStyle: {
										color: '#0ABFBC',
										opacity: 0.4,
									},
								},
								{
									value: this._rain,
									name: '降雨预警',
									itemStyle: {
										color: '#0f9b0f',
										opacity: 0.4,
									},
								},
							],
							labelLine: {
								show: false,
							},
						},
					],
				};
				myChart.setOption(option)
			},
			getWarning() { //获取预警事件数量
				this.$ajax.post('get_warning')
					.then(res => {
						// console.log(res.data.records)
						this.tableData = res.data.records.records
						this.events_num = res.data.records.total
						let count = res.data.records.count
						this._speed = count["大风预警"]
						this._tem = count["高温预警"], //高温预警
							this._avg = count["能见度预警"], //能见度预警
							this._rain = count["降雨预警"], //降雨预警
							this._road = count["路面状况预警"] //路面状况预警
					})
					.catch(e => {
						console.log(e)
					})
			},
			mapSize() { //地图根据浏览器窗口变化而变化
				let mapHeight = document.getElementById("container")
				let screenHeight = 0
				// 电脑分辨率
				let width = screen.width
				switch (width) {
					case 1440:
					case 1400:
					case 1366:
						// 浏览器高度
						screenHeight = document.body.clientHeight - 60
						window.onresize = () => {
							let Height = document.body.clientHeight - 60
							mapHeight.style.height = Height + 'px'
						}
						break
					default:
						// 浏览器高度
						screenHeight = document.body.clientHeight - 80
						window.onresize = () => {
							let Height = document.body.clientHeight - 80
							mapHeight.style.height = Height + 'px'
						}
						break
				}
				mapHeight.style.height = screenHeight + 'px'
			},
			centerEqu() { //设备监控
				let _this = this
				_this.equiment = true
				_this.$nextTick(() => {
					_this.drawEquipment()
					_this.drawProbability()
					layer.open({
						type: 1,
						title: '设备监控',
						area: ['50vw', '700px'],
						shade: false,
						resize: false,
						maxmin: true,
						anim: 2,
						content: $("#layer_equipment"),
						cancel: function(index, layero) {
							_this.equiment = false
							layer.close(index)
						}
					})
				})
			},
			drawEquipment() {
				let myChart = echarts.init(document.getElementById('draw_equipment'))
				let option = {
					title: {
						text: '设备监控',
						textStyle: {
							color: '#fff',
						},
						show: false
					},
					legend: {
						orient: 'vertical',
						show: true,
						right: '10%',
						y: 'center',
						itemWidth: 3,
						itemHeight: 30,
						itemGap: 20,
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
						formatter: name => {
							switch (name) {
								case '在线':
									return (
										'在线\r\n{percent|' + (this.online == 0 ? 0 : Math.round((this.online / this.line) * 10000) /
											100) + '%} ' +
										' ' + this.online
									);
								case '离线':
									return (
										'离线\r\n{percent|' + (this.offline == 0 ? 0 : Math.round((this.offline / this.line) * 10000) /
											100) + '%} ' +
										' ' + this.offline
									);
								default:
									break;
							}
						},
					},
					tooltip: {
						show: true,
					},
					series: [{
							type: 'pie',
							radius: ['65%', '75%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							z: 10,
							label: {
								position: 'center',
								formatter: () => {
									return '设备总数\r\n{total|' + this.line + '} 个';
								},
								rich: {
									total: {
										fontSize: 30,
										color: '#fff',
									},
								},
								color: '#ffffff',
								fontSize: 16,
								lineHeight: 30,
							},
							data: [{
									value: this.online,
									name: '在线',
									itemStyle: {
										color: '#38ef7d',
									},
								},
								{
									value: this.offline,
									name: '离线',
									itemStyle: {
										color: '#ADA996',
									},
								},
							],
							labelLine: {
								show: false,
							},
						},
						{
							type: 'pie',
							radius: ['54%', '64%'],
							center: ['40%', '50%'],
							hoverAnimation: false,
							label: {
								show: false,
							},
							data: [{
									value: this.online,
									name: '在线',
									itemStyle: {
										color: '#38ef7d',
										opacity: 0.4,
									},
								},
								{
									value: this.offline,
									name: '离线',
									itemStyle: {
										color: '#ADA996',
										opacity: 0.4,
									},
								},
							],
							labelLine: {
								show: false,
							},
						},
					],
				};
				myChart.setOption(option)
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
						for (let i = 0; i < res.data.records.length; i++) {
							switch (res.data.records[i].status) {
								case 0:
									this.offline += 1
									break
								default:
									this.online += 1
									break
							}
						}
						this.line = this.offline + this.online
					})
					.catch(e => {
						console.log(e)
					})
			},
			success_rate() { //在/离线状态
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/get_success_rate")
					.then(res => {
						this.rate = res.data.rate_list
						this.head = res.data.station_list
					})
					.catch(e => {
						console.log(e)
					})
			},
			centerSta() { //数据统计
				let _this = this
				_this.drawDis()
				_this.draw_more()
				layer.open({
					type: 1,
					title: '数据统计',
					area: ['70vw', '700px'],
					shade: false,
					resize: false,
					maxmin: true,
					anim: 2,
					content: $("#cen_sta"),
					cancel: function(index, layero) {
						layer.close(index)
						_this.disaster = false
						_this.cen_sta = true
					}
				})
			},
			drawDis() {//灾害种类饼状图
				let myChart = echarts.init(document.getElementById('draw_dis'));
				let color = ['#ff4343', '#f69846', '#f6d54a', '#45dbf7', '#f69846', '#44aff0', '#4777f5', '#5045f6', '#ad46f3',
					'#f845f1'
				];
				let names = ["能见度", "大风", "降雨", "高温", "路面状况", "其他"];
				let data = [1114, 444, 501, 460, 478, 431]
				let list = []
				let total = 0
				for (let i in data) {
					total += data[i]
				}

				let placeHolderStyle = {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0
					}
				};

				let rich = {
					white: {
						align: 'center',
						padding: [3, 0]
					}
				};

				for (let i in data) {
					list.push({
						value: data[i],
						name: names[i],
						itemStyle: {
							normal: {
								borderWidth: 30,
								shadowBlur: 10,
								borderColor: color[i],
								shadowColor: color[i],
								color: color[i]
							}
						}
					}, {
						value: total / 30,
						name: '',
						itemStyle: placeHolderStyle
					})
				}

				let func = (params) => {
					let percent = ((params.value / total) * 100).toFixed(1)
					let name = params.name.replace(/\n/g, '')
					if (params.name !== '') {
						return name + '\n{white|' + percent + '%}'
					} else {
						return ''
					}
				}
				let option = {
					tooltip: {
						show: false
					},
					legend: {
						orient: 'vertical',
						data: names,
						icon: 'circle',
						right: '5px',
						top: '10px',
						textStyle: {
							color: '#fff',
							fontSize: 16
						}
					},
					series: [{
							name: '',
							type: 'pie',
							clockWise: false,
							startAngle: '90',
							center: ['50%', '50%'],
							radius: ['90%', '91%'],
							hoverAnimation: false,
							itemStyle: {
								normal: {
									label: {
										show: true,
										position: 'outside',
										formatter: func,
										rich: rich,
										textStyle: {
											fontSize: 16
										}
									},
									labelLine: {
										length: 40,
										length2: 100,
										show: true,
										color: '#00ffff'
									}
								}
							},
							data: list,
							animationType: 'scale',
							animationEasing: 'elasticOut',
							animationDelay: function(idx) {
								return idx * 50;
							}
						},
						{
							name: '',
							type: 'pie',
							center: ['50%', '50%'],
							radius: ['49%', '49%'],
							itemStyle: {
								color: 'transparant'
							},
							startAngle: '90',
							data: [{
								value: total,
								name: '',
								label: {
									normal: {
										show: true,
										formatter: '{c|{c}} {b|条记录}',
										rich: {
											c: {
												color: '#ffffff',
												fontSize: 50,
												fontWeight: 'bold',
												lineHeight: 5
											},
											b: {
												color: '#ffffff',
												fontSize: 35,
												lineHeight: 5
											}
										},
										textStyle: {
											fontSize: 28,
											fontWeight: 'bold'
										},
										position: 'center'
									}
								}
							}]
						}
					]
				};
				myChart.setOption(option)
			},
			drawProbability() {//到报率树状图
				let myChart = echarts.init(document.getElementById('draw_probability'))
				let color = ['rgba(248,195,248', 'rgba(100,255,249', 'rgba(135,183,255', 'rgba(248,195,248', 'rgba(100,255,249']
				let station_name = this.head
				let datas = this.rate
				let option = {
					yAxis: {
						type: 'category',
						axisLine: {
							show: false //坐标线
						},
						axisTick: {
							show: false //小横线
						},
						axisLabel: {
							color: '#ffffff' //坐标轴字颜色
						},
						data: station_name,
					},

					xAxis: {
						show: false,
					},
					grid: {
						top: '40',
						right: '50',
						left: '150',
						bottom: '40' //图表尺寸大小
					},
					series: [{
						data: datas,
						type: 'bar',
						barWidth: '15px',
						showBackground: true,
						backgroundStyle: {
							color: 'rgba(220, 220, 220, 0.4)',
							barBorderRadius: [30, 30, 30, 30] //圆角大小
						},
						label: {
							normal: {
								show: true,
								position: 'right' ,//每一条的数据位置
								color:'#ffffff',
								formatter: function(param) {
									var dd = datas;
									return +dd[param.dataIndex] + '%';
								},
							}
						},
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
									{
										offset: 1,
										color: '#93FE94'
									},
									{
										offset: 0.5,
										color: '#E4D225'
									},{
										offset: 0,
										color: '#FF4B2B'
									}
								]),
								barBorderRadius: [30, 30, 30, 30], //圆角大小
								shadowBlur: 10,
								shadowColor: 'rgba(0, 103, 255, 0.2)',
								shadowOffsetX: -5,
								shadowOffsetY: 5,

							},
						},
					}]
				};
				myChart.setOption(option)
			},
			draw_more(){//日月季年数据查询
				let myChart = echarts.init(document.getElementById('draw_datas'))
				let DateSource = ['北京', '上海', '广州', '深圳', '香港', '澳门', '台湾']
				let Datas = [10, 10, 30, 12, 15, 3, 7]
				let option = {
					title: {
						text: '全国6月销售统计',
						textStyle: {
							fontSize: 12,
							fontWeight: 400
						},
						left: 'center',
						top: '5%',
						show:false
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
						data: DateSource,
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
								color: '#fff'
							},
							fontSize: 12,
							margin: 15
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
								color: '#fff'
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
								color: '#fff'
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
					series: [{
							name: 'Adidas',
							type: 'line',
							data: Datas,
							symbolSize: 1,
							symbol: 'circle',
							smooth: true,
							yAxisIndex: 0,
							showSymbol: false,
							lineStyle: {
								width: 5,
								color: '#9E87FF',
							},
							itemStyle: {
								normal: {
									color: '#9E87FF',
									borderColor: '#9E87FF'
								}
							}
						}
					]
				};
				myChart.setOption(option);
			},
		},
		mounted() {
			this.resolution()
			this.success_rate()
			this.status()
			this.timer = setInterval(this.time, 1000)
			this.equip()
			this.map_data()
			this.getWarning()
			this.drawTem()
			this.drawHum()
			this.drawSub()
			this.drawRoad()
			this.drawDire()
			this.drawSpeed()
			this.initWebSocket()
			this.rightData()
			this.mapSize()
			this.info_uls()
		},
		beforeDestroy() {
			clearInterval(this.timer)
			layer.closeAll()
			this.map.destroy()
			this.map = null
		}
	}
</script>
<style>
	@import url("../../static/css/copy_waring_public.css");
</style>
<style scoped>
	@import url("../../static/css/copy_waring.css");

	.cen_center {
		display: grid;
		grid-template-columns: 200px 1fr;
	}

	.cen_center .cen_left {
		height: 500px;
	}

	.cen_center .cen_left .el-button {
		margin-top: 20px;
	}

	.cen_center .cen_right {
		height: 500px;
		display: grid;
		place-items: start;
	}
</style>
