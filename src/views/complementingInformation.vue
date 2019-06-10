<template>
	<div class="custormerRegist">
		<div class="headBOX">
			<span>
				<img src="../../lib/img/home_ing_logo.png" v-if="logoPic !== '农鲜汇'"/>
				<font>{{logoTxt}}</font>
				<font>用户注册信息完善</font>
			</span>
			<span class="woyaodengl" @click="denvglu()">
				<font>我要登录</font>
			</span>
		</div>
		<el-steps :active="active" finish-status="success" style="padding:120px;">
			<el-step id="tiaozhuan1" title="设置用户名"></el-step>
			<el-step id="tiaozhuan2" title="选择角色"></el-step>
			<el-step id="tiaozhuan3" title="完善信息"></el-step>
			<el-step id="tiaozhuan4" title="完善结果"></el-step>
		</el-steps>
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" class="cusRegistform">
			<div class="shezhiYh" v-if="dispalyUser">
				<el-form-item label="昵称" prop="name">
					<i style="color:#FD482C;position: absolute;left: -52px;">*</i>
					<el-input v-model="form.name" :maxlength="16" :disabled="true"></el-input>
					<!--<span :style="{float:textLeft,color:xainShiColor}">{{xainShi}}</span>-->
				</el-form-item>
				<el-form-item label="手机号" prop="telephone">
					<i style="color:#FD482C;position: absolute;left: -65px;">*</i>
					<el-input v-model="form.telephone"  :maxlength="11" :disabled="true"></el-input>
					<!--<span :style="{float:textLeft,color:msgColor}">{{msg}}</span>-->
				</el-form-item>
				</i>
				<!--<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="form.password" :maxlength="16" :minlength="6" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="passwordNew">
					<el-input type="password" v-model="form.passwordNew" :maxlength="16" :minlength="6" auto-complete="off"></el-input>
				</el-form-item>-->
				<p  class="dashdv">
					<el-button type="primary" @click="next()" >下一步</el-button>
				</p>
			</div>
			<!--渲染第二部选择类型-->
			<div class="shezhiYh" v-if="dispalyPro">
				<div class="anjiuBut" v-for="item in dataDic.labelList">
					<p class="Msgs">{{msgs}}</p>
					<el-radio class="anjiuBut"  @change="xuanZe" v-model="radio" :label="item.key" type="redio" prop="radio">
						<img class="customerPHO" src="../../lib/img/icon_caigoushang @2x.png"/></br>
						<div class="customerName">{{item.value}}</div>
					</el-radio>
				</div>
				<p class="dashdv">
					<el-button type="primary" @click="lastStep()">上一步</el-button>
					<el-button type="primary" @click="next()" :disabled="none">下一步</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyPlease">
				<el-form-item label="营业执照号码" prop="regId">
					<el-input v-model="form.regId"></el-input>
				</el-form-item>
				<el-form-item label="营业执照照片" prop="businessLicensePic">
					<i style="color:#FD482C;position: absolute;left: -106px;">*</i>
                    <uploadItem class="gerenxinX3" buttonType="icon"  @success="businessUploadSuccess" :uploadData="uploadData" @remove="businessUploadRemove" :fileList="businessUploadList" accept='.jpg,.png'></uploadItem>
	            </el-form-item>
				<el-form-item label="法人名" prop="legalpepresent">
					<el-input v-model="form.legalpepresent"></el-input>
				</el-form-item>
				<el-form-item label="法人照片" prop="legalpepresentPic">
					<i style="color:#FD482C;position: absolute;left: -78px;">*</i>
                    <uploadItem class="gerenxinX3" buttonType="icon"  @success="legalpepresentUploadSuccess" :uploadData="uploadData" @remove="legalpepresentUploadRemove" :fileList="legalpepresentUploadList" accept='.jpg,.png'></uploadItem>
	            </el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<p  class="dashdv">
					<el-button type="primary" @click="Submit()" >提 交</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyQudao">
				<el-form-item label="营业执照号码" prop="regId">
					<el-input v-model="form.regId"></el-input>
				</el-form-item>
				<el-form-item label="营业执照照片" prop="businessLicensePic">
					<i style="color:#FD482C;position: absolute;left: -106px;">*</i>
                    <uploadItem class="gerenxinX3" buttonType="icon"  @success="businessUploadSuccess" :uploadData="uploadData" @remove="businessUploadRemove" :fileList="businessUploadList" accept='.jpg,.png'></uploadItem>
	            </el-form-item>
				<el-form-item label="法人名" prop="legalpepresent">
					<el-input v-model="form.legalpepresent"></el-input>
				</el-form-item>
				<el-form-item label="门头照片" prop="storePic">
					<i style="color:#FD482C;position: absolute;left: -78px;">*</i>
                    <uploadItem class="gerenxinX3" buttonType="icon"  @success="storeUploadSuccess" :uploadData="uploadData" @remove="storeUploadRemove" :fileList="storeUploadList" accept='.jpg,.png'></uploadItem>
	            </el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<p class="dashdv">
					<el-button type="primary" @click="Submit()" >提 交</el-button>
					<!--:disabled="subNone"-->
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyoneP">
				<el-form-item label="地址"  prop="address">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<p class="dashdv">
					<el-button type="primary" @click="Submit()">提 交</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyRegistOK">
				<div id="zhuceCG" :style="{display:zhuCiYingcang}">
					<img src="../../lib/img/xiugaichenggong.png"/>
					<div>恭喜你完善修改成功，系统将于
						<font color="blue"><span id="num" size="2" face="impact">{{sec}}</span></font>秒后跳转至登录页面</div>
					<div class="dashdv">
						<el-button type="primary" @click="signLogin()">立即登录</el-button>
					</div>
				</div>
				<!--<div id="zhuceCG1" :style="{display:yingCangAnjiu}">
					<p class="dashdv">
						<el-button type="primary" @click="signChongxin()">重新注册</el-button>
					</p>
				</div>-->
			</div>
		</el-form>

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
				dispalyUser: true,
				dispalyPro: false,
				dispalyPlease: false,//完善信息1
				dispalyQudao: false,//完善信息2
				dispalyoneP:false,//完善信息3
				dispalyRegistOK: false,
				msgColor: '#f56c6c',
				xainShiColor:'#f56c6c',
				textLeft: 'left',
				ISblur:'1px solid #409EFF',
				form: {
					id:'',
					name: '',
					telephone: '',
					customerProperty:'',
					password: '',
					passwordNew: '',
					regId:'',//执照编码
					legalpepresent:'',//法人
					address:'',
					validDay:0,
					isValid:1,
				},
				dataDic:{
					labelList:[]
				},
				active: 0,
				radio: '001',
				labelList:[],
				sec: 5, //倒计时
				state: 1,
				xainShi:'',
				msg: '',
				msgs: '',
				key: '',
				none: true,
				noneS:true,
				yingCangAnjiu: 'none',
				zhuCiYingcang: 'none',
				channelList: [],
				telephoneList: [],
				flag: true,
				businessUploadList: [],//图片
				legalpepresentUploadList: [],//图片
				storeUploadList: [],//图片
				uploadData: {
                    savePath: 'registerNewtwo'
                },
                businessLicensePic:'',//执照照片
				legalpepresentPic:'',//法人照片
				storePic:'',//门头照片
				rules: {
					password: [{required: true,validator: validatePass, trigger: 'blur'}, this._ruleLength(16)],
					passwordNew: [{required: true,validator: validatePass2, trigger: 'blur'}, this._ruleLength(16)],
					regId: [{required: true, message:'证件编码不能为空', trigger: 'blur'}, this._ruleLength(30)],
					legalpepresent: [{required: true, message:'法人不能为空', trigger: 'blur'}, this._ruleLength(20)],
					address: [{required: true, message:'地址不能为空', trigger: 'blur'}, this._ruleLength(100)],
					radio: [{required: true, message: '请选择身份', trigger: 'change'}],
				},
				logoPic: '',
				logoTxt: ''
			}
		},
		mounted() {
//			console.log(this.$route.query.userinfo)
//			console.info(this.$route.query)
			var userinfo = this.$route.query.userinfo
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
				if(userinfo.isValid==0){
					this.form.name=userinfo.nickName
					this.form.telephone=userinfo.loginName
					this.form.id=userinfo.typeCode
				}
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
			init() {
				var wm = this;
				//查询渠道数据
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'channel/list',
					data: {
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
						if(this.active-- > 2) {
							this.active = 0;
						}
						this.dispalyUser = this.active == 0;
						this.dispalyPro = this.active == -1 && (this.state == 1 && this.telephone!="");
					} else {
						return false;
					}
				});
			},
			next() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						if(this.active++ > 2) {
							this.active = 0;
						}
						this.dispalyUser = this.active == 0;
						this.dispalyPro = this.active == 1 && (this.state == 1 && this.telephone!="");
						this.dispalyPlease = this.active == 2 && (this.radio == '001' || this.radio == '002' ||this.radio == '004');
						this.dispalyQudao = this.active == 2 && this.radio == '003';
						this.dispalyoneP = this.active == 2 &&  this.radio == '005';
						this.dispalyRegistOK = this.active == 3;
						return false;
					}
				});
			},

			Submit() {
				this.$refs['form'].validate((valid) => {
					if(this.state != 1) {
						return;
					}
					if(valid) {
						let o = {},
							method = "customer/customerRegist";
						o = {
							id:this.form.id,
							name: this.form.name,
							telephone: this.form.telephone,
							customerProperty: this.radio,
							regId:this.form.regId,//执照编码
							legalpepresent:this.form.legalpepresent,//法人
							businessLicensePic:this.businessLicensePic,//营业执照照片
							legalpepresentPic:this.legalpepresentPic,//法人照片
							storePic:this.storePic,//门头照片
							address:this.form.address,
							validDay:this.form.validDay,
							isValid:this.form.isValid,
						}
						//校验图片是否上传
						if(this.radio != '005'){
							if((this.businessLicensePic.length<=0 && this.legalpepresentPic.length<=0)||(this.businessLicensePic.length<=0 && this.storePic.length<=0)){
								 this.$message({ type: 'error', message: '图片不能为空,无法提交！' });
								 return
							}
						}
						//跳转下一步、提交
						if(this.active++ > 2) {
							this.active = 0;
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
												console.log(that.sec)
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
			//重新注册
//			signChongxin() {
//				location.reload();
//			},
			denvglu() {
				this.flag = false;
				this.signLogin();
			},
			businessUploadSuccess(response, file, fileList) {
                this.businessLicensePic = this._uploadPath(response)
            },
            businessUploadRemove(file, fileList) {
                this.businessLicensePic = ''
            },
            legalpepresentUploadSuccess(response, file, fileList) {
                this.legalpepresentPic = this._uploadPath(response)
            },
            legalpepresentUploadRemove(file, fileList) {
                this.legalpepresentPic = ''
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
		height: 100%;
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
			height: 600px;
			overflow: hidden;
			margin: 0 auto;
		}
		.shezhiYh {
			width: 800px;
			height: 220px;
			text-align: center;
			margin: 0 auto;
			img {
				width: 100%;
			}
			.anjiuBut {
				margin-left: 10px;
				height: 150px;
				text-align: center;
				border: 1px solid #EFEFEF;
				border-radius: 5px;
				float: left;
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