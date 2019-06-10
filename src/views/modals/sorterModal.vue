<template>
	<el-dialog custom-class="jz-modal" :title="sorterModalType === 'add' ? '新增分拣员' : '编辑分拣员'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="姓名" prop="name">
						<inputItem :value.sync="form.name" ></inputItem>
					</el-form-item>
				</el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="工号" prop="jobno">
					<inputItem :value.sync="form.jobno" ></inputItem>	
					</el-form-item>
				</el-col>
			</el-row>
            			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="密码" prop="password">
						<inputItem :value.sync="form.password" type="password"></inputItem>
					</el-form-item>
				</el-col>
                				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="性别" prop=sex>
						<el-select v-model="form.sex" placeholder="请选择">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
					</el-form-item>
				</el-col>
			</el-row>
            			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="手机号码" prop="phoneno">
						<inputItem :value.sync="form.phoneno" ></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="是否启用" prop=enabled>
						<el-select v-model="form.enabled" placeholder="请选择">
              <el-option label="禁用" value="0"></el-option>
              <el-option label="启用" value="1"></el-option>
            </el-select>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row>
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="备注" prop=remark>
						<inputItem :autosize="true" type="textarea" :value.sync="form.remark" ></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" >取消</elBtn>
			<elBtn @click="submit" type="primary" >提交</elBtn>
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
    var vm = this
    var regRequire = function(rule, value, callback) {
                        var val = $.trim(value)
                        if(vm.sorterModalType == "add") {
                          if(val.length <= 0) {
                            callback(new Error('密码不能为空'))
                          } else if(val.length > 50){
                            callback(new Error('长度不可超过50个字符'))
                          }else {
                            callback();
                          }
                        }else {
                          if(val.length > 50){
                            callback(new Error('长度不可超过50个字符'))
                          }else {
                            callback();
                          }
                        }
                      }
    return {
      msgColor: "red",
      textLeft: "left",
      msg: "",
      pipor: "",
      none: true,
      form: {
        name: "",
        jobno: "",
        password: "",
        sex: "0",
        enabled: "1",
        phoneno: "",
        remark: ""
      },

      typeCode: "",
      rules: {
        jobno: [
          { required: true, message: "工号不能为空" },
          this._ruleLength(50),
          {
            validator: function(rule, value, callback) {
              if (
                this.sorterModalType != "add" &&
                this.tableRow.jobno == value
              ) {
                callback();
              }else {
                this._ajax({
                  url: this.rootAPI,
                  name: "sorSorter/queryCountByCustomerIdAndJobno",
                  param: {
                    customerId: local.get("sessionUser").typeCode,
                    jobno: this.form.jobno
                  },
                  loading: "dataLoading"
                }).then(function(d) {
                  if (d.state === 0 && d.aaData.count > 0) {
                    callback(new Error("工号已存在"));
                  } else {
                    callback();
                  }
                });
              }              
            }.bind(this),
            trigger: "blur"
          }
        ],

        phoneno: [this._ruleMobile()],
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          },
          this._ruleLength(50)
        ],
        password: [
          {
            validator: regRequire, trigger: 'blur'
          },
          this._ruleLength(50)
        ]
      }
    };
  },
  props: {
    modal: {
      default: false
    },
    tableRow: {
      default: function() {
        return {};
      }
    },
    sorterModalType: {
      default: "add"
    }
  },
  mounted() {
    if (this.sorterModalType != "add") {
      Object.assign(this.form, this.tableRow);
      //this.form = this.tableRow;
      this.form.sex += "";
      this.form.enabled += "";
      Object.assign(this.form, {
        password: ''
      });
    }
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    submit() {
      var sf = this;
			let user = local.get("sessionUser");
      //this.searchForm.typeCode = user.typeCode
			/**customerid  需要从缓存中获取 */
      this.$refs["form"].validate(valid => {
        if (valid) {
          var o = {}
          if(sf.sorterModalType != "add" && $.trim(sf.form.password) == '') {
            o = {
              id: sf.tableRow.id || null,
              name: sf.form.name,
              jobno: sf.form.jobno,
              sex: sf.form.sex,
              phoneno: sf.form.phoneno,
              enabled: sf.form.enabled,
              customerId: parseInt(user.typeCode || 0),
              remark: sf.form.remark
            };
          }else {
            o = {
              id: sf.tableRow.id || null,
              name: sf.form.name,
              jobno: sf.form.jobno,
              password: sf.form.password,
              sex: sf.form.sex,
              phoneno: sf.form.phoneno,
              enabled: sf.form.enabled,
              customerId: parseInt(user.typeCode || 0),
              remark: sf.form.remark
            };
          }          
          sf.$emit("add", o);
          sf.cancel();
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