<template>
	<el-dialog custom-class="jz-modal"  width="1280px" title="库存流水信息" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" v-if="modal" :model="form" :inline="true" label-width="160px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="时间区间:">
						<dateEditorDaterange :dateValue.sync='dateValue'>
						</dateeditorDaterange>
					</el-form-item>
				</el-col>
				<span style="float: right;">
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				</span>

			</el-row>
		</el-form>

		<elemTable :dataList="dataList" @sizeChange='handleSizeChange' @currentChange='handleCurrentChange' :currentPage='pagNum' :pageSizes='pageSizes' :pageSize='pageSize' :pageTotal='pageTotal'>
			<el-table-column prop="createdDate" label="时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<div>{{scope.row.createdDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="stockChangeType" label="库存变化类型" min-width="60px">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.stockChangeType" v-if="scope.row.rowEditable">
						<el-option v-for="item in dataDic.stockList" :key="item.key" :label="item.value" :value="item.key">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderDic(dataDic.stockList, scope.row.stockChangeType)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="商品名称" min-width="60px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<div>{{scope.row.productName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="skuName" label="规格名" min-width="60px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuName">
						<div>{{scope.row.skuName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="stockQuantitySku" label="库存量（规格单位）">
				<template slot-scope="scope">
					<toolTip :content="scope.row.stockQuantitySku/100 + scope.row.skuUnitName">
						<span v-if="+ scope.row.skuUnitName != null">{{scope.row.stockQuantitySku/100 + scope.row.skuUnitName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="stockQuantity" label="库存量(基本单位)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.stockQuantity/100 + scope.row.basicUnitName">
						<span v-if="scope.row.stockQuantity != null">{{scope.row.stockQuantity/100 + scope.row.basicUnitName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="changeStockForDecimal" label="基本单位变化数量">
							<template slot-scope="scope">
								<toolTip :content="scope.row.changeStockForDecimal + scope.row.basicUnitName">
									<span v-if="scope.row.changeStockForDecimal != null">{{scope.row.changeStockForDecimal + scope.row.basicUnitName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="priceForDecimal" label="基本单位变化单价">
							<template slot-scope="scope">
								<toolTip :content="scope.row.priceForDecimal+'元/' + scope.row.basicUnitName">
									<span  v-if="scope.row.priceForDecimal != null">{{scope.row.priceForDecimal+'元/' + scope.row.basicUnitName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="changeStockSkuForDecimal" label="规格变化数量">
							<template slot-scope="scope">
								<toolTip :content="scope.row.changeStockSkuForDecimal + scope.row.skuUnitName">
									<span v-if="scope.row.changeStockSkuForDecimal != null">{{scope.row.changeStockSkuForDecimal + scope.row.skuUnitName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="priceSkuForDecimal" label="规格变化单价">
							<template slot-scope="scope">
								<toolTip :content="scope.row.priceSkuForDecimal+'元/' + scope.row.skuUnitName">
									<span v-if="scope.row.priceSkuForDecimal != null">{{scope.row.priceSkuForDecimal+'元/' + scope.row.skuUnitName}}</span>
								</toolTip>
							</template>
						</el-table-column>
			<el-table-column prop="inoutType" label="收入/支出" min-width="60px">
				<template slot-scope="scope">
					<toolTip content="支出" v-if="scope.row.inoutType != 1 ">
						<div>支出</div>
					</toolTip>
					<toolTip content="收入" v-if="scope.row.inoutType == 1 ">
						<div>收入</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="maxScore" label="金额">
				<template slot-scope="scope">
					<toolTip :content="_parseFloat(scope.row.changeStockForDecimal * scope.row.priceForDecimal,4)+'元'">
						<div>{{_parseFloat(scope.row.changeStockForDecimal * scope.row.priceForDecimal, 4) +'元'}}</div>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
		<div style="width: 1000px; overflow: hidden;" v-for="item in dataDic.priceList">
			<span v-if="item.inoutType == 1" style="width: 1000px;">收入统计:</span>
			<span v-if="item.inoutType != 1" style="width: 1000px;">支出统计:</span>
			<div style="width: 1000px; line-height: 30px;">
				<div style="width: 800px; float: left;">
				<el-progress :text-inside="true" :stroke-width="18" :percentage="48" :show-text="show"></el-progress>
				</div>
				<div  style="width: 190px; float: left;">数量:{{item.count + unitName}}</div>
			</div>
			
			<div style="width: 1000px; line-height: 30px;">
				<div style="width: 800px; float: left;">
				<el-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(142, 113, 199, 0.7)" :show-text="show"></el-progress>
				</div>
				<div style="width: 190px; float: left; ">金额:{{item.totalAmount/100 +'元'}}</div>
			</div>

		</div>

	</el-dialog>
</template>

<script>
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
				dataList: [],
				formDisabled: true,
				dataDic: {
					stockList: [],
					priceList: []
				},
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
				//查询数据字典获取出入库类型
				var param = {
					dataType: 'STOCK_STATUS'
				};
				this._ajax({
						url: this.rootAPI + 'datadic/listAll',
						param: param,
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							stockList: data
						})
					}).bind(this))
			},
			searchTable() {
				this.dataList = [];
				var vm = this;
				console.log(111,this.dateValue)
				if(this.dateValue && this.dateValue.length == 0) {
					this.dateValue[0] = this.getBeforeDay_7;
					this.dateValue[1] = this.getToday;
				}
				console.log(222,this.dateValue)
				this._ajax({
					url: this.tootAPI,
					name: 'stockdetail/list',
					param: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						customerId: this.tableRow.customerId,
						skuId: this.tableRow.skuId,
						productId: this.tableRow.productId,
						startTime: this.dateValue==null?'':this.dateValue[0],
						endTime: this.dateValue==null?'':this.dateValue[1]
					}
				}).then(this.renderTable)
				/*then((function(d) {
					let data = d.aaData;
					vm.dataList = data;
					$.each(vm.dataList, function(i, obj) {
					vm.unitName = obj.basicUnitName;
					
				});*/
				.then((function(){
					$.each(vm.dataList, function(i, obj) {
						vm.unitName = obj.basicUnitName;
					});
				}).bind(this))

				this._ajax({
					url: this.tootAPI,
					name: 'stockdetail/countAmount',
					param: {
						customerId: this.tableRow.customerId,
						skuId: this.tableRow.skuId,
						productId: this.tableRow.productId,
						startTime: this.dateValue==null?'':this.dateValue[0],
						endTime: this.dateValue==null?'':this.dateValue[1]
					}
				}).then((function(d) {
					let data = d.aaData;
					Object.assign(this.dataDic, {
						priceList: data
					})
				}).bind(this));

			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
			renderDic(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.key == dicKey) {
						dicShow = obj.value;
					}
				});
				return dicShow;
			}
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
</style>