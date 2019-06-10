<template>
<div class="page-channel">
  <el-tabs v-model="activeName" @tab-click="handleClick" class="marginClass">
    <el-tab-pane label="基础信息" name="first">
      <el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="商品所属分类" prop="categoryId">
              <cascaderItem :options="categoryList" :value.sync="categoryIds" :propss="propss" @change="categoryChange" :changeOnSelect="false"></cascaderItem>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="商品名称" prop="name">
              <inputItem :autosize="true" :value.sync="form.name"></inputItem>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="基本单位" prop="measureMethod">
              <selectInput :value.sync="form.measureMethod" @selectChange="measureMethodChange">
                <el-option v-for="item in measuremethodList" :key="item.name" :label="item.name" :value="item.code">
                </el-option>
              </selectInput>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="是否清真" prop="isMuslim" v-if="this.muslimfoodPermitPic!=null && this.muslimfoodPermitPic!=''">
              <selectInput :value.sync="form.isMuslim">
                <el-option v-for="item in isMuslimList" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </selectInput>
            </el-form-item>
						<el-form-item label="是否清真" prop="isMuslim" v-if="this.muslimfoodPermitPic==null || this.muslimfoodPermitPic==''">
							<selectInput :value.sync="form.isMuslim" disabled>
								<el-option v-for="item in isMuslimList" :key="item.key" :label="item.value" :value="item.key" >
								</el-option>
							</selectInput>
						</el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="商品编码" prop="code">
              <inputItem :autosize="true" :value.sync="form.code"></inputItem>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="商品别名" prop="vulgo">
              <inputItem :autosize="true" :value.sync="form.vulgo"></inputItem>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="商品主图" prop="productPicUrl">
              <uploadItem buttonType="icon" @success="uploadSuccess" :uploadData="uploadData" @remove="uploadRemove" :fileList="uploadList" uploadTip="" accept='.jpg,.png'></uploadItem>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="描述" prop="remark" class="row-block">
              <inputItem type="textarea" :value.sync="form.remark"></inputItem>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right">
        <elBtn @click="cancel" type="info">取消</elBtn>
        <iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check">提交</iconBtn>
      </div>
    </el-tab-pane>
    <el-tab-pane label="商品规格" name="second" :disabled="tabDisabled">
      <!--<el-button size="small" @click="addTab(editableTabsValue)">添加规格</el-button>-->
      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="skuHandleClick">
        <el-tab-pane v-for="(item, index) in editableTabs" :key="item.tagName" :label="item.title" :name="item.tagName">

          <productSkuModal :productSkuModalType="modalType" @close="modalClose" :productSku="item" @submit="modalSubmit"></productSkuModal>
        </el-tab-pane>
        <el-tab-pane label="[+添加规格]" name="addTab"></el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>

  <inMarketDetailModal :modal="modalShow" :inMarketDetailModalType="modalType" :extendModalType='extendType' v-if="modalShow" @submit="modalSubmit" @close='modalClose' :tableRow='tableRow'></inMarketDetailModal>
</div>
</template>

