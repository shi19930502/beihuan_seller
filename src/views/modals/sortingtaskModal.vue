<template>
	<el-dialog custom-class="jz-modal" title="查看详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
			<!-- <el-table-column type="selection" width="55"></el-table-column> -->
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<div>{{scope.row.productName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="skuName" label="规格名称" width="150">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuName">
						<div>{{scope.row.skuName}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="measuerName" label="单位">
				<template slot-scope="scope">
					<toolTip :content="scope.row.measuerName">
						<div>{{scope.row.measuerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="transPriceForDecimal" label="单价">
				<template slot-scope="scope">
					<toolTip :content="scope.row.transPriceForDecimal">
						<div>{{scope.row.transPriceForDecimal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="weight" label="需求量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.weight">
						<div>{{scope.row.weight}}&nbsp;{{scope.row.measuerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="itemTotal" label="需求金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.itemTotal">
						<div>{{scope.row.itemTotal/100}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
      <el-table-column prop="sortingWeight" label="分拣量" :width="modalTableInputWidth">
				<template slot-scope="scope">
					<div class="flex-y-center">
                        <!-- <inputItem :value.sync="scope.row.sortingWeight" @blur="changeSortingWeight(scope.row)"></inputItem> -->
              <div style="width: 50px;">{{scope.row.sortingWeight}}{{scope.row.measuerName}}</div>
          </div>
				</template>
			</el-table-column>
            <el-table-column prop="sortingTotal" label="分拣金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingTotal">
						<div>{{scope.row.sortingTotal||''}}&nbsp;元</div>
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
            <el-table-column prop="sorterJobno" label="分拣工号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sorterJobno">
						<div>{{scope.row.sorterJobno}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="sortingStatus" label="分拣状态">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingStatus">
						<div v-if="scope.row.sortingStatus==0">未分拣</div>
                        <div v-if="scope.row.sortingStatus==1">已锁定</div>
                        <div v-if="scope.row.sortingStatus==2">已分拣</div>
                        <div v-else>无效分拣</div>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
		<div slot="footer" class="dialog-footer flex-x-end">
			<!-- <elBtn type="success" @click="validSubmit">确认提交</elBtn> -->
			<!-- <elBtn @click="printSuyuan">打印溯源码</elBtn> -->
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
      dataList: [],
      form: {
            sortingOrderTotal: null,
            orderUmber: '',
        },
      validConfirm: {
	        flag: true,
	        msg: ''
	    },
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
      Object.assign(this.form, {
      	orderUmber: this.tableRow.orderUmber
      })
      this.searchTable();
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    searchTable() {
        var pa={
            orderId:this.tableRow.orderId
        };
      this._ajax({
        url: this.tootAPI,
        name: "sorSortingtask/Getsortingtaskdetail",
        param: pa
      })
      .then((function(d) {
      	let dataList = d.aaData
        if (Array.isArray(dataList)) {
        	dataList.forEach((function(el) {
        		this.orderSum(el)
        	}).bind(this))
            this.dataList = dataList
        }
      }).bind(this))
    },
    beforeClose(done) {
      this.cancel();
    },
    changeSortingWeight(row) {
    	if(!this.weightFloat.test(row.sortingWeight) || row.sortingWeight <= 0) {
            this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过三位'});
        }else {
            this.orderSum(row)
        }
    },
    orderSum(row) {            
        row.sortingTotal = this._parseFloat(row.transPriceForDecimal.mul(row.sortingWeight), 2)             
        var sortingOrderTotal = 0
        this.dataList.forEach(function(el) {
            sortingOrderTotal = sortingOrderTotal.add(el.sortingTotal)
        })
        Object.assign(this.form, {
            sortingOrderTotal,
        })
    },
    validSubmit() {
    	var flag = true
    	this.dataList.forEach((function(el) {
            if(!this.weightFloat.test(el.sortingWeight) || el.sortingWeight <= 0) {
            	flag = false
            }
        }).bind(this))
        if(flag) {
        	this.submit()
        }else {
        	 this.$message({type: 'warning', message: '分拣量请输入大于0的数字，小数位数不超过三位'});
        }
    },
    submit() {
      var arr = [], sortingTaskDetails = []
      this.dataList.forEach((function(el) {
        var o = {
          id: el.orderitemId,
          sortingWeight: el.sortingWeight,
          sortingTotal: el.sortingTotal.mul(100)
        }
        arr.push(o)
        var p = {
          id: el.Id,
          sortingWeight: el.sortingWeight,
          sortingTotal: el.sortingTotal.mul(100)
        }
        sortingTaskDetails.push(p)
      }).bind(this))
      this._ajax({name: 'orderitem/batchUpdateSort', param: {orderitems: JSON.stringify(arr)}, arr:true})
          .then((function(d) {
            if(d.state == 0) {
              var order = {
                orderUmber: this.form.orderUmber,
                sortingOrderTotal: this.form.sortingOrderTotal
              }
              return this._updateOrder(order)
            }
          }).bind(this))
          .then((function(d) {
            if(d.state == 0) {
              return this._ajax({name: 'sorSortingtask/batchUpdate', param: {sortingTaskDetails: JSON.stringify(sortingTaskDetails)}, arr:true})
            }            
          }).bind(this))
          .then((function(d) {
            if(d.state == 0) {
              return this._ajax({name: 'sorSortingorder/update', param: {
                orderId: this.tableRow.orderId,
                sortingOrderTotal: this.form.sortingOrderTotal
              }})
            }
          }).bind(this))
          .then((function(d) {
            if(d.state == 0) {
              this.$message({ type: 'success', message: '操作完成'});
              this.$emit('submit')
            }
          }).bind(this))
    },
    printSuyuan() {
        var customerIndex = this.tableRow.customerIndex || ''
        var buyerName = this.tableRow.buyerName || ''
        if(this.rowSelection.length > 0) {
          this.back2Top()
          this.SelectAsDefaultPrinter((function() {
            this.rowSelection.forEach((function(el, index) {
                let productName = el.productName || ''
                let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                let suyuanCode = el.suyuanCode || ''
                let sorterJobno = el.sorterJobno || ''
                let city = ''
                if(configs.city === '银川') {
                    city = '银川公益市场重要产品追溯体系'
                }
                if(configs.city === '临沂') {
                    city = '临沂重要产品追溯体系'
                }
                if(configs.city === '农鲜汇') {
                    city = '银川公益市场重要产品追溯体系'
                }
                let date = this._moment({
                    format: 'YYYY-MM-DD HH:mm:ss'
                })
                var html = `
                    <div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">商家编号:<span style="font-weight: bolder;font-size: 15px;padding-left:30px;">${customerIndex}</span></div>
                    <div style="font-size: 13px;height: 20px;line-height: 20px;">商家:${buyerName}</div>
                    <div style="font-size: 13px;height: 20px;line-height: 20px;">商品:${productName}</div>
                    <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:${sortingWeight}</div>
                    <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣人员:${sorterJobno}</div>
                    <div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">${date}</div>
                    <div style="text-align: center;font-size: 12px;height: 20px;line-height: 20px;">${city}</div>
                `         
                this.Gprinter(html, configs.suyuanURL + suyuanCode)
            }).bind(this))
          }).bind(this))
        }                 
    },
  }
};
</script>