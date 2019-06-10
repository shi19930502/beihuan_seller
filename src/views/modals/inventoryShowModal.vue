<template>
	<el-dialog custom-class="jz-modal"  width="1500px" title="盘点详情" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<div class="page-supplier">
			<div slot="header" class="clearfix">
				<span>供应商信息</span>
			</div>
			<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
				<el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                <el-form-item label="盘点单号" prop="inventoryNumber">
		                    <inputItem :autosize="true" :value.sync="form.inventoryNumber" :disabled="true"></inputItem>
		                </el-form-item>
		            </el-col>
		            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                <el-form-item label="盘点日期" prop="inventoryDate">
		                    <div class="block">
								<el-date-picker v-model="form.inventoryDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
							</div>
		                </el-form-item>
		            </el-col>
		        </el-row>
		        <el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                <el-form-item label="备注" prop="comment">
		                    <inputItem type="textarea" :value.sync="form.comment"></inputItem>
		                </el-form-item>
		            </el-col>
		        </el-row>
		   </el-form>
		       商品明细
		    <!-- 表格 -->
			<el-table :data="productTableData" style="width: 100%">
				<el-table-column prop="productName" label="商品名称">
			  	</el-table-column>
			  	<el-table-column prop="skuName" label="规格">
			  	</el-table-column>
			  	<el-table-column prop="skuStockQuantity" label="账面数">
			  		<template slot-scope="scope">
						<toolTip :content="scope.row.stockQuantity/100">
							<span>{{scope.row.stockQuantity/100}}</span>
						</toolTip>
					</template>
			  	</el-table-column>
			  	<el-table-column prop="inventoryStock" label="实盘数">
			  		<template slot-scope="scope">
						<toolTip :content="scope.row.inventoryStock/100">
							<span>{{scope.row.inventoryStock/100}}</span>
						</toolTip>
					</template>
			  	</el-table-column>
			  	<el-table-column prop="" label="差异">
			  		<template slot-scope="scope">
						  <span>{{_calc((scope.row.inventoryStock == null ? 0 :scope.row.inventoryStock)/100,scope.row.stockQuantity/100,"subtract")}}</span>
						   <!-- <span>{{(((scope.row.inventoryStock == null ? 0 :scope.row.inventoryStock)-scope.row.stockQuantity)/100).toFixed(2)}}</span> -->
						  <!-- <span>{{((scope.row.inventoryStock == null ? 0 :scope.row.inventoryStock)*10000-scope.row.stockQuantity*100)/10000}}</span> -->
		  			</template>
			  	</el-table-column>
			</el-table>
			
	   </div>
	   <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消">取消</elBtn>
        </div>
   </el-dialog>
</template>

<script>
	var productTableIds = [];
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		props: {
			modal: {
				default: false,
			},
			tableRow: {
				default: function() {
					return {}
				},
			}
		},
		data() {
			return {
				keyWord:'',
				form: {
					id : '',
					inventoryDate : '',
					comment : '',
					inventoryNumber : '',
					inventoryStatus : ''
				},
				rules: {
                	inventoryDate: [{required: true, message: '盘点日期必填' }]
                },
				productModal: false,
				productTableData: [],
				measuremethodList: [],
				multipleSelectionProduct:[]
			}
		},
		mounted() {
			var params = this.tableRow;
			Object.assign(this.form, params);
			if(params.id)
				this.refreashJoinInProduct();
			productTableIds = [];
		},
		methods: {
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code) {
						dataShow = obj.name;
						return false;
					}
				});
				return dataShow;
			},
			/*刷新已加入商品*/
		    refreashJoinInProduct() {
		    	let param = {
					mainId : this.form.id,
	        	};
				this._ajax({url: this.rootAPI, name: "inventorydetail/list", param: param})
	            .then((function(d){
	            	this.productTableData = d.aaData;
	            	if(this.productTableData.length > 0) {
	            		let data = this.productTableData;
	            		$.each(data, function(i, obj) {
	            			productTableIds.push(obj.skuId);
	            		});
	            	}
	            }).bind(this))
		    },
            beforeClose(done) {
				this.cancel();
				done()
			},
			cancel() {
				this.$emit('close')
			}
		}
	}
	
</script>
