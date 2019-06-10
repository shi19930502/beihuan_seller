<template>
	<div>
		<searchInputItems>
			<searchInputItem name="车牌号">
				<inputItem :value.sync="searchForm.vehicleNo"></inputItem>
			</searchInputItem>
			<searchInputItem name="司机姓名">
				<inputItem :value.sync="searchForm.driverName"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                    <iconBtn iconClass="el-icon-plus" content="新增" @click="addTable" type="success">新增</iconBtn>
                    <iconBtn iconClass="el-icon-minus" content="批量删除" @click="deleteTable" type="danger">批量删除</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    <!-- <iconBtn iconClass="el-icon-plus" content="测试" @click="testclick" type="success">测试</iconBtn> -->
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="vehicleNo" label="车牌号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.vehicleNo">
						<div>{{scope.row.vehicleNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="driverName" label="司机姓名">
				<template slot-scope="scope">
					<toolTip :content="scope.row.driverName">
						<div>{{scope.row.driverName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			 <el-table-column prop="driverPhone" label="联系电话">
				<template slot-scope="scope">
					<toolTip :content="scope.row.driverPhone">
						<span>{{scope.row.driverPhone}}</span>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="carrierName" label="承运商">
				<template slot-scope="scope">
					<toolTip :content="scope.row.carrierName">
						<span>{{scope.row.carrierName}}</span>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="load" label="车辆载重(吨)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.load">
						<span>{{scope.row.load}}</span>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="vehicleStatus" label="车辆状态">
				<template slot-scope="scope">
					<toolTip :content="scope.row.vehicleStatus">
						<el-tag type="success" v-if="scope.row.vehicleStatus==0">空闲中</el-tag>
						<el-tag type="danger" v-else>运输中</el-tag>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="enabled" label="是否启用">
				<template slot-scope="scope">
					<toolTip :content="scope.row.enabled">
						<el-tag type="success" v-if="scope.row.enabled==1">启用</el-tag>
						<el-tag type="danger" v-else>禁用</el-tag>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<!--<el-button type="danger" @click="delRow(scope.row)"  >删除</el-button>-->
					<iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
					<iconBtn iconClass="el-icon-edit" content="编辑" @click="lookOver(scope.row)"></iconBtn>	  
					<!--<el-button type="success" @click="lookOver(scope.row)"  >编辑</el-button>-->
				</template>
			</el-table-column>
		</elemTable>
		<distributionVehicleModal :modal='showModal' :ModalType="modalType" @add='modalAdd'  v-if='showModal' @close='ModalClose' :tableRow='tableRow'></distributionVehicleModal>
	</div>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
import distributionVehicleModal from "./modals/distributionVehicleModal.vue";
export default {
  mixins: [mixin],
  components: {
    distributionVehicleModal
  },
  data() {
    return {
      dataList: [],
      searchForm: {
        vehicleNo: "",
        driverName: ""
      },
      showModal: false,
      modalType: ""
      
    };
  },
  mounted() {
    this.searchTable();
  },
  methods: {
    searchTable() {
      let user = local.get('sessionUser');
      /**customerid  需要从缓存中获取 */
      this.searchForm.customerId = parseInt(user.typeCode);
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        url: this.distributeAPI+"baseVehicle/list",
        name: "",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    addTable() {
      this.modalType = "add";
      this.tableRow = {};
      this.showModal = true;
    },
    deleteTable() {
      if (this.delSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {
        let selection = this.delSelection;
        var arr = [],
          o = {};
        selection.forEach(function(el) {
          arr.push(el.id);
        });
        o.id = arr;
        this.delSubmit(o);
      }
    },
    reset() {
      this.searchForm.vehicleNo = "";
      this.searchForm.driverName = "";
      this.searchTable()
    },
    delRow(row) {
      var o = {
        id: [row.id]
      };
      this.delSubmit(o);
    },
    lookOver(o) {
      this.tableRow = o;
      this.modalType = "edit";
      this.showModal = true;
    },
    modalAdd(o) {
      var sf=this;
      var addOrupdate = o.id > 0 ? "baseVehicle/update" : "baseVehicle/create";
      this._ajax({
        url: this.distributeAPI + addOrupdate,
        param: o,
        arr: true
      })
        .then(
          function(d) {
            if (d.state == 0) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              sf.showModal = false;
            } else {
              this.$message({
                type: "failure",
                message: d.msg
              });
            }
            //this.$emit("submit");
          }.bind(this)
        )
        .then(this.searchTable);
    },
    ModalClose() {
      this.showModal = false;
    },
    delSubmit(o) {
      //.catch(this._confirmCancle);
      o.deleted=0;
      this.confirm(
        "确定删除？",
        function() {
          this._ajax({
            url: this.distributeAPI + "baseVehicle/Tombstone",
            param: o,
            arr: true
          }).then(
            function(d) {
              if (d.state == 0) {
                this.$message({ type: "success", message: "删除成功" });
              } else {
                this.$message({ type: "warning", message: "删除失败：" +d.msg});
              }

              this.handleCurrentChange(1);
            }.bind(this)
          );
        }.bind(this)
      );
    },
    testclick(){
      return this._ajax({
        url: this.rootAPI,
        name: "sorSorter/test",
        param: {},
        loading: "dataLoading"
      }).then(d=>{
        
      });
    }
  }
};
</script>