<template>
	<div class="page-order-manage">
		<searchInputItems>
			<searchInputItem name="买方名称">
				<inputItem :value.sync="searchForm.buyerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="订单号">
				<inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
			</searchInputItem>
<!-- 			<searchInputItem name="订单状态">
				<selectInput :clearable='true' :value.sync="searchForm.orderStatusId" @selectChange="searchTable">
					<el-option
				      v-for="item in orderStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem> -->
			<searchInputItem name="物流状态">
				<selectInput :clearable='true' :value.sync="searchForm.shippingStatusId" @selectChange="searchTable">
					<el-option
				      v-for="item in shippingStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="付款状态">
				<selectInput :clearable='true' :value.sync="searchForm.paymentStatusId" @selectChange="searchTable">
					<el-option
				      v-for="item in paymentStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="支付类型">
				<selectInput :clearable='true' :value.sync="searchForm.payType" @selectChange="searchTable">
					<el-option
				      v-for="item in payTypeList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="配送日期">
				<dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="批量受理" type="warning" @click="batchUpdateOrderState('1')" v-if="useType === 'merchant'">批量受理</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="批量确认收货" type="success" @click="batchUpdateOrderState('4')" v-if="useType === 'buyer'">批量确认收货</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<div class="tab-box">
			<el-tabs v-model="tabActive" @tab-click="tabClick">
			    <el-tab-pane label="待受理" name="0"></el-tab-pane>
			    <el-tab-pane label="待分拣" name="1"></el-tab-pane>
			    <el-tab-pane label="待配送" name="2"></el-tab-pane>
			    <el-tab-pane label="配送中" name="3"></el-tab-pane>
			    <el-tab-pane label="已收货" name="4"></el-tab-pane>
			    <el-tab-pane label="已完成" name="5"></el-tab-pane>
			    <el-tab-pane label="已拒绝" name="6"></el-tab-pane>
			    <el-tab-pane label="已取消" name="7"></el-tab-pane>
			    <el-tab-pane label="全部" name="all"></el-tab-pane>
		  	</el-tabs>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
			<el-table-column label="商品信息" width="450" class-name="order-item-cell">
				<template slot-scope="scope">
		    		<orderProductColTmp :row="scope.row"></orderProductColTmp>		    		 	    		
		      	</template>
		    </el-table-column>
		    <el-table-column prop="buyerName" label="买方名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.buyerName">
		    			<span>{{scope.row.buyerName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sellerName" label="卖方名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.sellerName">
		    			<span>{{scope.row.sellerName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="配送地址" width="150">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.shippingAdd">
		    			<span>{{scope.row.shippingAdd}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="期望配送时间" width="160">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.distributionTime}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="orderStatusName" label="订单状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.orderStatusName">
		    			<span>{{scope.row.orderStatusName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="shippingStatusName" label="物流状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.shippingStatusName">
		    			<span>{{scope.row.shippingStatusName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="payStatusName" label="付款状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.payStatusName">
		    			<span>{{scope.row.payStatusName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="payWayStatusName" label="支付类型">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.payWayStatusName">
		    			<span>{{scope.row.payWayStatusName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>		    
		    <el-table-column label="操作" fixed="right" width="250">
		    	<template slot-scope="scope">
		    		<el-button-group>		    			
		    			<elBtn v-if="scope.row.orderStatusId == 0 && useType === 'buyer'" type="warning" @click="orderRefuse(scope.row, '7')">取消</elBtn>
		    			<elBtn v-if="scope.row.orderStatusId == 3 && useType === 'buyer'" type="success" @click="orderDetail(scope.row)">确认收货</elBtn>
		    			<elBtn @click="orderDetail(scope.row)" type="primary">订单详情</elBtn>
		    		</el-button-group>		    		
		      	</template>
		    </el-table-column>
		</elemTable>
		<orderItemsModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams" @submit="modalSubmit"></orderItemsModal>
		<distributorListModal v-if="distributorListModal" :modal="distributorListModal" @close="distributorListModalClose" @submit="distributorListModalSubmit" :params="distributorListModalParams" title="选择配货商"></distributorListModal>
		<orderRefuseModal v-if="orderRefuseModal" :modal="orderRefuseModal" @close="orderRefuseModalClose" @submit="orderRefuseModalSubmit" :params="orderRefuseModalParams"></orderRefuseModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import orderItemsModal from './modals/orderItemsModal.vue'
	import distributorListModal from './modals/distributorListModal.vue'
	import orderProductColTmp from './tmp/orderProductCol.vue'
	import orderRefuseModal from './modals/orderRefuseModal.vue'
	export default {
		mixins: [mixin],
		components: {orderItemsModal, distributorListModal, orderProductColTmp, orderRefuseModal},
		data() {
			return {
				searchForm: {
					buyerName: '',
					orderUmber: '',
					orderStatusId: '0',
					shippingStatusId: '',
					paymentStatusId: '',
					payType: '',
					distributionTimeBegin: '',
					distributionTimeEnd: '',
					checkType: 'buy'
				},
				orderStateList:[],
				shippingStateList: [],
				paymentStateList: [],
				payTypeList: [],
				dataList: [],
				dateRange: [],
				distributorListModal: false,
				distributorListModalParams: {},
				useType: '',
				tabActive: '0',
				orderRefuseModal: false,
				orderRefuseModalParams: {}
			}
		},
		beforeMount() {
			this.useType = this.$route.meta.useType
		},
		mounted() {
			this._searchDic('ORDER_STATUS')
			.then((function(d) {
				this.orderStateList = this._dicKey(d)
			}).bind(this))
			.then((function() {
				return this._searchDic('TRANSPORT_STATUS')
			}).bind(this))
			.then((function(d) {
				this.shippingStateList = this._dicKey(d)
			}).bind(this))
			.then((function() {
				return this._searchDic('PAY_STATUS')
			}).bind(this))
			.then((function(d) {
				this.paymentStateList = this._dicKey(d)
			}).bind(this))
			.then((function() {
				return this._searchDic('PAY_WAY')
			}).bind(this))
			.then((function(d) {
				this.payTypeList = this._dicKey(d)
			}).bind(this))
			.then(this.searchTable)
		},
		methods: {
			searchTable() {
				var dateRange = {
					distributionTimeBegin: '',
					distributionTimeEnd: ''
				}				
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						distributionTimeBegin: this.dateRange[0],
						distributionTimeEnd: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				})
				return this._ajax({name: 'order/listByUser', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
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
	                return el
	            })
			},
			reset() {
				Object.assign(this.searchForm, {
					buyerName: '',
					orderUmber: '',
					orderStatusId: '',
					shippingStatusId: '',
					paymentStatusId: '',
					payType: '',
					distributionTimeBegin: '',
					distributionTimeEnd: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			orderDetail(row) {
				this.modalEdit(row)
			},
			updateOrderState(row, state) {				
				if(state === '1') {
					var ids = [row.id]
					this._batchUpdateOrderState(ids, state)
					.then(this.searchTable) 
				}else {
					Object.assign(row, {
						orderStatusId: state
					})
					if(state === '3') {
						Object.assign(row, {
							shippingStatusId: '1'
						})
					}
					if(state === '4') {
						Object.assign(row, {
							shippingStatusId: '2'
						})
					}
					if(state === '5') {
						Object.assign(row, {
							paymentStatusId: '1'
						})
					}
					this._updateOrder(row).then(this.searchTable) 
				} 
			},
			batchUpdateOrderState(state) {
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.rowSelection
	        		var arr = []
					selection.forEach(function(el) {
						arr.push(el.id)
					})	
	        		this._batchUpdateOrderState(arr, state)	
	        			.then(this.searchTable)                       		
	        	}
			},
			selectable(row, index) {
				if(this.useType === 'merchant') {
					return row.orderStatusId == 0
				}else if(this.useType === 'buyer') {
					return row.orderStatusId == 3
				}				
			},
			selectDistributor(row) {
				Object.assign(this.distributorListModalParams, row)
				this.distributorListModal = true
			},
			distributorListModalClose() {
				this.distributorListModal = false
				Object.assign(this.distributorListModalParams, {})
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
			}
		}
	}
</script>