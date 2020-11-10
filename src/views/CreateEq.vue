<template>
	<div>
		<div>
			<el-page-header @back="$router.push('/equipment')" content="新建土壤水分设备"></el-page-header>
			<el-divider></el-divider>
		</div>
		<div class="box">
			<el-card class="login-card">
				<el-form @submit.native.prevent status-icon :model="verification" ref="verification">
					<el-form-item label="台站编号" prop="station_id" :rules="verification.rules">
						<el-input v-model.trim="verification.station_id" placeholder="请输入台站编号" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备名称" prop="station_name" :rules="{required: true, message:'设备名称不能为空'}">
						<el-input v-model.trim="verification.station_name" placeholder="请输入设备名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="采集器地址" prop="addr_value" :rules="{required: true,type:'number',message:'采集器地址不能为空且为数字，范围在0~65536之间'}">
						<el-input v-model.number="verification.addr_value" placeholder="请输入采集器地址" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备经纬度,例:113.790921,34.748171" prop="lon_lat" :rules="verification.rules">
						<el-input v-model="verification.lon_lat" onSubmit="return false" onkeyup="value=value.replace(/[^\d.,，]/g,'');"
						 @blur.prevent="b()" placeholder="请输入经纬度" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="地址">
						<el-input v-model="address" disabled placeholder="根据经纬度自动填充" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备创建者" prop="creator" :rules="{required: true, message:'设备创建者不能为空'}">
						<el-input v-model.trim="verification.creator" placeholder="请输入创建者" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="是否发送报文">
						<el-radio-group v-model="isradio">
							<el-radio label="1">是</el-radio>
							<el-radio label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否选择辅助设备">
						<el-radio-group v-model="radio">
							<el-radio label="1">是</el-radio>
							<el-radio label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="辅助设备">
						<el-cascader v-model="a_value" :disabled="this.radio==='2'?true:false" filterable :options="options" placeholder="请选择/搜索"
						 :props="props" clearable></el-cascader>
					</el-form-item>
					<el-form-item>
						<el-tooltip class="item" effect="dark" content="如果现有的辅助设备不满足您的需求,可以进行新建辅助设备" placement="right">
							<el-button type="primary" @click="createAu">新建辅助设备</el-button>
						</el-tooltip>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="parameter">添加标定参数</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-button type="primary" @click="register('verification')" native-type="submit">新建</el-button>
				</div>
			</el-card>
		</div>
		<div class="crea_fuzhu">
			<!-- 新建辅助设备 -->
			<el-dialog :close-on-click-modal="false" title="编辑信息" :visible.sync="dialogFormVisible">
				<el-form status-icon>
					<el-form-item label="类型" label-width="60px">
						<el-select class="el_select" v-model="new_sub_device.value" placeholder="请选择">
							<el-option v-for="item in $store.state.Auxiliary" :key="item.a_code" :label="item.label" :value="item.a_code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="编号" label-width="60px">
						<el-input style="width: 217px; margin-bottom: 10px; margin-top: 10px;" v-model="new_sub_device.station_id"
						 placeholder="请输入设备编号" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="名称" label-width="60px">
						<el-input style="width: 217px; margin-bottom: 10px;" v-model="new_sub_device.station_name" placeholder="请输入设备名称"
						 autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="创建者" label-width="60px">
						<el-input style="width: 217px; margin-bottom: 10px;" v-model="verification.creator" placeholder="请输入创建者"
						 autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel1()">取 消</el-button>
					<el-button type="primary" @click="edit()">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="crea_pre">
			<!-- 标定参数弹窗 -->
			<el-dialog :close-on-click-modal="false" width="90%" :show-close="false" title="标定参数" :visible.sync="dialogParameterVisible">
				<!-- <el-tooltip content="添加一行" effect="dark" placement="top">
					<el-button class="el-icon-plus" @click.prevent="addRow()"></el-button>
				</el-tooltip> -->
				中心站标定：
				<el-radio-group v-model="yewuradio[0]">
					<el-radio label="0">否</el-radio>
					<el-radio label="1">是</el-radio>
				</el-radio-group>
				服务类型：
				<el-select v-model="fuwuvalue[0]" clearable placeholder="请选择">
					<el-option v-for="item in fuwuoptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-form :model="model" ref="model">
					<el-table :data="model.tableData" @select-all="selectAll" @select="handleSelection" @selection-change="handleSelectionChange" ref="multipleTable"
					 tooltip-effect="dark" border stripe style="width: 100%">
						<!-- <el-table-column label="层数" type="index" align="center"></el-table-column> -->
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="层深" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.depth'">
									<span>{{scope.row.depth}}</span>
									<!-- <el-input oninput="value=value.replace(/[^\d^\.]/g,'')" style="width: 80px;" v-model="scope.row.depth"></el-input> -->
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="空气频率" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.air'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.air"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="水频率" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.water'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.water"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="传感器标定参数A" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.sensorA'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.sensorA"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="传感器标定参数B" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.sensorB'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.sensorB"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="传感器标定参数C" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.sensorC'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.sensorC"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="采集器标定参数C" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.collectorC'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.collectorC"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="采集器标定参数D" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.collectorD'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.collectorD"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="田间持水量" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.field'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.field"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="土壤容重" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.soil'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.soil"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="凋萎湿度" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.humidity'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.humidity"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="土壤质地" align="center">
							<template slot-scope="scope">
								<el-form-item :prop="'tableData.' + scope.$index + '.texture'">
									<el-input oninput="value=value.replace(/[^\d^\.]/g,'')" :disabled="scope.row.isShow" style="width: 80px;" v-model="scope.row.texture"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<!-- 	<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<i @click="deleteRow(scope.$index, model.tableData)" class="el-icon-close"></i>
							</template>
						</el-table-column> -->
					</el-table>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel()">取 消</el-button>
					<el-button type="primary" @click="editParameter()">确 定</el-button>
					<!-- <el-button type="primary" @click="editParameters()">确 定</el-button> -->
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisible: false,
				dialogParameterVisible: false,
				props: {
					multiple: true
				},
				// isShow: true,
				verification: {
					lon_lat: '',
					station_id: '',
					station_name: '',
					creator: '',
					addr_value: '',
					rules: {
						required: true,
						message: '参数不能为空且为数字'
					}
				},
				new_lon_lat: '',
				isradio: '2',
				radio: '2',
				yewuradio: [],
				fuwuvalue: [],
				address: '',
				new_sub_device: {
					value: '',
					station_id: '',
					station_name: '',
				},
				a_value: [],
				options: [],
				a: [],
				c: [],
				d: [],
				e: [],
				f: [],
				g: [],
				label_width: '70px',
				model: {
					tableData: [],
					rules: [{
							required: true,
							message: '参数不能为空'
						},
						{
							message: '参数必须为数字值'
						}
					]
				},
				// rowNum: 1,
				rowNum: [10, 20, 30, 40, 50, 60, 80, 100],

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

				depth: [],
				air: [],
				water: [],
				sensorA: [],
				sensorB: [],
				sensorC: [],
				collectorC: [],
				collectorD: [],
				field: [],
				soil: [],
				humidity: [],
				texture: [],
				multipleSelection: []
			}
		},
		methods: {
			b() {
				for (let i = 0; i < this.verification.lon_lat.length; i++) {
					if (this.verification.lon_lat[i] == ',') {
						this.new_lon_lat = this.verification.lon_lat.split(',')
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
					if (this.verification.lon_lat[i] == '，') {
						this.new_lon_lat = this.verification.lon_lat.split('，')
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
			createAu() {
				this.dialogFormVisible = true
			},
			cancel1() {
				this.new_sub_device = {}
				this.dialogFormVisible = false
			},
			cancel() {
				this.depth = []
				this.air = []
				this.water = []
				this.sensorA = []
				this.sensorB = []
				this.sensorC = []
				this.collectorC = []
				this.collectorD = []
				this.field = []
				this.soil = []
				this.humidity = []
				this.texture = []
				this.yewuradio = []
				this.fuwuvalue = []
				this.model.tableData = []
				this.dialogParameterVisible = false
			},
			edit() {
				if (this.new_sub_device.value == '0301') {
					this.options[0].children.push({
						value: 'HZGEXT' + this.new_sub_device.station_id,
						label: this.new_sub_device.station_name
					})

					this.e.push({
						eid: 'HZGEXT' + this.new_sub_device.station_id,
						station_name: encodeURI(this.new_sub_device.station_name),
						longitude: '',
						latitude: '',
						creator: '',
						station_id: this.new_sub_device.station_id,
						message_push: '',
						address: ''
					})
				}
				if (this.new_sub_device.value == '0302') {
					this.options[1].children.push({
						value: 'HZGEXT' + this.new_sub_device.station_id,
						label: this.new_sub_device.station_name
					})
					this.f.push({
						eid: 'HZGEXT' + this.new_sub_device.station_id,
						station_name: encodeURI(this.new_sub_device.station_name),
						longitude: '',
						latitude: '',
						creator: '',
						station_id: this.new_sub_device.station_id,
						message_push: '',
						address: ''
					})
				}
				if (this.new_sub_device.value == '0303') {
					this.options[2].children.push({
						value: 'HZGEXT' + this.new_sub_device.station_id,
						label: this.new_sub_device.station_name
					})
					this.g.push({
						eid: 'HZGEXT' + this.new_sub_device.station_id,
						station_name: encodeURI(this.new_sub_device.station_name),
						longitude: '',
						latitude: '',
						creator: '',
						station_id: this.new_sub_device.station_id,
						message_push: '',
						address: ''
					})
				}

				this.new_sub_device = {}
				this.$message({
					type: 'success',
					message: '新建辅助设备成功，去选择吧'
				})
				this.dialogFormVisible = false
			},
			addRow() {
				if (this.air.length == 0) {
					for (let i = 0; i < 8; i++) {
						var list = {
							// rowNum: this.rowNum[i],
							depth: this.rowNum[i],
							air: '',
							water: '',
							sensorA: '',
							sensorB: '',
							sensorC: '',
							collectorC: '',
							collectorD: '',
							field: '',
							soil: '',
							humidity: '',
							texture: '',
							isShow:true
						};
						this.model.tableData.push(list)
					}
				}else{
					return false
				}
				
			},
			selectAll(selection){//全选
				if (selection.length == 8) {
					for (let i = 0, len = this.model.tableData.length; i < len; i++) {
						this.model.tableData[i].isShow = false
					}
				}else{
					for (let i = 0, len = this.model.tableData.length; i < len; i++) {
						this.model.tableData[i].isShow = true
					}
				}
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			parameter() {
				this.dialogParameterVisible = true
				this.addRow()
			},
			handleSelection(select, row) {
				if (select.length == 0) {
					for (let i = 0, len = this.model.tableData.length; i < len; i++) {
						this.model.tableData[i].isShow = true
					}
				}
				for (let j = 0, lens = this.model.tableData.length; j < lens; j++) {
					this.model.tableData[j].isShow = true
				}
				for (let i = 0, len = select.length; i < len; i++) {
					for (let j = 0, lens = this.model.tableData.length; j < lens; j++) {
						if (select[i].depth == this.model.tableData[j].depth) {
							this.model.tableData[j].isShow = false
						}
					}
				}
			},
			register(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						for (let i = 0; i < this.a_value.length; i++) {
							if (this.a_value[i][0] == '0301') {
								this.a.push(this.a_value[i][1])
							}
							if (this.a_value[i][0] == '0302') {
								this.c.push(this.a_value[i][1])
							}
							if (this.a_value[i][0] == '0303') {
								this.d.push(this.a_value[i][1])
							}
						}
						if (this.verification.station_id.length > 6) {
							this.$message({
								type: 'warning',
								message: '台站编号不能超过6位'
							})
							return
						}
						if (this.verification.addr_value > 65536) {
							this.$message({
								type: 'warning',
								message: '采集器地址范围小于65536'
							})
							return
						}
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/add_equipments', {
								e_code: '0102',
								basic_info: {
									eid: 'HZG04DZN2' + this.verification.addr_value,
									station_name: encodeURI(this.verification.station_name),
									longitude: this.new_lon_lat[0],
									latitude: this.new_lon_lat[1],
									creator: encodeURI(this.verification.creator),
									message_push: this.isradio,
									station_id: this.verification.station_id,
									address: encodeURI(this.address),
								},
								addr_value: this.verification.addr_value,
								sub_device: {
									'0301': this.a,
									'0302': this.c,
									'0303': this.d
								},
								new_sub_device: {
									'0301': this.e,
									'0302': this.f,
									'0303': this.g
								},
								extend_data: {
									'010202': this.depth.map(String),
									'0201': this.air.map(String),
									'0202': this.water.map(String),
									'0203': this.sensorA.map(String),
									'0204': this.sensorB.map(String),
									'0205': this.sensorC.map(String),
									'0206': this.collectorC.map(String),
									'0207': this.collectorD.map(String),
									'0208': this.yewuradio,
									'0209': this.fuwuvalue,
									'0210': this.field.map(String),
									'0211': this.soil.map(String),
									'0212': this.humidity.map(String),
									'0213': this.texture.map(String)
								}
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
											message: '新建失败'
										})
										break
									case 1:
										this.$router.push('/equipment')
										this.$message({
											type: 'success',
											message: '新建土壤水分设备成功',
										})
										break
									case 2:
										this.$message({
											type: 'warning',
											message: '设备编号重复'
										})
										break
									case 3:
										this.$message({
											type: 'warning',
											message: '设备名称重复'
										})
										break
									case 4:
										this.$message({
											type: 'warning',
											message: '采集器地址重复'
										})
										break
									case 5:
										this.$message({
											type: 'warning',
											message: '辅助设备编号重复'
										})
										break
									case 6:
										this.$message({
											type: 'warning',
											message: '辅助设备名称重复'
										})
										break
									case 7:
										this.$message({
											type: 'warning',
											message: '辅助设备eid重复'
										})
										break
								}
							})
							.catch(e => {
								console.log(e)
							})
					} else {
						this.$message({
							type: 'error',
							message: '下列参数不能为空'
						});
						return false;
					}
				});
			},
			editParameter() {
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
							}else{
								this.dialogParameterVisible = false
							}
						}
					}
				}
				this.depth = []
				this.air = []
				this.water = []
				this.sensorA = []
				this.sensorB = []
				this.sensorC = []
				this.collectorC = []
				this.collectorD = []
				this.field = []
				this.soil = []
				this.humidity = []
				this.texture = []
				for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
					this.depth.push(this.multipleSelection[i].depth)
					this.air.push(this.multipleSelection[i].air)
					this.water.push(this.multipleSelection[i].water)
					this.sensorA.push(this.multipleSelection[i].sensorA)
					this.sensorB.push(this.multipleSelection[i].sensorB)
					this.sensorC.push(this.multipleSelection[i].sensorC)
					this.collectorC.push(this.multipleSelection[i].collectorC)
					this.collectorD.push(this.multipleSelection[i].collectorD)
					this.field.push(this.multipleSelection[i].field)
					this.soil.push(this.multipleSelection[i].soil)
					this.humidity.push(this.multipleSelection[i].humidity)
					this.texture.push(this.multipleSelection[i].texture)
				}
			},
			handleSelectionChange(val){//多选数据
				this.multipleSelection = val
			},
			editParameters() {
				console.log(this.multipleSelection)
			},
			unconnected_assist_equip() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/unconnected_assist_equip')
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							localStorage.removeItem('user_admin')
							this.$router.push('/')
							return
						}
						this.options = res.data.records
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: "获取辅助设备数据失败"
						})
					})
			}
		},
		mounted() {
			this.unconnected_assist_equip()
		}
	}
</script>

<style scoped>
	@import url("../../static/css/header-tip.css");
	@import url("../../static/css/create_equ.css");

	.crea_pre /deep/ .el-table td,
	.crea_pre /deep/ .el-table th {
		padding: 8px 0px;
	}

	.crea_pre /deep/ .el-form-item {
		margin-bottom: 0px;
	}

	.box {
		width: 400px;
		height: 100%;
		margin: 0 auto;
		border-radius: .5rem;
		display: flex;
	}

	.el-icon-close:hover {
		cursor: pointer;
	}

	.login-card /deep/ .el-form-item__label {
		color: white;
	}
</style>
