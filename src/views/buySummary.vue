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
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
			</span>
		</div>	
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column type="index" width="150" label="序号">
			</el-table-column>
			<el-table-column prop="productName" label="商品名">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<span>{{scope.row.productName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="skuName" label="规格名称" >
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuName">
						<span>{{scope.row.skuName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="totalQuantity" label="规格需求总量" >
				<template slot-scope="scope">
					<toolTip :content="scope.row.totalQuantity+scope.row.skuMeaName">
						<span>{{scope.row.totalQuantity}}&nbsp;{{scope.row.skuMeaName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="totalStock" label="规格库存量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.totalStock+scope.row.skuMeaName">
						<span>{{scope.row.totalStock}}&nbsp;{{scope.row.skuMeaName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<!--<el-table-column prop="skuPrice" label="规格单价">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuPrice+'元/'+scope.row.skuMeaName">
						<span>{{scope.row.skuPrice}}&nbsp;元/{{scope.row.skuMeaName}}</span>
					</toolTip>
				</template>
			</el-table-column>-->
			<el-table-column prop="difference" label="规格差额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.difference+scope.row.skuMeaName">
						<span>{{scope.row.difference}}&nbsp;{{scope.row.skuMeaName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="comment" label="备注">
				<template slot-scope="scope">
					<toolTip :content="scope.row.comment">
						<span>{{scope.row.comment}}</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					typeCode: '',
					distributionTimeBegin:''
				},
				dataDic: {
					tradingAreaList: []
				},
				dataList: [],
				exportDataList:[],
				distributionTimeBegin:''
			}
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			searchTable() {
				if(this.distributionTimeBegin == '') {
					this.distributionTimeBegin = this.getTomorrow;
				}
				var vm= this;
				let user = local.get('sessionUser');
				return this._ajax({
					url: this.rootAPI,
					name: 'order/buySummaryFromDay',
					param: {
						pageNum : this.pageNum,
						pageSize: this.pageSize,
						typeCode:  user.typeCode,
						distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-")
					},
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			exportExcel() {
				let user = local.get('sessionUser');
				this.exportDataList = [],
				this.searchForm.pageNum = ''
				this.searchForm.pageSize = ''
				this.searchForm.typeCode = user.typeCode
				this.searchForm.distributionTimeBegin = this.distributionTimeBegin.replace("-","-").replace("-","-")
				this._ajax({
					url: this.rootAPI,
					name: 'order/buySummaryFromDay',
					param: {
						typeCode:  user.typeCode,
						distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-")
					},
					loading: 'dataLoading'
				}).then((function(d) {
					let data = d.aaData;
					this.exportDataList = data;
					var fields = ['productName', 'skuName','totalQuantity', 'totalStock','difference','skuMeaName','comment'],
						filedsName = ['商品名','规格名称', '需求总量', '库存量','差额','规格单位', '备注'],
						fileName = '每日订单需求和库存对照表';
					this._exportExcel(this.exportDataList, fields, filedsName, fileName)
				}).bind(this))
			},
			reset() {
				this.distributionTimeBegin = '';
				this.searchTable();
			}
		}
	}
</script>
<style lang="sass">
.page-khNolice {
		.toubu_B{
			height:60px;
			border-bottom: 1px solid #D1D1D1;margin:10px;
			.tliel_name{
				float:left;
				font-size:25px;
			}
			.addanniu{
				float:right;
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