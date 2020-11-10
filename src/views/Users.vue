<template>
	<div>
		<div>
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item>系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
			<el-divider></el-divider>
			<el-button class="header-tip" @click="$router.push('/registered')" type="primary">新建用户</el-button>
		</div>
		<div class="table-wrapper">
			<el-table border :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
			 style="width: 100%;font-size: 16px;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
				<el-table-column label="用户名称" prop="user_name" align="center"  min-width="195px">
				</el-table-column>
				<el-table-column label="创建时间" prop="create_time" align="center" :formatter="formatter"  min-width="195px">
				</el-table-column>
				<el-table-column align="center"  min-width="205px">
					<template slot="header" slot-scope="scope">
						<el-input v-model="searchTableInfo" prefix-icon="el-icon-search" size="mini" placeholder="输入关键字搜索" />
					</template>
					<template slot-scope="scope">
						<el-button size="medium" plain type="danger" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
						<el-button size="medium" plain type="danger" @click="resetPassword(scope.$index, scope.row)"><i class="el-icon-lock"></i></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background :current-page.sync="currentPage1" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="tableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import page_size from '../../static/js/pages.js'
	export default {
		inject: ["reload"],
		data() {
			return {
				getSearchInfo: [],
				searchTableInfo: '',
				pagesize: page_size(),
				currpage: 1,
				currentPage1:null,
				service: '',
				old_name: '',
				username: '',
				old_service: '',
				options: [],
			}
		},
		computed:{
			tableData() {
				let searchTableInfo = this.searchTableInfo
				if (searchTableInfo) {
					this.currpage = 1
					this.currentPage1 = 1
					return this.getSearchInfo.filter(data => {
						return Object.keys(data).some(key => {
							return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
						})
					})
				}
				return this.getSearchInfo
			}
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
			// 编辑
			handleEdit(index, row) {
				this.dialogFormVisible = true
				this.username = row.user_name
				this.old_name = row.user_name.concat()
				this.service = row.service_code
				this.reset = false
				this.btn = true
				if (row.service_code == null) {
					this.old_service = null
				} else {
					this.old_service = row.service_code.concat()
				}
				if (this.btn1 == false) {
					this.btn == false
				}
				this.id = row.id
			},
			selectStation(value) {
				this.form.service_code = value
			},
			handleDelete(index, row) {//删除用户
				if (row.service_code == null) {
					this.service_code = 0
				} else {
					this.service_code = 1
				}
				this.id = row.id
				this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/delete_user', {
								id: this.id,
								service_code: this.service_code,
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
											message: '删除失败!'
										})
										break
									default:
										this.$message({
											type: 'success',
											message: '删除成功!'
										})
								}
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
			resetPassword(index, row){//重置密码
				this.$confirm('此操作将重置该用户的登录密码, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/modify_user', {
								id: row.id,
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
										this.reload()
										this.$message({
											type: "error",
											message: "重置密码失败！"
										})
										break
									case 1:
										this.reload()
										this.$message({
											type: "success",
											message: "重置密码成功！"
										})
										break
								}
							})
							.catch(e => {
								this.$message({
									type: "error",
									message: "重置密码失败！"
								})
								this.reload()
							})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消重置密码！'
						})
					})
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			formatter(row, column) {
				let date = row[column.property];
				if (date == undefined) {
					return "";
				}
				return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
			},
			user_list() {
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
						this.getSearchInfo = Data
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: "获取用户信息失败"
						})
					})
				let service = JSON.parse(localStorage.getItem("service")) ? JSON.parse(localStorage.getItem("service")) : this.$store
					.state.service
				this.options = service
			},
		},
		mounted() {
			this.user_list()
		}
	}
</script>
<style scoped>
	@import url("../../static/css/update.css");
	@import url("../../static/css/table.css");
	@import url("../../static/css/header-tip.css");
	.el-input--mini /deep/ .el-input__inner {
		background-color: #04476E;
		border-color: #04476E;
		color: #FFFFFF;
	}
</style>
