<template>
	<div class="custormerRegist">
		<div class="headBOX">
			<span>
				<img src="../../lib/img/home_ing_logo.png" v-if="logoPic !== '农鲜汇'"/>
				<font>{{logoTxt}}</font>
				<font>用户注册</font>
			</span>
			<span class="woyaodengl" @click="denvglu()">
				<font style="cursor: pointer;">我要登录</font>
			</span>
		</div>
		<el-steps :active="active" finish-status="success" style="padding:120px;">
			<el-step id="tiaozhuan1" title="设置用户名"></el-step>
			<el-step id="tiaozhuan2" title="选择角色"></el-step>
			<el-step id="tiaozhuan3" title="完善信息"></el-step>
			<el-step id="tiaozhuan4" title="注册结果"></el-step>
		</el-steps>
		<div>
			<el-form ref="form" :model="form" :rules="rules" label-width="120px" >
				<div class="shezhiYh" v-if="active==1">
					<el-form-item label="昵称" prop="name">
						<i style="color:#FD482C;position: absolute;left: -52px;">*</i>
						<!-- <el-input v-model="form.name" @blur="nameCilek" :maxlength="16"></el-input> -->
						<el-input v-model="form.name" :maxlength="16"></el-input>

						<span :style="{float:textLeft,color:xainShiColor}">{{xainShi}}</span>
					</el-form-item>
					<el-form-item label="手机号" prop="telephone">
						<i style="color:#FD482C;position: absolute;left: -65px;">*</i>
						<el-input v-model="form.telephone" @blur="telephoneCilek" :maxlength="11"></el-input>
						<span :style="{float:textLeft,color:msgColor}">{{msg}}</span>
					</el-form-item>
					</i>
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="form.password" :maxlength="16" :minlength="6" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="passwordNew">
						<el-input type="password" v-model="form.passwordNew" :maxlength="16" :minlength="6" auto-complete="off"></el-input>
					</el-form-item>
					<p  class="dashdv">
						<el-button type="primary" @click="next()">下一步</el-button>
					</p>
				</div>
				<!--渲染第二部选择类型-->
				<div class="shezhiYh" v-if="active==2">
					<div class="flex">
						<div class="anjiuBut" v-for="item in dataDic.labelList">
							<!--<p class="Msgs">{{msgs}}</p>-->
							<el-radio @change="xuanZe" v-model="radio" :label="item.key" type="redio" prop="radio">
								<img class="customerPHO" src="../../lib/img/icon_caigoushang @2x.png"/></br>
								<div class="customerName">{{item.value}}</div>
							</el-radio>
						</div>
					</div>
					<!-- 一批供应商类型选择 -->
					<!-- <div style="margin-top: 20px" class="flex flex-x-center">
						<el-form-item
							label="供应商类型"
							v-if="radio=='001'"
						>
							<el-select
								v-model="form.type"
								placeholder="请选择供应商类型"
								style="width: 200px"
							>
								<el-option
									v-for="d in customerTypeList"
									:key="d.key"
									:label="d.value"
									:value="d.key"
								></el-option>
							</el-select>
						</el-form-item>

					</div> -->
					<div style="margin-top: 20px" class="flex flex-x-center">
						<el-form-item label="渠道" prop="channelCode" v-if="radio=='001' || radio=='002'">
						<div class="form-group flex flex-y-center">
							<el-select v-model="form.channelCode" placeholder="请选择渠道" style="width: 100%;">
							<el-option
								v-for="d in channelList"
								:key="d.code"
								:label="d.name"
								:value="d.code"
							></el-option>
							</el-select>
						</div>
						</el-form-item>
					</div>
					<template  v-if="radio!='005' && form.channelCode != '001201'">
						<div style="margin-top: 20px" class="flex flex-x-center">
							<el-form-item label="经营户类型" prop="property" v-if="!(radio=='001'||radio=='002')">
								<div class="form-group flex flex-y-center">
									<el-select v-model="defaultProperty" placeholder="请选择经营户类型" disabled>
										<el-option
											v-for="d in customerTypeLists"
											:key="d.key"
											:label="d.value"
											:value="d.key"
										></el-option>
									</el-select>
								</div>
							</el-form-item>
							<!-- 除一批二批 -->
							<el-form-item label="经营户类型" prop="property1" v-else>
								<div class="form-group flex flex-y-center">
									<el-select v-model="form.property" placeholder="请选择经营户类型">
										<el-option
											v-for="d in customerTypeLists"
											:key="d.key"
											:label="d.value"
											:value="d.key"
										></el-option>
									</el-select>
								</div>
							</el-form-item>
						</div>
					 </template>
					<!-- 一批供应商类型选择 -->
					<div style="margin-top: 20px" class="flex flex-x-center">
						<el-form-item
							label="商品来源"
							v-if="radio=='001' && form.channelCode == 'QT' && form.property != '2'"
						>
							<el-select
								v-model="form.isLocal"
								placeholder="请选择商品来源"
								style="width: 200px"
							>
								<el-option
									v-for="d in isLocalList"
									:key="d.value"
									:label="d.name"
									:value="d.value"
								></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div style="margin-top: 20px" class="flex flex-x-center">
						<el-form-item
							label="供应商品分类"
							prop="businessScope"
							v-if="radio=='007' || radio=='001' "
						>
							<el-select
								v-model="form.businessScope"
								multiple
								placeholder="请选择供应商品类型"
								style="width: 200px"
							>
								<el-option
									v-for="d in categoryTypeList"
									:key="d.code"
									:label="d.name"
									:value="d.code"
								></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div style="margin-top: 20px" class="flex flex-x-center">
						<el-form-item label="企业类型" prop="channelCode" v-if="radio=='003'">
						<div class="form-group flex flex-y-center">
							<el-select v-model="form.enterpriseType" placeholder="请选择企业类型" style="width: 100%;">
							<el-option
								v-for="d in TCTypeList"
								:key="d.key"
								:label="d.value"
								:value="d.key"
							></el-option>
							</el-select>
						</div>
						</el-form-item>
					</div>
					<p class="dashdv">
						<el-button type="primary" @click="lastStep()">上一步</el-button>
						<el-button type="primary" @click="active1Next()" :disabled="none">下一步</el-button>
					</p>
				</div>

				<div class="shezhiYh" v-if="active==3">
					<template v-if="radio != '005'">
						<el-form-item label="市场证明" v-if="radio == '001' && form.property!='1' && form.property!='' ">
							<uploadItem class="gerenxinX3" buttonType="icon"  @success="marketcertPicSuccess" :uploadData="uploadData" @remove="marketcertPicRemove" :fileList="marketcertPicList" accept='.jpg,.png'></uploadItem>
						</el-form-item>
						<el-form-item label="营业执照号码">
							<i style="color:#FD482C;position: absolute;left: -106px;">*</i>
							<el-input v-model="form.regId"  :maxlength="50"  @blur="regIdeCilek"></el-input>
							<span :style="{float:textLeft,color:regIdmsgColor}">{{regIdmsg}}</span>
						</el-form-item>
						<el-form-item label="营业执照照片">
							<uploadItem class="gerenxinX3" buttonType="icon"  @success="businessUploadSuccess" :uploadData="uploadData" @remove="businessUploadRemove" :fileList="businessUploadList" accept='.jpg,.png'></uploadItem>
						</el-form-item>
						<el-form-item label="食品流通许可证">
							<uploadItem class="gerenxinX3" buttonType="icon"  @success="foodLicensePicSuccess" :uploadData="uploadData" @remove="foodLicensePicRemove" :fileList="foodLicensePicList" accept='.jpg,.png'></uploadItem>
						</el-form-item>
						<template v-if="form.channelCode != '001201'">
							<el-form-item label="清真食品准营证">
								<uploadItem class="gerenxinX3" buttonType="icon"  @success="muslimfoodPermitPicSuccess" :uploadData="uploadData" @remove="muslimfoodPermitPicRemove" :fileList="muslimfoodPermitPicList" accept='.jpg,.png'></uploadItem>
							</el-form-item>
							<el-form-item label="法人名" prop="legalpepresent">
								<el-input v-model="form.legalpepresent" :maxlength="20"></el-input>
							</el-form-item>
							<el-form-item label="法人照片">
								<uploadItem class="gerenxinX3" buttonType="icon"  @success="legalpepresentUploadSuccess" :uploadData="uploadData" @remove="legalpepresentUploadRemove" :fileList="legalpepresentUploadList" accept='.jpg,.png'></uploadItem>
							</el-form-item>
							<el-form-item label="身份证正面照">
								<uploadItem class="gerenxinX3" buttonType="icon"  @success="idCardPic_01Success" :uploadData="uploadData" @remove="idCardPic_01Remove" :fileList="idCardPic_01List" accept='.jpg,.png'></uploadItem>
							</el-form-item>
							<el-form-item label="身份证反面照">
								<uploadItem class="gerenxinX3" buttonType="icon"  @success="idCardPic_02Success" :uploadData="uploadData" @remove="idCardPic_02Remove" :fileList="idCardPic_02List" accept='.jpg,.png'></uploadItem>
							</el-form-item>
						</template>
					</template>
					<el-form-item label="门头照片" v-if="radio=='004'">
						<uploadItem class="gerenxinX3" buttonType="icon"  @success="storeUploadSuccess" :uploadData="uploadData" @remove="storeUploadRemove" :fileList="storeUploadList" accept='.jpg,.png'></uploadItem>
					</el-form-item>
					<el-form-item label="地址"  prop="address" v-if="form.channelCode != '001201'">
						<el-input v-model="form.address" :maxlength="200"></el-input>
					</el-form-item>
					<p  class="dashdv">
						<el-button type="primary" @click="active--;form.property=''">上一步</el-button>
						<el-button type="primary" @click="Submit()">提 交</el-button>
					</p>
				</div>
				<div class="shezhiYh" v-if="active==4">
					<div id="zhuceCG" :style="{display:zhuCiYingcang}">
						<img src="../../lib/img/zhucezhuant.png"/>
						<div>恭喜你注册成功，系统将于
							<font color="blue"><span id="num" size="2" face="impact">{{sec}}</span></font>秒后跳转至登录页面</div>
						<div class="dashdv">
							<el-button type="primary" @click="signLogin()">立即登录</el-button>
						</div>
					</div>
					<div id="zhuceCG1" :style="{display:yingCangAnjiu}">
						<p class="dashdv">
							<el-button type="primary" @click="signChongxin()">重新注册</el-button>
						</p>
					</div>
				</div>
			</el-form>
		</div>
	</div>
