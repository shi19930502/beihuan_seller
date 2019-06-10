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
			<el-table-column prop="difference" label="参考价格区间">
				<template slot-scope="scope">
					<span>{{(scope.row.lowPrice)/100}}~{{(scope.row.highPrice)/100}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="销售价格">
				<template slot-scope="scope">
	    			<inputItem :value.sync="scope.row.price" @change="priceChange(scope.row)"></inputItem>
		      	</template>
			</el-table-column>
			<el-table-column prop="comment" label="操作">
				<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-view" content="查看" @click="viewOrderItem(scope.row)" >查看</iconBtn>
		    		</el-button-group>
		    	</template>
			</el-table-column>
		</elemTable>
		
		<buyPriceSetViewModal :modal='buyPriceSetViewModal' @add='modalAdd' v-if='buyPriceSetViewModal' @close='buyPriceSetViewModalClose' :tableRow='tableRow'></buyPriceSetViewModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import buyPriceSetViewModal from './modals/buyPriceSetViewModal.vue'
	export default {
		mixins: [mixin],
		components: {
			buyPriceSetViewModal
		},
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
				distributionTimeBegin:'',
				user : local.get('sessionUser'),
				buyPriceSetViewModal : false,
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
				if(!this.distributionTimeBegin) {
					this.$message({type: 'warning', message: '请选择时间'});
					return;
				}
				var vm= this;
				return this._ajax({
					url: this.rootAPI,
					name: 'buy/buyPriceSetForDay',
					param: {
						pageNum : this.pageNum,
						pageSize: this.pageSize,
						typeCode:  this.user.typeCode,
						distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-")
					},
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			exportExcel() {
				if(!this.distributionTimeBegin) {
					this.$message({type: 'warning', message: '请选择时间'});
					return;
				}
				this.exportDataList = [],
				this.searchForm.pageNum = ''
				this.searchForm.pageSize = ''
				this.searchForm.typeCode = this.user.typeCode
				this.searchForm.distributionTimeBegin = this.distributionTimeBegin.replace("-","-").replace("-","-")
				this._ajax({
					url: this.rootAPI,
					name: 'buy/buyPriceSetForDay',
					param: {
						typeCode:  this.user.typeCode,
						distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-")
					},
					loading: 'dataLoading'
				}).then((function(d) {
					let data = d.aaData;
					for(var i=0;i<data.length;i++){
						data[i].lowPrice=(data[i].lowPrice)/100;
						data[i].highPrice=(data[i].highPrice)/100;
					}
					this.exportDataList = data;
					var fields = ['productName', 'skuName','totalQuantity', 'lowPrice', 'highPrice', 'price'],
						filedsName = ['商品名','规格名称', '需求总量', '参考最低价', '参考最高价', '销售价格'],
						fileName = '订单需求和价格设置表';
					this._exportExcel(this.exportDataList, fields, filedsName, fileName)
				}).bind(this))
			},
			reset() {
				this.distributionTimeBegin = '';
				this.searchTable();
			},
			priceChange(obj) {
				if(!this.distributionTimeBegin) {
					this.$message({type: 'warning', message: '请选择时间'});
					return;
				}
				let param = {
					skuId : obj.skuId,
					price : obj.price * 100,
					typeCode:  this.user.typeCode,
					distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-")
				}
				this._ajax({
					url: this.tootAPI,
					name: 'buy/priceChange',
					param: param
				}).then((function(d) {
					if(d.state == 0) {
						this.$message({type: 'success', message: '设置成功！'});
					} else {
						this.$message({type: 'warning', message: '设置失败：'+d.msg});
					}
				}).bind(this));
			},
			viewOrderItem(row) {
				Object.assign(row, {
					distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-")
				})
				this.tableRow = row;
				this.buyPriceSetViewModal = true;
			},
			buyPriceSetViewModalClose() {
				this.buyPriceSetViewModal = false;
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