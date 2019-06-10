<template>
	<el-dialog custom-class="jz-modal" title="查看详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
			<el-table-column prop="sellerName" label="供应商">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sellerName">
						<div>{{scope.row.sellerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderUmber" label="订单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>
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
			<!--        <el-table-column prop="measurementUnit" label="单位">
				<template slot-scope="scope">
					<toolTip :content="scope.row.measurementUnit">
						<div>{{scope.row.measurementUnit}}</div>
					</toolTip>
				</template>
			</el-table-column>
             <el-table-column prop="price" label="单价">
				<template slot-scope="scope">
					<toolTip :content="scope.row.methodType ? scope.row.oriPrice : scope.row.price">
						<div>{{scope.row.methodType ? scope.row.oriPrice : scope.row.price}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="quantity" label="需求重量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.quantity">
						<div>{{scope.row.quantity}}&nbsp;{{scope.row.measurementUnit}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="itemTotal" label="需求金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.itemTotal">
						<div>{{scope.row.itemTotal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column> -->
			<el-table-column prop="sortWeight" label="配送量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortWeight">
						<div>{{scope.row.sortWeight}}&nbsp;{{scope.row.measurementUnit}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sortitemTotal" label="商品金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortitemTotal">
						<div>{{scope.row.sortitemTotal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="batchId" label="批次号">
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
			</el-table-column> -->
		</elemTable>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel">关闭</elBtn>
		</div>
	</el-dialog>
</template>
<script>
	import local from "../../local.js";
	import mixin from "../../mixin/mixin.js";
	import configs from "../../configs.js";
	export default {
		mixins: [mixin],
		data() {
			return {
				dataList: []
			};
		},
		props: {
			modal: {
				default: false
			},
			tableRow: {
				default: function() {
					return {};
				}
			}
		},
		mounted() {
			console.log('对象', this.tableRow);
			this.searchTable(this.tableRow);
		},
		methods: {
			cancel() {
				this.$emit("close");
			},
			searchTable(o) {
				var ob = {
					buyerId: o.buyerId,
					distributorId:o.distributorId,
					distributionTimeBegin:o.distributionTimeBegin
				};
				/*var pa = {
					orderId: this.tableRow.id
				};*/
				var vm = this;
				this._ajax({
					url: this.distributeAPI + "deliveryOrder/getDeliveryOrderTotal",
					name: "",
					param: ob
				}).then(function(d) {
					vm.dataList = d.aaData.orderDetils;
					vm.pageTotal = vm.dataList.length;
				})
			},
			beforeClose(done) {
				this.cancel();
			}
		}
	};
</script>