</template>
<script>
	import local from '../local.js'
	import configs from '../configs.js'
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '' || value.length<6) {
					callback(new Error('请输入密码，最低6位数'));
				} else {
					if(this.form.passwordNew !== '') {
						this.$refs.form.validateField('passwordNew');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.form.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				TCTypeList:[],
				dispalyUser: true,
				dispalyPro: false,
				dispalyPlease: false,//完善信息1
				dispalyQudao: false,//完善信息2
				dispalyoneP:false,//完善信息3
				dispalyRegistOK: false,
				msgColor: '#f56c6c',//手机号验证
				regIdmsgColor:'#f56c6c',//营业执照编码验证
				xainShiColor:'#f56c6c',
				textLeft: 'left',
				ISblur:'1px solid #409EFF',
				form: {
					name: '',
					telephone: '',
					customerProperty:'',
					password: '',
					passwordNew: '',
					regId:'',//执照编码
					legalpepresent:'',//法人
					address:'',
					businessScope: '',
					isLocal:"",
					type: "",
					channelCode: "",
					property: "",
					marketcertPic: "",
					enterpriseType: "" 
				},
				defaultProperty: "1", // 除一批二批默认到公司
				categoryTypeList:[],
				dataDic:{
					labelList:[]
				},
				isLocalList: [
					{
						name: "本地",
						value: "0"
					},
					{
						name: "外地",
						value: "1"
					}
				],
				defaultChannelCode:"",
				customerTypeList:[],
				customerTypeLists:[],//经营户性质  个体》。。。
				active: 2,
				radio: '001',
				labelList:[],
				sec: 5, //倒计时
				state: 1,
				xainShi:'',
				msg: '',
				msgs: '',
				regIdmsg:'',
				key: '',
				none: true,
				noneS:true,
				regidnone:true,
				yingCangAnjiu: 'none',
				zhuCiYingcang: 'none',
				channelList: [],
				telephoneList: [],
				flag: true,
				businessUploadList: [],//图片
				marketcertPicList: [],
				foodLicensePicList:[],
				muslimfoodPermitPicList:[],
				legalpepresentUploadList: [],//图片
				storeUploadList: [],//图片
				idCardPic_01List: [],//图片
				idCardPic_02List: [],//图片
				uploadData: {
					savePath: 'registerNewtwo'
				},
				businessLicensePic:'',//执照照片
				legalpepresentPic:'',//法人照片
				foodLicensePic:'',//
				muslimfoodPermitPic:'',//

				storePic:'',//门头照片
				idCardPic_01:'',
				idCardPic_02:'',
				rules: {
					password: [{required: true,validator: validatePass, trigger: 'blur'}, this._ruleLength(16)],
					passwordNew: [{required: true,validator: validatePass2, trigger: 'blur'}, this._ruleLength(16)],
					regId: [{required: true, message:'证件编码不能为空', trigger: 'blur'}, this._ruleLength(30)],
					name: [{required: true, message:'昵称不能为空', trigger: 'blur'}, this._ruleLength(16)],
					// property1: [{required: true, message:'请选择经营户类型', trigger: 'blur'}],

					legalpepresent: [{required: true, message:'法人不能为空', trigger: 'blur'}, this._ruleLength(20)],
					address: [{required: true, message:'地址不能为空', trigger: 'blur'}, this._ruleLength(100)],
					radio: [{required: true, message: '请选择身份', trigger: 'change'}],
					businessLicensePic: [{required: true,message: "请上传营业执照"}],
					marketcertPic: [{ required: true,message: "请上传市场证明"}],
				},
				logoPic: '',
				logoTxt: ''
			}
		},
		created(){
			this.getTCType();
			this.getCategoryType()
			this.getCustomerType()
			this.getCustomerTypes();
     	// 获取默认渠道
			$.ajax({
				type: "POST",
				url: this.rootAPI + 'channel/list',
				data: {
					level: 3,
					deleted: 0,
					isDefault: 1
				},
				success: (d)=> {
					if (d && d.state == 0) {
						if (d.aaData.length>0) {
							this.defaultChannelCode = d.aaData[0].code
						}
					}
				}
			})
		},
		mounted() {
			if(configs.city === '银川') {
				this.logoTxt = '银川追溯卖家中心'
				this.logoPic = '银川'
			}
			if(configs.city === '临沂') {
				this.logoTxt = '临沂追溯卖家中心'
				this.logoPic = '临沂'
			}
			if(configs.city === '农鲜汇') {
				this.logoTxt = '农鲜汇卖家中心'
				this.logoPic = '农鲜汇'
			}
			this.init();
			var vm = this;
			$.ajax({
					type: "POST",
					url: vm.rootAPI + 'datadic/list',
					data:{
						dataType:'BEIHUAN_CUSTOMER_PROPERTY',
						enabled: 1,
						orderField:"f_id"
					},
					success: function(d) {
						Object.assign(vm.dataDic, {
							labelList: d.aaData
						})
						vm.xuanZe("001");
					}
			})
		},
		methods: {
			/**
			 * 获取经营户类型
			 */
			getCustomerType() {
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'datadic/list',
					data:{
						dataType: "CUSTOMER_TYPE",
						extendVal: "merchant"
					},
					success: (d)=> {
						if (d && d.state == 0) {
							if (d.aaData) {
								this.customerTypeList = d.aaData;
							}
						}
					}
				})

			},
			getCustomerTypes() {
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'datadic/list',
					data:{
						dataType: "CUSTOMER_PROPERTY"
					},
					success: (d)=> {
						if (d && d.state == 0) {
							if (d.aaData) {
								this.customerTypeLists = d.aaData;
							}
						}
					}
				})
			},
			getTCType() {
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'datadic/list',
					data: {
						dataType: "TC_TYPE"
					},
					success: (d)=> {
						if (d && d.state == 0) {
							if (d.aaData) {
								this.TCTypeList = d.aaData;
							}
						}
					}
				})
    	},
			/**
			 * 获取供应商品分类
			 */
			getCategoryType() {
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'category/list',
					data: {
						level: 1,
						enabled: 1,
						deleted:0
					},
					success: (d)=> {
						if (d && d.state == 0) {
							if (d.aaData) {
								this.categoryTypeList = d.aaData;
							}
						}
					}
				})
			},
			init() {
				var wm = this;
				//查询渠道数据
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'channel/list',
					data: {
						enabled: 1,
						deleted:0,
						level: 3
					},
					success: function(d) {
						wm.channelList = d.aaData
					}
				})
				//获取数据字典里面的用户类型
			},
			//选择
			xuanZe(label) {
				this.radio = label;
				var vm = this;
				if(vm.radio.length <= 0) {
					vm.none = true;
					vm.msgs = "请选择用户类型,否则将无法完成注册！！";
				} else {
					vm.none = false;
					vm.msgs = "";
				}
			},
			lastStep() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						if(this.active-- > 3) {
							this.active = 1;
						}
						this.dispalyUser = this.active == 0;
						this.dispalyPro = this.active == -1 && (this.state == 1 && this.telephone!="");
						this.dispalyPlease = this.active == -2 && (this.radio == '001' || this.radio == '002' ||this.radio == '004');
						this.dispalyQudao = this.active == -2 && this.radio == '003';
						this.dispalyoneP = this.active == -2 &&  this.radio == '005';
					} else {
						return false;
					}
				});
			},
			next() {
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'customer/telephoneMatche',
					data: {
						telephone: this.form.telephone
					},
					success: (d)=> {
						if (d && d.state == 1) {
							this.active++
						} else {
							this.$message({ type: 'error', message: d.msg });
							return false
						}
					}
				})
				// this.$refs['form'].validate((valid) => {
				// 	if(valid) {
				// 		if(this.active++ > 3) {
				// 			this.active = 1;
				// 		}
				// 		this.dispalyUser = this.active == 0;
				// 		this.dispalyPro = this.active == 1 && (this.state == 1 && this.telephone!="");
				// 		this.dispalyPlease = this.active == 2 && (this.radio != '005');
				// 		this.dispalyQudao = this.active == 2 && this.radio == '003';
				// 		this.dispalyoneP = this.active == 2 &&  this.radio == '005';
				// 		this.dispalyRegistOK = this.active == 3;
				// 	} else {
				// 		return false;
				// 	}
				// });
			},
			active1Next(){
				if(this.active == 2 && (this.radio=='001'||this.radio=='002') && this.form.channelCode == ''){
					this.$message({ type: 'error', message: '请选择渠道类型！' });
					return false
				}
				if(this.active == 2 && (this.radio=='001'||this.radio=='002') && this.form.property == '' && this.form.channelCode != '001201'){
					this.$message({ type: 'error', message: '请选择经营户类型！' });
					return false
				}
				if(this.active == 2 && this.radio=='001' && this.form.channelCode == 'QT' && this.form.property != '2'){
					this.$message({ type: 'error', message: '请选择供应商品来源！' });
					return false
				}
				// 除了一批二批选择渠道都选择默认渠道
				if(this.active == 2 && !(this.radio=='001'||this.radio=='002') && this.form.channelCode == ''){
					this.form.property = this.defaultProperty
				}
				if(this.active == 2 && (this.radio == '007' || this.radio == '001') && this.form.businessScope == ''){
					this.$message({ type: 'error', message: '请选择供应商品分类！' });
					return false
				}
				if(this.active == 2 && (this.radio == '003') && this.form.enterpriseType == ''){
					this.$message({ type: 'error', message: '请选择企业类型！' });
					return false
				}
				this.active++
				console.log(this.form)
			},
			// 昵称
			nameCilek(){
				var nm = this;
				if(nm.form.name =="") {
					nm.state = 2;
					nm.xainShi = "昵称不能为空";
					nm.xainShiColor = '#f56c6c';
					nm.noneS = true;
					return;
				}
				//查询渠道数据
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'customer/nameMatche',
					data: {
						name: nm.form.name
					},
					success: function(d) {
						nm.state = d.state;
						if (nm.state == 1) {
							nm.xainShiColor = 'green'
							nm.xainShi = "";
							nm.noneS = false;
						}else {
							nm.xainShiColor = '#f56c6c';
							nm.xainShi = d.msg;
							nm.noneS = true;
						}
					}
				})
			},
