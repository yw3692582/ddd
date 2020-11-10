<template>
	<el-container>
		<el-header height="45px">
			<!-- <img src="/static/img/u4.png" style="padding: 26px 0px 0px 26px;" height="37" width="50" /> -->
			<i style="line-height: 45px;font-size: 24px;color: white;" class="icon ion-leaf"></i>
			<div style="font-size: 24px;color:#3DCEE9;font-family: Arial,'微软雅黑','华文细黑'; padding-left: 20px;line-height: 45px;">重庆土壤墒情监测系统</div>
			<span style="color: #ECECEC;padding-left: 200px; font-size: 18px;font-weight: 500;line-height: 45px;" id="time">{{data}}</span>
			<div style="position: absolute;right: 3%;display: flex;">
				<div style="padding: 5px 5px 0px 0px;line-height: 45px;">
					<el-avatar :size="30" src="static/img/hearder.png"></el-avatar>
				</div>
				<div style="padding-top: 15px;">
					<el-dropdown placement="bottom-start">
						<span class="el-dropdown-link">
							<span style="font-size: 16px; color: white;">{{this.$store.state.user_name}}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
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
				<el-collapse accordion style="min-width: 10vw;">
					<el-collapse-item title="运行监控" name="1">
						<ul>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilconsole')">地图监控</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilstatus')">状态监控</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilarrival')">到报监控</span>
							</li>
						</ul>
					</el-collapse-item>
					<el-collapse-item title="数据检索" name="2">
						<ul>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilreal')">实时数据</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilstatistics')">统计数据</span>
							</li>
						</ul>
					</el-collapse-item>
					<el-collapse-item title="墒情发布" name="3">
						<ul>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilmoisture')">墒情展示</span>
							</li>
						</ul>
					</el-collapse-item>
					<el-collapse-item title="数据分析" name="4">
						<ul>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilhorizontal')">横向分析</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilvertical')">纵向分析</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilecologyh')">生态横向分析</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilecologyv')">生态纵向分析</span>
							</li>
						</ul>
					</el-collapse-item>
					<el-collapse-item title="后台管理" name="5">
						<ul>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilstation')">站点信息</span>
							</li>
							<li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soilequiment')">设备信息</span>
							</li>
							<!-- <li>
								<i class="el-icon-minus"></i>
								<span @click="$router.push('/soiluser')">用户管理</span>
							</li> -->
						</ul>
					</el-collapse-item>
				</el-collapse>
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
			time() {
				this.data = moment().format("YYYY年MM月DD日 HH:mm:ss")
			},
		},
		mounted() {
			this.timer = setInterval(this.time, 1000);
		},
		beforeDestroy() {
			clearInterval(this.timer);
		},
	}
</script>

<style>
	@import url("../../static/css/layout.css");
	@import url("../../static/soilcss/soilayout.css");
</style>
