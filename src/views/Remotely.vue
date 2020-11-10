<template>
	<el-container>
		<el-aside width="350px">
			<el-tabs stretch type="border-card" @tab-click="handleClick">
				<el-tab-pane label="气象设备">
					<el-input prefix-icon="el-icon-search" style="display: flex;" placeholder="请输入内容搜索" v-model="search1"></el-input>
					<el-table :row-key="getRowKeys" ref="multipleTable1" :data="tableData1.filter(data => !search1 || data.station_name.toLowerCase().includes(search1.toLowerCase()))"
					 style="width:100%;" height="600px" @selection-change="handleSelectionChange">
						<el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
						<el-table-column label="设备名称" align="center" prop="station_name"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button size="mini" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-dialog title="修改设备编号" :close-on-click-modal="false" :visible.sync="dialogFormVisible" @close="cancels">
					<el-form>
						<el-form-item label="设备编号" label-width="70px">
							<el-input style="width: 217px;" v-model="station_id"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="cancels">取 消</el-button>
						<el-button type="primary" :disabled="btn" @click="edit()">确 定</el-button>
					</div>
				</el-dialog>
				<el-tab-pane label="土壤设备">
					<el-input prefix-icon="el-icon-search" style="display: flex;" placeholder="请输入内容搜索" v-model="search2"></el-input>
					<el-table :row-key="getRowKeys" ref="multipleTable2" :data="tableData2.filter(data => !search2 || data.station_name.toLowerCase().includes(search2.toLowerCase()))"
					 style="width:100%;" height="600px" @selection-change="handleSelectionChange">
						<el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
						<el-table-column label="设备名称" align="center" prop="station_name"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button size="mini" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-aside>
		<el-main>
			<el-input style="font-size: 18px;" type="textarea" disabled :rows="20" v-model="textarea">
			</el-input>
			<div style="padding-top: 20px;">
				<el-button type="primary" @click="lookTime">查看时间</el-button>
				<el-button type="primary" @click="onTime">对时</el-button>
				<el-button type="primary" @click="drawer = true">补抄</el-button>
			</div>
		</el-main>
		<el-drawer :visible.sync="drawer" :direction="direction">
			请选择补抄时间：
			<el-date-picker v-model="times" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期"
			 end-placeholder="结束日期">
			</el-date-picker>
			<el-button type="primary" @click="makeUp">确定补抄</el-button>
		</el-drawer>
	</el-container>
</template>

