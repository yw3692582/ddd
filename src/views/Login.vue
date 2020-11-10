<template>
	<div id="bodys">
		<div id="bg_lunbo">
			<div v-for="imgs in img" :data-src="imgs" :key="imgs"></div>
		</div>
		<div class="header">
			<ul>
				<li>
					<a href="javascript:void(0);">主页</a>
				</li>
				<li>
					<a href="javascript:void(0);">产品</a>
				</li>
				<li>
					<a href="javascript:void(0);">解决方案</a>
				</li>
				<li>
					<a href="javascript:void(0);" @click="layers('soilconsole');">墒情监控</a>
				</li>
				<li>
					<a href="javascript:void(0);" @click="layers('warning');">智能预警</a>
				</li>
				<li>
					<a href="javascript:void(0);" @click="layers('console');">控制台</a>
				</li>
				<li>
					<a href="javascript:void(0);">联系我们</a>
				</li>
			</ul>
		</div>
		<div class="mains">
			<div class="main_left">
				<h1>物联网创造</h1>
				<h2>未来</h2>
				<p>基于物联网及大数据提供气象观测及预警全套解决方案，联系我们，<br>
					拥抱科技与未来，建设智慧城市，助推中国制造2025</p>
				<a href="javascript:void(0);" @click="layers('console');">Sign in</a>
			</div>
			<div class="main_right">
				<el-card class="login-cards" id="login-cards">
					<el-form label-position="left" @submit.native.prevent status-icon label-width="70px">
						<el-form-item label="账 户">
							<el-input prefix-icon="el-icon-user-solid" v-model="username" placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item label="密 码" style="margin-top: 50px;">
							<el-input type="password" @keyup.enter.native="login" prefix-icon="el-icon-lock" v-model="password" placeholder="请输入密码"></el-input>
						</el-form-item>
					</el-form>
					<el-button type="primary" @click="register">注册</el-button>
					<el-button type="primary" @click="login">登录</el-button>
				</el-card>
			</div>
		</div>
		<div class="footer_box">
			<span>版权所有©2018-2020</span>
			<br>
			<span>中电科信息产业有限公司</span>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				img: [
					'static/img/shuffling_1.jpg',
					'static/img/shuffling_2.jpg',
					'static/img/shuffling_3.jpg',
					'static/img/shuffling_4.jpg',
					'static/img/shuffling_5.jpg'
				],
				username: '',
				password: '',
				height: '',
				nextPage:''
			}
		},
		methods: {
			register(){
				alert('注册功能稍后开发!')
			},
			login() {
				if (this.username == '' || this.password == '') {
					this.$message({
						type:'warning',
						message:'请输入账号/密码'
					})
					return
				}
				this.$ajax.post('/login', {
						username: encodeURI(this.username),
						password: this.password,
						nextPage: this.nextPage
					})
					.then(res => {
						if (res.data.result) {
							this.$store.commit("handleToken", res.data.token);
							this.$store.commit("handleUsername", this.username);
							this.$router.push('/' + this.nextPage)
						}else{
							if (res.data.code === 0) {
								this.$message({
									type:'warning',
									message:'账号/密码错误'
								})
								return
							}
							alert('您无权限登录该页面！')
						}
					})
					.catch(e => {
						console.log(e)
					})
			},
			width_height() {
				let a = $("#bodys")
				let width = $(document.body).width()
				let height = $(document.body).height()
				this.height = height
				a.css({
					'width': width + 'px',
					'height': height + 'px',
				})
			},
			lunbo() {
				$('#bg_lunbo').camera({
					height: this.height + 'px',
					overlayer: false,
					pagination: false,
					playPause: false,
					pauseOnClick: false,
					// portrait: true,
					time: 3000,
					transPeriod: 1000,
					mobileNavHover: true,
					navigationHover: false,
					navigation: false,
					slideOn: 'random',
					loader: 'none',
					hover: false,
					loaderColor: '#ffffff',
					loaderBgColor: '#222222',
				});
			},
			layers(val) {
				this.nextPage = val
				layer.open({
					type: 1,
					title: ['登录',
						'border-radius: 0.5rem 0.5rem 0px 0px;background-color: rgba(0, 0, 0, 0.3);font-size: 18px;color: white;display: flex;border: none;'
					],
					offset: ['25%', '55%'],
					area: '453px',
					skin: 'mylogin',
					shade: false,
					content: $("#login-cards")
				});
			},
			// 自适应屏幕大小
			wid_height_resize() {
				window.onresize = () => {
					let a = $("#bodys")
					let width = $(document.body).width()
					let height = $(document.body).height()
					this.height = height
					a.css({
						'width': width + 'px',
						'height': this.height + 'px',
					})
				}
			},
		},
		mounted() {
			this.wid_height_resize()
			this.width_height()
			this.lunbo()
		}
	}
</script>
<style>
	.mylogin {
		background-color: rgba(0, 0, 0, 0.1) !important;
		border-radius: 0.5rem 0.5rem 0px 0px;
		font-size: 18px;
		color: white;
		border: none;
	}
</style>
<style scoped="scoped">
	@import url("../../static/css/logs.css");
</style>
