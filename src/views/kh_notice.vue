<template>
  <div class="page-khNolice">
    <!-- 表格 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--基本信息-->
      <el-tab-pane label="已发布" name="first" v-if="!isBuyer">
        <!-- 查询条件 -->
        <searchInputItems>
          <searchInputItem name="发送状态" class="searchbox1" v-if="standfYC">
            <selectInput :value.sync="searchForm.noticeStatus" @selectChange="search">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </selectInput>
          </searchInputItem>
          <searchInputItem name="公告内容" class="searchbox1">
            <inputItem :value.sync="searchForm.comment" @enter="search"></inputItem>
          </searchInputItem>
          <!-- 操作按钮 -->
          <optionItems>
            <template slot="right">
              <el-button-group>
                <iconBtn iconClass="el-icon-plus" content="新增" @click="add" type="success" v-if="standfYC">新增</iconBtn>
                <iconBtn iconClass="el-icon-search" content="查询" @click="search" type="primary">查询</iconBtn>
                <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
              </el-button-group>
            </template>
          </optionItems>
        </searchInputItems>
        <!--表格-->
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading"
          @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
          <el-table-column prop="publishedDate" label="发送人">
            <template slot-scope="scope">
              <span>{{scope.row.createdPersonName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop=" title" label="信息标题">
            <template slot-scope="scope">
              <span v-if="scope.row.title">{{scope.row. title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tilet" label="信息内容">
            <template slot-scope="scope">
              <span v-if="scope.row.comment" style=" overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.comment}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supportNum" label="附件数量">
            <template slot-scope="scope">
                <span>{{scope.row.supportNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="noticeStatus" label="发送状态">
            <template slot-scope="scope">
              <span v-for="item in statusOptions">
                <span v-if="scope.row.noticeStatus == item.key">{{item.value}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间">
            <template slot-scope="scope">
              <!--<toolTip :content="scope.row.createdDate">-->
              <span>{{scope.row.createdDate}}</span>
              <!--</toolTip>-->
            </template>
          </el-table-column>
          <el-table-column prop="publishedDate" label="发送时间">
            <template slot-scope="scope">
              <!--<toolTip :content="scope.row.publishedDate">-->
              <span>{{scope.row.publishedDate}}</span>
              <!--</toolTip>-->
            </template>
          </el-table-column>

          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button-group>
                <iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="scope.row.noticeStatus ==0"></iconBtn>
                <iconBtn iconClass="el-icon-circle-check" content="发送" @click="send(scope.row)" v-if="scope.row.noticeStatus ==0"></iconBtn>
                <iconBtn iconClass="el-icon-view" content="查看" @click="lookup(scope.row)"></iconBtn>
                <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)" v-if="scope.row.noticeStatus ==0"></iconBtn>
              </el-button-group>
            </template>
          </el-table-column>
        </elemTable>
      </el-tab-pane>
      <el-tab-pane label="已接收" name="standf">
        <searchInputItems>
          <searchInputItem name="发送状态" class="searchbox1" v-if="standfYC">
            <selectInput :value.sync="searchForm.noticeStatus" @selectChange="search">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </selectInput>
          </searchInputItem>
          <searchInputItem name="公告内容" class="searchbox1">
            <inputItem :value.sync="searchForm.comment" @enter="search"></inputItem>
          </searchInputItem>
          <!-- 操作按钮 -->
          <optionItems>
            <template slot="right">
              <el-button-group>
                <iconBtn iconClass="el-icon-plus" content="新增" @click="add" type="success" v-if="standfYC">新增</iconBtn>
                <iconBtn iconClass="el-icon-search" content="查询" @click="search" type="primary">查询</iconBtn>
                <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
              </el-button-group>
            </template>
          </optionItems>
        </searchInputItems>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading"
          @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
          <el-table-column prop=" title" label="信息标题">
            <template slot-scope="scope">
              <span v-if="scope.row.title">{{scope.row. title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tilet" label="信息内容">
            <template slot-scope="scope">
              <span v-if="scope.row.comment" style=" overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.comment}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supportNum" label="附件">
            <template slot-scope="scope">
              <toolTip :content="scope.row.publishedDate">
              <span>{{scope.row.supportNum}}</span>
              </toolTip>
            </template>
          </el-table-column>
          <el-table-column prop="publishedDate" label="发送时间">
            <template slot-scope="scope">
              <toolTip :content="scope.row.publishedDate">
              <span>{{scope.row.publishedDate}}</span>
              </toolTip>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button-group>
                <iconBtn iconClass="el-icon-view" content="查看" @click="platformlookUp(scope.row)"></iconBtn>
              </el-button-group>
            </template>
          </el-table-column>
        </elemTable>
      </el-tab-pane>
    </el-tabs>
    <noiceModal :modal='modalShow' v-if='modalShow' :modalTitle='modalTitle' :messageRow='messageRow' :lookup='islookup' @close='modalClose'></noiceModal>
  </div>
</template>
<script>
  import local from '../local.js'
  import mixin from '../mixin/mixin.js'
  import noiceModal from './modals/noiceModal.vue'
  export default {
    mixins: [mixin],
    components: {
      noiceModal
    },
    data() {
      return {
        searchForm: {
          customerName: '',
          title: '',
          comment: '',
          noticeStatus: '',
          publishedDate: '',
          createdDate: '',

        },
        dataList: [],
        messageTypeList: [],
        channelList: [],
        statusOptions: [],
        whetherList: [],
        templateList: [],
        activeName: 'first',
        rowOBJ: {},
        ///弹出框
        modalTitle: '',
        modalShow: false,
        islookup: false,
        dateValue: [],
        isBuyer: false
      }
    },
    mounted() {
      var sessionUser = local.get('sessionUser')
      if (!this.isEmptyObject(sessionUser) && sessionUser.typeId === 'buyer') {
        this.isBuyer = true
        this.activeName = 'standf'
      }
      this.init();
    },
    methods: {
      //数据字典查询激活与否
      init() {
        var vm = this;
        Object.assign(this.searchForm, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        this._ajax({
            url: this.rootAPI,
            name: 'datadic/list',
            loading: 'dataLoading'
          })
          .then((function (d) {
            d.aaData.map(function (el) {
              if (el.dataType == 'MS_SEND_TYPE') {
                vm.statusOptions.push(el);
              }
            })
            this.searchTable(this.searchForm)
          }).bind(this))
      },
      searchTable(param) {
        let user = local.get('sessionUser');
        this.typeCode = parseInt((user.typeCode));
        Object.assign(this.searchForm, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        //已接收		        
        if (this.activeName == 'standf') {
          //刷新列表
          this.standfYC = false;
          let param = this.searchForm;
          param.pageNum = this.pageNum;
          param.pageSize = this.pageSize;
          param.customerId = user.userId;
          return this._ajax({
            url: this.rootAPI,
            name: "platformnoticeflow/list",
            param: param,
            loading: 'dataLoading'
          }).then((function (d) {
            let data = d.aaData;
            this.dataList = data;
            this.pageTotal = d.dataCount
          }).bind(this));

        } else {
          let typeId = local.get('sessionUser').typeId;
          if (typeId != 'buyer') {
            this.standfYC = true;
          }
          let param = this.searchForm;
          param.pageNum = this.pageNum;
          param.pageSize = this.pageSize;
          param.createdPersonId = user.userId;
          return this._ajax({
            url: this.rootAPI,
            name: 'platformnotice/list',
            param: param,
            loading: 'dataLoading'
          }).then(this.renderTable)
        }
      },
      //查询
      search() {
        let user = local.get('sessionUser');
        this.typeCode = parseInt((user.typeCode));
        Object.assign(this.searchForm, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })

        //已接收		
        if (this.activeName == 'standf') {
          //刷新列表
          let param = this.searchForm;
          param.pageNum = this.pageNum;
          param.pageSize = this.pageSize;
          param.customerId = user.userId;
          return this._ajax({
            url: this.rootAPI,
            name: "platformnoticeflow/list",
            param: param,
            loading: 'dataLoading'
          }).then((function (d) {
            let data = d.aaData;
            this.dataList = data;
            this.pageTotal = d.dataCount
          }).bind(this));
        } else {
          let param = this.searchForm;
          param.pageNum = this.pageNum;
          param.pageSize = this.pageSize;
          param.createdPersonId = user.userId;
          return this._ajax({
            url: this.rootAPI,
            name: 'platformnotice/list',
            param: param,
            loading: 'dataLoading'
          }).then(this.renderTable)
        }
      },
      reset() {
        Object.assign(this.searchForm, {
          childChannelCode: local.get('sessionUser').typeCode,
          noticeStatus: '',
          comment: ''
        })
        this.handleCurrentChange(1)
      },
      add() {
        this.islookup = false;
        this.messageRow = {}
        this.modalTitle = '新增'
        this.modalShow = true;
      },
      //编辑
      edit(o) {
        this.islookup = false;
        this.modalTitle = '编辑'
        this.messageRow = o
        this.modalShow = true;
        this.handleCurrentChange(1)
      },
      //查看
      lookup(o) {
        this.modalShow = true;
        this.modalTitle = '查看'
        this.islookup = true
        this.messageRow = o
      },
      //查看
      platformlookUp(o) {
        this.modalShow = true;
        this.modalTitle = '查看消息'
        this.islookup = true
        this.messageRow = o
      },
      modalClose() {
        this.modalShow = false;
        this.messageRow = {};
        this.search();
      },
      send(o) {
        var vm = this;
        var param = {}
        Object.assign(param, o); //防止界面改了状态 而后端更改失败 导致维护局不一致
        param.noticeStatus = 1;
        var platflow = {
          mainId: o.id,
          title: o.title,
          comment: o.comment,
          noticeStatus: 0,
          publishedDate: this._getCurrentDate(),
          userIds: o.customerId,
          userNames: o.customerName
        }
        this.confirm('确定发送？', (function () {
          this._ajax({
              url: this.tootAPI,
              name: 'platformnoticeflow/create',
              param: platflow
            })
            .then((d) => {
              if (d.state == 0) {
              	param.publishedDate=this._getCurrentDate(),
                this._ajax({
                    url: this.tootAPI,
                    name: 'platformnotice/update',
                    param: param
                  })
                  .then((f) => {
                    if (f.state == 0) {
                      this.$message({
                        type: 'success',
                        message: '操作成功！'
                      });
                      this.search();
                    }
                  })
              }
            })
        }).bind(this))
      },
      dele() {
        if (this.delSelection.length === 0) {
          this.$message({
            type: 'info',
            message: '请选择行'
          });
        } else {
          let selection = this.delSelection
          this.confirm('确定删除？', (function () {
            var arr = [],
              o = {}
            selection.forEach(function (el) {
              arr.push(el.id)
            })
            o.id = arr
            this._ajax({
                url: this.rootAPI + 'platformnotice/delete',
                param: o,
                arr: true
              })
              .then((function (d) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.handleCurrentChange(1)
              }).bind(this))
          }).bind(this))
        }
      },
      delRow(row) {
        this.confirm('确定删除？', (function () {
          var o = {
            id: [row.id]
          }
          this._ajax({
              url: this.rootAPI + 'platformnotice/delete',
              param: o,
              arr: true
            })
            .then((function (d) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.handleCurrentChange(1)
            }).bind(this))
        }).bind(this))
      },
      changeMobile(row) {
        // if(!this.regFloat.test(row.mobile)) {
        // 	console.log(this.regFloat.test(row.mobile))
        // 	row.mobile = 0
        // }
      },
      //通过activeName名字取定位页面
      handleClick(tab, event) {
        let key = tab.name;
        this.searchTable(key);
        this.activeName == "standf";
      },
    }
  }
</script>
<style lang="sass">
  .page-khNolice {
    padding: 15px;
    .toubu_B {
      height: 45px;
      border-bottom: 1px solid #D1D1D1;
      margin: 10px;
      .tliel_name {
        float: left;
        font-size: 18px;
      }
      .addanniu {
        float: right;
      }
    }
    .searchbox1 {
      margin-top: 10px;
    }
  }
</style>
