<template>
	<el-dialog custom-class="jz-modal order-item-modal" title="订单详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="75%">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                    <el-form-item label="订单号">
                        <inputItem :value.sync="form.orderUmber" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                    <el-form-item label="买方名称" v-if="useType === 'merchant'">
                        <inputItem :value.sync="form.buyerName" :disabled="true"></inputItem>
                    </el-form-item>
                    <el-form-item label="卖方名称" v-if="useType === 'buyer'">
                        <inputItem :value.sync="form.sellerName" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                    <el-form-item label="配送方式">
                        <inputItem :value.sync="form.distributionTypeName" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                    <el-form-item label="订单总额(元)">
                        <inputItem :value.sync="form.orderTotal" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                    <el-form-item label="分拣总额(元)">
                        <inputItem :value.sync="form.sortingOrderTotal" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <!--<el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                    <el-form-item label="验收总额(元)">
                        <inputItem :value.sync="form.inspectedOrderTotal" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>-->
            </el-row>  
            <!--<el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="配送地址">
                        <inputItem :value.sync="form.shippingAdd" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="备注" class="row-block">
                        <inputItem :value.sync="form.comment" :disabled="true" type="textarea"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row v-if="form.orderStatusId == 8">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="订单评价" class="row-block">
                        <inputItem :value.sync="review.reviewContent" :disabled="true" type="textarea"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="评价时间">
                        <inputItem :value.sync="review.reviewDate" :disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" v-for="item in reviewList">
                    <el-form-item :label="item.reviewName">
                        <rateItem :max="5" :disabled="true" :value.sync="item.score"></rateItem>
                    </el-form-item>
                </el-col>
            </el-row> 
            <el-row v-if="form.orderStatusId == '6'">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="拒绝原因" class="row-block">
                        <inputItem :value.sync="form.cancelReason" :disabled="true" type="textarea"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.orderStatusId == '7'">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="取消原因" class="row-block">
                        <inputItem :value.sync="form.cancelReason" :disabled="true" type="textarea"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>                  
        </el-form>
        <!--<el-steps :active="stepIndex" finish-status="success" v-if="form.orderStatusId !== '7' && form.orderStatusId !== '6'">
          <el-step :title="item.curStatusName" v-for="item in stepList" :description="item.optionDate"></el-step>
        </el-steps>-->
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
            <el-table-column type="selection" width="55" v-if="form.orderStatusId == '0' && useType === 'merchant'"></el-table-column>
            <el-table-column prop="productName" label="商品名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.productName">
                        <div>{{scope.row.productName}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.skuName">
                        <div>{{scope.row.skuName}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="baseMeasureName" label="基本单位">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.baseMeasureName">
                        <div>{{scope.row.baseMeasureName}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="skuMeasureName" label="规格单位">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.skuMeasureName">
                        <div>{{scope.row.skuMeasureName}}</div>
                    </toolTip>
                </template>
            </el-table-column>            
            <el-table-column prop="oriPrice" label="基本价格(元)" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <inputItem :value.sync="scope.row.oriPrice" @blur="changeOriPrice(scope.row)" v-if="form.orderStatusId == '1' && useType === 'merchant'"></inputItem>
                    <toolTip :content="scope.row.oriPrice" v-else>
                        <div>{{scope.row.oriPrice}}</div>
                    </toolTip>
                </template>
            </el-table-column>            
            <el-table-column prop="price" label="规格价格(元)" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <inputItem :value.sync="scope.row.price" @blur="changePrice(scope.row)" v-if="form.orderStatusId == '1' && useType === 'merchant'"></inputItem>
                    <toolTip :content="scope.row.price" v-else>
                        <div>{{scope.row.price}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="chargingModel" label="计价方式">
                <template slot-scope="scope">
                    <div>{{calChargingModel(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="需求量" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <inputItem :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)" v-if="form.orderStatusId == '0' && useType === 'merchant'"></inputItem>
                    <toolTip :content="scope.row.quantity" v-else>
                        <div>{{scope.row.quantity}}({{scope.row.skuMeasureName}})</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="itemTotal" label="需求金额(元)">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.itemTotal">
                        <div>{{scope.row.itemTotal}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="sortingWeight" label="分拣量" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <inputItem :value.sync="scope.row.sortingWeight" @blur="changeSortingWeight(scope.row)" v-if="form.orderStatusId == '1' && useType === 'merchant'"></inputItem>
                    <toolTip :content="scope.row.sortingWeight" v-else>
                        <div>{{scope.row.sortingWeight}}({{scope.row.measureName}})</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="sortingTotal" label="分拣金额(元)">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.sortingTotal">
                        <div>{{scope.row.sortingTotal}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <!--<el-table-column prop="inspectedWeight" label="验收量" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <inputItem :value.sync="scope.row.inspectedWeight" @blur="changeSortingWeight(scope.row)" v-if="form.orderStatusId == '3'"></inputItem>
                    <toolTip :content="scope.row.inspectedWeight" v-else>
                        <div>{{scope.row.inspectedWeight}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="inspectedTotal" label="验收金额(元)">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.inspectedTotal">
                        <div>{{scope.row.inspectedTotal}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="batchId" label="批次号">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.batchId">
                        <div>{{scope.row.batchId}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="suyuanCode" label="溯源码">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.suyuanCode">
                        <div>{{scope.row.suyuanCode}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.comment">
                        <div>{{scope.row.comment}}</div>
                    </toolTip>
                </template>
            </el-table-column>-->
            <el-table-column label="操作" v-if="form.orderStatusId == '0' && useType === 'merchant'">
                <template slot-scope="scope">
                    <elBtn @click="delItem(scope.row)" type="danger">删除</elBtn>
                </template>
            </el-table-column>
        </elemTable>
        <div slot="footer" class="dialog-footer flex-x-end">
        	<elBtn @click="print" >打印备货单</elBtn>
            <!--<elBtn @click="print" v-if="form.orderStatusId !== '3' && form.orderStatusId !== '4' && form.orderStatusId !== '5' && form.orderStatusId !== '6' && form.orderStatusId !== '7' && useType === 'merchant'">打印备货单</elBtn>            
            <elBtn type="danger" v-if="form.orderStatusId == '0' && useType === 'merchant'" @click="delItems">批量删除</elBtn>
            <elBtn type="primary" v-if="form.orderStatusId == '0' && useType === 'merchant'" @click="validSubmit('xinjian')">确认提交</elBtn>
            <elBtn type="success" v-if="form.orderStatusId == '1' && useType === 'merchant'" @click="validSubmit('fenjian')">确认分拣</elBtn>
            <elBtn type="primary" v-if="form.orderStatusId == '1' && useType === 'merchant'" @click="validSubmit('gaijia')">确认改价</elBtn>
            <elBtn type="primary" v-if="form.orderStatusId == '3'" @click="validSubmit('shouhuo')">确认收货</elBtn>
            <elBtn @click="cancel" v-if="useType === 'merchant'">取消</elBtn>-->
        </div>
    </el-dialog>
</template>
<script>
import mixin from '../../mixin/mixin.js'
import configs from '../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                stepList: [
                    {curStatusName: '新建', state: '0', optionDate: ''},
                    {curStatusName: '受理', state: '1', optionDate: ''},
                    {curStatusName: '分拣', state: '2', optionDate: ''},
                    {curStatusName: '发货', state: '3', optionDate: ''},
                    {curStatusName: '收货', state: '4', optionDate: ''},
                    {curStatusName: '完成', state: '5', optionDate: ''},
                    {curStatusName: '已评价', state: '8', optionDate: ''},
                ],
                stepIndex: 1,
                dataList: [],
                form: {
                    orderTotal: null,
                    sortingOrderTotal: null,
                    inspectedOrderTotal: null,
                    comment: '',
                    orderStatusId: '',
                    cancelReason: ''
                },
                review: {
                    reviewContent: '',
                    reviewPersonName: ''
                },
                reviewList: [],
                validConfirm: {
                    flag: true,
                    msg: ''
                },
                useType: this.$route.meta.useType,
                buyer: {},
			}
		},
		props: {
			modal: {
				default: false
			},
            params: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {
            Object.assign(this.form, this.params) 
            var buyerId = this.form.buyerId
            this._customerById(buyerId)
            .then((function(d) {
                if(d.aaData.length > 0) {
                    this.buyer = d.aaData[0]
                }                    
            }).bind(this))
            Object.assign(this.form, {
                orderTotal: this._priceFormat(this.form.orderTotal),
                sortingOrderTotal: this._priceFormat(this.form.sortingOrderTotal),
                inspectedOrderTotal: this._priceFormat(this.form.inspectedOrderTotal)
            })
            this.searchTable()
            if(this.form.orderStatusId == 8) {
                this._ajax({name: 'orderitemreview/queryReviewAndScore', param: {orderId: this.form.id}})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            Object.assign(this.review, d.aaData[0])
                            d.aaData[1].forEach((function(el) {
                                el.score = el.score/20
                            }).bind(this))
                            this.reviewList = d.aaData[1]
                        }                        
                    }).bind(this))
            }            
		},
		methods: {
            searchTable() {
                this._ajax({name: 'orderitem/list', param: {orderId: this.form.id}, loading: 'modalDataLoading'})
                    .then(this.renderTable)
                    .then((function() {   
                        if(this.form.orderStatusId === '3') {
                            var arr = []
                            this.dataList.forEach(function(el) {
                                el.inspectedWeight = el.sortingWeight
                                arr.push(el)
                            })
                            this.dataList = arr
                            this.dataList.forEach((function(el) {
                                this.orderSum(el)
                            }).bind(this))
                        } 
                        if(this.form.orderStatusId === '1') {
                            var arr = []
                            this.dataList.forEach(function(el) {
                                el.sortingWeight = el.quantity
                                arr.push(el)
                            })
                            this.dataList = arr

                            this.dataList.forEach((function(el) {
                                this.orderSum(el)
                            }).bind(this))
                        }                     
                    }).bind(this))
                this._ajax({name: 'orderstatuschange/list', param: {orderNumber: this.form.orderUmber}})
                    .then((function(d) { 
                        var arr = d.aaData                      
                        if(arr.length > 0) {
                            var o = arr[0]
                            this.stepIndex = parseInt(o.curStatusId) + 1
                            arr.forEach((function(el) {
                                this.stepList.forEach((function(em) {
                                    if(el.curStatusId === em.state) {
                                        Object.assign(em, {
                                            optionDate: el.optionDate
                                        })
                                    }
                                }).bind(this))
                            }).bind(this))
                        }                     
                    }).bind(this))
            },
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },  
            changeOriPrice(row) {
                if(!this.priceFloat.test(row.oriPrice) || row.oriPrice <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '价格输入不合法'
                    })
                }else {
                    this.orderSum(row)
                }
            },          
            changePrice(row) {
                if(!this.priceFloat.test(row.price) || row.price <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '价格输入不合法'
                    })
                }else {
                    this.orderSum(row)
                }
            },
            changeSortingWeight(row) {
                if(!this.weightFloat.test(row.sortingWeight) || row.sortingWeight <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过三位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '分拣重量输入不合法'
                    })
                }else {
                    this.orderSum(row)
                }
            },
            changeQuantity(row) {
                if(!this.regPosPattern.test(row.quantity) || row.quantity <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的整数'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '需求数量输入不合法'
                    })
                }else {
                    this.orderSum(row)
                }
            },
            orderSum(row) {
                if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) ||
                   (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    row.sortingTotal = this._parseFloat(row.price.mul(row.sortingWeight), 2)
                    row.inspectedTotal =this. _parseFloat(row.price.mul(row.inspectedWeight), 2)
                    row.itemTotal = this._parseFloat(row.price.mul(row.quantity), 2)
                }else if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    row.itemTotal = this._parseFloat(row.price.mul(row.quantity), 2)
                    row.sortingTotal = this._parseFloat(row.oriPrice.mul(row.sortingWeight), 2)
                    row.inspectedTotal = this._parseFloat(row.oriPrice.mul(row.inspectedWeight), 2)
                }
                var orderTotal = 0, sortingOrderTotal = 0, inspectedOrderTotal = 0
                this.dataList.forEach(function(el) {
                    orderTotal = orderTotal.add(el.itemTotal)
                    sortingOrderTotal = sortingOrderTotal.add(el.sortingTotal)
                    inspectedOrderTotal = inspectedOrderTotal.add(el.inspectedTotal)
                })
                Object.assign(this.form, {
                    orderTotal,
                    sortingOrderTotal,
                    inspectedOrderTotal
                })
            },
            validSubmit(state) {
                Object.assign(this.validConfirm, {
                    flag: true,
                    msg: ''
                })
                this.dataList.forEach((function(el) {
                    if(this.form.orderStatusId == '1' && this.useType === 'merchant') {
                        this.changeSortingWeight(el)                      
                    }
                    if(this.form.orderStatusId == '0' && this.useType === 'merchant') {
                        this.changeQuantity(el)
                    }
                    if(this.form.orderStatusId == '3') {
                        this.changeSortingWeight(el)
                    }
                }).bind(this))
                if(this.validConfirm.flag) {
                    this.dataList.forEach((function(el) {
                        if(this.form.orderStatusId == '1' && this.useType === 'merchant') {
                            this.changeOriPrice(el)                      
                        }
                    }).bind(this))
                }
                if(this.validConfirm.flag) {
                    this.dataList.forEach((function(el) {
                        if(this.form.orderStatusId == '1' && this.useType === 'merchant') {
                            this.changePrice(el)                      
                        }
                    }).bind(this))
                }                
                if(this.validConfirm.flag) {
                    if(state === 'fenjian') {
                        Object.assign(this.form, {orderStatusId: '2'})
                    } 
                    if(state === 'shouhuo') {
                        Object.assign(this.form, {orderStatusId: '4', shippingStatusId: '2'})
                    }
                    this.submit()                                         
                }else {
                    this.$message({type: 'warning', message: this.validConfirm.msg});
                }
            },
            submit() {
                this._batchUpdateOrderItem(this.dataList)
                    .then((function(d) {
                        if(d.state === 0) {
                            var o = {}
                            Object.assign(o, this.form)
                            Object.assign(o, {
                                orderTotal: this.form.orderTotal.mul(100),
                                sortingOrderTotal: this.form.sortingOrderTotal.mul(100),
                                inspectedOrderTotal: this.form.inspectedOrderTotal.mul(100),
                            })
                            this._updateOrder(o)
                            .then((function(d) {
                                if(d.state === 0) {
                                    this.$emit('submit')
                                    this.$message({type: 'success', message: '操作完成'})
                                }else {
                                    this.$message({type: 'warning', message: d.msg})
                                }                        
                            }).bind(this))
                        }else {
                            this.$message({type: 'warning', message: d.msg})
                        }
                    }).bind(this))                
            },
            delItem(row) {
                this._comfirm('确认删除?')
                    .then((function() {
                        return this._bathDeleteOrderItem([row.id], this.form.id)
                    }).bind(this))
                    .then(this.searchTable)
                    .then(this.updateForm)
                    .catch(this._confirmCancle)
            },
            delItems() {
                if(this.rowSelection.length === 0) {
                    this.$message({type: 'info', message: '请选择行'});
                }else {
                    var arr = []
                    this.rowSelection.forEach(function(el) {
                        arr.push(el.id)
                    })  
                    this._comfirm('确认删除?')
                        .then((function() {
                            return this._bathDeleteOrderItem(arr, this.form.id)
                        }).bind(this))
                        .then(this.searchTable)
                        .then(this.updateForm)
                        .catch(this._confirmCancle)                             
                }
            },
            updateForm() {
                return this._ajax({name: 'order/listByUser', param: {
                            id: this.form.id
                        }})
                        .then((function(d) {
                            if(d.state === 0) {
                                Object.assign(this.form, d.aaData[0])
                                Object.assign(this.form, {
                                    orderTotal: this._priceFormat(this.form.orderTotal),
                                    sortingOrderTotal: this._priceFormat(this.form.sortingOrderTotal),
                                    inspectedOrderTotal: this._priceFormat(this.form.inspectedOrderTotal)
                                })
                            }
                        }).bind(this))
            },
            print() {
                var trs = ''
                var printHtml = ''
                this.dataList.forEach((function(el, index) {
                    let _index = index + 1
                    let skuName = el.skuName
                    let productName = el.productName
                    let skuCode = el.skuCode
                    let price = el.price
                    let quantity = el.quantity ? el.quantity + el.skuMeasureName : ''
                    let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                    let comment = el.comment ? el.comment : ''
                    let itemHTML = `
                        <tr>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${price}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${quantity}</td> 
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingWeight}</td>    
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${comment}</td>                  
                        </tr>
                    `
                  trs = trs + itemHTML
                }).bind(this))
                var address = this.form.distributionType == 1 ? this.form.shippingAdd : '自提'
                var distributionTimeBegin = this.form.distributionTimeBegin || ''
                var distributionTimeEnd = this.form.distributionTimeEnd || ''
                var contacts = this.form.contacts || ''
                var orderTotal = this.form.orderTotal || ''
                var sortingOrderTotal = this.form.sortingOrderTotal || ''
                var sellerTel = this.form.sellerTel || ''
                var customerIndex = this.form.customerIndex || ''
                printHtml = printHtml + `
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;">
                        <span>销货单</span>                                    
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span> 
                        <span style="position: absolute;right: 0;">订单号: ${this.form.orderUmber}</span>                                         
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">购货单位: ${this.form.buyerName}</span>
                        <span style="position: absolute;right: 0;">分拣编码: ${customerIndex}</span>                                                 
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">收货人: ${contacts}</span>
                        <span style="position: absolute;right: 0;">电话号码: ${typeof(this.buyer.tel) == 'undefined' ? '' : this.buyer.tel}</span>                                    
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                        <span style="position: absolute;right: 0;">配送时间: ${distributionTimeBegin} - ${distributionTimeEnd}</span>
                    </div>
                    <table style="text-align: center; border-collapse: collapse; width: 100%;">
                      <thead style="font-size:14px;">
                          <tr>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">需求单价(元)</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">下单量</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">客户备注</th>
                          </tr>
                      </thead>
                      ${trs}
                    </table>
                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                        <span>订单总额(元): ${orderTotal}</span>
                        <span>配送总额(元): ${sortingOrderTotal}</span>                                    
                    </div>
                    <div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
                        <span style="width: 30%;display: inline-block;">分拣员签字: </span>
                        <span style="width: 30%;display: inline-block;">配送员签字: </span>
                        <span style="width: 30%;display: inline-block;">验收人签字: </span>                                        
                    </div>
                `
                this.lodopoPrint('6%','5%','95%','100%',printHtml, this.dataList.length)
            },
            handleDataList(d) {
                return d.aaData.map((function(el) {
                    el.oriPrice = this._priceFormat(el.oriPrice)
                    el.price = this._priceFormat(el.price)
                    el.itemTotal = this._priceFormat(el.itemTotal)
                    el.sortingTotal = this._priceFormat(el.sortingTotal)
                    el.inspectedTotal = this._priceFormat(el.inspectedTotal)
                    return el
                }).bind(this))
            },
            calChargingModel(row) {
                if(this.measureType(row)) {
                    row.measureName = row.skuMeasureName
                }else if(!this.measureType(row)) {
                    row.measureName = row.baseMeasureName
                }
                if(row.chargingModel == 1) {
                    return '计重'
                }else if(row.chargingModel == 2) {
                    return '计件'
                }
            },
            measureType(row) {
                if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1)) {
                    return 1
                }else if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    return 0
                }
            }
		}
	}
</script>
<style lang="sass">
    .order-item-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 100px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
</style>