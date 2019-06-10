<template>
	<div>
		<searchInputItems>
			<searchInputItem name="订单号">
				<inputItem :value.sync="searchForm.orderUmber"></inputItem>
			</searchInputItem>
            <searchInputItem name="采购商">
				<inputItem :value.sync="searchForm.buyerName"></inputItem>
			</searchInputItem>
            <searchInputItem name="订单时间">
				<dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
          <iconBtn iconClass="el-icon-printer" content="批量打印备货单" @click="batchPrint" type="warning">批量打印备货单</iconBtn>
          <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
          <iconBtn iconClass="el-icon-sort" content="同步订单" @click="syncOrder">同步订单</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="orderUmber" label="订单编号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="buyerName" label="采购商">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<div>{{scope.row.buyerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="orderTotal" label="需求总金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderTotal/100">
						<div>{{scope.row.orderTotal/100}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="sortingOrderTotal" label="分拣总金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingOrderTotal/100">
						<div>{{scope.row.sortingOrderTotal/100||''}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="sortingStatus" label="分拣状态">
				<template slot-scope="scope">
           <toolTip :content="_dicValue(scope.row.sortingStatus, statuslist)">
		    			<span>{{_dicValue(scope.row.sortingStatus, statuslist)}}</span>
		    	</toolTip>
					<!-- <toolTip :content="scope.row.sortingStatus">
						<div v-if="scope.row.sortingStatus==0">未分拣</div>
                        <div v-if="scope.row.sortingStatus==1">已锁定</div>
                        <div v-if="scope.row.sortingStatus==2">已分拣</div>
                        <div v-else>无效分拣</div>
					</toolTip> -->
				</template>
			</el-table-column>
             <el-table-column prop="orderDate" label="订单时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderDate">
						<div>{{scope.row.orderDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
					<iconBtn iconClass="el-icon-printer" content="打印备货单" @click="printFun(scope.row)"></iconBtn>	  
					<!--<el-button type="success" @click="lookOver(scope.row)"  >编辑</el-button>-->
				</template>
			</el-table-column>
		</elemTable>
		<sortingtaskModal :modal='showModal'  v-if='showModal' @close='ModalClose' :tableRow='tableRow' @submit="modalSubmit"></sortingtaskModal>
    <div id="printtemp"></div>
	</div>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
import sortingtaskModal from "./modals/sortingtaskModal.vue";
export default {
  mixins: [mixin],
  components: { sortingtaskModal },
  data() {
    return {
      dataList: [],
      searchForm: {
        orderUmber: "",
        buyerName: "",
        startTime: "",
        endTime: ""
      },
      statuslist:[
        {key: '0', value: "未分拣"},
        {key: '1', value: "已锁定"},
        {key: '2', value: "已分拣"},
        {key: '3', value: "无效分拣"}
      ],
      dateRange: [],
      showModal: false,
      lodop: ""
    };
  },
  mounted() {
    this.searchTable();
  },
  methods: {
    searchTable() {
      let user = local.get('sessionUser');
      /**customerid  需要从缓存中获取 */
      this.searchForm.sellerId = parseInt(user.typeCode);
      if (this.dateRange && this.dateRange.length > 0) {
        this.searchForm.startTime = this.dateRange[0];
        this.searchForm.endTime = this.dateRange[1];
      }
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        url: this.rootAPI,
        name: "sorSortingorder/list",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    batchPrint() {
      if (this.rowSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {        
        this.rowSelection.forEach((function(el) {
          var sellerName = el.sellerName || ''
          this._ajax({
            name: "sorSortingorder/GetStockBillInfo",
            param: {
              orderIds: el.orderId
            },
          })
          .then((function(d) {            
            if (d.state == 0 && d.aaData && Array.isArray(d.aaData.detaillist) && Array.isArray(d.aaData.headlist) && d.aaData.detaillist.length > 0 && d.aaData.headlist.length > 0) {
                var detaillist = d.aaData.detaillist
                var headlist = d.aaData.headlist[0]
                var orderNumber = headlist.orderNumber || ''
                var buyerName = headlist.buyerName || ''
                var deliveryDate = ''
                if(headlist.deliveryDate) {
                  if(headlist.deliveryDate.split("~").length > 0) {
                    var startTime = headlist.deliveryDate.split("~")[0]
                    var endTime = headlist.deliveryDate.split("~")[1]
                    if(endTime.split(' ').length > 0) {
                      endTime = endTime.split(' ')[1]
                    }
                    deliveryDate = startTime + '-' + endTime
                  }else {
                    deliveryDate = headlist.deliveryDate || ''
                  }
                }
                var address = headlist.address || ''
                var contacts = headlist.contacts || ''
                var phoneNumber = headlist.phoneNumber || ''
                var customerIndex = headlist.customerIndex || ''
                var sellerTel = headlist.sellerTel || ''
                var marketTitle = this.$store.state.marketTitle || ''
                var printHtml = ''
                var trs = ''
                detaillist.forEach((function(em, index) {
                  let _index = index + 1
                  let skuName = em.skuName
                  let productName = em.productName
                  let sorterJobno = em.sorterJobno
                  let sortingTotal = ''
                  if(em.sortingTotal != null) {
                    sortingTotal = em.sortingTotal.div(100)
                  }
                  let sortingWeight = em.sortingWeight + em.measuerName
                  let itemHTML = `
                    <tr>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sorterJobno}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingTotal}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingWeight}</td>               
                    </tr>
                  `
                  trs = trs + itemHTML
                }).bind(this))                
                printHtml = printHtml + `
                  <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;">
                      <span>${marketTitle}(${sellerName})备货单</span>                                
                  </div>
                  <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                      <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span> 
                      <span style="position: absolute;right: 0;">订单号: ${orderNumber}</span>                                 
                  </div>
                  <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                      <span style="position: absolute;left: 0;">购货单位: ${buyerName}</span>
                      <span style="position: absolute;right: 0;">分拣编号: ${customerIndex}</span>
                  </div>
                  <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">                      
                      <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                  </div>
                  <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">                      
                      <span style="position: absolute;left: 0;">配送时间: ${deliveryDate}</span>
                  </div>
                  <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                      <span style="position: absolute;left: 0;">收货人: ${contacts}</span>
                      <span style="position: absolute;right: 0;">电话号码: ${phoneNumber}</span>
                  </div>
                  <table style="text-align: center; border-collapse: collapse; width: 100%;margin-bottom: 100px;">
                      <thead style="font-size:14px;">
                          <tr>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣员工号</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">价格(元)</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
                          </tr>
                      </thead>
                      ${trs}
                  </table>
                `   
                this.lodopoPrint('6%','5%','95%','100%',printHtml, detaillist.length)         
            }            
          }).bind(this))
        }).bind(this))
      }      
    },
    printFun(row) {
      var sellerName = row.sellerName || ''
      this._ajax({
        name: "sorSortingorder/GetStockBillInfo",
        param: {
          orderIds: row.orderId
        },
      }).then(d => {
        if (d.state == 0 && d.aaData && Array.isArray(d.aaData.detaillist) && Array.isArray(d.aaData.headlist) && d.aaData.detaillist.length > 0 && d.aaData.headlist.length > 0) {
          var trs = ''
          var printHtml = ''
          var detaillist = d.aaData.detaillist
          detaillist.forEach((function(el, index) {
              let _index = index + 1
              let skuName = el.skuName
              let productName = el.productName
              let sorterJobno = el.sorterJobno
              let sortingTotal = ''
              if(el.sortingTotal != null) {
                sortingTotal = el.sortingTotal.div(100)
              }
              let sortingWeight = el.sortingWeight + el.measuerName
              let itemHTML = `
                  <tr>
                      <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                      <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                      <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                      <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sorterJobno}</td>
                      <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingTotal}</td> 
                      <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingWeight}</td>                    
                  </tr>
              `
            trs = trs + itemHTML
          }).bind(this))
          var headlist = d.aaData.headlist[0]
          var orderNumber = headlist.orderNumber || ''
          var buyerName = headlist.buyerName || ''
          var deliveryDate = ''
          if(headlist.deliveryDate) {
            if(headlist.deliveryDate.split("~").length > 0) {
              var startTime = headlist.deliveryDate.split("~")[0]
              var endTime = headlist.deliveryDate.split("~")[1]
              if(endTime.split(' ').length > 0) {
                endTime = endTime.split(' ')[1]
              }
              deliveryDate = startTime + '-' + endTime
            }else {
              deliveryDate = headlist.deliveryDate || ''
            }
          }
          var address = headlist.address || ''
          var contacts = headlist.contacts || ''
          var phoneNumber = headlist.phoneNumber || ''
          var sellerTel = headlist.sellerTel || ''
          var customerIndex = headlist.customerIndex || ''
          var marketTitle = this.$store.state.marketTitle || ''
          var html = `<div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;">
                          <span>${marketTitle}${sellerName}备货单</span>                                
                      </div>
                      <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                          <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span> 
                          <span style="position: absolute;right: 0;">订单号: ${orderNumber}</span>                                 
                      </div>
                      <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                          <span style="position: absolute;left: 0;">购货单位: ${buyerName}</span>
                          <span style="position: absolute;right: 0;">分拣编号: ${customerIndex}</span>
                      </div>
                      <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">                      
                          <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                      </div>
                      <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">                      
                          <span style="position: absolute;left: 0;">配送时间: ${deliveryDate}</span>
                      </div>
                      <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                          <span style="position: absolute;left: 0;">收货人: ${contacts}</span>
                          <span style="position: absolute;right: 0;">电话号码: ${phoneNumber}</span>
                      </div>
                      <table style="text-align: center; border-collapse: collapse; width: 100%;margin-bottom: 100px;">
                          <thead style="font-size:18px;">
                              <tr>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣员工号</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">价格(元)</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
                              </tr>
                          </thead>
                          ${trs}
                      </table>`
          this.lodopoPrint('6%','5%','95%','100%',html, detaillist.length)  
        } else {
          this.$message({
            type: "failure",
            message: d.msg
          });
        }
      });
    },
    reset() {
      Object.assign(this.searchForm, {
        orderUmber: "",
        buyerName: "",
        startTime: "",
        endTime: ""
      });
      this.dateRange = [];
      this.handleCurrentChange(1)
    },
    lookOver(o) {
      this.tableRow = o;
      this.showModal = true;
    },
    ModalClose() {
      this.showModal = false;
    },
    syncOrder(){
      let user = local.get('sessionUser');
      this._ajax({
        url: this.rootAPI,
        name: "sortingClient/GetSortingOrder",
        param: {customerId:parseInt(user.typeCode||0)},
        loading: "dataLoading"
      }).then(d=>{
          if (d.state == 0) {
              this.$message({
                type: "success",
                message: d.msg
              });
              this.searchTable();
            } else {
              this.$message({
                type: "failure",
                message: d.msg
              });
            }
            
      });
    }
  }
};
</script>