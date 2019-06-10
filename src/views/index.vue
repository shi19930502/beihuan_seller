<template>
<div :class="[isCollapse ? 'mini-sidebar' : '', 'app-index']">
  <!-- 左侧导航栏 -->
	<div class="left-nav-bar">
    <div class="left-bar-head" v-if="!isCollapse">
      <img class="head-pic" :src="($store.state.userFilePath == null || $store.state.userFilePath == '' ? './lib/img/indexImg/photo.jpg' : imgURL + $store.state.userFilePath)">
      <div class="head-content">您好，{{custermerName.name}}</div>
    </div>
<!--     <div v-else>
      <img class="head-pic-small" :src="($store.state.userFilePath == null || $store.state.userFilePath == '' ? './lib/img/indexImg/photo.jpg' : imgURL + $store.state.userFilePath)">
    </div>	 -->	
    <ul :class="[isCollapse ? 'menu-collapse' : 'menu-not-collapse', 'metismenu']" id="menu">
      <li v-for="frt in routers" class="first-li">
        <el-tooltip effect="dark" :content="frt.name" placement="right" :disabled="isCollapse ? false : true">
          <a class="has-arrow btn-waves" href="javascript:void(0);" v-if="frt.hasChildren">
            <i :class="['iconfont', frt.iconCls]"></i>
            <span class="nav-title">{{frt.name}}</span>         
          </a>
          <a class="btn-waves" href="javascript:void(0);" v-else @click="router(frt.caption)" :data-link="frt.caption">
            <i :class="['iconfont', frt.iconCls]"></i>
            <span class="nav-title">{{frt.name}}</span>         
          </a>
        </el-tooltip> 
        <ul aria-expanded="true" v-if="frt.hasChildren" class="child-ul">
          <li v-for="sec in frt.children">
            <el-tooltip effect="dark" :content="sec.name" placement="right" :disabled="isCollapse ? false : true">
              <a href="javascript:void(0);" class="btn-waves" @click="router(sec.caption)" v-if="!sec.hasChildren" :data-link="sec.caption">
                <i :class="['iconfont', sec.iconCls]"></i>
                <span class="nav-title">{{sec.name}}</span>
              </a>
              <a href="javascript:void(0);" class="has-arrow btn-waves" v-else>
                <i :class="['iconfont', sec.iconCls]"></i>
                <span class="nav-title">{{sec.name}}</span>
              </a>
            </el-tooltip>  
            <ul aria-expanded="true" v-if="sec.hasChildren">
              <li v-for="thd in sec.children">
                <el-tooltip effect="dark" :content="thd.name" placement="right" :disabled="isCollapse ? false : true">
                  <a href="javascript:void(0);" class="btn-waves" @click="router(thd.caption)" :data-link="thd.caption">
                    <i :class="['iconfont', thd.iconCls]"></i>
                    <span class="nav-title">{{thd.name}}</span>
                  </a>
                </el-tooltip> 
              </li>
            </ul>
          </li>
        </ul> 
      </li>
      <li></li>
    </ul>
	</div>
  <!-- 顶部 -->
	<nav class="navbar navbar-expand-lg navbar-dark top-nav-bar justify-content-between"> 
    <div class="navbar-left flex-x-start">
      <div class="navbar-header">
        <img src="lib/img/indexImg/home_img_logo-yuexi.png" v-if="city === '越西'">
        <img src="lib/img/indexImg/ssnxh.png" v-if="city === '农鲜汇'&&nxhImg">
        <img src="lib/img/indexImg/ssnxh-logo.png" v-else-if="city === '农鲜汇'&&!nxhImg">
        <img src="lib/img/home_ing_logo.png" v-if="city === '银川' || city === '临沂'">
        <span class="h1 navbar-brand mb-0" v-if="city === '银川'">银川公益市场卖家中心</span>
        <span class="h1 navbar-brand mb-0" v-if="city === '临沂'">临沂卖家中心</span>
      </div>
      <div class="flex-y-center nav-btn btn-waves" @click="toggNav">
        <i class="iconfont icon-daohang"></i>
      </div>
    </div>    
    <div style="height: 100%;color: #ffffff" class="flex-y-center">
      <div class="flex-y-center nav-btn btn-waves" @click="_go('kh_notice')">
        <i class="iconfont icon-xiaoxi3"></i>
      </div>
      <div class="user-info flex-y-center nav-btn btn-waves" @click="_go('essentialInformation')">
        <img class="user-head-pic" :src="($store.state.userFilePath == null || $store.state.userFilePath == '' ? './lib/img/indexImg/photo.jpg' : imgURL + $store.state.userFilePath)">
      </div>
      <div class="user-name flex-y-center">{{custermerName.name}}</div>      
      <!-- <div class="flex-y-center flex-x-center user-edit">
        <el-dropdown class="flex-y-center flex-x-center" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">修改密码</el-dropdown-item>
              <el-dropdown-item command="b" v-if="isSys">登录错误设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </div> -->
      <div class="flex-y-center nav-btn btn-waves" @click="logout">
        退出
      </div>
    </div> 	
	</nav>
  <!-- 内容 -->
	<div class="main-container">
		<div class="bread-box flex-y-center flex-x-between">  
        <div v-if="$route.name !== 'index_index'">
          <div class="page-title">{{currentPage}}</div>
          <div class="flex-y-center">
            <span class="c-page">{{currentModel}}</span>      
            <span class="xiegang">/</span>
            <span class="c-model">{{currentPage}}</span>
            <span v-if='isThrName' class="xiegang">/</span>
            <span  class="c-model">{{currentPageThr}}</span> 
          </div> 
        </div> 
        <div v-else>
          <div class="page-title">{{$store.state.storeName}}</div>
          <!-- <div class="flex-y-center">
            <span class="c-model days">这是你加入的第<span class="days">{{days}}</span>天</span>
          </div> --> 
        </div>
        <div class="flex-y-center flex-x-end">
          <img class="store-head" :src="($store.state.storePic == null || $store.state.storePic == '') ? './lib/img/indexImg/logo.png' : imgURL + $store.state.storePic">
          <div class="store-review" v-for="item in $store.state.storeReviewList">
            <div>{{item.reviewName}}</div>
            <div class="review-val">{{item.typeScore}}</div>
          </div>
        </div>  
    </div>
		<div class="page-container">
			<transition name="custom-classes-transition"
		      enter-active-class="animated fadeIn"
		      leave-active-class="animated fadeOut" mode="out-in">        
		      <router-view></router-view>
		    </transition>
		</div>	               
	</div>
  <el-dialog custom-class="jz-modal user-role" title="修改密码" :visible.sync="modalPwd" :before-close="handleClosePwd" size="tiny" :close-on-click-modal="false">
        <el-form class="modal-form" v-if="modalPwd" :model="modelFormPwd" ref="modelFormPwd" :inline="true" :rules="modalRulesPwd" label-width="80px">
          <div class="flex-x-center">
            <el-form-item label="旧密码" prop="oldPwd">
              <el-input v-model="modelFormPwd.oldPwd" type="password" size="mini"></el-input>
            </el-form-item>
          </div>
          <div class="flex-x-center">
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model="modelFormPwd.newPwd" type="password" size="mini"></el-input>
            </el-form-item>
          </div>
          <div class="flex-x-center">
            <el-form-item label="确认密码" prop="confirmPwd">
                <el-input v-model="modelFormPwd.confirmPwd" type="password" size="mini"></el-input>
            </el-form-item>
          </div>       
        </el-form>          
        <span slot="footer" class="dialog-footer" v-if="!abled">
          <span class="jz-btn jz-btn-gray" @click="cancelPwd">取消</span>
          <span class="jz-btn jz-btn-prime" @click="submitPwd">提交</span>
        </span>
    </el-dialog>
    <el-dialog custom-class="jz-modal user-role" title="登录错误次数设置" :visible.sync="modalErrorCount" :before-close="handleCloseErrorCount" size="tiny" :close-on-click-modal="false">
      <el-form class="modal-form" v-if="modalErrorCount" :inline="true" label-width="120px">
        <div class="flex-x-center">
          <el-form-item label="最大次数">
            <el-input-number v-model="errorCount" :min="1" :max="5"></el-input-number>
          </el-form-item>          
        </div>
        <div class="flex-x-center">
          <el-form-item label="锁定时间(分钟)">
            <el-input-number v-model="errorMin" :min="1" :max="30"></el-input-number>
          </el-form-item> 
        </div>             
      </el-form>          
      <span slot="footer" class="dialog-footer" v-if="!abled">
        <span class="jz-btn jz-btn-gray" @click="cancelErrorCount">取消</span>
        <span class="jz-btn jz-btn-prime" @click="submitErrorCount">提交</span>
      </span>
  </el-dialog>
