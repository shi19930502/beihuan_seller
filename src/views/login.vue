<template>
  <div class="page-login flex-y-center flex-x-center">
    <div class="center-box flex-y-center">
      <div class="item left flex-y-center flex-x-center">
        <div style="text-align: center;">
          <img
            src="../../lib/img/loginImg/s_logo.png"
            height="133"
            width="265"
            v-if="city === '银川'"
          >
          <img
            src="../../lib/img/loginImg/-s-logo.png"
            height="147"
            width="220"
            v-if="city === '临沂'"
          >
          <img
            src="../../lib/img/loginImg/-s-logo (2).png"
            height="156"
            width="143"
            v-if="city === '农鲜汇'"
          >
          <img
            src="../../lib/img/loginImg/logo-yuexi.png"
            height="152"
            width="315"
            v-if="city === '越西'"
          >
          <div class="welcome" v-if="city === '农鲜汇'">欢迎来到农鲜汇卖家中心</div>
          <div class="welcome" v-if="city === '临沂'">欢迎来到临沂追溯卖家中心</div>
          <div class="welcome" v-if="city === '银川'">欢迎来到银川公益市场卖家中心</div>
          <div class="welcome" v-if="city === '越西'">欢迎来到越西电商卖家中心</div>
        </div>
      </div>
      <div class="item right flex-y-center" v-loading="loading">
        <div style="width: 100%;">
          <el-form class="login-form" :model="form" ref="form" :rules="rules">
            <el-row justify="center" type="flex">
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <el-form-item prop="username">
                  <inputItem
                    :value.sync="form.username"
                    placeholder="请输入用户名"
                    :maxlength="30"
                    @enter="login"
                  ></inputItem>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row justify="center" type="flex">
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <el-form-item prop="password">
                  <inputItem
                    :value.sync="form.password"
                    placeholder="请输入密码"
                    :maxlength="30"
                    @enter="login"
                    type="password"
                  ></inputItem>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row justify="center" type="flex">
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <el-form-item prop="verifiCode">
                  <div class="flex-x-start">
                    <inputItem
                      :value.sync="form.verifiCode"
                      placeholder="请输入验证码"
                      :maxlength="6"
                      @enter="login"
                      :append="true"
                    >
                      <img
                        style="height: 40px;"
                        :src="verifyCodeSRC"
                        @click="refreshVerifyCode"
                        slot="append"
                      >
                    </inputItem>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="login-box-bot">
            <div class="flex-x-center flex-y-center btn-login" @click="login">登 录</div>
          </div>
        </div>
        <div class="right-bottom">
          没有账号？
          <span class="a-reg" @click="register()" v-if="city !== '农鲜汇'">免费注册</span>
          <span class="a-reg" @click="registerNew()" v-if="city === '农鲜汇'">快速注册</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin/mixin.js";
