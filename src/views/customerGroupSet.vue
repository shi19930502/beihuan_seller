<template>
	<div class="page-khNolice">
		<!--<div class="toubu_B">
			<span class="tliel_name">客户列表</span>
			<span class="addanniu">
			</span>
		</div>-->
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="客户名称">
						<inputItem :value.sync="searchForm.name"></inputItem>
					</searchInputItem>
					<searchInputItem name="客户手机号">
						<inputItem :value.sync="searchForm.telephone"></inputItem>
					</searchInputItem>
					<searchInputItem name="商圈">
						<selectInput :clearable='true' :value.sync="searchForm.traCode" @selectChange="searchTable">
							<el-option v-for="item in dataDic.tradingAreaList" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</selectInput>
					</searchInputItem>
				</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-plus" content="新增采购商" @click="createBuyer" type="primary">新增采购商</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="批量设置/修改商圈" @click="lookOver" type="success">批量设置/修改商圈</iconBtn>
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
			</span>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="100" label="序号">
			</el-table-column>
			<el-table-column prop="customerIndex" label="客户编码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.customerIndex">
						<div>{{scope.row.customerIndex}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="客户名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<div>{{scope.row.name}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="quotationTitle" label="所属报价单">
				<template slot-scope="scope">
					<toolTip :content="scope.row.quotationTitle">
						<div>{{scope.row.quotationTitle}}</div>
					</toolTip>
				</template>
			</el-table-column> -->
			<el-table-column prop="teltphone" label="电话号码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.teltphone">
						<span>{{scope.row.teltphone}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<!--<el-table-column prop="marketName" label="所属市场">
				<template slot-scope="scope">
					<toolTip :content="scope.row.marketName">
						<span>{{scope.row.marketName}}</span>
					</toolTip>
				</template>
			</el-table-column>-->
			<el-table-column prop="code" label="商圈编码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.code">
						<span>{{scope.row.code}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="traName" label="所属商圈">
				<template slot-scope="scope">
					<selectInput :clearable='true' :value.sync="scope.row.code" @selectChange="changTra(scope.row)">
						<el-option v-for="item in dataDic.tradingAreaList" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</selectInput>
				</template>
			</el-table-column>
		</elemTable>
		<customerGroupSetModal :modal='customerGroupSetModal' @add='modalAdd' :dataDic="dataDic" v-if='customerGroupSetModal' @close='customerGroupSetModalClose' :ids='ids'></customerGroupSetModal>
		<buyerModal :modal='buyerModal' @add='modalAdd' :dataDic="dataDic" v-if='buyerModal' @close='buyerModalClose' ></buyerModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import customerGroupSetModal from './modals/customerGroupSetModal.vue'
	import buyerModal from './modals/buyerModal.vue'
	export default {
		mixins: [mixin],
		components: {
			customerGroupSetModal,
			buyerModal
		},
		data() {
			return {
				searchForm: {
					name: '',
					telephone: '',
					traCode: '',
					typeCode: '',
					//customerId: ''
				},
				dataDic: {
					tradingAreaList: []
				},
				dataList: [],
				modalShow: false,
				islookup: false,
				customerId:'',
				ids:[],
				customerGroupSetModal: false,
				buyerModal : false,
			}
		},
		mounted() {
			let user = local.get('sessionUser');
			this.customerId = parseInt(user.typeCode);
			this.getInitData();
			this.searchTable();
		},
		methods: {
			modalAdd(o) {
				this._ajax({
					url: this.rootAPI + "customergroupmapping/setTradingArea",
					param: o,
					arr: true
				}).then((function(d) {
					if(d.state == 0) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
					} else if(d.state == 1){
						this.$message({
							type: 'warning',
							message: d.msg
						});
					} else {
						this.$message({
							type: 'failure',
							message: '操作失败'
						});
					}
					this.$emit('submit')
				}).bind(this)).then(this.searchTable)
			},
			renderDic(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.key == dicKey) {
						dicShow = obj.value;
					}
				});
				return dicShow;
			},
			changTra(row){
				this.ids = [];
				this.ids.push(row.id);
				var o = {
					traCode: row.code,
					typeCode: this.customerId,
					ids: this.ids,
				}
				this.modalAdd(o);
			},
			getInitData() {
				let user = local.get('sessionUser');
				this.searchForm.typeCode = parseInt((user.typeCode));
				//初始化商圈列表
				this._ajax({
						url: this.rootAPI + 'tradingarea/tradingAreaList',
						param: {
							customerId: this.searchForm.typeCode
						},
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						Object.assign(this.dataDic, {
							tradingAreaList: data
						})
					}).bind(this));
			},
			
			searchTable() {
				let user = local.get('sessionUser');
				this.typeCode = user.typeCode;
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					typeCode: this.typeCode ||''
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'customer/customerGroupSetList',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					name: '',
					telephone: '',
					traCode: '',
					typeCode: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			customerGroupSetModalClose() {
				this.customerGroupSetModal = false;
			},
			lookOver() {
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.rowSelection
	        		var arr = []
					selection.forEach(function(el) {
						arr.push(el.id)
					})	
	            this.ids = arr;
				this.customerGroupSetModal = true;     		
	        	}
			},
			createBuyer() {
				this.buyerModal = true;
			},
			buyerModalClose() {
				this.searchTable();
				this.buyerModal = false;
			},
		}
	}
</script>
<style lang="sass">
	.page-khNolice {
		.toubu_B {
			height: 45px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left;
				font-size: 22px;
			}
			.addanniu {
				float: right;
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