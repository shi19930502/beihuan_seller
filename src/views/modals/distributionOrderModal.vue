<template>
	<el-dialog custom-class="jz-modal" title="查看详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
			
			<el-table-column prop="deliveryNo" label="送货单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.deliveryNo">
						<div>{{scope.row.deliveryNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="sellerBusinessNo" label="供应商商圈序号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sellerBusinessNo">
						<div>{{scope.row.sellerBusinessNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
          <el-table-column prop="distributionStatus" label="配送状态">
				<template slot-scope="scope">
					<toolTip :content="'未配送'" v-if="scope.row.distributionStatus==0">
                        <el-tag type="danger">未配送</el-tag>
					</toolTip>
					<toolTip :content="'配送中'" v-if="scope.row.distributionStatus==1">
                        <el-tag>配送中</el-tag>
					</toolTip>
					<toolTip :content="'已完成'" v-if="scope.row.distributionStatus==2">
						<el-tag type="success">已完成</el-tag>
					</toolTip>
				</template>
			</el-table-column>
                <el-table-column prop="distributedDate" label="完成配送时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributedDate">
						<div >{{scope.row.distributedDate}}</div>
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
//    console.log('对象',this.tableRow);
      this.searchTable();
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    searchTable() {
        var pa={
            distributionId:this.tableRow.id
        };
      this._ajax({
        url: this.distributeAPI+"distributionOrderitem/list",
        name: "",
        param: pa
      }).then(this.renderTable);
      
    },
    beforeClose(done) {
      this.cancel();
    }
  }
};
</script>