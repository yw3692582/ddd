<template>
	<div class="box">
		<div class="block">
			<div class="block_2" v-if="$store.state.user_name == 'admin' ? false:true" style="margin-left: 20px;display: inline;">
				<span class="demonstration">选择设备类型：</span>
				<el-select v-model="e_code" clearable placeholder="请选择设备类型" @change="selectEcode">
					<el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</el-select>
			</div>
			<div class="block_1" style="display: inline;">
				<span class="demonstration">站台配置：</span>
				<el-select v-model="eid" filterable clearable multiple placeholder="搜索/选择站台配置" :collapse-tags="true" @change="selectStation">
					<el-option v-for="item in stations" :key="item.key" :label="item.value" :value="item">
					</el-option>
				</el-select>
			</div>
			<div style="margin-left: 20px;display: inline;">
				<span class="demonstration">选择日期：</span>
				<el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</div>
			<!-- width="500" -->
			<el-popover placement="bottom" width="600" trigger="hover">
				<div style="text-align: center;">
					<span v-if="stations.length === 0 ? true:false">请先选择设备类型</span>
				</div>
				<div v-if="weathers">
					<span v-if="weather_s" style="color: #3DCEE9;">气象设备要素：</span>
					<el-checkbox-group v-model="checkedCities">
						<el-checkbox v-for="weathers in weather" :label="weathers.key" :key="weathers.key">{{weathers.value}}</el-checkbox>
					</el-checkbox-group>
				</div>
				<div v-if="soils">
					<span v-if="soil_s" style="color: #3DCEE9;">土壤设备要素：</span>
					<el-checkbox-group v-model="checkedCities">
						<el-checkbox v-for="soils in soil" :label="soils.key" :key="soils.key">{{soils.value}}</el-checkbox>
					</el-checkbox-group>
				</div>
				<el-button type="primary" style="display: inline;" slot="reference">要素配置</el-button>
			</el-popover>
			<el-tooltip class="item" effect="dark" content="实时数据刷新" placement="top">
				<el-button type="primary"><i @click="b()" class="el-icon-refresh"></i></el-button>
			</el-tooltip>
			<el-button type="primary" style="display: inline;" @click="b()">查询</el-button>
		</div>
		<div class="table-wrapper">
			<el-table id="out-table" element-loading-text="加载中,请稍等" element-loading-spinner="el-icon-loading"
			 element-loading-background="rgba(0, 0, 0, 0.8)" v-loading="loading" :data="tableData" border max-height="682" style="width: 100%; margin: 0 auto;"
			 :cell-class-name="getCellIndex" :cell-style="setCellStyle" @cell-click="cellClick" :row-style="getRowClass"
			 :header-row-style="getRowClass" :header-cell-style="getRowClass">
				<!-- 动态循环的列表 -->
				<template v-for="(item, index) in obj">
					<el-table-column :key="index" :prop="item.prop" :min-width="item.minWidth" :label="item.label" :max-width="item.maxWidth"
					 :fixed="item.fixed" align="center">
					</el-table-column>
				</template>
			</el-table>
			<el-pagination background :current-page.sync="currentPage1" :page-size="15" @size-change="handleSizeChange"
			 :page-sizes="[15, 20, 30, 40]" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
			 :total="numbers">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				checkedCities: [],
				time: '',
				eid: '', //台站
				feature_filter: '', //要素
				tableData: [],
				elements: [],
				weather: [],
				soil: [],
				weathers: false,
				soils: false,
				weather_s: false,
				soil_s: false,
				stations: [],
				obj: [],
				eid_key: [], //站台信息：key-value
				feature_filter_key: [], //要素信息：key-value
				page: 1, //页
				numbers: 0,
				rowIndex: '',
				columnIndex: '',
				size: '15',
				loading: false,
				currentPage1: null,
				types: [{
						key: '0101',
						value: '交通气象设备'
					},
					{
						key: '0102',
						value: '土壤水分设备'
					}
				],
				e_code: ''
			}
		},
		methods: {
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:rgba(7, 17, 37, 1);color:#ECECEC;border-color: #04476E;";
			},
			cellClick: function(row, column, cell, event) {
				this.rowIndex = row.index;
				this.columnIndex = column.index;
			},
			getCellIndex: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				row.index = rowIndex;
				column.index = columnIndex;
			},
			setCellStyle: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (rowIndex === this.rowIndex && columnIndex === this.columnIndex) {
					return {
						// "color": "red"
					}
				}
			},
			// 每页多少条
			handleSizeChange(val) {
				this.size = val
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/features_his', {
						start_time: this.time[0],
						end_time: this.time[1],
						eid: this.eid_key,
						feature_filter: this.checkedCities,
						page: this.page,
						size: this.size.toString()
					})
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let data = res.data.records
						this.tableData = data
						this.numbers = res.data.numbers
						for (let i = 0; i < data.length; i++) {
							this.tableData[i].obs_date = moment((this.tableData[i].obs_date) * 1000).format("YYYY-MM-DD HH:mm:ss")
						}
					})
					.catch(e => {
						console.log('')
					})
			},
			// 页数
			handleCurrentChange(val) {
				this.page = val
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/features_his', {
						start_time: this.time[0],
						end_time: this.time[1],
						eid: this.eid_key,
						feature_filter: this.checkedCities,
						page: this.page,
						size: this.size.toString()
					})
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let data = res.data.records
						this.tableData = data
						this.numbers = res.data.numbers
						for (let i = 0; i < data.length; i++) {
							this.tableData[i].obs_date = moment((this.tableData[i].obs_date) * 1000).format("YYYY-MM-DD HH:mm:ss")
						}
					})
					.catch(e => {
						console.log('')
					})
			},
			selectEcode(value) {
				this.e_code = value
				this.stations = []
				// 台站配置
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/equip_name', {
						e_code: this.e_code
					})
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						if (!res.data.records.length) {
							this.$message({
								type: 'warning',
								message: '无此权限，请选择其他设备类型！'
							})
							return
						} else {
							this.stations = res.data.records
							switch (this.e_code) {
								case '0101':
									if (this.stations.length == 0) {
										this.weathers = false
										this.soils = false
										this.weather_s = false
										return
									} else {
										this.weathers = true
										this.soils = false
										this.weather_s = false
									}
									break
								default:
									if (this.stations.length == 0) {
										this.soils = false
										this.weathers = false
										this.soil_s = false
										return
									} else {
										this.soils = true
										this.weathers = false
										this.soil_s = false
									}
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			selectStation(value) {
				this.eid = value
			},
			b() { //点击事件
				if (this.$store.state.user_name == 'admin') {
					this.e_code = 'all'
				}
				if (this.e_code.length == 0 || this.time.length == 0 || this.eid.length == 0) {
					this.$message({
						type: 'warning',
						message: '参数不能为空！'
					})
					return
				}
				this.loading = true
				setTimeout(() => {
					if (!this.loading) {
						return
					} else {
						this.$message({
							type: 'warning',
							message: '请求超时,请刷新页面重新请求！'
						})
						this.loading = false
						return
					}
				}, 5000)
				this.page = 1
				this.type = 2
				this.currentPage1 = 1
				for (let i = 0; i < this.time.length; i++) {
					// 日期转为时间戳
					let a = this.time[i]
					let b = Math.round(a)
					this.time[i] = b
				}
				// 清空台站
				this.eid_key = []
				for (let i = 0; i < this.eid.length; i++) {
					this.eid_key.push(this.eid[i].key)
				}
				this.s = []
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/features_his', {
						start_time: this.time[0],
						end_time: this.time[1],
						eid: this.eid_key,
						feature_filter: this.checkedCities,
						page: this.page,
						size: this.size.toString()
					})
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						this.loading = false
						let data = res.data.records
						this.tableData = data
						this.numbers = res.data.numbers
						switch (this.checkedCities.length) {
							case 0:
								this.obj = [{
										label: '站台',
										prop: 'name',
										fixed: 'left',
										minWidth: '319px'
									},
									{
										label: '地址',
										prop: 'address',
										fixed: 'left',
										minWidth: '319px'
									},
									{
										label: '时间',
										prop: 'obs_date',
										fixed: 'left',
										minWidth: '319px'
									}
								]
								break
							default:
								this.obj = [{
										label: '站台',
										prop: 'name',
										fixed: 'left',
										minWidth: '200px'
									},
									{
										label: '地址',
										prop: 'address',
										fixed: 'left',
										minWidth: '355px'
									},
									{
										label: '时间',
										prop: 'obs_date',
										fixed: 'left',
										minWidth: '200px'
									}
								]
						}
						let tab_headers = [...this.weather, ...this.soil]
						// 动态获取表格头部
						for (let i = 0; i < this.checkedCities.length; i++) {
							tab_headers.find((Data) => {
								if (Data.key == this.checkedCities[i]) {
									this.obj.push({
										label: Data.value,
										prop: this.checkedCities[i],
										minWidth: '140px'
									})
								}
							})
						}
						for (let i = 0; i < this.tableData.length; i++) {
							this.tableData[i].obs_date = moment((this.tableData[i].obs_date) * 1000).format("YYYY-MM-DD HH:mm:ss")
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			feature() {
				// 要素配置
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/reverse_features')
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						this.elements = res.data.records
						this.weather = res.data.records.weather
						this.soil = res.data.records.soil
					})
					.catch(e => {
						console.log(e)
					})
			},
			equ() {
				if (this.$store.state.user_name == 'admin') {
					// 台站配置
					let headers = this.$ajax.defaults.headers.common
					headers['token'] = localStorage.getItem('token')
					headers['username'] = localStorage.getItem('user_name')
					this.$ajax.post('/equip_name', {
							e_code: ''
						})
						.then(res => {
							if (res.data.code == -1) {
								alert('登录已失效,请重新登录!')
								localStorage.removeItem('token')
								localStorage.removeItem('user_name')
								this.$router.push('/')
								return
							}
							this.stations = res.data.records
						})
						.catch(e => {
							console.log(e)
						})
				} else {
					return false
				}
			},
			sele_text() {
				let text = document.querySelectorAll(".block_1 .el-select-dropdown__empty")[0]
				text.innerText = '请先选择设备类型'
			},
			feas() {
				if (this.$store.state.user_name == 'admin') {
					this.weathers = true
					this.soils = true
					this.soil_s = true
					this.soil_s = true
					this.weather_s = true
				}
			}
		},
		mounted() {
			this.feas()
			this.sele_text()
			this.feature()
			this.equ()
		},
	};
</script>

<style scoped>
	@import url("../../static/css/main.css");
</style>
