<template>
	<div>
		<searchInputItems>
			<searchInputItem name="评价时间">
				<dateEditorDaterange :dateValue.sync='dateRange'>
				</dateeditordaterange>
			</searchInputItem>
			<searchInputItem name="评价人">
				<inputItem :value.sync="searchForm.reviewPersonName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="订单号">
				<inputItem :value.sync="searchForm.orderId" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="是否审核">
				<selectInput :value.sync="searchForm.isAuthed" @selectChange="searchTable">
					<el-option v-for="item in authedList" :key="item.key" :label="item.value" :value="item.key">
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
			<el-table-column prop="orderId" label="订单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderId">
						<span>{{scope.row.orderId}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reviewContent" label="评价内容">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reviewContent">
						<span>{{scope.row.reviewContent}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reviewPersonName" label="评价人">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reviewPersonName">
						<span>{{scope.row.reviewPersonName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reviewDate" label="评价时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reviewDate">
						<span>{{scope.row.reviewDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="isAuthedName" label="状态">
				<template slot-scope="scope">
					<toolTip :content="scope.row.isAuthedName">
						<span>{{scope.row.isAuthedName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="authPersonName" label="审核人">
				<template slot-scope="scope">
					<toolTip :content="scope.row.authPersonName">
						<span>{{scope.row.authPersonName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="authDate" label="审核时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.authDate">
						<span>{{scope.row.authDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn iconClass="el-icon-view" content="查看" @click="modalCheck(scope.row)"></iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<orderReviewModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams"></orderReviewModal>
	</div>
</template>
<script>
import mixin from '../mixin/mixin.js'
import orderReviewModal from './modals/orderReviewModal.vue'
	export default {
		mixins: [mixin],
		components: {orderReviewModal},
		data() {
			return {
				searchForm: {
					reviewPersonName: '',
					orderId: '',
					isAuthed: '',
				},
				dateRange: [],
				authedList: []
			}
		},
		mounted() {
			this._searchDic('IS_AUTHED')
			.then((function(d) {
				this.authedList = this._dicKey(d)
			}).bind(this))
			this.searchTable();
		},
		methods: {
			searchTable() {
				var dateRange = {
					startTime: '',
					endTime: ''
				}				
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				})
				return this._ajax({name: 'orderitemreview/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					reviewPersonName: '',
					orderId: '',
					isAuthed: '',
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
		}
	}
</script>