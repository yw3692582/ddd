// 根据屏幕分辨率调整页面数据条数
function  pages () {
	let width = screen.width
	let pagesize;
	switch(width){
		case 1680:
			pagesize = 10
			break
		case 1600:
		case 1440:
			pagesize = 8
			break
		case 1366:
		case 1360:
			pagesize = 6
			break
		default:
			pagesize = 12
	}
	return pagesize;
}

export default pages