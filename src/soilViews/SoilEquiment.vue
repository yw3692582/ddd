<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>设备信息</span>
		</div>
		<hr color="#04476e" />
		<div class="addNew">
			<el-button @click="addNew" icon="el-icon-plus">添加设备</el-button>
		</div>
		<div class="table-wrapper">
			<el-table border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)" :row-style="getRowClass"
			 :header-row-style="getRowClass" :header-cell-style="getRowClass" style="width: 100%">
				<el-table-column prop="station_name" label="站点名称" align="center">
				</el-table-column>
				<el-table-column prop="station_id" label="站点编号" align="center">
				</el-table-column>
				<el-table-column prop="addr_value" label="设备编号" align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" align="center">
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
			<el-pagination background :current-page.sync="currentPage1" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="getTableData.length"
			 @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<div class="equ_edit">
			<!-- 编辑设备 弹窗 -->
			<el-dialog :close-on-click-modal="false" title="编辑设备" :visible.sync="dialogEditVisible" @close="cancel">
				<el-form status-icon @submit.native.prevent>
					<el-form-item label="台站编号">
						<el-input v-model.trim="editform.station_id" onkeyup="value=value.replace(/[^\w_]/g,'');" style="width: 300px;"
						 placeholder="请输入台站编号" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备名称">
						<el-input v-model.trim="editform.station_name" style="width: 300px;" placeholder="请输入设备名称" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="设备经纬度,例:113.790921,34.748171">
						<el-input v-model="editform.lon_lat" @blur.prevent="b()" onkeyup="value=value.replace(/[^\d.,，]/g,'');"
						 placeholder="请输入经纬度" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="地址">
						<el-input v-model="editform.address" disabled placeholder="根据经纬度自动填充" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="是否发送报文">
						<el-radio-group v-model="editform.message_push">
							<el-radio :label='true'>是</el-radio>
							<el-radio :label='false'>否</el-radio>
						</el-radio-group>
					</el-form-item>
					<!-- <el-form-item label="已有辅助设备">
						<el-table :data="editform.sub_device">
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
					<el-form-item label="辅助设备">
						<el-cascader v-model="editform.a_value" placeholder="请选择" :options="options" :props="props" clearable></el-cascader>
					</el-form-item> -->
				</el-form>
				<div>
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="editYes" native-type="submit">修改</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 编辑信息 -->
		<div class="edit_dialog">
			<el-dialog :close-on-click-modal="false" @close="cancel" title="编辑设备" :visible.sync="dialogFormVisibleEdit" width="40%">
				<div style="display: grid;place-items: center;">
					<el-form :model="editform" style="width: 60%;">
						<el-form-item label="设备编号:" :label-width="formLabelWidth">
							<el-input v-model="editform.station_id" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="采集器地址:" :label-width="formLabelWidth">
							<el-input v-model="editform.addr_value" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="设备名称:" :label-width="formLabelWidth">
							<el-input v-model="editform.station_name" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="editYes">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 新增设备 -->
		<div class="add_dialog">
			<el-dialog :close-on-click-modal="false" @close="cancel" title="添加设备" :visible.sync="dialogFormVisibleAdd" width="40%">
				<div style="display: grid;place-items: center;">
					<el-form :model="addform" style="width: 60%;">
						<el-form-item label="设备编号:" :label-width="formLabelWidth">
							<el-input v-model="addform.station_id" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="采集器地址:" :label-width="formLabelWidth">
							<el-input v-model="addform.addr_value" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="设备名称:" :label-width="formLabelWidth">
							<el-input v-model="addform.station_name" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="addYes">确 定</el-button>
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
				dialogFormVisibleEdit: false,
				dialogFormVisibleAdd: false,
				pagesize: 12,
				currpage: 1,
				currentPage1:null,
				editform: { //编辑设备
					eid: '',
					station_id: '',
					station_name: '',
					addr_value: '',
					lon_lat: '',
					address: '',
					message_push: null,
				},
				new_lon_lat: [],
				addform: { //新增设备
					station_id: '',
					station_name: '',
					addr_value: ''
				},
				formLabelWidth: '120px',
				tableData: [],
				search: '',
			}
		},
		computed: {
			getTableData() {
				let searchTableInfo = this.search
				if (searchTableInfo) {
					this.currpage = 1
					this.currentPage1 = 1
					return this.tableData.filter(data => {
						return Object.keys(data).some(key => {
							return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
						})
					})
				}
				return this.tableData
			},
		},
		methods: {
			b() {
				for (let i = 0, len = this.editform.lon_lat.length; i < len; i++) {
					if (this.editform.lon_lat[i] == ',') {
						this.new_lon_lat = this.editform.lon_lat.split(',')
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
					if (this.editform.lon_lat[i] == '，') {
						this.new_lon_lat = this.editform.lon_lat.split('，')
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
						this.editform.address = res.data.regeocode.formatted_address
					})
					.catch(e => {
						this.$message({
							type: 'error',
							message: '获取地址失败，请刷新页面'
						})
					})
			},
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#081b39;color:white;border-color: #04476E;";
			},
			handleEdit(idnex, row) { //编辑设备
				this.dialogEditVisible = true
				Object.keys(this.editform).forEach(key => {
					this.editform[key] = row[key]
				})
			},
			handleDelete(index, row) { //删除设备
				this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						let headers = this.$ajax.defaults.headers.common
						headers['token'] = localStorage.getItem('token')
						headers['username'] = localStorage.getItem('user_name')
						this.$ajax.post('/ch_delete_equipments', {
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
									message: "删除用户信息失败"
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
			addNew() { //添加设备
				this.$router.push('/soilcreateEq')
			},
			cancel() { //dialog关闭时的操作
				this.dialogEditVisible = false
			},
			addYes() { //点击新建
				console.log(this.addform)
				return this.cancel()
			},
			editYes() { //点击修改
				console.log(this.editform)
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post('/ch_manage_equipments', {
						eid: this.editform.eid,
						e_code: '',
						station_name: encodeURI(this.editform.station_name),
						longitude: this.new_lon_lat[0],
						latitude: this.new_lon_lat[1],
						creator: '',
						message_push: this.editform.message_push.toString(),
						address: encodeURI(this.editform.address),
						station_id: this.editform.station_id,
						sub_device: {
							id: [],
							new_sub_device: [],
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
				return this.cancel()
			},
			initTable() { //初始化表格数据
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/ch_equip_all_info", {
						e_code: ''
					})
					.then(res => {
						let data = res.data.records
						for (let i = 0, len = data.length; i < len; i++) {
							data[i].addr_value = data[i].eid.slice(9)
							data[i].lon_lat = data[i].longitude + ',' + data[i].latitude
							data[i].create_time = moment(data[i].create_time * 1000).format("YYYY-MM-DD HH:mm:ss")
						}
						this.tableData = data
					})
					.catch(e => {
						console.log(e)
					})
			}
		},
		mounted() {
			this.initTable()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soilequiment.css");
	@import url("../../static/soilcss/table.css");
</style>
