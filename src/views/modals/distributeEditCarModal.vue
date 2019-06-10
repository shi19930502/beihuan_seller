<template>
	<el-dialog custom-class="jz-modal" title="编辑车辆" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
      <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="车牌号" prop="vehicleNo">
					<el-select v-model="form.vehicleId" placeholder="请选择">
						<el-option v-for="item in vehicleNoList" :key="item.id" :label="item.vehicleNo" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
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
      form:{
          vehicleId:""
      },
      vehicleNoList:[]
    };
  },
  props: {
    modal: {
      default: false
    },
     tableCarRow: {
      default: function() {
        return {};
      }
    }
  },
  mounted() {
      console.log('对象',this.tableCarRow);
      this.searchVehicleNo();
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    beforeClose(done) {
      this.cancel();
    },
    submit(){
      if(this.form.vehicleId==""){
        this.$message({ type: "info", message: "请选择车辆" });
      }else{
      var o = {};
      this.save(o);
      }
    },
    save(o){
      var sf=this;
      o.vehicleId=this.form.vehicleId;
      o.Id=this.tableCarRow.Id;
      o.oldvehicleId=this.tableCarRow.oldvehicleId;
      // let user = local.get("sessionUser");
      // o.distributorId = parseInt(user.userId||0);
      // o.operator=user.loginName;
      console.log("输出",o);
      this._ajax({
        url: this.distributeAPI+"distributionOrder/UpdateDistributeOrder",
        name: "",
        param: o,
        loading: "dataLoading"
      }).then(d=>{
          if (d.state == 0) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              sf.cancel();
              sf.$emit("refreshtable");
            } else {
              this.$message({
                type: "failure",
                message: d.msg
              });
            }
      });
    },
    searchVehicleNo(){
        let user = local.get("sessionUser");
        let pa={
            customerId:parseInt(user.typeCode||0),
            vehicleStatus:0,
			enabled:1,
			deleted:1
        };
        this._ajax({
        url: this.distributeAPI+"baseVehicle/list",
        name: "",
        param: pa
      }).then(d=>{
          this.vehicleNoList=d.aaData;
          if (this.vehicleNoList.length>0){
             this.form.vehicleId=this.vehicleNoList[0].id;
          }
      });
    }
  }
};
</script>