<template>
	<div>
		<searchInputItems>
			<searchInputItem name="称重筐名称">
				<inputItem :value.sync="searchForm.name"></inputItem>
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
			<el-table-column prop="name" label="称重筐名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<div>{{scope.row.name}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="weight" label="称重筐重量(千克)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.weight">
						<div>{{scope.row.weight}}</div>
					</toolTip>
				</template>
			</el-table-column>
      		<el-table-column prop="deposit" label="称重筐押金(元)">
				<template slot-scope="scope">
					<toolTip :content="scope.row.deposit">
						<div>{{scope.row.deposit}}</div>
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
		<weightBasketModal :modal='showModal' :ModalType="modalType" @add='modalAdd'  v-if='showModal' @close='ModalClose' :tableRow='tableRow'></weightBasketModal>
	</div>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
import weightBasketModal from "./modals/weightBasketModal.vue";
export default {
  mixins: [mixin],
  components: {
    weightBasketModal
  },
  data() {
    return {
      dataList: [],
      searchForm: {
        name: ""
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
        url: this.rootAPI,
        name: "sorWeighebasket/list",
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
      this.searchForm.name = "";
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
      var addOrupdate =
        o.id > 0 ? "sorWeighebasket/update" : "sorWeighebasket/create";
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
      this.showModal = false;
    },
    delSubmit(o) {
      //.catch(this._confirmCancle);
      this.confirm(
        "确定删除？",
        function() {
          this._ajax({
            url: this.rootAPI + "sorWeighebasket/delete",
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