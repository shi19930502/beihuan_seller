<template>
	<div>
		<searchInputItems>
			<searchInputItem name="客户名称">
				<inputItem :value.sync="searchForm.customerName" @enter="searchTable" placeHolder="请输入客户名" ></inputItem>
			</searchInputItem>
			<optionItems>
			<template slot="right">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success">导出</iconBtn>
			</template>
		</optionItems>
		</searchInputItems>
		
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
		    <el-table-column prop="f_buyer_name" label="客户名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.f_buyer_name">
		    			<span>{{scope.row.f_buyer_name}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="f_trade_area_name" label="所属商圈">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.f_trade_area_name">
		    			<span>{{scope.row.f_trade_area_name}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="regDays" label="注册天数">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.regDays">
		    			<span>{{scope.row.regDays}}&nbsp;天</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="orderDays" label="下单天数">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.orderDays">
		    			<span>{{scope.row.orderDays}}&nbsp;天</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="orderRatio" label="活跃度">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.orderRatio">
		    			<span>{{scope.row.orderRatio}}&nbsp;%</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		     <el-table-column prop="f_sorting_order_total" label="合计金额">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.f_sorting_order_total">
		    			<span>{{scope.row.f_sorting_order_total}}&nbsp;元</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" fixed="right" width="160">
		    	<template slot-scope="scope">
		    		<el-button @click="modalCheck(scope.row)">查看明细</el-button> 
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
					customerName:'',
				
				},
				dateRange: [],
//				modalShow:false,
				stockChangeTypeList: [],
				dataList:[],
//				buyerid:'',
				tableRow:{},
			}
		},
		mounted() {
			this.searchTable()
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				this.sellerId=user.typeCode,
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					sellerId:this.sellerId
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'customer/queryCustomerAnalysis',
					param:this.searchForm,
					loading: 'dataLoading'
				}).then((function(d) {
						this.renderTable(d)
//					   	this.buyerid=d.aaData[].f_buyer_id;
						
					}).bind(this))
			},
			reset() {
				Object.assign(this.searchForm, {
					customerName:'',
				})
				this.handleCurrentChange(1)
			},
			modalCheck (row){
				this.$router.push({ path: '/customerAnalysisModal',query:{buyerid:row.f_buyer_id}});
			},
			exportExcel() {
				var fields = ['f_buyer_name', 'f_trade_area_name', 'regDays','orderDays','orderRatio','f_sorting_order_total'],
					filedsName = ["客户名称", "所属商圈", "注册天数","下单天数", "活跃度", "合计金额(元)"],
					fileName = '客户分析表';
					
				let user = local.get('sessionUser');
				this.sellerId=user.typeCode,
				Object.assign(this.searchForm, {
					sellerId:this.sellerId
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'customer/queryCustomerAnalysis',
					param:this.searchForm,
					loading: 'dataLoading'
				}).then((data)=>{
					let exportData = data.aaData;
					exportData.forEach(function(e){
						e.orderRatio = e.orderRatio + '%';
					});
					this._exportExcel(exportData, fields, filedsName, fileName)
				})
			},
		}
	}
</script>