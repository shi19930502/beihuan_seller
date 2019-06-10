<template>
	<div class="page-report-reserve">
		<optionItems>
			<template slot="right">

				<!--
				<el-button-group>
					<elBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</elBtn>
				</el-button-group>	
				-->			
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false">
			<el-table-column prop="comment" label="报表名称">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.comment}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" fixed="right" width="280">
		    	<template slot-scope="scope">
		    		<el-button-group>		    			
		    			<elBtn type="success" v-if="scope.row.reserved == 0" @click="reserve(scope.row)">订阅</elBtn>
		    			<elBtn iconClass="el-icon-check" v-if="scope.row.reserved == 1">已订阅</elBtn>
		    			<elBtn type="primary" v-if="scope.row.reserved == 1" @click="modalEdit(scope.row)">编辑</elBtn>
		    			<elBtn type="warning" v-if="scope.row.reserved == 1" @click="disReserve(scope.row)">取消订阅</elBtn>
		    		</el-button-group>		    		
		      	</template>
		    </el-table-column>	
		</elemTable>
		<reportReserveModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams" @submit="modalSubmit" :type="modalType"></reportReserveModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import configs from '../configs.js'
	import reportReserveModal from './modals/reportReserveModal.vue'
	function forNavList(navlist, name, flag) {
	    navlist.forEach(function(el) {	    	
	        if(el.caption == name) {
	        	console.log(el.caption + ' === ' + name)
	            flag = true
	            return;
	        }else {
	            if(el.hasChildren === 1) {
	                forNavList(el.children, name, flag)
	            }
	        }
	    })
	}
	export default {
		mixins: [mixin],
		components: {reportReserveModal},
		data() {
			return {
				typeCode: null,
				userId: null,
				searchForm: {
					dataType: 'REPORT_MODULE', enabled: 1, typeId: ''
				},
				reportReserveList: [],
				moduleList: []
			}
		},
		mounted() {
			var sessionUser = local.get('sessionUser'), typeId = ''
			console.log(sessionUser)
			if(sessionUser) {
				typeId = sessionUser.typeId
				this.typeCode = sessionUser.typeCode
				this.userId = sessionUser.userId
			}
			if(typeId === 'market') {
				typeId = 'admin'
			}
			if(typeId === 'merchant_buyer') {
				typeId = 'merchant'
			}
			Object.assign(this.searchForm, {
				extendVal: typeId,
			})

			this.searchTable()
		},
		methods: {
			searchTable() {
				this._ajax({ url: configs.permissionAPI + 'tsysRoleUser/list', param: {
					userId: this.userId
				}})
				.then((function(d) {
					var roleUserList = d.aaData
					var roleId = []
					roleUserList.forEach(function(el) {
						roleId.push(el.roleId)
					})
					return this._ajax({ url: configs.permissionAPI + 'tsysRoleModlePermission/listByRole', param: {
							sysId: configs.sysID,
							roleId: roleId
						}, arr: true})
				}).bind(this))
				.then((function(d) {
					this.moduleList = d.aaData
					return this._ajax({ name: 'datadic/list', param: this.searchForm, loading: 'dataLoading' })
				}).bind(this))
				.then((function(d) {
					var arr = []
			   	   this.moduleList.forEach((function(el) {
			   	       var moduleId = el.moduleId
			   	       d.aaData.forEach((function(em) {
			   	       	if(moduleId == em.key) {
			   	       		arr.push(em)
			   	       	}
			   	       }).bind(this))
			   	   }).bind(this))
			   	   this.reportReserveList = arr
			       return this._ajax({ name: 'reportReserve/list', param: {customerId: this.typeCode} })
			   }).bind(this))
			   .then((function(d) {
			       var list = d.aaData
			       var l1 = this.reportReserveList.length
			       var l2 = list.length
			       for(var i = 0; i < l1; i++) {
			       	   var caption = this.reportReserveList[i].value, flag
			       	   Object.assign(this.reportReserveList[i], {
		           	   		reserved: 0
		           	   	})
			           for(var j = 0; j < l2; j++) {
			           	   var value = list[j].moduleValue
			           	   if(caption === value) {
			           	   	Object.assign(this.reportReserveList[i], {
			           	   		reserved: 1
			           	   	})
			           	   }
			           }
			       }
			       this.dataList = this.reportReserveList
			   }).bind(this))
			},
			reserve(row) {
				Object.assign(this.modalParams, row)
				this.modalAdd()
			},
			disReserve(row) {
				this._ajax({ name: 'reportReserve/list', param: {
	                customerId: this.typeCode,
	                moduleId: row.key
	            }})
	            .then((function(d) {
	            	if(d.aaData.length > 0) {
	            		var data = d.aaData[0]
		                this._ajax({ name: 'reportReserve/delete', param: {
			                id: data.id
			            }})
			            .then((function(d) {
			            	if(d.state == 0) {
			            		this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                });
			            	}
			            	this.searchTable()
			            }).bind(this))
	            	}	                
	            }).bind(this))
			}
		}
	}
</script>