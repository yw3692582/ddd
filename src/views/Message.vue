<template>
	<div style="display: grid;place-items: center;">
		<table border="1px" bordercolor="#04476E" cellspacing="0" cellpadding="15" class="table_message">
			<tr>
				<th>序号</th>
				<th>信息</th>
				<th>时间</th>
			</tr>
			<tr v-for="(item, index) in tableData1" :key="index">
				<td style="color: #FFFFFF;">
					{{index + 1}}
				</td>
				<td>
					<a href="javascript:void(0);">{{item.notice}}</a>
				</td>
				<td style="color: #FFFFFF;">
					{{item.date1}}
				</td>
			</tr>
		</table>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				tableData1: [],
			}
		},
		methods:{
			message(){
				let message_data = [
					{
						notice: '您与2020-03-06 10:10:33导出的数据已完成，请点击下载!',
						date1: '2020-03-06 10:20:33'
					}, {
						notice: '您与2020-03-16 11:12:30导出的数据已完成，请点击下载!',
						date1: '2020-03-16 11:22:30'
					}, {
						notice: '您与2020-03-26 16:40:13导出的数据已完成，请点击下载!',
						date1: '2020-03-26 16:50:13'
					}
				]
				this.tableData1 = message_data
			}
		},
		mounted() {
			this.message()
		}
	}
</script>

<style scoped>
	.table_message{
		width: 80vw;
	}
	.table_message tr:nth-child(1){
		color: #FFFFFF;
		font-size: 18px;
	}
	.table_message tr td a{
		font-size: 18px;
		color: #409EFE;
	}
</style>
