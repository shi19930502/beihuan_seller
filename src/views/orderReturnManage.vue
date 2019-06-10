<template>
    <div><br/>
        <!-- 查询条件 -->
        <searchInputItems>
            <searchInputItem name='退货单号'>
                <inputItem :value.sync="searchForm.refundsNumber" @enter="searchTable" placeHolder="请输入批次号"></inputItem>
            </searchInputItem>
            <searchInputItem name='订单号'>
                <inputItem :value.sync="searchForm.orderNumber" @enter="searchTable" placeHolder="请输入车牌号"></inputItem>
            </searchInputItem>
            <searchInputItem name="买方名称" v-if="!isChannel">
                <inputItem :value.sync="searchForm.buyerName" @enter="searchTable" placeHolder="请输入车牌号"></inputItem>
            </searchInputItem>
            <searchInputItem name="退换货类型">
                <selectInput :value.sync="searchForm.refundsType" @selectChange="searchTable" :clearable="true">
                    <el-option v-for="item in dataDic.refundsTypeList" :key="item.key" :label="item.value" :value="item.key">
                    </el-option>
                </selectInput>
            </searchInputItem>
            <searchInputItem name="退换货处理方式">
                <selectInput :value.sync="searchForm.optionType" @selectChange="searchTable" :clearable="true">
                    <el-option v-for="item in dataDic.refundsOptionTypeList" :key="item.key" :label="item.value" :value="item.key">
                    </el-option>
                </selectInput>
            </searchInputItem>
            <searchInputItem name="创建时间">
                <dateEditorDaterange :dateValue.sync='dateRange'></dateeditordaterange>
            </searchInputItem>
        </searchInputItems>
        <!-- 操作按钮 -->
        <optionItems>
            <template slot="left">
                <el-button-group>
                    <iconBtn iconClass="el-icon-plus" content="新增" @click="modalAdd" type="success">新增</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
                </el-button-group>
            </template>
        </optionItems>

        <!-- 表格 -->
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="refundsNumber" label="退换货单号">
                <template slot-scope="scope">
                    <span>{{scope.row.refundsNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="orderNumber" label="订单号">
                <template slot-scope="scope">
                    <span>{{scope.row.orderNumber}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="buyerName" label="买方名称">
                <template slot-scope="scope">
                    <span>{{scope.row.buyerName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="refundsName" label="退换货类型">
                <template slot-scope="scope">
                    <span>{{scope.row.refundsName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="optionName" label="退换货处理方式">
                <template slot-scope="scope">
                    <span>{{scope.row.optionName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdDate" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createdDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                    <el-button-group>
                    	<elBtn type="info" @click="view(scope.row)" v-if="scope.row.refundsStatus == 1">查看</elBtn>
                    	<elBtn type="success" @click="submitData(scope.row)" v-if="scope.row.refundsStatus == 0">确认提交</elBtn>
                        <elBtn type="info" @click="edit(scope.row)" v-if="scope.row.refundsStatus == 0">编辑</elBtn>
                        <elBtn type="danger" @click="deleteRow(scope.row)" v-if="scope.row.refundsStatus == 0">删除</elBtn>
                    </el-button-group>
                </template>
            </el-table-column>
        </elemTable>
        <orderReturnModal :modal="modalShow" :orderReturnModal='modalType' :dataDic='dataDic' :extendModalType='extendType' v-if="modalShow" @submit="modalSubmit"
                             @close='modalClose' :tableRow='tableRow'></orderReturnModal>
    </div>
</template>
<script>
    import local from '../local.js'
    import mixin from '../mixin/mixin.js' // 公共方法，包括主要的ajax
    import orderReturnModal from './modals/orderReturnModal.vue'

    export default {
        mixins: [mixin],
        components: {
            orderReturnModal
        },
        data() {
            return {
                searchForm: {
                	refundsNumber : '',
                	orderNumber : '',
                	buyerName : '',
                	refundsType : '',
                	optionType : '',
                	startTime: '',
                    endTime: '',
                    customerId: local.get('sessionUser').typeCode,
                },
                dataDic: {
                    refundsTypeList: [],
                    refundsOptionTypeList: [],
                },
                dateRange: [],
                dataList: [],
                orderReturnModal: false,
            }
        },
        mounted() {
            this.getInitData();
            this.searchTable();
        },
        methods: {
            getInitData() {
                this._searchDic('REFUNDS_TYPE')
				.then((function(d) {
					this.dataDic.refundsTypeList = d.aaData
				}).bind(this))
				this._searchDic('REFUNDS_OPTION_TYPE')
				.then((function(d) {
					this.dataDic.refundsOptionTypeList = d.aaData
				}).bind(this))
            },
            searchTable() {
                var param = Object.assign({}, this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                })
                if(this.dateRange && this.dateRange.length > 0) {
                	Object.assign(param, this.searchForm, {
	                    startTime: this.dateRange[0],
	                    endTime: this.dateRange[1] + " 23:59:59"
	                })
                }
                return this._ajax({
                    url: this.rootAPI,
                    name: 'refunds/list',
                    param: param,
                    loading: 'dataLoading'
                }).then(this.renderTable)
            },
            reset() {
                this.inDate = [];
                Object.assign(this.searchForm, {
                    refundsNumber : '',
                	orderNumber : '',
                	buyerName : '',
                	refundsType : '',
                	optionType : '',
                    startTime: '',
                    endTime: '',
                })
                this.handleCurrentChange(1)
                this.channelName = []
            },
            deleteRow(row) {
                this.confirm('确定删除？', (function () {
                    this._ajax({
                        url: this.rootAPI + 'refunds/deleteRefundsAndDetails',
                        param: {'refundsId':row.id},
                    }).then((function (d) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.handleCurrentChange(1)
                    }).bind(this))
                }).bind(this))
            },
            edit(row) {
                this.tableRow = row;
                this.modalEdit();
            },
            modalAdd() {
                 this.extendType = "add";
                this.modalShow = true
            },
            view(row) {
            	this.tableRow = row;
                this.extendType = "view";
                this.modalEdit();
            },
            modalClose() {
            	this.modalShow = false;
            	this.searchTable();
            	this.tableRow = {}
            },
            submitData(row) {
            	this._ajax({
	                url: this.rootAPI + 'refunds/SubmitRefunds',
	                param: {
	                	id:row.id,
	                	refundsStatus : 1,
	                },
	            }).then((function (d) {
	                this.$message({
	                    type: 'success',
	                    message: '操作成功'
	                });
	                this.handleCurrentChange(1)
	            }).bind(this))
            }
        }
    }
</script>