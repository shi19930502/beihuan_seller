<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="marginClass">
    <el-tab-pane
      :key="item.key"
      v-for="(item, index) in tabList"
      :label="item.value"
      :name="item.key"
    >
      <!-- 查询条件 -->
      <searchInputItems>
        <searchInputItem name="商品关键字">
          <inputItem
            :value.sync="searchForm.keyWord"
            placeHolder="请输入商品关键字"
          ></inputItem>
        </searchInputItem>
        <searchInputItem name="所属分类">
			<cascaderItem :options="categoryList" @change="categoryChange" :value.sync="searchForm.selectoption" :propss="propss"></cascaderItem>
          <!-- <cascaderItem
            :options="categoryList"
            :value.sync="searchForm.gbgoodsid"
            :propss="propss"
            @change="categoryChange"
            :changeOnSelect="false"
          ></cascaderItem> -->
        </searchInputItem>
      </searchInputItems>
      <!-- 操作按钮 -->
      <optionItems>
        <template slot="right">
          <el-button-group>
            <iconBtn
              iconClass="el-icon-plus"
              content="新增"
              type="success"
              @click="addPromotion"
              >新增</iconBtn
            >
            <!--<iconBtn iconClass="el-icon-minus" content="删除" @click="dele"></iconBtn>-->
            <iconBtn
              iconClass="el-icon-search"
              content="查询"
              type="primary"
              @click="searchTable"
              >查询</iconBtn
            >
            <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset"
              >重置</iconBtn
            >
          </el-button-group>
        </template>
      </optionItems>
      <!-- 表格 -->
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
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="name" label="商品名称">
          <template slot-scope="scope">
            <toolTip :content="scope.row.name">
              <span>{{ scope.row.name }}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="productPicUrl" label="图片">
          <template slot-scope="scope">
            <!--<toolTip :content="(scope.row.productPicUrl == null || scope.row.productPicUrl == '') ? '暂无图片' : scope.row.productPicUrl ">
			    			<imgItem :path="scope.row.productPicUrl"></imgItem>
			    		</toolTip>-->
            <imgItem :path="scope.row.productPicUrl"></imgItem>
          </template>
        </el-table-column>
        <el-table-column prop="vulgo" label="商品别名">
          <template slot-scope="scope">
            <toolTip :content="scope.row.vulgo">
              <span>{{ scope.row.vulgo }}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="isMuslim" label="是否清真">
          <template slot-scope="scope">
            <toolTip :content="_dicValue(scope.row.isMuslim, isMuslimList)">
              <el-tag size="mini"
                ><span>{{
                  _dicValue(scope.row.isMuslim, isMuslimList)
                }}</span></el-tag
              >
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编码">
          <template slot-scope="scope">
            <toolTip :content="scope.row.code">
              <span>{{ scope.row.code }}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="stockQuantity" label="库存">
          <template slot-scope="scope">
            <toolTip :content="scope.row.stockQuantity">
              <span>{{scope.row.stockQuantity}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <!-- 			    <el-table-column prop="price" label="售价（元）">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.price">
			    			<tagItem :type="scope.row.price"></tagItem>
			    		</toolTip>
			      	</template>
			    </el-table-column> -->
        <el-table-column prop="measureMethod" label="计量单位">
          <template slot-scope="scope">
            <toolTip
              :content="
                renderCommon(measuremethodList, scope.row.measureMethod)
              "
            >
              <span>{{
                renderCommon(measuremethodList, scope.row.measureMethod)
              }}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <iconBtn
                iconClass="el-icon-edit"
                content="编辑"
                @click="modalEditOther(scope.row)"
                >编辑</iconBtn
              >
              <iconBtn
                iconClass="el-icon-edit"
                content="下架"
                @click="undercarriage(scope.row, 2)"
                v-if="scope.row.published == 1 || scope.row.published == null"
                >下架</iconBtn
              >
              <iconBtn
                iconClass="el-icon-edit"
                content="上架"
                @click="undercarriage(scope.row, 1)"
                v-if="scope.row.published == 2"
                >上架</iconBtn
              >
            </el-button-group>
          </template>
        </el-table-column>
      </elemTable>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import mixin from "../mixin/mixin.js";
import local from "../local.js";
import productOnlineModal from "./modals/productOnlineModal.vue";
export default {
  mixins: [mixin],
  components: { productOnlineModal },
  data() {
    return {
      dateRange: [],
      searchForm: {
		keyWord: "",
		gbgoodsid:'',
		selectoption:[],
        published: 1
      },
      dataList: [],
      rowOBJ: {},
      activeName: "1",
      tabList: [],
      measuremethodList: [],
      isMuslimList: [],
      propss: {
        label: "vulgo",
        value: "gbgoodsId",
        children: "childList"
      },
      categoryList: []
    };
  },
  mounted() {
    //是否清真
    this._searchDic("IS_MUSlIM").then(
      function(d) {
        this.isMuslimList = this._dicKey(d);
      }.bind(this)
    );
    this._ajax({
      url: this.rootAPI,
      name: "measuremethod/list",
      param: {}
    }).then(
      function(d) {
        this.measuremethodList = d.aaData;
      }.bind(this)
    );
    this._searchDic("PRODUCT_STATUS")
      .then(
        function(d) {
          this.dicEnabled = this._dicKey(d);
          let temp = this.tabList;
          $.each(this.dicEnabled, function(i, obj) {
            temp.push({ key: this.key + "", value: this.value });
          });
          this.tabList = temp;
          //				console.info(this.tabList);
        }.bind(this)
      )
      .then(this.searchTable);

    //商品分类
    let categoryList = this.$store.state.categoryList;
    if (!categoryList || categoryList.length == 0) {
      this._saveProCategory().then(
        function(d) {
          this.categoryList = this.$store.state.categoryList;
        }.bind(this)
      );
    } else this.categoryList = this.$store.state.categoryList;
  },
  methods: {
    renderCommon(dataList, code) {
      let dataShow = "";
      $.each(dataList, function(i, obj) {
        if (obj.code == code) {
          dataShow = obj.name;
        }
      });
      return dataShow;
    },
    categoryChange(val) {
		this.searchForm.selectoption=val;
      if (val.length > 0) {

        Object.assign(this.searchForm, { gbgoodsid: val[val.length - 1] });
      } else {
        Object.assign(this.searchForm, { gbgoodsid: "" });
	  }
	  console.log(val);
    },
    handleClick(tab, event) {
      //		        console.log(tab, event);
      this.pageNum = 1;
      let status = this.activeName;
      if (status == "1") {
        Object.assign(this.searchForm, {
          published: 1
        });
      } else {
        Object.assign(this.searchForm, {
          published: 2
        });
      }
      this.searchTable();
    },
    searchTable() {
      Object.assign(this.searchForm, {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        extend:local.get('userinfo').typeCode,
        customerId:local.get('userinfo').typeCode
      });
      return this._ajax({
        name: "product/queryList",
        param: this.searchForm,
        loading: "dataLoading"
      }).then(this.renderTable);
    },
    reset() {
      Object.assign(this.searchForm, {
		keyWord: "",
		gbgoodsid:"",
		selectoption:[]
	  });
	  console.log(this.searchForm);
      this.handleCurrentChange(1);
    },
    modalEditOther(row) {
      this.$router.push({ name: "productOnlineModal", query: { id: row.id } });
    },
    addPromotion() {
      this.$router.push({ name: "productOnlineModal" });
    },
    undercarriage(obj, status) {
      let param = {
        id: obj.id,
        published: status,
        productPicUrl: obj.productPicUrl
      };
      this._ajax({ url: this.rootAPI, name: "product/update", param: param })
        .then(
          function(d) {
            if(d.state == 0) {
              this.$message({ type: "success", message: "修改状态成功" });
            }else{
              this.$message({ type: 'failure', message: '修改状态失败：'+d.msg }); 
            }
            
          }.bind(this)
        )
        .then(this.searchTable);
      //this.searchTable();
    }
  }
};
</script>
<style>
.marginClass {
  margin: 0 20px;
}
</style>
