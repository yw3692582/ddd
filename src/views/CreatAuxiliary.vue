<template>
	<div>
		<div>
			<el-page-header @back="$router.push('/equipment')" content="新建辅助设备"></el-page-header>
			<el-divider></el-divider>
		</div>
		<div class="box">
			<el-card class="login-card">
				<el-form @submit.native.prevent status-icon :model="verification" ref="verification">
					<el-form-item label="辅助设备" prop="value" :rules="{required: true, message:'设备类型不能为空'}">
						<el-select class="el_select" v-model="verification.value" placeholder="请选择">
							<el-option v-for="item in $store.state.Auxiliary" :key="item.a_code" :label="item.label" :value="item.a_code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备编号" prop="station_id" :rules="verification.rules">
						<el-input v-model.trim="verification.station_id" placeholder="请输入设备编号" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备名称" prop="station_name" :rules="{required: true, message:'设备名称不能为空'}">
						<el-input v-model.trim="verification.station_name" placeholder="请输入设备名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="创建人员" prop="creator" :rules="{required: true, message:'设备创建者名称不能为空'}">
						<el-input v-model.trim="verification.creator" placeholder="请输入创建者名称" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="register('verification')">新建</el-button>
			</el-card>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				verification: {
					value: '',
					station_id: '',
					station_name: '',
					creator: '',
					rules: {
						required: true,
						message: '参数不能为空'
					}
				},
			}
		},
		watch: {

		},
		methods: {
			register(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/add_equipments', {
								e_code: this.verification.value,
								basic_info: {
									eid: 'HZGEXT' + this.verification.station_id,
									station_name: encodeURI(this.verification.station_name),
									longitude: '',
									latitude: '',
									creator: encodeURI(this.verification.creator),
									message_push: '',
									station_id: this.verification.station_id,
									address: '',
								},
								addr_value: '',
								sub_device: {
									'0301': [],
									'0302': [],
									'0303': []
								},
								new_sub_device: {
									'0301': [],
									'0302': [],
									'0303': []
								},
								extend_data: ''
							})
							.then(res => {
								switch(res.data.code){
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
											message: '新建辅助设备成功',
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
									message: '页面异常,请刷新重试'
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
			}
		},
	}
</script>

<style scoped>
	@import url("../../static/css/header-tip.css");
	@import url("../../static/css/create_equ.css");	
	.box {
		width: 500px;
		margin:0 auto;
		border-radius: .5rem;
		display: flex;
	}

	.el_select {
		width: 70%;
	}

	.el-input {
		width: 70%;
	}
	
	.login-card /deep/ .el-form-item__label {
		color: white;
	}
	
</style>
