<template>
	<div>
		<div>
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item>系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>设备管理</el-breadcrumb-item>
			</el-breadcrumb>
			<el-divider></el-divider>
			<div class="equ_header">
				<el-dropdown>
					<el-button type="primary">
						新建<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<el-link @click="$router.push('/meteorological')">气象设备</el-link>
						</el-dropdown-item>
						<el-dropdown-item>
							<el-link @click="$router.push('/createEq')">土壤设备</el-link>
						</el-dropdown-item>
						<el-dropdown-item>
							<el-link @click="$router.push('/auxiliary')">辅助设备</el-link>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown>
					<el-button type="primary" style="margin: 0px 10px;">
						查看<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<el-link @click="equ('2')">气象设备</el-link>
						</el-dropdown-item>
						<el-dropdown-item>
							<el-link @click="equ('3')">土壤设备</el-link>
						</el-dropdown-item>
						<el-dropdown-item>
							<el-link @click="equ('4')">辅助设备</el-link>
						</el-dropdown-item>
						<el-dropdown-item>
							<el-link @click="equ('')">全部设备</el-link>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown>
					<el-button type="primary">
						上传/下载<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<el-link>上传模版</el-link>
						</el-dropdown-item>
						<el-dropdown-item>
							<el-link>下载模版</el-link>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<div class="table-wrapper">
			<el-table border :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%;font-size: 16px;"
			 :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="经度:" v-if="props.row.e_code == '0102' || props.row.e_code == '0101'">
								<span>{{ props.row.longitude }}</span>
							</el-form-item>
							<el-form-item label="纬度:" v-if="props.row.e_code == '0102' || props.row.e_code == '0101'">
								<span>{{ props.row.latitude }}</span>
							</el-form-item>
							<el-form-item label="报文推送:" v-if="props.row.e_code == '0102' || props.row.e_code == '0101'">
								<span>{{ props.row.message_push }}</span>
							</el-form-item>
							<br>
							<el-form-item v-if="(props.row.e_code == '0102' || props.row.e_code == '0101') && props.row.sub_device != ''">
								<table>
									<tr>
										<th>设备类型</th>
										<th>设备名称</th>
									</tr>
									<tr v-for="i in props.row.sub_device">
										<td style="text-align: center;">{{i.station_type}}</td>
										<td style="text-align: center;">{{i.station_name}}</td>
									</tr>
								</table>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column label="设备名称" prop="station_name" min-width="130px" align="center">
				</el-table-column>
				<el-table-column label="设备类型" align="center" min-width="100px">
					<template slot-scope="scope">
						<span v-html="formatter(scope,scope.row.e_code)"></span>
						<el-tooltip class="item" effect="dark" content="修改标定参数" placement="top">
							<!-- <i v-if="scope.row.e_code == '0102'" @click="handleParEdit(scope.$index, scope.row)" class="el-icon-edit-outline"></i> -->
							<i v-if="scope.row.e_code == '0102'" @click="handleParEdits(scope.$index, scope.row)" class="el-icon-edit-outline"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="台站编号" prop="station_id" align="center">
				</el-table-column>
				<el-table-column label="创建者" prop="creator" align="center">
				</el-table-column>
				<el-table-column label="地址" prop="address" align="center" min-width="280px">
				</el-table-column>
				<el-table-column label="创建时间" prop="create_time" align="center" min-width="120px" :formatter="formatterTime">
				</el-table-column>
				<el-table-column align="center" min-width="160px">
					<template slot="header" slot-scope="scope">
						<el-input v-model="searchTableInfo" size="mini" prefix-icon="el-icon-search" placeholder="请输入内容进行搜索"></el-input>
					</template>
					<template slot-scope="scope">
						<el-button size="medium" plain type="primary" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="medium" plain type="danger" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page.sync="currentPage1" :page-size="pagesize" background layout="total, prev, pager, next, jumper"
			 :total="tableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<div class="equ_edit">
			<!-- 编辑设备 弹窗 -->
			<el-dialog :close-on-click-modal="false" title="编辑设备" :visible.sync="dialogEditVisible" @close="cancel">
				<el-form status-icon @submit.native.prevent>
					<el-form-item label="台站编号">
						<el-input v-model.trim="station_id" onkeyup="value=value.replace(/[^\w_]/g,'');" style="width: 300px;"
						 placeholder="请输入台站编号" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备名称">
						<el-input v-model.trim="station_name" style="width: 300px;" placeholder="请输入设备名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备经纬度,例:113.790921,34.748171" v-show="show_au">
						<el-input v-model="lon_lat" @blur.prevent="b()" onkeyup="value=value.replace(/[^\d.,，]/g,'');" placeholder="请输入经纬度"
						 autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="地址" v-show="show_au">
						<el-input v-model="address" disabled placeholder="根据经纬度自动填充" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="是否发送报文" v-show="show_au">
						<el-radio-group v-model="isradio">
							<el-radio :label='true'>是</el-radio>
							<el-radio :label='false'>否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="已有辅助设备" v-show="show">
						<el-table :data="sub_device">
							<el-table-column label="设备类型" prop="station_type"></el-table-column>
							<el-table-column label="设备名称" prop="station_name"></el-table-column>
							<el-table-column fixed="right" label="操作" width="120">
								<template slot-scope="scope">
									<el-button @click.native.prevent="deleteRow(scope.$index, sub_device);handleHuo(scope.$index, scope.row)" type="text"
									 size="small">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item label="辅助设备" v-show="show_a">
						<el-cascader v-model="a_value" placeholder="请选择" :options="options" :props="props" clearable></el-cascader>
					</el-form-item>
				</el-form>
				<div>
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" :disabled="btn1 && btn2 && btn3 && btn5 && btn6 && btn7?btn:btn == false" @click="editEqu"
					 native-type="submit">修改</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="equ_pre">
			<!-- 标定参数弹窗 -->
			<el-dialog :close="cancels" :modal-append-to-body="false" width="82.8%" :close-on-click-modal="false" title="标定参数" :visible.sync="dialogParVisible"
			 @close="cancels">
				请选择服务类型:
				<el-select v-model="fuwuvalue_id" placeholder="请选择服务类型">
					<el-option v-for="item in fuwuoptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				中心站标定：
				<el-radio-group v-model="yewuradio_id">
					<el-radio label="0">否</el-radio>
					<el-radio label="1">是</el-radio>
				</el-radio-group>
				<el-table ref="multipleTable" :data="tableParData" @select-all="selectAll" @select="handleSelection" @selection-change="handleSelectionChange" style="width: 100%">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column label="层深" align="center">
						<template slot-scope="scope">
							<span>{{scope.row['010202']}}</span>
						</template>
					</el-table-column>
					<el-table-column label="空气频率" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0201']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="水频率" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0202']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="传感器标定参数A" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0203']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="传感器标定参数B" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0204']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="传感器标定参数C" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0205']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="采集器标定参数C" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0206']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="采集器标定参数D" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0207']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="田间持水量" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0210']"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="土壤容重" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0211']"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="0212" label="凋萎湿度" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0212']"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="0213" label="土壤质地" align="center">
						<template slot-scope="scope">
							<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row['0213']"></el-input>
						</template>
					</el-table-column>
				</el-table>
				<div>
					<el-button @click="cancels">取 消</el-button>
					<el-button type="primary" @click="editPar" native-type="submit">修改标定参数</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		inject: ["reload"],
		data() {
			return {
				dialogEditVisible: false,
				dialogParVisible: false,
				eid: '',
				a_value: [],
				props: {
					multiple: true
				},
				show: false,
				show_au: false,
				show_a: false,
				getSearchInfo: [],
				pageshow: true,
				tabNum: 0,
				options: [],
				searchTableInfo: '',
				currentPage1: null,
				pagesize: 0,
				currpage: 1,
				isradio: false,
				e_code: '',
				station_id: '',
				station_name: '',
				lon_lat: '',
				parameter: '',
				sub_device: [],
				extend_data: '',
				sub_id: [],
				sub_eid: '',
				longitude: '',
				latitude: '',

				btn: true,
				btn1: true,
				btn2: true,
				btn3: true,
				btn5: true,
				btn6: true,
				btn7: true,

				old_sta_id: '',
				old_sta_name: '',
				old_lon_lat: '',
				old_sub_dev: [],
				ole_radio: null,

				show_dict: '',
				header: [],
				parameter: [],
				btn7: true,
				yewuradio: '1',
				fuwuoptions: [{
						value: '020901',
						label: '测墒站'
					},
					{
						value: '020902',
						label: '农气观测站'
					},
					{
						value: '020903',
						label: '粮食生产县观测站'
					},
					{
						value: '020904',
						label: '山洪预警工程观测站'
					},
					{
						value: '020905',
						label: '高标准粮田观测站'
					},
					{
						value: '020906',
						label: '其它'
					},
				],
				fuwuvalue: [],
				extent_data_id: [],
				fuwuvalue_id: '',
				yewuradio_id: '',
				types: [],
				new_lon_lat: [],
				multipleSelection: [],
				column: [],
				tableParData:[],
				rowNum: ['10', '20', '30', '40', '50', '60', '80', '100'],
			};
		},
		computed: {
			tableData() {
				let searchTableInfo = this.searchTableInfo
				if (searchTableInfo) {
					this.currentPage1 = 1
					this.currpage = 1
					return this.getSearchInfo.filter(data => {
						return Object.keys(data).some(key => {
							return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
						})
					})
				}
				return this.getSearchInfo
			}
		},
		watch: {
			// 台站id
			station_id(newsta_id, oldsta_id) {
				if (newsta_id == this.old_sta_id) {
					this.btn1 = true
				} else {
					this.station_id = newsta_id
					this.btn1 = false
				}
			},
			// 台站name
			station_name(newsta_name, oldsta_name) {
				if (newsta_name == this.old_sta_name) {
					this.btn2 = true
				} else {
					this.station_name = newsta_name
					this.btn2 = false
				}
			},
			//报文
			isradio(new_radio, olds_radio) {
				if (new_radio.toString() == this.old_radio) {
					this.btn3 = true
				} else {
					this.btn3 = false
				}
			},
			// 已有辅助设备
			sub_device(new_sub_dev, old_sub_dev) {
				if (new_sub_dev.length == this.old_sub_dev.length) {
					this.btn5 = true
				} else {
					this.sub_device = new_sub_dev
					this.btn5 = false
				}
			},
			// 选择辅助设备
			a_value(new_val, old_val) {
				var a = JSON.parse(JSON.stringify(new_val))
				if (a.length !== 0) {
					this.btn6 = false
				} else {
					this.btn6 = true
				}
			},
			// 地址
			lon_lat(new_add, old_add) {
				if (new_add == this.old_lon_lat) {
					this.btn7 = true
				} else {
					this.btn7 = false
				}
			},
		},
		methods: {
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#071125;color:white;border-color: #04476E;";
			},
			onDeleteClick() {
				let tabs = document.getElementById('tab')
				let activeObj = event.srcElement
				let rowIndex = activeObj.parentElement.rowIndex;
				this.parameter.splice(rowIndex - 1, 1)
			},
			b() {
				for (let i = 0; i < this.lon_lat.length; i++) {
					if (this.lon_lat[i] == ',') {
						this.new_lon_lat = this.lon_lat.split(',')
						if (this.new_lon_lat[0] > 180) {
							this.$message({
								type: 'warning',
								message: '经度不得超过180'
							})
							return
						}
						if (this.new_lon_lat[1] > 90) {
							this.$message({
								type: 'warning',
								message: '纬度不得超过90'
							})
							return
						}
					}
					if (this.lon_lat[i] == '，') {
						this.new_lon_lat = this.lon_lat.split('，')
						if (this.new_lon_lat[0] > 180) {
							this.$message({
								type: 'warning',
								message: '经度不得超过180'
							})
							return
						}
						if (this.new_lon_lat[1] > 90) {
							this.$message({
								type: 'warning',
								message: '纬度不得超过90'
							})
							return
						}
					}
				}
				let headers = this.$ajax.defaults.headers.common
				delete headers.token
				delete headers.username
				this.$ajax.get('//restapi.amap.com/v3/geocode/regeo?key=657d0c0ea15e983c2b8f48fb44059ef5&' + 'location=' + this.new_lon_lat[
						0] + ',' + this.new_lon_lat[1])
					.then(res => {
						this.address = res.data.regeocode.formatted_address
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: '获取地址失败，请刷新页面'
						})
					})
			},
			register() {
				this.$router.push('/createEq')
			},
			handleEdit(index, row) {
				this.dialogEditVisible = true
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/unconnected_assist_equip')
					.then(res => {
						if (res.data.code == -2) {
							alert('该账号无此权限，有需要请联系管理员!')
							return
						}
						this.options = res.data.records
					})
					.catch(e => {
						this.$message({
							type: "error",
							message: "获取辅助设备数据失败"
						})
					})
				if (row.e_code == '0102' || row.e_code == '0101') {
					this.show_a = true
				} else {
					this.show_a = false
				}
				if (row.e_code == '0102') {
					this.parma_show = true
				} else {
					this.parma_show = false
				}
				if (row.e_code == '0301' || row.e_code == '0302' || row.e_code == '0303') {
					this.show_au = false
				} else {
					this.show_au = true
				}
				if (row.sub_device == null || row.sub_device == '') {
					this.show = false
				} else {
					this.show = true
					this.sub_device = row.sub_device
					this.old_sub_dev = row.sub_device.concat()
				}
				var a = JSON.parse(JSON.stringify(row.extend_data))
				if (JSON.stringify(a) == '{}') {
					this.parma_show = false
				} else {
					this.parma_show = true
					this.extend_data = row.extend_data
				}
				if (row.station_id == null || row.station_id == '') {
					this.old_sta_id = row.station_id
				} else {
					this.old_sta_id = row.station_id.concat()
				}
				this.eid = row.eid
				this.e_code = row.e_code
				this.station_id = row.station_id
				this.station_name = row.station_name
				this.old_sta_name = row.station_name.concat()
				this.lon_lat = row.longitude + ',' + row.latitude
				this.lon_lat = row.longitude + '，' + row.latitude
				this.old_lon_lat = this.lon_lat.concat()
				this.isradio = row.message_push
				this.old_radio = row.message_push.toString().concat()
				this.longitude = row.longitude
				this.latitude = row.latitude
				this.address = row.address
			},
			handleHuo(index, row) {
				this.sub_id.push(row.id)
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			cancel() {
				this.station_id = ''
				this.station_name = ''
				this.lon_lat = ''
				this.address = ''
				this.isradio = false
				this.sub_device = []
				this.a_value = []
				this.dialogEditVisible = false
			},
			editEqu() {
				if (this.station_id == this.old_sta_id) {
					this.station_id = ''
				}
				if (this.station_name == this.old_sta_name) {
					this.station_name = ''
				}
				if (this.isradio == this.old_radio) {
					this.isradio = ''
				}
				if (this.sub_device.length == this.old_sub_dev.length) {
					this.sub_device = []
				}
				if (this.longitude == null && this.latitude == null && this.address == null) {
					this.longitude = ''
					this.latitude = ''
					this.address = ''
				}
				for (let i = 0; i < this.lon_lat.length; i++) {
					if (this.lon_lat[i] == ',') {
						this.new_lon_lat = this.lon_lat.split(',')
					}
					if (this.lon_lat[i] == '，') {
						this.new_lon_lat = this.lon_lat.split('，')
					}
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/manage_equipments', {
						eid: this.eid,
						e_code: '',
						station_name: encodeURI(this.station_name),
						longitude: this.new_lon_lat[0],
						latitude: this.new_lon_lat[1],
						creator: '',
						message_push: this.isradio.toString(),
						address: encodeURI(this.address),
						station_id: this.station_id,
						sub_device: {
							id: this.sub_id,
							new_sub_device: this.a_value,
						},
						extend_data: {}
					})
					.then(res => {
						switch (res.data.code) {
							case -2:
								alert('该账号无此权限，有需要请联系管理员!')
								break
							case -1:
								alert('登录已失效,请重新登录!')
								localStorage.removeItem('token')
								localStorage.removeItem('user_name')
								localStorage.removeItem('user_admin')
								this.$router.push('/')
								break
							case 0:
								this.$message({
									type: 'error',
									message: '修改失败'
								})
								break
							case 1:
								this.$message({
									type: 'success',
									message: '修改成功'
								})
								break
							case 2:
								this.$message({
									type: 'warning',
									message: '设备号重复'
								})
								break
							case 3:
								this.$message({
									type: 'warning',
									message: '设备名重复'
								})
								break
						}
						this.reload()
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: '编辑信息失败'
						})
						this.reload()
					})
				this.dialogEditVisible = false
			},
			handleDelete(index, row) { //删除设备
				this.$confirm('此操作将永久删除该设备信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/delete_equipments', {
								eid: row.eid
							})
							.then(res => {
								if (res.data.code == -2) {
									alert('该账号无此权限，有需要请联系管理员!')
									return
								}
								if (res.data.code == -1) {
									alert('登录已失效,请重新登录!')
									localStorage.removeItem('token')
									localStorage.removeItem('user_name')
									localStorage.removeItem('user_admin')
									this.$router.push('/')
									return
								}
								if (res.data.code == 1) {
									this.$message({
										type: 'success',
										message: '删除信息成功'
									})
								}
								this.reload()
							})
							.catch(e => {
								this.$message({
									type: "error",
									message: "删除设备信息失败"
								})
								this.reload()
							})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						})
					})
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			handleParEdit(index, row) { //点击修改标定参数
				this.dialogParVisible = true
				console.log(row)
				this.column = row.extend_data.column
				this.extent_data_id = row.extend_data.id
				this.eid = row.eid
				for (let i = 0; i < row.extend_data.data.length; i++) {
					this.parameter.push(row.extend_data.data[i])
				}
				// 表头
				for (let i = 0; i < row.extend_data.column.length; i++) {
					(this.show_dict).find((Data) => {
						if (Data.key == row.extend_data.column[i]) {
							this.header.push(Data.value)
						}
					})
				}

				if (row.extend_data["0208"][0] == '0') {
					this.yewuradio = '0'
				} else if (row.extend_data["0208"][0] == '1') {
					this.yewuradio = '1'
				} else {
					this.yewuradio = ''
				}

				for (let i = 0; i < this.fuwuoptions.length; i++) {
					if (this.fuwuoptions[i].value == row.extend_data["0209"][0]) {
						this.fuwuvalue = this.fuwuoptions[i].value
					}
				}
				this.yewuradio_id = row.extend_data["0208"][1]
				this.fuwuvalue_id = row.extend_data["0209"][1]
			},
			handleParEdits(index, row) { //点击修改标定参数
				this.eid = row.eid
				this.$ajax.post("/show_extra", {
						eid: row.eid
					})
					.then(res => {
						let Data = res.data.records
						this.yewuradio_id = Data["0208"][0]
						this.fuwuvalue_id = Data["0209"][0]
						this.parameter = Data.extend_data
						this.$nextTick(() => {
							this.dialogParVisible = true
							this.addRow()
						})
					})
					.catch(e => {
						console.log(e)
					})
			},
			selectAll(selection){//全选
				if (selection.length == 8) {
					for (let i = 0, len = this.tableParData.length; i < len; i++) {
						this.tableParData[i].isShow = false
					}
				}else{
					for (let i = 0, len = this.tableParData.length; i < len; i++) {
						this.tableParData[i].isShow = true
					}
				}
			},
			handleSelection(select, row) {
				if (select.length == 0) {
					for (let i = 0, len = this.tableParData.length; i < len; i++) {
						this.tableParData[i].isShow = true
					}
				}
				for (let j = 0, lens = this.tableParData.length; j < lens; j++) {
					this.tableParData[j].isShow = true
				}
				for (let i = 0, len = select.length; i < len; i++) {
					for (let j = 0, lens = this.tableParData.length; j < lens; j++) {
						if (select[i]['010202'] == this.tableParData[j]['010202']) {
							this.tableParData[j].isShow = false
						}
					}
				}
			},
			handleSelectionChange(val){//多选数据
				this.multipleSelection = val
			},
			addRow() {
				for (let i = 0; i < 8; i++) {
					var list = {
						'010202': this.rowNum[i],
						'0201': '',
						'0202': '',
						'0203': '',
						'0204': '',
						'0205': '',
						'0206': '',
						'0207': '',
						'0210': '',
						'0211': '',
						'0212': '',
						'0213': '',
						isShow: true
					};
					this.tableParData.push(list)
				}
				for (let i = 0, len = this.parameter.length; i < len; i++) {
					for (let j = 0, len = this.tableParData.length; j < len; j++) {
						if (this.parameter[i]['010202'] == this.tableParData[j]['010202']) {
							this.tableParData[j]['0201'] = this.parameter[i]['0201']
							this.tableParData[j]['0202'] = this.parameter[i]['0202']
							this.tableParData[j]['0203'] = this.parameter[i]['0203']
							this.tableParData[j]['0204'] = this.parameter[i]['0204']
							this.tableParData[j]['0205'] = this.parameter[i]['0205']
							this.tableParData[j]['0206'] = this.parameter[i]['0206']
							this.tableParData[j]['0207'] = this.parameter[i]['0207']
							this.tableParData[j]['0210'] = this.parameter[i]['0210']
							this.tableParData[j]['0211'] = this.parameter[i]['0211']
							this.tableParData[j]['0212'] = this.parameter[i]['0212']
							this.tableParData[j]['0213'] = this.parameter[i]['0213']
							this.tableParData[j].isShow = false
							this.$nextTick(() => {
								this.$refs.multipleTable.toggleRowSelection(this.tableParData[j],true)
							})
						}
					}
				}
			},
			cancels() {
				this.parameter = []
				this.tableParData = []
				this.dialogParVisible = false
			},
			editPar() { //确定修改标定参数
				for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
					for (let key in this.multipleSelection[i]) {
						if (key == 'isShow') {
							// 不做操作，不能使用return
						}else{
							if (this.multipleSelection[i][key] == '') {
								this.$message({
									type: 'error',
									message: '参数不能为空且为数字'
								})
								return
							}
						}
					}
					delete(this.multipleSelection[i]['isShow'])
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/manage_parameter', {
						extend_data: this.multipleSelection,
						eid: this.eid,
						"0208":this.yewuradio_id,
						"0209":this.fuwuvalue_id
					})
					.then(res => {
						switch (res.data.code) {
							case -2:
								alert('该账号无此权限，有需要请联系管理员!')
								break
							case -1:
								alert('登录已失效,请重新登录!')
								localStorage.removeItem('token')
								localStorage.removeItem('user_name')
								this.$router.push('/')
								break
							case 0:
								this.$message({
									type: 'error',
									message: '修改标定参数失败'
								})
								break
							case 1:
								this.$message({
									type: 'success',
									message: '修改标定参数成功'
								})
								break
						}
						this.reload()
					})
					.catch(e => {
						console.log(e)
					})
			},
			equ(datas) { //选择查看不同的设备
				this.searchTableInfo = ''
				this.currentPage1 = 1
				this.currpage = 1
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/equip_all_info', {
						e_code: datas
					})
					.then(res => {
						if (res.data.code == -2) {
							alert('该账号无此权限，有需要请联系管理员!')
							return
						}
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let Data = res.data.records
						this.getSearchInfo = Data
						this.tabNum = this.getSearchInfo.length
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: "获取数据失败"
						})
					})
			},
			formatter(scope, vuale) {
				switch (vuale) {
					case '0101':
						return '气象设备'
					case '0102':
						return '土壤水分设备'
					case '0301':
						return '摄像头'
					case '0302':
						return '相机'
					case '0303':
						return 'DTU'
				}
			},
			formatterTime(row, column) {
				let date = row[column.property];
				if (date == undefined) {
					return "";
				}
				return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
			},
			equip_all_info() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/equip_all_info', {
						e_code: ''
					})
					.then(res => {
						if (res.data.code == -2) {
							alert('该账号无此权限，有需要请联系管理员!')
							return
						}
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let Data = res.data.records
						this.getSearchInfo = Data
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: "获取数据失败"
						})
					})
				// 读取localStorage中的show_dict
				let show_dict = JSON.parse(localStorage.show_dict)
				this.show_dict = show_dict
			},
			resoution() {
				let width = screen.width
				switch (width) {
					case 1600:
					case 1440:
						this.pagesize = 7
						break
					case 1400:
						this.pagesize = 10
						break
					case 1366:
					case 1360:
						this.pagesize = 5
						break
					default:
						this.pagesize = 12
				}
			},
			getHead() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/code_transfer")
					.then(res => {
						let Data = res.data
					})
					.catch(e => {
						console.log(e)
					})
			}
		},
		mounted() {
			this.getHead()
			this.equip_all_info()
			this.resoution()
		},
	}
</script>
<style>
	@media all and (-ms-high-contrast: nyewuradio),
	(-ms-high-contrast: active) {
		.el-cascader__tags>span {
			flex: auto;
		}

		i.el-cascader-node__postfix {
			top: 50%;
			transform: translateY(-50%);
		}
	}

	#tab .el-icon-close {
		line-height: 48px;
	}

	#tab .el-icon-close:hover {
		cursor: pointer;
	}
</style>
<style scoped>
	@import url("../../static/css/header-tip.css");
	@import url("../../static/css/update.css");
	@import url("../../static/css/table.css");
	@import url("../../static/css/equ.css");
</style>
