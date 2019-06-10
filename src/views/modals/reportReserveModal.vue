<template>
    <div>
        <el-dialog custom-class="jz-modal order-item-modal" title="订阅时间" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="75%">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="开始时间" prop="startDate">
                            <dateEditorDaterange :dateValue.sync="form.startDate" type="date" :pickerOptions="pickerOptions" :dateClearable="false"></dateEditorDaterange>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="订阅周期" prop="reserveDays">
                            <el-input-number v-model="form.reserveDays" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                    </el-col>               
                </el-row>
            </el-form>      
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="validSubmit" type="primary">提交</elBtn>                
                <elBtn @click="cancel">取消</elBtn>
            </div>
        </el-dialog>
    </div>	
</template>
<script>
import mixin from '../../mixin/mixin.js'
import configs from '../../configs.js'
import local from './../../local.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                typeCode: '',
                form: {
                    startDate: new Date(),
                    reserveDays: 30
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < (Date.now() - 24*60*60*1000);
                    },
                },
                rules: {
                    startDate: [{required: true, message: '开始日期不能为空' }],
                },
                reserveId: null
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
            },
            type: {
               default: 'add' 
            }
		},
		mounted() {
            var sessionUser = local.get('sessionUser'), typeId = '', moduleId = null
            if(sessionUser) {
                this.typeCode = sessionUser.typeCode
            }
            if(this.type === 'edit') {
                console.log(this.params)
                moduleId = this.params.key
            }
            this._ajax({ name: 'reportReserve/list', param: {
                customerId: this.typeCode,
                moduleId: moduleId
            }})
            .then((function(d) {
                var data = d.aaData[0]
                this.reserveId = data.id
                Object.assign(this.form, {
                    startDate: data.startDate.split(' ')[0],
                    reserveDays: data.reserveDays
                })
            }).bind(this))
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },           
            validSubmit() {                
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        if(this.type === 'add') {
                            this._ajax({ name: 'reportReserve/create', param: {
                                customerId: this.typeCode,
                                moduleId: this.params.key,
                                moduleName: this.params.comment,
                                startDate: this._dateFormat({
                                    date: this.form.startDate,
                                    type: 'YYYY-MM-DD'
                                }),
                                reserveDays: this.form.reserveDays,
                                moduleValue: this.params.value
                            }})  
                            .then((function(d) {
                                console.log(d)
                                if(d.state == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '操作成功'
                                    });
                                }
                                this.$emit('submit')
                            }).bind(this))
                        } 
                        if(this.type === 'edit') {
                            this._ajax({ name: 'reportReserve/update', param: {
                                id: this.reserveId,
                                customerId: this.typeCode,
                                moduleId: this.params.key,
                                startDate: this.form.startDate,
                                reserveDays: this.form.reserveDays,
                            }})  
                            .then((function(d) {
                                if(d.state == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '操作成功'
                                    });
                                }
                                this.$emit('submit')
                            }).bind(this))
                        }                               
                    }
                })
            }, 
		}
	}
</script>