import local from "../local.js";
import configs from "../configs.js";
import { MessageBox } from 'element-ui'
export default {
  name: "login",
  mixins: [mixin],
  data() {
    return {
      city: configs.city,
      winSize: {
        width: "",
        height: ""
      },
      verifyCodeSRC: ROOT_API + "/login/auth/code",
      form: {
        username: "",
        password: "",
        verifiCode: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空！",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空！",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    register() {
      this.$router.push({ path: "/customerRegist" });
    },
    registerNew() {
      // this.$router.push({ path: "/registerNewtwo" });
      location.href = ROOT_API + '/pc_mall/#/reg?type=merchant'
    },
    logOut() {
      local.remove("userinfo");
      local.remove("token");
      local.remove("navlist");
      local.remove("sessionUser");
      local.remove("extend");
    },
    login() {
      var vm = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          vm.loading = true;
          $.ajax({
            type: "POST",
            url: configs.loginAPI,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "flightHandler",
            data: {
              loginName: vm.form.username,
              password: vm.form.password,
              systemId: configs.sysID,
              flag: 1,
              authCode: vm.form.verifiCode
            },
            success: (d)=> {
              console.log(d);
              if (d.state === 0) {
                var userinfo = d.loginUser;

                console.log(d.loginUser.isValid);
                var token = d.token;
                var navlist = d.menuItemLlist;
                var sessionUser = d.sessionUser;
                if (
                  sessionUser.typeId != null &&
                  sessionUser.typeId != "" &&
                  sessionUser.typeId == "buyer"
                ) {
                  vm.loading = false;
                  vm.$message({
                    type: "error",
                    message: "请使用供应商账号登录！"
                  });
                  return;
                }
                local.set("userinfo", userinfo);
                local.set("token", token);
                local.set("navlist", navlist);
                local.set("sessionUser", sessionUser);
                local.set("loginname", vm.form.username);
                // if(configs.city === '农鲜汇') {
                // 	if(!d.loginUser.isValid && d.loginUser.isValid != 1) {
                // 		vm.$alert('抱歉：该备案用户备案信息不完整，已超出安全登录日期，无法登录！！','错误提示', {
                //           	confirmButtonText: '去完善',
                //            	callback: action => {
                //           	 	vm.$router.push({name: 'complementingInformation', query:{userinfo}})
                //           	}
                //         });
                // 		vm.logOut();
                // 		return;
                // 	}
                // }
                if (!vm.isEmptyObject(d.loginUser)) {
                  local.set("extend", d.loginUser.extend);
                }
                if (userinfo) {
                  if (userinfo.loginName === "admin") {
                    vm.loading = false;
                    vm.$router.push({ name: "index" });
                  } else {
                    vm._ajax({
                      url: vm.userAPI,
                      name: "user/list",
                      param: {
                        id: userinfo.userId,
                        loginName: userinfo.loginName,
                        sysId: configs.sysID
                      }
                    }).then(function(d) {
                      vm.loading = false;
                      if (d.state === 0) {
                        if (d.aaData.length > 0) {
                          var customerId = parseInt(d.aaData[0].typeCode) || 0;
                          var extend = d.aaData[0].extend;
                          local.set("extend", "main");
                          vm._ajax({
                            name: "customer/list",
                            param: { id: customerId }
                          }).then(function(d) {
                            if (d.state === 0 && d.aaData.length > 0) {
                              if (d.aaData[0].enabled == 1) {
                                var first = navlist[0],
                                  index = "index";
                                if (first.hasChildren == 0) {
                                  index = first.caption;
                                }
                                if (
                                  first.hasChildren == 1 &&
                                  Array.isArray(first.children)
                                ) {
                                  index = first.children[0].caption;
                                }
                                if (sessionUser.typeId == "buyer") {
                                  vm.$router.push({
                                    name: "buyer_orderManage"
                                  });
                                } else {
                                  vm.$router.push({ name: index });
                                }
                              } else {
                                vm.$message({
                                  type: "error",
                                  message: "该备案用户未激活,无法登录"
                                });
                                vm.logOut();
                              }
                            } else {
                              vm.$message({
                                type: "error",
                                message: "该用户未备案,无法登录"
                              });
                              vm.logOut();
                            }
                          });
                        } else {
                          vm.$message({
                            type: "error",
                            message: "用户不存在,无法登录"
                          });
                          vm.logOut();
                        }
                      } else {
                        vm.$message({ type: "error", message: d.msg });
                        vm.logOut();
                      }
                    });
                  }
                } else {
                  vm.loading = false;
                  vm.$message({
                    type: "error",
                    message: "用户不存在,无法登录"
                  });
                  vm.logOut();
                }
              } else {
                vm.loading = false;
                vm.$message({ type: "error", message: d.msg });
                if (d.state === 101) {
                  this.$confirm(
                      "该账号缺少必要信息，已被管理员停用，请完善注册必要信息再联系管理员激活！",
                      "提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                      }
                    )
                    .then(() => {
                      location.href = ROOT_API + '/pc_mall/#/completeRegInfo?type=mjzx&typeCode=' + d.customerEntity.id
                    });
                }
              }
            },
            error: function(req, error) {
              vm.loading = false;
              vm.$message({ type: "error", message: error });
            }
          });
        }
      });
    },
    refreshVerifyCode() {
      this.verifyCodeSRC = this.verifyCodeSRC + "?s=" + new Date().getTime();
    }
  },
  mounted() {
    var loginName = local.get("loginname");
    if (loginName != null) {
      Object.assign(this.form, {
        username: loginName
      });
    }
    this.refreshVerifyCode();
  }
};
</script>
<style lang="sass">
	.page-login{
		height: 100%;
		min-width: 1080px;
		background: url(../../lib/img/loginImg/bg@2x.png) no-repeat center center fixed;
	    -webkit-background-size: cover;
	    -moz-background-size: cover;
	    -o-background-size: cover;
	    background-size: cover;
	    .center-box{
	    	.item {
	    		width: 390px;height: 416px;
	    		&.left {
	    			background: #2F3D4A;
	    		}
	    		&.right {
	    			background: #fff;position: relative;
	    		}
	    		.welcome{
	    			color: #67BE30;font-size: 24px;text-align: center;margin-top: 20px;
	    		}
	    	}
	    }
	    .login-form{
	    	.el-input .el-input__inner {
	    		border: none;border-bottom: 1px solid #EBEBEB;padding: 0;height: 42px;line-height: 42px;
	    	}
	    	.el-input-group__append{
	    		padding: 0;border: none;border-bottom: 1px solid #EBEBEB;
	    	}
	    }
	    .login-box-bot{
			padding: 0 25px;
			.btn-login{
				height: 36px;background-color: #1E88E5;color: #fff;font-size: 18px;border-radius: 3px;cursor: pointer;
			}
		}
		.right-bottom{
			position: absolute;bottom: 0;height: 54px;line-height: 54px;background: #F6F6F6;width: 100%;text-align: center;font-size: 14px;
			.a-reg{
				color: #0084FF;cursor: pointer;
				&:hover{
					text-decoration:underline;
				}
			}
		}
	}
</style>