<script>
	export default {
		inject: ['reload'],
		data() {
			return {
				dialogFormVisible: false,
				tableData1: [],
				tableData2: [],
				multipleSelection: [],
				search1: '',
				search2: '',
				textarea: '',
				direction: 'btt',
				drawer: false,
				times: [1435723200000, 1593576000000],
				ws: null,
				my_log: '',
				eid: '',
				station_id: '',
				old_sta_id: '',
				btn: true,
				flag:false,
				key:''
			}
		},
		watch: {
			station_id(new_val, old_val) {
				if (new_val == this.old_sta_id) {
					this.btn = true
				} else {
					this.btn = false
				}
			}
		},
		methods: {
			// 取消
			cancels() {
				this.dialogFormVisible = false
				this.station_id = ''
				this.eid = ''
			},
			//修改
			edit() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/set_weather_id", {
						eid: this.eid,
						station_id: this.station_id
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
									message: '已将您的修改需求下发至设备,请稍作等待'
								})
								break
							default:
								this.$message({
									type: 'success',
									message: '已将您的修改需求下发至设备,请稍作等待'
								})
						}
						this.reload()
					})
					.catch(e => {
						console.log(e);
					})
			},
			// 保持selection选中状态
			getRowKeys(row) {
				return row.eid
			},
			// 编辑弹窗
			handleEdit(index, row) {
				this.dialogFormVisible = true
				this.station_id = row.station_id
				this.eid = row.eid
				this.old_sta_id = row.station_id.concat()
			},
			// tabs切换清空之前的
			handleClick(tab, event) {
				if (tab.index == 0) {
					this.$refs.multipleTable2.clearSelection()
				} else {
					this.$refs.multipleTable1.clearSelection()
				}
			},
			// 选中的值
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 判断设备类型
			types(){
				if(this.multipleSelection[0].types == '1'){
					this.identity = '1'
					return this.identity
				}else{
					this.identity = '2'
					return this.identity
				}
			},
			// 查看时间
			lookTime() {
				if (this.multipleSelection.length == 0) {
					this.$message({
						type: 'warning',
						message: '请选择设备'
					})
					return
				}
				let identity  = this.types()
				let eid_list = []
				for (let i = 0; i < this.multipleSelection.length; i++) {
					eid_list.push(this.multipleSelection[i].eid)
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/get_time", {
						eid_list: eid_list,
						key:this.key,
						identity:identity
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
									message: '查看时间' + res.data.msg
								})
								break
							default:
								this.$message({
									type: 'success',
									message: '查看时间' + res.data.msg
								})
						}
						// console.log(res.data)
						// let data = res.data.records
						// for (let key in data) {
						// 	data[key] = moment(data[key] * 1000).format("YYYY-MM-DD HH:mm:ss");
						// }
						// data = JSON.stringify(data)
						// let len = data.length - 1
						// let nowTimes = moment().format("YYYY年MM月DD日 HH:mm:ss")
						// data = nowTimes + data.slice(1, len).replace(/,/g, '\n'+ nowTimes)
						// this.textarea = this.textarea + '\n'+ data
					})
					.catch(e => {
						console.log(e);
					})
			},
			// 对时
			onTime() {
				if (this.multipleSelection.length == 0) {
					this.$message({
						type: 'warning',
						message: '请选择设备'
					})
					return
				}
				let identity  = this.types()
				let eid_list = []
				for (let i = 0; i < this.multipleSelection.length; i++) {
					eid_list.push(this.multipleSelection[i].eid)
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/get_time", {
						eid_list: eid_list,
						key: this.key,
						identity:identity
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
									message: '对时' + res.data.msg
								})
								break
							default:
								this.$message({
									type: 'success',
									message: '对时' + res.data.msg
								})
						}
					})
					.catch(e => {
						console.log(e);
					})
			},
			//补抄
			makeUp() {
				if (this.multipleSelection.length == 0) {
					this.$message({
						type: 'warning',
						message: '请选择设备'
					})
					return
				}
				let identity  = this.types()
				let eid_list = []
				for (let i = 0; i < this.multipleSelection.length; i++) {
					eid_list.push(this.multipleSelection[i].eid)
				}
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/re_write_data", {
						"start_time":this.times[0],
						"end_time":this.times[1], 
						"eid_list":eid_list, 
						"key":this.key, 
						"identity":identity
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
									message: '补抄' + res.data.msg
								})
								break
							default:
								this.$message({
									type: 'success',
									message: '补抄' + res.data.msg
								})
						}
					})
					.catch(e => {
						console.log(e);
					})
			},
			// WebSocket
			// test() {
			// 	this.ws = new WebSocket('ws://172.18.2.168:1234/send_socket')
			// 	this.ws.onmessage = this.handle_soke_msg
			// },
			// 关闭WebSocket
			// col(){
			// 	this.ws.close()
			// },
			initWebSocket(){
				let wsuri = "ws://121.36.193.217:10002/ws/websocket_connect"
				this.ws = new WebSocket(wsuri)
				// 之后需要放在点击查看时间/对时后再进行
				this.ws.onmessage = this.websocketonmessage
				// this.ws.onerror = this.websocketonerror
				this.ws.onclose = this.websocketclose
			},
			// handle_soke_msg
			websocketonmessage(e) {
				let re_msg = e.data
				if (this.flag == false) {
					let index = re_msg.indexOf("key")
					if (index != -1) {
						this.key = re_msg.slice(3)
					}
					this.flag = true
				}
				let nowTimes = moment().format("YYYY年MM月DD日 HH:mm:ss")
				this.textarea = this.textarea + '\n' + nowTimes + re_msg 
			},
			// 连接失败时重新连接
			// websocketonerror() {
			// 	console.log('重新连接成功')
			// 	this.initWebSocket()
			// },
			// 断开链接后报错
			websocketclose(e) {
				console.log('断开连接', e)
			},
			equip_all_info(){
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/equip_all_info", {
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
						for (let i = 0; i < res.data.records.length; i++) {
							if (res.data.records[i].e_code == '0101') {
								this.tableData1.push({
									eid: res.data.records[i].eid,
									station_name: res.data.records[i].station_name,
									station_id: res.data.records[i].station_id,
									types:'1'
								})
							}
							if (res.data.records[i].e_code == '0102') {
								this.tableData2.push({
									eid: res.data.records[i].eid,
									station_name: res.data.records[i].station_name,
									station_id: res.data.records[i].station_id,
									types:'2'
								})
							}
						}
					})
					.catch(e => {
						console.log(e);
					})
			}
		},
		mounted() {
			// 进页面建立websocket链接
			this.initWebSocket()
			this.equip_all_info()
		},
		destroyed() {//跳转路由时关闭链接
			this.ws.close()
		},
	}
</script>

<style scoped>
	.el-container .el-main {
		padding: 0px 0px 0px 20px;
	}
</style>
