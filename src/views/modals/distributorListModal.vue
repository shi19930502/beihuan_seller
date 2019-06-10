<template>
	<el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <searchInputItem name="客户名称">
            <inputItem :value.sync="form.name" @enter="searchTable" ref="nickNameInput" @keyUp="searchTable"></inputItem>
        </searchInputItem>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight" :highlightCurrentRow="true" @selectChange="selectChange">
            <el-table-column prop="name" label="客户名称">
                <template slot-scope="scope">
                    <div>{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="联系方式">
                <template slot-scope="scope">
                    <div>{{scope.row.tel}}</div>
                </template>
            </el-table-column>
        </elemTable>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">取消</elBtn>
            <elBtn type="primary" @click="submit" v-if="!loading">确认配货商</elBtn>
            <elBtn type="primary" v-if="loading" iconClass="el-icon-loading"></elBtn>
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
                    isDistribution: 1,
                    enabled: 1
                },
                order: {},
                currentRow: null,
                loading: false
			}
		},
		props: {
			modal: {
				default: false
			},
            title: {
                default: ''
            },
            params: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {
            Object.assign(this.order, this.params) 
            this.searchTable()
		},
		methods: {
            searchTable() {
                this._ajax({name: 'customer/queryPageByChannelCode', param: this.form, loading: 'modalDataLoading'})
                    .then(this.renderTable)
                    .then((function() {
                        this.$refs.nickNameInput.$children[0].focus()
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
                if(this.currentRow) {
                    Object.assign(this.order, {
                        distribute: 1,
                        distributorId: this.currentRow.id,
                        // orderStatusId: '4'
                    })            
                    this._updateOrder(this.order, 'loading')
                        .then((function(d) {
                            if(d.state === 0) {
                                this.$emit('submit')
                                this.$message({type: 'success', message: '操作完成'})
                            }else {
                                this.$message({type: 'warning', message: d.msg})
                            }                        
                        }).bind(this))
                }else {
                    this.$message({type: 'warning', message: '请单击选择行'})
                }
            }           
		}
	}
</script>