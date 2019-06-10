<template>
	<div class="sale_analysis">

		<div class="toubu_A">
			<span class="tliel_name">
				 <searchInputItems>
            <searchInputItem name="日期范围">
                <dateEditorDaterange :dateValue.sync="dateValue"  :dateRange='dateRange'></dateEditorDaterange>
            </searchInputItem>
            <searchInputItem name="买家名称">
                <selectInput :value.sync="searchForm.buyerId" >
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in buyerList" :key="item.buyerId" :label="item.buyerName" :value="item.buyerId">
                    </el-option>
                </selectInput>
            </searchInputItem>
            <searchInputItem name="商品名称">
                <selectInput :value.sync="searchForm.productId" :filterable="filterable" >
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </selectInput>
            </searchInputItem>
        </searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success">导出</iconBtn>
			</span>
		</div>

		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="proName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.proName">
						<span>{{scope.row.proName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="proSkuName" label="规格关键字">
				<template slot-scope="scope">
					<toolTip :content="scope.row.proSkuName">
						<span>{{scope.row.proSkuName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="basicMeasure" label="基本计量单位">
				<template slot-scope="scope">
					<toolTip :content="scope.row.basicMeasure">
						<span>{{scope.row.basicMeasure}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="skuMeasure" label="规格计量单位">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuMeasure">
						<span>{{scope.row.skuMeasure}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="saleTotal" label="销售量">
				<template slot-scope="scope">
					<!--<toolTip :content="scope.row.saleTotal">-->
					<span>{{getSaleTotal(scope.row)}}</span>
					<!--</toolTip>-->
				</template>
			</el-table-column>
			<el-table-column prop="paidAmount" label="已付金额(元)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.paidAmount">
						<span>{{scope.row.paidAmount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="outstandingAmount" label="未付金额(元)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.outstandingAmount">
						<span>{{scope.row.outstandingAmount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sortingTotal" label="合计金额(元)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingTotal">
						<span>{{scope.row.sortingTotal}}</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>

<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin'
	import { mapState } from 'vuex'
	export default {
		mixins: [mixin],
		data() {
			return {
				dataList: [],
				dateValue: [],
				searchForm: {
					buyerId: '',
					productId: ''
				},
				buyerList: [],
				buyerId: '',
				filterable: true,
				productList: []
			}
		},
		computed: {
			...mapState([
				'today',
				'beforeDay_7',
				'beforeDay_30',
			])
		},
		mounted() {

			//默认时间范围(一周)
			// console.log(vm.productList)
			this.dateValue = [this.beforeDay_7, this.today]
			this.getInitData().then(this.searchTable)
		},
		methods: {
			getInitData() {
				this._ajax({
					name: 'order/buyerList',
					param: {
						level: 1,
						sellerId: local.get('sessionUser').typeCode
					}
				}).then((function(d) {
					Object.assign(this.buyerList, d.aaData)
				}).bind(this))

				let user = local.get('sessionUser');
				var vm = this;
				return this._ajax({
					name: 'product/queryList',
					param: {
						customerId: user.typeCode,
						deleted: 0
					}
				}).then((function(d) {
					Object.assign(vm.productList, d.aaData)
				}).bind(this))
			},
			//获取商品销售列表数据
			searchTable() {
				let user = local.get('sessionUser');
				this.sellerId = user.typeCode
				this._ajax({
					url: this.rootAPI,
					name: 'order/getSaleStistics',
					param: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						proName: this.proName,
						proSkuName: this.proSkuName,
						basicMeasure: this.basicMeasure,
						skuMeasure: this.skuMeasure,
						baseMeasureWeight: this.baseMeasureWeight,
						skuMeasureWeight: this.skuMeasureWeight,
						paidAmount: this.paidAmount,
						outstandingAmount: this.outstandingAmount,
						sortingTotal: this.sortingTotal,
						buyerId: this.searchForm.buyerId,
						productId: this.searchForm.productId,
						sellerId: this.sellerId,
						startTime: this.dateValue[0],
						endTime: this.dateValue[1]
					}
				}).then(this.renderTable)
			},
			reset() {
				this.dateValue = [this.getBeforeDay_7, this.getToday];
				this.searchForm.buyerId = '';
				this.searchForm.productId = '';
				this.searchTable();
			},
			exportExcel() {
				let _this = this;
				var fields = ['proName', 'proSkuName', 'basicMeasure', "saleTotal", "paidAmount", "outstandingAmount", "sortingTotal"],
					filedsName = ['商品名称', "规格关键字", "基本计量单位", "销售量", "已付金额(元)", "未付金额(元)", "合计金额(元)"],
					fileName = '商品统计表';

				let user = local.get('sessionUser');
				this.sellerId = user.typeCode
				this._ajax({
					url: this.rootAPI,
					name: 'order/getSaleStistics',
					param: {
						proName: this.proName,
						proSkuName: this.proSkuName,
						basicMeasure: this.basicMeasure,
						skuMeasure: this.skuMeasure,
						baseMeasureWeight: this.baseMeasureWeight,
						skuMeasureWeight: this.skuMeasureWeight,
						paidAmount: this.paidAmount,
						outstandingAmount: this.outstandingAmount,
						sortingTotal: this.sortingTotal,
						buyerId: this.searchForm.buyerId,
						sellerId: this.sellerId,
						startTime: this.dateValue[0],
						endTime: this.dateValue[1]
					}
				}).then((data) => {
					let exportData = data.aaData;
					exportData.forEach(function(e) {
						e.saleTotal = _this.getSaleTotal(e);
					});
					this._exportExcel(exportData, fields, filedsName, fileName)
				})
			},
			getSaleTotal(row) {
				return row.baseMeasureWeight + row.basicMeasure + '/' + row.skuMeasureWeight + row.skuMeasure
			}
		}
	}
</script>
<style lang="sass">
	.sale_analysis {
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