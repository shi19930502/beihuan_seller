<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="盘点状态">
				<selectInput :clearable='true' :value.sync="searchForm.inventoryStatus" @selectChange="searchTable">
					<el-option
				      v-for="item in dataDic.inventoryStatus"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="单据编号">
				<inputItem :value.sync="searchForm.inventoryNumber" placeHolder="请输入单据编号"></inputItem>
			</searchInputItem>
			<searchInputItem name="单据关键字">
				<inputItem :value.sync="searchForm.keyWord" placeHolder="请输入单据关键字"></inputItem>
			</searchInputItem>
			<searchInputItem name="盘点日期">
				<dateEditorDaterange :dateValue.sync="dateRange" :start-placeholder="searchForm.startDate" :end-placeholder="searchForm.endDate"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="addInventory" type="success">新增</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-printer" content="批量打印盘点明细" @click="batchPrint" type="warning">批量打印明细</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    <iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
                    <elBtn iconClass="el-icon-check" content="批量删除" type="danger" @click="bacthDel">批量删除</elBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<!--<el-table-column prop="channelCode" label="序号">
		    	<template slot-scope="scope">
	    			<span v-if="!scope.row.rowEditable">{{scope.row.channelCode}}</span>
		      	</template>
		    </el-table-column>-->
		    <el-table-column prop="inventoryDate" label="盘点日期">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dateFormat({date: scope.row.inventoryDate})">
		    			<span>{{_dateFormat({date: scope.row.inventoryDate})}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="inventoryNumber" label="盘点单号">
		    	<template slot-scope="scope">
	    			<toolTip :content="scope.row.inventoryNumber">
		    			<span>{{scope.row.inventoryNumber}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="customerId" label="经办人">
		    	<template slot-scope="scope">
	    			<toolTip :content="scope.row.createdPersonName">
		    			<span>{{scope.row.createdPersonName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="inventoryStatus" label="状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.inventoryStatus, dataDic.inventoryStatus)">
		    			<span>{{_dicValue(scope.row.inventoryStatus, dataDic.inventoryStatus)}}</span>
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
		    <el-table-column label="操作" width="230">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn content="编辑" class="el-icon-edit"  @click="modalEditOther(scope.row)" v-if="scope.row.inventoryStatus == 0">编辑</iconBtn>
					    <iconBtn content="删除" class="el-icon-delete"  @click="delRow(scope.row)" v-if="scope.row.inventoryStatus == 0">删除</iconBtn>
					    <iconBtn content="详情"  @click="showDetail(scope.row)" v-if="scope.row.inventoryStatus == 1">详情</iconBtn>
					    <iconBtn content="打印盘点明细"  @click="printRow(scope.row)" >打印</iconBtn>
                        <!--<iconBtn content="打印配送单" @click="printRow(scope.row)" type="warning" plain>打印配送单</iconBtn>-->
                    </el-button-group>
		    	</template>
		    </el-table-column>
		</elemTable>

		<inventoryShowModal :modal='inventoryShowModal' @add='modalAdd' v-if='inventoryShowModal' @close='inventoryShowModalClose' :tableRow='tableRow'></inventoryShowModal>
		<div id="printtemp"></div>
	</div>
</template>
<script>
    import mixin from '../mixin/mixin.js'
    import inventoryShowModal from './modals/inventoryShowModal.vue'

    export default {
		mixins: [mixin],
		components: {inventoryShowModal},
		data() {
			return {
				dateRange:[],
				searchForm: {
					inventoryStatus : '',
					inventoryNumber : '',
					keyWord : ''
				},
				dataList: [],
				rowOBJ: {},
				dataDic:{inventoryStatus:''},
				inventoryShowModal:false,
				tableRow:''
			}
		},
		mounted() {
			this._searchDic('INVENTORY_STATUS')
			.then((function(d) {
				let data = d.aaData;
				Object.assign(this.dataDic,{
					inventoryStatus : data
				})
			}).bind(this))
			.then(this.searchTable)
		},
		methods: {
			initData() {

			},
			searchTable() {
				let dateRange = this.dateRange
				if(dateRange && dateRange.length > 0) {
					Object.assign(this.searchForm, {
						startTime : dateRange[0],
						endTime : dateRange[1]
					})
				}
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				})
				return this._ajax({name: 'productstockinventory/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			modalEditOther(row) {
				this.$router.push({name : 'inventoryModal', query : {id : row.id}});
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {
        			var o = {
        				id: [row.id]
        			}
					this._ajax({url: this.rootAPI + 'productstockinventory/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
			addInventory() {
				this.$router.push({name : 'inventoryModal'});
			},
            exportExcel() {
                const _this = this;
                this.dataList.forEach(function (el) {
                    el['inventoryStatusTmp'] = _this._dicValue(el.inventoryStatus, _this.dataDic.inventoryStatus);
                });
                var fields = ['inventoryDate', 'inventoryNumber', 'createdPersonName', 'inventoryStatusTmp', 'comment'],
                    filedsName = ['盘点日期', "盘点单号", "经办人", "状态", '备注'],
                    fileName = '盘点管理';
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
                    }

                    _this._ajax({url: _this.rootAPI, name: "inventorydetail/list", param: param})
                        .then((function (d) {
                            count++;
                            var itemHTML='';
                            d.aaData.forEach((function(em1, index) {
                                let _index = index + 1;
                                let productName = em1.productName || '';
                                let skuName = em1.skuName || '';
                                let stockQuantity = em1.stockQuantity/100 || 0;
                                let inventoryStock = em1.inventoryStock/100 || '';
                                let plus = (_this._calc((em1.inventoryStock == null ? 0 : em1.inventoryStock)/100,em1.stockQuantity/100,"subtract")) || '';

                                var item = `
                                            <tr>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${stockQuantity}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${inventoryStock}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${plus}</td>
                                            </tr>
                                          `;
                                itemHTML += item
                            }).bind(this));

                            const inventoryNumber = el.inventoryNumber || '';
                            const inventoryDate = _this._dateFormat({date: el.inventoryDate}) || '';
                            const comment = el.comment || '';

                            var content =`
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 18px;">
                              <p style="position: absolute;right: 0;bottom: 10px;font-size: 14px;">盘点单号: ${inventoryNumber}</p>
                              <span>盘点明细单</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 16px;">
                              <span style="position: absolute;left: 0;">盘点日期: ${inventoryDate}</span>
                               <span style="position: absolute;right: 0;">备注: ${comment}</span>
                          </div>
                      <table style="text-align: center; border-collapse: collapse; width: 100%;margin-bottom: 100px;">
                          <thead style="font-size:18px;">
                              <tr>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">账面数</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">实盘数</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">差异</th>
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
					inventoryStatus : '',
					inventoryNumber : '',
					keyWord : ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			showDetail(row) {
				this.inventoryShowModal = true
				this.tableRow = row
			},
			inventoryShowModalClose() {
				this.inventoryShowModal = false;
			},
			bacthDel() {
				if(this.rowSelection.length > 0) {
					var stockId = [];
					this.rowSelection.forEach(function(el) {
						if(el.inventoryStatus == 0) {
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
					this._bathDelInventory(arr)
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
