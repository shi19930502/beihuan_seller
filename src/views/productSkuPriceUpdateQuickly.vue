<template>
	<div>
	<el-tabs v-model="activeName" @tab-click="handleClick" class="marginClass">
		<el-tab-pane :key="item.key"
		    v-for="(item, index) in tabList"
		    :label="item.value"
		    :name="item.key">
			<searchInputItems>
				<searchInputItem name='商品关键字'>
					<inputItem :value.sync="searchForm.keyWord" placeHolder="请输入商品关键字"></inputItem>
				</searchInputItem>
			</searchInputItems>
			<optionItems>
				<template slot="right">
					<el-button-group>
						<iconBtn iconClass="el-icon-search" content="查询" type="primary" @click="searchTable">查询</iconBtn>
	                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					</el-button-group>
				</template>
			</optionItems>
			<!-- 表格 -->
			<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
			    <el-table-column prop="name" label="商品名称">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.name">
			    			<span>{{scope.row.name}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="productPicUrl" label="图片">
			    	<template slot-scope="scope">
		    			<toolTip :content="(scope.row.skuPicUrl == null || scope.row.skuPicUrl == '') ? '暂无图片' : scope.row.skuPicUrl ">
			    			<imgItem :path="scope.row.skuPicUrl"></imgItem>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <!--<el-table-column prop="vulgo" label="商品别名">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.vulgo">
			    			<span>{{scope.row.vulgo}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="code" label="编码">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.code">
			    			<span>{{scope.row.code}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>-->
			    <el-table-column prop="skuName" label="规格名称">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.skuName">
			    			<span>{{scope.row.skuName}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="stockQuantity" label="库存">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.stockLimit == 1 ? scope.row.stockQuantity/100 + '(' + scope.row.measureMethodName + ')' : '库存充足'">
			    			<span>{{scope.row.stockLimit == 1 ? scope.row.stockQuantity/100 + '(' + scope.row.measureMethodName + ')' : '库存充足'}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="skuPrice" label="售价（元）">
			    	<template slot-scope="scope">
		    			<inputItem :value.sync="scope.row.skuPrice" @change="skuPriceChange(scope.row)"></inputItem>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="skuMeasure" label="计量单位">
			    	<template slot-scope="scope">
			    		<toolTip :content="renderCommon(measuremethodList, scope.row.skuMeasure)">
			    			<span>{{renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="stockQuantity" label="单位换算">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.skuWeight + scope.row.measureMethodName + '=1' + scope.row.skuMeasureName">
			    			<span>{{(scope.row.skuWeight == 1 && scope.row.measureMethodName == scope.row.skuMeasureName) ? '商品与规格计量单位一致' : scope.row.skuWeight + scope.row.measureMethodName + '=1' + scope.row.skuMeasureName}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="270">
			    	<template slot-scope="scope">
			    		<el-button-group>
			    			<iconBtn iconClass="el-icon-edit" content="下架" @click="undercarriage(scope.row, 2)" v-if="scope.row.skuPublished == 1 || scope.row.skuPublished == null">下架</iconBtn>
			    			<iconBtn iconClass="el-icon-edit" content="上架" @click="undercarriage(scope.row, 1)" v-if="scope.row.skuPublished == 2">上架</iconBtn>
			    			<iconBtn iconClass="el-icon-view" content="查看进场信息" @click="lookOver(scope.row)" v-if="scope.row.isInmarket == 1"></iconBtn>
			    		</el-button-group>
			    	</template>
			    </el-table-column>
			</elemTable>
		</el-tab-pane>
	</el-tabs>
	<inMarketDetailModal :modal="modalShow" :inMarketDetailModalType="modalType" :extendModalType='extendType' v-if="modalShow" @submit="modalSubmit" @close='modalClose' :tableRow='tableRow'></inMarketDetailModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import inMarketDetailModal from './modals/inMarketDetailModal.vue'
	export default {
		mixins: [mixin],
		components: {
			inMarketDetailModal
		},
		data() {
			return {
				dateRange:[],
				searchForm: {
					keyWord : '',
					published: 1
				},
//				extendType: '',
				modalType: 'check',
				tableRow: {},
				extendType: "",
				dataList: [],	
				rowOBJ: {},
				activeName: '1',
				tabList:[],
				measuremethodList:[]
			}
		},
		mounted() {
			this._ajax({url: this.rootAPI, name: 'measuremethod/list', param: {}})
			.then((function(d) {
				this.measuremethodList = d.aaData;
            }).bind(this));
			this._searchDic('PRODUCT_STATUS')
			.then((function(d) {
				this.dicEnabled = this._dicKey(d);
				let temp = this.tabList;
				$.each(this.dicEnabled, function(i, obj) {
					temp.push({'key' : this.key + '', 'value' : this.value});
				});
				this.tabList = temp;
//				console.info(this.tabList);
			}).bind(this))
			.then(this.searchTable)
		},
		methods: {
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code) {
						dataShow = obj.name;
					}
				});
				return dataShow;
			},
			handleClick(tab, event) {
//		        console.log(tab, event);
		        let status = this.activeName;
		        if(status == '1') {
		        	Object.assign(this.searchForm, {
		        		published : 1
	        		})
		        } else {
		        	Object.assign(this.searchForm, {
		        		published : 2
	        		})
		        }
		        this.searchTable();
		    },
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				});
				return this._ajax({name: 'product/queryDtoList', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					keyWord : '',
				});
				this.handleCurrentChange(1)
			},
			undercarriage(obj, status) {
				let param = {
					id : obj.skuId,
					published : status,
					skuPicUrl : obj.skuPicUrl
				};
				this._ajax({url: this.rootAPI, name: "productsku/update", param: param})
				.then((function(d) {
					this.$message({type: 'success', message: '修改状态成功'});
					this.handleCurrentChange(1)
				}).bind(this))
			},
			inMarketDetailModalClose() {
				this.inMarketDetailModal = false;
			},
			lookOver(row) {
			    this._ajax({url: this.rootAPI + "inmarketmain/queBySkuId", param: {
			    	   skuId:row.skuID
               }}).then((function(d) {
		                this.tableRow = d.aaData;
		                this.tableRow.skuId=row.skuID;
               	        console.log(this.tableRow)
                }).bind(this))
                this.extendType='look'
				this.modalCheck();
			},
			skuPriceChange(row) {
				let reg = /^\d{1,4}(\.\d{1,2})?$/;
				if(!reg.test(row.skuPrice)) {
					let msg = "商品：" + row.name + ",规格：" + row.skuName + "数据的" + row.skuPrice + "价格不符合规定（价格必须是0-10000）";
					this.$message({ type: 'warning', message: msg}); 
            		return;
				}
				let param = {
					id : row.skuId,
					price : row.skuPrice,
					skuPicUrl : row.skuPicUrl
				};
//				console.info(param);
				this._ajax({url: this.rootAPI, name: "productsku/update", param: param})
				.then((function(d) {
					this.$message({type: 'success', message: '修改价格成功'});
//					this.handleCurrentChange(1)
					this.searchTable()
				}).bind(this))
			}
		}
	}
</script>
<style>
	.marginClass{
		margin: 0 20px;
	}
</style>