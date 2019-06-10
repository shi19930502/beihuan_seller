<template>
    <div>
        <searchInputItems>
            <searchInputItem name="车牌号">
                <inputItem :value.sync="searchForm.vehicleNum"></inputItem>
            </searchInputItem>
            <searchInputItem name="司机姓名">
                <inputItem :value.sync="searchForm.driverName"></inputItem>
            </searchInputItem>
            <searchInputItem name="事故编码">
                <inputItem :value.sync="searchForm.code"></inputItem>
            </searchInputItem>
        </searchInputItems>
        <optionItems>
            <template slot="right">
                <el-button-group>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                    <iconBtn iconClass="el-icon-plus" content="新增" @click="addTable" type="success">新增</iconBtn>
                    <iconBtn iconClass="el-icon-minus" content="批量删除" @click="deleteTable" type="danger">批量删除</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    <!-- <iconBtn iconClass="el-icon-plus" content="测试" @click="testclick" type="success">测试</iconBtn> -->
                </el-button-group>
            </template>
        </optionItems>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
            <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
            <el-table-column prop="code" label="事故编码">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.code">
                        <div>{{scope.row.code}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="driverName" label="驾驶员">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.driverName">
                        <div>{{scope.row.driverName}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="vehicleNum" label="车牌号">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.vehicleNum">
                        <div>{{scope.row.vehicleNum}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="accidentAddress" label="事故地点">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.accidentAddress">
                        <div>{{scope.row.accidentAddress}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="accidentDate" label="事故时间">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.accidentDate">
                        <span>{{scope.row.accidentDate}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="describe" label="事故描述">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.describe">
                        <span>{{scope.row.describe}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="lossAmount" label="事故损失金额(元)">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.lossAmount">
                        <span>{{scope.row.lossAmount}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="lossDate" label="损失挂账日期">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.lossDate">
                        <span>{{scope.row.lossDate}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.status">
                        <el-tag type="success" v-if="scope.row.status==1">已提交</el-tag>
                        <el-tag type="danger" v-else>草稿</el-tag>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <iconBtn content="确认受理" v-if="scope.row.status==0" type="primary" plain
                             @click="submit(scope.row)">提交
                    </iconBtn>
                    <iconBtn iconClass="el-icon-minus" v-if="scope.row.status==0" content="删除"
                             @click="delRow(scope.row)"></iconBtn>
                    <iconBtn iconClass="el-icon-edit" v-if="scope.row.status==0" content="编辑"
                             @click="lookOver(scope.row)"></iconBtn>
                </template>
            </el-table-column>
        </elemTable>
        <distributionAcciModal :modal='showModal' :ModalType="modalType" @add='modalAdd'
                               v-if='showModal'
                               @close='ModalClose' :tableRow='tableRow'></distributionAcciModal>
    </div>
</template>
<script>
    import local from "../local.js";
    import mixin from "../mixin/mixin.js";
    import distributionAcciModal from "./modals/distributionAcciModal.vue";

    export default {
        mixins: [mixin],
        components: {
            distributionAcciModal
        },
        data() {
            return {
                dataList: [],
                searchForm: {
                    vehicleNum: "",
                    driverName: ""
                },
                showModal: false,
                modalType: ""
            };
        },
        mounted() {
            this.searchTable();
        },
        methods: {
            searchTable() {
                let user = local.get('sessionUser');
                /**customerid  需要从缓存中获取 */
                this.searchForm.customerId = parseInt(user.typeCode);
                Object.assign(this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                });
                return this._ajax({
                    url: this.distributeAPI + "accident/listByCusId",
                    name: "",
                    param: this.searchForm,
                    loading: "dataLoading"
                }).then(this.renderTable);
            },
            addTable() {
                this.modalType = "add";
                this.tableRow = {};
                this.showModal = true;
            },
            deleteTable() {
                if (this.delSelection.length === 0) {
                    this.$message({type: "info", message: "请选择行"});
                } else {
                    let selection = this.delSelection;
                    var arr = [],
                        o = {};
                    selection.forEach(function (el) {
                        arr.push(el.id);
                    });
                    o.id = arr;
                    this.delSubmit(o);
                }
            },
            reset() {
                this.searchForm.vehicleNum = "";
                this.searchForm.driverName = "";
                this.searchForm.code = "";
                this.searchTable()
            },
            delRow(row) {
                var o = {
                    id: [row.id]
                };
                this.delSubmit(o);
            },
            lookOver(o) {
                this.tableRow = o;
                this.modalType = "edit";
                this.showModal = true;
            },
            submit(o) {
                var sf=this;
                this.confirm(
                    "确定提交？",
                    function () {
                        o.status = 1;
                        sf.modalAdd(o);
                    }.bind(this)
                );
            },
            modalAdd(o) {
                var sf = this;
                var addOrupdate = o.id > 0 ? "accident/update" : "accident/create";

                this._ajax({
                    url: this.distributeAPI + addOrupdate,
                    param: o,
                    arr: true
                })
                    .then(
                        function (d) {
                            if (d.state == 0) {
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                                sf.showModal = false;
                            } else {
                                this.$message({
                                    type: "failure",
                                    message: d.msg
                                });
                            }
                            //this.$emit("submit");
                        }.bind(this)
                    )
                    .then(this.searchTable);
            },
            ModalClose() {
                this.showModal = false;
            },
            delSubmit(o) {
                this.confirm(
                    "确定删除？",
                    function () {
                        this._ajax({
                            url: this.distributeAPI + "accident/delete",
                            param: o,
                            arr: true
                        }).then(
                            function (d) {
                                if (d.state == 0) {
                                    this.$message({type: "success", message: "删除成功"});
                                } else {
                                    this.$message({type: "warning", message: "删除失败：" + d.msg});
                                }

                                this.handleCurrentChange(1);
                            }.bind(this)
                        );
                    }.bind(this)
                );
            },
            testclick() {
                return this._ajax({
                    url: this.rootAPI,
                    name: "sorSorter/test",
                    param: {},
                    loading: "dataLoading"
                }).then(d => {

                });
            },
            selectable(row, index) {
                return row.status !== 1;
            }
        }
    };
</script>