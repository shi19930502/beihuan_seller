<template>
	<div class="jianpuxinxi">
		<el-tabs v-model="activeName">
			<!--店铺信息-->
			<el-tab-pane label="店铺信息" name="first">
				<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="120px">
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
	                        <el-form-item label="店铺名称" prop="storeName" class="gerenxinX2">
	                            <inputItem :autosize="true" :value.sync="form.storeName" :maxlength="20" @blur="storeNameCilek" class="gerenxinXi"></inputItem></br>
	                            <span :style="{float:textLeft, color:msgColor}">{{msg}}</span>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="描述" prop="storeSuggest">
	                            <inputItem :autosize="true" type="textarea" :value.sync="form.storeSuggest" :maxlength="150" class="gerenxinXi"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	               <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="是否当天配送" prop="checked">
	                              <el-checkbox :autosize="true" v-model="checked" @change="changeCheckBox" class="gerenxinXi"></el-checkbox>
	                        </el-form-item>
	                    </el-col>
	                </el-row>

	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="配送周期" prop="period">
	                            <inputItem :autosize="true" :value.sync="form.period" :maxlength="2" class="gerenxinXi"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="配送开始时间" prop="distributionStart">
	                        	 <el-time-select v-model="form.distributionStart"
	                        	 	:clearable="false"
	                        	 	:picker-options="{
								    start: '00:00',
								    step: '00:60',
								    end: '24:00'
									}"
									placeholder="请选择时间"
									class="gerenxinXi">
								</el-time-select>
	                        	<!--<inputItem :autosize="true" :value.sync="form.distributionStart" maxlength="2" class="gerenxinXi"></inputItem>-->
	                        </el-form-item>

	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="配送结束时间" prop="distributionEnd">
	                        	 <el-time-select v-model="form.distributionEnd"
	                        	 	:clearable="false"
	                        	 	:picker-options="{
								    start: '00:00',
								    step: '00:60',
								    end: '24:00'
									}"
									placeholder="请选择时间"
									class="gerenxinXi">
								</el-time-select>
	                        	<!--<inputItem :autosize="true" :value.sync="form.distributionEnd" maxlength="2" class="gerenxinXi"></inputItem>-->
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="联系电话" prop="phoneNumber">
	                            <inputItem :autosize="true" :value.sync="form.phoneNumber"  maxlength="11" class="gerenxinXi"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
									<el-row style="margin-left: -160px;">
											<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
													<el-form-item label="营业时间段" prop="openStart" style="margin-left: 20px;">
														<el-time-select
														  v-model="form.openStart" :clearable="false"
														  :picker-options="{
																start: '00:00',
														    step: '00:60',
														    end: '24:00'
														  }"
														  placeholder="选择时间">
														</el-time-select>
															<!-- <inputItem :autosize="true" :value.sync="form.openStart" :maxlength="2" class="gerenxinXi" style="width: 150px"></inputItem> -->
													</el-form-item>
												 <el-form-item label="-" prop="openEnd" style="margin-left: -114px;">
													 <el-time-select
														 v-model="form.openEnd" :clearable="false"
														 :picker-options="{
															 start: '00:00',
															 step: '00:60',
															 end: '24:00',
															 minTime: this.form.openStart
														 }"
														 placeholder="选择时间">
													 </el-time-select>
													</el-form-item>
											</el-col>
									</el-row>
									<el-row>
											 <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
													 <el-form-item label="开启营业" prop="checked2">
														 <!-- <el-checkbox @change="changeCheckBox" v-model="checked"></el-checkbox> -->
															<el-checkbox :autosize="true" :label="开启营业" v-model="checked2"  @change="changeCheckBox2" class="gerenxinXi"></el-checkbox>
													 </el-form-item>
											 </el-col>
									 </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="店铺头像" prop="headPicUrl">
							    <uploadItem class="gerenxinX3" buttonType="icon"  @success="uploadSuccess" :uploadData="uploadData" @remove="uploadRemove" :fileList="uploadList" uploadTip="" accept='.jpg,.png'></uploadItem>
		                    </el-form-item>
	                    </el-col>
	                </el-row>
	            </el-form>
	            <div class="submitB">
			        <elBtn @click="Submit" type="primary" :disabled="none">提交</elBtn>
			    </div>
			</el-tab-pane>
			 <el-tab-pane label="配送金额" name="second">
			 	<el-form class="modal-form" :model="forms" ref="forms" :inline="true" :rules="rules" label-width="120px">
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="每单配送金额" prop="shippingTotal">
	                            <inputItem :autosize="true"  :value.sync="forms.shippingTotal" :maxlength="150" class="gerenxinXi" type='Number'></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	            </el-form>
			 	<div class="submitB">
			        <elBtn @click="Submits" type="primary" :disabled="none">提交</elBtn>
			    </div>
			 </el-tab-pane>
		</el-tabs>
   </div>
