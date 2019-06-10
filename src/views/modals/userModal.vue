<template>
	<el-dialog custom-class="jz-modal user-modal" :title="modalTitle" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="用户名称" prop="nickName" v-if="userModalType === 'add'">
                            <inputItem :value.sync="form.nickName"></inputItem>
                        </el-form-item>
                        <el-form-item label="用户名称" v-else>
                            <span>{{form.nickName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="登录帐号" prop="loginName" v-if="userModalType === 'add'">
                            <inputItem :value.sync="form.loginName"></inputItem>
                        </el-form-item>
                        <el-form-item label="登录帐号" v-else>
                            <span>{{form.loginName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="密码" prop="password" v-if="userModalType === 'add'">
                            <inputItem :value.sync="form.password" type="password"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="确认密码" prop="cfmPassword" v-if="userModalType === 'add'">
                            <inputItem :value.sync="form.cfmPassword" type="password"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="手机号码" prop="mobile" v-if="userModalType === 'add' || userModalType === 'edit'">
                            <inputItem :value.sync="form.mobile"></inputItem>
                        </el-form-item>
                        <el-form-item label="手机号码" v-else>
                            <span>{{form.mobile}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="身份证" prop="identityCard" v-if="userModalType === 'add' || userModalType === 'edit'">
                            <inputItem :value.sync="form.identityCard"></inputItem>
                        </el-form-item>
                        <el-form-item label="身份证" v-else>
                            <span>{{form.identityCard}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否激活" prop="status" v-if="userModalType === 'add' || isLogin">
                            <switchItem :value.sync="form.status" :activeValue="1" :inactiveValue="0"></switchItem>
                        </el-form-item>
                        <el-form-item label="是否激活" prop="status" v-else>
                            <switchItem :value.sync="form.status" :activeValue="1" :inactiveValue="0" :disabled="true"></switchItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="登录时间" prop="allowTime" class="row-block">
                            <div class="flex-x-start" v-if="(userModalType === 'add' || userModalType === 'edit') && isMainUser()">
                                <timeSelectItem :startTime.sync="form.allowTimeStart" :endTime.sync="form.allowTimeEnd" 
                                                :start="distributionStart" :end="distributionEnd" step='00:15'></timeSelectItem>
                            </div> 
                            <div class="flex-x-start" v-if="userModalType === 'check'">
                                {{form.allowTimeStart}} - {{form.allowTimeEnd}}
                            </div>                       
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="角色绑定" class="user-role-list" v-if="userModalType === 'add' || userModalType === 'edit'">
                            <el-checkbox-group v-model="form.roleList">
                                <el-checkbox :label="el.id" v-for="el in roleList">{{el.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="角色绑定" class="user-role-list" v-else>
                            <el-checkbox-group v-model="form.roleList">
                                <el-checkbox :label="el.id" v-for="el in roleList" disabled>{{el.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>                          
            </el-form>              
            <div slot="footer" class="dialog-footer flex-x-end" v-if="userModalType === 'add' || userModalType === 'edit'">
                <elBtn @click="cancel">取消</elBtn>
                <elBtn @click="submit" type="primary">提交</elBtn>
            </div>
        </el-dialog>
</template>
<script>
	import local from '../../local.js'
import mixin from '../../mixin/mixin.js'
	export default {
        mixins: [mixin],
		data() {
            var vm = this
            var ruleCfmPassword = function(rule, value, callback) {
                if(value !== vm.form.password) {
                    callback(new Error('密码不一致'))
                }else {
                    callback();
                }
            }
			return {
                value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				form: {
                    nickName: '',
                    loginName: '',
                    password: '',
                    cfmPassword: '',
                    mobile: '',
                    identityCard: '',
                    roleList: [],
                    status: 1,
                    userId:'',
                    allowTimeStart: '',
                    allowTimeEnd: ''
                },
                thisUser : local.get('userinfo'),
                roleList: [],
                rules: {
                    nickName: [{required: true, message: '用户名不能为空' }, this._ruleLength(16)],
                    loginName: [{required: true, message: '登录名不能为空' }, this._ruleLength(20), this._ruleLoginName()],
                    password: [{required: true, message: '密码不能为空' }, this._rulePassword()],
                    cfmPassword: [{required: true, message: '密码不能为空' },{ validator: ruleCfmPassword, trigger: 'blur' }],
                    mobile: [this._ruleMobile()],
                    identityCard: [this._ruleIDCard()]
                },
                distributionStart: '00:00',
                distributionEnd: '24:00',
                modalTitle: '',
                isLogin:true
			}
		},
		props: {
			modal: {
				default: false
			},
            userModalType: {
                default: 'add'
            },
            user: {
                default: function() {
                    return {}
                }
            }
		},
        computed: {
            userID() {
                console.log(this.userId)
                return this.userId
            }
        },
		mounted() {
            if(this.userModalType === 'add') {
                this.modalTitle = '新增用户'
            }
            if(this.userModalType === 'edit') {
                this.modalTitle = '用户编辑'
            }
            if(this.userModalType === 'check') {
                this.modalTitle = '查看用户'
            }
            console.log(999,this.user)
            Object.assign(this.form, this.user);
            var vm = this ;
            if(this.form.userId == this.thisUser.userId && this.userModalType === 'edit'){
				vm.isLogin = false;
			}else if(this.userModalType === 'check'){
				vm.isLogin = false;
			}
            this._ajax({url: this.api + '/permission/tsysRole/list', param: {statu: 1}})
            .then((function(d) {
                this.roleList = d.aaData           
            }).bind(this))
            .then((function() {
                if(this.userModalType !== 'add') {
                    this._ajax({url: this.api + '/permission/tsysRoleUser/getRolesByUserId', param: {userId: this.user.userId}})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            var arr = []
                            d.aaData.forEach(function(el) {
                                arr.push(el.id)
                            })
                            Object.assign(this.form, {roleList: arr})
                        }
                    }).bind(this))
                }                
            }).bind(this))          
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'user/update';
                        if(this.userModalType === 'add') {  
                            method = 'user/create' 
                            o = {
                                nickName: this.form.nickName,
                                loginName: this.form.loginName,
                                mobile: this.form.mobile,
                                identityCard: this.form.identityCard,
                                password: this.form.password,
                                status: 1,
                            }
                        }else {
                            o = {
                                mobile: this.form.mobile,
                                identityCard: this.form.identityCard,
                                userId: this.form.userId,
                                status: this.form.status
                            }
                        }
                        if(this.isMainUser()) {
                            Object.assign(o, {
                                allowTimeStart: this.form.allowTimeStart + ':00',
                                allowTimeEnd: this.form.allowTimeEnd + ':00'
                            })
                        }
                        this._ajax({url: this.userAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		let userID;
	                            if(this.userModalType === 'add') {  
	                                userID = d.aaData.userId
	                            }else {
	                                userID = this.form.userId
	                            }
	                            if(this.form.roleList.length > 0) {
	                                let arr = []
	                                for(let i = 0, l = this.form.roleList.length; i < l; i++) {
	                                    arr.push(this.form.roleList[i])
	                                }
	                                this._ajax({url: this.api + '/permission/tsysRoleUser/binDing', param: {roleId: arr, userId: userID}, arr: true})
	                                .then((function(d) { 
			                            this.$message({ type: 'success', message: '操作成功' }); 
			                            this.$emit('submit')
			                        }).bind(this))
	                            }else {
	                                this._ajax({url: this.api + '/permission/tsysRoleUser/binDing', param: {userId: userID}, arr: true})
	                                .then((function(d) { 
			                            this.$message({ type: 'success', message: '操作成功' }); 
			                            this.$emit('submit')
			                        }).bind(this))
	                            }
                        	} else {
                        		this.$message({ type: 'warning', message: '操作失败：'+d.msg }); 
                        	}
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            isMainUser() {
                return local.get('extend') === 'main'
            }
		}
	}
</script>
<style lang="sass">
    .user-modal{
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