<script>
import local from '../../local.js'
import configs from '../../configs.js'
import mixin from '../../mixin/mixin.js'
import productSkuModal from './productSkuModal.vue'
import inMarketDetailModal from './inMarketDetailModal.vue'
export default {
  mixins: [mixin],
  components: {
    productSkuModal,
    inMarketDetailModal
  },
  data() {
    return {
      inMarketDetailModalType: 'add',
      extendType: "",
      inMarketDetailModal: false,
      tableRow: {},
      dateRange: [],
      form: {
        id: '',
        categoryId: '',
        code: '',
        name: '',
        vulgo: '',
        measureMethod: '',
        productPicUrl: '',
        remark: '',
        isMuslim: 0
      },
      uploadfile: {
        id: '',
        filePath: '',
        fileSize: '',
        fileName: '',
        fileType: ''
      },
      uploadData: {
        savePath: 'productOnline'
      },
      categoryList: [],
      categoryIds: [],
      propss: {
        label: 'vulgo',
        value: 'id',
        children: 'childList',
      },
      uploadList: [],
      rules: {
        categoryId: [{
          required: true,
          message: '商品分类必选'
        }],
        name: [{
          required: true,
          message: '商品名称必填'
        }, this._ruleLength(50)],
        measureMethod: [{
          required: true,
          message: '计量单位必选'
        }],
        vulgo: [this._ruleLength(50)],
        remark: [this._ruleLength(100)],
        isMuslim: [{
          required: true,
          message: '是否清真必选'
        }]
      },
      activeName: 'first',
      muslimfoodPermitPic: '',
      measuremethodList: [],
      tabDisabled: true,
      editableTabsValue: '0',
      editableTabs: [],
      tabIndex: 1,
      measureType: '',
      measureMethodName: '',
      skuMeasuremethodList: '',
      tabDataflag: true,
      isMuslimList: []
    }
  },
  mounted() {
    this._ajax({
        name: 'customer/list',
        param: {
          id: local.get('userinfo').typeCode
        }
      })
      .then((function(d) {
        if (d.dataCount > 0) {
          this.muslimfoodPermitPic = d.aaData[0].muslimfoodPermitPic;
        }
      }).bind(this));
    //是否清真
    this._searchDic('IS_MUSlIM')
      .then((function(d) {
        this.isMuslimList = this._dicKey(d);
      }).bind(this));
    this.getInitData();
    var paramsTemp = this.$route.query;
    let idTemp = paramsTemp.id;
    if (idTemp) {
      let paramTemp = {
        pageNum: 1,
        pageSize: 1,
        id: idTemp
      };
      this._ajax({
          name: 'product/queryList',
          param: paramTemp
        })
        .then((function(d) {
          let params = d.aaData[0];
          Object.assign(this.form, params);
          this._ajax({
              url: this.rootAPI,
              name: 'category/getListIdBySelectId',
              param: {
                id: params.categoryId
              }
            })
            .then((function(d) {
              //					console.info(d)
              this.categoryIds = d.aaData;
            }).bind(this));
          this.tabDisabled = false;
          if (params.productPicUrl) {
            this.uploadfile = {
              id: params.id,
              filePath: params.productPicUrl,
            };
            this.uploadList.push({
              "name": "商品主图",
              "url": configs.imgURL + params.productPicUrl
            });
          }
        }).bind(this))
    } else {
      //获取生成的商品编码
      let user = local.get('sessionUser');
      this._ajax({
          url: this.rootAPI,
          name: 'product/getProductCode',
          param: {
            customerId: user.typeCode
          }
        })
        .then((function(d) {
          this.form.code = d.aaData
        }).bind(this))
    }
  },
  methods: {
    inMarketDetailModalClose() {
      this.inMarketDetailModal = false;
    },
    add() {
      this.tableRow = null;
      this.modalAdd();
      this.extendType = "";
    },
    getInitData() {
      //基础单位
      this._ajax({
          url: this.rootAPI,
          name: 'measuremethod/list',
          param: {}
        })
        .then((function(d) {
          this.measuremethodList = d.aaData;
        }).bind(this));


      //判断是否厂商
      let user = local.get('sessionUser');
      this._ajax({
          url: this.rootAPI,
          name: 'category/getCategorylistByCustomer',
          param: {
            parentCategoryId: 'top',
            filteEnabled: 1,
            filteDeleted: 0,
            customerId: user.typeCode
          }
        })
        .then((function(d) {

          if (d.aaData.length > 0) { //是厂商则只加载厂商的分类
            this.categoryList = d.aaData;
          } else { //不是厂商则加载全部分类
            //商品分类
            let categoryList = this.$store.state.categoryList;
            if (!categoryList || categoryList.length == 0) {
              this._saveProCategory()
                .then((function(d) {
                  this.categoryList = this.$store.state.categoryList;
                }).bind(this))
            } else
              this.categoryList = this.$store.state.categoryList;
          }
        }).bind(this));


    },
    cancel() {
      this.$router.push({
        name: 'productOnline'
      });
    },
    valideSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let o = {},
            method = "product/create";
          let id = this.form.id;
          if (id) {
            method = "product/update";
          }
          o = {
            id: id,
            categoryId: this.form.categoryId,
            code: this.form.code,
            name: this.form.name,
            vulgo: this.form.vulgo,
            measureMethod: this.form.measureMethod,
            productPicUrl: this.uploadfile.filePath,
            remark: this.form.remark,
            published: 1,
            deleted: 0,
            isMuslim: this.form.isMuslim
          };
          let user = local.get('sessionUser');
          if (!id) {
            o.createdPersonId = user.userId;
            o.createdPersonName = user.nickName;
            o.customerId = user.typeCode;
          }
          this._ajax({
              url: this.rootAPI + method,
              param: o
            })
            .then((function(d) {
              if (d.state == 0) {
                if (!id) {
                  this.form.id = d.aaData.id;
                }
                this.tabDisabled = false;
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
                this.refreashTab();
              } else {
                this.$message({
                  type: 'failure',
                  message: '操作失败:' + d.msg
                });
              }
              this.$emit('submit')
            }).bind(this))
        }
      })
    },
    handleClick(tab, event) {
      //		        console.log(tab, event);
      if (tab.name == 'second' && this.tabDataflag) {
        //查询商品已有规格
        this.refreashTab();
        this.tabDataflag = false
      }
    },
    skuHandleClick(tab, event) {
      if (tab.name == "addTab") {
        this.addTab();
      }
    },
    /*基本单位改变时触发*/
    measureMethodChange(val) {
      let arr = this.measuremethodList;
      let measureType = '';
      let measureMethodName = '';
      $.each(arr, function(i, obj) {
        if (obj.code == val) {
          measureType = obj.methodType;
          measureMethodName = obj.name
        }
      });
      this.measureType = measureType;
      this.measureMethodName = measureMethodName;
      this.refreashSkuMeasuremethod()
    },
    changeCustomer(obj, type) {
      obj.isAppend = type;
      let param = {
        id: obj.id,
        isAppend: type
      };
      this._ajax({
          url: this.rootAPI,
          name: "promotioncustomermapping/update",
          param: param
        })
        .then((function(d) {
          this.$message({
            type: 'success',
            message: '调整商户成功'
          });
          this.handleCurrentChange(1)
        }).bind(this))

    },
    changeProduct(obj, type) {
      obj.isAppend = type;
      let param = {
        id: obj.id,
        isAppend: type
      };
      this._ajax({
          url: this.rootAPI + "promotiondetail/update",
          param: param
        })
        .then((function(d) {
          this.$message({
            type: 'success',
            message: '调整商品成功'
          });
          this.handleCurrentChange(1)
        }).bind(this))
    },
    uploadSuccess(response, file, fileList) {
      //          	console.info(response);
      if (response.state == 0) {
        this.uploadfile.id = '';
        this.uploadfile.filePath = response.aaData.path;
        this.uploadfile.fileSize = response.aaData.size;
        this.uploadfile.fileName = file.name;
        let fileTypeTemp = file.name.split('.');
        this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
      }
    },
    uploadRemove(file, fileList) {
      Object.assign(this.form, {
        filePath: ''
      });
      this.uploadfile.filePath = ''
    },
    categoryChange(val) {
      if (val.length > 0) {
        Object.assign(this.form, {
          categoryId: val[val.length - 1]
        })
      } else {
        Object.assign(this.form, {
          categoryId: ''
        })
      }
    },
    addTab() {
      this.measureMethodChange(this.form.measureMethod);
      let newTabName = 'Tab' + ++this.tabIndex;
      this.editableTabs.push({
        title: '新建规格',
        tagName: newTabName,
        productId: this.form.id,
        measureType: this.measureType,
        measureMethodName: this.measureMethodName,
        measureMethod: this.form.measureMethod,
        skuMeasuremethodList: this.skuMeasuremethodList,
        measureTypePro:this.form.measureTypePro
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      if (targetName == "addTab") {
        this.$message({
          type: 'info',
          message: '该页签不允许删除'
        });
        return
      }
      let tabs = this.editableTabs;
      if (targetName) {
        this.confirm('确定删除该规格？', (function() {
          var arr = [],
            o = {};
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.tagName === targetName) {
                if (tab.id)
                  arr[0] = tab.id;
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.tagName;
                }
              }
            });
          }

          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.tagName !== targetName);

          if (arr.length > 0) {
            o.id = arr;
            o.deleted = 1;
            o.published = 2;
            this._ajax({
                url: this.rootAPI + 'productsku/update',
                param: o,
                arr: true
              })
              .then((function(d) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
              }).bind(this))
          }
        }).bind(this))
      }
    },
    modalSubmit() {
      this.refreashTab();
    },
    refreashTab() {
      this.measureMethodChange(this.form.measureMethod);
      //刷新tab内容
      this._ajax({
          url: this.rootAPI,
          name: 'productsku/listDto',
          param: {
            productId: this.form.id,
            deleted: 0
          }
        })
        .then((function(d) {
          let data = d.aaData;
          let skuData = [];
          var vm = this;
          $.each(data, function(i, obj) {
            obj.tagName = obj.id + '';
            obj.title = obj.name;
            obj.measureType = vm.measureType;
            obj.measureMethodName = obj.baseMeasureName;
            obj.measureMethod = obj.baseMeasure;
            obj.skuMeasuremethodList = vm.skuMeasuremethodList;
            obj.measureTypePro=vm.form.measureTypePro;
            //	          			console.info("第二步：", vm.skuMeasuremethodList)
            skuData.push(obj);
            //设置选中最新一个tag
            if (i == 0)
              vm.editableTabsValue = obj.tagName
          });
          this.editableTabs = skuData.reverse();
        }).bind(this))
    },
    refreashSkuMeasuremethod() {
      let data = [];
      let vm = this;
      $.each(this.measuremethodList, function(i, obj) {
        if (obj.methodType == vm.measureType || vm.measureType == '1') data.push(obj)
      });
      this.skuMeasuremethodList = data;
    }
  }
}
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
    .marginClass{
		margin: 0 20px;
	}
</style>
