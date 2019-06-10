<template>
	<div class="page-index-index">
		<!-- <div>
			<iframeItem	:src="iframeSrc"></iframeItem>
			<div>
				<button @click="iframe">000</button>			
			</div>				
		</div> -->
		<el-alert
		    title="查阅报表"
		    type="success" v-if="newReserve"
		    show-icon>
    		<div>
    			<span style="cursor: pointer;text-decoration: underline;margin-right: 15px;" v-for="item in reserveList" @click="_go(item.moduleValue)">{{item.moduleName}}</span>
    		</div>
	  	</el-alert>
		<el-row :gutter="20">
			<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <div class="flex-y-center head-item">
                	<img src="../../lib/img/indexImg/icon_ri@2x.png" height="66" width="66">
                	<div class="item-content">
                		<div class="item-title">昨日订单金额</div>
                		<div><span class="item-val">{{everOrderSum.yesterdayTotal || 0}}</span>&nbsp;元</div>
                	</div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <div class="flex-y-center head-item">
                	<img src="../../lib/img/indexImg/icon_zhou@2x.png" height="66" width="66">
                	<div class="item-content">
                		<div class="item-title">本周订单金额</div>
                		<div><span class="item-val">{{everOrderSum.weekTotal || 0}}</span>&nbsp;元</div>
                	</div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <div class="flex-y-center head-item">
                	<img src="../../lib/img/indexImg/icon_yue@2x.png" height="66" width="66">
                	<div class="item-content">
                		<div class="item-title">本月订单金额</div>
                		<div><span class="item-val">{{everOrderSum.monthTotal || 0}}</span>&nbsp;元</div>
                	</div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                <div class="flex-y-center head-item">
                	<img src="../../lib/img/indexImg/icon_ji@2x.png" height="66" width="66">
                	<div class="item-content">
                		<div class="item-title">总订单金额</div>
                		<div><span class="item-val">{{everOrderSum.allTotal || 0}}</span>&nbsp;元</div>
                	</div>
                </div>
            </el-col>
		</el-row>
		<el-row :gutter="20" style="margin-top: 20px;">
			<el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
				<div>
					<div class="jiaoyi">
						<div class="flex-y-center head-item">
		                	<img src="../../lib/img/indexImg/icon_jiaoi@2x.png" height="40" width="40">
		                	<div class="item-content">
		                		<div class="item-title item-title-jiaoyi">昨日交易客户量</div>
		                		<div></div>
		                	</div>
		                </div>
						<div class="flex-y-center flex-x-between jiaoyi-item">
							<span class="item-val-jiaoyi"><span style="font-weight: bolder;">{{yesterDayBuyerCount}}</span>&nbsp;人</span>
							<img src="../../lib/img/indexImg/biao_biao@2x.png" height="83" width="138">
						</div>
					</div>
					<div class="jiaoyi daofang">
						<div class="flex-y-center head-item">
		                	<img src="../../lib/img/indexImg/icon_kehu@2x.png" height="40" width="40">
		                	<div class="item-content">
		                		<div class="item-title item-title-jiaoyi">昨日自然到访客户</div>
		                		<div></div>
		                	</div>
		                </div>
						<div class="flex-y-center flex-x-between jiaoyi-item">
							<span class="item-val-jiaoyi"><span style="font-weight: bolder;">{{yesterDayLoginCount}}</span>&nbsp;人</span>
							<img src="../../lib/img/indexImg/biao_line@2x.png" height="66" width="242">
						</div>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
				<div class="dianpu">
					<div class="title">店铺信息</div>
					<div class="headPic">
						<img class="resp-img store-head customer-head" :src="($store.state.storePic == null || $store.state.storePic == '') ? './lib/img/indexImg/logo.png' : imgURL + $store.state.storePic">
					</div>
					<div class="store">
						<div class="store-name">{{$store.state.storeName}}</div>
						<div class="store-address">{{$store.state.customerAddress}}</div>
					</div>
					<div class="order flex-x-around">
						<div class="left item" @click="_go('productOnline')" v-if="_isMerchantUser()">
							<div class="val">{{productPublished}}</div>
							<div class="name">在售</div>
						</div>
						<div class="left" v-else>
							<div class="val">{{productPublished}}</div>
							<div class="name">在售</div>
						</div>
						<div class="middle item" @click="_go('merchant_orderManage', {tabActive: '2'})">
							<div class="val">{{orderStatusId2Count}}</div>
							<div class="name">待发货</div>
						</div>
						<div class="right item" @click="_go('merchant_orderManage', {tabActive: '0'})">
							<div class="val">{{orderStatusId0Count}}</div>
							<div class="name">待受理</div>
						</div>			
					</div>
				</div>				
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
				<div id="catePie"></div>
			</el-col>
		</el-row>
		<el-row style="margin-top: 20px;">
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<div id="orderLine"></div>
			</el-col>
		</el-row>
		
	</div>
</template>

