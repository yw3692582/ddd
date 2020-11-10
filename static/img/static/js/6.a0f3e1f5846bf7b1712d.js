webpackJsonp([6],{Oq7U:function(e,t){},eIxE:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={data:function(){return{dialogFormVisible:!1,props:{multiple:!0},verification:{station_id:"",station_name:"",creator:"",lon_lat:"",rules:{required:!0,message:"参数不能为空"}},new_lon_lat:"",isradio:"2",radio:"2",address:""}},methods:{b:function(){for(var e=this,t=0;t<this.verification.lon_lat.length;t++){if(","==this.verification.lon_lat[t]){if(this.new_lon_lat=this.verification.lon_lat.split(","),this.new_lon_lat[0]>180)return void this.$message({type:"warning",message:"经度不得超过180"});if(this.new_lon_lat[1]>90)return void this.$message({type:"warning",message:"纬度不得超过90"})}if("，"==this.verification.lon_lat[t]){if(this.new_lon_lat=this.verification.lon_lat.split("，"),this.new_lon_lat[0]>180)return void this.$message({type:"warning",message:"经度不得超过180"});if(this.new_lon_lat[1]>90)return void this.$message({type:"warning",message:"纬度不得超过90"})}}var a=this.$ajax.defaults.headers.common;delete a.token,delete a.username,this.$ajax.get("//restapi.amap.com/v3/geocode/regeo?key=657d0c0ea15e983c2b8f48fb44059ef5&location="+this.new_lon_lat[0]+","+this.new_lon_lat[1]).then(function(t){e.address=t.data.regeocode.formatted_address}).catch(function(t){e.$message({type:"error",message:"获取地址失败，请刷新页面"})})},register:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return t.$message({type:"error",message:"下列参数不能为空"}),!1;if(6==t.verification.station_id.length){var a=t.$ajax.defaults.headers.common;a.token=localStorage.getItem("token"),a.username=localStorage.getItem("user_name"),t.$ajax.post("/add_equipments",{e_code:"0101",basic_info:{eid:"HZG07"+t.verification.station_id+"002",station_name:encodeURI(t.verification.station_name),longitude:t.new_lon_lat[0],latitude:t.new_lon_lat[1],creator:encodeURI(t.verification.creator),message_push:t.isradio,station_id:t.verification.station_id,address:encodeURI(t.address)},addr_value:"",sub_device:{"0301":[],"0302":[],"0303":[]},new_sub_device:{"0301":[],"0302":[],"0303":[]},extend_data:""}).then(function(e){switch(e.data.code){case 0:t.$message({type:"error",message:"新建失败"});break;case 1:t.$router.push("/equipment"),t.$message({type:"success",message:"新建气象设备成功"});break;case 2:t.$message({type:"warning",message:"设备编号重复"});break;case 3:t.$message({type:"warning",message:"设备名称重复"});break;case 4:t.$message({type:"warning",message:"设备识别号重复"});break;case 5:t.$message({type:"warning",message:"辅助设备编号重复"});break;case 6:t.$message({type:"warning",message:"辅助设备名称重复"});break;case 7:t.$message({type:"warning",message:"辅助设备eid重复"})}}).catch(function(e){t.$message({type:"error",message:"添加失败"})})}else t.$message({type:"warning",message:"设备编号必须为6位"})})}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",[a("el-page-header",{attrs:{content:"新建气象设备"},on:{back:function(t){return e.$router.push("/equipment")}}}),e._v(" "),a("el-divider")],1),e._v(" "),a("div",{staticClass:"box"},[a("el-card",{staticClass:"login-card",attrs:{header:"新建气象设备"}},[a("el-form",{ref:"verification",attrs:{"status-icon":"",model:e.verification},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"设备编号",prop:"station_id",rules:e.verification.rules}},[a("el-input",{attrs:{maxlength:"6",onkeyup:"value=value.replace(/[^\\w_]/g,'');",placeholder:"字母数字组合,长度为6",autocomplete:"off"},model:{value:e.verification.station_id,callback:function(t){e.$set(e.verification,"station_id","string"==typeof t?t.trim():t)},expression:"verification.station_id"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"设备名称",prop:"station_name",rules:{required:!0,message:"设备名称不能为空"}}},[a("el-input",{attrs:{placeholder:"请输入设备名称",autocomplete:"off"},model:{value:e.verification.station_name,callback:function(t){e.$set(e.verification,"station_name","string"==typeof t?t.trim():t)},expression:"verification.station_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"设备经纬度,例:113.790921,34.748171",prop:"lon_lat",rules:e.verification.rules}},[a("el-input",{attrs:{onkeyup:"value=value.replace(/[^\\d.,，]/g,'');",placeholder:"请输入经纬度",autocomplete:"off"},on:{blur:function(t){return t.preventDefault(),e.b()}},model:{value:e.verification.lon_lat,callback:function(t){e.$set(e.verification,"lon_lat",t)},expression:"verification.lon_lat"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"地址"}},[a("el-input",{attrs:{disabled:"",placeholder:"根据经纬度自动填充",autocomplete:"off"},model:{value:e.address,callback:function(t){e.address=t},expression:"address"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"设备创建者",prop:"creator",rules:{required:!0,message:"设备创建者不能为空"}}},[a("el-input",{attrs:{placeholder:"请输入创建者",autocomplete:"off"},model:{value:e.verification.creator,callback:function(t){e.$set(e.verification,"creator","string"==typeof t?t.trim():t)},expression:"verification.creator"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"是否发送报文"}},[a("el-radio-group",{model:{value:e.isradio,callback:function(t){e.isradio=t},expression:"isradio"}},[a("el-radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),a("el-radio",{attrs:{label:"2"}},[e._v("否")])],1)],1)],1),e._v(" "),a("div",[a("el-button",{attrs:{type:"primary","native-type":"submit"},on:{click:function(t){return e.register("verification")}}},[e._v("新建")])],1)],1)],1)])},staticRenderFns:[]};var r=a("VU/8")(i,s,!1,function(e){a("Oq7U")},"data-v-46c81316",null);t.default=r.exports}});