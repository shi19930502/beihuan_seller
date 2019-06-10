<template>
	<div class="jibenxinxi">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!--基本信息-->
			<el-tab-pane label="基本信息" name="first">
				<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="120px">
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="备案用户ID" prop="id">
								<inputItem :autosize="true" :disabled="true" :value.sync="form.id" class="gerenxinXi_1"></inputItem>
								<optionItems v-if="isCode" style="position:absolute;right:-50px;top: -12px;">
									<template slot="right">
										<el-popover placement="right" trigger="hover" >
											<template>
												<div ref='downQrImg' id='downQrImg'>
													<img src="../../lib/img/erWeiMaBJ/erweima.png"  width="540px" height="820px" v-show="(extendId != '005' && extendId != '006')"/>
													<!--一批-->
													<!-- <img src="../../lib/img/erWeiMaBJ/caigou_bg.png" width="540px" height="820px" v-if="extendId === '001'"/>
													<img src="../../lib/img/erWeiMaBJ/caigou_bg.png" width="540px" height="820px" v-if="extendId === '004'"/> -->
												<!--采购商-->
													<!-- <img src="../../lib/img/erWeiMaBJ/tuancai_bg.png" width="540px" height="820px" v-if="extendId === '002'"/>
													<img src="../../lib/img/erWeiMaBJ/tuancai_bg.png" width="540px" height="820px" v-if="extendId === '003'"/> -->
													<div>
													<div><qriously :value="initQCode" :size="280" style="position:absolute;top:78px;left: 140px;"/></div>
													<div style="position:absolute;top:400px;width:100%;left:0;text-align: center;color: #3f1c44" >
														<div>{{channeName}}</div>
														<div>{{_dicValue(extendId, dataDic.extend)}}</div>
														<div>{{'*'+shanghuName.substr(1,shanghuName.split('').length)}}</div>
													</div>

													</div>
												</div>
												<p style="line-height: 50px;">
													<iconBtn content="打印二维码" @click="printQRCode">打印二维码</iconBtn>
													<iconBtn content="下载二维码图片" @click="downImg">下载二维码图片</iconBtn>
												</p>
											</template>
											<img slot="reference" src="../../lib/img/qr_code.jpg" width="35px" height="35px"></img>
										</el-popover>
									</template>
								</optionItems>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="邀请码" prop="code">
								<inputItem :autosize="true" :disabled="true" :value.sync="form.code" class="gerenxinXi_1"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="昵称" prop="name">
								<inputItem :autosize="true" :value.sync="form.name" class="gerenxinXi"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="证件号码" prop="regId">
								<inputItem :autosize="true" :value.sync="form.regId" class="gerenxinXi"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="地址" prop="address">
								<inputItem :autosize="true" type="textarea" :value.sync="form.address" class="gerenxinXi"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="联系电话" prop="tel">
								<inputItem :autosize="true" :value.sync="form.tel" :maxlength="11" class="gerenxinXi"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="备注" prop="remark">
								<inputItem :autosize="true" type="textarea" :value.sync="form.remark" :maxlength="150" class="gerenxinXi"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="上传图片">
								<uploadItem class="gerenxinX3" buttonType="icon" @success="headUploadSuccess" :uploadData="uploadData" @remove="headUploadRemove" :fileList="headUploadList" accept='.jpg,.png'></uploadItem>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div class="submitB">
					<elBtn @click="Submit" type="primary">提交</elBtn>
				</div>
			</el-tab-pane>
			<!--地址-->
			<el-tab-pane label="地址管理" name="second" class="Mapboxstyle">
				<el-form class="modal-form" :model="formAddress" ref="formAddress" :inline="true" :rules="rules" label-width="120px">
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="省" prop="provinceCode">
								<selectInput :value.sync="formAddress.provinceCode" v-on:selectChange='selectOnChange' class="gerenxinXi_1_map">
									<el-option v-for="item in addressList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode">
									</el-option>
								</selectInput>
								<!--<inputItem :disabled="true" :autosize="true" :value.sync="formAddress.provinceName" class="gerenxinXi_1_map"></inputItem>
								<div class="ditixianze" @click="FastPositioning" type="primary">
									<img src="../../lib/img/zuob.png" />
									<p class="ditixianze_span">地图定位</p>
								</div>-->
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="市" prop="cityCode">
								<selectInput :value.sync="formAddress.cityCode" v-on:selectChange='cityChange' class="gerenxinXi_1_map">
									<el-option v-for="item in cityList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode">
									</el-option>
								</selectInput>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="区/县" prop="districCode">
								<selectInput :value.sync="formAddress.districCode" class="gerenxinXi_1_map">
									<el-option v-for="item in districList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode">
									</el-option>
								</selectInput>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="详细地址" prop="detailedAddress">
								<inputItem :autosize="true" type="textarea" :value.sync="formAddress.detailedAddress" :maxlength="50" class="gerenxinXi_map"></inputItem>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="完整信息" prop="completeAddress">
								<inputItem :disabled="true" :autosize="true" type="textarea" :value.sync="formAddress.completeAddress" class="gerenxinXi_1_map_XQ"></inputItem>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="联系人" prop="contacts">
								<inputItem :autosize="true" :value.sync="formAddress.contacts" :maxlength="20" class="gerenxinXi_map"></inputItem>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="联系电话" prop="phoneNumber">
								<inputItem :autosize="true" :value.sync="formAddress.phoneNumber" :maxlength="12" class="gerenxinXi_map"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<!--地址获取-->
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="备注" prop="comment">
								<inputItem :autosize="true" type="textarea" :value.sync="formAddress.comment" maxlength="150" class="gerenxinXi_map"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div class="submitB">
					<elBtn @click="SubmitArea" type="primary">保存地址</elBtn>
				</div>
			</el-tab-pane>
			<!--修改密码-->
			<el-tab-pane label="修改密码" name="third">
				<el-form class="modal-form" :model="ruleForm2" ref="ruleForm2" :inline="true" :rules="rules" label-width="80px">
					<el-row>
						<el-form-item label="原密码" prop="oldPass">
							<el-input type="password" size="small" :maxlength="30" v-model="ruleForm2.oldPass" auto-complete="off" placeholder="请输入旧密码" class="gerenxinXi"></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="新密码" prop="pass">
							<el-input type="password" size="small" :maxlength="30" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入新密码" class="gerenxinXi"></el-input>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="确认密码" prop="checkPass">
							<el-input type="password" size="small" :maxlength="30" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入新密码" class="gerenxinXi"></el-input>
						</el-form-item>
					</el-row>

				</el-form>
				<div class="submitB">
					<elBtn @click="SubmitPass" type="primary">确认修改</elBtn>
				</div>
			</el-tab-pane>
			<!--修改密码-->
			<el-tab-pane label="账号管理" name="fourth" style="text-align:left;" v-if="standfYC">
				<elemTable :dataList="userDataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange">
					<el-table-column prop="loginName" label="用户账号">
						<template slot-scope="scope">
							<toolTip :content="scope.row.loginName">
								<span>
						    		{{scope.row.loginName}}
						    	</span>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="nickName" label="名称">
						<template slot-scope="scope">
							<toolTip :content="scope.row.nickName">
								<span>{{scope.row.nickName}}</span>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scope">
							<el-tag type="success" v-if="scope.row.status == 1">已启用</el-tag>
							<el-tag type="danger" v-if="scope.row.status == 0">未启用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button-group>
								<iconBtn type="danger" @click="chengeStatus(scope.row,0)" v-if="scope.row.status == 1">停用</iconBtn>
								<iconBtn type="primary" @click="chengeStatus(scope.row,1)" v-if="scope.row.status == 0">启用</iconBtn>
							</el-button-group>
						</template>
					</el-table-column>
				</elemTable>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<!--<script type="text/javascript" src="../../lib/js/jquery.js"></script>
