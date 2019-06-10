<template>
	<el-dialog custom-class="jz-modal order-refuse-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="订单号" class="row-block">
                        <inputItem :value.sync="form.orderUmber" :disabled="true" type="textarea"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item :label="label" class="row-block" prop="cancelReason">
                        <inputItem :value.sync="form.cancelReason" type="textarea"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">取消</elBtn>
            <elBtn type="primary" @click="submit" v-if="params.state == '6'">确认拒绝</elBtn>
            <elBtn type="primary" @click="submit" v-if="params.state == '7'">确认取消</elBtn>
        </div>
    </el-dialog>
</template>
<script>
import mixin from '../../mixin/mixin.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                form: {
                    orderUmber: '',
                    cancelReason: ''
                },
                rules: {
                    cancelReason: [{required: true, message: '请填写原因' }, this._ruleLength(200)]
                },
                title: '',
                label: ''
			}
		},
		props: {
			modal: {
				default: false
			},
            params: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {
            if(this.params.state == '6') {
                this.title = '拒绝原因'
                this.label = '拒绝原因'
                this.msg = '请填写拒绝原因'
            }
            if(this.params.state == '7') {
                this.title = '取消原因'
                this.label = '取消原因'
                this.msg = '请填写取消原因'
            }
            Object.assign(this.form, {
                orderUmber: this.params.orderUmber
            })
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        Object.assign(this.form, {
                            orderStatusId: this.params.state,
                            id: this.params.id
                        })
                        this._updateOrder(this.form)
                        .then((function(d) {
                            if(d.state === 0) {
                                this.$message({type: 'success', message: '操作完成'})
                            }
                            this.$emit('submit')                            
                        }).bind(this))
                    }
                })
            }           
		}
	}
</script>
<style lang="sass">
    .order-refuse-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 100px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
</style>