<template>
  <el-dialog
    custom-class="page-buyer"
    title="新增采购商"
    :visible="modal"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :width="modalWidth"
  >
    <el-form
      class="modal-form"
      :model="form"
      ref="form"
      :inline="true"
      :rules="rules"
      label-width="150px"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="登录名" prop="loginName">
            <inputItem :autosize="true" :value.sync="form.loginName" :maxlength="30"></inputItem>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="昵称" prop="name">
            <inputItem :autosize="true" :maxlength="30" :value.sync="form.name"></inputItem>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="手机号" prop="telephone">
            <inputItem :autosize="true" :maxlength="11" :value.sync="form.telephone"></inputItem>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item
            v-show="currentUserExpend != '002' && currentUserExpend != '005'"
            label="采购商类型"
            prop="telephone"
          >
            <el-select v-model="form.options.value" placeholder="请选择采购商类型">
              <el-option
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: right">
      <elBtn @click="cancel" type="info">取消</elBtn>
      <iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check">提交</iconBtn>
    </div>
  </el-dialog>
</template>

<script>
import local from "../../local.js";
import configs from "../../configs.js";
import mixin from "../../mixin/mixin.js";
export default {
  mixins: [mixin],
  components: {},
  data() {
    var checkLoginName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("登录名必填"));
      } else {
        this._ajax({
          url: this.rootAPI + "customer/checkExistByLoginName",
          param: { loginName: this.form.loginName }
        }).then(
          function(d) {
            if (d.state == 0) {
              callback();
            } else {
              callback(new Error("登录名已被注册!"));
            }
          }.bind(this)
        );
      }
    };
    var checkTelephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号码必填"));
      } else {
        this._ajax({
          url: this.rootAPI + "customer/telephoneMatche2",
          param: { telephone: this.form.telephone }
        }).then(
          function(d) {
            if (d.state == 0) {
              callback();
            } else {
              callback(new Error("手机号码已被注册!"));
            }
          }.bind(this)
        );
      }
    };
    return {
      form: {
        name: "",
        loginName: "",
        telephone: "",
        password: "",
        key: "",
        options: []
      },
      rules: {
        loginName: [
          { required: true, validator: checkLoginName, trigger: "blur" },
          this._ruleLength(50)
        ],
        name: [{ required: true, message: "名称必填" }, this._ruleLength(16)],
        telephone: [
          { required: true, validator: checkTelephone, trigger: "blur" },
          this._ruleMobile()
        ]
      },
      currentUserExpend: ""
    };
  },
  props: {
    modal: {
      default: false
    },
    ids: {
      default: function() {
        return {};
      }
    }
  },
  mounted() {
    let user = local.get("sessionUser");
    this._ajax({
      name: "customer/list",
      param: { id: local.get("userinfo").typeCode }
    }).then(
      function(d) {
        if (d.dataCount > 0) {
          this.currentUserExpend = d.aaData[0].extend;
          if(this.currentUserExpend==='004'){
            this.form.options=[{value: "005",label: "个人"}]
          }else if(this.currentUserExpend==='006'){
            this.form.options=[{value: "003",label: "团采"},{value: "004",label: "门店"},{value: "002",label: "二批"},{value: "008",label: "配送公司"}]
          }else if(this.currentUserExpend==='008'){
            this.form.options=[{value: "003",label: "团采"}]
          }else if(this.currentUserExpend==='001' ||this.currentUserExpend==='007'){
            this.form.options=[{value: "004",label: "门店"},{value: "002",label: "二批"},{value: "008",label: "配送公司"}]
          }
        }
      }.bind(this)
    );
    
  },
  methods: {
    valideSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let o = {},
            method = "customer/customerRegist";
          let user = local.get("sessionUser");
          this._ajax({
            url: this.rootAPI + "customer/queryById",
            param: { id: user.typeCode }
          }).then(
            function(d) {
               if (d.state == 0) {
                  this._ajax({url: this.rootAPI + "merchantchannelmapping/queryChannelCodeByCustomerId", param: { id: user.typeCode } }).then(
                      function(dd) { 
                 console.log('sssssssswwwwwwwww',dd)
                // let buyerExtend = "0";
                // // 门店可以添加  个人账号
                // if (this.currentUserExpend === "004") {
                //   buyerExtend = "005";
                // }
                // // 自营平台添加 团采
                // else if (this.currentUserExpend === "004") {
                //   buyerExtend = "003";
                // }
                // // 一批/厂商可以添加：门店、二批账号
                // else if (
                //   this.currentUserExpend === "001" ||
                //   this.currentUserExpend === "007"
                // ) {
                  // if (
                  //   this.form.options.value == null ||
                  //   this.form.options.value == "" ||
                  //   this.form.options.value == undefined
                  // ) {
                  //   this.$message({
                  //     type: "failure",
                  //     message: "操作失败：请选择采购商类型"
                  //   });
                  //   return;
                  // } else {
                    // buyerExtend = this.form.options.value;
                  // }
                // }
                // var key='';
                // if(this.form.options.value === "004" || this.form.options.value === "002"|| this.form.options.value === "008"){
                //     key="merchant_buyer";
                // }else{
                //     key="buyer";
                // }
                o = {
                  name: this.form.name,
                  loginName: this.form.loginName,
                  telephone: this.form.telephone,
                  invitationCode: d.aaData.code,
                  password: "123456",
                  key: "buyer",
                  customerProperty:this.form.options.value,
                  channelCode:dd.aaData,
                  extend: this.form.options.value
                };
                this._ajax({ url: this.rootAPI + method, param: o }).then(
                  function(d) {
                    if (d.state == 0) {
                      this.$message({ type: "success", message: "操作成功" });
                      this.cancel();
                    } else {
                      this.$message({
                        type: "failure",
                        message: "操作失败：" + d.msg
                      });
                    }
                  }.bind(this)
                );
                }.bind(this)
                );
               } else {
                this.$message({
                  type: "failure",
                  message: "操作失败：" + d.msg
                });
              }
            }.bind(this)
          );
        }
      });
    },
    cancel() {
      this.$emit("close");
    },
    beforeClose(done) {
      this.cancel();
      done();
    }
  }
};
</script>
<style lang="sass">
    .page-channel{
        .row-block{
        	width: 100%;
            .el-form-item__content {
                width: calc(100% - 150px);
                &>div{
                    width: 100%;
                }
            }            
        }
    }
</style>
