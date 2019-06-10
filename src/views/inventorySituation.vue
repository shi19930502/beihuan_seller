<template>
	<div class="page-khNolice">
		<!--<div class="toubu_B">
			<span class="tliel_name">商品列表</span>
			<span class="addanniu">
			</span>
		</div>-->
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="商品名称">
					<inputItem :value.sync="searchForm.productName" placeHolder="请输入商品名"></inputItem>
				</searchInputItem>
				</searchInputItems>
				<optionItems>
				
			</optionItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                <iconBtn iconClass="el-icon-printer" content="批量打印库存状况明细" @click="batchPrint" type="warning">批量打印明细</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
			</span>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="100" label="序号">
			</el-table-column>
			<el-table-column prop="productCode" label="商品编码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productCode">
						<div>{{scope.row.productCode}}</div>
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
				<el-table-column prop="productTypeName" label="所属分类">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productTypeName">
						<div>{{scope.row.productTypeName}}</div>
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
			<el-table-column prop="stockQuantityForDecimal" label="基本库存量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.stockQuantityForDecimal + scope.row.basicUnitName">
						<span v-if="scope.row.stockQuantityForDecimal != null">{{scope.row.stockQuantityForDecimal + scope.row.basicUnitName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="avgPriceForDecimal" label="基本均价">
				<template slot-scope="scope">
					<toolTip :content="scope.row.avgPriceForDecimal+'元/'+scope.row.basicUnitName">
						<span v-if="scope.row.avgPriceForDecimal != null">{{scope.row.avgPriceForDecimal+'元/'+scope.row.basicUnitName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="stockQuantitySkuForDecimal" label="规格库存量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.stockQuantitySkuForDecimal + scope.row.skuUnitName">
						<div v-if="scope.row.stockQuantitySkuForDecimal != null">{{scope.row.stockQuantitySkuForDecimal + scope.row.skuUnitName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="avgPriceSkuForDecimal" label="规格均价">
				<template slot-scope="scope">
					<toolTip :content="scope.row.avgPriceSkuForDecimal+'元/'+scope.row.skuUnitName">
						<div v-if="scope.row.avgPriceSkuForDecimal != null">{{scope.row.avgPriceSkuForDecimal+'元/'+scope.row.skuUnitName}}</div>
					</toolTip>
				</template>
			</el-table-column>

			<el-table-column label="操作">
				<template slot-scope="scope">
                    <div class="el-button-group">
                        <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
                        <iconBtn iconClass="el-icon-printer" content="打印库存状况明细" @click="printRow(scope.row)"></iconBtn>
                    </div>
				</template>
			</el-table-column>
		</elemTable>
		<inventorySituationModal :modal='inventorySituationModal' @add='modalAdd' :dataDic="dataDic" v-if='inventorySituationModal' @close='inventorySituationModalClose' :tableRow='tableRow'></inventorySituationModal>
        <div id="printtemp"></div>
	</div>
</template>
<script>
    import local from '../local.js'
    import mixin from '../mixin/mixin.js'
    import inventorySituationModal from './modals/inventorySituationModal.vue'

    export default {
		mixins: [mixin],
		components: {
			inventorySituationModal
		},
		data() {
			return {
				searchForm: {
					productName: ''
				},
				dataDic: {
					productList: []
				},
				dataList: [],
				modalShow: false,
				islookup: false,
				inventorySituationModal: false
			}
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				this.typeCode = parseInt((user.typeCode));
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					typeCode: this.typeCode
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'productstock/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
            exportExcel() {
                const _this = this;
                this.dataList.forEach(function (el) {
                    el['stockQuantityForDecimalTmp'] = el.stockQuantityForDecimal + el.basicUnitName;
                    el['avgPriceForDecimalTmp'] = el.avgPriceForDecimal + '元/' + el.basicUnitName;
                    el['stockQuantitySkuForDecimalTmp'] = el.stockQuantitySkuForDecimal + el.skuUnitName;
                    el['avgPriceSkuForDecimalTmp'] = el.avgPriceSkuForDecimal + '元/' + el.skuUnitName;
                });
                var fields = ['productCode', 'productName', 'productTypeName', 'skuName','stockQuantityForDecimalTmp', 'avgPriceForDecimalTmp', 'stockQuantitySkuForDecimalTmp', 'avgPriceSkuForDecimalTmp'],
                    filedsName = ['商品编码', "商品名称", "所属分类", "规格名称",'基本库存量', '基本均价', "规格库存量", "规格均价"],
                    fileName = '库存状况';
                this._exportExcel(this.dataList, fields, filedsName, fileName)
            },
            batchPrint() {
                if (this.delSelection.length === 0) {
                    this.$message({ type: "info", message: "请选择行" });
                } else {
                    let selection = this.delSelection;
                    this.print(selection);
                }
            },
            printRow(o) {
                var selection = [];
                selection.push(o);
                this.print(selection);
            },
            print(o) {
                const _this = this;
                var printHtml='';
                var len = o.length;
                var count = 0;
                o.forEach(function (el) {
                    const param = {
                        pageNum: 0,
                        pageSize: _this.pageSize,
                        customerId: el.customerId,
                        skuId: el.skuId,
                        productId: el.productId
                        // startTime: _this.dateValue[0],
                        // endTime: _this.dateValue[1]
                    };
                    _this._ajax({url: _this.rootAPI, name: "stockdetail/inventorySituationPrintInfo", param: param})
                        .then((function (d) {
                            count++;
                            var itemHTML='';

                            if (d.state == 0 && d.aaData.detail.aaData && Array.isArray(d.aaData.detail.aaData) && d.aaData.detail.aaData.length > 0) {
                                d.aaData.detail.aaData.forEach((function(em1, index) {
                                    let createdDate = em1.createdDate || '';
                                    let inoutTypeName = em1.inoutTypeName || '';
                                    let productName = em1.productName || '';
                                    let skuName = em1.skuName || '';
                                    let stockQuantitySku = em1.stockQuantitySku/100 + em1.skuUnitName || '';
                                    let stockQuantity = em1.stockQuantity/100 + em1.basicUnitName || '';
                                    let basicUnitName = em1.changeStockForDecimal + em1.basicUnitName|| '';
                                    let priceForDecimal = em1.priceForDecimal+'元/' + em1.basicUnitName || '';
                                    let changeStockSkuForDecimal = em1.changeStockSkuForDecimal + em1.skuUnitName || '';
                                    let priceSkuForDecimal = em1.priceSkuForDecimal+'元/' + em1.skuUnitName || '';
                                    let inout = em1.inoutType==1 ?'收入' :'支出';
                                    let changeStockForDecimal = _this._parseFloat(em1.changeStockForDecimal * em1.priceForDecimal, 4) || 0;

                                    var item = `
                                            <tr>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${createdDate}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${inoutTypeName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${stockQuantitySku}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${stockQuantity}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${basicUnitName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${priceForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${changeStockSkuForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${priceSkuForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${inout}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${changeStockForDecimal}</td>
                                            </tr>
                                          `;
                                    itemHTML += item
                                }).bind(this));
                            }

                            const productName = el.productName || '';
                            const productTypeName = el.productTypeName || '';
                            const productCode = el.productCode || '';

                            var content =`
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 18px;">
                              <span>库存状况明细单</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 16px;">
                              <span style="position: absolute;left: 0;">商品编码: ${productCode}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 16px;">
                              <span style="position: absolute;left: 0;">商品名称: ${productName}</span>
                               <span style="position: absolute;right: 0;">所属分类: ${productTypeName}</span>
                          </div>
                      <table style="text-align: center; border-collapse: collapse; width: 100%;margin-bottom: 100px;">
                          <thead style="font-size:18px;">
                              <tr>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">时间</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">库存变化类型</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">库存量（规格单位）</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">库存量(基本单位)</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">基本单位变化数量</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">基本单位变化单价</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格变化数量</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格变化单价</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">收入/支出</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">金额(元)</th>
                              </tr>
                          </thead>
                          ${itemHTML}
                      </table>
                    `;

                            printHtml += content;
                            printHtml += '<div style="page-break-after: always;"></div>';

                            if (count === len) {
                                var div = document.getElementById('printtemp');
                                div.innerHTML = printHtml;
                                $("#printtemp").jqprint();
                                div.innerHTML = ''
                            }
                        }).bind(this))
                });
            },
			reset() {
				Object.assign(this.searchForm, {
					productName: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			inventorySituationModalClose() {
				this.inventorySituationModal = false;
			},
			lookOver(row) {
				this.tableRow = row;
				this.inventorySituationModal = true;
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