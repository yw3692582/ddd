<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>状态监控</span>
		</div>
		<hr color="#04476e" />
		<div class="soil_center">
			<Three ref="threeCircel"></Three>
			<br />
			<div class="table-wrapper">
				<el-table border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)" :row-style="getRowClass"
				 :header-row-style="getRowClass" :header-cell-style="getRowClass" :cell-style="setCellStyle" style="width: 100%">
					<el-table-column prop="station_id" label="站点编号" align="center">
					</el-table-column>
					<el-table-column prop="station_name" label="站点名称" align="center">
					</el-table-column>
					<el-table-column prop="district" label="所属县区" align="center">
					</el-table-column>
					<el-table-column prop="status_time" label="监测时间" align="center" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="status" label="通讯状态" align="center" :formatter="formatStatus">
					</el-table-column>
					<el-table-column prop="status_time" label="离线时间" align="center" :formatter="formatOffline">
					</el-table-column>
					<el-table-column prop="battery" label="电源电压" align="center" :formatter="formatBattery">
					</el-table-column>
				</el-table>
				<el-pagination background :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="getTableData.length" @current-change="handleCurrentChange">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import Three from './ThreeCircle.vue'
	export default {
		data() {
			return {
				tableData: [],
				currpage: 1,
				pagesize: 10
			}
		},
		components: {
		   Three
		},
		computed: {
			getTableData() {
				return this.tableData
			}
		},
		methods: {
			setCellStyle: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex == 4 && row.status === 0) {
					return {
						"color": "red"
					}
				}
			},
			getRowClass: function({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return "background:#081b39;color:white;border-color: #04476E;";
			},
			handleCurrentChange(cpage) {
				this.currpage = cpage;
			},
			formatOffline(row, column){//格式化离线时间
				if (row.status == 1) {
					return ''
				}
				let time = row.status_time
				return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss")
			},
			formatter(row, column) {//格式化监测时间
				if (row.status == 0) {
					return ''
				}
				let time = row.status_time
				return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss")
			},
			formatStatus(row, column){//格式化状态
				switch (row.status) {
					case 1:
						return '在线'
						break
					default:
						return '离线'
				}
			},
			formatBattery(row, column){//格式化电源电压
				if (row.battery === null) {
					return 0
				}
			},
			initDatas() { //地图站点
				let headers = this.$ajax.defaults.headers.common
				headers['token'] = localStorage.getItem('token')
				headers['username'] = localStorage.getItem('user_name')
				this.$ajax.post("/soil_map")
					.then(res => {
						let data = res.data.records
						data.find(Data => {
							if (Data.obs_time == null) {
								this.$refs.threeCircel.messReport += 1
							}
							switch(Data.status){
								case 1:
									this.$refs.threeCircel.online += 1
									break
								default:
									this.$refs.threeCircel.offline += 1
							}
						})
						this.tableData = data
						this.$refs.threeCircel.online_percentage = Math.round((this.$refs.threeCircel.online / data.length) * 10000) / 100
						this.$refs.threeCircel.off_percentage = Math.round((this.$refs.threeCircel.offline / data.length) * 10000) / 100
						this.$refs.threeCircel.mee_percentage = Math.round((this.$refs.threeCircel.messReport / data.length) * 10000) / 100
					})
					.catch(e => {
						console.log(e)
					})
			},
		},
		mounted() {
			this.initDatas()
		}
	}
</script>

<style scoped>
	@import url("../../static/soilcss/soilstatus.css");
	@import url("../../static/soilcss/table.css");
</style>
