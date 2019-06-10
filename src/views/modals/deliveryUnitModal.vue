<template>
    <el-dialog custom-class="jz-modal" title="查看往来单位" :visible="modal"
               :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules"
                 label-width="100px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="客户名称" prop="name">
                        <inputItem :value.sync="form.name" disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="地址" prop="address">
                        <inputItem :value.sync="form.address" disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="身份证号/营业执照号" prop="regId">
                        <inputItem :value.sync="form.regId" disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="法人代表/联系人" prop="legalpepresent">
                        <inputItem :value.sync="form.legalpepresent" disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="联系电话" prop="tel">
                        <inputItem :value.sync="form.tel" disabled="true"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="自定义名称" prop="customizedName">
                        <inputItem :value.sync="form.customizedName"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="备注" prop="remark" class="row-block">
                        <inputItem type="textarea" :value.sync="form.remark"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">取消</elBtn>
            <elBtn @click="submit" type="primary">提交</elBtn>
        </div>
    </el-dialog>
</template>
<script>
    import mixin from "../../mixin/mixin.js";

    export default {
        mixins: [mixin],
        data() {
            return {
                form: {
                    name: "",
                    customizedName: "",
                    regId: "",
                    legalpepresent: "",
                    address: "",
                    tel: "",
                    remark: "",
                },
                typeCode: "",
                rules: {
                    customizedName: [
                        this._ruleLength(50)
                    ],
                    remark: [
                        this._ruleLength(100)
                    ],
                }
            };
        },
        props: {
            modal: {
                default: false
            },
            tableRow: {
                default: function () {
                    return {};
                }
            },
            ModalType: {
                default: "add"
            }
        },
        mounted() {
            Object.assign(this.form, this.tableRow);
        },
        methods: {
            cancel() {
                this.$emit("close");
            },
            submit() {
                var sf = this;
                /**customerid  需要从缓存中获取 */
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        sf.$emit("add", sf.form);
                    } else {
                        return false;
                    }
                });
            },
            beforeClose(done) {
                this.cancel();
                done();
            }
        }
    };
</script>