</div>
</template>
<script>
import mixin from '../mixin/mixin.js'
import local from '../local.js' 
import configs from '../configs.js' 
export default {
    mixins: [mixin],
    data() {
      var vm = this
      var vNewPwd = function(rule, value, callback) {
        var val = $.trim(value),
            pPattern = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
        if(val.length === 0) {
          callback(new Error('请输入密码'))
        }else if(val.length > 16){
          callback(new Error('长度不可超过16个字符'))
        }else if(val.length < 8){
          callback(new Error('长度不可低于8个字符'))
        }else if(!pPattern.test(val)){
          callback(new Error('密码应最少8位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'))
        }else {
          callback();
        }
      }
      var vConfirmPwd = function(rule, value, callback) {
        var val = $.trim(value)
        if(val !== $.trim(vm.modelFormPwd.newPwd)) {
          callback(new Error('密码不一致'))
        }else {
          callback();
        }
      }
      var sysFlag = false
      var menu = local.get('navlist')
      if(menu) {
        menu.forEach(function(el) {
          if(el.caption === 'sys') {
            sysFlag = true
          }
        })
      }
      return {
      	nxhImg:true,
        days: '',
        imgURL: configs.imgURL,
      	isThrName:true,
        city: configs.city,
        isCollapse: false,
        navActive: '',
        navOpens: [],
        scrollTop: 0,
        routers: menu,
        custermerName:{},
        userInfo: local.get('userinfo'),
        routerName: '',
        modalPwd: false,
        modelFormPwd: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        modalRulesPwd: {
          newPwd: [{validator: vNewPwd, trigger: 'blur'}],
          confirmPwd: [{ validator: vConfirmPwd, trigger: 'blur' }],
        },
        modalErrorCount: false,
        errorCount: 1,
        errorMin: 1,
        errorCountID: null,
        errorMinID: null,
        isSys: sysFlag,
        storePic: '',
        storeReviewList: []
      };
    },
    mounted() {   
      var vm = this
    	$(window).scroll((function() {
    		this.scrollTop = $(document).scrollTop()
		  }).bind(this))
      $("#menu").metisMenu({});
      $('.metismenu').slimScroll({
          position: 'left',
          height: 'auto',
          width: 'none',
      });
      Waves.attach('.btn-waves');
      Waves.init();
      $('.page-container').css('min-height', ($('.bottom-nav-bar').offset().top - 146)) 
      this.routerName = this.$route.name
      $('.btn-waves').removeClass('active')
      $('.btn-waves').each(function(index, element) {
        var link = $(element).data('link')
        if(link === vm.routerName) {
          $(element).addClass('active')
          $(element).parent().parent().addClass('in')
          $(element).parent().parent().parent().addClass('active')
        }
      })
      $('.router-link').removeClass('active')
      $('.router-link').each(function(index, element) {
        var link = $(element).data('link')
        if(link === vm.routerName) {
          $(element).addClass('active')
        }
      })
      if(!this.userInfo.lastLoginTime) {
      	this.confirm('初始密码存在风险，是否现在去修改密码？', (function () {
      		this.modalPwd = true
        }).bind(this)) 
      }
      this.saveProCategory()
      this.renderStoreInfo()
      this.getCustomerInfo()
      this.getMarketTitle()
      var user = local.get('sessionUser')
      if(user) {
        this._userInfo(user.userId)
      } 
    },
    computed: {
      currentModel() {
        return this.$route.meta.father
      },
      currentPage() {
        return this.$route.meta.name
      },
      currentPageThr(){
      	if(!this.$route.meta.thrName){
      		this.isThrName=false;
      	}else{
      		this.isThrName=true;
      	}
      	return this.$route.meta.thrName
      },
    	showBackTop() {
    		return this.scrollTop > 0 ? true : false
    	}

    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      back2Top() {
        $('html, body').animate({scrollTop: 0}, 500);
      },
      toggNav() {	
      	this.nxhImg?this.nxhImg=false:this.nxhImg=true
        this.navOpens = []
        this.isCollapse = !this.isCollapse
      },
      router(name) {        
        if(name === 'datavpeisong') {
          window.open(DATAV_PSZX)
        }else if(name === 'datavtuancai') {
          window.open(DATAV_TCDW)
        }else if(name === 'datavqiye') {
          window.open(DATAV_QY)
        }else if(name === 'datavcangchu') {
          window.open(DATAV_CANGCHU)
        }else {
          this.$router.push({name: name})
        }
      },
      logout() {  
        this._comfirm('退出登录？')
        .then((function() {
          local.remove('userinfo')
          local.remove('token')
          local.remove('navlist')
          local.remove('sessionUser')
          local.remove('extend')
          this.$router.push({name: 'login'})
        }).bind(this))
        .catch(this._confirmCancle);
      },
      handleCommand(cmd) {
        if(cmd === 'a') {
          this.modalPwd = true
        }else if(cmd === 'b') {
          $ajax.call(this, {url: configs.api + '/user/dictionaries/list', param: {type: 'login_conf'}})
          .then((function(d) {
            if(d.state === 0) {
              this.errorCount = d.aaData[1].value
              this.errorCountID = d.aaData[1].id
              this.errorMin = d.aaData[0].value
              this.errorMinID = d.aaData[0].id
              this.modalErrorCount = true
            }
          }).bind(this))          
        }
      },
      handleClosePwd(done) {
        this.modelFormPwd = {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        }
        done()
      },
      cancelPwd() {
        this.modalPwd = false
        this.modelFormPwd = {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        }
      },
      submitPwd() {
        this.$refs['modelFormPwd'].validate((valid) => {
          if (valid) {
            $ajax.call(this, {url: configs.userAPI + 'user/updateMyPassword', param: {
              oldPassword: $.trim(this.modelFormPwd.oldPwd),
              newPassword: $.trim(this.modelFormPwd.newPwd)
            }}).then((function(d) {
              if(d.state === 0) {
                this.$message({ type: 'success', message: '修改成功，请重新登录' });
                local.remove('user')
                this.$router.push({name: 'login'})
              }
            }).bind(this))
          }
        })
      },
      handleCloseErrorCount(done) {
        this.cancelErrorCount()
        done()
      },
      cancelErrorCount() {
        this.modalErrorCount = false
        $ajax.call(this, {url: configs.api + '/user/dictionaries/list', param: {type: 'login_conf'}})
        .then((function(d) {
          if(d.state === 0) {
            this.errorCount = d.aaData[1].value
            this.errorCountID = d.aaData[1].id
            this.errorMin = d.aaData[0].value
            this.errorMinID = d.aaData[0].id
          }
        }).bind(this))  
      },
      submitErrorCount() {
        $ajax.call(this, {url: configs.api + '/user/dictionaries/update', param: {
          id: this.errorCountID,
          value: this.errorCount,
          type: 'login_conf'
        }})
        .then((function(d) {
          return $ajax.call(this, {url: configs.api + '/user/dictionaries/update', param: {
            id: this.errorMinID,
            value: this.errorMin,
            type: 'login_conf'
          }})
        }).bind(this))
        .then((function(d) {
          this.$message({ type: 'success', message: '操作成功' });
          this.cancelErrorCount()
        }).bind(this))
      },
      getCustomerInfo() {
        var user = local.get('sessionUser'), sellerId = ''
        if(user) {
            sellerId = parseInt(user.typeCode);
            this._ajax({name: 'customer/list',param: {id: sellerId}})
                .then((function(d) {
                	this.custermerName=d.aaData[0];
                  var now = moment();
                  var day = moment(d.aaData[0].recordDate);
                  var days = day.fromNow()
                  if(days.length > 0) {
                    this.days = days.split(' ')[0]
                  }
                  this.$store.dispatch('customerAddress', d.aaData[0].address)
                }).bind(this))
        }
      },
      getMarketTitle() {
        this._ajax({ name: 'datadic/list', param: { dataType: 'MARKET_TITLE', enabled: 1 } })
            .then((function(d) {
              if(d.aaData.length > 0) {
                this.$store.dispatch('marketTitle', d.aaData[0].value)
              }
            }).bind(this))
      }
    },
    watch:{
      $route(to, from){
        if(to.name !== 'productOnlineModal') {
          var vm = this
          this.routerName = to.name
          $('.btn-waves').removeClass('active')
          $('.btn-waves').each(function(index, element) {
            var link = $(element).data('link')
            if(link === vm.routerName) {
              $(element).addClass('active')
            }
          })
          $('.router-link').removeClass('active')
          $('.router-link').each(function(index, element) {
            var link = $(element).data('link')
            if(link === vm.routerName) {
              $(element).addClass('active')
            }
          })
        }        
      }
    }
  }
</script>
