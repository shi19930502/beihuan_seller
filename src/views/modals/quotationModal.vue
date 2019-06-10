<template>
	<div class="jibenxinxi">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!--基本信息-->
			<el-tab-pane label="基础信息" name="first" class="jichuXinXi" >
				<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules">
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	                        <el-form-item label="报价名称" prop="quotationTitle">
	                            <inputItem :autosize="true" :value.sync="form.quotationTitle" class="baojiadanB"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                	<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
		                    <el-form-item label="起配金额" prop="startAmount">
	                            <inputItem :autosize="true" :value.sync="form.startAmount" class="baojiadanB"></inputItem>
		                    </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="报价单描述" prop="quotationRemark">
	                            <inputItem :autosize="true" type="textarea" :value.sync="form.quotationRemark" class="baojiadanB"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row> 
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                    	<el-button @click="selectCustomer">客户选择</el-button>
	                        <el-form-item prop="customerName">
	                            <inputItem :autosize="true" :value.sync="form.customerName" class="baojiadanB"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="是否启用" prop="checked" >
	                              <el-checkbox :autosize="true" v-model="checked" @change="changeCheckBox" class="baojiadanB"></el-checkbox>
	                        </el-form-item>
	                    </el-col>
	                </el-row> 
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="备注" prop="comment">
	                            <inputItem :autosize="true" type="textarea" :value.sync="form.comment" class="baojiadanB"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>  
	            </el-form>
	            <div class="submitB">
			        <elBtn @click="Submit" type="primary">保存</elBtn>
			    </div>
			<!--客户选择弹框-->
			    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
				  	<el-table ref="multipleTable" :data="cusDatabox" tooltip-effect="dark" style="width:200px" @selection-change="handleSelectionChange">
					    <el-table-column type="selection" width="55"></el-table-column>
					    <el-table-column prop="customerName" label="姓名" width="120">
					    </el-table-column>
					</el-table>
					<span slot="footer" class="dialog-footer">
					    <el-button @click="dialogVisible = false">取 消</el-button>
					    <el-button type="primary" @click="handleDialog">确 定</el-button>
					  </span>
				</el-dialog>
			</el-tab-pane>
			<!--商品-->
			<el-tab-pane label="添加商品" name="third" tabdisabled="first">
				<elemTable :dataList="dataList1" :currentPage="pageNum" :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
				    <el-table-column prop="productName" label="商品名称">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.productName">
				    			<span>{{scope.row.productName}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				   <el-table-column prop="skuName" label="规格名称">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.skuName">
				    			<span>{{scope.row.skuName}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				    <el-table-column prop="meaName" label="基本计量单位">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.meaName">
				    			<span>{{scope.row.meaName}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				    <el-table-column prop="skuMeaName" label="规格计量单位">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.skuMeaName">
				    			<span>{{scope.row.skuMeaName}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				    <el-table-column prop="basePrice" label="基本单价">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.basePrice">
				    			<span>{{scope.row.basePrice}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				    <el-table-column prop="price" label="规格单价">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.price">
				    			<span>{{scope.row.price}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				</elemTable>
				<div class="submitB">
			        <elBtn @click="submitShipping" type="primary">提交</elBtn>
			    </div>
			</el-tab-pane>
			<!--zhanshi商品-->
			<el-tab-pane label="已添加商品" name="three">
				<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
				    <el-table-column prop="productName" label="商品名称">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.productName">
				    			<span>{{scope.row.productName}}</span>
				    		</toolTip>
				      	</template> 
				    </el-table-column>
				    <el-table-column prop="skuName" label="规格名称">
				    	<template slot-scope="scope">
				    		<toolTip :content="scope.row.skuName">
				    			<span>{{scope.row.skuName}}</span>
				    		</toolTip>
				      	</template>
				    </el-table-column>
				    <el-table-column label="操作" width="270">
				    	<template slot-scope="scope">
				    		<el-button-group>
				    			 <iconBtn content="删除" class="el-icon-delete"  @click="delRow(scope.row)" >删除</iconBtn>
				    		</el-button-group>
				    	</template>
				    </el-table-column>
				</elemTable>
			</el-tab-pane>

		</el-tabs>
   </div>
</template>

<script>
	var quotationIdTemp = '';
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		//components: {},
		data() {
//			金额验证
			var startAmountM = (rule, value, callback) => {
		        if(!this.form.startAmount){ 
					callback(new Error('请输入正确的金额！'));
		        }
		        callback();
		    };
			return {
				dialogVisible:false,
				dateRange:[],
				cusDatabox:[],
				form: {
		            quotationTitle:'',
		            startAmount:'',
		            quotationRemark:'',
		            comment:'',
					enabled:'',
					customerName:'',
					customerId:'',
               },

                rules: {
                	//报价基础信息
                	startAmount:[{required:true,validator:startAmountM,}, this._ruleTwoFloat()],
                	quotationTitle: [{required: true, message: '报价名称必填'}, this._ruleLength(100)],
                	products:[{required: true, message: '客户选择必填'}, this._ruleLength(100)],
                },
				dataList: [],
				products:[],
				dataList1: [],
				activeName:'first',
				tabDisabled : true,
				multipleSelection:[],
				multipleSelectionProduct:[],//
				checked:false,
				pageTotal:0
			}
		},
		mounted() {
			var params = this.$route.params;
			Object.assign(this.form, params);
			if(params.id) {
				this.tabDisabled = false;
			};
			this.getInitData();
			this.searchTable();
		},
		methods: {
			getInitData() {
				let user = local.get('sessionUser');
				this._ajax({url: this.rootAPI, name: 'customer/queryById', param: {
					id:user.typeCode,
				}})
	            .then((function(d) {
	            	console.log(d.aaData);
	            	Object.assign(this.form,d.aaData);
	            }).bind(this))
			},
			//是否启用
			changeCheckBox(value){
				if(value){
					this.form.enabled = 1;
				}else{
					this.form.enabled = 0;
				}
			},
			//触发接数据
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		        console.log(val);
		    },
		    //确定提交选择字段并拼成字符串
		    handleDialog(){
		    	this.dialogVisible = false
		    	let customerName = '';
		        let customerId = '';
		        this.multipleSelection.forEach(function(el){
		        	customerName = customerName + el.customerName+",";
		        	customerId = customerId + el.customerId+",";
		        });
		        this.form.customerName = customerName;
				this.form.buyerIds = customerId.substr(0,customerId.length-1);
				this.form.buyerNames = customerName.substr(0,customerName.length-1);
		    },
		    //客户选择触发弹框
			selectCustomer(value){
				this.dialogVisible = true;
				this._ajax({url: this.rootAPI, name: 'suppliercollection/queryBySellerId',
					param:{
						sellerid:local.get('sessionUser').typeCode
					}
				}).then((function(d) {
					this.cusDatabox = d.aaData;	
				}).bind(this))
			},
			searchTable() {
				 //获取基础信息
				this._ajax({url: this.rootAPI, name: 'quotation/queryQutationAndDetail', param: {
					id:this.$route.query.id,
					customerId:local.get('sessionUser').typeCode
				}}).then((function(d) {
					Object.assign(this.form,d.aaData[0]);
					this.checked = this.form.enabled == 1;
				}).bind(this));
				
			//商品添加
	        if(this.activeName == 'third') {
	        	//刷新列表
	        	let param = {
				  	quotationTitle:'',
		            startAmount:'',
		            quotationRemark:'',
		            comment:'',
					enabled:'',
					customerName:'',
					customerId:'',
	        	}
	        	let user = local.get('sessionUser');
				return this._ajax({url: this.rootAPI, name:'product/queryProductAndProductSkuList',
							param:{
								pageNum: this.pageNum,
								pageSize: this.pageSize,
								customerId:user.typeCode,
							}
						}).then((function(d) {
							let data = d.aaData;
							this.dataList1 = data;
							this.pageTotal = d.dataCount
						}).bind(this));
	        }
                //已添加商品		        
		        if(this.activeName == 'three') {
		        	//刷新列表
		        	let param = {
		        		pageNum: this.pageNum, 
					    pageSize: this.pageSize,
						mainId:this.$route.query.id,
		        	}
					return this._ajax({url: this.rootAPI, name: "quotationdetail/list", param: param, loading: 'dataLoading'}).then((function(d) {
					let data = d.aaData;
					this.dataList = data;
					this.pageTotal = d.dataCount
				}).bind(this));
		       }	       
			},
			Submit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "quotation/create";
                        let user = local.get('sessionUser')
                        let customerId = user.typeCode
                        if(this.form.id) {
                            method = "quotation/update";
                        }
                        o = {
                        	buyersName:this.form.buyerNames,
				            buyersId:this.form.buyerIds,
				            quotationTitle:this.form.quotationTitle,
				            startAmount:this.form.startAmount,
				            quotationRemark:this.form.quotationRemark,
				            comment:this.form.comment,
							enabled:this.form.enabled,
                            }
                        this._ajax({url: this.rootAPI + method, param: o})
                       .then((function(d) {
                        	if(d.state == 0) {
                        		if(!this.form.id) {
                        			this.form.id = d.aaData.id;
                        			this.form.customerId = d.aaData.customerId;
                        		}
                        		this.$message({ type: 'success', message: '操作成功' });
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败' }); 
                        	}
                            this.$emit('submit')
                        }).bind(this))
                    }
                })
			},
			//商品列表获取
		    selectionChange(val) {
		        this.multipleSelectionProduct = val;
		        console.log(val);
		    },
			//商品保存
			submitShipping() {
				//商品提交前字符串拼接
				let prodArr = this.multipleSelectionProduct.map(item => `${item.productId}##${item.productName}##${item.skuId}##${item.skuName}`);
		        this.products = prodArr.join('%%');
		        //提交
				let o = {}, method = "quotationdetail/baseCreate";
                 o = {
                	mainId:this.$route.query.id,
                    products:this.products,
                    }
                this._ajax({url: this.rootAPI + method, param: o})
	               .then((function(d) {
	                	if(d.state == 0) {
	                		this.$message({ type: 'success', message: '操作成功' });
	                	} else {
	                		this.$message({ type: 'failure', message: '操作失败' }); 
	                	}
	                    this.$emit('submit')
	                }).bind(this))
	               
			},
			//通过activeName名字取定位页面
			handleClick(tab, event) {
				let key = tab.name;
				this.searchTable(key);
				console.log(tab);
				console.log(event);
				this.activeName=="three";
		   },
		   //删除
		   delRow(row) {
				this.confirm('确定删除？', (function() {
        			var o = {
        				id: [row.id]
        			}
//      			o.enabled = 1
					this._ajax({url: this.rootAPI + 'quotationdetail/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
		}
	}
</script>

<style lang="sass">
	.jibenxinxi{
		padding: 20px;
		.jichuXinXi{
			margin: 0 auto;
		    text-align: center;
			.baojiadanB{
			  width:600px;
			  text-align:left;
	   		 }	
		}
	    .submitB{
			text-align:center;
		}
		
	}
	
	
	
</style>