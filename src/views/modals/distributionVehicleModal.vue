<template>
	<el-dialog custom-class="jz-modal" :title="ModalType === 'add' ? '新增车辆' : '编辑车辆'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="车牌号" prop="vehicleNo">
						<inputItem :value.sync="form.vehicleNo" :disabled="ModalType === 'add' ? false: true"></inputItem>
                        <!-- <el-tag type="success" v-show="ModalType === 'add' ? false: true">标签二</el-tag> -->
					</el-form-item>
				</el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="司机姓名" prop="driverName">
						<inputItem :value.sync="form.driverName" ></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="联系电话" prop="driverPhone">
						<inputItem :value.sync="form.driverPhone" ></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="承运商" prop="carrierName">
						<inputItem :value.sync="form.carrierName" ></inputItem>
					</el-form-item>
				</el-col>
                
			</el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="载重" prop="load">
						<inputItem :value.sync="form.load" placeHolder="单位：吨"></inputItem>
					</el-form-item>
				</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			<el-form-item label="车辆状态"  prop="vehicleStatus">
				<el-select disabled  v-model="form.vehicleStatus" placeholder="请选择">
              <el-option label="空闲中" value="0"></el-option>
              <el-option label="运输中" value="1"></el-option>
                </el-select>
			</el-form-item>
				</el-col>
                
			</el-row>
      <el-row>
					 <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			<el-form-item label="是否启用" prop="enabled">
				<el-select v-model="form.enabled" placeholder="请选择">
              <el-option label="禁用" value="0"></el-option>
              <el-option label="启用" value="1"></el-option>
            </el-select>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" >取消</elBtn>
			<elBtn @click="submit" type="primary">提交</elBtn>
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
      form: {
        vehicleNo: "",
        driverName: "",
        driverPhone: "",
        carrierName: "",
        load: "",
        vehicleStatus: "0",
        enabled: "1"
      },
      dsfsd:"吨",
      typeCode: "",
      rules: {
        vehicleNo: [
          {
            required: true,
            message: "车牌号不能为空",
            trigger: "blur"
          },
          this._ruleLength(50)
        ],
        driverName: [
          {
            required: true,
            message: "司机姓名不能为空"
          },
          this._ruleLength(50)
        ],
        driverPhone: [
          {
            required: true,
            message: "联系电话不能为空"
          },
          this._ruleMobile()
        ],
        carrierName: [
          {
            required: true,
            message: "承运商不能为空"
          },
          this._ruleLength(50)
        ],
        load: [
          {
            required: true,
            message: "载重不能为空"
          },
          this._ruleTwoFloat()

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
    ModalType: {
      default: "add"
    }
  },
  mounted() {
    if (this.ModalType != "add") {
      Object.assign(this.form, this.tableRow);
      //this.form = this.tableRow;
      this.form.vehicleStatus += "";
      this.form.enabled += "";
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
          var o = {
            id: sf.tableRow.id || null,
            vehicleNo: sf.form.vehicleNo,
            driverName: sf.form.driverName,
            driverPhone: sf.form.driverPhone,
            carrierName: sf.form.carrierName,
            load: sf.form.load,
            vehicleStatus: sf.form.vehicleStatus,
            customerId: parseInt(user.typeCode || 0),
            enabled: sf.form.enabled,
            operator:user.loginName
          };
          sf.$emit("add", o);
          
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