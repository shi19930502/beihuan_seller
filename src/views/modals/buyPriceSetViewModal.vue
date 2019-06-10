<template>
	<el-dialog custom-class="jz-modal"  width="1280px" title="订单及明细查询" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" v-if="modal" :model="form" :inline="true" label-width="160px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="订单号:">
						<inputItem :value.sync="searchForm.orderNumber" placeHolder="订单号"></inputItem>
					</el-form-item>
				</el-col>
				<span style="float: right;">
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				</span>
			</el-row>
		</el-form>

		<elemTable :dataList="dataList" @sizeChange='handleSizeChange' @currentChange='handleCurrentChange' :currentPage='pagNum' :pageSizes='pageSizes' :pageSize='pageSize' :pageTotal='pageTotal'>
			<el-table-column type="expand">
		      <template slot-scope="props">
		        <el-form label-position="left" inline class="demo-table-expand">
		          <el-form-item label="销售单价">
		            <span>{{ props.row.priceForDecimal }}元</span>
		          </el-form-item>
		          <el-form-item label="需求重量">
		            <span>{{ props.row.quantity }}{{props.row.skuMeasureName}}</span>
		          </el-form-item>
		          <el-form-item label="需求总价">
		            <span>{{ props.row.itemTotalForDecimal }}元</span>
		          </el-form-item>
		        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column prop="orderUmber" label="订单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="buyerName" label="买方" min-width="60px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<div>{{scope.row.buyerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="distributionTimeBegin" label="配送时间" min-width="60px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributionTimeBegin">
						<div>{{scope.row.distributionTimeBegin}}~{{scope.row.distributionTimeEnd}}</div>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
	</el-dialog>
</template>

<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js' //公共方法，包括主要的ajax
	export default {
		mixins: [mixin],
		props: {
			modal: {
				default: false,
			},
			tableRow: {
				default: function() {
					return {}
				},
			}
		},
		data() {
			return {
				form:{
					
				},
				searchForm : {
					orderNumber : ''
				},
				user : local.get('sessionUser'),
				dataList: [{
					priceForDecimal : 0,
					quantity : 0,
					itemTotalForDecimal : 0
				}],
				formDisabled: true,
				dateValue: [],
				show: false,
				unitName:''
			}
		},
		mounted() {
			this.form = this.tableRow;
			this.getInit();
			this.searchTable();
		},
		methods: {
			getInit() {
				
			},
			searchTable() {
				this.dataList = [];
				var vm = this;
				this._ajax({
					url: this.tootAPI,
					name: 'buy/OrderAndItemsDispatchNextDayBySkuId',
					param: {
						pageNum : vm.pageNum,
						pageSize: vm.pageSize,
						typeCode:  vm.user.typeCode,
						distributionTimeBegin : vm.form.distributionTimeBegin,
						skuId : vm.form.skuId,
						orderNumber : vm.searchForm.orderNumber,
					}
				}).then(this.renderTable)
				.then((function(){
//					console.info(vm.dataList)
					$.each(vm.dataList, function(i, obj) {
						obj.priceForDecimal = obj.orderitemList[0].priceForDecimal;
						obj.quantity = obj.orderitemList[0].quantity;
						obj.itemTotalForDecimal = obj.orderitemList[0].itemTotalForDecimal;
						obj.skuMeasureName = obj.orderitemList[0].skuMeasureName;
						/*Object.assign(obj, {
							priceForDecimal : obj.orderitemList[0].priceForDecimal,
							quantity : obj.orderitemList[0].quantity,
							itemTotalForDecimal : obj.orderitemList[0].itemTotalForDecimal,
						})*/
					});
				}).bind(this))
			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
		},
	}
</script>
<style lang="sass">
	.grade-see-view-modal {
		.row-block {
			.el-form-item__content {
				width: calc(100%);
				&>div {
					width: 100%;
				}
			}
		}
	}
	.demo-table-expand .el-form-item {
	    margin-right: 0;
	    margin-bottom: 0;
	    width: 30%;
	}
</style>