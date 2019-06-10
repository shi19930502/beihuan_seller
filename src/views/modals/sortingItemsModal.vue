<template>
	<el-dialog custom-class="jz-modal order-item-modal" title="订单详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="75%">
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productPicUrl" label="商品图片">
                <template slot-scope="scope">
                    <imgItem :path="scope.row.skuPicUrl ? scope.row.skuPicUrl : scope.row.productPicUrl"></imgItem>
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称">
                <template slot-scope="scope">                    
                    <div>{{scope.row.productName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称">
                <template slot-scope="scope">
                    <div>{{scope.row.skuName}}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="baseMeasureName" label="基本单位">
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
            </el-table-column> -->            
            <el-table-column prop="oriPriceForDecimal" label="基本价格(元)" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <div class="flex-y-center">
                        <!-- <inputItem :value.sync="scope.row.oriPriceForDecimal" @blur="changeOriPrice(scope.row)" v-if="form.orderStatusId == '1' && useType === 'merchant'"></inputItem>
                        <div v-if="form.orderStatusId == '1' && useType === 'merchant'" style="width: 80px;">元/{{scope.row.baseMeasureName}}</div> -->
                        <div>{{scope.row.oriPriceForDecimal}}元/{{scope.row.baseMeasureName}}</div>
                    </div>                   
                </template>
            </el-table-column>            
            <el-table-column prop="priceForDecimal" label="规格价格(元)" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <div class="flex-y-center">
                        <!-- <inputItem :value.sync="scope.row.priceForDecimal" @blur="changePrice(scope.row)" v-if="form.orderStatusId == '1' && useType === 'merchant'"></inputItem>
                        <div v-if="form.orderStatusId == '1' && useType === 'merchant'" style="width: 80px;">元/{{scope.row.skuMeasureName}}</div> -->
                        <div>{{scope.row.priceForDecimal}}元/{{scope.row.skuMeasureName}}</div>
                    </div>                    
                </template>
            </el-table-column>
            <el-table-column prop="chargingModel" label="计价方式">
                <template slot-scope="scope">
                    <div>{{calChargingModel(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="需求量" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <div class="flex-y-center">
                        <inputItem :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)" v-if="form.orderStatusId == '0' && useType === 'merchant'"></inputItem>
                        <div v-if="form.orderStatusId == '0' && useType === 'merchant'" style="width: 50px;">{{scope.row.skuMeasureName}}</div>
                        <div v-else>{{scope.row.quantity}}{{scope.row.skuMeasureName}}</div>
                    </div>                    
                </template>
            </el-table-column>
            <el-table-column prop="itemTotal" label="需求金额(元)">
                <template slot-scope="scope">
                    <div>{{scope.row.itemTotal}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="sortingWeight" label="分拣量" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <div class="flex-y-center">
                        <inputItem :value.sync="scope.row.sortingWeight" @blur="changeSortingWeight(scope.row)"></inputItem>
                        <div style="width: 50px;">{{scope.row.measureName}}</div>
                    </div>                    
                </template>
            </el-table-column>
            <el-table-column prop="sortingTotal" label="分拣金额(元)">
                <template slot-scope="scope">
                    <div>{{scope.row.sortingTotal}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="inspectedWeight" label="验收量" :width="modalTableInputWidth">
                <template slot-scope="scope">
                    <div class="flex-y-center">
                        <inputItem :value.sync="scope.row.inspectedWeight" @blur="changeSortingWeight(scope.row)" v-if="form.orderStatusId == '3'"></inputItem>
                        <div v-if="form.orderStatusId == '3'" style="width: 50px;">{{scope.row.measureName}}</div>
                        <div v-else>{{scope.row.inspectedWeight}}{{scope.row.measureName}}</div>
                    </div>                    
                </template>
            </el-table-column>
            <el-table-column prop="inspectedTotal" label="验收金额(元)">
                <template slot-scope="scope">
                    <div>{{scope.row.inspectedTotal}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="batchId" label="批次号">
                <template slot-scope="scope">
                    <div>{{scope.row.batchId}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="suyuanCode" label="溯源码">
                <template slot-scope="scope">
                    <div>{{scope.row.suyuanCode}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注" width="250px">
                <template slot-scope="scope">
                    <div>{{scope.row.comment}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="form.orderStatusId == '0' && useType === 'merchant'">
                <template slot-scope="scope">
                    <elBtn @click="delItem(scope.row)" type="danger">删除</elBtn>
                </template>
            </el-table-column>
        </elemTable>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="printSuyuan">打印溯源码</elBtn>
            <elBtn @click="print">打印销货单</elBtn>                 
            <elBtn type="primary" @click="validSubmit('xinjian')">确认提交</elBtn>
            <elBtn @click="cancel">取消</elBtn>
        </div>
        <div id="printtemp"></div>
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
                reviewData: false
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
                            this.reviewData = true
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
                            var inspectedOrderTotal = 0
                            this.dataList.forEach((function(el) {
                                el.inspectedWeight = el.sortingWeight
                                if((el.measureTypePro == 1 && el.measureTypeSKU == 1 && el.chargingModel == 1) ||
                                   (el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                                   (el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 2)) {
                                    el.inspectedTotal =this. _parseFloat(el.priceForDecimal.mul(el.inspectedWeight), 2)
                                }else if(el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                    el.inspectedTotal = this._parseFloat(el.oriPriceForDecimal.mul(el.inspectedWeight), 2)
                                }             
                                inspectedOrderTotal = inspectedOrderTotal.add(el.inspectedTotal)                                
                                arr.push(el)
                            }).bind(this))
                            Object.assign(this.form, {
                                inspectedOrderTotal
                            })
                            this.dataList = arr
                        }else {
                            var arr = []
                            this.dataList.forEach((function(el) { 
                                if(el.inspectedTotal) {
                                    el.inspectedTotal = this._parseFloat(el.inspectedTotal.div(100), 2) 
                                }                                
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
                        } 
                        if(this.form.orderStatusId === '1') {
                            var arr = []
                            var sortingOrderTotal = 0
                            this.dataList.forEach((function(el) { 
                                if((el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                                   (el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                                   (el.measureTypePro == 1 && el.measureTypeSKU == 1 && el.chargingModel == 1)) {
                                    el.sortingWeight = el.quantity
                                    el.sortingTotal = this._parseFloat(el.priceForDecimal.mul(el.sortingWeight), 2)
                                }else if(el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                    el.sortingWeight = el.quantity.mul(el.skuQuantity)
                                    el.sortingTotal = this._parseFloat(el.oriPriceForDecimal.mul(el.sortingWeight), 2)
                                } 
                                sortingOrderTotal = sortingOrderTotal.add(el.sortingTotal)                             
                                arr.push(el)
                            }).bind(this))
                            Object.assign(this.form, {
                                sortingOrderTotal
                            })
                            this.dataList = arr
                        }else {
                            var arr = []
                            this.dataList.forEach((function(el) { 
                                if(el.sortingTotal) {
                                    el.sortingTotal = this._parseFloat(el.sortingTotal.div(100), 2) 
                                }                                
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
                        }
                        if(this.form.orderStatusId === '0') {
                            var arr = []
                            var orderTotal = 0
                            this.dataList.forEach((function(el) { 
                                el.itemTotal = this._parseFloat(el.priceForDecimal.mul(el.quantity), 2) 
                                orderTotal = orderTotal.add(el.itemTotal)                             
                                arr.push(el)
                            }).bind(this))
                            Object.assign(this.form, {
                                orderTotal
                            })
                            this.dataList = arr
                        }else {
                            var arr = []
                            this.dataList.forEach((function(el) { 
                                if(el.itemTotal) {
                                    el.itemTotal = this._parseFloat(el.itemTotal.div(100), 2)
                                }                                 
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
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
                if(!this.priceFloat.test(row.oriPriceForDecimal) || row.oriPriceForDecimal <= 0) {
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
                if(!this.priceFloat.test(row.priceForDecimal) || row.priceForDecimal <= 0) {
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
                if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    if(!this.regPosPattern.test(row.quantity) || row.quantity <= 0 || row.quantity > 9999999999) {
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
                    if(!this.weightFloat.test(row.quantity) || row.quantity <= 0 || row.quantity > 9999999999) {
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
                if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) ||
                   (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    row.sortingTotal = this._parseFloat(row.priceForDecimal.mul(row.sortingWeight), 2)
                    row.inspectedTotal =this._parseFloat(row.priceForDecimal.mul(row.inspectedWeight), 2)
                    row.itemTotal = this._parseFloat(row.priceForDecimal.mul(row.quantity), 2)
                }else if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    row.itemTotal = this._parseFloat(row.priceForDecimal.mul(row.quantity), 2)
                    row.sortingTotal = this._parseFloat(row.oriPriceForDecimal.mul(row.sortingWeight), 2)
                    row.inspectedTotal = this._parseFloat(row.oriPriceForDecimal.mul(row.inspectedWeight), 2)
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
                if(state === 'fenjian') {
                    this.confirm('快捷分拣将无法打印分拣小票，是否继续？', (function() {
                        var arr = []
                        this.dataList.forEach((function(el) {
                            var batchId = el.batchId
                            if(!batchId) {
                                arr.push(el.productName)
                            }
                        }).bind(this))
                        if(arr.length > 0) {
                            this.confirm(arr.join(',') + '未做进场，请先做进场' , (function() {
                                this._go('inMarketDetail')
                            }).bind(this))
                        }else {
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
                                this.submit()                                         
                            }else {
                                this.$message({type: 'warning', message: this.validConfirm.msg});
                            }
                        }                        
                    }).bind(this))
                }else {
                    Object.assign(this.validConfirm, {
                        flag: true,
                        msg: ''
                    })
                    this.dataList.forEach((function(el) {
                        this.changeSortingWeight(el)
                    }).bind(this))             
                    if(this.validConfirm.flag) {
                        this.submit()                                         
                    }else {
                        this.$message({type: 'warning', message: this.validConfirm.msg});
                    }
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
                                    this._updateDistributionOrder(o.id)
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
                if(this.dataList.length === 1) {
                    this._comfirm('删除所有商品，订单状态将为拒绝，确认删除?')
                        .then((function() {
                            return this._updateOrder({
                                orderStatusId: '6',
                                id: this.form.id,
                                cancelReason: '订单删除'
                            })
                        }).bind(this))
                        .then((function() {
                            this.$emit('submit')
                        }).bind(this))
                        .catch(this._confirmCancle)
                }else {
                    this._comfirm('确认删除?')
                    .then((function() {
                        return this._bathDeleteOrderItem([row.id], this.form.id)
                    }).bind(this))
                    .then(this.searchTable)
                    .then(this.updateForm)
                    .catch(this._confirmCancle)
                }
            },
            delItems() {
                if(this.rowSelection.length === 0) {
                    this.$message({type: 'info', message: '请选择行'});
                }else if(this.rowSelection.length === this.dataList.length) {
                    this._comfirm('删除所有商品，订单状态将为拒绝，确认删除?')
                        .then((function() {
                            return this._updateOrder({
                                orderStatusId: '6',
                                id: this.form.id,
                                cancelReason: '订单删除'
                            })
                        }).bind(this))
                        .then((function() {
                            this.$emit('submit')
                        }).bind(this))
                        .catch(this._confirmCancle)
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
                    let price = ''
                    if(el.price != null) {
                        price = el.price.div(100)
                    }
                    let quantity = el.quantity ? el.quantity + el.skuMeasureName : ''
                    let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                    let comment = el.comment ? el.comment : ''
                    let sortingTotalForDecimal = el.sortingTotalForDecimal || ''
                    let itemHTML = `
                        <tr>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${price}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${quantity}</td> 
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingWeight}</td>
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingTotalForDecimal}</td>    
                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${comment}</td>                  
                        </tr>
                    `
                  trs = trs + itemHTML
                }).bind(this))
                var address = this.form.distributionType == 1 ? this.form.shippingAdd : '自提'
                var distributionTime = ''
                if(this.form.distributionTimeBegin) {
                    if(this.form.distributionTimeBegin.split(":").length > 0) {
                        distributionTime = distributionTime + this.form.distributionTimeBegin.split(":")[0] + ":" + this.form.distributionTimeBegin.split(":")[1]
                    }else {
                        distributionTime = distributionTime + this.form.distributionTimeBegin
                    }                       
                }
                if(this.form.distributionTimeEnd) {
                    if(this.form.distributionTimeEnd.split(":").length > 0) {
                        distributionTime = distributionTime + "-" + this.form.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + this.form.distributionTimeEnd.split(" ")[1].split(":")[1]
                    }else {
                        distributionTime = distributionTime + "-" + this.form.distributionTimeEnd
                    }                       
                }
                var contacts = this.form.contacts || ''
                var orderTotal = this.form.orderTotal || ''
                var sortingOrderTotal = this.form.sortingOrderTotal || ''
                var sellerName = this.form.sellerName || ''
                var sellerTel = this.form.sellerTel || ''
                var customerIndex = this.form.customerIndex || ''
                printHtml = printHtml + `
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;">
                        <span>${sellerName}销货单</span>                                    
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
                        <span style="position: absolute;right: 0;">收货人电话: ${this.form.buyerTel}</span>                                    
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                        <span style="position: absolute;right: 0;">配送时间: ${distributionTime}</span>
                    </div>
                    <table style="text-align: center; border-collapse: collapse; width: 100%;">
                      <thead style="font-size:14px;">
                          <tr>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">单价(元)</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">下单量</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣合计(元)</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">客户备注</th>
                          </tr>
                      </thead>
                      ${trs}
                    </table>
                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                        <span>订单总额(元): ${orderTotal}</span>
                        <span>实配金额(元): ${sortingOrderTotal}</span>                                    
                    </div>
                    <div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
                        <span style="width: 30%;display: inline-block;">分拣员签字: </span>
                        <span style="width: 30%;display: inline-block;">配送员签字: </span>
                        <span style="width: 30%;display: inline-block;">验收人签字: </span>                                        
                    </div>
                `
                this.lodopoPrint('6%','5%','95%','100%',printHtml, this.dataList.length)
            },
            printSuyuan() {
                var customerIndex = this.form.customerIndex || ''
                var buyerName = this.form.buyerName || ''
                var extendIndex = this.form.extendIndex || ''
                if(extendIndex) {
                    extendIndex = `(${extendIndex})`
                }
                if(this.rowSelection.length > 0) {
                    this.back2Top()
                    this.SelectAsDefaultPrinter((function() {
                        this.rowSelection.forEach((function(el, index) {
                            let productName = el.productName || ''
                            let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                            let suyuanCode = el.suyuanCode || ''
                            let city = ''
                            if(configs.city === '银川') {
                                city = '银川公益市场重要产品追溯体系'
                            }
                            if(configs.city === '临沂') {
                                city = '临沂重要产品追溯体系'
                            }
                            if(configs.city === '农鲜汇') {
                                city = '银川公益市场重要产品追溯体系'
                            }
                            let date = this._moment({
                                format: 'YYYY-MM-DD HH:mm:ss'
                            })
                            var html = `
                                <div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">
                                    商家编号:
                                    <span style="font-weight: bolder;font-size: 15px;padding-left:30px;">${customerIndex}</span>
                                    <span style="font-weight: bolder;font-size: 15px;padding-left:10px;">${extendIndex}</span>
                                </div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">商家:${buyerName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">商品:${productName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:${sortingWeight}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣人员:</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">${date}</div>
                                <div style="text-align: center;font-size: 12px;height: 20px;line-height: 20px;">${city}</div>
                            `
                            this.Gprinter(html, configs.suyuanURL + suyuanCode)
                        }).bind(this))
                    }).bind(this))
                }                                
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