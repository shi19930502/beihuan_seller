<template>
  <div class="page-channel">
    <el-form
      class="modal-form"
      :model="form"
      ref="form"
      :inline="true"
      :rules="rules"
      label-width="150px"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="规格名称" prop="name">
            <inputItem :autosize="true" :value.sync="form.name"></inputItem>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="规格编码" prop="code">
            <inputItem :autosize="true" :value.sync="form.code"></inputItem>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="商品基本价格" prop="basePrice">
            <inputItem
              :autosize="true"
              :value.sync="form.basePrice"
              :append="true"
              @change="computeSalePrice"
            >
              <template slot="append">元/{{productSku.measureMethodName}}</template>
            </inputItem>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="规格计量方式" prop="skuMeasure">
            <selectInput :value.sync="form.skuMeasure" @selectChange="selectChange">
              <el-option
                v-for="item in productSku.skuMeasuremethodList"
                :key="item.name"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </selectInput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="商品规格换算" prop="skuWeight">
            <inputItem
              :autosize="true"
              :value.sync="form.skuWeight"
              :append="true"
              @change="computeSalePrice"
              :disabled="skuWeightDisabled"
            >
              <template slot="append">{{productSku.measureMethodName}}/{{skuMeasureName}}</template>
            </inputItem>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="实际销售价格" prop="price">
            <inputItem
              :autosize="true"
              :value.sync="form.price"
              :append="true"
              :readonly="pricedisable"
            >
              <template slot="append">元/{{skuMeasureName}}</template>
            </inputItem>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="所在报价单" prop="selectQuotation">
	                    <selectInput :value.sync="selectQuotation" :multiple="true" :filterable="true">
							<el-option
						      v-for="item in quotationList"
						      :key="item.id"
						      :label="item.quotationTitle"
						      :value="item.id">
						    </el-option>
						</selectInput>
	                </el-form-item>
        </el-col>-->
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="库存设置" prop="stockLimit">
            <el-radio-group v-model="form.stockLimit">
              <el-radio label="0">不管理库存</el-radio>
              <el-radio label="1">管理库存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="规格主图" prop="skuPicUrl">
            <uploadItem
              buttonType="icon"
              @success="uploadSuccess"
              :uploadData="uploadData"
              @remove="uploadRemove"
              :fileList="uploadList"
              uploadTip
            ></uploadItem>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="是否称重" prop="chargingModel">
            <el-radio-group v-model="form.chargingModel" @change="chargingModelchange">
              <el-radio label="2" :disabled="measureDisabled">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="销售状态" prop="published">
            <el-radio-group v-model="form.published">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="2">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
	        	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="库存设置" prop="stockLimit">
	                	<el-radio-group v-model="form.stockLimit">
						    <el-radio label="0">不管理库存</el-radio>
						    <el-radio label="1">管理库存</el-radio>
						</el-radio-group>
	                </el-form-item>
	            </el-col>
      </el-row>-->
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="描述" prop="remark" class="row-block">
            <inputItem type="textarea" :value.sync="form.remark"></inputItem>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: center">
      <elBtn @click="valideSubmitSku" type="primary">提交</elBtn>
    </div>
  </div>
</template>

