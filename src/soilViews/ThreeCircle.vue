<template>
	<div>
		<div class="soil_center_top">
			<el-row>
				<el-col :span="8">
					<el-progress :width="circle_height" :height="circle_width" type="circle" :percentage="online_percentage" status="success"></el-progress>
					<span>在线&nbsp;<B style="font-size: 20px;">{{online}}</B>&nbsp;个</span>
				</el-col>
				<el-col :span="8">
					<el-progress :width="circle_height" :height="circle_width" type="circle" :percentage="off_percentage" status="exception"></el-progress>
					<span>离线&nbsp;<B style="font-size: 20px;">{{offline}}</B>&nbsp;个</span>
				</el-col>
				<el-col :span="8">
					<el-progress :width="circle_height" :height="circle_width" type="circle" :percentage="mee_percentage" status="warning"></el-progress>
					<span>缺报&nbsp;<B style="font-size: 20px;">{{messReport}}</B>&nbsp;个</span>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				online: 0,
				online_percentage:0,
				offline: 0,
				off_percentage:0,
				messReport: 0,
				mee_percentage:0,
				circle_height: 100,
				circle_width: 100,
			}
		},
		methods:{
			
		},
		mounted() {
			
		}
	}
</script>

<style>
	.soil_center_top .el-col-8 span {
		color: #FFFFFF;
		position: absolute;
		padding-left: 10px;
		top: 45%;
	}
</style>
