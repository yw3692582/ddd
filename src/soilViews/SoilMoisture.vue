<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>墒情展示</span>
		</div>
		<hr color="#04476e" />
		<div class="center">
			<span class="demonstration">发布时间：</span>
			<!-- <el-date-picker v-model="times" value-format="timestamp" type="date" placeholder="选择日期">
			</el-date-picker> -->
			<el-date-picker v-model="times" value-format="timestamp" type="datetime" placeholder="选择日期时间">
			</el-date-picker>
			<el-button icon="el-icon-search" @click='Inquire'>查询</el-button>
		</div>
		<br />
		<div style="width: 80vw;" v-if="show">
			<span style="color: white;">20CM墒情展示</span>
			<div id="20cmMap" style="height: 80vh;"></div>
		</div>
		<br />
		<div style="width: 80vw;" v-if="show">
			<span style="color: white;">40CM墒情展示</span>
			<div id="40cmMap"></div>
		</div>
	</div>
</template>

<script>
	import coord from '../../static/js/world.js'
	export default {
		data() {
			return {
				times: Date.now(),
				data:{},
				map:null,
				datas:{},
				maps:null,
				show:false,
				tips:null
			}
		},
		watch: {

		},
		methods: {
			Inquire() {//查询
				this.show = false
				this.$message({
					type:'success',
					message:'请稍等, 正在加载墒情地图...'
				})
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/ch_kriging",{
					time:this.times
				})
					.then(res=>{
						let Data = res.data.records
						if (!Data) {
							this.show = false
							this.$message({
								type:'warning',
								message:moment(this.times).format("YYYY年MM月DD日 HH:00:00")+'无数据'
							})
							return
						}
						this.show =true
						this.data = Data['20cm']
						this.datas = Data['40cm']
						this.$nextTick(() => {
							this.init20CmLayerMap()
							this.init40CmLayerMap()
							this.$message({
								type:'success',
								message:'加载墒情地图成功！'
							})
						})
					})
					.catch(e=>{
						console.log(e)
					})
			},
			init20CmLayerMap() {//20CM
				let _this = this
				let params = {
					mapCenter: [107.249894, 29.99305],
					krigingModel: 'exponential', //model还可选'gaussian','spherical'
					krigingSigma2: 0,
					krigingAlpha: 226,
					canvasAlpha: 0.75, //canvas图层透明度
					colors: ["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00",
						"#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00",
						"#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400",
						"#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900",
						"#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00",
						"#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300",
						"#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800",
						"#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00",
						"#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200",
						"#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700",
						"#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00",
						"#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100",
						"#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402",
						"#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414",
						"#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826",
						"#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38",
						"#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B",
						"#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D",
						"#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170",
						"#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283",
						"#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696",
						"#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA",
						"#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD",
						"#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1",
						"#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4",
						"#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"
					]
				};
				let baseLayer = new ol.layer.Tile({
					title: "base",
					source: new ol.source.OSM()
				});
				_this.map = new ol.Map({
					target: '20cmMap',
					layers: [baseLayer],
					view: new ol.View({
						center: params.mapCenter,
						projection: 'EPSG:4326',
						zoom: 8
					})
				});
				let WFSVectorSource = new ol.source.Vector();
				let WFSVectorLayer = new ol.layer.Vector({
					source: WFSVectorSource,
				});
				_this.map.addLayer(WFSVectorLayer);
				//创建要素
				for (let i = 0; i < this.data.features.length; i++) {
					let feature = new ol.Feature({
						geometry: new ol.geom.Point([this.data.features[i].attributes.x, this.data.features[i].attributes.y]),
						value: this.data.features[i].attributes.z
					});
					feature.setStyle(new ol.style.Style({
						image: new ol.style.Circle({
							radius: 6,
							fill: new ol.style.Fill({
								color: "#00F"
							})
						})
					}));
					WFSVectorSource.addFeature(feature);
				}
				let clipgeom = new ol.geom.Polygon(coord);
				//绘制kriging插值图
				let canvasLayer = null;
				let drawKriging = function(extent) {
					let values = [],
						lngs = [],
						lats = [];
					WFSVectorSource.forEachFeature(function(feature) {
						values.push(feature.getProperties().value);
						lngs.push(feature.getGeometry().getCoordinates()[0]);
						lats.push(feature.getGeometry().getCoordinates()[1]);
					})
					if (values.length > 3) {
						let letiogram = kriging.train(values, lngs, lats,
							params.krigingModel, params.krigingSigma2, params.krigingAlpha);
						let ex = clipgeom.getExtent();
						let grid = kriging.grid(coord, letiogram, (ex[2] - ex[0]) / 200);
						//移除已有图层
						if (canvasLayer !== null) {
							_this.map.removeLayer(canvasLayer);
						}
						//创建新图层
						canvasLayer = new ol.layer.Image({
							source: new ol.source.ImageCanvas({
								canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
									let canvas = document.createElement('canvas');
									canvas.width = size[0];
									canvas.height = size[1];
									canvas.style.display = 'block';
									//设置canvas透明度
									canvas.getContext('2d').globalAlpha = params.canvasAlpha;
									//使用分层设色渲染
									kriging.plot(canvas, grid,
										[extent[0], extent[2]], [extent[1], extent[3]], params.colors);
									return canvas;
								},
								projection: 'EPSG:4326'
							})
						})
						//向map添加图层
						_this.map.addLayer(canvasLayer);
					} else {
						alert("样点少，无法插值");
					}
				}
				//首次加载，自动渲染一次差值图
				let extent = clipgeom.getExtent();
				drawKriging(extent);
			},
			init40CmLayerMap() {//40CM
				let _this = this
				let params = {
					mapCenter: [107.249894, 29.99305],
					krigingModel: 'exponential', //model还可选'gaussian','spherical'
					krigingSigma2: 0,
					krigingAlpha: 226,
					canvasAlpha: 0.75, //canvas图层透明度
					colors: ["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00",
						"#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00",
						"#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400",
						"#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900",
						"#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00",
						"#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300",
						"#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800",
						"#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00",
						"#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200",
						"#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700",
						"#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00",
						"#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100",
						"#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402",
						"#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414",
						"#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826",
						"#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38",
						"#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B",
						"#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D",
						"#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170",
						"#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283",
						"#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696",
						"#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA",
						"#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD",
						"#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1",
						"#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4",
						"#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"
					]
				};
				let baseLayer = new ol.layer.Tile({
					title: "base",
					source: new ol.source.OSM()
				});
				_this.maps = new ol.Map({
					target: '40cmMap',
					layers: [baseLayer],
					view: new ol.View({
						center: params.mapCenter,
						projection: 'EPSG:4326',
						zoom: 8
					})
				});
				let WFSVectorSource = new ol.source.Vector();
				let WFSVectorLayer = new ol.layer.Vector({
					source: WFSVectorSource,
				});
				_this.maps.addLayer(WFSVectorLayer);
				//创建要素
				for (let i = 0; i < this.datas.features.length; i++) {
					let feature = new ol.Feature({
						geometry: new ol.geom.Point([this.datas.features[i].attributes.x, this.datas.features[i].attributes.y]),
						value: this.datas.features[i].attributes.z
					});
					feature.setStyle(new ol.style.Style({
						image: new ol.style.Circle({
							radius: 6,
							fill: new ol.style.Fill({
								color: "#00F"
							})
						})
					}));
					WFSVectorSource.addFeature(feature);
				}
				let clipgeom = new ol.geom.Polygon(coord);
				//绘制kriging插值图
				let canvasLayer = null;
				let drawKriging = function(extent) {
					let values = [],
						lngs = [],
						lats = [];
					WFSVectorSource.forEachFeature(function(feature) {
						values.push(feature.getProperties().value);
						lngs.push(feature.getGeometry().getCoordinates()[0]);
						lats.push(feature.getGeometry().getCoordinates()[1]);
					})
					if (values.length > 3) {
						let letiogram = kriging.train(values, lngs, lats,
							params.krigingModel, params.krigingSigma2, params.krigingAlpha);
						let ex = clipgeom.getExtent();
						let grid = kriging.grid(coord, letiogram, (ex[2] - ex[0]) / 200);
						//移除已有图层
						if (canvasLayer !== null) {
							_this.maps.removeLayer(canvasLayer);
						}
						//创建新图层
						canvasLayer = new ol.layer.Image({
							source: new ol.source.ImageCanvas({
								canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
									let canvas = document.createElement('canvas');
									canvas.width = size[0];
									canvas.height = size[1];
									canvas.style.display = 'block';
									//设置canvas透明度
									canvas.getContext('2d').globalAlpha = params.canvasAlpha;
									//使用分层设色渲染
									kriging.plot(canvas, grid,
										[extent[0], extent[2]], [extent[1], extent[3]], params.colors);
									return canvas;
								},
								projection: 'EPSG:4326'
							})
						})
						//向map添加图层
						_this.maps.addLayer(canvasLayer);
					} else {
						alert("样点少，无法插值");
					}
				}
				//首次加载，自动渲染一次差值图
				let extent = clipgeom.getExtent();
				drawKriging(extent);
			},
			initData(){//初始化地图
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/ch_kriging",{
					time:this.times
				})
					.then(res=>{
						let Data = res.data.records
						if (!Data) {
							this.show = false
							this.$message({
								type:'warning',
								message:moment().format("YYYY年MM月DD日 HH:00:00")+'无数据'
							})
							return
						}
						this.show =true
						this.data = Data['20cm']
						this.datas = Data['40cm']
						this.$nextTick(() => {
							this.init20CmLayerMap()
							this.init40CmLayerMap()
						})
					})
					.catch(e=>{
						console.log(e)
					})
			}
		},
		mounted() {
			this.initData()
		},
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soilmoisture.css");
	@import url("../../static/soilcss/input.css");
</style>
