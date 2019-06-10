<template>
	<div class="page-data-xiaofei">
		<searchInputItems>
			<searchInputItem name="分拣日期">
				<dateEditorDaterange :dateValue.sync="sortdaterange"></dateEditorDaterange>
			</searchInputItem>
            <searchInputItem name="工号">
				<inputItem :value.sync="sortform.jobno"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchsort" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportsortExcel" type="info">导出Excel</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 图表 -->
 <el-row>
            <el-col :span="1"><div class="pagebtn" id="sortpageleft" @click="sortpageclick('l')"><i class="el-icon-arrow-left"></i></div></el-col>
            <el-col :span="22"> 
              <div class="" v-loading="sortLoading">
		             	<div id="sorterBar" style="height: 450px;"></div>
	           	</div>
               </el-col>
            <el-col :span="1"><div class="pagebtn" id="sortpageright" @click="sortpageclick('r')"><i class="el-icon-arrow-right"></i></div></el-col>
        </el-row> 
		
        <searchInputItems>
			<searchInputItem name="分拣日期">
				<dateEditorDaterange :dateValue.sync="productdaterange"></dateEditorDaterange>
			</searchInputItem>
            <searchInputItem name="商品名称">
				<inputItem :value.sync="productform.productName"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchpro" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportproExcel" type="info">导出Excel</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>

     <el-row>
            <el-col :span="1"><div class="pagebtn" id="propageleft" @click="propageclick('l')"><i class="el-icon-arrow-left"></i></div></el-col>
            <el-col :span="22"> 
              <div class="" v-loading="proLoading">
			          <div id="productBar" style="height: 450px;"></div>
		          </div>
            </el-col>
            <el-col :span="1"><div class="pagebtn" id="propageright" @click="propageclick('r')"><i class="el-icon-arrow-right"></i></div></el-col>
        </el-row>

	</div>
</template>
<script>
import mixin from "../mixin/mixin.js";
import local from "../local.js";
var sorterBar = null,
  productBar = null;