<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import configs from '../configs.js'
	import { mapState } from 'vuex'
	var orderLine = null, catePie = null
	export default {
		mixins: [mixin],
		data() {
			return {
				iframeSrc: 'http://www.baidu.com',
				imgURL: configs.imgURL,
				dataList: [],
				pieLoading: false,
				dateValue: [],
				everOrderSum: {},
				isChannel: '',
				searchForm: {
					channelCode: ''
				},
				channelList:[],
				channelCode:'',
				loginName:'',
				yesterDayBuyerCount: 0,
				yesterDayLoginCount: 0,
				productPublished: 0,
				orderStatusId2Count: 0,
				orderStatusId0Count: 0,
				chartLegend: {
	                type: 'scroll',
	                orient: 'horizontal',
	                left:  'auto',
	                right: '50%',
	                top: 20,
	                bottom: 20,
	            },
	            reserveList: [],
	            newReserve: false
			}
		},
		computed: {
			...mapState([
				'today',
				'beforeDay_7',
				'beforeDay_30',
			])
		},
		mounted() {
			orderLine = echarts.init(document.getElementById('orderLine'));
			catePie = echarts.init(document.getElementById('catePie'));			
			this._ajax({name: 'store/queryTodayLogins'}).then((d) => {
				if(d.state == 0) {
					this.yesterDayLoginCount = d.aaData	
				}else {
					this.yesterDayLoginCount = 0
				}						
			})
			let user = local.get('sessionUser');
			var sellerId = user.typeCode || ''
			this._ajax({name: 'product/queryList', param: {published: 1, customerId: sellerId}}).then((d) => {
				this.productPublished = d.dataCount
			})
			this._ajax({name: 'order/listByUser', param: {orderStatusId: '2'}}).then((d) => {
				this.orderStatusId2Count = d.dataCount
			})
			this._ajax({name: 'order/listByUser', param: {orderStatusId: '0'}}).then((d) => {
				this.orderStatusId0Count = d.dataCount
			})			
			this._ajax({name: 'order/getEveryOrderSum', param: {
				sellerId: sellerId,
			}}).then((d) => {
				if(d.aaData.length > 0) {
					this.everOrderSum = d.aaData[0]
				}				
			})
			this._ajax({name: 'order/countYesterDayOrderBuyer', param: {
				sellerId: sellerId,
			}}).then((d) => {
				if(d.aaData.length > 0) {
					this.yesterDayBuyerCount = d.aaData[0].buyerCount
				}				
			})
			this._ajax({name: 'order/getOrderSum', param: {
				sellerId: sellerId,
				startTime: moment().subtract(7, 'days').format("YYYY-MM-DD"),
				endTime: this._moment()
			}}).then((d) => {
				var legenddata = ['交易金额', '交易数量'], seriesdata = [], data = d.aaData, orderCount = [], orderTotal = [], xAxisData = [], 
					yAxis = []
				if(data.length > 0) {
					data.forEach(function(el) {
						orderCount.push(el.orderCount)
						orderTotal.push(el.orderTotal)
						xAxisData.push(el.orderDate)
					})
					var o = {
						name: '交易金额',
						data: orderTotal,
						areaStyle: {normal: {opacity: 0.5}},
					}
					var p = {
						name: '交易数量',
						data: orderCount,
						areaStyle: {normal: {opacity: 0.5}},
						yAxisIndex: 1
					}
					seriesdata.push(o)
					seriesdata.push(p)
					if(orderCount.length >= orderTotal.length) {
						yAxis = [
							{
								name: '交易金额',
					            type: 'value',
					            splitLine: false					            
							},
							{
								name: '交易数量',
					            type: 'value',					            				
					        }
						]
					}else {
						yAxis = [
							{
								name: '交易金额',
					            type: 'value',
							},
							{
								name: '交易数量',
					            type: 'value',
					            splitLine: false					            			
					        }
						]
					}
				}
				orderLine.setOption(this._setLine({legend: legenddata, seriesData: seriesdata, xAxisData: xAxisData, title: '一周交易量详情', titleX: 'left', titleTextStyle: {
					color: '#455A64',fontSize: 19,fontWeight:'normal'
				}, yAxis: yAxis}));
			})
			this._ajax({name: 'order/xiaofeiList', param: {
				sellerId: sellerId,
				startTime: moment().subtract(7, 'days').format("YYYY-MM-DD"),
				endTime: this._moment()
			}}).then((d) => {
				var legenddata = [], seriesdata = [], data = d.aaData
				if(data.length > 0) {
					data.forEach(function(el) {
						legenddata.push(el.cateName)
						var o = {
							value: el.orderTotal.div(100), name: el.cateName
						}
						seriesdata.push(o)
					})
				}
				catePie.setOption(this._setPie({legend: legenddata, seriesData: seriesdata, title: '七天畅销品种占比', titleX: 'left', titleTextStyle: {
					color: '#455A64',fontSize: 19,fontWeight:'normal'
				}, chartLegend: {
					type: 'scroll',
	                orient: 'horizontal',
	                bottom: 10,
				}, seriesRadius: ['30%', '45%'], seriesLabelLineLength: 1}));
			})
			this._ajax({ name: 'reportReserve/list', param: {
                customerId: sellerId,
            }})
            .then((function(d) {
                var reserveList = d.aaData
                var arr = []
                reserveList.forEach((function(el) {
                	var startDate = moment(el.startDate).toDate().getTime()
                	var now = moment(this._moment()).toDate().getTime()
                	if(startDate == now) {
                		arr.push(el)
                	}else {
                		var time = now - startDate
                		var div = time.div(24*60*60*1000)
                		if(div == el.reserveDays) {
                			arr.push(el)
                		}
                	}
                }).bind(this))
                if(arr.length > 0) {
                	this.newReserve = true
                	this.reserveList = arr
                }                
            }).bind(this))
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				if(this.loginName == 'admin' || this.channelCode == '' || this.channelCode == '001' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.searchForm.channelCode = this.channelCode;
					this.isChannel = true;
				}
				
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.dateValue[0],
					endTime: this.dateValue[1]
				})

				this._ajax({
					name: 'order/getOrderSum',
					param: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						orderTotal: this.orderTotal,
						orderCount:this.orderCount,
						startTime: this.dateValue[0],
						endTime: this.dateValue[1]
					}
				})
				.then(this.renderTable)
			},
			getFourData() {
				this._ajax({
						url: this.rootAPI,
						name: 'order/getEveryOrderSum',
						param: {}
					})
					.then((d) => {
						console.log(d)
						this.everOrderSum = d.aaData[0]
					})
			},
			// 渲染图表
			renderWeightPie(d) {
				var legendData = ["订单总数"],
					seriesPriceData = [],
					seriesManeyeData=[],
					xAxisData = [];
				
				d.aaData.forEach(function(el) {
					legendData.push(el.orderTotal);//订单金额
					seriesPriceData.push(el.orderTotal);//订单金额
					legendData.push(el.orderCount);//订单数量
					seriesManeyeData.push(el.orderCount);//订单数量
					xAxisData.push(el.orderDate)
				})
				// 图表设置
				this.setorderTrend(legendData,seriesPriceData,xAxisData)
				this.setorderTrends(legendData,seriesManeyeData,xAxisData)
				// 封装导出数据
				this.csvDataList = d.aaData
			},
			setorderTrend(legenddata, seriesdata, xAxisData) {
				orderTrend.setOption(this._setLine({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: [{
						name: '订单金额',
						data: seriesdata
					}],
					title: '订单金额/订单数走势图'
				}));
			},
			setorderTrends(legenddata, seriesdata, xAxisData) {
				orderTrend.setOption(this._setLine({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: [{
						name: '订单数',
						data: seriesdata
					}],
					title: '订单金额/订单数走势图'
				}));
			},
			iframe() {
				this.iframeSrc = 'http://www.qq.com'
			}
		},
	}
