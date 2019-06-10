<template>
    <div>
        <searchInputItems>
            <searchInputItem name="客户名称">
                <inputItem :value.sync="searchForm.name"></inputItem>
            </searchInputItem>
            <searchInputItem name="自定义名称">
                <inputItem :value.sync="searchForm.customizedName"></inputItem>
            </searchInputItem>
            <searchInputItem name="法人代表/联系人">
                <inputItem :value.sync="searchForm.legalpepresent"></inputItem>
            </searchInputItem>
            <searchInputItem name="联系电话">
                <inputItem :value.sync="searchForm.tel"></inputItem>
            </searchInputItem>
        </searchInputItems>
        <optionItems>
            <template slot="right">
                <el-button-group>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                </el-button-group>
            </template>
        </optionItems>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="客户名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.name">
                        <div>{{scope.row.name}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="customizedName" label="自定义名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.customizedName">
                        <div>{{scope.row.customizedName}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="legalpepresent" label="法人代表/联系人">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.legalpepresent">
                        <span>{{scope.row.legalpepresent}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="联系电话">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.tel">
                        <span>{{scope.row.tel}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
                </template>
            </el-table-column>
        </elemTable>
        <deliveryUnitModal :modal='showModal' :ModalType="modalType" @add='modalAdd' v-if='showModal'
                           @close='ModalClose' :tableRow='tableRow'></deliveryUnitModal>
    </div>
</template>
<script>
    import local from "../local.js";
    import mixin from "../mixin/mixin.js";
    import deliveryUnitModal from "./modals/deliveryUnitModal.vue";

    export default {
        mixins: [mixin],
        components: {
            deliveryUnitModal
        },
        data() {
            return {
                dataList: [],
                searchForm: {
                    name: "",
                    customizedName: "",
                    legalpepresent: "",
                    tel: ""
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
                    url: this.distributeAPI + "unit/list",
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
            reset() {
                this.searchForm.name = "";
                this.searchForm.customizedName = "";
                this.searchForm.legalpepresent = "";
                this.searchForm.tel = "";
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
            modalAdd(o) {
                var sf = this;
                var addOrupdate = o.id > 0 ? "unit/update" : "unit/create";
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
            }
        }
    };
</script>