<template>
    <el-dialog custom-class="jz-modal" :title="ModalType === 'add' ? '新增车辆事故' : '编辑车辆事故'" :visible="modal"
               :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules"
                 label-width="100px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="选择车辆" prop="vehicleNum">
                        <selectInput :value.sync="form.vehicleNum">
                            <el-option
                                    v-for="item in vehicleList"
                                    :key="item.id"
                                    :value="item.vehicleNo">
                            </el-option>
                        </selectInput>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="事故编码" prop="code">
                        <inputItem :autosize="true" type="textarea" :value.sync="form.code"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="事故日期">
                        <dateEditorDaterange type="date" :showShortcuts="showShortcuts"
                                             :dateValue.sync="form.accidentDate"></dateEditorDaterange>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="事故地址" prop="accidentAddress">
                        <inputItem :autosize="true" type="textarea" :value.sync="form.accidentAddress"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="过程描述" prop="describe">
                        <inputItem :autosize="true" type="textarea" :value.sync="form.describe"></inputItem>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="损失挂账日期">
                        <dateEditorDaterange type="date" :showShortcuts="showShortcuts"
                                             :dateValue.sync="form.lossDate"></dateEditorDaterange>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="损失金额" prop="lossAmount">
                        <inputItem placeHolder="单位：元" :value.sync="form.lossAmount"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="损失描述" prop="lossDescribe">
                        <inputItem :autosize="true" type="textarea" :value.sync="form.lossDescribe"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">

                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" v-if="ModalType === 'add'" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">取消</elBtn>
            <elBtn @click="submit(true)" type="primary">保存为草稿</elBtn>
            <elBtn @click="submit(false)" type="primary">提交</elBtn>
        </div>
        <div slot="footer" class="dialog-footer flex-x-end" v-else>
            <elBtn @click="cancel">取消</elBtn>
            <elBtn @click="updateData(true)" type="primary">保存编辑</elBtn>
            <elBtn @click="updateData(false)" type="primary">提交</elBtn>
        </div>
    </el-dialog>
</template>
<script>
    import local from "../../local.js";
    import mixin from "../../mixin/mixin.js";
    import configs from "../../configs.js";

    export default {
        mixins: [mixin],
        data() {
            return {
                showShortcuts: false,
                selCar: {},
                searchForm: {
                    vehicleNo: "",
                    driverName: ""
                },
                vehicleList: [],
                form: {
                    vehicleId: "",
                    vehicleNum: "",
                    accidentDate: "",
                    accidentAddress: "",
                    describe: "",
                    lossDate: "",
                    lossAmount: "",
                    lossDescribe: "",
                    status: "1"
                },
                typeCode: "",
                rules: {
                    code: [
                        {
                            required: true,
                            message: "事故编码不能为空",
                            trigger: "blur"
                        },
                        this._ruleLength(20)
                    ],
                    vehicleNum: [
                        {
                            required: true,
                            message: "车牌号不能为空",
                            trigger: "blur"
                        },
                        this._ruleLength(50)
                    ],
                    lossAmount: [
                        {
                            required: true,
                            message: "请输入大于等于零的数字",
                            trigger: "blur"
                        },
                        this._ruleTwoFloat(50)
                    ],
                    accidentAddress: [
                        this._ruleLength(200)
                    ],
                    describe: [
                        this._ruleLength(200)
                    ],
                    lossDescribe: [
                        this._ruleLength(200)
                    ]
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
            /*如果是编辑页需要回显数据*/
            if (this.ModalType != "add") {
                Object.assign(this.form, this.tableRow);
            }

            if (this.form.accidentDate == '') {
                this.form.accidentDate = moment().subtract(0, 'days').format('YYYY-MM-DD HH:mm:ss');
            }
            if (this.form.lossDate == '') {
                this.form.lossDate = moment().subtract(0, 'days').format('YYYY-MM-DD HH:mm:ss');
            }

            let user = local.get('sessionUser');
            this.searchForm.customerId = parseInt(user.typeCode);
            Object.assign(this.searchForm, {
                pageNum: 1,
                pageSize: 1000
            });
            this._ajax({
                url: this.distributeAPI + "baseVehicle/list",
                name: "",
                param: this.searchForm,
                loading: "dataLoading"
            }).then(this.renderVehcleList);
        },
        methods: {
            renderVehcleList(d) {
                this.vehicleList = d.aaData;
            },
            cancel() {
                this.$emit("close");
            },
            submit(isDraft) {
                var sf = this;
                /**customerid  需要从缓存中获取 */
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        var selItem = sf.vehicleList.find(function (item) {
                            return item.vehicleNo === sf.form.vehicleNum;
                        });
                        sf.form.vehicleId = selItem.id;

                        //设置为提交状态
                        if (isDraft) {
                            sf.form.status = 0;
                        } else {
                            sf.form.status = 1;
                        }
                        sf.$emit("add", sf.form);
                    } else {
                        return false;
                    }
                });
            },
            updateData(isDraft) {
                var sf = this;
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        var selItem = sf.vehicleList.find(function (item) {
                            return item.vehicleNo === sf.form.vehicleNum;
                        });
                        sf.form.vehicleId = selItem.id;

                        //设置为提交状态
                        if (isDraft) {
                            sf.form.status = 0;
                        } else {
                            sf.form.status = 1;
                        }
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