<template>
    <div class="orderReturnModal-modal">
        <el-dialog custom-class="jz-modal" width="70%"
                   :title="title"
                   :close-on-click-modal='false'
                   :visible="modal" :before-close='beforeClose'>
            <el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="退换货类型:" prop="refundsType" class="is-required">
                            <selectInput :value.sync="form.refundsType" @selectChange="selectRefundsType">
			                    <el-option v-for="item in dataDic.refundsTypeList" :key="item.key" :label="item.value" :value="item.key" >
			                    </el-option>
			                </selectInput>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    	<el-form-item label="退换货处理方式:" prop="optionType" class="is-required">
                            <selectInput :value.sync="form.optionType" @selectChange="selectRefundsOptionType">
			                    <el-option v-for="item in dataDic.refundsOptionTypeList" :key="item.key" :label="item.value" :value="item.key" >
			                    </el-option>
			                </selectInput>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="退换货订单">
                            <inputItem :value.sync='form.orderNumber' placeHolder='请选择需要退换货订单' :readonly='true'></inputItem>
                        </el-form-item>
                    </el-col>
                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="退换货种类">
                            <inputItem :value.sync='form.refundsCount' placeHolder='请选择需要退换货订单' :readonly='true'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="退换货金额">
                            <inputItem :value.sync='form.refundsTotle' placeHolder='请选择需要退换货订单' :readonly='true'></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
		                <el-form-item label="备注" prop="remark" class="row-block">
		                    <inputItem type="textarea" :value.sync="form.refundsComment"></inputItem>
		                </el-form-item>
		            </el-col>
                </el-row>
            </el-form>
            <el-tabs v-model="tabModal">
                <el-tab-pane label="退换货商品明细" name="first">
                    <searchInputItems>
                        <searchInputItem name="选择退换货订单">
                            <inputItem :append="true" :readonly="true" placeHolder="请选择退换货订单">
                                <elBtn iconClass="el-icon-search" slot="append" @click="selectOrderPro"></elBtn>
                            </inputItem>
                        </searchInputItem>
                    </searchInputItems>
                    <elemTable
                            :dataList="dataList"
                            @sizeChange='handleSizeChange'
                            @currentChange='handleCurrentChange'
                            :currentPage='pageNum'
                            :pageSizes='pageSizes'
                            :pageSize='pageSize'
                            type="text"
                            :pageTotal='pageTotal'
                            :tableBorder="tableBorder"
                            :showPagination="orderReturnModal === 'check' ? true : false" >
                            
                        <el-table-column show-overflow-tooltip property="productName" label="商品名称" min-width="80"></el-table-column>
                        <el-table-column show-overflow-tooltip property="skuName" label="规格名称" min-width="80"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="refundsQuantity" label="退换量" min-width="60" class="is-required">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.refundsQuantity" @blur="changeQuantity(scope.row)"></inputItem>
                                    ({{(scope.row.measureTypePro == 1 && scope.row.measureTypeSKU == 2 && scope.row.chargingModel == 1) ? scope.row.baseMeasureName : scope.row.skuMeasureName}})
                                </div>
                            </template>
                        </el-table-column>
						<el-table-column prop="refundsTotal" label="退换货类型">
							<template slot-scope="scope">
								<selectInput :value.sync="scope.row.refundsType" >
				                    <el-option v-for="item in dataDic.refundsTypeList" :key="item.key" :label="item.value" :value="item.key">
				                    </el-option>
				                </selectInput>
							</template>
						</el-table-column>
                        <el-table-column prop="refundsTotal" label="退换货处理方式">
							<template slot-scope="scope">
								<selectInput :value.sync="scope.row.optionType" >
				                    <el-option v-for="item in dataDic.refundsOptionTypeList" :key="item.key" :label="item.value" :value="item.key">
				                    </el-option>
				                </selectInput>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="refundsComment" label="退换说明" min-width="150" class="is-required">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.refundsComment" ></inputItem>
                                </div>
                            </template>
                        </el-table-column>
						<el-table-column prop="refundsTotal" label="退换货总价" min-width="60">
							<template slot-scope="scope">
								<span>{{scope.row.refundsTotal}}元</span>
							</template>
						</el-table-column>
                        <el-table-column label="操作" fixed="right" >
                            <template slot-scope="scope">
                                <elBtn type="danger" @click="deleteRow(scope.$index, scope.row)" v-if="extendModalType != 'view'">删除</elBtn>
                            </template>
                        </el-table-column>
                    </elemTable>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel">取消</elBtn>
                <elBtn type="primary" @click="submit" v-if="extendModalType != 'view'">保存草稿</elBtn>
            </div>
        </el-dialog>
        <selectOrderProModal v-if="selectOrderProModal" :modal="selectOrderProModal" :parentDataList="dataList"
                                @close="selectOrderProModalClose"
                                @submit="selectOrderProModalSubmit"></selectOrderProModal>
    </div>
