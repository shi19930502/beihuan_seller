<template>
	<el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <searchInputItem name="商品名称">
            <inputItem :value.sync="form.name" @enter="searchTable" ref="nameInput" @keyUp="searchTable"></inputItem>
        </searchInputItem>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :maxHeight="modalMaxTableHeight"  @selectChange="selectChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="商品名称">
                <template slot-scope="scope">
                    <div>{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称">
                <template slot-scope="scope">
                    <div>{{scope.row.skuName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="stockQuantityForDecimal" label="库存">
                <template slot-scope="scope">
                    <div v-if="scope.row.stockQuantityForDecimal">{{scope.row.stockQuantityForDecimal}}{{scope.row.measureMethodName}}</div>
                    <div v-else>无</div>
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
import local from './../../local.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                dataList: [],
                form: {
                    name: '',
                    published: 1,
                    customerId: '',
                    deleted: 0,
                    psCustomerId: '',
                    stockLimit: ''
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
                default: '选择商品'
            },
            params: {
                default: function() {
                    return {}
                }
            },
            type: {
                default: 'in'
            }
		},
		mounted() {
            var user = local.get('sessionUser'), psCustomerId = ''
            if(user) {
                if(this.type === 'out') {
                    psCustomerId = parseInt(user.typeCode);
                    Object.assign(this.form, {psCustomerId})
                }
                // if(this.type === 'out' || this.type === 'in') {
                //     Object.assign(this.form, {stockLimit: '1'})
                // }               
                this.searchTable()
            }
		},
		methods: {
            searchTable() {
                Object.assign(this.form, {
                    pageNum: this.pageNum, 
                    pageSize: this.pageSize,
                })
                this._ajax({name: 'product/list', param: this.form, loading: 'modalDataLoading'})
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
            submit() {
                if(this.rowSelection.length > 0) {
                    this.$emit('submit', this.rowSelection)
                }else {
                    this.$message({type: 'warning', message: '请选择商品'});
                }                
            },       
		}
	}
</script>