<script>
import local from "../../local.js";
import configs from "../../configs.js";
import mixin from "../../mixin/mixin.js";
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      form: {
        id: "",
        name: "",
        code: "",
        price: "",
        chargingModel: "1",
        stockLimit: "0",
        published: 1,
        skuPicUrl: "",
        remark: "",
        skuMeasure: "",
        skuWeight: "",
        basePrice: "",
        measureType: "",
        skuMeasuremethodList: ""
      },
      rules: {
        code: [
          { required: true, message: "规格编码必填" },
          this._rulePosPattern(),
          this._ruleLength(4)
        ],
        name: [
          { required: true, message: "规格名称必填" },
          this._ruleLength(50)
        ],
        skuMeasure: [{ required: true, message: "规格计量方式必选" }],
        basePrice: [
          { required: true, message: "基本价格必填" },
          this._ruleTwoFloatPlus(),
          this.checkPrice()
        ],
        price: [
          { required: true, message: "销售价格必填" },
          this._ruleTwoFloatPlus(),
          this.checkPrice()
        ],
        skuWeight: [
          { required: true, message: "规格数量必填" },
          this._ruleTwoFloat(),
          this.checkPrice()
        ],
        remark: [this._ruleLength(200)]
      },
      uploadfile: {
        id: "",
        filePath: "",
        fileSize: "",
        fileName: "",
        fileType: ""
      },
      uploadData: {
        savePath: "productsku"
      },
      uploadList: [],
      dataDic: { whether: "" },
      quotationList: [],
      selectQuotation: [],
      measuremethodList: [],
      measureDisabled: false,
      skuMeasureName: "",
      skuWeightDisabled: false,
      pricedisable: false
    };
  },
  props: {
    productSku: {
      default: function() {
        return {};
      }
    }
  },
  mounted() {
    //			console.info(this.productSku);
    Object.assign(this.form, this.productSku);
    //			console.info(this.form);
    if (this.form.chargingModel == "2") {
      this.measureDisabled = false;
    } else if (this.form.chargingModel == "1") {
      this.measureDisabled = true;
    }
    this.getInitData();
    if (this.productSku.skuPicUrl) {
      this.uploadfile = {
        id: this.productSku.id,
        filePath: this.productSku.skuPicUrl
      };
      this.uploadList.push({
        name: "规格主图",
        url: configs.imgURL + this.productSku.skuPicUrl
      });
    }
    if (this.productSku.id) {
      let param = {
        productId: this.productSku.productId,
        productSkuId: this.productSku.id
      };
      let paramString = JSON.stringify(param);
      this._ajax({
        url: this.rootAPI,
        name: "quotation/queryByProductSkuId",
        param: { jsonStr: paramString }
      }).then(
        function(d) {
          let data = d.aaData;
          let quotationIds = [];
          if (d.aaData.length > 0) {
            $.each(data, function(i, obj) {
              quotationIds.push(obj.id);
            });
          }
          this.selectQuotation = quotationIds;
          //					console.info(this.selectQuotation);
        }.bind(this)
      );
    } else {
      //获取生成的商品规格编码
      this._ajax({
        url: this.rootAPI,
        name: "productsku/getSkuCode",
        param: { productId: this.productSku.productId }
      }).then(
        function(d) {
          this.form.code = d.aaData;
        }.bind(this)
      );
    }
  },
  methods: {
    chargingModelchange(val) {
      let vm = this;
      //商品计量
      let measureTypePro = vm.productSku.measureTypePro;
      //按计重计费
      let chargingModel = vm.form.chargingModel;
      let measuremethod = vm.form.skuMeasuremethodList.filter(
        (item, index, arr) => {
          return item.code == vm.form.skuMeasure;
        }
      );
      //规格计量
      let measureTypeSku = measuremethod[0].methodType;
      console.log(
        measureTypePro + "--" + measureTypeSku + "--" + chargingModel
      );
      if (
        measureTypePro == "1" &&
        measureTypeSku == "2" &&
        chargingModel == "1"
      ) {
        //计算实际销售价格
        if (vm.form.basePrice && vm.form.skuWeight) {
          vm.form.price = vm._parseFloat(
            vm.form.basePrice.mul(vm.form.skuWeight),
            2
          );
        }
        vm.pricedisable = true;
      }else{
		  vm.pricedisable = false;
	  }
    },
    //校验价格方法
    checkPrice() {
      return {
        validator: function(rule, value, callback) {
          var val = parseFloat(value);
          if (val > 10000) {
            callback(new Error("金额必须小于10000"));
          } else {
            callback();
          }
        }.bind(this),
        trigger: "blur"
      };
    },
    getInitData() {
      this._ajax({ url: this.rootAPI, name: "measuremethod/list", param: {} })
        .then(
          function(d) {
            this.measuremethodList = d.aaData;
            if (this.productSku.id) {
              this.selectChange(this.productSku.skuMeasure, true);
            }
          }.bind(this)
        )
        .then(
          function() {
            return this._ajax({
              url: this.rootAPI,
              name: "quotation/list",
              param: {}
            });
          }.bind(this)
        )
        .then(
          function(d) {
            this.quotationList = d.aaData;
            //					console.info(d);
          }.bind(this)
        );
    },
    valideSubmitSku() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let o = {},
            method = "productsku/createRelate";
          let id = this.form.id;
          if (id) {
            method = "productsku/updateRelate";
          }
          o = {
            id: id,
            name: this.form.name,
            code: this.form.code,
            price: this.form.price,
            chargingModel: this.form.chargingModel,
            stockLimit: this.form.stockLimit,
            published: this.form.published,
            skuPicUrl: this.uploadfile.filePath,
            skuMeasure: this.form.skuMeasure,
            skuWeight: this.form.skuWeight,
            basePrice: this.form.basePrice,
            remark: this.form.remark,
            productId: this.productSku.productId,
            quotationIds: this.selectQuotation.join(",")
          };
          //                      console.info(o);
          let user = local.get("sessionUser");
          if (!id) {
            o.createdPersonId = user.userId;
            o.createdPersonName = user.nickName;
          }
          this._ajax({ url: this.rootAPI + method, param: o }).then(
            function(d) {
              if (d.state == 0) {
                if (!id) {
                  this.form.id = d.aaData.id;
                }
                this.$message({ type: "success", message: "操作成功" });
                this.$emit("submit");
              } else {
                this.$message({
                  type: "failure",
                  message: "操作失败：" + d.msg
                });
              }
            }.bind(this)
          );
          /*if(this.selectQuotation.length > 0 && this.form.published == 2) {
                        	this._comfirm('该商品规格里有关联报价单，下架后，促销活动内对应的该商品即不可见，确认下架?')
		                    .then((function() {
		                        this._ajax({url: this.rootAPI + method, param: o})
		                        .then((function(d) {
		                        	if(d.state == 0) {
		                        		if(!id) {
		                        			this.form.id = d.aaData.id;
		                        		}
		                        		this.$message({ type: 'success', message: '操作成功' });
		                        		this.$emit('submit')
		                        	} else {
		                        		this.$message({ type: 'failure', message: '操作失败：'+d.msg }); 
		                        	}
		                        }).bind(this))
		                    }).bind(this))
                        } else {
                       		this._ajax({url: this.rootAPI + method, param: o})
	                        .then((function(d) {
	                        	if(d.state == 0) {
	                        		if(!id) {
	                        			this.form.id = d.aaData.id;
	                        		}
	                        		this.$message({ type: 'success', message: '操作成功' });
	                        		this.$emit('submit')
	                        	} else {
	                        		this.$message({ type: 'failure', message: '操作失败：'+d.msg }); 
	                        	}
	                        }).bind(this))
                        }*/
        }
      });
    },
    uploadSuccess(response, file, fileList) {
      //          	console.info(response);
      if (response.state == 0) {
        this.uploadfile.id = "";
        this.uploadfile.filePath = response.aaData.path;
        this.uploadfile.fileSize = response.aaData.size;
        this.uploadfile.fileName = file.name;
        let fileTypeTemp = file.name.split(".");
        this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
      }
    },
    uploadRemove(file, fileList) {
      Object.assign(this.form, {
        filePath: ""
      });
      this.uploadfile.filePath = "";
    },
    selectChange(val) {
      /*当规格单位时计重时，是否称重默认为1是并且不允许选择为否，规格单位为计件时，可以选择是否称重*/
      let data = this.measuremethodList;
      let vm = this;
      $.each(data, function(i, obj) {
        if (val == obj.code) {
          let methodType = obj.methodType;
          if (methodType == "1") {
            vm.measureDisabled = true;
            //          				vm.form.chargingModel = '1';
          } else if (methodType == "2") {
            vm.measureDisabled = false;
            //          				vm.form.chargingModel = '2';
          }
          vm.skuMeasureName = obj.name;
        }
      });

      let id = this.productSku.id;
      //修改规格单位，如果和基本单位一致，设置换算为1，实际价格为基本价格
      if (val == this.productSku.measureMethod) {
        this.form.skuWeight = 1;
        if (!id) this.form.price = this.form.basePrice;
        this.skuWeightDisabled = true;
	  } else this.skuWeightDisabled = false;

    //判断是否禁用 销售价格
	  vm.chargingModelchange(null);
    },
    computeSalePrice() {
      //计算实际销售价格
      if (this.form.basePrice && this.form.skuWeight) {
        this.form.price = this._parseFloat(
          this.form.basePrice.mul(this.form.skuWeight),
          2
        );
      }
    }
  }
};
</script>
<style lang="sass">
    .page-channel{
        .row-block{
        	width: 100%;
            .el-form-item__content {
                width: calc(100% - 150px);
                &>div{
                    width: 100%;
                }
            }            
        }
    }
</style>

