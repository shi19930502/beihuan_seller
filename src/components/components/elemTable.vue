<template>
	<div class="elem-table" :id="id">
		<el-table :data="dataList" 
		v-loading="loading"
		ref='multipleTable'
	    element-loading-text="数据加载中"
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(255, 255, 255, 0.8)"
	    :row-class-name="tableRowClassName"
	    :highlight-current-row="highlightCurrentRow"
	    :max-height="maxHeight"
	    :border="border"
	    @current-change="selectChange"
		@row-dblclick='rowDBlclick' @cell-click='cellClick' @selection-change="handleSelectionChange">
		    <slot></slot>
		</el-table>
		<div class="flex-x-end" v-if="showPagination">
	      <el-pagination
	        @size-change="handleSizeChange"
	        @current-change="handleCurrentChange"
	        :current-page="currentPage"
	        :page-sizes="pageSizes"
	        :page-size="pageSize"
	        layout="total, sizes, prev, pager, next, jumper"
	        :total="pageTotal">
	      </el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'elemTable',
		props: {
			id: {
				default: ''
			},
			currentPage: {
				default: 1,
			},
			pageSizes: {
				default: function() {
					return [10,20,30,40]
				}
			},
			pageSize: {
				default: 10
			},
			pageTotal: {
				default: 0
			},
			dataList: {
				default: function(){
					return []
				}
			},
			loading: {
				default: false
			},
			highlightCurrentRow: {
				default: false
			},
			showPagination: {
				default: true
			},
			maxHeight: {
				default: 99999999
			},
			id: {
				default: null
			},
			border: {
				default: true
			}
		},
		methods: {
			handleSizeChange(val) {
				this.$emit('sizeChange', val)
			},
			handleCurrentChange(val) {
				this.$emit('currentChange', val)
			},
			handleSelectionChange(val) {
				this.$emit('selectionChange', val)
			},
			rowDBlclick(row){
				this.$emit('rowDBlclick', row)
			},
			cellClick(row, column){
				this.$emit('cellClick', [row, column])
			},
			tableRowClassName({row, rowIndex}) {
				if (row.rowEditable) {		          
		          if(row.rowError) {
		          	return 'jz-table-row error-row';
		          }else {
		          	return 'jz-table-row editable-row';
		          }
		        }
		        return 'jz-table-row';
			},
			selectChange(val) {

				this.$emit('selectChange', val)
			}
		},
		beforeDestroy() {
			this.$emit('update:loading', false)
		}		
	}
</script>