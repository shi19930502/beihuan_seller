<template>
    <div class="page-khNolice">
        <div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="配送日期">
						<dateEditorDaterange type="date" :showShortcuts="false"
                                             :dateValue.sync="searchForm.distributionTimeBegin"
                                             :dateRange='dateRange'></dateEditorDaterange>
					</searchInputItem>
				</searchInputItems>
			</span>
            <span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                <iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success">导出</iconBtn>
			</span>
        </div>

        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
            <!--<el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column type="index" width="150" label="序号">
            </el-table-column>
            <el-table-column prop="productName" label="商品名">
                <template slot-scope="scope">
                    <span>{{scope.row.productName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格单位">
                <template slot-scope="scope">
                    <span>{{scope.row.skuName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalQuantity" label="下单量">
                <template slot-scope="scope">
                    <span>{{scope.row.totalQuantity}}&nbsp;{{scope.row.skuMeaName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalStock" label="分拣量">
                <template slot-scope="scope">
                    <span>{{scope.row.totalSortingWeight}}&nbsp;{{scope.row.sortMeaName}}</span>
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
                    distributionTimeBegin: ''
                },
                dataList: [],
                exportDataList: [],
            }
        },
        mounted() {
            this.searchTable();
        },
        methods: {
            searchTable() {
                if (this.searchForm.distributionTimeBegin == '') {
                    this.searchForm.distributionTimeBegin = this.getTomorrow;
                }
                let user = local.get('sessionUser');
                Object.assign(this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    typeCode: user.typeCode
                })
                return this._ajax({
                    url: this.rootAPI,
                    name: 'order/queryProductNeedDistribut',
                    param: this.searchForm,
                    loading: 'dataLoading'
                }).then(this.renderTable)
            },
            exportExcel() {
                if (this.searchForm.distributionTimeBegin == '') {
                    this.searchForm.distributionTimeBegin = this.getTomorrow;
                }
                let user = local.get('sessionUser');
                Object.assign(this.searchForm, {
                    pageNum: 0,
                    pageSize: 0,
                    typeCode: user.typeCode
                })
                return this._ajax({
                    url: this.rootAPI,
                    name: 'order/queryProductNeedDistribut',
                    param: this.searchForm,
                    loading: 'dataLoading'
                }).then((function (d) {
                    let data = d.aaData;
                    data.forEach(function (el) {
                        el['totalQuantity'] = el.totalQuantity + el.skuMeaName;
                        el['totalSortingWeight'] = el.totalSortingWeight + el.skuMeaName;
                    });

                    var fields = ['productName', 'skuName', 'totalQuantity', 'totalSortingWeight'],
                        filedsName = ['商品名', "规格单位", "下单量", "分拣量"],
                        fileName = this.searchForm.distributionTimeBegin + '需配送商品汇总表';
                    this._exportExcel(data, fields, filedsName, fileName)
                }).bind(this))
            },
            reset() {
                this.searchForm.distributionTimeBegin = '';
                this.handleCurrentChange(1)
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
                float:left;
                font-size: 22px;
    }
        .addanniu {
            float:right;
    } }
        .toubu_A {
            height: 80px;
            padding: 10px;
            .tliel_name {
                float: left
    }
        .addanniu {
            float:right;
    } } }
</style>