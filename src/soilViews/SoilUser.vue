<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>用户信息</span>
		</div>
		<hr color="#04476e" />
		<div class="addNew">
			<el-button @click="addNew" icon="el-icon-plus">添加用户</el-button>
		</div>
		<div class="table-wrapper">
			<el-table border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)" :row-style="getRowClass"
			 :header-row-style="getRowClass" :header-cell-style="getRowClass" style="width: 100%">
				<el-table-column prop="user_name" label="用户名称" align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" align="center" :formatter="formatter">
				</el-table-column>
				<el-table-column align="center">
					<template slot="header" slot-scope="scope">
						<el-input prefix-icon="el-icon-search" v-model="search" size="mini" placeholder="输入关键字搜索" />
					</template>
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="small" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
				</el-table-column>
			</el-table>
			<el-pagination background :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="getTableData.length"
			 @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<!-- 编辑用户 -->
		<div class="edit_dialog">
			<el-dialog :close-on-click-modal="false" @close="cancel" title="编辑用户" :visible.sync="dialogFormVisibleEdit" width="40%">
				<div style="display: grid;place-items: center;">
					<el-form :model="editform" style="width: 60%;">
						<el-form-item label="用户名称:" :label-width="formLabelWidth">
							<el-input v-model="editform.user_name" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="editYes">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 新增用户 -->
		<div class="add_dialog">
			<el-dialog :close-on-click-modal="false" @close="cancel" title="添加用户" :visible.sync="dialogFormVisibleAdd" width="40%">
				<div style="display: grid;place-items: center;">
					<el-form :model="addform" style="width: 60%;" :rules="rules" ref="addform">
						<el-form-item label="用户名称:" prop="user_name" :rules="{required: true, message: '用户名不能为空'}" :label-width="formLabelWidth">
							<el-input v-model="addform.user_name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="密码:" prop="password" :label-width="formLabelWidth">
							<el-input v-model="addform.password" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="确认密码:" prop="agin_password" :label-width="formLabelWidth">
							<el-input v-model="addform.agin_password" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="addYes('addform')">确 定</el-button>
				</div>
			</el-dialog>
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
					if (this.addform.agin_password !== '') {
						this.$refs.addform.validateField('agin_password');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.addform.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				dialogFormVisibleEdit: false,
				dialogFormVisibleAdd: false,
				pagesize: 12,
				currpage: 1,
				rules: {//密码验证
					password: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					agin_password: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}]
				},
				editform: { //编辑用户
					user_name: '',
				},
				addform: { //新增用户
					user_name: '',
					password: '',
					agin_password: ''
				},
				formLabelWidth: '120px',
				tableData: [],
				search: ''
			}
		},
		computed: {
			getTableData() {
				let searchTableInfo = this.search
				if (searchTableInfo) {
					return this.tableData.filter(data => {
						return Object.keys(data).some(key => {
							return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
						})
					})
				}
				return this.tableData
			}
		},
		methods: {
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#081b39;color:white;border-color: #04476E;";
			},
			handleEdit(idnex, row) { //编辑设备
				this.dialogFormVisibleEdit = true
				Object.keys(this.editform).forEach(key => {
					this.editform[key] = row[key]
				})
			},
			handleDelete(index, row) { //删除设备
				console.log(row)
			},
			addNew() { //添加设备
				this.dialogFormVisibleAdd = true
			},
			cancel() { //dialog关闭时的操作
				this.dialogFormVisibleAdd = false
				this.dialogFormVisibleEdit = false
				this.addform = {}
				this.editform = {}
			},
			addYes(formName) { //点击新建
				this.$refs[formName].validate((valid) => {
					if (this.addform.password.length < 6) {
						this.$message({
							type: 'warning',
							message: '密码长度不能小于6'
						})
						return
					}
					if (valid) {
						console.log(this.addform)
						return this.cancel()
					} else {
						this.$message({
							type: 'error',
							message: '请检查两次输入的密码是否一致'
						});
						return false;
					}
				});
			},
			editYes() { //点击修改
				console.log(this.editform)
				return this.cancel()
			},
			initTable() { //初始化表格数据
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.get('/user_list')
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let Data = res.data.user
						this.tableData = Data
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: "获取用户信息失败"
						})
					})
			},
			formatter(row, column){//格式化时间
				return moment(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
			}
		},
		mounted() {
			this.initTable()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soilusers.css");
	@import url("../../static/soilcss/table.css");
</style>
