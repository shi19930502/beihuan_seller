<template>
	<div class="page-supplier">
		<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
			<el-row>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="供应商编号" prop="code">
	                    <inputItem :autosize="true" :value.sync="form.code"></inputItem>
	                </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="供应商名称" prop="name">
	                    <inputItem :autosize="true" :value.sync="form.name"></inputItem>
	                </el-form-item>
	            </el-col>
	        </el-row>
	        <el-row>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="联系电话" prop="tel">
	                    <inputItem :autosize="true" :value.sync="form.tel"></inputItem>
	                </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="公司名称" prop="companyName">
	                    <inputItem :autosize="true" :value.sync="form.companyName"></inputItem>
	                </el-form-item>
	            </el-col>
	        </el-row>
	        <el-row>
	        	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="营业执照号" prop="regId">
	                    <inputItem :autosize="true" :value.sync="form.regId"></inputItem>
	                </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="公司地址" prop="address">
	                    <inputItem :autosize="true"  type="textarea" :value.sync="form.address"></inputItem>
	                </el-form-item>
	            </el-col>
	        </el-row>
	        <el-row>
	        	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="资质图片（最多上传三张图片）" prop="picUrl">
					    <uploadItem buttonType="icon" listType="picture-card" :limit="3" @success="uploadSuccess" :uploadData="uploadData" @remove="uploadRemove" :fileList="uploadList" uploadTip="" ></uploadItem>
	                </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="备注" prop="remark" class="row-block">
	                    <inputItem type="textarea" :value.sync="form.remark"></inputItem>
	                </el-form-item>
	            </el-col>
	        </el-row>
	    </el-form>
	    <div style="text-align: right">
	        <iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check">提交</iconBtn>
	        <elBtn @click="cancel" type="info">取消</elBtn>
	    </div>
   </div>
</template>

<script>
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
//import { constants } from 'http2';
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				form: {
					id : '',
					code : '', 
					name : '', 
					tel : '', 
					companyName : '', 
					regId : '', 
					address : '', 
					picUrl : '', 
					remark : ''
				},
				rules: { 
                	code: [{required: true, message: '供应商编号必填' }, this._ruleLength(50)],
                	name: [{required: true, message: '供应商名称必填' }, this._ruleLength(50)],
                	tel: [{required: true, message: '电话必填' }, this._ruleMobile()]
                },
				uploadfile:{
                	id:'',
                	filePath:'',
					fileSize:'',
					fileName:'',
					fileType:''
                },
                uploadData: {
                    savePath: 'supplier'
                },
                uploadList: [],
                dataDic : {whether:''},
                quotationList: [],
                selectQuotation:[],
                measuremethodList:[],
                measureDisabled:false,
                uploadPathList:[]
			}
		},
		mounted() {
			var paramsTemp = this.$route.query;
			let idTemp = paramsTemp.id;
			if(idTemp) {
				let paramTemp = {
					pageNum: 1, 
					pageSize: 1,
					id : idTemp
				}
				this._ajax({name: 'supplier/list', param: paramTemp})
				.then((function(d){
					let params = d.aaData[0]
					Object.assign(this.form, params)
					if(params.picUrl) {
						let picUrl = params.picUrl
						let picUrlList = picUrl.split(',');
						let temp = [],temp1 = [];
						$.each(picUrlList, function() {
							temp.push({"name" : "资质图片", "url" : configs.imgURL + this});
							temp1.push(this);
						});
						this.uploadPathList = temp1;
						this.uploadList = temp;
					}
				}).bind(this))
			}
		},
		methods: {
			valideSubmit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "supplier/create";
                        let id = this.form.id;
                        if(id) {
                            method = "supplier/update";
                        }
//                      let telePhone = /^1[34578]\d{9}$/
//                      let mobilePhone = /^1[3|4|5|8][0-9]{9}$/
                        let telTemp = this.form.tel;
//                      if(!telePhone.test(telTemp)) {
//                      	this.$message({ type: 'warning', message: '联系电话不合法' });
//                      	return 
//                      }
                        o = {
								id : id,
								name : this.form.name,
								code : this.form.code,
								tel : this.form.tel, 
								companyName : this.form.companyName, 
								regId : this.form.regId, 
								address : this.form.address, 
								picUrl : this.uploadPathList.join(','), 
								remark : this.form.remark
                            }
                        let user = local.get('sessionUser');
                        if(!id) {
                            o.createdPersonId = user.userId;
							o.createdPersonName = user.nickName;
							o.customerId = user.typeCode;
                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		if(!id)
                        			this.form.id = d.aaData.id;
                        		this.$message({ type: 'success', message: '操作成功' });
                        		this.$router.push({
									path: '/supplierManager'
								});
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败：'+d.msg }); 
                        	}
                          //this.$emit('close')
                          
                        }).bind(this))
                    }
                })
			},
			cancel() {
				this.$router.push({name : 'supplierManager'});
			},
			uploadSuccess(response, file, fileList) {
//          	console.info(response);
            	if(response.state == 0) {
            		this.uploadfile.id = '';
            		this.uploadfile.filePath = response.aaData.path;
	            	this.uploadfile.fileSize = response.aaData.size;
	            	this.uploadfile.fileName = file.name;
	            	let fileTypeTemp = file.name.split('.');
	            	this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
	            	this.uploadPathList.push(response.aaData.path);
            	}
//          	console.info(this.uploadPathList);
            },
            uploadRemove(file, fileList) {
				//console.log('asdasdasd',file);
				//console.log('333333333',fileList);
				
            	 let removePath = file.url;//file.response.aaData.path
                 let fileListTemp = this.uploadPathList;
               	 var index = fileListTemp.indexOf(removePath);
               	 fileListTemp.splice(index, 1);
               	 this.uploadPathList = fileListTemp;
//              console.info(fileList);
//              console.info(this.uploadPathList);
            },
		}
	}
</script>
<style lang="sass">
    .page-channel{
        .row-block{
        	width: 100%;
            .el-form-item__content {
                width: calc(100% - 150px);
                &>div{
                    width: 100%;
                }
            }            
        }
    }
</style>
