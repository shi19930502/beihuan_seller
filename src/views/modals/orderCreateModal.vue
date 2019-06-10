<template>
  <div>
    <el-dialog
      custom-class="jz-modal order-item-modal"
      title="新增订单"
      :visible="modal"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      width="75%"
    >
      <el-form
        class="modal-form"
        v-if="modal"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <el-form-item label="采购商" prop="buyerId">
              <selectInput
                :clearable="true"
                :value.sync="form.buyerId"
                @selectChange="setAddressList"
                :filterable="true"
              >
                <el-option
                  v-for="item in buyerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </selectInput>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <el-form-item label="支付方式" prop="payType">
              <selectInput :clearable="true" :value.sync="form.payType">
                <el-option
                  v-for="item in payWayList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                  :disabled="item.key != '0'"
                ></el-option>
              </selectInput>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <el-form-item label="配送方式" prop="distributionType">
              <selectInput :clearable="true" :value.sync="form.distributionType">
                <el-option
                  v-for="item in distributionTypeList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </selectInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.distributionType == 1">
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <el-form-item label="配送时间">
              <el-radio v-model="today" :label="1" :disabled="distributionToday != 1">当天配送</el-radio>
              <el-radio v-model="today" :label="0">次日配送</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" v-if="today == 0">
            <el-form-item label="配送日期" prop="distributionDate">
              <dateEditorDaterange
                :dateValue.sync="form.distributionDate"
                type="date"
                :showShortcuts="false"
                :disabledBeforeDate="disabledBeforeDate"
                :disabledAfterDate="disabledAfterDate"
              ></dateEditorDaterange>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="起止时间" prop="distributionTime" class="row-block">
              <div class="flex-x-start">
                <timeSelectItem
                  :startTime.sync="startTime"
                  :endTime.sync="endTime"
                  :start="distributionStart"
                  :end="distributionEnd"
                  @startChange="timeChange"
                  @endChange="timeChange"
                ></timeSelectItem>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.distributionType == 1">
            <el-form-item label="配送地址" prop="shippingAddId" class="row-block">
              <div v-if="!form.shippingAdd">
                <span style="opacity: 0;">111</span>
              </div>
              <inputItem :value.sync="form.shippingAdd" :disabled="true"></inputItem>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="备注" class="row-block">
              <inputItem :value.sync="form.comment" :maxlength="200" type="textarea"></inputItem>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <optionItems>
        <template slot="left">
          <el-button-group>
            <iconBtn iconClass="el-icon-plus" content="添加商品" type="success" @click="addPro">添加商品</iconBtn>
          </el-button-group>
        </template>
      </optionItems>
      <elemTable
        :dataList="dataList"
        :currentPage="pageNum"
        :pageSize="pageSize"
        :pageTotal="pageTotal"
        :loading="modalDataLoading"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        @selectionChange="selectionChange"
        :showPagination="false"
        :maxHeight="modalMaxTableHeight"
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="productPicUrl" label="商品图片">
          <template slot-scope="scope">
            <imgItem
              :path="scope.row.productPicUrl ? scope.row.productPicUrl : scope.row.skuPicUrl"
            ></imgItem>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
          <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="skuName" label="规格名称">
          <template slot-scope="scope">
            <div>{{scope.row.skuName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="oriPrice" label="基本价(元)">
          <template slot-scope="scope">
            <div>{{scope.row.oriPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="规格价格(元)">
          <template slot-scope="scope">
            <div>{{scope.row.price}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="需求量">
          <template slot-scope="scope">
            <inputItem :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)"></inputItem>
          </template>
        </el-table-column>
        <el-table-column prop="itemTotal" label="需求金额(元)">
          <template slot-scope="scope">
            <div>{{scope.row.itemTotal}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注" width="250">
          <template slot-scope="scope">
            <inputItem :value.sync="scope.row.comment" :maxlength="200"></inputItem>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <elBtn @click="deleteRow(scope.$index, scope.row)" type="danger">删除</elBtn>
          </template>
        </el-table-column>
      </elemTable>
      <searchInputItems>
        <searchInputItem name="总金额">
          <inputItem :value.sync="form.orderTotal" :disabled="true"></inputItem>
        </searchInputItem>
      </searchInputItems>
      <div slot="footer" class="dialog-footer flex-x-end">
        <elBtn @click="validSubmit" type="primary" v-if="!submitLoading">提交</elBtn>
        <elBtn v-if="submitLoading" iconClass="el-icon-loading" type="primary"></elBtn>
        <elBtn @click="cancel">取消</elBtn>
      </div>
    </el-dialog>
    <selectProductModal
      v-if="productModal"
      :modal="productModal"
      @close="productModalClose"
      @submit="productModalSubmit"
      type="order"
    ></selectProductModal>
  </div>
</template>
<script>
import mixin from "../../mixin/mixin.js";
import configs from "../../configs.js";
import local from "./../../local.js";
import selectProductModal from "./selectProductModal.vue";
export default {
  mixins: [mixin],
  components: { selectProductModal },
  data() {
    return {
      typeCode: "",
      dataList: [],
      form: {
        buyerId: null,
        payType: "",
        shippingAddId: null,
        shippingAdd: "",
        distributionDate: "",
        distributionTime: null,
        distributionType: "",
        orderTotal: "",
        comment: "",
        shippingTotal: 0
      },
      rules: {
        buyerId: [{ required: true, message: "采购商不能为空" }],
        payType: [{ required: true, message: "支付方式不能为空" }],
        shippingAddId: [{ required: true, message: "配送地址不能为空" }],
        distributionDate: [{ required: true, message: "配送日期不能为空" }],
        distributionTime: [{ required: true, message: "配送时间不能为空" }],
        distributionType: [{ required: true, message: "配送方式不能为空" }]
      },
      buyerList: [],
      payWayList: [],
      addressList: [],
      distributionTypeList: [],
      today: 0,
      startTime: "",
      endTime: "",
      distributionStart: "06:00",
      distributionEnd: "13:00",
      disabledBeforeDate: "",
      disabledAfterDate: "",
      distributionToday: 0,
      productModal: false,
      validConfirm: {
        flag: true,
        msg: ""
      },
      submitLoading: false
    };
  },
  props: {
    modal: {
      default: false
    },
    params: {
      default: function() {
        return {};
      }
    }
  },
  mounted() {
    var user = local.get("sessionUser"),
      typeCode = "";
    if (user) {
      typeCode = parseInt(user.typeCode);
      this.typeCode = typeCode;
      this._ajax({
        name: "customer/customerGroupSetList",
        param: { typeCode }
      }).then(
        function(d) {
          for (var i = 0, l = d.aaData.length; i < l; i++) {
            if (d.aaData[i] != null) {
              this.buyerList.push(d.aaData[i]);
            }
          }
          Object.assign(this.form, {
            buyerId: this.buyerList[0].id
          });
          this.setAddressList();
        }.bind(this)
      );
      this._ajax({
        name: "store/queryBySellerId",
        param: { sellerId: typeCode }
      }).then(
        function(d) {
          if (this.isObject(d.aaData)) {
            var data = d.aaData;
            if (data.distributionToday) {
              this.distributionToday = data.distributionToday;
            }
            if (data.distributionStart || data.distributionStart == 0) {
              this.distributionStart = moment(
                data.distributionStart,
                "HH:mm"
              ).format("HH:mm");
            }
            if (data.distributionStart == 24) {
              this.distributionStart = moment("23:59", "HH:mm").format("HH:mm");
            }
            if (data.distributionEnd || data.distributionEnd == 0) {
              this.distributionEnd = moment(
                data.distributionEnd,
                "HH:mm"
              ).format("HH:mm");
            }
            if (data.distributionEnd == 24) {
              this.distributionEnd = moment("23:59", "HH:mm").format("HH:mm");
            }
          }
        }.bind(this)
      );
    }
    this._searchDic("PAY_WAY").then(
      function(d) {
        this.payWayList = this._dicKey(d);
        if (this.payWayList.length > 0) {
          Object.assign(this.form, {
            payType: 0
          });
        }
      }.bind(this)
    );
    this._searchDic("SHIPPING_METHOD").then(
      function(d) {
        this.distributionTypeList = this._dicKey(d);
        if (this.distributionTypeList.length > 0) {
          Object.assign(this.form, {
            distributionType: this.distributionTypeList[0].key
          });
        }
      }.bind(this)
    );
    this.getShippingfee(parseInt(local.get("sessionUser").typeCode));
  },
  // watch:{
  //   form:{
  //     handler(val,oval){
  //       if(val.buyerId){

  //         // 团采用户有配送费
  //         this._ajax({
  //           name: "customer/queryById",
  //           param: { id: val.buyerId }
  //         }).then((d)=> {
  //           if(d&&d.aaData&&d.aaData.extend=='003'){
  //             this.getShippingfee(parseInt(local.get("sessionUser").typeCode));
  //           } 
  //         });
  //       }
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    /**
     * @description: 获取配送费
     * @param {type}
     * @return:
     */
    getShippingfee(sellerId) {
      this._ajax({
        name: "shippingfee/queryBySellerId",
        param: { sellerId: sellerId }
      }).then(d => {
        if (d && d.state == 0 && d.aaData != null) {
          this.form.shippingTotal = d.aaData.shippingTotal;
        } else {
          this.form.shippingTotal = 0;
        }
      });
    },
    cancel() {
      this.$emit("close");
    },
    beforeClose(done) {
      this.cancel();
      done();
    },
    validSubmit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          Object.assign(this.validConfirm, {
            flag: true,
            msg: ""
          });
          this.dataList.forEach(
            function(el) {
              // if(!this.regPosPattern.test(el.quantity) || el.quantity <= 0) {
              //     Object.assign(this.validConfirm, {
              //         flag: false,
              //         msg: '需求数量输入不合法'
              //     })
              // }
              if (
                (el.measureTypePro == 1 &&
                  el.measureTypeSKU == 2 &&
                  el.chargingModel == 2) ||
                (el.measureTypePro == 2 &&
                  el.measureTypeSKU == 2 &&
                  el.chargingModel == 2)
              ) {
                if (
                  !this.regPosPattern.test(el.quantity) ||
                  el.quantity <= 0 ||
                  el.quantity > 9999999999
                ) {
                  Object.assign(this.validConfirm, {
                    flag: false,
                    msg: "计件商品请输入大于0小于9999999999的整数"
                  });
                }
              } else if (
                (el.measureTypePro == 1 &&
                  el.measureTypeSKU == 1 &&
                  el.chargingModel == 1) ||
                (el.measureTypePro == 1 &&
                  el.measureTypeSKU == 2 &&
                  el.chargingModel == 1)
              ) {
                if (
                  !this.weightFloat.test(el.quantity) ||
                  el.quantity <= 0 ||
                  el.quantity > 9999999999
                ) {
                  Object.assign(this.validConfirm, {
                    flag: false,
                    msg:
                      "计重商品请输入大于0小于9999999999的数字,小数位数不超过三位"
                  });
                }
              }
            }.bind(this)
          );
          if (this.validConfirm.flag) {
            if (this.dataList.length > 0) {
              var arr = [];
              this.dataList.forEach(function(el) {
                var o = {};
                Object.assign(o, el);
                Object.assign(o, {
                  price: el.price.mul(100),
                  oriPrice: el.oriPrice.mul(100),
                  itemTotal: el.itemTotal.mul(100)
                });
                arr.push(o);
              });
              var oderItems = JSON.stringify(arr);
              var o = {
                buyerId: this.form.buyerId,
                sellerId: this.typeCode,
                distributionType: this.form.distributionType,
                comment: this.form.comment,
                payType: this.form.payType,
                orderitems: oderItems,
                createByOwn: "1"
              };

              if (this.form.distributionType == 1) {
                var distributionDate;
                if (this.today === 0) {
                  distributionDate = this.form.distributionDate;
                } else {
                  distributionDate = moment().format("YYYY-MM-DD");
                }
                Object.assign(o, {
                  shippingAdd: this.form.shippingAdd,
                  shippingAddId: this.form.shippingAddId,
                  distributionTimeBegin:
                    distributionDate + " " + this.startTime + ":00",
                  distributionTimeEnd:
                    distributionDate + " " + this.endTime + ":00"
                });
                // 团采用户有配送费
                let buyerType = await this.getcustomerType(o.buyerId)
                if(buyerType == '003'){
                  o.shippingTotal = this.form.shippingTotal;
                }
              }
              Object.assign(o, {
                submitLoading: true
              });
              this._createOrder(o).then(
                function(d) {
                  if (d.state === 0) {
                    this.$message({ type: "success", message: "操作完成" });
                  }
                  this.$emit("submit");
                }.bind(this)
              );
            } else {
              this.$message({ type: "warning", message: "请选择商品" });
            }
          } else {
            this.$message({
              type: "warning",
              message: "需求数量输入不合法，请输入大于0的整数"
            });
          }
        }
      });
    },
    getcustomerType(buyerId){
      return new Promise((res,rej)=>{
        this._ajax({
          name: "customer/queryById",
          param: { id: buyerId }
        }).then(
          function(d) {
            if(d&&d.aaData&&d.aaData.extend){
             res(d.aaData.extend)
            } 
          }.bind(this)
        );
      })
    },
    setAddressList() {
      if (this.form.buyerId) {
        this._ajax({
          name: "address/queryByCustomerId",
          param: { customerId: this.form.buyerId }
        }).then(
          function(d) {
            Object.assign(this.form, {
              shippingAdd: d.aaData.completeAddress || "",
              shippingAddId: d.aaData.id || null
            });
          }.bind(this)
        );
      }
    },
    timeChange(val) {
      if (this.startTime && this.endTime) {
        this.form.distributionTime = "1";
      } else {
        this.form.distributionTime = null;
      }
    },
    addPro() {
      this.productModal = true;
    },
    productModalClose() {
      this.productModal = false;
    },
    productModalSubmit(rows) {
      var arr = [];
      rows.forEach(
        function(el) {
          var flag = true;
          this.dataList.forEach(
            function(em) {
              if (em.skuID == el.skuID) {
                flag = false;
              }
            }.bind(this)
          );
          if (flag) {
            arr.push(el);
          }
        }.bind(this)
      );
      arr.forEach(
        function(em) {
          Object.assign(em, {
            oriPrice: em.basePrice,
            skuId: em.skuID,
            productId: em.id,
            quantity: 1,
            id: null,
            itemTotal: 0
          });
          this.dataList.push(em);
        }.bind(this)
      );
      this.orderSum();
      this.productModal = false;
    },
    orderSum() {
      var orderTotal = 0,
        arr = [];
      this.dataList.forEach(
        function(el) {
          el.itemTotal = this._parseFloat(el.price.mul(el.quantity), 2);
          arr.push(el);
          orderTotal = orderTotal.add(el.itemTotal);
        }.bind(this)
      );
      this.dataList = arr;
      Object.assign(this.form, {
        orderTotal: this._parseFloat(orderTotal, 2)
      });
    },
    deleteRow($index, row) {
      var arr = [];
      this.dataList.forEach(function(item, index) {
        if (index !== $index) {
          arr.push(item);
        }
      });
      this.dataList = arr;
      this.orderSum();
    },
    changeQuantity(row) {
      if (
        (row.measureTypePro == 1 &&
          row.measureTypeSKU == 2 &&
          row.chargingModel == 2) ||
        (row.measureTypePro == 2 &&
          row.measureTypeSKU == 2 &&
          row.chargingModel == 2)
      ) {
        if (
          !this.regPosPattern.test(row.quantity) ||
          row.quantity <= 0 ||
          row.quantity > 9999999999
        ) {
          this.$message({
            type: "warning",
            message: "计件商品请输入大于0小于9999999999的整数"
          });
          Object.assign(this.validConfirm, {
            flag: false,
            msg: "需求数量输入不合法"
          });
        } else {
          this.orderSum();
        }
      } else if (
        (row.measureTypePro == 1 &&
          row.measureTypeSKU == 1 &&
          row.chargingModel == 1) ||
        (row.measureTypePro == 1 &&
          row.measureTypeSKU == 2 &&
          row.chargingModel == 1)
      ) {
        if (
          !this.weightFloat.test(row.quantity) ||
          row.quantity <= 0 ||
          row.quantity > 9999999999
        ) {
          this.$message({
            type: "warning",
            message:
              "计重商品请输入大于0小于9999999999的数字,小数位数不超过三位"
          });
          Object.assign(this.validConfirm, {
            flag: false,
            msg: "需求数量输入不合法"
          });
        } else {
          this.orderSum();
        }
      }
    }
  }
};
</script>
<style lang="sass">
    .order-item-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 100px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
</style>