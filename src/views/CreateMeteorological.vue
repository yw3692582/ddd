<template>
	<div>
		<div>
			<el-page-header @back="$router.push('/equipment')" content="新建气象设备"></el-page-header>
			<el-divider></el-divider>
		</div>
		<div class="box">
			<el-card class="login-card">
				<el-form @submit.native.prevent status-icon :model="verification" ref="verification">
					<el-form-item label="设备编号" prop="station_id" :rules="verification.rules">
						<el-input v-model.trim="verification.station_id" maxlength="6" onkeyup="value=value.replace(/[^\w_]/g,'');"
						 placeholder="字母数字组合,长度为6" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备名称" prop="station_name" :rules="{required: true, message: '设备名称不能为空'}">
						<el-input v-model.trim="verification.station_name" placeholder="请输入设备名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备经纬度,例:113.790921,34.748171" prop="lon_lat" :rules="verification.rules">
						<el-input v-model="verification.lon_lat" @blur.prevent="b()" onkeyup="value=value.replace(/[^\d.,，]/g,'');"
						 placeholder="请输入经纬度" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="地址">
						<el-input v-model="address" disabled placeholder="根据经纬度自动填充" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备创建者" prop="creator" :rules="{required: true, message: '设备创建者不能为空'}">
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
				</el-form>
				<div>
					<el-button type="primary" @click="register('verification')" native-type="submit">新建</el-button>
				</div>
			</el-card>
		</div>
		<div class="crea_met_fuzhu">
			<!-- 新建辅助设备弹窗 -->
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
					<el-button @click="cancel()">取 消</el-button>
					<el-button type="primary" @click="edit()">确 定</el-button>
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
				props: {
					multiple: true
				},
				verification: {
					station_id: '',
					station_name: '',
					creator: '',
					lon_lat: '',
					rules: {
						required: true,
						message: '参数不能为空'
					}
				},
				new_lon_lat: '',
				isradio: '2',
				radio: '2',
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
				g: []
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
			cancel() {
				this.new_sub_device = {}
				this.dialogFormVisible = false
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
						creator: encodeURI(this.verification.creator),
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
						creator: encodeURI(this.verification.creator),
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
						creator: encodeURI(this.verification.creator),
						station_id: this.new_sub_device.station_id,
						message_push: '',
						address: ''
					})
				}

				this.new_sub_device = {}
				this.$message({
					type: 'success',
					message: '新建成功，去选择吧'
				})
				this.dialogFormVisible = false
			},
			/*
				if e_code == '0102':
				    eid = 'HZG04DZN2' + addr_value
				else:
				    if e_code == '0301' or e_code == '0302' or e_code == '0303':
				        eid = 'HZGEXT' + basic_info['station_id']
				    else:
				        eid = 'HZG07' + basic_info['station_id'] + '002'
			*/
			register(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.verification.station_id.length != 6) {
							this.$message({
								type: 'warning',
								message: '设备编号必须为6位'
							})
							return
						}
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
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/add_equipments', {
								e_code: '0101',
								basic_info: {
									eid: 'HZG07' + this.verification.station_id + '002',
									station_name: encodeURI(this.verification.station_name),
									longitude: this.new_lon_lat[0],
									latitude: this.new_lon_lat[1],
									creator: encodeURI(this.verification.creator),
									message_push: this.isradio,
									station_id: this.verification.station_id,
									address: encodeURI(this.address),
								},
								addr_value: '',
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
								extend_data: ''
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
											message: '新建气象设备成功',
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
											message: '设备识别号重复'
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
								this.$message({
									type: 'error',
									message: '添加失败'
								})
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

	.login-card .el-form-item /deep/ .el-form-item__label {
		color: white;
	}

	.box {
		width: 400px;
		margin: 0 auto;
		border-radius: .5rem;
		display: flex;
	}
</style>