</template>

<script>
	var quotationIdTemp = '';
	import local from '../local.js'
	import configs from '../configs.js'
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
		    //电话验证
			var ContactNumber = (rule, value, callback) => {
		        if(!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/).test(this.form.phoneNumber)){
					callback(new Error('请输入正确的电话号码！'));
		        }
		        callback();
		      };
		    //配送周期
		     var Peisongtime = (rule, value, callback) => {
		        if(!(/^([1-9]|1\d|3[0-1])$/).test(this.form.period)){
					callback(new Error('配送周期为1-19天,请输入正确的配送周期！！'));
		        }
		        callback();
		     };
		     //配送时间
//		    var TimeNumber = (rule, value, callback) => {
//		        if(!(/^(20|21|22|23|\d)$/).test(this.form.distributionStart) && !(/^(20|21|22|23|[0-1]\d)$/).test(this.form.distributionEnd)){
//					callback(new Error('24小时制且输入都为整数！'));
//		        }else if(parseInt(this.form.distributionStart) >= parseInt(this.form.distributionEnd)){
//		        	callback(new Error('配送开始时间小于结束时间！'));
//		        }
//		        callback();
//		     };
		     var TimeNumber = (rule, value, callback) => {
		        if(parseInt(this.form.distributionStart) >= parseInt(this.form.distributionEnd)){
		        	callback(new Error('配送开始时间小于结束时间！'));
		        }
		        callback();
		     };
			return {
				activeName: 'first',
				distributionStart: new Date(),
				distributionEnd: new Date(),
				form:{
					id: '',
                    storeName:'',
                    regId:'',
                    storeSuggest:'',
                    phoneNumber:'',
                    distributionStart:'',
                    distributionEnd:'',
                    period:1,
                    distributionToday:'',
										openStart:'',
										openEnd:'',
										isopenTime:''
                },
				forms:{
					shippingTotal:''
                },
                rules: {
                	storeSuggest: [{message: '描述字段在150字以内！！', trigger: 'blur'}, this._ruleLength(150)],
                    phoneNumber:[{required: true,validator:ContactNumber,trigger: 'blur'}],
                    period:[{required: true,validator:Peisongtime,trigger: 'blur'}],
                    distributionStart:[{required: true,validator:TimeNumber,trigger: 'blur' }],
                    distributionEnd:[{required: true,validator:TimeNumber,trigger: 'blur' }],
										openStart:[{message: '营业开始时间不能为空',required: true,trigger: 'blur'}],
										openEnd:[{message: '营业结束时间不能为空',required: true,trigger: 'blur'}],
                },
                dataDic:{isEnabled : '', Id:''},
				dataList: [],
				rowOBJ: {},
				uploadfile:{
                	id:'',
                	filePath:'',
					fileSize:'',
					fileName:'',
					fileType:''
                },
                uploadList:[],
                headPicUrl:'',
                uploadData: {
                    savePath: 'storeinformation'
                },
				checked:false,
				checked2:false,
				msg:'',
				none:false,
				isCheckOne:'',
				isCheckTwo:'',
				yingCangAnjiu:'none',
				zhuCiYingcang:'none',
				msgColor:'#f56c6c',
				textLeft:'left',
				count:'',
			}
		},
		mounted() {
			this.getInitData();
		},
		methods: {
			changeCheckBox(value){

				if(value){
					this.form.distributionToday = 1;
					this.isCheckOne=1;
				}else{
					this.form.distributionToday = 0;
					this.isCheckOne=0;
				}
			},
			changeCheckBox2(value){
				if(value){
					this.form.isopenTime=1;
					this.isCheckTwo=1;
				}else{
					this.form.isopenTime=0;
					this.isCheckTwo=0;
				}
			},
			getInitData() {
				//店铺列表
				let user = local.get('sessionUser');
				this._ajax({url: this.rootAPI, name: 'store/queryBySellerId', param: {
					sellerId:user.typeCode,
				}}).then((function(d) {
	            	Object.assign(this.form,d.aaData);
	            	//初始化checkbox
								if (d.aaData !=null ) {
									this.checked = d.aaData.distributionToday==1;
									this.checked2= d.aaData.isopenTime==1	;
								}
	            	let storeTP=d.aaData
	            	if(storeTP.headPicUrl) {
						this.uploadfile = {
		            		id:storeTP.id,
		            		filePath : storeTP.headPicUrl,
		        		}
						this.uploadList=[];
						this.uploadList.push({"name" : "头像", "url" : configs.imgURL + storeTP.headPicUrl});
					}
	            }).bind(this))
			    this._ajax({url: this.rootAPI + "shippingfee/queryBySellerId", param: {
                    	sellerId:user.typeCode,
                }}).then((function(d) {
                    	this.forms.shippingTotal=d.aaData.shippingTotal
                }).bind(this))
			},
			searchTable() {
					 this._ajax({
					 	url: this.rootAPI,
					 	name: "store/queryBySellerId",
					 	param: param, loading: 'dataLoading'}).then(this.form)
			 },
		     //确定店铺名称唯一
			storeNameCilek(){
				var wm = this;
				//查询渠道数据
				if(wm.form.storeName=="") {
					wm.count = 1;
					wm.msg ="店铺名称不能为空";
					wm.xainShiColor = '#f56c6c';
					wm.none =true;
					return;
				}
				this._ajax({
					url: this.rootAPI,
					name: "store/queryByIsStoreNameEquals",
					param: {
						id:wm.form.id,
						storeName:wm.form.storeName,
					}, loading: 'dataLoading'}).then((function(d) {
                        wm.count=d.aaData.count;
						if(wm.count==0 ){
							wm.none =false;
							wm.msg ="";
						}else{
							wm.none =true;
							wm.msgColor = '#f56c6c';
							if(wm.form.storeName) {
								wm.count = 1;
								wm.msg ="输入的店铺名称已存在，为方便管理请重新取名！！";
								return;
							}
						}
                     }).bind(this))
			},
			Submit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "store/create";
                        let id = this.form.id;
                        if(id) {
                            method = "store/update";
                        }
                        o= {
                        	storeName: this.form.storeName,
					        storeSuggest: this.form.storeSuggest,
		                    phoneNumber: this.form.phoneNumber,
								sellerId:local.get('userinfo').typeCode,
								contacts:local.get('sessionUser').nickName,
						    remark: this.form.remark,
						    period: this.form.period,
								openStart:parseInt(this.form.openStart),
								openEnd:parseInt(this.form.openEnd),
								isopenTime:this.form.isopenTime,
						    distributionToday: this.form.distributionToday,
						    distributionStart: parseInt(this.form.distributionStart) ,
							distributionEnd: parseInt(this.form.distributionEnd),
							headPicUrl: this.uploadfile.filePath,
							id : id
	                    }
                        let user = local.get('sessionUser');
                        if(!id) {

                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		this.form.id = d.aaData.id;
                        		this.$message({ type: 'success', message: '操作成功' });
                        	} else {
                        		this.$message({ type: 'failure', msg});
                        	}
                        	this.getInitData();
                        	this.renderStoreInfo();
                            this.$emit('submit')

                        }).bind(this))
                    }
                })
			},
			Submits() {
				if(this.forms.shippingTotal==''){
					this.$message({ type: 'failure', message: '每单配送金额不能为空'});
					return
				}
				let user = local.get('sessionUser');
//				this.$refs['forms'].validate((valid) => {
//                  if (valid) {
                    this._ajax({url: this.rootAPI + "shippingfee/create", param: {
                    	sellerId:user.typeCode,
                    	shippingTotal:this.forms.shippingTotal
                    }})
                    .then((function(d) {
                    	if(d.state == 0) {
                    		this.$message({ type: 'success', message: '操作成功' });
                    	} else {
                    		this.$message({ type: 'failure', message: '操作失败'});
                    	}
                    }).bind(this))
//                  }
//              })
			},

		 	 uploadSuccess(response, file, fileList) {
            	if(response.state == 0) {
            		this.uploadfile.id = '';
            		this.uploadfile.filePath = response.aaData.path;
	            	this.uploadfile.fileSize = response.aaData.size;
	            	this.uploadfile.fileName = file.name;
	            	let fileTypeTemp = file.name.split('.');
	            	this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
	            	this.uploadList=[];
	            	this.uploadList.push({"name":"头像", "url":configs.imgURL + this.uploadfile.filePath});

            	}
            },
            uploadRemove(file, fileList) {
                Object.assign(this.form, {
                    filePath: ''
                })
                this.uploadfile.filePath = ''
            }
		}
	}
</script>
<style lang="sass">
	.jianpuxinxi{
		padding: 20px;
		text-align: center;
		.gerenxinX2{
			width:100%;
		}
		.gerenxinXi{
		  width:600px;
		  text-align: left;
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
</style>
