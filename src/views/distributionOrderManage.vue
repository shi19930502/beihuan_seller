<template>
	<div>
		<searchInputItems>
			<searchInputItem name="配送单号">
				<inputItem :value.sync="searchForm.distributionNo"></inputItem>
			</searchInputItem>
           <searchInputItem name="车牌号">
				<inputItem :value.sync="searchForm.vehicleNo"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                    <iconBtn iconClass="el-icon-setting" content="分配车辆" @click="DistributiveVehicles" type="success">分配车辆</iconBtn>
                    <iconBtn iconClass="el-icon-printer" content="批量打印配送单" @click="batchPrint" type="warning">批量打印配送单</iconBtn>
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="distributionNo" label="配送单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributionNo">
						<div>{{scope.row.distributionNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
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
						<div>{{scope.row.driverPhone}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="carrierName" label="承运商">
				<template slot-scope="scope">
					<toolTip :content="scope.row.carrierName">
						<div >{{scope.row.carrierName}}</div>
					</toolTip>
				</template>
			</el-table-column>
             <el-table-column prop="distributionStatus" label="配送状态">
				<template slot-scope="scope">
          <toolTip :content="_dicValue(scope.row.distributionStatus, statuslist)">
		    			<span>{{_dicValue(scope.row.distributionStatus, statuslist)}}</span>
		    	</toolTip>
					<!-- <toolTip :content="scope.row.distributionStatus">
                        <el-tag type="danger" v-if="scope.row.distributionStatus==0">未配送</el-tag>
                        <el-tag v-if="scope.row.distributionStatus==1">配送中</el-tag>
						<el-tag type="success" v-else>已完成</el-tag>
					</toolTip> -->
				</template>
			</el-table-column>
                <el-table-column prop="distributedDate" label="完成配送时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributedDate">
						<div >{{scope.row.distributedDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="350">
				<template slot-scope="scope">

					<iconBtn iconClass="el-icon-view" content="查看详情" @click="lookOver(scope.row)" type="info" plain style="margin-bottom:10px;margin-left:10px;">查看详情</iconBtn>
					<iconBtn iconClass="el-icon-printer" content="打印配送单" @click="printRow(scope.row)" type="warning" plain>打印配送单</iconBtn>	  
					<iconBtn iconClass="el-icon-check" content="确认配送" v-if="scope.row.distributionStatus==0" @click="confirmdistribute(scope.row)" type="primary" plain>确认配送</iconBtn>
          			<iconBtn iconClass="el-icon-edit"   content="编辑车辆" v-if="scope.row.distributionStatus==0" @click="editdistribute(scope.row)" type="primary" plain>编辑车辆</iconBtn>	  
                    <iconBtn iconClass="el-icon-circle-check-outline" content="配送完成" v-if="scope.row.distributionStatus==1" @click="distributecomplite(scope.row)" type="success" plain>配送完成</iconBtn>
                    <iconBtn iconClass="el-icon-check" content="撤销" v-if="scope.row.distributionStatus==0" @click="returndistribute(scope.row)" type="info" plain>撤销</iconBtn>	
				</template>
			</el-table-column>
		</elemTable>
		<distributionOrderModal :modal='showModal'  v-if='showModal' @close='ModalClose' :tableRow='tableRow'></distributionOrderModal>
    <distributeCarModal :modal='showCarModal'  v-if='showCarModal' @refreshtable="refreshtable" @close='ModalCarClose' :tableCarRow='tableCarRow'></distributeCarModal>
    <distributeEditCarModal :modal='showEditCarModal' @refreshtable="refreshtable" v-if='showEditCarModal'  :tableCarRow='tableEditCarRow' @close='ModalEditCarClose'></distributeEditCarModal>
    <div id="printtemp"></div>
	</div>
</template>
<script>
import local from "../local.js";
import mixin from "../mixin/mixin.js";
// import "../../lib/printplugin/LodopFuncs.js";
// import "../../lib/printplugin/lodopPrinter.js";
import distributionOrderModal from "./modals/distributionOrderModal.vue";
import distributeCarModal from "./modals/distributeCarModal.vue";
import distributeEditCarModal from "./modals/distributeEditCarModal.vue";
export default {
  mixins: [mixin],
  components: { distributionOrderModal, distributeCarModal,distributeEditCarModal },
  data() {
    return {
      dataList: [],
      searchForm: {
        distributionNo: "",
        vehicleNo: ""
      },
      dateRange: [],
      showModal: false,
      lodop: "",
      showCarModal: false,
      showEditCarModal:false,
      statuslist:[
        {key: '0', value: "未配送"},
        {key: '1', value: "运输中"},
        {key: '2', value: "已完成"}
      ]
    };
  },
  mounted() {
    this.searchTable();
    this.lodop = new lodopPrinter();
  },
  methods: {
    searchTable() {
      let user = local.get("sessionUser");
      /**customerid  需要从缓存中获取 */
      this.searchForm.distributorId = parseInt(user.typeCode.trim() || 0);
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        url: this.distributeAPI + "distributionOrder/GetDeliveryOrderList",
        name: "",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(
        this.renderTable);
    },
    refreshtable(){
      this.searchTable();
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
        o.distributionIds = arr.join(",");
        this.print(o);
      }
    },
    print(o) {
      var vm = this
         this._ajax({
              url: this.distributeAPI +"distributionOrderitem/GetPrintDistributionOrders",
              name: "",
              param: o,
              loading: "dataLoading"
          }).then((function(d) {
             if (d.state == 0 && d.aaData && Array.isArray(d.aaData) && d.aaData.length > 0) {
                 var trs = '';
                 
                 var totalItem = 0;
                 d.aaData.forEach((function(em, index) {
                  var printHtml='';
                     var itemHTML = '';
                     var numTotle = 0;
                     em.orderinfo.forEach((function (em1, index) {
                         totalItem++;
                         let _index = em1.buyerBusinessNo || '';
                        var distributionTime = ''
                        if(em1.distributionTime) {
                          if(em1.distributionTime.split("~").length > 0) {
                            var startTime = em1.distributionTime.split("~")[0]
                            var endTime = em1.distributionTime.split("~")[1]
                            if(endTime.split(' ').length > 0) {
                              endTime = endTime.split(' ')[1]
                            }
                            distributionTime = startTime + '-' + endTime
                          }else {
                            distributionTime = em1.distributionTime || ''
                          }
                        }
                         let sellerName = em1.sellerName || '';
                         let buyerName = em1.buyerName || '';
                         let shippingAdd = em1.shippingAdd || '';
                         let goodsNumber = em1.goodsNumber || '';
                         let receiver = em1.receiver || '';
                         let phoneNumber = em1.phoneNumber || '';
                         let orderUmber = em1.orderUmber || ''
                         numTotle++;
                         var item = `
<tr>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${_index}</td>
  <td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${orderUmber}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${sellerName}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${distributionTime}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${buyerName}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${shippingAdd}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${goodsNumber}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${receiver}</td>
	<td style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">${phoneNumber}</td>
</tr>
`
                         itemHTML += item
                     }))

                     var distributionNo = em.maininfo.distributionNo || '';
                     var carrierName = em.maininfo.carrierName || '';
                     var vehicleNo = em.maininfo.vehicleNo || '';
                     var driverName = em.maininfo.driverName || '';
                     var distributeDate = em.maininfo.distributeDate || '';
                     var marketTitle = this.$store.state.marketTitle || ''
                     var header = `<div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;">
                                        <span>${marketTitle}配送单</span>
                                    </div>
                                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                                        <span style="position: absolute;left: 0;">配送企业: ${carrierName}</span>
                                        <span style="position: absolute;right: 0;">配送单号: ${distributionNo}</span>
                                    </div>
                                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                                        <span style="position: absolute;left: 0;">配送车辆: ${vehicleNo}</span>
                                        <span style="position: absolute;right: 0;">配送员: ${driverName}</span>
                                    </div>
                                    <table style="text-align: center; border-collapse: collapse; width: 100%;">
                                        <thead style="font-size:14px;">
                                        <tr>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">序号</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">订单号</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">供应商</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">预期时间</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">采购商名称</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">采购商地址</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">商品数量</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">收货人</th>
                                            <th style="text-align: center; border: solid 1px black;word-break:break-word;font-size: 12px;">电话</th>
                                        </tr>
                                        </thead>
                                        ${itemHTML}
                                    </table>
                                    `

                     var footer = `
                                    <div style="position: relative;text-align: center;height: 20pxline-height: 20pxfont-size: 13px;">
                                        <span style="position: absolute;left: 0;">配送日期: ${distributeDate}</span>
                                        <span style="position: absolute;right: 0;">配送数量: ${numTotle}</span>
                                    </div>
                                    `

                     printHtml += header;
                     printHtml += footer;
                     this.lodopoPrint('6%','5%','95%','100%',printHtml, em.orderinfo.length)
                 }).bind(this))
             }
          }).bind(this))
      },
    printRow(o) {
      var ob = {
        distributionIds: o.id
      };
      this.print(ob);
    },
    reset() {
      Object.assign(this.searchForm, {
        distributionNo: "",
        vehicleNo: ""
      });
      this.searchTable()
    },
    lookOver(o) {
      this.tableRow = o;
      this.showModal = true;
    },
    ModalClose() {
      this.showModal = false;
    },
    ModalCarClose() {
      this.showCarModal = false;
    },
     ModalEditCarClose() {
      this.showEditCarModal = false;
    },
    DistributiveVehicles() {
      this.showCarModal = true;
    },
    editdistribute(o){
      // let ob = {
      //   distributionId: o.id,
      //   distributionStatus: 1
      // };
      // this.updatedistributionStatus(ob);
      let ob={
        oldvehicleId:o.vehicleId,
        Id:o.id
      }
      this.tableEditCarRow=ob
      this.showEditCarModal = true;
    },
    confirmdistribute(o) {
      let ob = {
        distributionId: o.id,
        distributionStatus: 1
      };
      this.updatedistributionStatus(ob);
    },
    returndistribute(row) {
      this.confirm('确定撤销?', (function() {
					var o = {
						id: row.id
					}
					this._ajax({
							url: this.distributeAPI + 'distributionOrder/revoke',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '删除成功'
								});
							} 
							this.handleCurrentChange(1);
							this.searchTable();
						}).bind(this))
				}).bind(this))
    },
    distributecomplite(o) {
      let ob = {
        distributionId: o.id,
        distributionStatus: 2
      };
      this.updatedistributionStatus(ob);
    },
    updatedistributionStatus(o) {
      this._ajax({
        url: this.distributeAPI + "distributionOrder/UpdatedistributionStatus",
        name: "",
        param: o,
        loading: "dataLoading"
      }).then(d => {
        if (d.state == 0) {
          this.$message({
            type: "success",
            message: "更新成功"
          });
        } else {
          this.$message({
            type: "failure",
            message: d.msg
          });
        }
        this.searchTable();
      });
    }
  }
};
</script>