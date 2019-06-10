<template>
	<div class="page-supplier">
		<el-card class="box-card baseCard">
			<div slot="header" class="clearfix">
				<span>供应商信息</span>
			</div>
			<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
				<el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                <el-form-item label="盘点单号" prop="inventoryNumber">
		                    <inputItem :autosize="true" :value.sync="form.inventoryNumber" :disabled="true"></inputItem>
		                </el-form-item>
		            </el-col>
		            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                <el-form-item label="盘点日期" prop="inventoryDate">
		                    <div class="block">
								<el-date-picker v-model="form.inventoryDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
							</div>
		                </el-form-item>
		            </el-col>
		        </el-row>
		        <el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                <el-form-item label="备注" prop="comment" class="row-block">
		                    <inputItem type="textarea" :value.sync="form.comment"></inputItem>
		                </el-form-item>
		            </el-col>
		        </el-row>
		   </el-form>
		       商品明细
		    <optionItems>
				<template slot="left">
					<el-button-group>
						<iconBtn iconClass="el-icon-plus" content="新增" @click="showProductDialog"></iconBtn>
					</el-button-group>
				</template>
			</optionItems>
		    <!-- 表格 -->
			<el-table :data="productTableData" style="width: 100%">
				<el-table-column prop="productName" label="商品名称">
			  	</el-table-column>
			  	<el-table-column prop="skuName" label="规格">
			  	</el-table-column>
			  	<!--<el-table-column prop="skuMeasure" label="单位">
					<template slot-scope="scope">
						<toolTip :content="renderCommon(measuremethodList, scope.row.skuMeasure)">
							<span>{{renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
						</toolTip>
					</template>
			  	</el-table-column>-->
			  	<el-table-column prop="stockQuantity" label="账面数">
			  		<template slot-scope="scope">
						<toolTip :content="scope.row.stockQuantity">
							<span>{{scope.row.stockQuantity/100}}</span>
						</toolTip>
					</template>
			  	</el-table-column>
			  	<el-table-column prop="inventoryStockTemp" label="实盘数">
			  		<template slot-scope="scope">
						  <!-- <el-input-number v-model="scope.row.inventoryStockTemp" :precision="2"></el-input-number> -->
			  			<inputItem :value.sync="scope.row.inventoryStockTemp" ></inputItem>
		  			</template>
			  	</el-table-column>
			  	<el-table-column prop="" label="差异">
			  		<template slot-scope="scope">
						  <span>{{_calc((scope.row.inventoryStockTemp == null ? 0 :scope.row.inventoryStockTemp),scope.row.stockQuantity/100,"subtract")}}</span>
						  <!-- <span>{{((scope.row.inventoryStockTemp == null ? 0 :scope.row.inventoryStockTemp)*10000-scope.row.stockQuantity*100)/10000}}</span> -->
			  			<!-- <span>{{_parseFloat(((scope.row.inventoryStockTemp == null ? 0 : scope.row.inventoryStockTemp) * 100 - scope.row.stockQuantity)/100, 2)}}</span> -->
		  			</template>
			  	</el-table-column>
			  	<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="putOutInventory(scope.row)" >删除</iconBtn>
					</template>
			  	</el-table-column>
			</el-table>
			<!--商品列表-->
			<el-dialog custom-class="jz-modal" title="商品列表" :visible="productModal" :before-close="productBeforeClose" :close-on-click-modal="false" :width="modalWidth">
				<searchInputItems>
					<searchInputItem name="关键字">
						<inputItem :value.sync="keyWord" placeHolder="请输入关键字"></inputItem>
					</searchInputItem>
				</searchInputItems>
				<!-- 操作按钮 -->
				<optionItems>
					<template slot="right">
						<el-button-group>
							<iconBtn iconClass="el-icon-search" content="查询" @click="refreashProductDialog" type="primary">查询</iconBtn>
							<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetProductDialog">重置</iconBtn>
						</el-button-group>
					</template>
				</optionItems>
				<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="productSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="name" label="商品名称">
						<template slot-scope="scope">
							<toolTip :content="scope.row.name">
								<span>{{scope.row.name}}</span>
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
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button-group>
								<iconBtn type="primary" content="加入盘点" @click="joininInventory(scope.row)" >加入盘点</iconBtn>
							</el-button-group>
						</template>
					</el-table-column>
				</elemTable>
				<div class="submitB">
			        <elBtn @click="batchAddProduct" type="primary">批量添加</elBtn>
			    </div>
			</el-dialog>
		    <div style="text-align: right">
                <elBtn @click="cancel" type="info">取消</elBtn>
                <iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check" >提交</iconBtn>
		        <iconBtn @click="valideSubmitcg" content="存草稿" type="primary" >存草稿</iconBtn>
		    </div>
		</el-card>
   </div>
</template>

<script>
	var productTableIds = [];
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				keyWord:'',
				form: {
					id : '',
					inventoryDate : '',
					comment : '',
					inventoryNumber : '',
					inventoryStatus : ''
				},
				rules: {
                	inventoryDate: [{required: true, message: '盘点日期必填' }],
                	inventoryStockTemp : [{required: true, message: '实盘数必填'}, this._ruleTwoFloat()],
                },
				productModal: false,
				productTableData: [],
				measuremethodList: [],
				multipleSelectionProduct:[]
			}
		},
		mounted() {
			var params = this.$route.query;
			let idTemp = params.id;
			if(idTemp) {
				let paramTemp = {
					pageNum: 1,
					pageSize: 1,
					id : idTemp
				};
				this._ajax({name: 'productstockinventory/list', param: paramTemp})
				.then((function(d) {
					Object.assign(this.form, d.aaData[0])
				}).bind(this));
				this.refreashJoinInProduct(idTemp);
			}
			productTableIds = [];
			/*this._ajax({url: this.rootAPI, name: 'measuremethod/list', param: {}})
			.then((function(d) {
				console.info(d)
				this.measuremethodList = d.aaData;
			}).bind(this))*/

		},
		methods: {
			cancel() {
				this.$emit('close')
				this.$router.push({name : 'inventoryManager'});
			},
			//  cancel() {
			// 	 alert(aaaaa);
            // 	this.$router.push({name : 'inventoryManager'});
            // },
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code) {
						dataShow = obj.name;
						return false;
					}
				});
				return dataShow;
			},
			searchTable() {
				this.refreashProductDialog();
			},
			valideSubmitcg() {
				this.valideSubmit('0');
			},
			valideSubmit(inventoryStatus) {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "productstockinventory/createRelate";
                        let id = this.form.id;
                     	console.log("sssssssssssssssssssssss",id);
                        if(id) {
                            method = "productstockinventory/updateRelate";
                        }
                        if(!inventoryStatus) {
                        	inventoryStatus = '1'
                        }
                        let flag = false;
                        let data = this.productTableData;
                        let dataTemp = [];
                        if(data.length == 0) {
                        	this.$message({ type: 'warning', message: '盘点必须选择商品' });
                        	return;
                        }
						let reg = /^\d+(\.\d{1,2})?$/;
						let sf=this;
                        $.each(data, function(i, obj) {
                     	console.info(reg.test(obj.inventoryStockTemp))
                        	if(!obj.inventoryStockTemp || !reg.test(obj.inventoryStockTemp)) {
                        		flag = true;
                        	} else {
                        		obj.inventoryStock = sf._calc(obj.inventoryStockTemp,100,"multiply");
                        		dataTemp.push(obj)
                        	}
                        });
                        if(flag) {
                        	this.$message({ type: 'warning', message: '盘点商品必填，且应为大于零的整数或两位小数' });
                        	return;
                        }
                        o = {
                                inventoryDate : this.form.inventoryDate,
                                inventoryStatus : inventoryStatus,
								comment : this.form.comment,
								id : id,
								inventorydetailList : JSON.stringify(dataTemp)
                            };
                        let user = local.get('sessionUser');
                        if(!id) {
                            o.createdPersonId = user.userId;
							o.createdPersonName = user.nickName;
							o.customerId = user.typeCode;
                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		if(!id) {
                        			this.form.id = d.aaData.id;
                        			this.form.inventoryNumber = d.aaData.inventoryNumber
								}
								this.$router.push({name : 'inventoryManager'});
                        		this.$message({ type: 'success', message: '操作成功' });
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败:'+d.msg });
                        	}

                        }).bind(this))
                    }
                })
			},
			 /*商品弹出框*/
		    showProductDialog() {
		    	this.productModal = true;
		    	this.refreashProductDialog();
		    },
			/*刷新已加入商品*/
		    refreashJoinInProduct(id) {
		    	let param = {
					mainId : id,
	        	};
				this._ajax({url: this.rootAPI, name: "inventorydetail/list", param: param})
	            .then((function(d){
	            	let data = d.aaData;
	            	if(data.length > 0) {
	            		$.each(data, function(i, obj) {
	            			obj.inventoryStockTemp = obj.inventoryStock/100;
	            			productTableIds.push(obj.skuId);
	            		});
	            	}
					this.productTableData = data
	            }).bind(this))
		    },
		     /*刷新商品弹出框列表*/
		    refreashProductDialog() {
		    	//刷新列表
		    	let userInfo = local.get('userinfo');
	        	var param = {
	        		pageNum: this.pageNum,
					pageSize: this.pageSize,
					customerId : userInfo.typeCode,
					published : 1,
					keyWord : this.keyWord,
					inventoryProductIdsString : productTableIds.join(",")
	        	};
				return this._ajax({url: this.rootAPI, name: "product/queryDtoList", param: param, loading: 'dataLoading'}).then(this.renderTable)
		    },
		    productBeforeClose() {
            	this.productModal = false;
            },

            joininInventory(row, isBatch) {
            	var index = productTableIds.indexOf(row.skuId);
            	let price = row.stockPrice;
            	console.info(row);
            	if(!price || price == 0) price = (parseFloat(row.basePrice) * 100);
            	console.info(price);
            	if(index < 0) {
	            	this.productTableData.push({
	            		productId : row.id,
	            		productName : row.name,
	            		skuId : row.skuId,
	            		skuName : row.skuName,
	            		skuMeasure : row.skuMeasure,
	            		stockQuantity : row.stockQuantity,
	            		stockPrice : price
	            	});
	            	productTableIds.push(row.skuId);
	            	if(!isBatch)
	            		this.refreashProductDialog();
            	} else {
            		this.$message({ type: 'failure', message: '该商品规格已加入盘点列表' });
            	}
            },
            putOutInventory(row) {
            	//删除ids
            	let skuId = row.skuId;
               	var index = productTableIds.indexOf(skuId);
               	productTableIds.splice(index, 1);
               	//删除表格数据
               	let tableData = this.productTableData;
               	let indexTemp;
               	$.each(tableData, function(i, obj) {
               		if(obj.skuId == skuId) {
               			indexTemp = i;
               		}
               	});
               	tableData.splice(indexTemp, 1);
               	this.productTableData = tableData;
//             	console.info(this.productTableData);
            },
            batchAddProduct() {
		    	let data = this.multipleSelectionProduct;
		    	let vm = this;
		    	$.each(data, function(i, row) {
	            	vm.joininInventory(row, true);
		    	});
		    	this.productModal = false;
//		    	this.refreashProductDialog();
		    },
		    productSelectionChange(val) {
		    	this.multipleSelectionProduct = val;
		    },
		    resetProductDialog() {
		    	this.keyWord = '';
		    	this.refreashProductDialog();
			},

		}
	}

</script>
<style lang="sass">
    .page-supplier{
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
    .baseCard{
    	margin-top : -20px;
    }
</style>
