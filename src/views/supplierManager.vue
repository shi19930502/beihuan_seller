<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="供应商编号">
				<inputItem :value.sync="searchForm.code" placeHolder="请输入供应商编号"></inputItem>
			</searchInputItem>
			<searchInputItem name="供应商名称关键字">
				<inputItem :value.sync="searchForm.name" placeHolder="请输入供应商名称关键字"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="addSupplier" type="success">新增</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<!--<el-table-column prop="channelCode" label="序号">
		    	<template slot-scope="scope">
	    			<span v-if="!scope.row.rowEditable">{{scope.row.channelCode}}</span>
		      	</template>
		    </el-table-column>-->
		    <el-table-column prop="code" label="供应商编号">
		    	<template slot-scope="scope">
	    			<toolTip :content="scope.row.code">
		    			<span>{{scope.row.code}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="name" label="供应商名称">
		    	<template slot-scope="scope">
	    			<toolTip :content="scope.row.name">
		    			<span>{{scope.row.name}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="tel" label="联系电话">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.tel">
		    			<span>{{scope.row.tel}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="address" label="公司地址">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.address">
		    			<span>{{scope.row.address}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" width="230">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn content="停用" type="warning" @click="changeStatus(scope.row, 0)" v-if="scope.row.enabled == 1">停用</iconBtn>
	    				<iconBtn content="启用" type="success" @click="changeStatus(scope.row, 1)" v-if="scope.row.enabled == null || scope.row.enabled == 0">启用</iconBtn>
		    			<iconBtn content="编辑" class="el-icon-edit"  @click="modalEditOther(scope.row)" >编辑</iconBtn>
					    <iconBtn content="删除" class="el-icon-delete"  @click="delRow(scope.row)" >删除</iconBtn>
		    		</el-button-group>
		    	</template>
		    </el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import supplierModal from './modals/supplierModal.vue'
	export default {
		mixins: [mixin],
		components: {supplierModal},
		data() {
			return {
				dateRange:[],
				searchForm: {
					name : '',
					code : '',
//					enabled: 1
				},
				dataList: [],	
				rowOBJ: {},
				activeName: '1',
				tabList:[]
			}
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			initData() {
				
			},
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({name: 'supplier/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			modalEditOther(row) {
				this.$router.push({name : 'supplierModal', query : {id : row.id}});
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {     
        			var o = {
        				id: [row.id]
        			}
					this._ajax({url: this.rootAPI + 'supplier/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
			addSupplier() {
				this.$router.push({name : 'supplierModal'});
			},
			reset() {
				Object.assign(this.searchForm, {
					name : '',
					code : '',
				})
				this.handleCurrentChange(1)
			},
			changeStatus(o, type) {
				this.confirm('确定操作该数据？', (function() {
					o.enabled = type;
					this._ajax({url: this.rootAPI + 'supplier/update', param: o, loading: 'dataLoading'}).then((function(d) { 
	                	this.$message({ type: 'success', message: '操作成功' }); 
	                }).bind(this))
				}).bind(this))
			},
		}
	}
</script>