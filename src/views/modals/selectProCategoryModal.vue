<template>
    <el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose"
               :close-on-click-modal="false" :width="modalWidth">
        <searchInputItems>
            <searchInputItem name='商品关键字'>
                <inputItem :value.sync="searchForm.keyWord" @enter="searchTable" placeHolder="请输入商品关键字"></inputItem>
            </searchInputItem>
        </searchInputItems>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="商品名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.name">
                        <span>{{scope.row.name}}</span>
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
            <el-table-column prop="skuPrice" label="售价（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.skuPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="skuMeasure" label="计量单位">
                <template slot-scope="scope">
                    <toolTip :content="renderCommon(measuremethodList, scope.row.skuMeasure)">
                        <span>{{renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
                    </toolTip>
                </template>
            </el-table-column>
        </elemTable>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">取消</elBtn>
            <elBtn type="primary" @click="submit">确认选择</elBtn>
        </div>
    </el-dialog>
</template>
<script>
    import mixin from '../../mixin/mixin.js'

    export default {
        mixins: [mixin],
        data() {
            return {
                dateRange:[],
                rowOBJ: {},
                activeName: '1',
                tabList:[],
                measuremethodList:[],
                dataList: [],
                currentRow: null,
                modalWidth: '70%',
                searchForm: {
                    keyWord : '',
                    published: 1
                },
            }
        },
        props: {
            modal: {
                default: false
            },
            title: {
                default: '选择商品'
            },
            params: {
                default: function () {
                    return {}
                }
            },
            parentDataList:{
                default: function () {
                    return []
                }
            }
        },
        mounted() {
            this._ajax({url: this.rootAPI, name: 'measuremethod/list', param: {}})
                .then((function(d) {
                    this.measuremethodList = d.aaData;
                }).bind(this));
            this._searchDic('PRODUCT_STATUS')
                .then((function(d) {
                    this.dicEnabled = this._dicKey(d);
                    let temp = this.tabList;
                    $.each(this.dicEnabled, function(i, obj) {
                        temp.push({'key' : this.key + '', 'value' : this.value});
                    });
                    this.tabList = temp;
                }).bind(this))
                .then(this.searchTable)
        },
        methods: {
            renderCommon(dataList, code) {
                let dataShow = '';
                $.each(dataList, function(i, obj) {
                    if(obj.code == code) {
                        dataShow = obj.name;
                    }
                });
                return dataShow;
            },
            searchTable() {
                Object.assign(this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                });
                return this._ajax({
                    name: 'product/queryDtoList',
                    param: this.searchForm,
                    loading: 'dataLoading'
                }).then((d) => {
                        let deleted = [];
                        let j = 0;
                        for (j = 0; j < d.aaData.length; j++) {
                            let i = 0;
                            for (i = 0; i < this.parentDataList.length; i++) {
                                if (this.parentDataList[i].productName === d.aaData[j].name && this.parentDataList[i].skuName === d.aaData[j].skuName) {
                                    deleted.push(j);
                                }
                            }
                        }
                        for (j = deleted.length - 1; j >= 0; j--) {
                            d.aaData.splice(deleted[j], 1);
                        }
                        this.renderTable(d);
                        this.pageTotal = d.dataCount;
                    }
                )
            },
            cancel() {
                this.$emit('close')
            },
            beforeClose(done) {
                this.cancel();
                done()
            },
            selectChange(val) {
                this.currentRow = val
            },
            submit() {
                if (this.rowSelection.length > 0) {
                    this.$emit('submit', this.rowSelection)
                } else {
                    this.$message({type: 'warning', message: '请选择商品'});
                }
            }
        }
    }
</script>