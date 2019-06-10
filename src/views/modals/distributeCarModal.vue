<template>
	<el-dialog custom-class="jz-modal" title="分配车辆" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
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
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="orderUmber" label="送货单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="buyerBusinessNo" label="买家商圈序号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerBusinessNo">
						<div>{{scope.row.buyerBusinessNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
          <el-table-column prop="buyerName" label="买家名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<div>{{scope.row.buyerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
      <el-table-column prop="distributionTime" label="预计送达时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributionTime">
						<div >{{scope.row.distributionTime}}</div>
					</toolTip>
				</template>
			</el-table-column>
      <el-table-column prop="orderDate" label="订单时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderDate">
						<div >{{scope.row.orderDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
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
      dataList: [],
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
      //console.log('对象',this.tableCarRow);
      this.searchTable();
      this.searchVehicleNo();
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    searchTable() {
        let user = local.get("sessionUser");
        let pa={
            userId:parseInt(user.typeCode||0)
        };
      this._ajax({
        url: this.distributeAPI+"deliveryOrder/GetUndistributeOrder",
        name: "",
        param: pa
      }).then(this.renderTable);
    },
    beforeClose(done) {
      this.cancel();
    },
    submit(){
       if(this.form.vehicleId==""){
        this.$message({ type: "info", message: "请选择车辆" });
      }
      else if (this.delSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {
        let selection = this.delSelection;
        var arr = [],
          o = {};
        selection.forEach(function(el) {
          arr.push(el.id);
        });
        o.orderIds = arr.join(',');
        this.save(o);
      }
    },
    save(o){
      var sf=this;
      o.vehicleId=this.form.vehicleId;
      let user = local.get("sessionUser");
      o.distributorId = parseInt(user.typeCode||0);
      o.operator=user.loginName;
      console.log(o);
      this._ajax({
        url: this.distributeAPI+"distributionOrder/CreatDistributeOrder",
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