</template>

<script>
    import mixin from '../../mixin/mixin.js' //公共方法，包括主要的ajax
    import local from '../../local.js'
    import configs from '../../configs.js'
    import selectOrderProModal from './selectOrderProModal.vue'

    export default {
        mixins: [mixin],
        components: {selectOrderProModal},
        props: {
            modal: {
                default: false,
            },
            orderReturnModal: {
                default: 'add'
            },
            extendModalType: {
                default: ""
            },
            tableRow: {
                default: function () {
                    return {}
                },
            },
            dataDic: {},
        },
        data() {
            return {
            	tabModal: 'first',
                selectOrderProModal : false, 
                form : {
                	refundsType : '',
                	optionType : '',
                	refundsTotle : 0,
                },
                refundsName : '',
        		optionName: '',
                validConfirm: {
	                flag: true,
	                msg: ''
	            },
	            title: '',
	            selectOrder:{},
	            rules: {
                    refundsType: [{required: true, message: '退换货类型必选'}],
                    optionType: [{required: true, message: '退换货方式必选'}],
                }
            };
        },
        mounted() {
            this.init();
            this.dataList = [];
        },
        methods: {
        	init() {
                let that=this;
        		if(this.orderReturnModal === 'add'&& this.extendModalType==''){
                    this.title = '新增退换货记录';
                }else if(this.orderReturnModal === 'edit' && this.extendModalType==''){
                    this.title = '编辑退换货记录';
                }else if(this.orderReturnModal === 'edit' && this.extendModalType=='view'){
                    this.title = '退换货记录详情';
                }
        		if(this.tableRow.id) {
                    //console.log('错误',this.tableRow);
                    Object.assign(this.form, this.tableRow)
                    that.refundsName=this.tableRow.refundsName;
                    that.optionName=this.tableRow.optionName;
//      			console.info(this.form)
        			this._ajax({
	                    url: this.rootAPI, name: 'refundsdetail/list',
	                    param: {
	                    	mainId : this.tableRow.id
	                    },
	                }).then((function(d) {
	                	if (d.state === 0) {
                            this.dataList = d.aaData;
//                          console.info(d.aaData)
                      	} else {
                      		this.$message({type: 'error', message: '操作失败：' + d.msg});
                      	}
	                }).bind(this))
        		}
        	},
            selectOrderPro() {
            	this.selectOrderProModal = true;
            },
            deleteRow($index, row) {
            	var arr = []
                this.dataList.forEach(function (item, index) {
                    if (index !== $index) {
                        arr.push(item)
                    }
                })
                this.dataList = arr
                this.orderSum()
            },
            cancel() {
				this.$emit('close')
			},
			beforeClose(done) {
				this.cancel()
				done()
			},
			selectRefundsType(val) {
				let vm = this;
				this.dataDic.refundsTypeList.forEach(function (item) {
                    if (item.key == val) {
                        vm.refundsName = item.value
                    }
                })
				this.dataList.forEach(function (item, index) {
                    item.refundsType = vm.form.refundsType
                })
			},
			selectRefundsOptionType(val) {
				let vm = this;
				this.dataDic.refundsOptionTypeList.forEach(function (item) {
                    if (item.key == val) {
                        vm.optionName = item.value
                    }
                })
				this.dataList.forEach(function (item, index) {
                    item.optionType = vm.form.optionType
                })
			},
			submit() {
				this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.validConfirm.flag = false;
                        this.validConfirm.msg = "请填写必填字段";
                    }else{
                        this.validConfirm.flag = true;
                    }
                })
				let details = this.dataList;
                if (details.length === 0) {
                    this.$message({type: 'warning', message: "至少选择一条退换货订单商品"});
                    return;
                }
                if (!this.validConfirm.flag) {
                    this.$message({type: 'warning', message: this.validConfirm.msg });
                    return;
                } else {
                	let refundsOrder ={};
                	Object.assign(refundsOrder, this.form, {
                		orderId : this.selectOrder.id,
                		buyerId : this.selectOrder.buyerId,
                		buyerName : this.selectOrder.buyerName,
                		refundsName : this.refundsName,
                		optionName : this.optionName,
                		customerId : local.get('sessionUser').typeCode,
                	});
                	let refundsDetailList = [];
                	this.dataList.forEach(function (item, index) {
                		let skuMrasurecodeTemp = ''
                		if(item.measureTypePro == 1 && item.measureTypeSKU == 2 && item.chargingModel == 1) {
                			skuMrasurecodeTemp = item.measureTypePro
                		} else {
                			skuMrasurecodeTemp = item.measureTypeSKU
                		}
	                    var refundsDetail = {}
	                    let orderitemId = item.orderitemId
	                    if(!orderitemId) orderitemId = item.id
	                    Object.assign(refundsDetail, item, {
	                		orderitemId : orderitemId,
	                		baseMrasurecode : item.measureTypePro,
	                		skuMrasurecode : skuMrasurecodeTemp,
	                	});
	                    refundsDetailList.push(refundsDetail)
	                })
                    Object.assign(refundsOrder, {
                		refundsDetailList : JSON.stringify(refundsDetailList)
                	});
                    this._ajax({
	                    url: this.rootAPI, name: 'refunds/createAndUpdateRefundsAndDetails',
	                    param: refundsOrder,
	                }).then((function(d) {
	                	if (d.state === 0) {
                            this.$message({type: 'success', message: '操作完成'});
                            this.cancel();
                      	} else {
                      		this.$message({type: 'error', message: '操作失败：' + d.msg});
                      	}
	                }).bind(this))
                }
			},
			selectOrderProModalClose() {
				this.selectOrderProModal = false;
			},
			selectOrderProModalSubmit(rows, order) {
				this.dataList = [];
				this.form.refundsCount = rows.length;
				this.form.orderNumber = order.orderUmber;
				this.selectOrder = order;
				rows.forEach((function (row) {
					var detail = {}
					Object.assign(detail, row, {
						refundsQuantity : 1,
						refundsPrice : 0,
						refundsTotal : 0,
						refundsType : this.form.refundsType,
						optionType : this.form.optionType,
					});
					console.info(detail)
					this.dataList.push(detail);
					this.changeQuantity(detail);
                }).bind(this));
                this.selectOrderProModalClose();
			},
            changeQuantity(row) {
                if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    if(!this.regPosPattern.test(row.refundsQuantity) || row.refundsQuantity <= 0 || row.refundsQuantity > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的整数'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '需求数量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }else if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) || 
                         (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1)) {
                    if(!this.weightFloat.test(row.refundsQuantity) || row.refundsQuantity <= 0 || row.refundsQuantity > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的数字,小数位数不超过三位'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '需求数量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }
            },
            orderSum(row) {
                console.log('asdadad',row);
            	if(row) {
            		if(row.refundsQuantity > row.sortingWeight) {
	            		this.$message({type: 'warning', message: '输入的商品：【'+row.skuName+'】退换货数量不能大于订单分拣量：' + row.sortingWeight});
	            		return;
	            	}
	                if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) ||
	                   (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
	                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
	                   	row.refundsPrice = row.priceForDecimal;
	                    row.refundsTotal = this._parseFloat(row.priceForDecimal.mul(row.refundsQuantity), 2)
	                } else if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
	                	row.refundsPrice = row.oriPriceForDecimal;
	                    row.refundsTotal = this._parseFloat(row.oriPriceForDecimal.mul(row.refundsQuantity), 2)
	                } else {
	                	row.refundsPrice = row.priceForDecimal;
	                    row.refundsTotal = this._parseFloat(row.priceForDecimal.mul(row.refundsQuantity), 2)
	                }
            	}
                var refundsTotle = 0
                this.dataList.forEach(function(el) {
                    refundsTotle = refundsTotle.add(el.refundsTotal)
                })
                Object.assign(this.form, {
                    refundsTotle
                })
            },
        },
    }
</script>
<style lang="sass">
    .orderReturnModal-modal{
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

