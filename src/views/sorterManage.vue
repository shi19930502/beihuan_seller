<template>
	<div>
		<searchInputItems>
			<searchInputItem name="姓名">
				<inputItem :value.sync="searchForm.name"></inputItem>
			</searchInputItem>
			<searchInputItem name="工号">
				<inputItem :value.sync="searchForm.jobno"></inputItem>
			</searchInputItem>
            <searchInputItem name="手机号码">
				<inputItem :value.sync="searchForm.phoneno"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                    <iconBtn iconClass="el-icon-plus" content="新增" @click="addTable" type="success">新增</iconBtn>
                    <iconBtn iconClass="el-icon-minus" content="批量删除" @click="deleteTable" type="danger">批量删除</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="name" label="姓名">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<div>{{scope.row.name}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="jobno" label="工号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.jobno">
						<div>{{scope.row.jobno}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="password" label="密码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.password">
						<span>{{scope.row.password}}</span>
					</toolTip>
				</template>
			</el-table-column> -->
            <el-table-column prop="sex" label="性别">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sex==0?'男':'女'">
						<span>{{scope.row.sex==0?'男':'女'}}</span>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="phoneno" label="手机号码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.phoneno">
						<span>{{scope.row.phoneno}}</span>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="enabled" label="是否启用">
				<template slot-scope="scope">
					<toolTip :content="scope.row.enabled==1?'启用' : '禁用'" v-if="scope.row.enabled==1">
						<el-tag type="success" v-if="scope.row.enabled==1">启用</el-tag>
						<el-tag type="danger" v-else>禁用</el-tag>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="remark" label="备注">
				<template slot-scope="scope">
					<toolTip :content="scope.row.remark">
						<span>{{scope.row.remark}}</span>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="createdDate" label="创建时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<span>{{scope.row.createdDate}}</span>
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
		<sorterModal :modal='sorterModal' :sorterModalType="modalType" @add='modalAdd'  v-if='sorterModal' @close='ModalClose' :tableRow='tableRow'></sorterModal>
	</div>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
import sorterModal from "./modals/sorterModal.vue";
export default {
  mixins: [mixin],
  components: {
    sorterModal
  },
  data() {
    return {
      dataList: [],
      searchForm: {
        name: "",
        jobno: "",
        phoneno: ""
      },
      sorterModal: false,
      modalType: "",
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
        url: this.rootAPI,
        name: "sorSorter/list",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    addTable() {
      this.modalType = "add";
      this.tableRow = {};
      this.sorterModal = true;
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
      this.searchForm.name = "";
      this.searchForm.jobno = "";
      this.searchForm.phoneno = "";
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
      this.sorterModal = true;
    },
    modalAdd(o) {
      var addOrupdate = o.id > 0 ? "sorSorter/update" : "sorSorter/create";
      this._ajax({
        url: this.rootAPI + addOrupdate,
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
      this.sorterModal = false;
    },
    delSubmit(o) {
      //.catch(this._confirmCancle);
      this.confirm(
        "确定删除？",
        function() {
          this._ajax({
            url: this.rootAPI + "sorSorter/delete",
            param: o,
            arr: true
          }).then(
            function(d) {
              if (d.state == 0) {
                this.$message({ type: "success", message: "删除成功" });
              } else {
                this.$message({ type: "warning", message: "删除失败" });
              }

              this.handleCurrentChange(1);
            }.bind(this)
          );
        }.bind(this)
      );
    }
  }
};
</script>