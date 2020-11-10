<template>
	<div>
		<div>
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item>系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>项目管理</el-breadcrumb-item>
			</el-breadcrumb>
			<el-divider></el-divider>
			<el-button class="header-tip" @click="dialogCreateVisible = true" type="primary">新建项目</el-button>
		</div>
		<div class="table-wrapper">
			<el-table border :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%"
			 :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
				<el-table-column label="项目名称" prop="name" align="center"  min-width="200px">
				</el-table-column>
				<el-table-column label="项目地址" prop="address" align="center"  min-width="220px">
				</el-table-column>
				<el-table-column label="创建时间" prop="create_time" align="center" :formatter="formatter"  min-width="190px">
				</el-table-column>
				<el-table-column align="center"  min-width="250px">
					<template slot="header" slot-scope="scope">
						<el-input v-model="searchTableInfo" prefix-icon="el-icon-search" size="mini" placeholder="输入关键字搜索" />
					</template>
					<template slot-scope="scope">
						<el-button size="medium" plain type="primary" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="medium" plain type="danger" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
						<el-button size="medium" plain type="success" @click="handlEdit(scope.$index, scope.row)"><i class="el-icon-connection"></i></el-button>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background :current-page.sync="currentPage1" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="tableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<div class="edit">
			<!-- 编辑弹窗 -->
			<el-dialog :destroy-on-close='true' :close-on-click-modal="false" title="编辑信息" @close="cancels" :visible.sync="dialogFormVisible">
				<el-form>
					<el-form-item label="项目名称" label-width="70px">
						<el-input style="width: 217px;" v-model.trim="name" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="归属项目">
						<el-select v-model="value" clearable filterable placeholder="可输入项目搜索" @change="selectStation">
							<el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="归属地点">
						<el-cascader v-model="location_address" :options="$store.state.location" placeholder="可输入地区搜索" filterable></el-cascader>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancels">取 消</el-button>
					<el-button type="primary" :disabled="btn1 && btn2 && btn3?btn:btn == false" @click="edit()">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="crea_pro">
			<!-- 新建项目 -->
			<el-dialog :close-on-click-modal="false" title="新建项目" :visible.sync="dialogCreateVisible">
				<el-form @submit.native.prevent status-icon>
					<el-form-item label="项目编号" label-width="70px">
						<el-input style="width: 217px;" v-model.trim="code" placeholder="请输入项目编号"></el-input>
					</el-form-item>
					<el-form-item label="项目名称" label-width="70px">
						<el-input style="width: 217px;" v-model.trim="name" placeholder="请输入项目名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="归属地点">
						<el-cascader v-model="address" clearable :options="$store.state.location" placeholder="可输入地区搜索" filterable></el-cascader>
					</el-form-item>
					<el-form-item>
						项目归属:
						<el-radio-group v-model="radio">
							<el-radio label="1">是</el-radio>
							<el-radio label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="项目归属">
						<el-select v-model="value" :disabled="this.radio==='2'?true:false" clearable filterable placeholder="可输入项目搜索"
						 @change="selectStation">
							<el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="cancelRegister">取 消</el-button>
						<el-button type="primary" @click="createProject" native-type="submit">新建</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<div class="pro_gunlian">
			<!-- 修改关联弹窗 -->
			<el-dialog title="修改关联信息" :visible.sync="dialogRelatedVisible" @close="cancel">
				<el-form>
					<el-form-item label="关联用户" :label-width="formLabelWidth">
						<el-select v-model="value1" clearable placeholder="请选择" multiple>
							<el-option v-for="item in un_connected_user" :key="item.user_id" :label="item.user_name" :value="item.user_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="关联设备" :label-width="formLabelWidth">
						<el-select v-model="value2" clearable placeholder="请选择" multiple>
							<el-option v-for="items in un_connected_equip" :key="items.eid" :label="items.station_name" :value="items.eid">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="editPro">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	import page_size from '../../static/js/pages.js'
	export default {
		inject: ["reload"],
		data() {
			return {
				dialogCreateVisible: false,
				dialogFormVisible: false,
				dialogRelatedVisible: false,
				getSearchInfo: [],
				options: [],
				searchTableInfo: '',
				pagesize: page_size(),
				currpage: 1,
				currentPage1:null,
				code: '',
				name: '',
				old_name: '',
				value: '',
				old_val: '',
				status: '',
				location_address: [],
				old_add: [],
				location_code: [],
				btn: true,
				btn1: true,
				btn2: true,
				btn3: true,
				radio: '2',
				address: [],
				parent_code: '',
				formLabelWidth: '120px',
				un_connected_user: [],
				un_connected_equip: [],
				value1: [],
				old_val1: [],
				value2: [],
				old_val2: [],

				user_add: [],
				user_delete: [],
				equip_add: [],
				equip_delete: [],
				service_code: ''
			}
		},
		watch: {
			service(new_s, old_s) {
				this.getSearchInfo = new_s
			},
			// 监听项目名称是否改变
			name(newname, oldename) {
				if (newname == this.old_name) {
					this.btn1 = true
				} else {
					this.name = newname
					this.btn1 = false
				}
			},
			//监听台站是否发生改变
			value(val, oldval) {
				if (val == this.old_val) { //不变
					this.status = ''
					this.btn2 = true
				}
				if ((val !== '' && val !== null) && this.old_val == null) { //增加
					this.status = 1
					this.btn2 = false
				}
				if (val == null && this.old_val !== null) { //删除
					this.status = 1
					this.btn2 = false
				}
				if ((val !== null && this.old_val !== null) && (val !== this.old_val)) { //修改
					this.status = 1
					this.btn2 = false
				}

			},
			//监听归属地址是否发生改变
			location_address(new_address, old_address) {
				if (new_address[2] == this.old_add[2]) {
					this.btn3 = true
				} else {
					this.location_address = new_address
					this.btn3 = false
				}
			},
		},
		computed: {
			...mapState(["service"]),
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
		methods: {
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#071125;color:white;border-color: #04476E;";
			},
			cancelRegister() {
				this.code = ''
				this.name = ''
				this.address = []
				this.radio = '2'
				this.value = ''
				this.dialogCreateVisible = false
			},
			createProject() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/add_service', {
						code: this.code,
						name: encodeURI(this.name),
						location_code: this.address[2],
						parent_code: this.parent_code
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
									type: "info",
									message: "上级项目号不存在或非法"
								})
								break
							case 1:
								this.$router.go(0)
								this.$message({
									type: "success",
									message: "新建项目成功"
								})
								break
							case 2:
								this.reload()
								this.$message({
									type: "error",
									message: "新建项目失败"
								})
								break
							case 3:
								this.$message({
									type: "warning",
									message: "项目号已存在"
								})
								break
							case 4:
								this.$message({
									type: "warning",
									message: "项目名称已存在"
								})
								break
						}
					})
					.catch(error => {
						console.log(error)
					})
			},
			handleEdit(index, row) { //编辑
				this.dialogFormVisible = true
				this.name = row.name
				this.code = row.code
				this.old_name = row.name.concat()
				this.value = row.parent_code
				if (row.parent_code == null) {
					this.old_val = null
				} else {
					this.old_val = row.parent_code.concat()
				}
				this.location_address = row.location_code
				this.old_add = row.location_code.concat()
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/all_service', {
						code: this.code
					})
					.then(res => {
						if (res.data.code == -2) {
							alert('该账号无此权限，有需要请联系管理员!')
							return
						}
						this.options = res.data.service
					})
					.catch(e => {
						this.$message({
							type: "error",
							message: "获取数据失败"
						})
					})
			},
			cancels() {
				this.dialogFormVisible = false
				this.name = ''
				this.value = ''
				this.code = ''
				this.location_address = []
			},
			edit() { //修改
				if (this.name == this.old_name) {
					this.name = ''
				}
				if (this.value == this.old_val) {
					this.value = ''
				}
				if (this.location_address[2] == this.old_add[2]) {
					this.location_address = ''
				} else {
					this.location_address = this.location_address[2]
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/modify_service', {
						code: this.code,
						name: encodeURI(this.name),
						parent_code: this.value,
						location_code: this.location_address,
						status: this.status
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
									type: "info",
									message: "上级项目号不存在或非法"
								})
								break
							case 1:
								this.$router.go(0)
								this.$message({
									type: "success",
									message: "修改信息成功"
								})
								break
							case 2:
								this.reload()
								this.$message({
									type: "error",
									message: "修改信息失败"
								})
								break
							case 3:
								this.$message({
									type: "warning",
									message: "项目号已存在"
								})
								break
							case 4:
								this.$message({
									type: "warning",
									message: "项目名称已存在"
								})
								break
						}
					})
					.catch(e => {
						this.$message({
							type: "error",
							message: "修改信息失败"
						})
					})
				this.dialogFormVisible = false
			},
			handleDelete(index, row) { //删除
				this.code = row.code
				this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/delete_service', {
								code: this.code
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
								this.$router.go(0)
								this.$message({
									type: "success",
									message: "删除项目信息成功"
								})
							})
							.catch(e => {
								this.$message({
									type: "error",
									message: "删除项目信息失败"
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
			handlEdit(index, row) { //修改关联
				this.dialogRelatedVisible = true
				this.service_code = row.code
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/objects_under_service', {
						service_code: this.service_code
					})
					.then(res => {
						if (res.data.code == -2) {
							alert('该账号无此权限，有需要请联系管理员!')
							return
						}
						this.un_connected_user = res.data.records.un_connected_user
						for (let i = 0; i < this.un_connected_user.length; i++) {
							if (this.un_connected_user[i].selected == true) {
								this.value1.push(this.un_connected_user[i].user_id)
							}
						}
						this.un_connected_equip = res.data.records.un_connected_equip
						for (let i = 0; i < this.un_connected_equip.length; i++) {
							if (this.un_connected_equip[i].selected == true) {
								this.value2.push(this.un_connected_equip[i].eid)
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			editPro() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/manage_connection', {
						service_code: this.service_code,
						user_id: this.value1,
						eid: this.value2
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
									type: 'error',
									message: '修改关联失败'
								})
								break
							case 1:
								this.reload()
								this.$message({
									type: 'success',
									message: '修改关联成功'
								})
								break
							default:
								this.reload()
								this.$message({
									type: 'warning',
									message: '错误警告'
								})
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			cancel() {
				this.value1 = []
				this.value2 = []
				this.dialogRelatedVisible = false
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			selectStation(value) {
				this.parent_code = value
			},
			formatter(row, column) {
				let date = row[column.property];
				if (date == undefined) {
					return "";
				}
				return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
			},
			datas() {
				let service = JSON.parse(localStorage.getItem("service")) ? JSON.parse(localStorage.getItem("service")) : this.$store
					.state.service
				this.getSearchInfo = service
				this.options = service
			}
		},
		mounted() {
			this.datas()
		},
	}
</script>

<style scoped>
	@import url("../../static/css/header-tip.css");
	@import url("../../static/css/update.css");
	@import url("../../static/css/table.css");
	.el-input--mini /deep/ .el-input__inner {
		background-color: #04476E;
		border-color: #04476E;
		color: #FFFFFF;
	}
</style>
