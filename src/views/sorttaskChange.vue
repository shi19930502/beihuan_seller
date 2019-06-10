<template>
	<div class="page-order-manage">
		<searchInputItems>
			<searchInputItem name="采购商">
				<inputItem :value.sync="searchForm.buyerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="订单号">
				<inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="下单时间">
				<dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<elBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</elBtn>
					<elBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</elBtn>
					<elBtn iconClass="el-icon-refresh" content="批量打印备货单" @click="batchPrint">批量打印备货单</elBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- <div class="tab-box">
			<el-tabs v-model="tabActive" @tab-click="tabClick">
			    <el-tab-pane label="待配送" name="2"></el-tab-pane>
			    <el-tab-pane label="配送中" name="3"></el-tab-pane>
			    <el-tab-pane label="已收货" name="4"></el-tab-pane>
			    <el-tab-pane label="全部" name="sortTaskIds"></el-tab-pane>
		  	</el-tabs>+
		</div> -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="orderUmber" label="订单号">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.orderUmber}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="buyerName" label="采购商">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.buyerName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sellerName" label="供应商">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.sellerName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="orderTotal" label="需求总额(元)">
		    	<template slot-scope="scope">
		    		<span>{{_priceFormat(scope.row.orderTotal)}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sortingOrderTotal" label="分拣总额(元)">
		    	<template slot-scope="scope">
		    		<span>{{_priceFormat(scope.row.sortingOrderTotal)}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="orderStatusName" label="订单状态">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.orderStatusName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdDate" label="下单时间">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.createdDate}}</span>
		      	</template>
		    </el-table-column>	    
		    <el-table-column label="操作" fixed="right" width="150">
		    	<template slot-scope="scope">
		    		<el-button-group>		    			
		    			<elBtn @click="orderDetail(scope.row)" type="primary">编辑</elBtn>
		    		</el-button-group>		    		
		      	</template>
		    </el-table-column>
		</elemTable>
		<sortingItemsModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams" @submit="modalSubmit"></sortingItemsModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import local from '../local.js'
	import orderItemsModal from './modals/orderItemsModal.vue'
	import sortingItemsModal from './modals/sortingItemsModal.vue'
	export default {
		mixins: [mixin],
		components: {sortingItemsModal, orderItemsModal},
		data() {
			return {
				searchForm: {
					buyerName: '',
					orderUmber: '',
					orderStatusId: '2',
					shippingStatusId: '',
					paymentStatusId: '',
					payType: '',
					distributionTimeBegin: '',
					distributionTimeEnd: ''
				},
				shippingStateList: [],
				paymentStateList: [],
				payTypeList: [],
				dataList: [],
				dateRange: [],
				distributorListModal: false,
				distributorListModalParams: {},
				useType: '',
				tabActive: '2',
				orderRefuseModal: false,
				orderRefuseModalParams: {},
				orderCreateModal: false,
				loading: false
			}
		},
		beforeMount() {
			this.useType = this.$route.meta.useType
		},
		mounted() {
			if(typeof this.$route.params.tabActive === 'string') {
				this.tabActive = this.$route.params.tabActive
			}
			Object.assign(this.searchForm, {
				orderStatusId: this.tabActive
			})
			this._searchDic('TRANSPORT_STATUS')
			.then((function(d) {
				this.shippingStateList = this._dicKey(d)
			}).bind(this))
			this._searchDic('PAY_STATUS')
			.then((function(d) {
				this.paymentStateList = this._dicKey(d)
			}).bind(this))
			this._searchDic('PAY_WAY')
			.then((function(d) {
				this.payTypeList = this._dicKey(d)
			}).bind(this))
			this.searchTable()

			
		},
		methods: {
			searchTable() {				
				var dateRange = {
					startTime: '',
					endTime: ''
				}				
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				})
				return this._ajax({name: 'order/listByUser', param: this.searchForm, loading: 'dataLoading'})
						   .then(this.renderTable)



			},
			handleDataList(d) {
				return d.aaData.map(function(el) {
					var str = ""
	            	if(el.distributionTimeBegin) {
	            		if(el.distributionTimeBegin.split(":").length > 0) {
	            			str = str + el.distributionTimeBegin.split(":")[0] + ":" + el.distributionTimeBegin.split(":")[1]
	            		}else {
	            			str = str + el.distributionTimeBegin
	            		}	            		
	            	}
	            	if(el.distributionTimeEnd) {
	            		if(el.distributionTimeEnd.split(":").length > 0) {
	            			str = str + "-" + el.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + el.distributionTimeEnd.split(" ")[1].split(":")[1]
	            		}else {
	            			str = str + "-" + el.distributionTimeEnd
	            		}	            		
	            	}
	            	el.distributionTime = str
	            	el.rowShow = true
	                return el
	            })
			},
			reset() {
				Object.assign(this.searchForm, {
					buyerName: '',
					orderUmber: '',
					shippingStatusId: '',
					paymentStatusId: '',
					payType: '',
					distributionTimeBegin: '',
					distributionTimeEnd: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			orderSort(row) {
				if(row.orderStatusId == 1) {
					var itemList = row.orderitemList
					var arr = []
					if(Array.isArray(itemList)) {
						itemList.forEach((function(el) {
							var batchId = el.batchId
							if(!batchId) {
								arr.push(el.productName)
							}
						}).bind(this))						
					}
					if(arr.length > 0) {
						this.confirm(arr.join(',') + '未做进场，请先做进场' , (function() {
							this._go('inMarketDetail')
						}).bind(this))
					}else {
						this.orderDetail(row)
					}
				}else {
					this.orderDetail(row)
				}
			},
			orderDetail(row) {
				this.modalEdit(row)				
			},
			updateOrderState(row, state) {
				row.rowShow = false
				var o = {}
				Object.assign(o, row)
				Object.assign(o, {
					orderStatusId: state
				})		
				if(state === '1') {
					var ids = [o.id]
					this._batchUpdateOrderState(ids, state)
					.then(this.searchTable) 
				}else {
					if(state === '3' && row.distributionType == 1) {
						var sessionUser = local.get('sessionUser')
						var customerId = sessionUser.typeCode
						this._customerById(customerId)
						.then((function(d) {
							if(d.aaData.length > 0) {
								var customer = d.aaData[0]
								if(customer.isDistribution == 1) {
									Object.assign(o, {
				                        distribute: 1,
				                        distributorId: customer.id,
				                        orderStatusId: '2'
				                    })
				                    this._updateOrder(o)
										// .then((function(d) {
										// 	if(d && d.state === 0) {
										// 		this.$message({type: 'success', message: '操作完成'})
										// 	}											
										// }).bind(this))
										.then(this.searchTable)
								}else {
									Object.assign(o, {
										shippingStatusId: '1'
									})
									this._updateOrder(o)
										// .then((function(d) {
										// 	if(d && d.state === 0) {
										// 		this.$message({type: 'success', message: '操作完成'})
										// 	}
										// }).bind(this))
										.then(this.searchTable)
								}
							}
						}).bind(this))	
					}else if(state === '3') {
						Object.assign(o, {
							shippingStatusId: '1'
						})
						this._updateOrder(o)
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
							.then(this.searchTable)
					}
					if(state === '4') {
						Object.assign(o, {
							shippingStatusId: '2'
						})
						this._updateOrder(o)
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
							.then(this.searchTable)
					}
					if(state === '5') {
						Object.assign(o, {
							paymentStatusId: '1'
						})
						this._updateOrder(o)
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
							.then(this.searchTable)
					}
					if(state === '8') {
						Object.assign(o, {
							paymentStatusId: '1'
						})
						this._updateOrder(o)
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
							.then(this.searchTable)
					}					
					 
				} 
			},
			batchUpdateOrderState(state) {
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.rowSelection
	        		var arr = [], arr1 = [], arr2 = []
					selection.forEach(function(el) {
						if(el.distribute == null && el.distributorId == null) {
							if(el.distributionType == 1) {
								arr1.push(el.id)
							}else {
								arr2.push(el.id)
							}							
						}
						arr.push(el.id)						
					})
					if(state === '1' || state === '4') {
						this._batchUpdateOrderState(arr, state)	
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
	        				.then(this.searchTable) 
					}else if(state === '3'){
						var sessionUser = local.get('sessionUser')
						var customerId = sessionUser.typeCode
						this._customerById(customerId)
						.then((function(d) {
							if(d.aaData.length > 0) {
								var customer = d.aaData[0]
								if(customer.isDistribution == 1) {
									var o = {
										distribute: 1,
				                        distributorId: customer.id,
									}
									if(arr1.length > 0) {
										this._batchUpdateOrderStates(arr1, o)
											.then((function(d) {
												if(arr2.length > 0) {
													var p = {
														shippingStatusId: '1',
								                        orderStatusId: state
													}
													return this._batchUpdateOrderStates(arr2, p)
												}
											}).bind(this))
											// .then((function(d) {
											// 	if(d && d.state === 0) {
											// 		this.$message({type: 'success', message: '操作完成'})
											// 	}
											// }).bind(this))
											.then(this.searchTable)
										}else {
											if(arr2.length > 0) {
												var p = {
													shippingStatusId: '1',
							                        orderStatusId: state
												}
												this._batchUpdateOrderStates(arr2, p)
													// .then((function(d) {
													// 	if(d && d.state === 0) {
													// 		this.$message({type: 'success', message: '操作完成'})
													// 	}
													// }).bind(this))
													.then(this.searchTable)
											}
										}
									
								}else {
									var o = {
										shippingStatusId: '1',
				                        orderStatusId: state
									}
									var arr3 = arr1.concat(arr2)
									if(arr3.length > 0) {
										this._batchUpdateOrderStates(arr3, o)
											// .then((function(d) {
											// 	if(d.state === 0) {
											// 		this.$message({type: 'success', message: '操作完成'})
											// 	}
											// }).bind(this))
											.then(this.searchTable)
									}									
								}
							}
						}).bind(this))
					}	        		                      		
	        	}
			},
			selectable(row, index) {
				if(this.useType === 'merchant') {
					return row.orderStatusId == 0 || row.orderStatusId == 2
				}else if(this.useType === 'buyer') {
					return row.orderStatusId == 3
				}				
			},
			selectDistributor(row) {
				if(row.orderStatusId == 2) {
					var itemList = row.orderitemList
					var arr = []
					if(Array.isArray(itemList)) {
						itemList.forEach((function(el) {
							var batchId = el.batchId
							if(!batchId) {
								arr.push(el.productName)
							}
						}).bind(this))						
					}
					if(arr.length > 0) {
						this.confirm(arr.join(',') + '未做进场，请先做进场' , (function() {
							this._go('inMarketDetail')
						}).bind(this))
					}else {
						Object.assign(this.distributorListModalParams, row)
						this.distributorListModal = true
					}
				}else {
					Object.assign(this.distributorListModalParams, row)
					this.distributorListModal = true
				}				
			},
			deliverOrder(row) {
				if(row.orderStatusId == 2) {
					var itemList = row.orderitemList
					var arr = []
					if(Array.isArray(itemList)) {						
						itemList.forEach((function(el) {
							var batchId = el.batchId
							if(!batchId) {
								arr.push(el.productName)
							}
						}).bind(this))						
					}
					if(arr.length > 0) {
						this.confirm(arr.join(',') + '未做进场，请先做进场' , (function() {
							this._go('inMarketDetail')
						}).bind(this))
					}else {
						this.updateOrderState(row, '3')
					}
				}else {
					this.updateOrderState(row, '3')
				}
			},
			distributorListModalClose() {
				this.distributorListModal = false
				this.distributorListModalParams = {}
			},
			distributorListModalSubmit() {
				this.distributorListModalClose()
				this.searchTable()
			},
			tabClick(tab, event) {
				var val = this.tabActive === 'all' ? '' : this.tabActive
				Object.assign(this.searchForm, {
					orderStatusId: val
				})
				if(val == 2) {
					Object.assign(this.searchForm, {
						orderField: 'fenjiantime'
					})
				}else {
					Object.assign(this.searchForm, {
						orderField: ''
					})
				}
				this.searchTable()
			},
			orderRefuse(row, state) {
				Object.assign(this.orderRefuseModalParams, row, {
					state: state
				})
				this.orderRefuseModal = true
			},
			orderRefuseModalClose() {
				this.orderRefuseModal = false
				this.orderRefuseModalParams = {}
			},
			orderRefuseModalSubmit() {
				this.orderRefuseModalClose()
				this.searchTable()
			},
			create() {
				this.orderCreateModal = true
			},
			orderCreateModalClose() {
				this.orderCreateModal = false
			},
			orderCreateModalSubmit() {
				this.orderCreateModalClose()
				this.searchTable()
			},
			batchPrint() {				
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {       		
               	 	this.rowSelection.forEach((function(el) {
               	 		var itemList = el.orderitemList
               	 		var printHtml = ''
               	 		var trs = ''
               	 		itemList.forEach((function(em, index) {
               	 			let _index = index + 1
		                    let skuName = em.skuName
		                    let productName = em.productName
		                    let skuCode = em.skuCode
		                    let price = ''
		                    if(em.price != null) {
		                    	price = em.price.div(100)
		                    }
		                    let quantity = em.quantity ? em.quantity + em.skuMeasureName : ''
		                    if(this.measureType(em)) {
			                    em.measureName = em.skuMeasureName
			                }else if(!this.measureType(em)) {
			                    em.measureName = em.baseMeasureName
			                }
		                    let sortingWeight = em.sortingWeight ? em.sortingWeight + em.measureName : ''
		                    let comment = em.comment ? em.comment : ''
		                    let sortingTotalForDecimal = em.sortingTotalForDecimal || ''
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
               	 		var address = el.distributionType == 1 ? el.shippingAdd : '自提'
		                var distributionTime = ''
		                if(el.distributionTimeBegin) {
		            		if(el.distributionTimeBegin.split(":").length > 0) {
		            			distributionTime = distributionTime + el.distributionTimeBegin.split(":")[0] + ":" + el.distributionTimeBegin.split(":")[1]
		            		}else {
		            			distributionTime = distributionTime + el.distributionTimeBegin
		            		}	            		
		            	}
		            	if(el.distributionTimeEnd) {
		            		if(el.distributionTimeEnd.split(":").length > 0) {
		            			distributionTime = distributionTime + "-" + el.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + el.distributionTimeEnd.split(" ")[1].split(":")[1]
		            		}else {
		            			distributionTime = distributionTime + "-" + el.distributionTimeEnd
		            		}	            		
		            	}
		                var contacts = el.contacts || ''
		                var orderTotal = ''
		                if(el.orderTotal != null) {
		                	orderTotal = el.orderTotal.div(100)
		                }
		                var sortingOrderTotal = ''
		                if(el.sortingOrderTotal != null) {
		                	sortingOrderTotal = el.sortingOrderTotal.div(100)
		                }
		                var sellerName = el.sellerName || ''
		                var buyerName = el.buyerName || ''
		                var orderUmber = el.orderUmber || ''
		                var buyerTel = el.buyerTel || ''
		                var sellerTel = el.sellerTel || ''
		                var customerIndex = el.customerIndex || ''
		                var marketTitle = this.$store.state.marketTitle || ''
		                printHtml = printHtml + `
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;">
		                        <span>${marketTitle}(${sellerName})备货单</span>                                    
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span> 
		                        <span style="position: absolute;right: 0;">订单号: ${orderUmber}</span>                                     
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">购货单位: ${buyerName}</span>
		                        <span style="position: absolute;right: 0;">分件编码: ${customerIndex}</span>                                    
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">收货人: ${contacts}</span>
		                        <span style="position: absolute;right: 0;">收货人电话: ${buyerTel}</span>                                    
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
		                    <div style="page-break-after: always;"></div>
		                `	
		                this.lodopoPrint('6%','5%','95%','100%',printHtml, itemList.length)	                
               	 	}).bind(this))
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
            },
            invoke(row) {
				this.confirm('确定撤销配送？', (function() {
					var o = {
						id: [row.id]
					}
					this._ajax({
							url: this.rootAPI + 'order/invoke',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '拒绝成功'
								});
							}else if(d.state == 2){
								this.$message({
									type: 'warning',
									message: d.msg
								});
							}
							
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
				this.searchTable();
			},
		}
	}
</script>