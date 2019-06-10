<template>
	<div class="custormerRegist">
		<div class="headBOX">
			<span>
				<img src="../../lib/img/home_ing_logo.png" v-if="logoPic !== '农鲜汇'"/>
				<font>{{logoTxt}}</font>
				<font>用户注册</font>
			</span>
			<span class="woyaodengl" @click="denvglu()">
				<font>我要登录</font>
			</span>
		</div>
		<el-steps :active="active" finish-status="success" style="padding:120px;">
			<el-step id="tiaozhuan1" title="设置用户名"></el-step>
			<el-step id="tiaozhuan2" title="选择身份"></el-step>
			<el-step id="tiaozhuan3" title="合作商/渠道"></el-step>
			<el-step id="tiaozhuan4" title="注册结果"></el-step>
		</el-steps>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" class="cusRegistform">
			<div class="shezhiYh" v-if="dispalyUser">
				<el-form-item label="昵称" prop="name">
					<i style="color:#FD482C;position: absolute;left: -52px;">*</i>
					<el-input v-model="form.name" @blur="nameCilek" :maxlength="16"></el-input>
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
				<p class="dashdv">
					<el-button type="primary" @click="next()" :disabled="none">下一步</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyPro">
				<div class="anjiuBut">
					<p class="Msgs">{{msgs}}</p>
					<el-radio class="anjiuBut"  @change="xuanZi" v-model="radio" label="buyer" type="redio" prop="radio">
						<img class="customerPHO" src="../../lib/img/icon_caigoushang @2x.png"/></br>
						<span class="customerName">采购商</span>
					</el-radio>
				</div>
				<!--<el-radio class="anjiuBut" v-model="radio" label="merchant" prop="radio">供应商</el-radio>-->
				<el-checkbox-group @change="qingChu" v-model="checkList" class="anjiuBut_GYS">
					<p style="font-size: 20px;line-height:40px">供应商</p>
					<div class="GyingsjBox1">
						<el-checkbox label="merchant" class="Gyingsj">
							<img class="customerPHO1" src="../../lib/img/icon_gonghuoshang @3x.png"/></br>
							<span>供应</span>
						</el-checkbox>
						<el-checkbox label="sorter" class="Gyingsj1">
							<img class="customerPHO" src="../../lib/img/icon_fenjian@2x.png"/></br>
							<span>分拣</span>
						</el-checkbox>
					</div>
					<div class="GyingsjBox">
						<el-checkbox label="distribution" class="Gyingsj2">
							<img class="customerPHO2" src="../../lib/img/icon_peisongshang @2x.png"/></br>
							<span>配送</span>
						</el-checkbox>
					</div>
				</el-checkbox-group>
				<p class="dashdv">
					<el-button type="primary" @click="lastStep()">上一步</el-button>
					<el-button type="primary" @click="next()" :disabled="none">下一步</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyPlease">
				<el-form-item label="邀请码">
					<el-input v-model="form.invitationCode"></el-input>
				</el-form-item>
				<p  class="dashdv">
					<!--<el-button type="primary" @click="lastStep()">上一步</el-button>-->
					<el-button type="primary" @click="Submit()">提 交</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyQudao">
				<el-form-item label="渠道" prop="channelCode">
					<el-select v-model="form.channelCode" placeholder="请选择">
						<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
				<p class="dashdv">
					<!--<el-button type="primary" @click="lastStep()">上一步</el-button>-->
					<el-button type="primary" @click="Submit()">提 交</el-button>
				</p>
			</div>
			<div class="shezhiYh" v-if="dispalyRegistOK">
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
				dispalyPlease: false,
				dispalyQudao: false,
				dispalyRegistOK: false,
				msgColor: '#f56c6c',
				xainShiColor:'#f56c6c',
				textLeft: 'left',
				ISblur:'1px solid #409EFF',
				form: {
					name: '',
					telephone: '',
					channelCode: '',
					invitationCode: '',
					password: '',
					passwordNew: '',
				},
				checkList: ['merchant', ],
				active: 0,
				radio: '',
				sec: 5, //倒计时
				state: 1,
				xainShi:'',
				msg: '',
				msgs: '',
				key: '',
				none: true,
				yingCangAnjiu: 'none',
				zhuCiYingcang: 'none',
				channelList: [],
				telephoneList: [],
				flag: true,
				rules: {
					password: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}, this._ruleLength(16)],
					passwordNew: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}, this._ruleLength(16)],
					radio: [{
						required: true,
						message: '请选择身份',
						trigger: 'change'
					}],
					channelCode: [{
						required: true,
						message: '请选择渠道',
						trigger: 'change'
					}],
				},
				logoPic: '',
				logoTxt: ''
			}
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
			},
			lastStep() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						if(this.active-- > 2) {
							this.active = 0;
						}
						this.dispalyUser = this.active == 0;
						this.dispalyPro = this.active == -1 && (this.state == 1 && this.telephone!=" ");
						this.dispalyPlease = this.active == -2 && this.radio == 'buyer';
						this.dispalyQudao = this.active == -2 && this.checkList.length > 0;
						//this.dispalyQudao = this.active == 2 && this.radio == 'merchant';
						this.dispalyRegistOK = this.active == -3 && this.channelCode.length <= 0;
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
						this.dispalyPro = this.active == 1 && (this.state == 1 && this.telephone!=" ");
						this.dispalyPlease = this.active == 2 && this.radio == 'buyer';
						this.dispalyQudao = this.active == 2 && this.checkList.length > 0;
						//this.dispalyQudao = this.active == 2 && this.radio == 'merchant';
						this.dispalyRegistOK = this.active == 3;
					} else {
						return false;
					}
				});
			},
			xuanZi(label) {
				this.radio = label;
				this.checkList = [];
				var vm = this;
				if(vm.radio.length <= 0) {
					vm.none = true;
					vm.msgs = "请选择用户类型,否则将无法完成注册！！";
				} else {
					vm.none = false;
					vm.msgs = "";
				}
			},
			qingChu() {
				this.radio = '';
				var vm = this;
				if(vm.checkList.length <= 0) {
					vm.none = true;
					vm.msgs = "请选择用户类型,否则将无法完成注册！！";

				} else if(vm.checkList.length ==1 && vm.checkList == "sorter") {
					vm.checkList = ["sorter", "merchant"];
					vm.msgs = "选择分拣商时，必须选择供应商.";
					vm.none = false;
					
				} else if(vm.checkList.length == 2 && vm.checkList.sort().toString() == ["sorter", "distribution"].sort().toString()) {
					vm.msgs = "选择分拣商时，必须选择供应商.";
					vm.none = true;
					
				} else {
					vm.none = false;
					vm.msgs = "";
					
				}

			},
			nameCilek(){
				var nm = this;
				if(nm.form.name =="") {
					nm.state = 2;
					nm.xainShi = "昵称不能为空";
					nm.xainShiColor = '#f56c6c';
					nm.none = true; 
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
							nm.none = false; 
						}else {
							nm.xainShiColor = '#f56c6c';
							nm.xainShi = d.msg;
							nm.none = true; 
						}
					}
				})
			},
			telephoneCilek() {
				var wm = this;
				if(!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$/).test(wm.form.telephone) && wm.form.telephone=="") {
					wm.state = 2;
					wm.msg = "手机号不能为空";
					wm.msgColor = '#f56c6c';
					wm.none = true;
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
							wm.none = false;
						}else {
							wm.none = true;
							wm.msg = d.msg;
							wm.msgColor = '#f56c6c';
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
						let o = {},
							method = "customer/customerRegist";
						if(this.radio == 'buyer') {
							this.channelCode = '001'
						}
						if(this.checkList.length == 0) {
							this.key = this.radio;
						} else {
							var vm = this;
							$.each(vm.checkList, function() {
								vm.key = vm.key + this;
								vm.key = vm.key + ',';
							});
							vm.key = vm.key.substring(0, vm.key.length - 1);
						}
						o = {
							name: this.form.name,
							telephone: this.form.telephone,
							key: this.key,
							password: this.form.password,
							channelCode: this.form.channelCode,
							invitationCode: this.form.invitationCode,
						}

						//跳转下一步、提交
						if(this.active++ > 2) {
							this.active = 0;
						}
						this.dispalyPlease = this.active == 2;
						this.dispalyQudao = this.active == 2;
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
			signChongxin() {
				location.reload();
			},
			denvglu() {
				this.flag = false;
				this.signLogin();
			},
			resetForm(form) {
				this.$refs[form].resetFields();
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
			width: 620px;
			height: 220px;
			text-align: center;
			margin: 0 auto;
			img {
				width: 100%;
			}
			.anjiuBut {
				width: 180px;
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
		}
	}
</style>