//			手机号
			telephoneCilek() {
				var wm = this;
				if(!(/^1(3|4|5|7|8)\d{9}$/).test(wm.form.telephone) && wm.form.telephone=="") {
					wm.state = 2;
					wm.msg = "手机号不能为空";
					wm.msgColor = '#f56c6c';
					wm.noneS = true;
					return;
				}
				//查询渠道数据
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'customer/telephoneMatche',
					data: {
						telephone: wm.form.telephone
					},
					success: function(d) {
						wm.state = d.state;
						if (wm.state == 1) {
							wm.msgColor = 'green';
							wm.msg = "";
							wm.noneS = false;
						}else {
							wm.noneS = true;
							wm.msg = d.msg;
							wm.msgColor = '#f56c6c';
						}
					}
				})

			},
//			营业执照编码验证
			regIdeCilek(){
				var wm = this;
				if(wm.form.regId == "") {
					wm.dataCount > 0;
					wm.regIdmsg = "营业执照编码不能为空";
					wm.regIdmsgColor = '#f56c6c';
					wm.regidnone = true;
					return;
				}
				//查询渠道数据
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'customer/list',
					data: {
						regId: wm.form.regId
					},
					success: function(d) {
						if(d.state === 0) {
							wm.dataCount = d.dataCount;
							if (wm.dataCount === 0) {
	//							wm.regIdmsgColor = 'green';
								wm.regIdmsg = "";
								wm.regidnone = false;
							}else if(wm.dataCount > 0){
								wm.regidnone = true;
								wm.regIdmsg = "该营业执照编号已存在";
								wm.regIdmsgColor = '#f56c6c';
							}else {
								wm.regidnone = true;
								wm.regIdmsg = d.msg;
								wm.regIdmsgColor = '#f56c6c';
							}
						}else {
							wm.regidnone = true;
							wm.regIdmsg = d.msg;
							wm.regIdmsgColor = '#f56c6c';
						}
					}
				})
			},
			Submit() {
				this.$refs['form'].validate((valid) => {
					if(this.state != 1) {
						return;
					}
					if(valid) {
						let o = {}
						let method = "customer/customerRegist";
						if(this.form.channelCode=="" || this.form.channelCode==null){
							this.form.channelCode='001001';
						}
						o = {
							name: this.form.name,
							telephone: this.form.telephone,
							password: this.form.password,
							customerProperty: this.radio,
							regId: this.form.regId,//执照编码
							property: this.form.property,
							channelCode:this.form.channelCode==""?"001001":this.form.channelCode,
							legalpepresent: this.form.legalpepresent,//法人
							businessLicensePic: this.businessLicensePic,//执照照片
							legalpepresentPic: this.legalpepresentPic,//法人照片
							foodLicensePic: this.foodLicensePic,//法人照片
							muslimfoodPermitPic: this.muslimfoodPermitPic,//法人照片
							storePic: this.storePic,//门头照片
							address: this.form.address,
							enterpriseType: this.form.enterpriseType,
        			marketcertPic: this.form.marketcertPic
							

						}
						if (this.idCardPic_01 != "" && this.idCardPic_02 != "") {
							o.idCard = `${this.idCardPic_01};${this.idCardPic_02}`;
						}
						if (o.customerProperty == "007" || o.customerProperty == "001") {
								this.form.businessScope?o.businessScope = this.form.businessScope.join("/"):o.businessScope='';
						}
						if (o.customerProperty == "001") {
							o.islocal = this.form.isLocal;
							//o.type = this.form.type;
						}
						if(!(this.radio=='001'||this.radio=='002') && this.form.channelCode == ''){
							o.channelCode = this.defaultChannelCode
						}
						
						console.log(o)
            //            //校验图片是否上传
						// if(this.radio != '005'){
						// 	if((this.businessLicensePic.length<=0 && this.legalpepresentPic.length<=0)||(this.businessLicensePic.length<=0 && this.storePic.length<=0)){
						// 	 this.$message({ type: 'error', message: '图片不能为空,无法提交！' });
						// 	 return
						// 	}
						// }
						//跳转下一步、提交
						if(this.active++ > 3) {
							this.active = 1;
						}
						this.dispalyPlease = this.active == 2;
						this.dispalyQudao = this.active == 2;
						this.dispalyoneP = this.active == 2
						this.dispalyRegistOK = this.active == 3;
						let user = local.get('sessionUser');
						var wm = this;
						for (var key in o) {
							if (typeof o[key] === 'string') {
								o[key] = $.trim(o[key].replace(/<\/?[^>]*>/g, ''))
							}
						}
						//查询渠道数据
						$.ajax({
							type: "POST",
							url: wm.rootAPI + method,
							data: o,
							success: (d) => {
								if(d.state == 0) {
									wm.zhuCiYingcang = 'block';
									wm.$message({
										type: 'success',
										message: '操作成功'
									});
									//倒计时5秒
									var that = wm;
									var setIn = window.setInterval(function() {
										if(that.flag) {
											if(that.sec > 1) {
												that.sec--;
											} else {
												window.clearInterval(setIn);
												that.signLogin();
											}
										}

									}, 1000);
								} else {
									wm.yingCangAnjiu = 'block';
									wm.$message({
										type: 'failure',
										message: d.msg
									});
								}
								wm.$emit('submit')
							}
						})
					}
				})
			},
			signLogin() {
				this.flag = false;
				this.$router.push({
					path: '/login'
				});
			},
			signChongxin() {
				location.reload();
			},
			denvglu() {
				this.flag = false;
				this.signLogin();
			},
			legalpepresentUploadSuccess(response, file, fileList) {
				this.legalpepresentPic = this._uploadPath(response)
			},
			businessUploadSuccess(response, file, fileList) {
				this.businessLicensePic = this._uploadPath(response)
			},
			marketcertPicSuccess(response, file, fileList) {
				this.marketcertPic = this._uploadPath(response)
			},
			businessUploadRemove(file, fileList) {
				this.businessLicensePic = ''
			},
			marketcertPicRemove(file, fileList) {
				this.marketcertPic = ''
			},
			muslimfoodPermitPicSuccess(response, file, fileList) {
				this.muslimfoodPermitPic = this._uploadPath(response)
			},
			foodLicensePicSuccess(response, file, fileList) {
				this.foodLicensePic = this._uploadPath(response)
			},
			idCardPic_01Success(response, file, fileList) {
				this.idCardPic_01 = this._uploadPath(response)
			},
			idCardPic_02Success(response, file, fileList) {
				this.idCardPic_02 = this._uploadPath(response)
			},
			legalpepresentUploadRemove(file, fileList) {
				this.legalpepresentPic = ''
			},
			foodLicensePicRemove(file, fileList) {
				this.foodLicensePic = ''
			},
			muslimfoodPermitPicRemove(file, fileList) {
				this.muslimfoodPermitPic = ''
			},
			idCardPic_01Remove(file, fileList) {
				this.idCardPic_01 = ''
			},
			idCardPic_02Remove(file, fileList) {
				this.idCardPic_02 = ''
			},
			storeUploadSuccess(response, file, fileList) {
				this.storePic = this._uploadPath(response)
			},
			storeUploadRemove(file, fileList) {
				this.storePic = ''
			},
		}
	}