export default {
  mixins: [mixin],
  data() {
    return {
      sortform: {
        jobno: "",
        startTime: "", //2018-05-15
        endTime: "" //2018-05-18
      },
      productform: {
        productName: "",
        startTime: "",
        endTime: ""
      },
      s_pageindex: 1,
      s_pagesize: 10,
      s_totalpage: 0,
      p_pageindex: 1,
      p_pagesize: 10,
      p_totalpage: 0,
      sortdaterange: [],
      productdaterange: [],
      sortLoading: false,
      proLoading: false,
      sorterOption: {
        legend: {
          data: ["已分拣", "未分拣"]
        },
        series: [
          {
            name: "已分拣",
            type: "bar",
            data: []
          },
          {
            name: "未分拣",
            type: "bar",
            data: []
          }
        ]
      },
      proOption: {
        legend: {
          data: ["分拣总量", "分拣总次数"]
        },
        xAxis: [
          {
            type: "category",
            data: []
          }
        ],
        series: [
          {
            name: "分拣总量",
            type: "bar",
            data: []
          },
          {
            name: "分拣总次数",
            type: "bar",
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    // 初始化图表
    sorterBar = echarts.init(document.getElementById("sorterBar"));
    productBar = echarts.init(document.getElementById("productBar"));
    /**customerid  需要从缓存中获取 */
    let user = local.get('sessionUser');
    this.sortform.customerId = parseInt(user.typeCode||0);
    this.productform.customerId = parseInt(user.typeCode||0);
    this.searchsort();
    this.searchpro();
  },
  methods: {
    searchsort() {
      var sf = this;

      if (this.sortdaterange && this.sortdaterange.length > 0) {
        this.sortform.startTime = this.sortdaterange[0];
        this.sortform.endTime = this.sortdaterange[1];
      }

      Object.assign(this.sortform, {
        pageNum: this.s_pageindex,
        pageSize: this.s_pagesize
      });
      return this._ajax({
        url: this.rootAPI,
        name: "sorSortingtask/GetSorterStatistic",
        param: this.sortform,
        loading: "dataLoading"
      }).then(d => {
        //console.log(d);
        sf.s_totalpage = Math.ceil(d.dataCount / sf.s_pagesize);
        var sort_x = [];
        var sort_y0 = [];
        var sort_y1 = [];
        d.aaData.forEach(function(el) {
          sort_x.push("工号[" + el.jobno + "]");
          sort_y0.push(el.sortedcount);
          sort_y1.push(el.unsortcount);
        });
        sf.sorterOption.series[0].data = sort_y0;
        sf.sorterOption.series[1].data = sort_y1;
        sf.setSortBar(
          sort_x,
          sf.sorterOption.legend.data,
          sf.sorterOption.series
        );
      });
    },
    exportsortExcel() {
      var fields = ["name", "jobno", "sortedcount", "unsortcount"],
        filedsName = [
          "分拣员姓名",
          "分拣员工号",
          "已分拣任务数",
          "未分拣任务数"
        ],
        fileName = "分拣员统计";
      this.searchAll({
        url: this.rootAPI,
        name: "sorSortingtask/GetSorterStatistic",
        param: this.sortform
      }).then(
        function(d) {
          if (d.aaData.length > 0) {
            let data = [];
            let vm = this;
            $.each(d.aaData, function(i, obj) {
              data.push({
                name: obj.name,
                jobno: obj.jobno,
                sortedcount: obj.sortedcount,
                unsortcount: obj.unsortcount
              });
            });
            this._csvExport(data, fields, filedsName, fileName);
          } else {
            this.$message({ type: "info", message: "无导出数据" });
          }
        }.bind(this)
      );
    },
    searchpro() {
      var sf = this;

      if (this.productdaterange && this.productdaterange.length > 0) {
        this.productform.startTime = this.productdaterange[0];
        this.productform.endTime = this.productdaterange[1];
      }

      Object.assign(this.productform, {
        pageNum: this.p_pageindex,
        pageSize: this.p_pagesize
      });
      return this._ajax({
        url: this.rootAPI,
        name: "sorSortingtask/GetProductStatistic",
        param: this.productform,
        loading: "dataLoading"
      }).then(d => {
        //console.log(d);
        sf.p_totalpage = Math.ceil(d.dataCount / sf.p_pagesize);
        var pro_x = [];
        var pro_y0 = [];
        var pro_y1 = [];
        d.aaData.forEach(function(el) {
          pro_x.push(el.productName);
          pro_y0.push(el.totalWeight);
          pro_y1.push(el.totalCount);
        });
        sf.proOption.series[0].data = pro_y0;
        sf.proOption.series[1].data = pro_y1;
        sf.setProBar(pro_x, sf.proOption.legend.data, sf.proOption.series);
      });
    },
    exportproExcel() {
      var fields = ["productName", "totalCount", "totalWeight"],
        filedsName = [
          "商品名称",
          "分拣总次数",
          "分拣总量"
        ],
        fileName = "分拣商品统计";
      this.searchAll({
        url: this.rootAPI,
        name: "sorSortingtask/GetProductStatistic",
        param: this.productform
      }).then(
        function(d) {
          if (d.aaData.length > 0) {
            let data = [];
            let vm = this;
            $.each(d.aaData, function(i, obj) {
              data.push({
                productName: obj.productName,
                totalCount: obj.totalCount,
                totalWeight: obj.totalWeight
              });
            });
            this._csvExport(data, fields, filedsName, fileName);
          } else {
            this.$message({ type: "info", message: "无导出数据" });
          }
        }.bind(this)
      );
    },
    setSortBar(xAxisData, legenddata, seriesdata) {
      sorterBar.setOption(
        this._setBar({
          xAxisData: xAxisData,
          legend: legenddata,
          seriesData: seriesdata,
          title: "分拣员统计"
        })
      );
    },
    setProBar(xAxisData, legenddata, seriesdata) {
      productBar.setOption(
        this._setBar({
          xAxisData: xAxisData,
          legend: legenddata,
          seriesData: seriesdata,
          title: "商品统计"
        })
      );
    },
    //分页点击事件
    sortpageclick: function(type) {
      var sf = this;
      if (type == "l") {
        //左点击
        if (sf.s_pageindex == 1) {
          sf.s_pageindex = sf.s_totalpage;
        } else {
          sf.s_pageindex--;
        }
      } else if (type == "r") {
        //右点击
        if (sf.s_pageindex == sf.s_totalpage) {
          sf.s_pageindex = 1;
        } else {
          sf.s_pageindex++;
        }
      }
      sf.searchsort();
    },
    propageclick: function(type) {
      var sf = this;
      if (type == "l") {
        //左点击
        if (sf.p_pageindex == 1) {
          sf.p_pageindex = sf.p_totalpage;
        } else {
          sf.p_pageindex--;
        }
      } else if (type == "r") {
        //右点击
        if (sf.p_pageindex == sf.p_totalpage) {
          sf.p_pageindex = 1;
        } else {
          sf.p_pageindex++;
        }
      }
      sf.searchpro();
    }
  }
};
</script>
<style scoped>
.pagebtn {
  height: 70px;
  width: 100%;
  background: #f3f3f3;
  line-height: 70px;
  text-align: center;
  margin-top: 190px;
  cursor: pointer;
}
.pagebtn:hover {
  height: 70px;
  width: 100%;
  background: #f3f3f3;
  line-height: 70px;
  text-align: center;
  margin-top: 190px;
  cursor: pointer;
  border: solid #d1dbe5 1px;
}
</style>
