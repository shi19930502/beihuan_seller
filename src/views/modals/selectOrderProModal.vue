<template>
	<el-dialog custom-class="page-buyer" title="选择订单信息" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<searchInputItems>
            <searchInputItem name="订单号">
                <inputItem :append="true" :value.sync="searchForm.orderUmber" placeHolder="请输入订单号">
                    <elBtn iconClass="el-icon-search" slot="append" @click="searchTable"></elBtn>
                </inputItem>
            </searchInputItem>
        </searchInputItems>
		<el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            	<el-tabs v-model="tabModal">
	                <el-tab-pane label="订单列表" name="first">
	                    <elemTable
	                            :dataList="dataList"
	                            @sizeChange='handleSizeChange'
	                            @currentChange='handleCurrentChange'
	                            :currentPage='pageNum'
	                            :pageSizes='pageSizes'
	                            :pageSize='pageSize'
	                            type="text"
	                            :pageTotal='pageTotal'
	                            :tableBorder="tableBorder"
	                            :highlightCurrentRow="true"
	                            @selectChange="selectChange">
	                        <el-table-column show-overflow-tooltip property="orderUmber" label="订单号" min-width="80"></el-table-column>
	                        <el-table-column show-overflow-tooltip property="buyerName" label="买方名称" min-width="80"></el-table-column>
                         	<el-table-column prop="code" label="配送时间">
								<template slot-scope="scope">
									<span>{{scope.row.distributionTimeBegin}}~{{scope.row.distributionTimeEnd}}</span>
								</template>
							</el-table-column>
	
	                    </elemTable>
	                </el-tab-pane>
	            </el-tabs>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            	<el-tabs v-model="tabModal">
	                <el-tab-pane label="订单明细" name="first">
	                    <elemTable
	                            :dataList="orderDetailList"
	                            :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange"
	                            :showPagination="false" >
                            <el-table-column type="selection" width="55"></el-table-column>
	                        <el-table-column show-overflow-tooltip property="productName" label="商品名称"
	                                         min-width="80"></el-table-column>
	                        <el-table-column show-overflow-tooltip property="skuName" label="规格名称"
	                                         min-width="80"></el-table-column>
							<el-table-column show-overflow-tooltip property="sortingWeight" label="分拣量" min-width="80">
								<template slot-scope="scope">
									<span>{{scope.row.sortingWeight}}({{(scope.row.measureTypePro == 1 && scope.row.measureTypeSKU == 2 && scope.row.chargingModel == 1) ? scope.row.baseMeasureName : scope.row.skuMeasureName}})</span>
								</template>
							</el-table-column>
							<el-table-column show-overflow-tooltip property="itemTotalForDecimal" label="分拣金额"
	                                         min-width="80">
								<template slot-scope="scope">
									<span>{{scope.row.itemTotalForDecimal}}元</span>
								</template>
							</el-table-column>
	                    </elemTable>
	                </el-tab-pane>
                </el-tabs>
            </el-col>
       	</el-row>
	    <div style="text-align: right">
	    	<elBtn @click="cancel" type="info">取消</elBtn>
	        <iconBtn @click="chooseOrderPro" content="确认选择" type="primary" class="el-icon-check">确认选择</iconBtn>
	    </div>
   	</el-dialog>
</template>

<script>
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				tabModal: 'first',
				orderDetailList : [],
				searchForm : {
					orderStatusString : '',
					orderUmber : '',
					sellerId : '',
					distributionType: '',
				},
				order : '',
			}
		},
		props: {
			modal: {
				default: false
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			initData() {
				this.searchTable();
			},
			searchTable() {
				let user = local.get('sessionUser');
				Object.assign(this.searchForm, {
					orderStatusString: '2,3,4,5,8',
                    sellerId: user.typeCode,
                    distributionType: 1,
                    pageNum: this.pageNum,
					pageSize: this.pageSize,
				})
				this._ajax({
                    url: this.rootAPI, name: 'order/listByStatus',
                    param: this.searchForm
                }).then(this.renderTable)
			},
			selectChange(val) {
				this.order = val;
				if(val) {
					this._ajax({
	                    url: this.rootAPI, name: 'orderitem/list',
	                    param: {
	                    	orderId : val.id
	                    }
	                }).then((function(d) {
	                	this.orderDetailList = d.aaData;
	                }).bind(this))
				} else 
					this.orderDetailList = [];
            },
			cancel() {
				this.$emit('close')
			},
			beforeClose(done) {
				this.cancel()
				done()
			},
			chooseOrderPro() {
				if (this.rowSelection.length > 0) {
                    this.$emit('submit', this.rowSelection, this.order)
                } else {
                    this.$message({type: 'warning', message: '请选择商品'});
                }
			},
		}
	}
</script>
<style lang="sass">
    .page-channel{
        .row-block{
        	width: 100%;
            .el-form-item__content {
                width: calc(100% - 150px);
                &>div{
                    width: 100%;
                }
            }            
        }
    }
</style>
