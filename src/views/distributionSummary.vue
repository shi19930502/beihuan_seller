<template>
	<div class="page-khNolice">
		
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="预计配送日期">
						<dateEditorDaterange type="date" :showShortcuts="showShortcuts" :dateValue.sync="distributionTimeBegin"  :dateRange='dateRange' ></dateEditorDaterange>
					</searchInputItem>
				</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-plus" content="创建序列号" @click="createIndex">创建序列号</iconBtn>
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
			</span>
		</div>
		
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<!--<el-table-column type="index" width="150" label="序号"/>-->
			<el-table-column prop="extendIndex" label="分拣序号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.extendIndex">
						<span>{{scope.row.extendIndex}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="buyerName" label="买方名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<span>{{scope.row.buyerName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sellerName" label="卖方名称" >
				<template slot-scope="scope">
					<toolTip :content="scope.row.sellerName">
						<span>{{scope.row.sellerName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderTotal" label="需求总金额" >
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderTotal+ '元'">
						<span v-if="scope.row.orderTotal != null">{{scope.row.orderTotal+ '元'}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sortingOrderTotal" label="分拣总金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingOrderTotal+ '元'">
						<span v-if="scope.row.sortingOrderTotal != null">{{scope.row.sortingOrderTotal + '元'}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderCount" label="订单笔数">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderCount">
						<span>{{scope.row.orderCount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="itemCount" label="明细笔数">
				<template slot-scope="scope">
					<toolTip :content="scope.row.itemCount">
						<span>{{scope.row.itemCount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<iconBtn type="info" content="查看订单明细" @click="lookOver(scope.row)">查看订单明细</iconBtn>	  
				</template>
			</el-table-column>
		</elemTable>
		<distributionSummaryModal ref='distributionSummary' :tableRow='tableRow'></distributionSummaryModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import distributionSummaryModal from './modals/distributionSummaryModal.vue'
	export default {
		mixins: [mixin],
		components: {
			distributionSummaryModal
		},
		data() {
			return {
				searchForm: {
					distributionTimeBegin: ''
				},
				dataDic: {
					tradingAreaList: []
				},
				dataList: [],
				distributionSummaryModal:false,
				tableRow:{},
				showShortcuts:false,
				exportDataList:[],
				distributionTimeBegin:''
			}
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			createIndex() {
				if(this.distributionTimeBegin == null) {
					this.$message({
							type: 'warning',
							message: '请选择创建序号的时间'
						});
				}
				let user = local.get('sessionUser');
				console.log(this.searchForm.distributionTimeBegin)
				this._ajax({
					url: this.rootAPI,
					name: 'buyerindex/createByIndexBySellerId',
					param: {
						sellerId : user.typeCode || 0,
						disDate : this.distributionTimeBegin.replace("-","/").replace("-","/")
					},
					loading: 'dataLoading'
				}).then((function(d) {
					if(d.state == 0) {
							this.$message({
							type: 'success',
							message: '创建成功'
						});
					}
					this.searchTable();
					
				}).bind(this))
			},
			searchTable() {
				if(this.distributionTimeBegin == '') {
					this.distributionTimeBegin = this.getTomorrow
				}
				this.searchForm.distributionTimeBegin = this.distributionTimeBegin.replace("-","-").replace("-","-")
				let user = local.get('sessionUser');
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'order/queryOrderTotalBySellerIdAndStatusEqualsTwo',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			lookOver(row) {
				this.tableRow = row;
				this.$refs.distributionSummary.show(row);
			},
			exportExcel() {
				this.exportDataList = [],
				this.searchForm.pageNum = ''
				this.searchForm.pageSize = ''
				this._ajax({
					url: this.rootAPI,
					name: 'order/queryOrderTotalBySellerIdAndStatusEqualsTwo',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then((function(d) {
					let data = d.aaData;
					this.exportDataList = data;
					var fields = ['extendIndex','buyerName', 'sellerName', 'orderTotal', 'sortingOrderTotal','orderCount','itemCount', 'distributionTimeBegin'],
					filedsName = ['分拣序号','买方名称', "卖方名称", "需求总金额", "分拣总金额",'订单笔数','订单明细笔数', '配送时间'],
					fileName = '待配送订单信息汇总';
					this._exportExcel(this.exportDataList, fields, filedsName, fileName)
				}).bind(this))
					
				
			},
			reset() {
				this.searchForm.distributionTimeBegin = new Date()
				this.searchTable()
			}
		}
	}
</script>
<style lang="sass">
	.page-khNolice {
		.toubu_B {
			height: 45px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left;
				font-size: 22px;
			}
			.addanniu {
				float: right;
			}
		}
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>