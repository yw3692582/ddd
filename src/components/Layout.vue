<template>
	<el-container>
		<el-header height="100px">
			<img src="/static/img/u4.png" style="padding: 26px 0px 0px 26px;" height="37" width="50" />
			<div style="font-size: 28px;color:#3DCEE9; padding-left: 20px;line-height: 100px;">气象监控平台</div>
			<span style="color: #ECECEC;padding-left: 200px; font-size: 18px;font-weight: 500;line-height: 100px;" id="time">{{data}}</span>
			<div style="position: absolute;right: 3%;display: flex;">
				<div style="padding: 20px 5px 0px 0px;line-height: 100px;">
					<el-avatar :size="50" src="static/img/hearder.png"></el-avatar>
				</div>
				<div style="padding-top: 40px;">
					<el-dropdown placement="bottom-start">
						<span class="el-dropdown-link">
							<span style="font-size: 16px; color: white;">{{this.$store.state.user_name}}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>
								<span @click="to_message">信息</span>
								<el-badge :value="newMassage" class="mark" />
							</el-dropdown-item>
							<el-dropdown-item>
								<el-link @click="$router.push('/warning')">智能预警</el-link>
							</el-dropdown-item>
							<el-dropdown-item>
								<el-link @click="exit">退出登录</el-link>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</el-header>
		<el-container>
			<el-aside width="">
				<el-menu class="el-menu-vertical-demo" background-color="#081b39" text-color="#fff" active-text-color="#3DCEE9"
				 router>
					<el-menu-item index="/console">
						<img src="/static/img/u16.png" height="28px" width="30px">
						<span slot="title">数据查询</span>
					</el-menu-item>
					<el-menu-item index="/statistical">
						<img src="/static/img/statistical.png" height="30px" width="30px">
						<span slot="title">数据统计</span>
					</el-menu-item>
					<el-menu-item index="/warning" style="display: none;">
						<img src="/static/img/warning.png" />
						<span slot="title">预警平台</span>
					</el-menu-item>
					<el-menu-item index="/status">
						<img src="/static/img/u17.png" height="30px" width="30px">
						<span slot="title">状态监控</span>
					</el-menu-item>
					<el-menu-item index="/remotely" v-if="$store.state.user_name == 'admin' ? true:false">
						<img src="/static/img/u18.png" height="30px" width="30px">
						<span slot="title">远程调试</span>
					</el-menu-item>
					<el-submenu index="#" v-if="$store.state.user_name == 'admin' ? true:false">
						<template slot="title">
							<img src="/static/img/u14.png" height="30px" width="30px">
							<span>系统管理</span>
						</template>
						<el-menu-item index="/project">项目管理</el-menu-item>
						<el-menu-item index="/equipment">设备管理</el-menu-item>
						<el-menu-item index="/users">用户管理</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<div>
					<router-view v-if="isRouterAlive"></router-view>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		provide: function() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				isRouterAlive: true,
				timer: null,
				data: 0,
				newMassage:3
			}
		},
		methods: {
			reload: function() {
				this.isRouterAlive = false;
				this.$nextTick(function() {
					this.isRouterAlive = true
				})
			},
			exit() {
				this.$message({
					type: 'success',
					message: '退出成功！',
					showClose: true
				})
				localStorage.removeItem('token')
				localStorage.removeItem('user_name')
				localStorage.removeItem('user_admin')
				this.$router.push("/")
			},
			to_message(){
				this.$router.push('/message')
				this.newMassage = 0
			},
			time() {
				this.data = moment().format("YYYY年MM月DD日 HH:mm:ss")
			},
			listenPage() {
				window.onbeforeunload = function(e) {
					e = e || window.event
					if (e) {
						e.returnValue = '关闭提示'
					}
					return '关闭提示'
				}
				this.$router.push('/main')
			},
			show_dict() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/show_dict")
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						let show_dict = JSON.stringify(res.data.records)
						localStorage.setItem("show_dict", show_dict)
					})
					.catch(e => {
						console.log(e);
					})
			},
			all_service() {
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/all_service", {
						code: ""
					})
					.then(res => {
						if (res.data.code == -1) {
							alert('登录已失效,请重新登录!')
							localStorage.removeItem('token')
							localStorage.removeItem('user_name')
							this.$router.push('/')
							return
						}
						this.$store.commit("handleService", res.data.service)
						localStorage.setItem("service", JSON.stringify(res.data.service))
					})
					.catch(e => {
						console.log(e);
					})
			},
		},
		mounted() {
			this.timer = setInterval(this.time, 1000);
			// 存储要素字典
			this.show_dict()
			// 获取项目信息
			this.all_service()
			
		},
		beforeDestroy() {
			clearInterval(this.timer);
		},
	}
</script>

<style>
	@import url("../../static/css/layout.css");
</style>
