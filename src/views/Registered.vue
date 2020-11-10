<template>
	<div>
		<div>
			<el-page-header @back="$router.push('/users')" content="新建用户"></el-page-header>
			<el-divider></el-divider>
		</div>
		<div class="box">
			<el-card class="login-card">
				<el-form @submit.native.prevent :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
					<el-form-item label="用户名" prop="username" :rules="{required: true, message: '用户名不能为空'}">
						<el-input maxlength="12" v-model.trim="ruleForm.username" onkeyup="value=value.replace(/[^\w_]/g,'');" placeholder="英文,数字组合"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input maxlength="15" type="password" v-model.trim="ruleForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="ageinPass">
						<el-input type="password" v-model.trim="ruleForm.ageinPass" placeholder="请再次输入密码" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div style="padding-top: 12px;">
					<span style="color: white;"><span style="color: #F56C6C;">*&nbsp;</span>用户权限：</span>
					<el-select v-model="is_admin" placeholder="请选择账户权限">
						<el-option v-for="item in admins" :key="item.key" :label="item.label" :value="item.key">
						</el-option>
					</el-select>
				</div>
				<br>
				<br>
				<el-button type="primary" @click="register('ruleForm')">新建</el-button>
			</el-card>
		</div>
	</div>

</template>

<script>
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.ageinPass !== '') {
						this.$refs.ruleForm.validateField('ageinPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				radio: '2',
				// password: '',
				ruleForm: {
					username: '',
					password: '',
					ageinPass: '',
				},
				rules: {
					password: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					ageinPass: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}]
				},
				value: '',
				service_code: '',
				is_admin: '',
				options: [],
				admins: [{
					key: '1',
					label: '游客账号'
				}, {
					key: '2',
					label: '管理员账号'
				}, {
					key: '3',
					label: '项目账号'
				}],
			}
		},
		watch: {
			'ruleForm.username'(new_name, old_name) {
				if (new_name.length == 12) {
					this.$message({
						type: 'warning',
						message: '用户名长度不能大于12'
					})
				}
			},
			'ruleForm.password'(new_pas, old_pas) {
				if (new_pas.length == 15) {
					this.$message({
						type: 'warning',
						message: '密码长度不能大于15'
					})
				}
			}
		},
		methods: {
			selectStation(value) {
				this.service_code = value
			},
			register(formName) {
				this.$refs[formName].validate((valid) => {
					if (this.ruleForm.password.length < 6) {
						this.$message({
							type: 'warning',
							message: '密码长度不能小于6'
						})
						return
					}
					if (this.is_admin.length == 0) {
						this.$message({
							type: 'warning',
							message: '账户权限不能为空'
						})
						return
					}
					if (valid) {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/add_user', {
								username: encodeURI(this.ruleForm.username),
								password: this.ruleForm.password,
								service_code: this.service_code,
								is_admin: this.is_admin
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
											message: '新建用户失败！'
										})
										break
									case 1:
										this.$router.push('/users')
										this.$message({
											type: 'success',
											message: '用户添加成功！'
										})
										break
									case 2:
										this.$message({
											type: 'warning',
											message: '用户已存在！'
										})
										break
									default:
										this.$message({
											type: 'warning',
											message: '业务号不存在！'
										})
										break
								}
							})
					} else {
						this.$message({
							type: 'error',
							message: '请检查两次输入的密码是否一致'
						});
						return false;
					}
				});
			},
			datas() {
				let service = JSON.parse(localStorage.getItem("service")) ? JSON.parse(localStorage.getItem("service")) : this.$store
					.state.service
				this.options = service
			}
		},
		mounted() {
			this.datas()
		}
	}
</script>

<style scoped>
	@import url("../../static/css/header-tip.css");
	@import url("../../static/css/create_equ.css");

	.header-tip {
		display: flex;
	}

	.box {
		width: 360px;
		margin: 0 auto;
		border-radius: .5rem;
		display: flex;
	}

	.el-form-item /deep/ .el-form-item__label {
		color: white;
	}
		
</style>