</script>

<style lang="sass">
	.custormerRegist {
		width: 100%;
		background-color: #FFFFFF;
		margin: 0 auto;
		.headBOX {
			width: 100%;
			height: 60px;
			background-color: #1e88e5;
			box-shadow: 0px 1px 5px #343A40;
			span {
				margin-left: 10px;
				padding: 0;
				font {
					line-height: 60px;
					font-size: 24px;
					color: #FFFFFF;
					margin-left: 10px;
					font-family: "微软雅黑";
				}
				img {
					padding-bottom: 10px;
					margin: 0;
				}
			}
			.woyaodengl {
				float: right;
				font {
					line-height: 60px;
					font-size: 24px;
					color: #FFFFFF;
					margin-right: 20px;
					font-family: "微软雅黑";
				}
			}
		}
		.cusRegistform {
			width: 100%;
			overflow: hidden;
			margin: 0 auto;
		}
		.shezhiYh {
			width: 800px;
			text-align: center;
			margin: 0 auto;
			img {
				width: 100%;
			}
			.anjiuBut {
				margin-right: 10px;
				height: 150px;
				text-align: center;
				border: 1px solid #EFEFEF;
				border-radius: 5px;
				text-align: center;
				.el-radio__input{
					float: left;
				}
				.customerPHO{
					width: 80px;
					margin-top: 20px;
					margin-right: 20px;
				}
				.customerName{
					line-height:30px;
				}
			}
			.anjiuBut_GYS {
				width: 420px;
				height: 150px;
				text-align: center;
				border: 1px solid #EFEFEF;
				border-radius: 5px;
				float: left;
				text-align: center;
				margin-left: 10px;
				.el-checkbox__input{
					float:left;
				}
				.customerPHO{
					width:60px;
				}
				.customerPHO1{
					width:80px;
				}
				.customerPHO2{
					width:50px;
				}
				.customerName{
					line-height:30px;
				}
			}
			.dashdv {
				line-height: 100px;
			}
			.GyingsjBox1 {
				width: 240px;
				float: left;
				margin-left: 18px;
				border: 1px solid #EFEFEF;
			}
			.GyingsjBox {
				width: 120px;
				float: left;
				margin-left: 18px;
				border: 1px solid #EFEFEF;
			}
			.Gyingsj {
				width: 90px;
				height: 70px;
			}
			.Gyingsj1 {
				width: 90px;
				height: 70px;
			}
			.Gyingsj2 {
				width: 80px;
				height: 70px;
			}
			.Msgs {
				color: red;
				font-size: 20px;
				line-height: 60px;
				position: absolute;
				top: 300px;
			}
			.gerenxinX3{
			  width:600px;
			  text-align: left;
			  float: left;
			  border:1px solid #FDFDFD;
			  padding:10px;
			  border-radius:5px;
		    }
		}
	}
</style>
