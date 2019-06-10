<template>
	<el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <searchInputItem name="供应商名称">
            <inputItem :value.sync="form.name" @enter="searchTable" ref="nameInput" @keyUp="searchTable"></inputItem>
        </searchInputItem>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :maxHeight="modalMaxTableHeight" :highlightCurrentRow="true" @selectChange="selectChange">
            <el-table-column prop="name" label="供应商名称">
                <template slot-scope="scope">
                    <div>{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="companyName" label="公司名称">
                <template slot-scope="scope">
                    <div>{{scope.row.companyName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址">
                <template slot-scope="scope">
                    <div>{{scope.row.address}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="联系电话">
                <template slot-scope="scope">
                    <div>{{scope.row.tel}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                    <div>{{scope.row.remark}}</div>
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
import configs from '../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                dataList: [],
                form: {
                    name: '',
                    enabled: 1
                },
                currentRow: null,
                modalWidth: '70%'
			}
		},
		props: {
			modal: {
				default: false
			},
            title: {
                default: '选择供应商'
            },
            params: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {
            this.searchTable()
		},
		methods: {
            searchTable() {
                Object.assign(this.form, {
                    pageNum: this.pageNum, 
                    pageSize: this.pageSize,
                })
                this._ajax({name: 'supplier/list', param: this.form, loading: 'modalDataLoading'})
                    .then(this.renderTable)
                    .then((function() {
                        this.$refs.nameInput.$children[0].focus()
                    }).bind(this))
            },
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            selectChange(val) {
                this.currentRow = val
            },
            submit() {
                this.$emit('submit', this.currentRow)
            }           
		}
	}
</script>