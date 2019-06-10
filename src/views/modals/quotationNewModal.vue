<template>
	<div class="jibenxinxi">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!--基本信息-->
			<el-tab-pane label="基础信息" name="first" class="jichuXinXi">
				<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="报价名称" prop="quotationTitle">
								<inputItem :autosize="true" :value.sync="form.quotationTitle" :maxlength="30" class="baojiadanB"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="起配金额" prop="startAmount">
								<inputItem :autosize="true" :value.sync="form.startAmount" :maxlength="10" class="baojiadanB"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="报价单描述" prop="quotationRemark">
								<inputItem :autosize="true" type="textarea" :value.sync="form.quotationRemark" :maxlength="150" class="baojiadanB"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="是否激活" prop="checked"  >
								<el-checkbox :autosize="true" v-model="checked" @change="changeCheckBox" :disabled="jingzhixiugai" class="baojiadanB"></el-checkbox>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="备注" prop="comment">
								<inputItem :autosize="true" type="textarea" :value.sync="form.comment" :maxlength="150" class="baojiadanB"></inputItem>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div class="submitB">
					<elBtn @click="Submit" type="primary">保存</elBtn>
				</div>
			</el-tab-pane>

			<el-tab-pane label="添加客户" name="second" :disabled="tabDisabled">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>客户列表</span>
						<div class="pepoerFREASHcss">
							<searchInputItems>
								<searchInputItem>
									<inputItem :value.sync="customerName" placeHolder="请输入客户名称查询"></inputItem>
								</searchInputItem>
								<optionItems style="padding: 0;">
									<template slot="right">
										<el-button-group>
											<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetSearchCustomer">重置</iconBtn>
										</el-button-group>
										<el-button-group>
											<iconBtn iconClass="el-icon-search" content="查询" @click="refreashJoinInCustomer()" type="primary">查询</iconBtn>
										</el-button-group>
									</template>
								</optionItems>
							</searchInputItems>
						</div>
					</div>
					<optionItems>
						<template slot="left">
							<el-button-group>
								<iconBtn iconClass="el-icon-plus" content="新增" @click="showCustomerDialog"></iconBtn>
								<iconBtn type="primary" plain content="一键添加未绑定报价单客户" @click="addCustomerIntoQuotation">一键添加未绑定报价单客户</iconBtn>
							</el-button-group>
						</template>
					</optionItems>
					<elemTable :dataList="customerTableData" :currentPage='customerPageNum' :pageSize="customerPageSize" :pageTotal="customerPageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="customerListPage" @selectionChange="refreashJoinInCustomer">
						<el-table-column prop="customerName" label="客户姓名">
							<template slot-scope="scope">
								<toolTip :content="scope.row.customerName">
									<span>{{scope.row.customerName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button-group>
									<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="changeCustomer(scope.row, 0)">删除</iconBtn>
								</el-button-group>
							</template>
						</el-table-column>
					</elemTable>

					<!--<el-table :data="customerTableData" style="width: 100%">
			            <el-table-column prop="customerName" label="姓名">
			            </el-table-column>
			            <el-table-column label="操作" width="100">
			              <template slot-scope="scope">
			                <iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="changeCustomer(scope.row, 0)">删除</iconBtn>
			              </template>
			            </el-table-column>
			        </el-table>-->
					<!--用户列表-->
					<el-dialog custom-class="jz-modal" title="用户列表" :visible="customerModal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
						<searchInputItems>
							<searchInputItem name="关键字">
								<inputItem :value.sync="keyWord" placeHolder="请输入姓名"></inputItem>
							</searchInputItem>
							<!-- 操作按钮 -->
							<optionItems style="padding: 0;">
								<template slot="right">
									<el-button-group>
										<iconBtn iconClass="el-icon-search" content="查询" @click="refreashCustomerDialog" type="primary">查询</iconBtn>
										<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetCustomerDialog">重置</iconBtn>
									</el-button-group>
								</template>
							</optionItems>
						</searchInputItems>

						<elemTable :dataList="dataList" :currentPage='userPageNum' :pageSize="userePageSize" :pageTotal="userPageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="userListPage" @selectionChange="customerSelectionChange">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="customerName" label="姓名">
								<template slot-scope="scope">
									<toolTip :content="scope.row.customerName">
										<span>{{scope.row.customerName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button-group>
										<iconBtn type="primary" content="加入" @click="changeCustomer(scope.row, 1)">加入</iconBtn>
									</el-button-group>
								</template>
							</el-table-column>
						</elemTable>
						<div class="submitB">
							<elBtn @click="batchAddCustomer" type="primary">批量添加</elBtn>
						</div>
					</el-dialog>
				</el-card>
			</el-tab-pane>

			<!--商品-->
			<el-tab-pane label="添加商品" name="third" :disabled="tabDisabled" class="clearfixB">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>商品列表</span>
						<div class="shppingFREASHcss">
							<searchInputItems>
								<searchInputItem>
									<inputItem :value.sync="productName" placeHolder="请输入商品名称查询"></inputItem>
								</searchInputItem>
								<searchInputItem>
									<inputItem :value.sync="skuName" placeHolder="请输入规格名称查询"></inputItem>
								</searchInputItem>
								<optionItems style="padding: 0;">
									<template slot="right">
										<el-button-group>
											<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetSearchProduct()">重置</iconBtn>
										</el-button-group>
										<el-button-group>
											<iconBtn iconClass="el-icon-search" content="查询" @click="refreashJoinInProduct()" type="primary">查询</iconBtn>
										</el-button-group>
									</template>
								</optionItems>
							</searchInputItems>
						</div>
					</div>
					<optionItems>
						<template slot="left">
							<el-button-group>
								<iconBtn iconClass="el-icon-plus" content="新增" @click="showProductDialog"></iconBtn>
							</el-button-group>
						</template>
					</optionItems>
					<elemTable :dataList="productTableData" :currentPage='proPageNum' :pageSize="proPageSize" :pageTotal="proPageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="productListPage" @selectionChange="refreashJoinInProduct">
						<el-table-column prop="productName" label="商品名称">
							<template slot-scope="scope">
								<toolTip :content="scope.row.productName">
									<span>{{scope.row.productName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="skuName" label="规格名称">
							<template slot-scope="scope">
								<toolTip :content="scope.row.skuName">
									<span>{{scope.row.skuName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="100">
							<template slot-scope="scope">
								<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="changeProduct(scope.row)">删除</iconBtn>
							</template>
						</el-table-column>
					</elemTable>
					<!--商品列表-->
					<el-dialog custom-class="jz-modal" title="商品列表" :visible="productModal" :before-close="productBeforeClose" :close-on-click-modal="false" :width="modalWidth">
						<searchInputItems>
							<searchInputItem name="关键字">
								<inputItem :value.sync="keyWord" placeHolder="请输入商品名称/规格名称"></inputItem>
							</searchInputItem>
							<!-- 操作按钮 -->
							<optionItems style="padding: 0;">
								<template slot="right">
									<el-button-group>
										<iconBtn iconClass="el-icon-search" content="查询" @click="refreashProductDialog" type="primary">查询</iconBtn>
										<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetProductDialog">重置</iconBtn>
									</el-button-group>
								</template>
							</optionItems>
						</searchInputItems>

						<elemTable :dataList="productDataList" :currentPage='productPageNum' :pageSize="productPageSize" :pageTotal="productPageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="productMoreListPage"  @selectionChange="productSelectionChange">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="productName" label="商品名称">
								<template slot-scope="scope">
									<toolTip :content="scope.row.productName">
										<span>{{scope.row.productName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column prop="skuName" label="规格名称">
								<template slot-scope="scope">
									<toolTip :content="scope.row.skuName">
										<span>{{scope.row.skuName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column prop="meaName" label="基本计量单位">
								<template slot-scope="scope">
									<toolTip :content="scope.row.meaName">
										<span>{{scope.row.meaName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column prop="skuMeaName" label="规格计量单位">
								<template slot-scope="scope">
									<toolTip :content="scope.row.skuMeaName">
										<span>{{scope.row.skuMeaName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column prop="basePrice" label="基本单价">
								<template slot-scope="scope">
									<toolTip :content="scope.row.basePrice">
										<span>{{scope.row.basePrice}}&nbsp;元/{{scope.row.meaName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column prop="price" label="规格单价">
								<template slot-scope="scope">
									<toolTip :content="scope.row.price">
										<span>{{scope.row.price}}&nbsp;元/{{scope.row.skuMeaName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button-group>
										<iconBtn type="primary" content="加入" @click="changeProduct(scope.row, 1)" v-if="scope.row.isAppend == null || scope.row.isAppend == 2">加入</iconBtn>
									</el-button-group>
								</template>
							</el-table-column>
						</elemTable>
						<div class="submitB">
							<elBtn @click="batchAddProduct" type="primary">批量添加</elBtn>
						</div>
					</el-dialog>
				</el-card>

			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	var quotationIdTemp = '';
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		//components: {},
		data() {
			//			重复验证
			return {
				dialogVisible: false,
				dateRange: [],
				cusDatabox: [],
				keyWord: '',
				form: {
					id: '',
					quotationTitle: '',
					startAmount: '',
					quotationRemark: '',
					comment: '',
					enabled: 1,
					customerName: '',
					customerId: '',
				},
				rules: {
					//报价基础信息
					startAmount: [{
						required: true,
						message: '请正确填写金额，最多保留小数点后两位',
						trigger: 'blur'
					}, this._ruleTwoFloat(10)],
					quotationTitle: [{
						required: true,
						message: '报价名称必填'
					}, this._ruleLength(30)],
				},
				dataList: [],
				productDataList: [],
				products: [],
				activeName: 'first',
				tabDisabled: true,
				multipleSelectionCustomer: [],
				multipleSelectionProduct: [], //
				checked: false,
				pageTotal: 0,
				quotationList: [],
				customerModal: false,
				productModal: false,
				customerTableData: [],
				productTableData: [],
				customerTableIds: [],
				productTableIds: [],
				measuremethodList: [],
				jingzhixiugai:false,
				customerName: '',
				productName: '',
				skuName: '',
				customerIdAndNameList: [],
				productPageNum:1,
				productPageSize:10,
				productPageTotal:0,
				customerPageNum:1,
				customerPageSize:10,
				customerPageTotal:0,
				userPageNum:1,
				userPageSize:10,
				userPageTotal:0,
				proPageNum:1,
				proPageSize:10,
				proPageTotal:0
			}
		},
		mounted() {
			this.searchTable();
			if(this.$route.query.id) {
				this._ajax({
					url: this.rootAPI,
					name: 'promotion/list',
					param: {
						quotationId: this.$route.query.id,
						promotionStatus:1
					}
				}).then((function(d) {
					var vM=this;
					if(d.aaData != "" ){
						vM.jingzhixiugai=true;
					}
				}).bind(this));
			}
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
			//是否启用
			changeCheckBox(value) {
				if(value) {
					this.form.enabled = 1;
				} else {
					this.form.enabled = 0;
				}
			},
			//触发接数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			searchTable() {
				if(this.activeName == 'first') {
					//获取基础信息
					this._ajax({
						url: this.rootAPI,
						name: 'quotation/queryQutationAndDetail',
						param: {
							id: this.$route.query.id,
							customerId: local.get('userinfo').typeCode
						}
					}).then((function(d) {
						if(d.aaData.length) {
							this.tabDisabled = false;
						};
						Object.assign(this.form, d.aaData[0]);
						this.checked = this.form.enabled == 1;
					}).bind(this));
				}
				//已添加客户
				if(this.activeName == 'second') {
					this.refreashJoinInCustomer();
				}
				//商品添加
				if(this.activeName == 'third') {
					this.refreashJoinInProduct();
				}

				//已添加商品		        
				if(this.activeName == 'three') {
					//刷新列表
					let param = {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						mainId: this.$route.query.id,
					}
					return this._ajax({
						url: this.rootAPI,
						name: "quotationdetail/list",
						param: param,
						loading: 'dataLoading'
					}).then((function(d) {
						let data = d.aaData;
						this.dataList = data;
						this.pageTotal = d.dataCount
					}).bind(this));
				}
			},
			Submit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let o = {},
							method = "quotation/create";
						let user = local.get('userinfo')
						let customerId = user.typeCode
						if(this.form.id) {
							method = "quotation/update";
						}
						o = {
							id: this.form.id,
							buyersName: this.form.buyerNames,
							buyersId: this.form.buyerIds,
							quotationTitle: this.form.quotationTitle,
							startAmount: this.form.startAmount,
							quotationRemark: this.form.quotationRemark,
							comment: this.form.comment,
							enabled: this.form.enabled,
						}
						this._ajax({
								url: this.rootAPI + method,
								param: o
							})
							.then((function(d) {
								if(d.state == 0) {
									if(!this.form.id) {
										this.form.id = d.aaData.id;
									}
									this.$message({
										type: 'success',
										message: '操作成功'
									});
									this.tabDisabled = false;
								} else {
									this.$message({
										type: 'failure',
										message: '操作失败'
									});
								}
								this.$emit('submit')
							}).bind(this))
					}
				})
			},
			//商品列表获取
			selectionChange(val) {

			},
			//通过activeName名字取定位页面
			handleClick(tab, event) {
				let key = tab.name;
				if(key === 'second') {
					this.refreashJoinInCustomer();
				}
				if(key === 'third') {
					this.refreashJoinInProduct();
				}
			},
			//删除
			delRow(row) {
				this.confirm('确定删除？', (function() {
					var o = {
						id: [row.id]
					}
					//      			o.enabled = 1
					this._ajax({
							url: this.rootAPI + 'quotationdetail/delete',
							param: o,
							arr: true
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '删除成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
			},
			cancel() {
				this.$emit('close')
			},
			/*关闭商户弹出框*/
			beforeClose() {
				this.customerModal = false;
			},
			productBeforeClose() {
				this.productPageNum = 1
				this.productPageSize = 10
				this.productModal = false;
			},
			changeCustomer(row, type) {
				let customerTableIds = this.customerTableIds;
				if(type == '1') {
					var index = customerTableIds.indexOf(row.customerId);
					if(index < 0) {
						//添加用户数据
						this.submitCustomer(row);
					} else {
						this.$message({
							type: 'failure',
							message: '该用户已加入列表'
						});
					}
				} else {
					//删除ids
					//删除数据
					this.confirm('确定删除？', (function() {
						let id = row.id;
						this.deleteCustomer(id)
						let customerId = row.customerId
						var index = customerTableIds.indexOf(customerId);
						customerTableIds.splice(index, 1);
						//删除表格数据
						let tableData = this.customerTableData;
						let indexTemp;
						$.each(tableData, function(i, obj) {
							if(obj.customerId == customerId) {
								indexTemp = i;
							}
						});
						tableData.splice(indexTemp, 1);
						this.customerTableData = tableData;
					}).bind(this))
				}
				this.customerTableIds = customerTableIds;
			},
			changeProduct(row, type) {
				let productTableIds = this.productTableIds;
				if(type == '1') {
					var index = productTableIds.indexOf(row.skuId);
					if(index < 0) {
						this.submitProduct(row);
					} else {
						this.$message({
							type: 'failure',
							message: '该商品规格已加入列表'
						});
					}
				} else {
					//删除ids
					this.confirm('确定删除？', (function() {
						let id = row.id;
						this.deleteProduct(id)
						let skuId = row.skuId
						var index = productTableIds.indexOf(skuId);
						productTableIds.splice(index, 1);
						//删除表格数据
						let tableData = this.productTableData;
						let indexTemp;
						$.each(tableData, function(i, obj) {
							if(obj.skuId == skuId) {
								indexTemp = i;
							}
						});
						tableData.splice(indexTemp, 1);
						this.productTableData = tableData;
					}).bind(this))
				}
				this.productModal = false;
				this.productTableIds = productTableIds;
			},
			/*商户弹出框*/
			showCustomerDialog() {
				this.pageNum = 1
				this.customerModal = true;
				this.refreashCustomerDialog();
			},
			/*商品弹出框*/
			showProductDialog() {
				this.pageNum = 1
				this.productModal = true;
				this.refreashProductDialog();
			},
			/*刷新已加入商户*/
			refreashJoinInCustomer() {
//				this.customerTableIds = [];
				if(this.form.id) {
					let param = {
						mainId: this.form.id,
						customerId: 0,
						pageNum: this.customerPageNum,
						pageSize: this.customerPageSize,
						customerName: this.customerName,
					}
					this._ajax({
							url: this.rootAPI,
							name: "quotationcustomermapping/list",
							param: param
						})
						.then((function(d) {
							let customerTableIds = this.customerTableIds;
							this.customerTableData = d.aaData;
							this.customerPageTotal = d.dataCount
							if(this.customerTableData.length > 0) {
								let data = this.customerTableData
								$.each(data, function(i, obj) {
									customerTableIds.push(obj.customerId);
								});
							}
							this.customerTableIds = customerTableIds;
						}).bind(this))
				}
			},
			/*刷新已加入商品*/
			refreashJoinInProduct() {
				this.productTableIds = [];
				if(this.form.id) {
					let param = {
						mainId: this.form.id,
						pageNum: this.proPageNum,
						pageSize: this.proPageSize,
						productName: this.productName,
						skuName: this.skuName
					}
					this._ajax({
							url: this.rootAPI,
							name: "quotationdetail/listDto",
							param: param
						})
						.then((function(d) {
							let data = d.aaData;
							let productTableDataTemp = [];
							if(data.length > 0) {
								let productTableIds = this.productTableIds;
								$.each(data, function(i, obj) {
									this.tabDisabled = false;
									productTableIds.push(obj.skuId);
									productTableDataTemp.push(obj);
								});
								this.productTableIds = productTableIds;
							}
							this.productTableData = productTableDataTemp;
							this.proPageTotal = d.dataCount;
						}).bind(this))
				}
			},
			resetSearchProduct() {
				this.productName = '';
				this.skuName = '';
				this.refreashJoinInProduct()
			},
			resetSearchCustomer() {
				this.customerName = '';
				this.refreashJoinInCustomer()
			},
			/*刷新弹出框商户列表*/
			refreashCustomerDialog() {
				//刷新列表
				let param = {
					pageNum: this.userPageNum,
					pageSize: this.userPageSize,
					sellerId: local.get('userinfo').typeCode,
					customerName: this.keyWord,
					joininCustomerIdsString: this.customerTableIds.join(",")
				}
				//查询报价单数据
				return this._ajax({
						url: this.rootAPI,
						name: "suppliercollection/queryQuoCusBySellerId",
						param: param,
						loading: 'dataLoading'
					})
					.then((d) => {
						let data = d.aaData
						this.dataList = data
						this.userPageTotal = d.dataCount
						
					})
			},
			/*xianzeListPage(val) {
				this.userPageNum = val
				this.refreashCustomerDialog()
			},*/
			/**用户列表分页*/
			userListPage(val) {
				this.userPageNum = val
				this.refreashCustomerDialog()
			},
			customerListPage(val) {
				this.customerPageNum = val
				this.refreashJoinInCustomer()
			},
			productListPage(val) {
				this.proPageNum = val
				this.refreashJoinInProduct()
			},
			productMoreListPage(val) {
				this.productPageNum = val
				this.refreashProductDialog()
			},
			/*刷新商品弹出框列表*/
			refreashProductDialog() {
				let user = local.get('userinfo');
				//刷新列表
				var param = {
					id:this.form.id,
					pageNum: this.productPageNum,
					pageSize: this.productPageSize,
					customerId: user.typeCode,
					keyWord: this.keyWord,
					joininSkuIdsString: this.productTableIds.join(",")
				}
				//查询报价单数据
				return this._ajax({
						url: this.rootAPI,
						name: "product/queryProductAndProductSkuList",
						param: param,
						loading: 'dataLoading'
					})
					.then((function(d) {
						let data = d.aaData;
						this.productDataList = data;
						this.productPageTotal = d.dataCount
					}).bind(this));
			},
			batchAddCustomer() {
				let selectionCustomer = this.multipleSelectionCustomer;
				let vm = this;
				$.each(selectionCustomer, function(i, obj) {
					vm.changeCustomer(obj, '1');
				});
				this.customerModal = false;
			},
			customerSelectionChange(val) {
				this.multipleSelectionCustomer = val;
			},
			submitCustomer(obj) {
				if(!this.form.id) {
					this.$message({
						type: 'failure',
						message: '请核实数据，报价单异常'
					});
					return;
				}
				let customer = {
					mainId: this.form.id,
					customerId: obj.customerId,
					customerName: obj.customerName
				}
				let vm = this
				this._ajax({
						url: this.rootAPI,
						name: "quotationcustomermapping/create",
						param: customer
					})
					.then(function(d) {
						let data = d.aaData;
						if(d.state == 0) {
							vm.customerTableData.push({
								id: data.id,
								customerId: obj.customerId,
								customerName: obj.customerName
							})
							vm.customerTableIds.push(obj.customerId);
							vm.refreashCustomerDialog();
						}
					}).then(this.refreashJoinInCustomer)
			},
			deleteCustomer(id) {
				let ids = [];
				ids.push(id);
				this._ajax({
					url: this.rootAPI,
					name: "quotationcustomermapping/delete",
					param: {
						'id': ids
					},
					arr: true
				}).then(this.refreashJoinInCustomer)
			},
			submitProduct(obj) {
				if(!this.form.id) {
					this.$message({
						type: 'failure',
						message: '请核实数据，报价单异常'
					});
					return;
				}
				let product = {
					mainId: this.form.id,
					productId: obj.productId,
					productName: obj.productName,
					skuId: obj.skuId,
					skuName: obj.skuName
				}
				let vm = this
				this._ajax({
					url: this.rootAPI,
					name: "quotationdetail/create",
					param: product
				}).then(function(d) {
					if(d.state == '0') {
						let data = d.aaData;
						vm.productTableData.push({
							id: data.id,
							productId: obj.productId,
							productName: obj.productName,
							skuId: obj.skuId,
							skuName: obj.skuName,
							skuMeaName: obj.skuMeaName,
							basePrice: obj.basePrice,
							skuMeasure: obj.skuMeasure,
							price: obj.price,
							basePrice: obj.basePrice,
							meaName: obj.meaName,
							meaCode: obj.meaCode
						})
						vm.productTableIds.push(obj.skuId);
						vm.refreashProductDialog();
					}
				}).then(this.refreashJoinInProduct)
			},
			deleteProduct(id) {
				let ids = [];
				ids.push(id);
				this._ajax({
					url: this.rootAPI,
					name: "quotationdetail/delete",
					param: {
						'id': ids
					},
					arr: true
				}).then(this.refreashJoinInProduct)
			},
			batchAddProduct() {
				let data = this.multipleSelectionProduct;
				let vm = this;
				$.each(data, function(i, obj) {
					vm.changeProduct(obj, '1');
					if(i == data.length -1) {
						vm.productBeforeClose();
					}
				});
				//vm.productModal = false;
				//this.productBeforeClose()
			},
			productSelectionChange(val) {
				this.multipleSelectionProduct = val;
			},
			resetCustomerDialog() {
				this.keyWord = '';
				this.userPageNum=1
				this.refreashCustomerDialog();
			},
			resetProductDialog() {
				this.keyWord = '';
				this.productPageNum=1
				this.refreashProductDialog();
			},
			addCustomerIntoQuotation() {
				this.confirm('确定一键添加未绑定报价单客户？', (function() {
					this._ajax({
							url: this.rootAPI + 'quotation/addAnyCustomerIntoQuotation',
							param: {
								id:this.$route.query.id
							},
							arr: true
						})
						.then((function(d) {
							if(d.state == 0){
									this.$message({
									type: 'success',
									message: '一键添加成功!'
								});
							}
							this.refreashJoinInCustomer();
						}).bind(this))
				}).bind(this))
			}
		}
	}
</script>

<style lang="sass">
	.jibenxinxi {
		padding: 20px;
		.jichuXinXi {
			margin: 0 auto;
			text-align: center;
			.baojiadanB {
				width: 600px;
				text-align: left;
			}
		}
		.submitB {
			text-align: center;
		}
		.clearfix span{
			float: left;
		}
		.clearfixB {
			text-align: left;
		}
		.pepoerFREASHcss {
			width: 600px;
			position: absolute;
			top: 15px;
			left: 20%;
		}
		.shppingFREASHcss {
			width: 700px;
			position: absolute;
			top: 15px;
			left: 80px;
			.option-box .name {
				width: 20px;
			}
		}
	}
</style>