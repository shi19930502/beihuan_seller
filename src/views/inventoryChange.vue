<template>
	<div class="jibenxinxi">
		<el-tabs v-model="activeName" @tab-click="handleClickTab">

			<div v-for="item in dataDic.stockList">
				<!--基本信息-->
				<el-tab-pane :label="item.value" :name="item.key+''">
					<searchInputItems>
						<searchInputItem :name="item.value+'时间'">
							<dateEditorDaterange :dateValue.sync="dateValue" ></dateEditorDaterange>
						</searchInputItem>
						<searchInputItem name="单号">
							<inputItem :value.sync="searchForm.stockNumber"></inputItem>
						</searchInputItem>
						<searchInputItem name="经办人">
							<inputItem :value.sync="searchForm.createdPersonName"></inputItem>
						</searchInputItem>
						<span class="addanniu" style="float: right;">
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset(item.key)">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable(item.key)" type="primary">查询</iconBtn>
				    <iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
					</span>
					</searchInputItems>

					<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
						<el-table-column prop="stockChangeType" label="库存变化类型">
							<template slot-scope="scope">
								<selectInput :value.sync="scope.row.stockChangeType" v-if="scope.row.rowEditable">
									<el-option v-for="item in dataDic.stockList" :key="item.key" :label="item.value" :value="item.key">
									</el-option>
								</selectInput>
								<span v-if="!scope.row.rowEditable">{{renderDic(dataDic.stockList, scope.row.stockChangeType)}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="createdDate" :label="item.value+'时间'">
							<template slot-scope="scope">
								<toolTip :content="scope.row.createdDate">
									<span>{{scope.row.createdDate}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="stockNumber" label="单号">
							<template slot-scope="scope">
								<toolTip :content="scope.row.stockNumber">
									<span>{{scope.row.stockNumber}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="productTypeName" label="所属分类">
							<template slot-scope="scope">
								<toolTip :content="scope.row.productTypeName">
									<span>{{scope.row.productTypeName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="productCode" label="商品编号">
							<template slot-scope="scope">
								<toolTip :content="scope.row.productCode">
									<span>{{scope.row.productCode}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="productName" label="商品名">
							<template slot-scope="scope">
								<toolTip :content="scope.row.productName">
									<span>{{scope.row.productName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="skuName" label="规格名称">
							<template slot-scope="scope">
								<toolTip :content="scope.row.skuName">
									<span>{{scope.row.skuName}}</span>
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
						<el-table-column prop="stockQuantity" label="库存量(基本单位)">
							<template slot-scope="scope">
								<toolTip :content="scope.row.stockQuantity/100 + scope.row.basicUnitName">
									<span>{{scope.row.stockQuantity/100 + scope.row.basicUnitName}}</span>
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
						<el-table-column prop="stockQuantitySku" label="库存量(规格单位)">
							<template slot-scope="scope">
								<toolTip :content="scope.row.stockQuantitySku/100 +scope.row.skuUnitName">
									<span>{{scope.row.stockQuantitySku/100 +scope.row.skuUnitName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="createdPersonName" label="经办人">
							<template slot-scope="scope">
								<toolTip :content="scope.row.createdPersonName">
									<span>{{scope.row.createdPersonName}}</span>
								</toolTip>
							</template>
						</el-table-column>
					</elemTable>
				</el-tab-pane>

			</div>
		</el-tabs>
	</div>
</template>

<script>
	var quotationIdTemp = '';
    import local from '../local.js'
    import mixin from '../mixin/mixin.js'

    export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					stockNumber: '',
					createdPersonName: '',
					customerId: '',
					stockChangeType: '',
					startTime: '',
					endTime: ''
				},
				dateValue: [],
				dataDic: {
					personList: [],
					stockList: []
				},
				dataList: [],
				rowOBJ: {},
				activeName: '1',
				tabDisabled: true,
				pageTotal:0,
				type:1
			}
		},
		mounted() {
			this.getInitData().then(this.searchTable)
		},
		methods: {
			handleClickTab(tab, event) {
				let key = tab.name;
				this.type = key;
				this.pageNum = 1;
				this.searchTable(key);
			},
			getInitData() {
				//查询数据字典获取出入库类型
				var param = {
					dataType: 'STOCK_STATUS',
					orderField:'fKey'
				};
				return this._ajax({
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
			searchTable(key) {
				//key==null是选页码查询情况
				if(key == null){
					key = this.type;
				}
				if(this.dateValue.length != 0) {
					this.searchForm.startTime = this.dateValue[0];
					this.searchForm.endTime = this.dateValue[1];
				}
				let user = local.get('sessionUser');
				this.searchForm.customerId = parseInt((user.typeCode));
				this.searchForm.stockChangeType = key;
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				});
				return this._ajax({
					url: this.rootAPI,
					name: 'stockdetail/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			handleClick(tab, event) {
				this.searchTable();
			},
            exportExcel() {
                const _this = this;
                this.dataList.forEach(function (el) {
                    el['stockChangeTypeTmp'] = _this.renderDic(_this.dataDic.stockList, el.stockChangeType);
                    el['changeStockForDecimalTmp'] = el.changeStockForDecimal + el.basicUnitName;
                    el['priceForDecimalTmp'] = el.priceForDecimal + '元/' + el.basicUnitName;
                    el['stockQuantityTmp'] = el.stockQuantity / 100 + el.basicUnitName;
                    el['changeStockSkuForDecimalTmp'] = el.changeStockSkuForDecimal + el.skuUnitName;
                    el['priceSkuForDecimalTmp'] = el.priceSkuForDecimal + '元/' + el.skuUnitName;
                    el['stockQuantitySkuTmp'] = el.stockQuantitySku / 100 + el.skuUnitName;
                });

                var typeName = "";
                this.dataDic.stockList.forEach(function (stock) {
                    if (stock.key == _this.type) {
                        typeName = stock.value;
                    }
                });

                var fields = ['stockChangeTypeTmp', 'createdDate', 'stockNumber', 'productTypeName', 'productCode', 'productName', 'skuName', 'changeStockForDecimalTmp', 'priceForDecimalTmp', 'stockQuantityTmp', 'changeStockSkuForDecimalTmp', 'priceSkuForDecimalTmp', 'stockQuantitySkuTmp', 'createdPersonName'],
                    filedsName = ['库存变化类型', "时间", "单号", "所属分类", '商品编号', '商品名', "规格名称", "基本单位变化数量", "基本单位变化单价", '库存量(基本单位)', '规格变化数量', '规格变化单价', '库存量(规格单位)', '经办人'],
                    fileName = typeName + '库存流水';
                this._exportExcel(this.dataList, fields, filedsName, fileName)
            },
			reset(key) {
				Object.assign(this.searchForm, {
					stockNumber: '',
					createdPersonName: '',
					customerId: '',
					startTime: '',
					endTime: ''
				});
				this.dateValue = [];
				this.pageNum = 1;
				this.searchTable(key)
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

		}
	}
</script>

<style lang="sass">
	.jibenxinxi {
		padding: 20px;
	}

	.submitB {
		text-align: center;
	}
</style>