<script type="text/javascript" src="../../lib/js/jquery.qrcode.min.js"></script> -->
<script>
	import local from '../local.js'
	import cascaderItem from '../components/components/cascaderItem.vue'
	import configs from '../configs.js'
	import mixin from '../mixin/mixin.js'
	import $ from '../../lib/js/jquery.js'
	import html2canvas from 'html2canvas'
	export default {
		mixins: [mixin],
		components: {
			cascaderItem
		},
		data() {
			//电话验证
			var ContactNumber = (rule, value, callback) => {
				if(!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/).test(this.form.tel)) {
					callback(new Error('请输入正确的电话号码！'));
				}
				callback();
			};
			var ContactNumber1 = (rule, value, callback) => {
				if(!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/ || /^(0[0-9]{2,3})([2-9][0-9]{6,7})+(\[0-9]{1,4})?$/).test(this.formAddress.phoneNumber)) {
					callback(new Error('请输入正确的电话号码！'));
				}
				callback();
			};
			//密码验证
			var validateoldpass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入原密码'));
				}
				callback();

			};
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入新密码'));
				} else {
					if(this.ruleForm2.checkPass !== '') {
						this.$refs.ruleForm2.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.ruleForm2.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				dataDic: {
					extend:[]
				},
				dateRange: [],
				form: {
					id: '',
					name: '',
					regId: '',
					address: '',
					tel: '',
					remark: '',

				},
				formAddress: {
					customerId: '',
					provinceCode: '',
					provinceName: '',
					cityCode: '',
					cityName: '',
					districCode: '',
					districName: '',
					detailedAddress: '',
					completeAddress: '',
					contacts: '',
					phoneNumber: '',
					longitude: '',
					latitude: '',
					comment: '',
				},
				ruleForm2: {
					id: '',
					oldPass: '',
					pass: '',
					checkPass: '',
				},
				rules: {
					//基本信息
					name: [{
						required: true,
						message: '客户名称必填',
						trigger: 'blur'
					}, this._ruleLength(50)],
					regId: [{
						required: true,
						message: '请输入有效的证件号码',
						trigger: 'blur'
					}, this._ruleLength(20)],
					tel: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, this._ruleMobile()],
					remark: [{
						message: '请输入备注，150字以内！',
						trigger: 'blur'
					}, this._ruleLength(150)],
					//地址管理
					provinceCode:[{
						required: true,
						message: '请选择省份地址信息',
						trigger: 'change'
					}],
					cityCode:[{
						required: true,
						message: '请选择市/区地址信息',
						trigger: 'change'
					}],
					districCode:[{
						required: true,
						message: '请选择区/县信息',
						trigger: 'change'
					}],
					detailedAddress: [{
						required: true,
						message: '请完善地址信息',
						trigger: 'blur'
					}, this._ruleLength(100)],
					contacts: [{
						required: true,
						message: '请填写联系人姓名',
						trigger: 'blur'
					}, this._ruleLength(20)],
					phoneNumber: [{
						required: true,
						validator: ContactNumber1,
						trigger: 'blur'
					}],
					comment: [{
						message: '请输入备注，150字以内！',
						trigger: 'blur'
					}, this._ruleLength(150)],
					//修改密码
					oldPass: [{
						required: true,
						validator: validateoldpass,
						trigger: 'blur'
					}, this._ruleLength(16)],
					pass: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}, this._ruleLength(16)],
					checkPass: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}, this._ruleLength(16)],
				},
				dataDic: {
					isEnabled: '',
					Id: ''
				},
				dataList: [],
				addressList: [], //省
				cityList: [],
				districList: [],
				userDataList: [],
				rowOBJ: {},
				activeName: 'first',
				tabDisabled: true,
				headUploadList: [],
				uploadData: {
					savePath: 'essentialInformation'
				},
				userFilePath: '',
				judgePic: false,
				isCode: false,
				initQCode: '',
				extendId:'',
				channeName:'',
				shanghuName:'',
				getUserInfo:{},
			}
		},
		created() {
			//查询数据字典，经营者类型
			this._searchDic('BEIHUAN_CUSTOMER_PROPERTY')
				.then((function(d) {
					let data = d.aaData;
					$.each(data, function(i, obj) {
						obj.key = obj.key;
					});
					Object.assign(this.dataDic, {
						extend: data
					})
				}).bind(this))
		},
		mounted() {

			var user = local.get('sessionUser');
			if(user) {
				var vm=this
				this.getUserInfo=Object.assign({}, vm.getUserInfo, user)
				this._ajax({
						url: this.userAPI,
						name: 'user/list',
						param: {
							userId: user.userId
						}
					})
					.then((function(d) {
						if(d.aaData[0].filePath && d.aaData[0].filePath.length > 0) {
							this.headUploadList = [{
								url: configs.imgURL + d.aaData[0].filePath
							}]
						}
					}).bind(this))
			}
			this.getInitData().then(this.getUserData);
			//获取省市区列表
			var vm = this;
			this._ajax({
				url: this.tootAPI,
				name: 'comArea/list',
				param: {
					parentAreaCode: vm.parentAreaCode,
					level: 1
				}
			}).then((d) => {
				this.addressList = d.aaData
			})

		},
		methods: {
			createImg(){
				return new Promise((resolve,reject)=>{
					var downQrImg=this.$refs.downQrImg
					var shareContent = downQrImg;
				    var width = shareContent.offsetWidth;
				    var height = shareContent.offsetHeight;
				    var canvas = document.createElement("canvas");
				    var scale = 1;
				    canvas.width = width * scale;
				    canvas.height = height * scale;
				    canvas.getContext("2d").scale(scale, scale);
				    var opts = {
				        scale: scale,
				        canvas: canvas,
				        logging: true,
				        width: width,
				        height: height
				    };
					html2canvas(document.querySelector("#downQrImg"),opts).then(canvas => {
						resolve(canvas)
					});
				})
			},
			downImg(){
				this.createImg().then((canvas)=>{
					var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
//              	console.log('imgUri',imgUri)
//              	window.location.href = imgUri; // 下载图片
                	let elem = document.createElement('a');
					elem.setAttribute('href', imgUri);
					elem.setAttribute('download', '主体二维码.png');
					document.body.appendChild(elem);
					elem.click();
					document.body.removeChild(elem);
				})
			},
			printQRCode(){
				this.createImg().then((canvas)=>{
					var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
					var printHtml = `<img src="${imgUri}" width="460px" height="690px" style="display:block;margin: auto;" /> `;
					if (typeof LODOP === 'undefined') {
						this.$message({
							showClose: true,
							duration: 0,
							dangerouslyUseHTMLString: true,
							message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
						});
					} else {
						LODOP.PRINT_INIT("");
						LODOP.ADD_PRINT_HTM('4%', '15%', '95%', '100%', printHtml, )
						LODOP.ADD_PRINT_BARCODE('18.8%', "37.8%", 235, 235, "QRCode");
						LODOP.PRINT()
					}
				})

			},
			// printQRCode() {
			// 	if (this.extendId === '002'||this.extendId === '003'){
			// 		var printHtml = `
	        // 			<div style="position: center;height: 30px;line-height: 30px;font-size: 40px;">
		    //     			<br/>
		    //                 <span style="width: 100%;display: inline-block;left:0;height：20px;">单位 :${this.form.name}</span>
		    //                 <br/>
		    //                 <p style="height：10px;"></p>
			//             	<img src="../../lib/img/erWeiMaBJ/erweima.png" width="600px" height="870px">
			//             </div>`;
			// 	} else {
			// 		var printHtml = `
	        // 			<div style="position: center;height: 30px;line-height: 30px;font-size: 40px;">
		    //     			<br/>
		    //                 <span style="width: 100%;display: inline-block;left:0;height：20px;">单位:${this.form.name}</span>
		    //                 <br/>
		    //                 <p style="height：10px;"></p>
			// 				<img src="../../lib/img/erWeiMaBJ/erweima.png" width="600px" height="870px">
			//             </div>`;
			// 	}
			// 	if (typeof LODOP === 'undefined') {
			// 		this.$message({
			// 			showClose: true,
			// 			duration: 0,
			// 			dangerouslyUseHTMLString: true,
			// 			message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
			// 		});
			// 	} else {
			// 		LODOP.PRINT_INIT("");
			// 		LODOP.ADD_PRINT_HTM('4%', '15%', '95%', '100%', printHtml, )
			// 		LODOP.ADD_PRINT_BARCODE('18.8%', "37.8%", 235, 235, "QRCode", this.initQCode);
			// 		LODOP.PRINT()
			// 	}
			// },
			//判断extend，是否请求接口。
			// qrCodeUrl(){
			// 	this._ajax({
			// 		url: this.tootAPI,
			// 		name: 'inmarketmain/getQRCode',
			// 		param: {}
			// 	}).then((d) => {
			// 		let data = d.aaData
			// 		this.initQCode = data.qrCodeUrl;
			// 		if(data.isCode == 1) {
			// 			this.isCode = true
			// 		}
			// 	})
			// },
			getInitData() {
				let typeId = local.get('sessionUser').typeId;
				if(typeId != 'buyer') {
					this.standfYC = true;
				}
				//备案基本信息
				let user = local.get('sessionUser');
				this._ajax({
					url: this.rootAPI,
					name: 'customer/selectById',
					param: {
						id: user.typeCode,
					}
				}).then((function(d) {
					this.isCode=true;
					this.extendId= d.aaData.extend //此语句仅适用于登录用户二维码背景使用判断
					this.shanghuName=d.aaData.name;
					this.channeName = d.aaData.channelName;
					if(this.extendId!='005' && this.extendId!='006'){
						if(this.extendId=='003'){
							this.initQCode = configs.wxUrl+'#/qr_personage?code='+d.aaData.code;
						}else{
							var name = "fLogin_first";
							var urlParams=''
							if(this.extendId=='001'||this.extendId=='007'){
								 urlParams =   name + "_" + this.getUserInfo.typeCode
							}else{
								name = 'fLogin_second'
								urlParams =  name + "_" + this.getUserInfo.typeCode
								if(this.extendId=='004'){
									name='mLogin_second'
									urlParams =  name + "_" + this.getUserInfo.typeCode
								}
							}
							if(configs.quickLogin) {
								this.initQCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri=" + configs.wxUrl + "&response_type=code&scope=snsapi_base&state=" + urlParams + "#wechat_redirect"
							} else {
								this.initQCode = configs.wxUrl + "?code=081H2kqP1CRtO11HO6sP1JHZpP1H2kqv&state=" + urlParams + "#/qr_index"
							}
						}
					}else{
						this.isCode=false
					}
					// if(this.extendId=='002'||this.extendId=='003'){
					// 	//http://10.2.15.105:8889/#/qr_personage?code=6401040060004

					// }else if(this.extendId=='001'||this.extendId=='007'||this.extendId=='004'){
					// 	var name = "first"
					// 	if(this.extendId=='004') {
					// 		name = 'second'
					// 	}
					// 	var urlParams = 'fLogin_' + name + "_" + this.getUserInfo.typeCode
					// 	if(configs.quickLogin) {
					// 		this.initQCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri=" + configs.wxUrl + "&response_type=code&scope=snsapi_base&state=" + urlParams + "#wechat_redirect"
					// 	} else {
					// 		this.initQCode = configs.wxUrl + "?code=081H2kqP1CRtO11HO6sP1JHZpP1H2kqv&state=" + urlParams + "#/qr_index"
					// 	}
					// 	//下面这个不要了，直接手写
					// 	//this.qrCodeUrl();

					// }else {
					// 	this.isCode=false
					// }
					Object.assign(this.form, d.aaData);
				}).bind(this))
				//地址管理信息
				return this._ajax({
					url: this.rootAPI,
					name: 'address/queryByCustomerId',
					param: {
						customerId: user.typeCode,
					}
				}).then((function(d) {
					let data = d.aaData;
					Object.assign(this.formAddress, data);
					this.selectOnChange(data.provinceCode, 2, 0);
					this.cityChange(data.cityCode, 3, 0);
					/*					let getaddress = this.$route.query.adduass;
										var Dns = this
										if(getaddress != null && getaddress.pname != null) {
											Dns.formAddress.provinceName = getaddress.pname;
											Dns.formAddress.cityName = getaddress.cityname;
											Dns.formAddress.districName = getaddress.adname;
											Dns.formAddress.detailedAddress = getaddress.name;
											Dns.formAddress.longitude = getaddress.location.lng;
											Dns.formAddress.latitude = getaddress.location.lat;
											this.activeName = "second";
										}*/
				}).bind(this))
			},
			getUserData() {
				let user = local.get('sessionUser');
				this._ajax({
					url: this.rootAPI,
					name: 'customer/queryListByTypeCode',
					param: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						typeCode: user.typeCode,
						loginName: user.loginName,
					}
				}).then((function(d) {
					this.userDataList = d.aaData;
					let data = d.aaData;
					this.dataList1 = data;
					this.pageTotal = d.dataCount
				}).bind(this))
			},
			//账户状态修改
			chengeStatus(row, status) {
				this._ajax({
					url: this.rootAPI,
					name: 'customer/updateUserStatus',
					param: {
						userId: row.userId,
						status: status
					}
				}).then((function(d) {
					if(d.state == 0) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
						this.getUserData();
					} else {
						this.$message({
							type: 'failure',
							message: '操作失败'
						});
					}
					this.$emit('submit')
				}).bind(this))

			},
			searchTable() {
				this.getUserData();
			},
			//基础信息
			Submit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let o = {},
							method = "customer/create";
						let id = this.form.id;
						if(id) {
							method = "customer/updateCusMer";
						}
						o = {
							name: this.form.name,
							regId: this.form.regId,
							address: this.form.address,
							tel: this.form.tel,
							remark: this.form.remark,
							id: id
						}
						let user = local.get('sessionUser');
						if(!id) {
							o.createdPersonId = parseInt(user.userId);
							o.createdPersonName = user.nickName;
						}
						this._ajax({
								url: this.rootAPI + method,
								param: o
							})
							.then((function(d) {
								if(d.state == 0) {
									this.form.id = d.aaData.id;
									//                      		this.tabDisabled = false;
									this.$message({
										type: 'success',
										message: '操作成功'
									});
								} else {
									this.$message({
										type: 'failure',
										message: d.msg
									});
								}
								this.$emit('submit')
								this.getInitData()
							}).bind(this))

						if(this.judgePic) {
							this._ajax({
									url: this.userAPI + 'user/update',
									param: {
										userId: user.userId,
										filePath: this.userFilePath
									}
								})
								.then((function(d) {
									if(d.state === 0) {
										this._userInfo(user.userId)
									}
								}).bind(this))
						}

					}
				})
			},
			handleClick(tab, event) {

			},
			handleItemChange(val) {

			},
			/*			FastPositioning() {
							this.$router.push({ path: '/mapSearchModal',});
						},*/

			//市级
			selectOnChange(value, level, status) {
				if(status != 0) {
					this.formAddress.cityCode = '';
					this.formAddress.districCode = '';
					this.formAddress.detailedAddress = '';
				}
				this._ajax({
					url: this.tootAPI,
					name: 'comArea/list',
					param: {
						parentAreaCode: value,
						level: 2
					}
				}).then((d) => {
					this.cityList = d.aaData
				})
			},
			//县、区
			cityChange(value, level, status) {
				if(status != 0) {
					this.formAddress.districCode = '';
					this.formAddress.detailedAddress = '';
				}
				this._ajax({
					url: this.tootAPI,
					name: 'comArea/list',
					param: {
						parentAreaCode: value,
						level: 3
					}
				}).then((d) => {
					this.districList = d.aaData
				})
			},
			//地址信息
			SubmitArea() {
				this.$refs['formAddress'].validate((valid) => {
					if(valid) {
						let o = {},
							method = "address/create";
						let user = local.get('sessionUser')
						let customerId = user.typeCode
						if(this.formAddress.id) {
							method = "address/update";
						}
						o = {
							id: parseInt(this.formAddress.id),
							//							provinceCode: this.$route.query.adduass.adcode.substring(0,2)+"0000",
							//							cityCode: this.$route.query.adduass.adcode.substring(0,4)+"00",
							//							districCode: this.$route.query.adduass.adcode,
							provinceCode: this.formAddress.provinceCode,
							cityCode: this.formAddress.cityCode,
							districCode: this.formAddress.districCode,
							provinceName: this.formAddress.province,
							cityName: this.formAddress.cityName,
							districName: this.formAddress.districName,
							detailedAddress: this.formAddress.detailedAddress,
							longitude: this.formAddress.longitude,
							latitude: this.formAddress.latitude,
							contacts: this.formAddress.contacts,
							phoneNumber: this.formAddress.phoneNumber,
							customerId: customerId,
							comment: this.formAddress.comment,
						}
						this._ajax({
								url: this.rootAPI + method,
								param: o
							})
							.then((function(d) {
								if(d.state == 0) {
									this.formAddress.customerId = d.aaData.customerId;
									this.$message({
										type: 'success',
										message: '操作成功'
									});
								} else {
									this.$message({
										type: 'failure',
										message: '操作失败'
									});
								}
								this.$emit('submit')
								this.getInitData()
							}).bind(this))
					}
				})
			},
			//修改密码
			SubmitPass() {
				//          	console.log("SubmitPass....")
				var vm = this;
				var param = {
					id: this.form.id,
					oldPassword: vm.ruleForm2.oldPass,
					newPassword: vm.ruleForm2.pass,
				}
				this.$refs['ruleForm2'].validate((valid) => {
					//					console.log("param",param);
					let uri = 'user/updateMyPassword';
					if(valid) {
						this._ajax({
								url: this.userAPI + uri,
								param: param
							})
							.then((function(d) {
								if(d.state == 0) {
									vm.$message({
										type: 'success',
										message: '密码成功,请重新登录！'
									});
									vm.$router.push({
										path: '/login'
									}); //跳转到登录页
								} else {
									vm.$message({
										type: 'failure',
										message: d.msg
									});
								}
							}))
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			headUploadSuccess(response, file, fileList) {
				this.userFilePath = this._uploadPath(response)
				this.judgePic = true;
			},
			headUploadRemove(file, fileList) {
				this.userFilePath = ''
			},
		}
	}
</script>
<style lang="sass">
	.jibenxinxi {
		padding: 20px;
		margin: 0 auto;
		text-align: center;
				/*二维码背景图*/
		.el-form-item__content {
			width: 600px;
			text-align: left;
		}
		.gerenxinXi {
			width: 600px;
			text-align: left;
		}
		.gerenxinXi_1 {
			width: 600px;
			text-align: left;
			border: 1px solid #D1D1D1;
			line-height: 30px;
			border-radius: 5px;
			display: block;
			padding-left: 15px;
			.bingjingBJ{
				width:330px;
				height:640px;
			}
		}
		.gerenxinX3 {
			width: 600px;
			text-align: left;
			float: left;
			border: 1px solid #FDFDFD;
			padding: 10px;
			border-radius: 5px;
		}
		.Mapboxstyle {
			width: 100%;
			.gerenxinXi_map {
				width: 600px;
				text-align: left;
			}
			.gerenxinXi_map1 {
				width: 540px;
				text-align: left;
			}
			.gerenxinXi_1_map {
				width: 450px;
				text-align: left;
				float: left;
			}
			.gerenxinXi_1_map_XQ {
				width: 600px;
				text-align: left;
				float: left;
				padding-left: 16px;
				border: 1px solid #dcdfe6;
				border-radius: 5px;
			}
			.ditixianze {
				width: 140px;
				height: 80px;
				position: absolute;
				top: 20px;
				right: 10px;
				text-align: center;
				cursor: pointer;
			}
			.ditixianze img {
				width: 60px;
			}
			.ditixianze_span {
				font-size: 14px;
				font-family: "微软雅黑";
			}
		}
	}
</style>
