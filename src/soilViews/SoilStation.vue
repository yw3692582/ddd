<template>
	<div>
		<div class="soil_header">
			<i class="el-icon-s-home" style="line-height: 20px;padding-right: 5px;font-size: 20px;"></i>
			<span @click="$router.push('/soilconsole')">首页</span>&nbsp;
			<i class="el-icon-arrow-right" style="font-size: 14px;line-height: 25px;"></i>
			&nbsp;<span>设备信息</span>
		</div>
		<hr color="#04476e" />
		<div class="center">
			<el-button icon="el-icon-download" @click='exportExcel'>导出</el-button>
		</div>
		<div class="table-wrapper">
			<el-table id="out-table" border :data="getTableData.slice((currpage - 1) * pagesize, currpage * pagesize)" :row-style="getRowClass"
			 :header-row-style="getRowClass" :header-cell-style="getRowClass" style="width: 100%">
				<el-table-column prop="district" label="所属区县" align="center">
				</el-table-column>
				<el-table-column prop="station_name" label="站点名称" align="center">
				</el-table-column>
				<el-table-column prop="station_id" label="站点编号" align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" align="center">
				</el-table-column>
				<el-table-column prop="address" label="详细地址" align="center" width="280">
				</el-table-column>
				<el-table-column prop="longitude" label="经度(°)" align="center">
				</el-table-column>
				<el-table-column prop="latitude" label="纬度(°)" align="center">
				</el-table-column>
				<!-- <el-table-column align="center">
					<template slot="header" slot-scope="scope">
						<el-input prefix-icon="el-icon-search" v-model="search" size="mini" placeholder="输入关键字搜索" />
					</template>
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="small" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination :current-page.sync="currentPage1" background :page-size="pagesize" layout="total, prev, pager, next, jumper"
			 :total="getTableData.length" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import FileSaver from "file-saver"
	import XLSX from "xlsx"
	export default{
		data(){
			return{
				dialogFormVisibleEdit:false,
				currpage:1,
				currentPage1:null,
				pagesize:12,
				tableData:[],
				search:''
			}
		},
		computed: {
			getTableData() {
				let searchTableInfo = this.search
				if (searchTableInfo) {
					this.currpage = 1
					this.currentPage1 = 1
					return this.tableData.filter(Data => {
						return Object.keys(Data).some(key => {
							return String(Data[key]).toLowerCase().indexOf(searchTableInfo) > -1
						})
					})
				}
				return this.tableData
			}
		},
		methods:{
			openTip() {
				this.tips  = this.$notify({
					type:'info',
					dangerouslyUseHTMLString:true,
					showClose:false,
					duration:0,
					message: "<span style='font-size:18px;'>导出数据中...<i class='el-icon-loading'></i></span>",
				})
			},
			exportExcel() { //执行此方法导出Excel表格
				this.pagesize = this.tableData.length
				this.$nextTick(() => {
					var fix = document.querySelector('.el-table__fixed');
					var wb;
					if (fix) {
						wb = XLSX.utils.table_to_book(document.querySelector("#out-table").removeChild(fix))
						document.querySelector("#out-table").appendChild(fix)
					} else {
						wb = XLSX.utils.table_to_book(document.querySelector("#out-table"))
					}
					var wbout = XLSX.write(wb, {
						bookType: "xlsx",
						bookSST: true,
						type: "array"
					});
					try {
						FileSaver.saveAs(
							new Blob([wbout], {
								type: "application/octet-stream"
							}),
							// 导出的文件名称
							'站点信息' + ".xlsx"
						)
						this.openTip()
					} catch (e) {
						if (typeof console !== "undefined") console.log(e, wbout);
					}
					if (wbout) {
						this.tips.close()
						this.pagesize = 10
						this.$notify({
							type:'success',
							dangerouslyUseHTMLString:true,
							showClose:false,
							duration:1000,
							message: "<span style='font-size:18px;'>数据导出成功!</span>",
						})
					}else{
						this.openTip()
					}
					return wbout;
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
			handleCurrentChange(cpage) {
				this.currpage = cpage;
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
	@import url("../../static/soilcss/soilstation.css");
	@import url("../../static/soilcss/table.css");
</style>