</script>

<style lang="sass">	
	.page-index-index{
		margin-top: -20px;background: #edf1f5;
		.dianpu {
			height: 458px;padding: 10px;padding-bottom: 0;
			background: #fff;
			.title{
				font-size: 19px;
				height: 30px;line-height: 30px;color: #67767D;
			}
			.headPic{
				height: 210px;line-height: 210px;
				text-align: center;
				.resp-img.store-head.customer-head{
					height: 160px;width: auto;max-width: 100%;
				}
			}
			.store {
				height: 80px;
				.store-name{
					font-size: 21px;
					text-align: center;
					white-space: nowrap;
    				text-overflow: ellipsis;
				}
				.store-name {
					color: #455A64;
				}
				.store-address {
					font-size: 15px;
					color: #99ABB4;
					text-align: center;
					white-space: nowrap;
    				text-overflow: ellipsis;
				}
			}
			.order{
				border-top: 1px solid #EDEFF0;padding: 10px;height: 138px;padding-top: 0;
				&>div{
					width:30%;padding-top: 40px;
					&.item:hover {
						background: #d1dbe5;
					}
					&.item{
						cursor: pointer;
					}
				}
				.left{					
					border-right: 1px solid #EDEFF0;
				}
				.right {
					border-left: 1px solid #EDEFF0;
				}
				.val, .name{
					text-align: center;
				}
				.val {
					font-size: 24px;
					color: #67767D;font-weight: bolder;
				}
				.name {
					font-size: 15px;
					color: #67757C;
				}
			}
		}
		.jiaoyi{
			background: #26C6DA;margin-bottom: 10px;height: 224px;
			.head-item {
				background: #26C6DA;height: 80px;
			}
			.item-val-jiaoyi{
				color: #fff;font-size: 16px;
			}
			.jiaoyi-item{
				padding: 10px;height: 80px;
			}
			&.daofang{
				background: #7460EE;
				.head-item {
					background: #7460EE;
				}
			}
		}
		.head-item {
			background: #fff;padding: 10px;
			padding-top: 15px;padding-bottom: 15px;
			.item-content{
				padding-left: 10px;color: #455A64;
				.item-title{
					font-size: 19px;
					&.item-title-jiaoyi{
						color: #fff;
					}
				}
				.item-val{
					font-weight: bolder;
					font-size: 15px;
				}
			}
		}
		#catePie {
			height: 458px;width: 100%;background: #fff;padding-top: 8px;
		}
		#orderLine {
			height: 480px;width: 100%;background: #fff;padding-top: 8px;
		}
	}
</style>