<template>
	<div class="page-commodiyQuotation">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="报价单状态" class="searchbox1">
				<selectInput :clearable='selectClearable' :value.sync="searchForm.enabled" @selectChange="search">
					<el-option
				      v-for="item in dataDic.orderStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="报价单名称" class="searchbox1">
				<inputItem :value.sync="searchForm.quotationTitle" @enter="search"></inputItem>
			</searchInputItem>
			<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="add" type="success">新增</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		</searchInputItems>
		<!-- 操作按钮 -->
		<!--引入-->
		<quotationModal
			:modal='modalShow'
			v-if='modalShow'
			:modalTitle='modalTitle'
			:messageRow='messageRow'
			:lookup='islookup'
			@close='modalClose'
		></quotationModal>
		<!--列表-->
		<div class="liebao_xingQ" v-for="item in dataList">
			<!--name-->
			<div class="biaoti_Name">
				<p>{{item.quotationTitle}}</p>
				<span class="shanchuCSS">
					<el-button type="Info" icon="el-icon-delete" @click="delRow(item)" circle v-if="item.enabled ==0"></el-button>
				</span>
			</div>
			
			<div class="xiangqing_Xinxi">
				<p>起配金额:{{item.startAmount}}</p>
				<p>报价单描述:{{item.quotationRemark}}</p>
				<p>报价单状态:
					<toolTip :content="item.enabled==1?'激活':'未激活'">
						<el-tag type="success" v-if="item.enabled ==1">已激活</el-tag>
						<el-tag type="danger" v-if="item.enabled ==0">未激活</el-tag>
					</toolTip>
				</p>
				
				<div class="beizhuCSS">
					<span>备注:</span>
					<div>{{item.comment}}</div>
				</div>
			</div>
			
			<div class="shuzhi_XiangQ">
				<span class="shizhi_Box1">
					<p>{{item.productNumber}}</p>
					<span>客户数量</span>
				</span>
				<span class="shizhi_Box1">
					<p>{{item.customerNumber}}</p>
					<span>在售商品</span>
				</span>
				<span class="shizhi_Box2">
					<el-button type="primary" @click="LookDetails(item)">详情</el-button>
				</span>
			</div>
		</div>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import quotationModal from './modals/quotationModal.vue'
	export default {
		mixins: [mixin],
		components: {quotationModal},
		data() {
			return {
				searchForm: {
		            quotationTitle:'',
					enabled:''
				},
				dataDic: {
					tradingAreaList: [],
					orderStateList:[]
				},
				dataList:[],
				channelList: [],
				tempO: {},//临时存放订单对象
				xs_orderglModal:false,
				orderId:'',
				paymentStatusId:null,
				orderStatusId:null,
				tableRow:{},
				selectClearable:true,
			}
		},
		mounted() {
			this.init().then(this.search);
		},
		methods: {
			init(){
				var param = {
					dataType: 'BAO_JIADAN',
					orderField:'fKey'
				};
				return this._ajax({
						url: this.rootAPI + 'datadic/list',
						param: param,
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							orderStateList: data
						})
					}).bind(this))
			},
			searchTable(param) {
				let user = local.get('sessionUser');
				this.searchForm.customerId = parseInt((user.typeCode));
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				//获取商品信息
				this._ajax({
					url: this.rootAPI,
					name: 'quotation/listWithCount',
					param:{
						productNumber:this.productNumber,
						customerNumber:this.customerNumber,
					},
					loading: 'dataLoading'
				}).then((function(d) {
					let data = d.aaData;
					this.dataList=data;
				}).bind(this));
			},
			search(){
				this._ajax({
					url:this.tootAPI,
					name:'quotation/listWithCount',
					param:this.searchForm
				}).then((d)=>{
					this.dataList=d.aaData
				})
			},
			reset() {
				Object.assign(this.searchForm, {
					quotationTitle: '',
					enabled:'',
				})
				this.handleCurrentChange(1)
			},	
			add(){
				/*this.modalShow=true;
				this.modalTitle='新增'*/
				this.$router.push({ path: '/quotationModal',query:{add:1}});
			},
			LookDetails(row) {
				this.tableRow = row;
				this.tradingAreaModal = true;
				this.$router.push({ path: '/quotationModal',query:{id:row.id}});
			},
			modalClose(){
				this.modalShow=false;
				this.messageRow={};
				this.search();
			},
			edit(o) {
				this.modalShow=true;
				this.modalTitle='编辑短信'
				this.messageRow=o
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {
					var o = {
						id: row.id,
					}
					this._ajax({
							url: this.rootAPI + 'quotation/delete',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '删除成功'
								});
							} else {
								this.$message({
									type: 'warning',
									message: '当前报价单还有关联的客户,请重新设置后再删除！'
								});
							}
							this.handleCurrentChange(1);
						}).bind(this))
				}).bind(this))
			},
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			},
			cellClick(){
				
			},
			xs_orderglModalClose(){
				console.log(this.dataList)
				this.xs_orderglModal=false;
			},
			lookOver(row){
				this.tableRow=row
				this.xs_orderglModal=true;
			},
			selectionChange(val){
//				console.log(val)
			},
		}
	}
</script>
<style lang="sass">
	.page-commodiyQuotation{
        .searchbox1{
        	margin-top:10px;
        }	
		.xinxibaoG{
			width:375px;
			height:600px;
			border:1px solid #0000FF;
		}
		.liebao_xingQ{
			float: left;
			margin: 20px;
			background-color:#FFFFFF;
			width: 362px ;
			height: 482px;
			border: 1px solid #DDDFE2;
			.biaoti_Name{
				height:50px;
				border-bottom: 1px solid #F7F6F6;
				p{
					width: 280px;
					height:50px;
					font-size:22px;
					margin-left: 10px;
					margin-top: 12px;
					overflow: hidden;
					white-space:nowrap; 
					text-overflow:ellipsis; 
					-o-text-overflow:ellipsis; 
				}
				.shanchuCSS{
					float: right;
					margin-right: 10px;
					margin-top: -52px;
				}
			}
			.xiangqing_Xinxi{
				width: 362px;
				height:310px;
				padding: 10px;
				border-bottom: 1px solid #F7F6F6;
				p{
					width: 330px;
					line-height:30px;
					font-size: 14px;
					margin-top:10px; 
					overflow: hidden;
					white-space:nowrap; 
					text-overflow:ellipsis; 
					-o-text-overflow:ellipsis; 
				}
				.beizhuCSS{
					margin-top:20px;
					line-height:22px;
					div{
						text-indent: 20px;
						width:330px;
						margin: 0 auto;
						white-space: normal;
    					word-break: break-all;
					}
				}
			}
			.shuzhi_XiangQ{
					width: 362px;
					height: 77px;
					padding: 10px;
					line-height:77px;
			   .shizhi_Box1{
						width: 130px;
						float: left;
						line-height: 32px;
					p{
						font-size:18px;
						font-family: "微软雅黑";
					}
					span{
						font-size:14px;
						font-family: "微软雅黑";
					}
					
				}
			   .shizhi_Box2{
					float: right;
					margin-right: 10px;
				}
				
			}
		
		}
	}
</style>