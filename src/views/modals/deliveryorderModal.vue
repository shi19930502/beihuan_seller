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
			 <el-table-column prop="skuName" label="规格名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuName">
						<div>{{scope.row.skuName}}</div>
					</toolTip>
				</template>
			</el-table-column>
<!--        <el-table-column prop="measurementUnit" label="单位">
				<template slot-scope="scope">
					<toolTip :content="scope.row.measurementUnit">
						<div>{{scope.row.measurementUnit}}</div>
					</toolTip>
				</template>
			</el-table-column>
             <el-table-column prop="price" label="单价">
				<template slot-scope="scope">
					<toolTip :content="scope.row.methodType ? scope.row.oriPrice : scope.row.price">
						<div>{{scope.row.methodType ? scope.row.oriPrice : scope.row.price}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="quantity" label="需求重量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.quantity">
						<div>{{scope.row.quantity}}&nbsp;{{scope.row.measurementUnit}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="itemTotal" label="需求金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.itemTotal">
						<div>{{scope.row.itemTotal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column> -->
             <el-table-column prop="sortingWeight" label="配送量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingWeight">
						<div>{{scope.row.sortingWeight}}&nbsp;{{scope.row.measurementUnit}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="sortingTotal" label="商品金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingTotal">
						<div>{{scope.row.sortingTotal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
            <!-- <el-table-column prop="batchId" label="批次号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.batchId">
						<div>{{scope.row.batchId}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="suyuanCode" label="溯源码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.suyuanCode">
						<div>{{scope.row.suyuanCode}}</div>
					</toolTip>
				</template>
			</el-table-column> -->
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
        var pa={
            orderId:this.tableRow.id
        };
      this._ajax({
        url: this.distributeAPI+"deliveryOrderitem/list",
        name: "",
        param: pa
      }).then(
				this.renderTable);
    },
    beforeClose(done) {
      this.cancel();
    }
  }
};
</script>