<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="marginClass">
    <el-tab-pane :key="item.key" v-for="(item, index) in tabList" :label="item.value" :name="item.key">
      <!-- 查询条件 -->
      <searchInputItems>
        <searchInputItem name="创建时间">
          <div class="block">
            <el-date-picker v-model="searchForm.createdDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          </div>
        </searchInputItem>
        <searchInputItem name="日期范围">
          <dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
        </searchInputItem>
        <searchInputItem name="活动关键字">
          <inputItem :value.sync="searchForm.keyWord" placeHolder="请输入活动关键字"></inputItem>
        </searchInputItem>
      </searchInputItems>
      <!-- 操作按钮 -->
      <optionItems>
        <template slot="right">
          <el-button-group>
            <iconBtn iconClass="el-icon-plus" content="新增" @click="addPromotion" type="success">新增</iconBtn>
            <!--<iconBtn iconClass="el-icon-minus" content="删除" @click="dele"></iconBtn>-->
            <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
            <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
          </el-button-group>
        </template>
      </optionItems>
      <!-- 表格 -->
      <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading"
        @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="promotionTitle" label="活动名称">
          <template slot-scope="scope">
            <toolTip :content="scope.row.promotionTitle">
              <span>{{scope.row.promotionTitle}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始时间">
          <template slot-scope="scope">
            <toolTip :content="_dateFormat({date: scope.row.startDate})">
              <span>{{scope.row.startDate}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="结束时间">
          <template slot-scope="scope">
            <toolTip :content="_dateFormat({date: scope.row.endDate})">
              <span>{{scope.row.endDate}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="productCount" label="涉及商品">
          <template slot-scope="scope">
            <toolTip :content="scope.row.productCount">
              <span>{{scope.row.productCount}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="customerCount" label="客户">
          <template slot-scope="scope">
            <toolTip :content="scope.row.customerCount">
              <span>{{scope.row.customerCount}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="promotionStatus" label="活动状态">
          <template slot-scope="scope">
            <toolTip :content="_dicValue(scope.row.promotionStatus, dicEnabled)">
              <tagItem :type="scope.row.promotionStatus == 1 ? 'Blue' : 'warning'" :text="_dicValue(scope.row.promotionStatus, dicEnabled)"></tagItem>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="创建时间">
          <template slot-scope="scope">
            <toolTip :content="scope.row.createdDate">
              <span>{{scope.row.createdDate}}</span>
            </toolTip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="scope">
            <el-button-group>
              <iconBtn iconClass="el-icon-caret-right" content="启用" @click="changeStatus(scope.row, 1)" v-if="scope.row.promotionStatus == 0">启用</iconBtn>
              <iconBtn iconClass="el-icon-circle-close" content="停用" @click="changeStatus(scope.row, 0)" v-if="scope.row.promotionStatus == 1">停用</iconBtn>
              <iconBtn iconClass="el-icon-error" content="结束活动" @click="changeStatus(scope.row, 2)" v-if="scope.row.promotionStatus == 0 || scope.row.promotionStatus == 1">结束活动</iconBtn>
              <iconBtn iconClass="el-icon-edit" content="编辑" @click="modalEditOther(scope.row)" v-if="scope.row.promotionStatus == 0 || scope.row.promotionStatus == 1">编辑</iconBtn>
              <iconBtn iconClass="el-icon-document" content="查看" @click="modalEditOther(scope.row)" v-if="scope.row.promotionStatus == 2">查看</iconBtn>
              <!--<iconBtn iconClass="el-icon-minus" content="删除" text="true" @click="delRow(scope.row)"></iconBtn>-->
            </el-button-group>
          </template>
        </el-table-column>
      </elemTable>

    </el-tab-pane>
  </el-tabs> 
</template> 
<script>
  import local from '../local.js'
  import mixin from '../mixin/mixin.js'
  import promotionModal from './modals/promotionModal.vue'
  export default {
    mixins: [mixin],
    components: {
      promotionModal
    },
    data() {
      return { 
        dateRange: [],
        searchForm: {
          createdDate: '',
          keyWord: '',
          promotionStatus: null
        },
        dataList: [],
        rowOBJ: {},
        activeName: '-1',
        tabList: [{
          'key': '-1',
          value: '全部'
        }]
      }
    },
    mounted() {
      this._ajax({
          name: 'datadic/listAll',
          param: {
            'dataType': 'IS_ENABLED'
          }
        })
        .then((function (d) {
          this.dicEnabled = this._dicKey(d)
          let temp = this.tabList;
          $.each(this.dicEnabled, function (i, obj) {
            temp.push({
              'key': this.key + '',
              'value': this.value
            });
          });
          this.tabList = temp;
          //				console.info(this.tabList);
        }).bind(this))
        .then(this.searchTable)
    },
    methods: {
      handleClick(tab, event) {
        //		        console.log(tab, event);
        let status = this.activeName;
        if (status == '-1') {
          Object.assign(this.searchForm, {
            promotionStatus: null
          })
        } else {
          Object.assign(this.searchForm, {
            promotionStatus: status
          })
        }
				this.pageNum = 1
        this.searchTable();
      },
      searchTable() {
        console.log(163)
        let user = local.get('sessionUser');
        var dateRange = {
          startDate: '',
          endDate: ''
        }
        if (this.dateRange && this.dateRange.length > 0) {
          dateRange = {
            startDate: this.dateRange[0] + ' 00:00:00',
            endDate: this.dateRange[1] + ' 23:59:59'
          }
        }
        Object.assign(this.searchForm, dateRange, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          createdPersonId:local.get('userinfo').userId
        })
        return this._ajax({
          name: 'promotion/list',
          param: this.searchForm,
          loading: 'dataLoading' 
        }).then(this.renderTable)
      },
      reset() {
        Object.assign(this.searchForm, {
          name: '',
          enabled: '',
          keyWord: '',
          createdDate: '',
        })
        this.dateRange = [];
        this.handleCurrentChange(1)
      },
      dele() {
        if (this.delSelection.length === 0) {
          this.$message({
            type: 'info',
            message: '请选择行'
          });
        } else {
          let selection = this.delSelection
          var arr = [],
            o = {}
          selection.forEach(function (el) {
            arr.push(el.id)
          })
          o.id = arr
          this.delSubmit(o)
        }
      },
      modalEditOther(row) {
        this.$router.push({
          name: 'promotionModal',
          query: {
            id: row.id
          }
        });
      },
      addPromotion() {
        this.$router.push({
          name: 'promotionModal'
        });
      },
      changeStatus(obj, status) {
        let param = {
          id: obj.id,
          promotionStatus: status
        }
        if (status == 2) {
          this.confirm('活动结束后就不能进行编辑操作了，是否继续？', (function () {
            this._ajax({
                url: this.rootAPI,
                name: "promotion/update",
                param: param
              })
              .then((function (d) {
                this.$message({
                  type: 'success',
                  message: '修改状态成功'
                });
                this.handleCurrentChange(1)
              }).bind(this))
          }).bind(this))
        } else {
          this._ajax({
              url: this.rootAPI,
              name: "promotion/update",
              param: param
            })
            .then((function (d) {
              this.$message({
                type: 'success',
                message: '修改状态成功'
              });
              this.handleCurrentChange(1)
            }).bind(this))
        }
      }
    }
  }
</script>
<style>
  .marginClass {
    margin: 0 20px;
  }
</style>
