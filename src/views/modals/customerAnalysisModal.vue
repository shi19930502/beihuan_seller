
<template>
	<div class="customerAnaly">
		<el-tabs v-model="activeName">
				<span class="shizhi_Box2">
					<el-button type="primary" @click="Fanhui()">返回</el-button>
				</span>
				<p class="Jiange">基本信息</p>
		        <div class="dateBoxsh">
					<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
						<el-row>
						    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="采购商名称">
									<inputItem :disabled='formDisabled' :value.sync='form.name'></inputItem>	
						    	</el-form-item>
						    </el-col>
						     <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="地址">
									<inputItem :disabled='formDisabled' :value.sync='form.address'></inputItem>	
						    	</el-form-item>
						    </el-col>
						</el-row>
						<el-row>
						    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="注册时间">
									<inputItem :disabled='formDisabled' :value.sync="form.regDate"></inputItem>	
						    	</el-form-item>
						    </el-col>
						    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="最后采购时间">
									<inputItem :disabled='formDisabled' :value.sync="form.lastOrderDate"></inputItem>	
						    	</el-form-item>
						    </el-col>
						</el-row>
						<el-row>
							<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="下单天数">
									<inputItem :disabled='formDisabled' :value.sync="form.orderDays + '天'" v-if="form.orderDays != null"></inputItem>	
						    	</el-form-item>
						    </el-col>
						    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="电话">
									<inputItem :disabled='formDisabled' :value.sync="form.telephone"></inputItem>	
						    	</el-form-item>
						    </el-col>
						</el-row>
						<el-row>
							<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						    	<el-form-item label="总金额">
									<inputItem :disabled='formDisabled' :value.sync="form.totalAmount +'元'"></inputItem>	
						    	</el-form-item>
						   </el-col>
						</el-row>
						<el-row>
							<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.orderStatusId === '7' || form.orderStatusId === '6'">
						    	<el-form-item label="取消原因">
									<inputItem type='textarea' :disabled='formDisabled' :value.sync='form.cancelReason'></inputItem>	
						    	</el-form-item>
						   </el-col>
						</el-row>
					</el-form>
				 </div>
			    <p class="Jiange">下单走势图</p>
				<div class="dateBoxsh">
					<searchInputItems>
						<searchInputItem name="日期范围">
							<dateEditorDaterange :dateValue.sync="dateValue" @change="searchTable" :dateRange='dateRange'></dateEditorDaterange>
						</searchInputItem>
				    </searchInputItems>
					<!-- 走势图 -->
					<div>
						<div id="orderTrend" ></div>
					</div>
				</div>
			    <p class="Jiange">客户喜好</p>
				<!--列表-->
				<div class="dateBoxsh">
					<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
						<el-table-column prop="f_name" label="商品名称">
							<template slot-scope="scope">
								<toolTip :content="scope.row.f_name">
									<span>{{scope.row.f_name}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="f_charging_model_name" label="计量方式">
							<template slot-scope="scope">
								<toolTip :content="scope.row.f_charging_model_name">
									<span>{{scope.row.f_charging_model_name}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="sortMeasure" label="单位">
							<template slot-scope="scope">
								<toolTip :content="scope.row.sortMeasure">
									<span>{{scope.row.sortMeasure}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="f_sorting_weight" label="数量">
							<template slot-scope="scope">
								<toolTip :content="scope.row.f_sorting_weight">
									<span>{{scope.row.f_sorting_weight}}&nbsp;{{scope.row.sortMeasure}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="f_sorting_total" label="销售金额">
							<template slot-scope="scope">
								<toolTip :content="scope.row.f_sorting_total">
									<span>{{scope.row.f_sorting_total}}&nbsp;元</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="orderCount" label="下单数量">
							<template slot-scope="scope">
								<toolTip :content="scope.row.orderCount">
									<span>{{scope.row.orderCount}}&nbsp;单</span>
								</toolTip>
							</template>
						</el-table-column>
					</elemTable>
				</div>
		</el-tabs>
	</div>
</template>
<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js' //公共方法，包括主要的ajax
	import { mapState } from 'vuex'
	var orderTrend = null;
	export default {
		mixins: [mixin],
		data(){
			return{
				form:{
					f_buyer_id:'',
					f_address:'', //地址
					f_trade_area_name:'',
					totalAmount: '', //总金额
					f_name: '',// 采购商名称
					f_tel: '', //电话
					regDate:'',//注册时间
					f_id: '',
					lastOrderDate:'',//最后采购时间
					f_buyer_name:'',
					sortMeasure:''
				},
				dataList:[],
				dataListMapDate:[],
				formDisabled:true,
				dateValue: [],
				pageTotal:0,
				loginName:'',
				chartLegend: {
	                type: 'scroll',
	                orient: 'horizontal',
	                left:  'auto',
	                right: '20%',
	                top: 25,
	                bottom: 20,
	            },
			}
		},
		computed: {
			...mapState([
				'today',
				'beforeDay_7',
				'beforeDay_30',
			])
		},
		mounted(){	
			this.einformation();
			this.$nextTick(()=>{
				orderTrend = echarts.init(document.getElementById('orderTrend'));
			})
			this.dateValue = [this.beforeDay_7, this.today] //默认时间
			this.searchTable();
		},
		methods:{
			Fanhui(){
				this.$router.push({ path: '/customerAnalysis'});
			},
			einformation() {
				let _this = this;
				let user = local.get('sessionUser');
				return this._ajax({
					url: this.tootAPI,
					name: 'customer/queryCustomerAnalysisInfo',
					param: {
						buyerId: this.$route.query.buyerid,
						sellerId: user.typeCode,
					},
					loading: 'dataLoading'
				}).then((function(d) {
					if(d.aaData.length>0){
						let data = d.aaData[0];
						_this.form = data;
					}
				}).bind(this.renderTable));
	
			},
			searchTable(){
				var param = Object.assign({}, this.searchTable, {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						startDate: this.dateValue[0],
						endDate: this.dateValue[1]
					})
				//以下是获取表格数据
				let user = local.get('sessionUser');
				this._ajax({
						url: this.rootAPI,
						name: 'customer/queryCustomerAnalysisMap',
						param: {
							buyerId:this.$route.query.buyerid,
							sellerId:user.typeCode,
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							f_date: this.f_date,
							startDate: this.dateValue[0],
						    endDate: this.dateValue[1],
						}
				}).then((function(d) {
					let data = d.aaData.productDate.aaData;
					this.dataList = data;
					this.pageTotal=this.dataList.length;
				}).bind(this))
					
				//统计图数据获取
				this._ajax({
					url: this.rootAPI,
					name: 'customer/queryCustomerAnalysisMap',
					param: {
						buyerId:this.$route.query.buyerid,
						sellerId:user.typeCode,
						startDate: this.dateValue[0],
						endDate: this.dateValue[1]
				}}).then((d) => {
				var legenddata = ['订单金额', '订单数量'], seriesdata = [], data = d.aaData.mapDate, orderCount=[], orderDayTotal = [], f_date = [], xAxisData = [],
					yAxis = []
				if(data.length > 0) {
					data.forEach(function(el) {
						orderDayTotal.push(el.orderDayTotal)
						orderCount.push(el.orderCount)
						xAxisData.push(el.f_date)
					})
					var o = {
						name: '交易金额',
						data: orderDayTotal,
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
					if(orderCount.length >= orderDayTotal.length) {
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
				orderTrend.setOption(this._setLine({legend: legenddata, seriesData: seriesdata, xAxisData: xAxisData,title: '订单金额/订单总数走势图', titleX: 'center', titleTextStyle: {
					color: '#455A64',fontSize: 19,fontWeight:'normal'
					}, yAxis: yAxis}));
			})
			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
		},
	}
</script>
<style lang="sass">
	.customerAnaly{
		#orderTrend {
			height: 480px;width: 100%;background: #fff;padding-top: 8px;
		}
		.Jiange{
			width:120px;
			height:40px;
			background-color:#01AAED; 
			/*background: linear-gradient(to right,#67BE30 10%,#01AAED 40%);*/
			margin-top:20px;
			line-height:40px;
			color: #FFFFFF;
			padding-left:10px;
			/*border-radius:5px;*/
			font-size:16px;
		}
		.dateBoxsh{
			border-bottom:1px solid #CCCCCC;
			border-top:1px solid #f7f7f7;
			padding-top: 20px;
		}
		.shizhi_Box2{
			float: right;
			margin-right: 10px;
		}
	}
</style>