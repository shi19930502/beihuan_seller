<template>
	<el-dialog custom-class="jz-modal" :close-on-click-modal="false" width="1280px"  title="待配送订单明细" :visible.sync="modal" :before-close='beforeClose'>
		<div class="page-khNolice">

			<elemTable :dataList="dataList" @sizeChange='handleSizeChange' @currentChange='handleCurrentChange' :currentPage='pagNum' :pageSizes='pageSizes' :pageSize='pageSize' :pageTotal='pageTotal'>
				<el-table-column prop="orderUmber" label="订单号">
					<template slot-scope="scope">
						<toolTip :content="scope.row.orderUmber">
							<span>{{scope.row.orderUmber}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="orderStatusId" label="订单状态">
					<template slot-scope="scope">
						<span v-for="item in orderStateList">
				      <span v-if="scope.row.orderStatusId == item.key">{{item.value}}</span>
						</span>
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
				<el-table-column prop="paymentStatusId" label="付款状态">
					<template slot-scope="scope">
						<span v-for="item in payStateList">
				      <span v-if="scope.row.paymentStatusId == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="payType" label="支付类型">
					<template slot-scope="scope">
						<span v-for="item in payWayList">
				      <span v-if="scope.row.payType == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="shippingStatusId" label="物流状态">
					<template slot-scope="scope">
						<span v-for="item in LOGList">
				      <span v-if="scope.row.shippingStatusId == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="createdDate" label="下单时间">
					<template slot-scope="scope">
						<span>{{scope.row.createdDate}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button-group>
							<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
						</el-button-group>
					</template>
				</el-table-column>

			</elemTable>
			<distributionSummaryOrderItemModal :modal='distributionSummaryOrderItemModal' v-if='distributionSummaryOrderItemModal' @close='distributionSummaryOrderItemModalClose' :tableRow='table'></distributionSummaryOrderItemModal>
		</div>
	</el-dialog>
</template>
<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	import distributionSummaryOrderItemModal from './distributionSummaryOrderItemModal.vue'
	export default {
		mixins: [mixin],
		props: {
			/*modal: {
				default: false,
			},*/
			tableRow: {
				default: {},
			}
		},
		components: {
			distributionSummaryOrderItemModal
		},
		data() {
			return {
				modal: false,
				searchForm: {
					sellerId: local.get('sessionUser').typeCode, //如果是运营商 默认查询其所有子渠道
					buyerId: '',
					distributionTimeBegin:''
				},
				orderStateList: [], //订单状态
				LOGList: [], //物流状态
				payStateList: [], //付款状态 
				payWayList: [], //支付类型
				dataList: [],
				channelList: [], //渠道
				tempO: {}, //临时存放订单对象
				distributionSummaryOrderItemModal: false,
				orderId: '',
				paymentStatusId: null,
				selectClearable: true,
				form: {},
				table: {},
				returnTable:{}
			}
		},
		created() {
			this.searchForm = {};
			this.init();
		},
		mounted() {
			//this.returnTable = this.tableRow;
			//this.searchTable();
		},
		methods: {
			show(row) {
				this.form = row;
				this.modal = true;
				this.init(); 
				this.searchTable(row);
			},
			init() {
				var vm = this;
				this._ajax({
						url: this.rootAPI,
						name: 'datadic/list',
						loading: 'dataLoading'
					})
					.then((function(d) {
						d.aaData.map(function(el) {
							if(el.dataType == 'ORDER_STATUS') {
								vm.orderStateList.push(el);
							}
							if(el.dataType == 'TRANSPORT_STATUS') {
								vm.LOGList.push(el);
							}
							if(el.dataType == 'PAY_STATUS') {
								vm.payStateList.push(el);
							}
							if(el.dataType == 'PAY_WAY') {
								vm.payWayList.push(el);
							}
						})
					}).bind(this))

				return this._ajax({
						url: this.rootAPI,
						name: 'channel/list',
						param: {
							code: local.get('sessionUser').typeCode
						},
						loading: 'dataLoading'
					})
					.then((function(d) {
						d.aaData.map(function(el) {
							vm.channelList.push(el);
						})
					}).bind(this))
			},
			searchTable(row) {
				if(row == null){
					row = this.form;
				}else{
					this.orderStateList =[];
					this.payStateList =[];
					this.payWayList =[];
					this.LOGList =[];
				}
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					sellerId: row.sellerId,
					buyerId:  row.buyerId,
					distributionTimeBegin:row.distributionTimeBegin
				})
				//console.log(this.searchForm);
				var vm = this;
				this._ajax({
						url: this.rootAPI,
						name: 'order/queryOrderBySellerIdAndBuyerIdAndDistributionTimeBegin',
						param: vm.searchForm,
						loading: 'dataLoading'
					})
					.then(this.renderTable)
			},
			search() {
				this.searchTable()
			},
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			},
			cellClick() {

			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
			distributionSummaryOrderItemModalClose() {
				this.distributionSummaryOrderItemModal = false;
			},
			lookOver(row) {
				console.log(row)
				this.table = row 
				this.distributionSummaryOrderItemModal = true;
			},
			selectionChange(val) {},
		}
	}
</script>