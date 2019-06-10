<template>
	<div>
		<searchInputItems>
			<searchInputItem name="商品名称">
				<inputItem :value.sync="searchForm.productName"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
          <iconBtn iconClass="el-icon-download" content="按查询条件导出" @click="exportExcel" type="info">按查询条件导出</iconBtn>
          <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<div>{{scope.row.productName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="skuName" label="规格名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuName">
						<div>{{scope.row.skuName}}</div>
					</toolTip>
				</template>
			</el-table-column> -->
            <el-table-column prop="totalweight" label="缺货总量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.totalweight">
						<div>{{scope.row.totalweight}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <!-- <el-table-column prop="sorterjobno" label="分拣员工号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sorterjobno">
						<div>{{scope.row.sorterjobno}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="createdDate" label="缺货申请时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<div>{{scope.row.createdDate}}</div>
					</toolTip>
				</template>
			</el-table-column> -->
			<el-table-column label="操作">
				<template slot-scope="scope">
				<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<outofstockModal :modal='showModal'  v-if='showModal' @close='ModalClose' :tableRow='tableRow'></outofstockModal>
	</div>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
import outofstockModal from "./modals/outofstockModal.vue";
export default {
  mixins: [mixin],
  components: { outofstockModal },
  data() {
    return {
      dataList: [],
      searchForm: {
        productName: ""
      },
      showModal: false,
      modalType: "",
      showModal: false
    };
  },
  mounted() {
    this.searchTable();
  },
  methods: {
    searchTable() {
      let user = local.get("sessionUser");
      /**customerid  需要从缓存中获取 */
      this.searchForm.customerId = parseInt(user.typeCode||0);
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        url: this.rootAPI,
        name: "sorOutofstock/GetOutOfStockTotal",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    exportExcel() {
      var fields = ["productName", "totalweight"],
        filedsName = ["商品名称", "缺货总量"],
        fileName = "缺货明细";
      this.searchAll({
        url: this.rootAPI,
        name: "sorOutofstock/GetOutOfStockTotal",
        param: this.searchForm
      }).then(
        function(d) {
          if (d.aaData.length > 0) {
            let data = [];
            let vm = this;
            $.each(d.aaData, function(i, obj) {
              data.push({
                productName: obj.productName,
                totalweight: obj.totalweight
              });
            });
            this._csvExport(data, fields, filedsName, fileName);
          } else {
            this.$message({ type: "info", message: "无导出数据" });
          }
        }.bind(this)
      );
    },
    batchPrint() {
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
    printRow(o) {},
    printFun(o) {},
    reset() {
      this.searchForm.productName = "";
      this.handleCurrentChange(1)
    },
    lookOver(o) {
      this.tableRow = o;
      this.showModal = true;
    },
    ModalClose() {
      this.showModal = false;
    }
  }
};
</script>