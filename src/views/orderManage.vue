<template>
  <div class="page-order-manage">
    <searchInputItems>
      <searchInputItem name="采购商">
        <inputItem :value.sync="searchForm.buyerName" @enter="searchTable"></inputItem>
      </searchInputItem>
      <searchInputItem name="订单号">
        <inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
      </searchInputItem>
      <searchInputItem name="支付类型">
        <selectInput :clearable="true" :value.sync="searchForm.payType" @selectChange="searchTable">
          <el-option
            v-for="item in payTypeList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </selectInput>
      </searchInputItem>
      <searchInputItem name="配送日期">
        <dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
      </searchInputItem>
    </searchInputItems>
    <optionItems>
      <template slot="right">
        <el-button-group>
          <elBtn
            iconClass="el-icon-plus"
            content="新增"
            type="success"
            v-if="useType === 'merchant'"
            @click="create"
          >新建</elBtn>
          <elBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</elBtn>
          <elBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</elBtn>
          <elBtn
            iconClass="el-icon-refresh"
            content="批量受理"
            type="warning"
            @click="batchUpdateOrderState('1')"
            v-if="useType === 'merchant' && tabActive == 0"
          >批量受理</elBtn>
          <elBtn
            iconClass="el-icon-refresh"
            content="批量发货"
            type="warning"
            @click="batchUpdateOrderState('3')"
            v-if="useType === 'merchant' && tabActive == 2"
          >批量发货</elBtn>
          <elBtn
            iconClass="el-icon-refresh"
            content="批量打印备货单"
            @click="batchPrint"
            v-if="useType === 'merchant' && tabActive == 2"
          >批量打印备货单</elBtn>
          <elBtn
            iconClass="el-icon-refresh"
            content="批量确认收货"
            type="success"
            @click="batchUpdateOrderState('4')"
            v-if="useType === 'buyer'"
          >批量确认收货</elBtn>
        </el-button-group>
      </template>
    </optionItems>
    <div class="tab-box">
      <el-tabs v-model="tabActive" @tab-click="tabClick">
        <el-tab-pane label="待受理" name="0"></el-tab-pane>
        <el-tab-pane label="待分拣" name="1"></el-tab-pane>
        <el-tab-pane label="待配送" name="2"></el-tab-pane>
        <el-tab-pane label="配送中" name="3"></el-tab-pane>
        <el-tab-pane label="已收货" name="4"></el-tab-pane>
        <el-tab-pane label="已完成" name="5"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="6"></el-tab-pane>
        <el-tab-pane label="已取消" name="7"></el-tab-pane>
        <el-tab-pane label="已评价" name="8"></el-tab-pane>
        <el-tab-pane label="已赊销" name="-1"></el-tab-pane>
        <el-tab-pane label="全部" name="all"></el-tab-pane>
      </el-tabs>
    </div>
    <elemTable
      :dataList="dataList"
      :currentPage="pageNum"
      :pageSize="pageSize"
      :pageTotal="pageTotal"
      :loading="dataLoading"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      @selectionChange="selectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column label="商品信息" width="450" class-name="order-item-cell">
        <template slot-scope="scope">
          <orderProductColTmp :row="scope.row"></orderProductColTmp>
        </template>
      </el-table-column>
      <el-table-column prop="buyerName" label="采购商">
        <template slot-scope="scope">
          <span>{{scope.row.buyerName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sellerName" label="供应商">
        <template slot-scope="scope">
          <span>{{scope.row.sellerName}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="tabActive=='-1'" label="已收款(元)">
        <template slot-scope="scope">
          <span>{{_priceFormat(scope.row.sortingOrderTotal-scope.row.orderUnpaid)}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="tabActive=='-1'" label="未收款(元)" width="150" prop="orderUnpaid">
        <template slot-scope="scope">
          <span>{{_priceFormat(scope.row.orderUnpaid)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="配送地址" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.shippingAdd}}</span>
        </template>
      </el-table-column>
      <el-table-column label="期望配送时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.distributionTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderStatusName" label="订单状态">
        <template slot-scope="scope">
          <span>{{scope.row.orderStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shippingStatusName" label="物流状态">
        <template slot-scope="scope">
          <span>{{scope.row.shippingStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payStatusName" label="付款状态">
        <template slot-scope="scope">
          <span>{{scope.row.payStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payWayStatusName" label="支付类型">
        <template slot-scope="scope">
          <span>{{scope.row.payWayStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button-group>
            <elBtn
              v-if="scope.row.orderStatusId == 0 && useType === 'merchant' && scope.row.rowShow && posOrder(scope.row)"
              type="success"
              @click="updateOrderState(scope.row, '1')"
            >确认受理</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 0 && useType === 'merchant' && posOrder(scope.row)"
              type="danger"
              @click="orderRefuse(scope.row, '6')"
            >拒绝</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 0 && useType === 'buyer' && posOrder(scope.row)"
              type="warning"
              @click="orderRefuse(scope.row, '7')"
            >取消</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 1 && useType === 'merchant' && posOrder(scope.row)"
              type="success"
              @click="orderSort(scope.row)"
            >确认分拣</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 2 && (scope.row.distributorId === null || !scope.row.distributorId) && useType === 'merchant' && scope.row.distributionType == 1 && posOrder(scope.row)"
              type="primary"
              @click="selectDistributor(scope.row)"
            >选择配送商</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 2 && scope.row.distributorId != null && scope.row.distributorId
		    				&& useType === 'merchant' && scope.row.distributionType == 1 && posOrder(scope.row)"
              type="warning"
              @click="invoke(scope.row)"
            >撤销配送</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 2 && (scope.row.distributorId === null || !scope.row.distributorId) && useType === 'merchant' && scope.row.rowShow && posOrder(scope.row)"
              type="success"
              @click="deliverOrder(scope.row)"
            >确认发货</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 3 && (scope.row.distributorId === null || !scope.row.distributorId) && posOrder(scope.row)"
              type="success"
              @click="orderDetail(scope.row)"
            >确认收货</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 4 && scope.row.paymentStatusId == 0 && useType === 'merchant' && scope.row.rowShow && posOrder(scope.row)"
              type="success"
              @click="updateOrderState(scope.row, '5')"
            >确认收款</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 8 && scope.row.paymentStatusId == 0 && useType === 'merchant' && scope.row.rowShow && posOrder(scope.row)"
              type="success"
              @click="updateOrderState(scope.row, '8')"
            >确认收款</elBtn>
            <elBtn
              v-if="scope.row.orderStatusId == 4 && scope.row.paymentStatusId == 0 && useType === 'merchant' && scope.row.rowShow && posOrder(scope.row)"
              type="warning"
              @click="sellOnCredit(scope.row)"
            >赊销</elBtn>
            <!-- <elBtn
              v-if="scope.row.orderStatusId == 8 && scope.row.paymentStatusId == 0 && useType === 'merchant' && scope.row.rowShow && posOrder(scope.row)"
              type="warning"
              @click="sellOnCredit(scope.row)"
            >赊销</elBtn>-->
            <elBtn
              v-if="tabActive=='-1'||(tabActive=='all'&&scope.row.orderUnpaid>0)"
              type="success"
              @click="repayment(scope.row)"
            >收款</elBtn>
            <elBtn
              v-if="tabActive=='-1'||(tabActive=='all'&&scope.row.orderUnpaid>0)"
              type="warning"
              @click="flatAccount(scope.row)"
            >平账</elBtn>
            <elBtn @click="orderDetail(scope.row)" type="primary">订单详情</elBtn>
          </el-button-group>
        </template>
      </el-table-column>
    </elemTable>
    <orderItemsModal
      v-if="modalShow"
      :modal="modalShow"
      @close="modalClose"
      :params="modalParams"
      @submit="modalSubmit"
    ></orderItemsModal>
    <distributorListModal
      v-if="distributorListModal"
      :modal="distributorListModal"
      @close="distributorListModalClose"
      @submit="distributorListModalSubmit"
      :params="distributorListModalParams"
      title="选择配货商"
    ></distributorListModal>
    <orderRefuseModal
      v-if="orderRefuseModal"
      :modal="orderRefuseModal"
      @close="orderRefuseModalClose"
      @submit="orderRefuseModalSubmit"
      :params="orderRefuseModalParams"
    ></orderRefuseModal>
    <orderCreateModal
      v-if="orderCreateModal"
      :modal="orderCreateModal"
      @close="orderCreateModalClose"
      @submit="orderCreateModalSubmit"
    ></orderCreateModal>
    <div id="printDiv"></div>

    <!-- 收款弹框 -->
    <el-dialog
      custom-class="jz-modal"
      title="赊销收款"
      :visible="modal"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        class="modal-form"
        v-if="modal"
        :model="form"
        ref="form1"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="收款金额" prop="orderPaid">
              <inputItem :value.sync="form.orderPaid" :maxlength="20"></inputItem>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div style="padding-left: 100px;">
              已收款：
              <span style="font-size:16px;color:red">{{form.haspay}}</span>元 &nbsp;&nbsp;&nbsp;&nbsp;
              未收款：
              <span style="font-size:16px;color:red">{{form.nopay}}</span>元
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer flex-x-end">
        <elBtn @click="cancel">取消</elBtn>
        <elBtn @click="submit" type="primary" :disabled="none">提交</elBtn>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixin from "../mixin/mixin.js";
import local from "../local.js";
import orderItemsModal from "./modals/orderItemsModal.vue";
import distributorListModal from "./modals/distributorListModal.vue";
import orderProductColTmp from "./tmp/orderProductCol.vue";
import orderRefuseModal from "./modals/orderRefuseModal.vue";
import orderCreateModal from "./modals/orderCreateModal.vue";
import configs from "../configs.js";
export default {
  mixins: [mixin],
  components: {
    orderItemsModal,
    distributorListModal,
    orderProductColTmp,
    orderRefuseModal,
    orderCreateModal
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入收款金额"));
      } else {
        if (
          /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)
        ) {
          callback();
        } else {
          callback(new Error("请输入最多两位小数的数字"));
        }
      }
    };
    return {
      searchForm: {
        buyerName: "",
        orderUmber: "",
        orderStatusId: "0",
        shippingStatusId: "",
        paymentStatusId: "",
        payType: "",
        distributionTimeBegin: "",
        distributionTimeEnd: ""
      },
      orderStateList: [],
      shippingStateList: [],
      paymentStateList: [],
      payTypeList: [],
      dataList: [],
      dateRange: [],
      distributorListModal: false,
      distributorListModalParams: {},
      useType: "",
      tabActive: "0",
      orderRefuseModal: false,
      orderRefuseModalParams: {},
      orderCreateModal: false,
      loading: false,
      modal: false,
      form: {
        orderPaid: 0,
        haspay: 0,
        nopay: 0
      },
      repaymentrow: {},
      rules: {
        orderPaid: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  beforeMount() {
    this.useType = this.$route.meta.useType;
  },
  mounted() {
    if (typeof this.$route.params.tabActive === "string") {
      this.tabActive = this.$route.params.tabActive;
    }
    Object.assign(this.searchForm, {
      orderStatusId: this.tabActive
    });
    this._searchDic("ORDER_STATUS").then(
      function(d) {
        this.orderStateList = this._dicKey(d);
      }.bind(this)
    );
    this._searchDic("TRANSPORT_STATUS").then(
      function(d) {
        this.shippingStateList = this._dicKey(d);
      }.bind(this)
    );
    this._searchDic("PAY_STATUS").then(
      function(d) {
        this.paymentStateList = this._dicKey(d);
      }.bind(this)
    );
    this._searchDic("PAY_WAY").then(
      function(d) {
        this.payTypeList = this._dicKey(d);
      }.bind(this)
    );
    this.searchTable();
    console.log(this.$store.state.marketTitle);
  },
  methods: {
    beforeClose(done) {
      this.cancel();
      done();
    },
    cancel() {
      this.modal = false;
      this.form.haspay = 0;
      this.form.nopay = 0;
    },
    submit() {
      let _that = this;
      let row = this.repaymentrow;
      this.$refs["form1"].validate(valid => {
        if (valid) {
          let o = {
            orderId: row.id,
            orderPaid: _that.form.orderPaid * 100,
            paidType: 2,
            sellerId: row.sellerId,
            sellerName: row.sellerName,
            buyerId: row.buyerId,
            buyerName: row.buyerName,
            orderNumber: row.orderUmber
          };
          _that
            ._ajax({
              name: "orderselloncredit/repayment",
              param: o,
              loading: "dataLoading"
            })
            .then(function(d) {
              if (d.state == 0) {
                _that.$message({ type: "success", message: "收款成功" });
                _that.searchTable();
                _that.modal = false;
              } else {
                _that.$message({ type: "error", message: "收款失败:" + d.msg });
                _that.modal = false;
              }
            });
        } else {
          return false;
        }
      });
    },
    //赊销收款
    repayment(row) {
      this.repaymentrow = row;
      this.form.haspay = this._priceFormat(
        row.sortingOrderTotal - row.orderUnpaid
      );
      this.form.nopay = this._priceFormat(row.orderUnpaid);
      this.modal = true;
    },
    //平账
    flatAccount(row) {
      let _that = this;
      let o = {
        orderId: row.id,
        orderPaid: row.orderUnpaid,
        paidType: 3,
        sellerId: row.sellerId,
        sellerName: row.sellerName,
        buyerId: row.buyerId,
        buyerName: row.buyerName,
        orderNumber: row.orderUmber
      };
      _that.confirm(
        "还剩" + _that._priceFormat(row.orderUnpaid) + "元未收款，确定平账吗？",
        function() {
          _that
            ._ajax({
              name: "orderselloncredit/repayment",
              param: o,
              loading: "dataLoading"
            })
            .then(_that.searchTable);
        }
      );
    },
    //赊销
    sellOnCredit(row) {
      let _that = this;
      _that.confirm(
        "赊销金额为：" +
          _that._priceFormat(row.sortingOrderTotal) +
          "元，确定赊销吗？",
        function() {
          _that
            ._ajax({
              name: "order/sellOnCredit",
              param: { id: row.id },
              loading: "dataLoading"
            })
            .then(_that.searchTable);
        }
      );
    },
    searchTable() {
      var dateRange = {
        distributionTimeBegin: "",
        distributionTimeEnd: ""
      };
      if (this.dateRange && this.dateRange.length > 0) {
        dateRange = {
          distributionTimeBegin: this.dateRange[0],
          distributionTimeEnd: this.dateRange[1]
        };
      }
      Object.assign(this.searchForm, dateRange, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      return this._ajax({
        name: "order/listByUser",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    handleDataList(d) {
      return d.aaData.map(function(el) {
        var str = "";
        if (el.distributionTimeBegin) {
          if (el.distributionTimeBegin.split(":").length > 0) {
            str =
              str +
              el.distributionTimeBegin.split(":")[0] +
              ":" +
              el.distributionTimeBegin.split(":")[1];
          } else {
            str = str + el.distributionTimeBegin;
          }
        }
        if (el.distributionTimeEnd) {
          if (el.distributionTimeEnd.split(":").length > 0) {
            str =
              str +
              "-" +
              el.distributionTimeEnd.split(" ")[1].split(":")[0] +
              ":" +
              el.distributionTimeEnd.split(" ")[1].split(":")[1];
          } else {
            str = str + "-" + el.distributionTimeEnd;
          }
        }
        el.distributionTime = str;
        el.rowShow = true;
        return el;
      });
    },
    reset() {
      Object.assign(this.searchForm, {
        buyerName: "",
        orderUmber: "",
        shippingStatusId: "",
        paymentStatusId: "",
        payType: "",
        distributionTimeBegin: "",
        distributionTimeEnd: ""
      });
      this.dateRange = [];
      this.handleCurrentChange(1);
    },
    orderSort(row) {
      if (row.orderStatusId == 1) {
        var itemList = row.orderitemList;
        var arr = [];
        if (Array.isArray(itemList)) {
          itemList.forEach(
            function(el) {
              console.log("批次号" + el.batchId);
              var batchId = el.batchId;
              if (!batchId) {
                arr.push(el.productName);
              }
            }.bind(this)
          );
        }
        if (arr.length > 0) {
          this.confirm(
            arr.join(",") + "未做进场，请先做进场",
            function() {
              this._go("inMarketDetail");
            }.bind(this)
          );
        } else {
          this.orderDetail(row);
        }
      } else {
        this.orderDetail(row);
      }
    },
    orderDetail(row) {
      this.modalEdit(row);
    },
    updateOrderState(row, state) {
      row.rowShow = false;
      var o = {};
      Object.assign(o, row);
      Object.assign(o, {
        orderStatusId: state
      });
      if (state === "1") {
        var ids = [o.id];
        this._batchUpdateOrderState(ids, state).then(this.searchTable);
      } else {
        if (state === "3" && row.distributionType == 1) {
          var sessionUser = local.get("sessionUser");
          var customerId = sessionUser.typeCode;
          this._customerById(customerId).then(
            function(d) {
              if (d.aaData.length > 0) {
                var customer = d.aaData[0];
                if (customer.isDistribution == 1) {
                  Object.assign(o, {
                    distribute: 1,
                    distributorId: customer.id,
                    orderStatusId: "2"
                  });
                  this._updateOrder(o)
                    // .then((function(d) {
                    // 	if(d && d.state === 0) {
                    // 		this.$message({type: 'success', message: '操作完成'})
                    // 	}
                    // }).bind(this))
                    .then(this.searchTable);
                } else {
                  Object.assign(o, {
                    shippingStatusId: "1"
                  });
                  this._updateOrder(o)
                    // .then((function(d) {
                    // 	if(d && d.state === 0) {
                    // 		this.$message({type: 'success', message: '操作完成'})
                    // 	}
                    // }).bind(this))
                    .then(this.searchTable);
                }
              }
            }.bind(this)
          );
        } else if (state === "3") {
          Object.assign(o, {
            shippingStatusId: "1"
          });
          this._updateOrder(o)
            // .then((function(d) {
            // 	if(d && d.state === 0) {
            // 		this.$message({type: 'success', message: '操作完成'})
            // 	}
            // }).bind(this))
            .then(this.searchTable);
        }
        if (state === "4") {
          Object.assign(o, {
            shippingStatusId: "2"
          });
          this._updateOrder(o)
            // .then((function(d) {
            // 	if(d && d.state === 0) {
            // 		this.$message({type: 'success', message: '操作完成'})
            // 	}
            // }).bind(this))
            .then(this.searchTable);
        }
        if (state === "5") {
          Object.assign(o, {
            paymentStatusId: "1"
          });
          this._updateOrder(o)
            // .then((function(d) {
            // 	if(d && d.state === 0) {
            // 		this.$message({type: 'success', message: '操作完成'})
            // 	}
            // }).bind(this))
            .then(this.searchTable);
        }
        if (state === "8") {
          Object.assign(o, {
            paymentStatusId: "1"
          });
          this._updateOrder(o)
            // .then((function(d) {
            // 	if(d && d.state === 0) {
            // 		this.$message({type: 'success', message: '操作完成'})
            // 	}
            // }).bind(this))
            .then(this.searchTable);
        }
      }
    },
    batchUpdateOrderState(state) {
      if (this.rowSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {
        let selection = this.rowSelection;
        var arr = [],
          arr1 = [],
          arr2 = [];
        selection.forEach(function(el) {
          if (el.distribute == null && el.distributorId == null) {
            if (el.distributionType == 1) {
              arr1.push(el.id);
            } else {
              arr2.push(el.id);
            }
          }
          arr.push(el.id);
        });
        if (state === "1" || state === "4") {
          this._batchUpdateOrderState(arr, state)
            // .then((function(d) {
            // 	if(d && d.state === 0) {
            // 		this.$message({type: 'success', message: '操作完成'})
            // 	}
            // }).bind(this))
            .then(this.searchTable);
        } else if (state === "3") {
          var sessionUser = local.get("sessionUser");
          var customerId = sessionUser.typeCode;
          this._customerById(customerId).then(
            function(d) {
              if (d.aaData.length > 0) {
                var customer = d.aaData[0];
                if (customer.isDistribution == 1) {
                  var o = {
                    distribute: 1,
                    distributorId: customer.id
                  };
                  if (arr1.length > 0) {
                    this._batchUpdateOrderStates(arr1, o)
                      .then(
                        function(d) {
                          if (arr2.length > 0) {
                            var p = {
                              shippingStatusId: "1",
                              orderStatusId: state
                            };
                            return this._batchUpdateOrderStates(arr2, p);
                          }
                        }.bind(this)
                      )
                      // .then((function(d) {
                      // 	if(d && d.state === 0) {
                      // 		this.$message({type: 'success', message: '操作完成'})
                      // 	}
                      // }).bind(this))
                      .then(this.searchTable);
                  } else {
                    if (arr2.length > 0) {
                      var p = {
                        shippingStatusId: "1",
                        orderStatusId: state
                      };
                      this._batchUpdateOrderStates(arr2, p)
                        // .then((function(d) {
                        // 	if(d && d.state === 0) {
                        // 		this.$message({type: 'success', message: '操作完成'})
                        // 	}
                        // }).bind(this))
                        .then(this.searchTable);
                    }
                  }
                } else {
                  var o = {
                    shippingStatusId: "1",
                    orderStatusId: state
                  };
                  var arr3 = arr1.concat(arr2);
                  if (arr3.length > 0) {
                    this._batchUpdateOrderStates(arr3, o)
                      // .then((function(d) {
                      // 	if(d.state === 0) {
                      // 		this.$message({type: 'success', message: '操作完成'})
                      // 	}
                      // }).bind(this))
                      .then(this.searchTable);
                  }
                }
              }
            }.bind(this)
          );
        }
      }
    },
    selectable(row, index) {
      if (this.useType === "merchant") {
        return (
          (row.orderStatusId == 0 || row.orderStatusId == 2) &&
          row.orderUmber.indexOf("ON-2") == -1
        );
      } else if (this.useType === "buyer") {
        return row.orderStatusId == 3 && row.orderUmber.indexOf("ON-2") == -1;
      }
    },
    selectDistributor(row) {
      if (row.orderStatusId == 2) {
        var itemList = row.orderitemList;
        var arr = [];
        if (Array.isArray(itemList)) {
          itemList.forEach(
            function(el) {
              var batchId = el.batchId;
              if (!batchId) {
                arr.push(el.productName);
              }
            }.bind(this)
          );
        }
        if (arr.length > 0) {
          this.confirm(
            arr.join(",") + "未做进场，请先做进场",
            function() {
              this._go("inMarketDetail");
            }.bind(this)
          );
        } else {
          Object.assign(this.distributorListModalParams, row);
          this.distributorListModal = true;
        }
      } else {
        Object.assign(this.distributorListModalParams, row);
        this.distributorListModal = true;
      }
    },
    deliverOrder(row) {
      if (row.orderStatusId == 2) {
        var itemList = row.orderitemList;
        var arr = [];
        if (Array.isArray(itemList)) {
          itemList.forEach(
            function(el) {
              var batchId = el.batchId;
              if (!batchId) {
                arr.push(el.productName);
              }
            }.bind(this)
          );
        }
        if (arr.length > 0) {
          this.confirm(
            arr.join(",") + "未做进场，请先做进场",
            function() {
              this._go("inMarketDetail");
            }.bind(this)
          );
        } else {
          this.updateOrderState(row, "3");
        }
      } else {
        this.updateOrderState(row, "3");
      }
    },
    distributorListModalClose() {
      this.distributorListModal = false;
      this.distributorListModalParams = {};
    },
    distributorListModalSubmit() {
      this.distributorListModalClose();
      this.searchTable();
    },
    tabClick(tab, event) {
      var val = this.tabActive === "all" ? "" : this.tabActive;
      Object.assign(this.searchForm, {
        orderStatusId: val
      });
      if (val == 2) {
        Object.assign(this.searchForm, {
          orderField: "fenjiantime"
        });
      } else {
        Object.assign(this.searchForm, {
          orderField: ""
        });
      }
      this.handleCurrentChange(1);
    },
    orderRefuse(row, state) {
      Object.assign(this.orderRefuseModalParams, row, {
        state: state
      });
      this.orderRefuseModal = true;
    },
    orderRefuseModalClose() {
      this.orderRefuseModal = false;
      this.orderRefuseModalParams = {};
    },
    orderRefuseModalSubmit() {
      this.orderRefuseModalClose();
      this.searchTable();
    },
    create() {
      this._ajax({
        url: this.rootAPI + "store/checkStoreIsBusiness",
        param: { sellerId: local.get("userinfo").typeCode }
      }).then(
        function(d) {
          if (!d.aaData) {
            this.$message({ type: "error", message: "店铺未在经营，无法下单" });
          } else {
            this.orderCreateModal = true;
          }
        }.bind(this)
      );
    },
    orderCreateModalClose() {
      this.orderCreateModal = false;
    },
    orderCreateModalSubmit() {
      this.orderCreateModalClose();
      this.searchTable();
    },
    batchPrint() {
      if (this.rowSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {
        this.rowSelection.forEach(
          function(el) {
            var itemList = el.orderitemList;
            var printHtml = "";
            var trs = "";
            itemList.forEach(
              function(em, index) {
                let _index = index + 1;
                let skuName = em.skuName;
                let productName = em.productName;
                let skuCode = em.skuCode;
                let price = "";
                if (em.price != null) {
                  price = em.price.div(100);
                }
                let quantity = em.quantity
                  ? em.quantity + em.skuMeasureName
                  : "";
                if (this.measureType(em)) {
                  em.measureName = em.skuMeasureName;
                } else if (!this.measureType(em)) {
                  em.measureName = em.baseMeasureName;
                }
                let sortingWeight = em.sortingWeight
                  ? em.sortingWeight + em.measureName
                  : "";
                let comment = em.comment ? em.comment : "";
                let sortingTotalForDecimal = em.sortingTotalForDecimal || "";
                let itemHTML = `
		                        <tr>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${price}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${quantity}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingWeight}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingTotalForDecimal}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${comment}</td>
		                        </tr>
		                    `;
                trs = trs + itemHTML;
              }.bind(this)
            );
            var address = el.distributionType == 1 ? el.shippingAdd : "自提";
            var distributionTime = "";
            if (el.distributionTimeBegin) {
              if (el.distributionTimeBegin.split(":").length > 0) {
                distributionTime =
                  distributionTime +
                  el.distributionTimeBegin.split(":")[0] +
                  ":" +
                  el.distributionTimeBegin.split(":")[1];
              } else {
                distributionTime = distributionTime + el.distributionTimeBegin;
              }
            }
            if (el.distributionTimeEnd) {
              if (el.distributionTimeEnd.split(":").length > 0) {
                distributionTime =
                  distributionTime +
                  "-" +
                  el.distributionTimeEnd.split(" ")[1].split(":")[0] +
                  ":" +
                  el.distributionTimeEnd.split(" ")[1].split(":")[1];
              } else {
                distributionTime =
                  distributionTime + "-" + el.distributionTimeEnd;
              }
            }
            var contacts = el.contacts || "";
            var orderTotal = "";
            if (el.orderTotal != null) {
              orderTotal = el.orderTotal.div(100);
            }
            var sortingOrderTotal = "";
            if (el.sortingOrderTotal != null) {
              sortingOrderTotal = el.sortingOrderTotal.div(100);
            }
            var sellerName = el.sellerName || "";
            var buyerName = el.buyerName || "";
            var orderUmber = el.orderUmber || "";
            var buyerTel = el.buyerTel || "";
            var sellerTel = el.sellerTel || "";
            var customerIndex = el.customerIndex || "";
            var marketTitle = this.$store.state.marketTitle || "";
            var footer1 = "分拣员";
            var footer2 = "配送员";
            var footer3 = "验收人";
            var footer4 = "";
            var titleName = "销货单";
            if (configs.hedong == 1) {
              marketTitle = "临沂市食品追溯市场";
              sellerName = "临沂德润食品有限公司";
              titleName = "配送单";
              footer1 = "配送员";
              footer2 = "验收员";
              footer3 = "复核员";
              footer4 = "负责人";
            }
            printHtml =
              printHtml +
              `
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 17px;">
		                        <span>${marketTitle}(${sellerName})${titleName}</span>
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span>
		                        <span style="position: absolute;right: 0;">订单号: ${orderUmber}</span>
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">购货单位: ${buyerName}</span>
		                        <span style="position: absolute;right: 0;">分件编码: ${customerIndex}</span>
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">收货人: ${contacts}</span>
		                        <span style="position: absolute;right: 0;">收货人电话: ${buyerTel}</span>
		                    </div>
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">配送地址: ${address}</span>
		                        <span style="position: absolute;right: 0;">配送时间: ${distributionTime}</span>
		                    </div>
		                    <table style="text-align: center; border-collapse: collapse; width: 100%;">
		                      <thead style="font-size:14px;">
		                          <tr>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">单价(元)</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">下单量</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣合计(元)</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">客户备注</th>
		                          </tr>
		                      </thead>
		                      ${trs}
		                    </table>
		                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span>订单总额(元): ${orderTotal}</span>
		                        <span>实配金额(元): ${sortingOrderTotal}</span>
		                    </div>
		                    <div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
		                        <span style="width: 25%;display: inline-block;">${footer1}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer2}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer3}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer4}: </span>
		                    </div>
		                    <div style="page-break-after: always;"></div>
		                `;
            this.lodopoPrint(
              "6%",
              "5%",
              "95%",
              "100%",
              printHtml,
              itemList.length
            );
          }.bind(this)
        );
      }
    },
    measureType(row) {
      if (
        (row.measureTypePro == 1 &&
          row.measureTypeSKU == 2 &&
          row.chargingModel == 2) ||
        (row.measureTypePro == 2 &&
          row.measureTypeSKU == 2 &&
          row.chargingModel == 2) ||
        (row.measureTypePro == 1 &&
          row.measureTypeSKU == 1 &&
          row.chargingModel == 1)
      ) {
        return 1;
      } else if (
        row.measureTypePro == 1 &&
        row.measureTypeSKU == 2 &&
        row.chargingModel == 1
      ) {
        return 0;
      }
    },
    invoke(row) {
      this.confirm(
        "确定撤销配送？",
        function() {
          var o = {
            id: [row.id]
          };
          this._ajax({
            url: this.rootAPI + "order/invoke",
            param: o,
            arr: true
          }).then(
            function(d) {
              if (d.state == 0) {
                this.$message({
                  type: "success",
                  message: "拒绝成功"
                });
              } else if (d.state == 2) {
                this.$message({
                  type: "warning",
                  message: d.msg
                });
              }

              this.handleCurrentChange(1);
            }.bind(this)
          );
        }.bind(this)
      );
      this.searchTable();
    },
    posOrder(row) {
      if (row.orderUmber.indexOf("ON-2") == -1) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
