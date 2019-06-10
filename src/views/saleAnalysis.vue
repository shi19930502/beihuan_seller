<template>
	<div class="sale_analysis">
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
		            <searchInputItem name="日期范围">
		                <dateEditorDaterange :dateValue.sync="dateValue"  :dateRange='dateRange'></dateEditorDaterange>
		            </searchInputItem>
       			 </searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success">导出</iconBtn>
			</span>
		</div>

		<div class="header_four">
			<div class="header_four_item">
				<div>销售额</div>
				<p>{{everOrderSum.allSortTotal }}&nbsp;<span>元</span></p>
			</div>
			<div class="header_four_item">
				<div>毛利</div>
				<p>{{everOrderSum.groseProfit}}&nbsp;<span>元</span></p>
			</div>
			<div class="header_four_item">
				<div>毛利率</div>
				<p>{{everOrderSum.ratio}}&nbsp;<span>%</span></p>
			</div>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="orderDate" label="日期">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderDate">
						<span>{{scope.row.orderDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderCount" label="订单数量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderCount">
						<span>{{scope.row.orderCount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sortTotal" label="销售额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortTotal">
						<span>{{scope.row.sortTotal}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="groseProfit" label="毛利">
				<template slot-scope="scope">
					<toolTip :content="scope.row.groseProfit">
						<span>{{scope.row.groseProfit}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="ratio" label="毛利率">
				<template slot-scope="scope">
					<toolTip :content="scope.row.ratio">
						<span>{{scope.row.ratio}}%</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>

<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import { mapState } from 'vuex'
	export default {
		mixins: [mixin],
		data() {
			return {
				dataList: [],
				dateValue: [],
				everOrderSum: {},
				isChannel: '',
				searchForm: {
					channelCode: ''
				},
				channelList: [],
				channelCode: '',
				loginName: ''
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
			this._ajax({
					name: 'channel/list',
					param: {
						level: 3
					}
				})
				.then((function(d) {
					Object.assign(this.channelList, d.aaData)
				}).bind(this))
			//默认时间
			this.dateValue = [this.beforeDay_7, this.today]
			this.searchTable()
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.sellerId = user.typeCode
				this._ajax({
					url: this.rootAPI,
					name: 'order/getSaleSum',
					param: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						orderCount: this.orderCount,
						sortTotal: this.sortTotal,
						groseProfit: this.groseProfit,
						sellerId: this.sellerId,
						ratio: this.ratio,
						startTime: this.dateValue[0],
						endTime: this.dateValue[1],
						orderBy: 'DESC'
					}
				}).then(this.renderTable);
				this.getThreeData()
			},
			reset(){
				this.dateValue = [this.getBeforeDay_7, this.getToday];
				this.searchTable();
			},
			exportExcel() {
				var fields = ['orderDate', 'orderCount', 'sortTotal', 'groseProfit','ratio'],
					filedsName = ['日期', "订单数量", "销售额", "毛利",'毛利率'],
					fileName = '销售统计表';
					
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.sellerId = user.typeCode
				this._ajax({
					url: this.rootAPI,
					name: 'order/getSaleSum',
					param: {
						orderCount: this.orderCount,
						sortTotal: this.sortTotal,
						groseProfit: this.groseProfit,
						sellerId: this.sellerId,
						ratio: this.ratio,
						startTime: this.dateValue[0],
						endTime: this.dateValue[1],
						orderBy: 'DESC'
					}
				}).then((data)=>{
					let exportData = data.aaData;
					exportData.forEach(function(e){
						e.ratio = e.ratio + '%';
					});
					this._exportExcel(exportData, fields, filedsName, fileName)
				})
			},
			//获取3个对应的数据
			getThreeData() {
				this._ajax({
					url: this.rootAPI,
					name: 'order/getEverySaleSum',
					param: {
						sellerId: this.sellerId,
						startTime: this.dateValue[0],
						endTime: this.dateValue[1]
					}
				}).then((d) => {
					this.everOrderSum = d.aaData[0]
				})
			}
		}
	}
</script>

<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
	
	.sale_analysis {
		.header_four {
			display: flex;
			.header_four_item {
				/*flex-grow: 1;*/
				width: 30%;
				text-align: center;
				padding: 20px 5px;
				box-sizing: border-box;
				margin: 0 5px 20px 20px;
				background: #83c1ac;
				color: white;
				border-radius: 10px;
				div {
					font-size: 16px;
				}
				p {
					font-size: 28px;
					span {
						font-size: 14px;
					}
				}
			}
			.header_four_item:nth-of-type(2) {
				background: #82bf95;
			}
			.header_four_item:nth-of-type(3) {
				background: #83b9c3;
			}
			
		}
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>