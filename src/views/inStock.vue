<template>
	<div>
		<searchInputItems>
			<searchInputItem name="入库单号">
				<inputItem :value.sync="searchForm.stockNumber" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="入库类型">
				<selectInput :clearable='true' :value.sync="searchForm.stockChangeType" @selectChange="searchTable">
					<el-option
				      v-for="item in stockChangeTypeList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="创建时间">
				<dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<elBtn iconClass="el-icon-plus" content="新增" @click="modalAdd" type="success">新增</elBtn>
					<elBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</elBtn>
					<elBtn iconClass="el-icon-check" content="批量提交" type="warning" @click="bacthSubmit">批量提交</elBtn>
                    <elBtn iconClass="el-icon-printer" content="批量打印入库明细" @click="batchPrint" type="warning">批量打印明细</elBtn>
					<elBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</elBtn>
                    <elBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></elBtn>
                    <elBtn iconClass="el-icon-check" content="批量删除" type="danger" @click="bacthDel">批量删除</elBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="stockNumber" label="入库单号">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.stockNumber">
		    			<span>{{scope.row.stockNumber}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="inoutTypeName" label="类型">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.inoutTypeName">
		    			<span>{{scope.row.inoutTypeName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="stockTitle" label="名称、摘要、说明">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.stockTitle">
		    			<span>{{scope.row.stockTitle}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="stockCategoryNum" label="品类">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.stockCategoryNum">
		    			<span>{{scope.row.stockCategoryNum}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="supplierName" label="供应商">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.supplierName">
		    			<span>{{scope.row.supplierName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="totalAmountForDecimal" label="合计金额(元)">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.totalAmountForDecimal">
		    			<span>{{scope.row.totalAmountForDecimal}}</span>
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
		    <el-table-column prop="sourceId" label="来源单号">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.sourceId">
		    			<span>{{scope.row.sourceId}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdDate" label="创建时间">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.createdDate">
		    			<span>{{scope.row.createdDate}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" fixed="right" width="350">
		    	<template slot-scope="scope">
		    		<elBtn @click="modalCheck(scope.row)">查看明细</elBtn>
                    <iconBtn content="打印入库明细"  @click="printRow(scope.row)" >打印</iconBtn>
		    		<elBtn @click="modalEdit(scope.row)" type="success" v-if="scope.row.stockStatus == 0">编辑草稿</elBtn>
		    		<elBtn @click="del(scope.row)" type="danger" v-if="scope.row.stockStatus == 0">删除</elBtn>
		      	</template>
		    </el-table-column>
		</elemTable>
		<stockModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams" @submit="modalSubmit" :stockModalType="modalType" stockType="in"></stockModal>
        <div id="printtemp"></div>
	</div>
</template>
<script>
    import mixin from '../mixin/mixin.js'
    import stockModal from './modals/stockModal.vue'

    export default {
		mixins: [mixin],
		components: {stockModal},
		data() {
			return {
				searchForm: {
					stockNumber: '',
					stockChangeType: '',
					inoutType: '1',
				},
				dateRange: [],
				stockChangeTypeList: []
			}
		},
		mounted() {
			this._ajax({name: 'datadic/listAll', param: { dataType: 'STOCK_STATUS', extendVal: '1'}})
			.then((function(d) {
				this.stockChangeTypeList = this._dicKey(d)
			}).bind(this));
			this.searchTable()
		},
		methods: {
			searchTable() {
				var dateRange = {
					startTime: '',
					endTime: ''
				};
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				});
				return this._ajax({name: 'inoutstock/list', param: this.searchForm, loading: 'dataLoading'})
				.then(this.renderTable)
			},
            exportExcel() {
                var fields = ['stockNumber', 'inoutTypeName', 'stockTitle', 'stockCategoryNum','supplierName', 'totalAmountForDecimal', 'comment', 'sourceId', 'createdDate'],
                    filedsName = ['入库单号', "类型", "名称、摘要、说明", "品类",'供应商', '合计金额(元)', "备注", "来源单号", "创建时间"],
                    fileName = '入库管理';
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
                        mainId: el.id
                    };
                    _this._ajax({url: _this.rootAPI, name: "inoutstockdetail/list", param: param})
                        .then((function (d) {
                            count++;
                            var itemHTML='';
                            d.aaData.forEach((function(em1, index) {
                                let _index = index + 1;
                                let productName = em1.productName || '';
                                let skuName = em1.skuName || '';
                                let priceForDecimal = em1.priceForDecimal + '元/' + em1.basicUnitName || '';
                                let changeStockForDecimal = em1.changeStockForDecimal + em1.basicUnitName || '';
                                let priceSkuForDecimal = em1.priceSkuForDecimal + '元/' + em1.skuUnitName || '';
                                let changeStockSkuForDecimal = em1.changeStockSkuForDecimal + em1.skuUnitName || '';
                                let totalAmountForDecimal = em1.totalAmountForDecimal || 0;

                                var item = `
                                            <tr>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${priceForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${changeStockForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${priceSkuForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${changeStockSkuForDecimal}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${totalAmountForDecimal}</td>
                                            </tr>
                                          `;
                                itemHTML += item
                            }).bind(this));

                            const inoutTypeName = el.inoutTypeName || '';
                            const supplierName = el.supplierName || '';
                            const stockTitle = el.stockTitle || '';
                            const totalAmountForDecimal = el.totalAmountForDecimal || 0;
                            const comment = el.comment || '';

                            var content =`
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 16px;">
                              <span>入库明细单</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 14px;">
                              <span style="position: absolute;left: 0;">入库类型: ${inoutTypeName}</span>
                               <span style="position: absolute;right: 0;">供应商: ${supplierName}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 14px;">
                              <span style="position: absolute;left: 0;">名称: ${stockTitle}</span>
                               <span style="position: absolute;right: 0;">合计金额(元): ${totalAmountForDecimal}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 14px;">
                              <span style="position: absolute;left: 0;">备注: ${comment}</span>
                          </div>
                      <table style="text-align: center; border-collapse: collapse; width: 100%;margin-bottom: 100px;">
                          <thead style="font-size:14px;">
                              <tr>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">基本单价(元)</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">基本入库量</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格单价(元)</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格入库量</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">合计金额(元)</th>
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
					stockNumber: '',
					stockChangeType: '',
				});
				this.dateRange = [];
				this.handleCurrentChange(1)
			},
			selectable(row, index) {
				if(row.stockStatus == 0) {
					return true
				}else {
					return false
				}
			},
			bacthSubmit() {
				if(this.rowSelection.length > 0) {
					var stockId = [];
					this.rowSelection.forEach(function(el) {
						stockId.push(el.id)
					});
					this._bathSaveStock(stockId)
						.then((function(d) {
							if(d.state === 0) {
								this.$message({ type: 'success', message: '提交完成' });
								this.searchTable()
							}else {
								this.$message({ type: 'info', message: d.msg });
							}
						}).bind(this))
				}else {
					this.$message({ type: 'info', message: '请选择行' });
				}
			},
			del(row) {
				var arr = []
				arr.push(row.id)
				this.bathDelStock(arr)
			},
			bacthDel() {
				if(this.rowSelection.length > 0) {
					var stockId = [];
					this.rowSelection.forEach(function(el) {
						if(el.stockStatus == 0) {
							stockId.push(el.id)
						}						
					});
					if(stockId.length > 0) {
						this.bathDelStock(stockId)
					}					
				}else {
					this.$message({ type: 'info', message: '请选择行' });
				}
			},
			bathDelStock(arr) {
				this.confirm('确定删除？', (function() {
					this._bathDelStock(arr)
					.then((function(d) {
						if(d.state === 0) {
							this.$message({ type: 'success', message: '提交完成' });
							this.searchTable()
						}else {
							this.$message({ type: 'info', message: d.msg });
						}
					}).bind(this))
				}).bind(this))
			}
		}
	}
</script>