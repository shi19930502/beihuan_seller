<template>
	<el-dialog custom-class="jz-modal" title="查看详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
			
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<div>{{scope.row.productName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderNumber" label="所属订单">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderNumber">
						<div>{{scope.row.orderNumber}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="outMete" label="缺货量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.outMete">
						<div>{{scope.row.outMete}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="jobNo" label="分拣员工号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.jobNo">
						<div>{{scope.row.jobNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="creatDate" label="缺货申请时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.creatDate">
						<div>{{scope.row.creatDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
             
		</elemTable>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" >关闭</elBtn>
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
      dataList: []
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
    }
  },
  mounted() {
      console.log('对象',this.tableRow);
      this.searchTable();
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    searchTable() {
        let user = local.get('sessionUser');
        var pa={
            customerId:parseInt(user.typeCode||0),
            productId:this.tableRow.productId
        };
      this._ajax({
        url: this.tootAPI,
        name: "sorOutofstock/GetOutOfStockDetail",
        param: pa
      }).then(this.renderTable);
    },
    beforeClose(done) {
      this.cancel();
    }
  }
};
</script>