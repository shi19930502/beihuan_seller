<template>
	<el-dialog custom-class="jz-modal" :title="channelModalType === 'add' ? '新增渠道' : '渠道编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="渠道编码" :prop="channelModalType === 'add' ? 'code' : ''">
                            <inputItem :value.sync="form.code" :disabled="channelModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="渠道名称" :prop="channelModalType !== 'add' ? '' : 'name'">
                            <inputItem :value.sync="form.name" :disabled="channelModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="父级渠道" prop="parentChannelCode">
                            <cascaderItem :options="channelList" @handleItemChange="handleItemChange" @change="channelChange" :value.sync="parentChannel"></cascaderItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否启用" prop="enabled">
                            <switchItem :value.sync="form.enabled"></switchItem>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否最末级" prop="isLastChannel">
                            <switchItem :value.sync="form.isLastChannel"></switchItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="备注" prop="comment">
                            <inputItem type="textarea" :autosize="true" :value.sync="form.comment"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>                         
            </el-form>              
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel">取消</elBtn>
                <elBtn @click="valideSubmit" type="primary">提交</elBtn>
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
				form: {
                    code: '',
                    name: '',
                    parentChannelCode: '',
                    enabled: 0,
                    isLastChannel: 0,
                    comment: '',
                },
                channelList: [],
                parentChannel: [],
                parentName: '',
                rules: {
                    code: [{required: true, message: '渠道编码不能为空' }, this._ruleLength(20), this._ruleExist(configs.rootAPI + 'channel/listByEntity', '渠道编码')],
                    name: [{required: true, message: '渠道名称不能为空' }, this._ruleLength(50), this._ruleExist(configs.rootAPI + 'channel/listByEntity', '渠道名称')],
                    comment: [this._ruleLength(200)]
                },
                flag: true
			}
		},
		props: {
			modal: {
				default: false
			},
            channelModalType: {
                default: 'add'
            },
            channel: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {  
            Object.assign(this.form, this.channel)           
            this._ajax({url: this.rootAPI, name: 'channel/listByParent', param: {parentChannelCode: '', filteEnabled: 1}})
            .then((function(d) {
                this.channelList = d.aaData      
            }).bind(this))
            .then((function() {
                if(this.form.parentChannelCode && this.form.parentChannelCode.length > 0) {
                    this._ajax({url: this.rootAPI, name: 'channel/queryParents', param: {parentChannelCode: this.form.parentChannelCode}})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            this.parentChannel = d.aaData
                        }                        
                    }).bind(this))
                }
            }).bind(this))
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'channel/update';
                        if(this.channelModalType === 'add') {  
                            method = 'channel/create'
                        }
                        if(this.form.parentChannelCode != '' && this.channelModalType === 'add') {
                            this._ajax({url: this.rootAPI, name: 'channel/listByEntity', param: {code: this.form.parentChannelCode}})
                            .then((function(d) {
                                if(d.aaData[0].isLastChannel !== 0) {
                                    this.$message({type: 'warning', message: '该父级渠道为最末级渠道'});
                                }else {
                                    Object.assign(o, this.form)
                                    this._ajax({url: this.rootAPI + method, param: o})
                                    .then((function(d) { 
                                        this.$message({ type: 'success', message: '操作成功' }); 
                                        this.$emit('submit')
                                    }).bind(this))
                                }
                            }).bind(this))
                        }else {
                            Object.assign(o, this.form)
                            if(this.channelModalType !== 'add') {
                                this._ajax({url: this.rootAPI, name: 'channel/listByParent', param: {code: o.code}})
                                .then((function(d) {
                                    if(d.aaData.length > 0) {
                                        this.queryChilds(d.aaData, o.parentChannelCode)
                                    }
                                    // 判断所选父级渠道是否为该渠道下子渠道以及自身
                                    if(this.flag) {
                                        // 判断是停用还是启用
                                        if(o.enabled) {
                                            // 停用,查询子级是否有未停用的
                                            this._ajax({url: this.rootAPI, name: 'channel/list2', param: {parentChannelCode: o.code, enabled: 0}})
                                            .then((function(d) {
                                                if(d.aaData.length > 0) {
                                                    this.$message({type: 'warning', message: '不能停用,该渠道下有子渠道未停用'});
                                                }else {
                                                    this.submit(method, o)
                                                }
                                            }).bind(this))
                                        }else {
                                            // 启用,查询父级是否有停用的
                                            if(o.parentChannelCode.length > 0) {
                                                this._ajax({url: this.rootAPI, name: 'channel/list2', param: {code: o.parentChannelCode, enabled: 1}})
                                                .then((function(d) {
                                                    if(d.aaData.length > 0) {
                                                        this.$message({type: 'warning', message: '不能启用,该渠道的上级渠道未启用'});
                                                    }else {
                                                        this.submit(method, o)
                                                    }
                                                }).bind(this))
                                            }else {
                                                this.submit(method, o)
                                            }
                                        }
                                    }else {
                                        this.$message({type: 'warning', message: '不能选取子渠道或者自身作为该渠道的父级渠道'});
                                        this.flag = true
                                    }
                                }).bind(this))
                            }else {
                                this.submit(method, o)
                            } 
                        }                      
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            channelChange(val) {
                if(val.length > 0) {
                    Object.assign(this.form, {parentChannelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.form, {parentChannelCode: ''})
                }
            },
            queryChilds(childlist, parentcode) {
                for(var i = 0, l = childlist.length; i < l; i++) {
                    var el = childlist[i]
                    if(parentcode === el.code) {
                        this.flag = false   
                        return                                         
                    }else if(el.childs !== null && el.childs > 0) {
                        this.queryChilds(el.childChannel, parentcode)
                    }
                }
            },
            submit(method, o) {
                // 判断是否设为最末级





                this._ajax({url: this.rootAPI + method, param: o})
                .then((function(d) { 
                    this.$message({ type: 'success', message: '操作成功' }); 
                    this.$emit('submit')
                }).bind(this))
            }
		}
	}
</script>