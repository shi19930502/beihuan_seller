<template>
	<div>
		<searchInputItems>
			<searchInputItem name="订单号">
				<inputItem :value.sync="searchForm.orderNumber" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="原始状态">
				<selectInput :clearable='true' :value.sync="searchForm.oriStatusId" @selectChange="searchTable">
					<el-option
				      v-for="item in orderStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="新状态">
				<selectInput :clearable='true' :value.sync="searchForm.curStatusId" @selectChange="searchTable">
					<el-option
				      v-for="item in orderStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
		    <el-table-column prop="orderNumber" label="订单号">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.orderNumber">
		    			<div>{{scope.row.orderNumber}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="changeIndex" label="变化序号">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.changeIndex">
		    			<div>{{scope.row.changeIndex}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="oriStatusName" label="原始状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.oriStatusName">
		    			<div>{{scope.row.oriStatusName}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="curStatusName" label="新状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.curStatusName">
		    			<div>{{scope.row.curStatusName}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="comment" label="备注">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.comment">
		    			<div>{{scope.row.comment}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="optionPersonName" label="操作人">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.optionPersonName">
		    			<div>{{scope.row.optionPersonName}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="optionDate" label="操作时间">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.optionDate">
		    			<div>{{scope.row.optionDate}}</div>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					orderNumber: '',
					oriStatusId: '',
					curStatusId: '',
					orderField: 'f_change_index'
				},
				orderStateList: []
			}
		},
		mounted() {
			this._searchDic('ORDER_STATUS')
			.then((function(d) {
				this.orderStateList = this._dicKey(d)
			}).bind(this))
			.then(this.searchTable)			
		},
		methods: {
			searchTable() {				
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				})
				return this._ajax({name: 'orderstatuschange/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					orderNumber: '',
					oriStatusId: '',
					curStatusId: '',
				})
				this.handleCurrentChange(1)
			}
		}
	}
</script>