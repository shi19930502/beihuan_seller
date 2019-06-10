<template>
	<div class="page-supplierOperate">
		<el-row :gutter="10" class="baseCard">
			<el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
                <el-card class="box-card">
                	<div slot="header" class="clearfix">
					    <span>客户</span>
						<div style="float: right;">
					    	<inputItem :value.sync="customerSearchParam.customerName" :append="true" placeHolder="请输入客户名称">
						    	<elBtn @click="refreshCustomerList()" text="搜索" type="primary" slot="append">搜索</elBtn>
						    </inputItem>
					    </div>
					</div>
					<el-table :data="customerData" ref="customerDataTable" max-height="300" highlight-current-row @current-change="customerCurrentChange" style="width: 100%" >
						<el-table-column prop="customerName" label="商户名称" align="center">
					  	</el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
                <el-card class="box-card">
                	<div slot="header" class="clearfix">
					    <span>订单</span>
					    <div style="float: right;">
					    	<inputItem :value.sync="orderSearchParam.orderNum" :append="true" placeHolder="请输入订单号">
						    	<elBtn @click="refreshOrderList()" text="搜索" type="primary" slot="append">搜索</elBtn>
						    </inputItem>
					    </div>
					</div>
					<el-table :data="orderData" ref="orderDataTable" max-height="300" highlight-current-row @current-change="orderCurrentChange" style="width: 100%">
						<el-table-column prop="orderUmber" label="订单号" align="center">
					  	</el-table-column>
					  	<el-table-column prop="orderStatusId" label="状态" align="center">
					  		<template slot-scope="scope">
					    		<toolTip :content="_dicValue(scope.row.orderStatusId, orderStateList)">
					    			<span>{{_dicValue(scope.row.orderStatusId, orderStateList)}}</span>
					    		</toolTip>
					      	</template>
					  	</el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14" >
				<el-card class="box-card" >
                	<div slot="header" class="clearfix">
					    <span>在售商品</span>
					    <div style="float: right;">
					    	<inputItem :value.sync="searchProductForm.keyWord" :append="true" placeHolder="请输入商品关键字">
						    	<elBtn @click="searchProduct()" text="搜索" type="primary" slot="append">搜索</elBtn>
						    </inputItem>
					    </div>
					</div>
					<el-row :gutter="20" style="height: 290px;overflow: auto;">
						<el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" v-for="el in productSkuData" style="margin-bottom: 10px;">
							<div class="caption" align="center">
						    	<el-checkbox-group style="border: 1px solid darkblue;">
							        <el-radio v-model="radio" :label="el.id" @change="productListChange(el)"><br/>
							        	{{el.productName}}<br/>
							        	{{el.name}}<br/>
							        	<!--<img style="width:50px;height:50px" :src="((el.skuPicUrl == null || el.skuPicUrl == '') ? el.productPicUrl : el.skuPicUrl) == null ? '/src/components/picture/logo.png' : imgURL + ((el.skuPicUrl == null || el.skuPicUrl == '') ? el.productPicUrl : el.skuPicUrl)">-->
							        </el-radio>
						        </el-checkbox-group>
						    </div>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 10px;">
            <el-card class="box-card">
            	<div slot="header" class="clearfix">
				    <span>操作</span>
				</div>
				<div v-show="customerSelect">
					创建订单：{{selectCustomerValue}}
					<iconBtn type="primary" content="选择商品" @click="addOrderModal" >选择商品</iconBtn>
					<iconBtn type="primary" content="下单" @click="addOrder" >下单</iconBtn><!--productListByCustomer-->
					
					<elemTable :dataList="productListByCustomer" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
						<el-table-column prop="name" label="商品" align="center">
							<template slot-scope="scope">
								<toolTip :content="scope.row.productName">
									<span>{{scope.row.productName}}</span>
								</toolTip>
							</template>
					  	</el-table-column>
					  	<el-table-column prop="name" label="规格" align="center">
							<template slot-scope="scope">
								<toolTip :content="scope.row.name">
									<span>{{scope.row.name}}</span>
								</toolTip>
							</template>
					  	</el-table-column>
					  	<el-table-column prop="canUseQuantity" label="可用库存" align="center">
					  		<template slot-scope="scope">
					    		<span>{{scope.row.stockLimit == '0' ? '库存充足' : scope.row.canUseQuantity/100+scope.row.skuMeasureName}}</span>
					      	</template>
					  	</el-table-column>
					  	<!--<el-table-column prop="name" label="单位" align="center">
					  		<template slot-scope="scope">
								<toolTip :content="renderCommon(measuremethodList, scope.row.skuMeasure)">
									<span>{{renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
								</toolTip>
							</template>
					  	</el-table-column>-->
					  	<el-table-column prop="quantity" label="需求数量" align="center">
					  		<template slot-scope="scope">
					  			<div class="flex-y-center">
			                        <inputItem :autosize="true" :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)"></inputItem>
		                            <div style="width: 70px;">{{scope.row.skuMeasureName}}</div>
			                    </div>
					      	</template>
					  	</el-table-column>
					  	<el-table-column prop="price" label="单价" align="center">
					  		<template slot-scope="scope">
					    		<inputItem :autosize="true" :value.sync="scope.row.price"></inputItem>
					      	</template>
					  	</el-table-column>
					  	<el-table-column prop="itemTotal" label="金额" align="center">
					  		<template slot-scope="scope">
					    		<inputItem :autosize="true" :value.sync="scope.row.itemTotal"></inputItem>
					      	</template>
					  	</el-table-column>
					  	<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button-group>
									<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="changeProduct(scope.row, 0)" v-if="promotionState != 2"></iconBtn>
								</el-button-group>
							</template>
						</el-table-column>
					</elemTable>
				</div>
				<div v-show="orderSelect">
					分拣：{{selectOrderValue}}&nbsp;&nbsp;
					<iconBtn type="primary" content="添加商品" @click="sortOrderModal" >添加商品</iconBtn>
					<iconBtn type="primary" content="分拣" @click="confirmOrder(true)" >分拣</iconBtn>
					<iconBtn type="primary" content="分拣并发货" @click="confirmOrder(false)" >分拣并发货</iconBtn>
					<elemTable :dataList="orderItemDataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
			            <el-table-column prop="productName" label="商品名称">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.productName">
			                        <div>{{scope.row.productName}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>
			            <el-table-column prop="skuName" label="规格名称">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.skuName">
			                        <div>{{scope.row.skuName}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>
			            <el-table-column prop="canUseQuantity" label="库存剩余" width="120px">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.stockLimit == '0' ? '库存充足' : scope.row.skuStock/100">
			                        <div>{{scope.row.stockLimit == '0' ? '库存充足' : scope.row.skuStock/100+scope.row.skuMeasureName+'('+scope.row.proStock/100+scope.row.baseMeasureName+')'}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>
			            <!--<el-table-column prop="skuMeasureName" label="规格单位">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.skuMeasureName">
			                        <div>{{scope.row.skuMeasureName}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>-->
			            <el-table-column prop="oriPrice" label="基本价格(元)" :width="modalTableInputWidth">
			               <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.oriPrice" @blur="changeOriPrice(scope.row)"></inputItem>
		                            <div style="width: 70px;">元/{{scope.row.baseMeasureName}}</div>
			                    </div>                   
			                </template>
			            </el-table-column>            
			            <el-table-column prop="price" label="规格价格(元)" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.price" @blur="changePrice(scope.row)" ></inputItem>
		                            <div style="width: 70px;">元/{{scope.row.skuMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>
			            <el-table-column prop="chargingModel" label="计价方式">
			                <template slot-scope="scope">
			                    <div>{{calChargingModel(scope.row)}}</div>
			                </template>
			            </el-table-column>
			            <el-table-column prop="quantity" label="需求量" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)" ></inputItem>
		                            <div style="width: 50px;">{{scope.row.skuMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>
			            <el-table-column prop="itemTotal" label="需求金额(元)">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.itemTotal">
			                        <div>{{scope.row.itemTotal}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>
			            <el-table-column prop="sortingWeight" label="分拣量" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.sortingWeight" @blur="changeSortingWeight(scope.row)" ></inputItem>
		                            <div style="width: 50px;">{{scope.row.inspectMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>
			            <el-table-column prop="sortingWeight" label="分拣载体" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <selectInput :value.sync="scope.row.sortBoxId" :filterable="true" v-if="scope.row.chargingModel == '1'">
									<el-option
								      v-for="item in sorWeighebasketList"
								      :key="item.id"
								      :label="item.name"
								      :value="item.id">
								    </el-option>
								</selectInput>
			                </template>
			            </el-table-column>
			            <el-table-column prop="sortBoxCount" label="分拣载体数量" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <inputItem :value.sync="scope.row.sortBoxCount" @blur="changeSortBoxCount(scope.row)" v-if="scope.row.chargingModel == '1'"></inputItem>
			                </template>
			            </el-table-column>
			            <el-table-column prop="sortingTotal" label="分拣金额(元)">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.sortingTotal">
			                        <div>{{scope.row.sortingTotal}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>
			            <el-table-column label="操作">
			                <template slot-scope="scope">
			                    <elBtn @click="delItem(scope.row)" type="danger" v-if="scope.row.id != ''">删除</elBtn>
			                </template>
			            </el-table-column>
			        </elemTable>
				</div>
				<div v-show="productSelect">
					分拣：{{selectproductSkuValue}}&nbsp;&nbsp;库存剩余：{{selectproductSkuStock}}&nbsp;&nbsp;
					<iconBtn type="primary" content="分拣" @click="batchSortingOrder" >分拣</iconBtn>
					<elemTable :dataList="orderTableByProData" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
						<el-table-column prop="buyerName" label="客户名称">
					  	</el-table-column>
					  	<el-table-column prop="orderNumber" label="订单号" width="150px">
					  	</el-table-column>
			            <!--<el-table-column prop="skuMeasureName" label="规格单位">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.skuMeasureName">
			                        <div>{{scope.row.skuMeasureName}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column> -->
			            <el-table-column prop="oriPrice" label="基本价格(元)" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                     <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.oriPrice" @blur="changeOriPrice(scope.row)"></inputItem>
		                            <div style="width: 70px;">元/{{scope.row.baseMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>            
			            <el-table-column prop="price" label="规格价格(元)" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.price" @blur="changePrice(scope.row)" ></inputItem>
		                            <div style="width: 70px;">元/{{scope.row.skuMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>
			            <el-table-column prop="chargingModel" label="计价方式">
			                <template slot-scope="scope">
			                    <div>{{calChargingModel(scope.row)}}</div>
			                </template>
			            </el-table-column>
					  	<el-table-column prop="quantity" label="需求量" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)" ></inputItem>
		                            <div style="width: 50px;">{{scope.row.skuMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>
					  	<el-table-column prop="itemTotal" label="金额">
					  		<template slot-scope="scope">
			                    <toolTip :content="scope.row.itemTotal">
			                        <div>{{scope.row.itemTotal}}</div>
			                    </toolTip>
			                </template>
					  	</el-table-column>
					  	<el-table-column prop="sortingWeight" label="分拣量" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <div class="flex-y-center">
			                        <inputItem :value.sync="scope.row.sortingWeight" @blur="changeSortingWeight(scope.row)" ></inputItem>
		                            <div style="width: 50px;">{{scope.row.inspectMeasureName}}</div>
			                    </div>
			                </template>
			            </el-table-column>
			            <el-table-column prop="sortingWeight" label="分拣载体" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <selectInput :value.sync="scope.row.sortBoxId" :filterable="true" v-if="scope.row.chargingModel == '1'">
									<el-option
								      v-for="item in sorWeighebasketList"
								      :key="item.id"
								      :label="item.name"
								      :value="item.id">
								    </el-option>
								</selectInput>
			                </template>
			            </el-table-column>
			            <el-table-column prop="sortBoxCount" label="分拣载体数量" :width="modalTableInputWidth">
			                <template slot-scope="scope">
			                    <inputItem :value.sync="scope.row.sortBoxCount" @blur="changeSortBoxCount(scope.row)" v-if="scope.row.chargingModel == '1'"></inputItem>
			                </template>
			            </el-table-column>
					  	<el-table-column prop="sortingTotal" label="分拣金额(元)">
			                <template slot-scope="scope">
			                    <toolTip :content="scope.row.sortingTotal">
			                        <div>{{scope.row.sortingTotal}}</div>
			                    </toolTip>
			                </template>
			            </el-table-column>
					</elemTable>
				</div>
			</el-card>
			<el-dialog custom-class="jz-modal" title="商品列表" :visible="productModal" :before-close="productBeforeClose" :close-on-click-modal="false" :width="modalWidth">
				<searchInputItems>
					<searchInputItem name="关键字">
						<inputItem :value.sync="productSearchParam.keyWord" placeHolder="请输入关键字"></inputItem>
					</searchInputItem>
				</searchInputItems>
				<!-- 操作按钮 -->
				<optionItems>
					<template slot="right">
						<el-button-group>
							<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
							<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetProductDialog">重置</iconBtn>
						</el-button-group>
					</template>
				</optionItems>
				<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="productSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="customerName" label="商品名称">
						<template slot-scope="scope">
							<toolTip :content="scope.row.productName">
								<span>{{scope.row.productName}}</span>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="规格" align="center">
						<template slot-scope="scope">
							<toolTip :content="scope.row.name">
								<span>{{scope.row.name}}</span>
							</toolTip>
						</template>
				  	</el-table-column>
				  	<el-table-column prop="canUseQuantity" label="可用库存" align="center">
				  		<template slot-scope="scope">
				    		<span>{{scope.row.stockLimit == '0' ? '库存充足' : scope.row.canUseQuantity/100+renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
				      	</template>
				  	</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button-group>
								<iconBtn type="primary" content="添加" @click="changeProduct(scope.row, 1)" v-if="scope.row.isAppend == null || scope.row.isAppend == 2">添加</iconBtn>
							</el-button-group>
						</template>
					</el-table-column>
				</elemTable>
				<div class="submitB">
					<elBtn @click="batchAddProduct" type="primary">批量添加</elBtn>
				</div>
			</el-dialog>
		</el-col>
		<orderCustomerInfoModal v-if="orderCustomerInfoModal" :modal="orderCustomerInfoModal" :createOrderInfo="createOrderInfo" @close="orderCustomerInfoModalClose" @submit="orderCustomerInfoModalSubmit"></orderCustomerInfoModal>
		<supplierOperateOrderInfoModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams" @submit="modalSubmit"></supplierOperateOrderInfoModal>
	</div>
</template>

<script>
	var addOrderBtn = 0
	var productTableIds = [];
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import configs from '../configs.js'
	import orderCustomerInfoModal from './modals/orderCustomerInfoModal.vue'
	import supplierOperateOrderInfoModal from './modals/supplierOperateOrderInfoModal.vue'
	export default {
		mixins: [mixin],
		components: {orderCustomerInfoModal, supplierOperateOrderInfoModal},
		data() {
			return {
				imgURL : configs.imgURL,
				radio: 0,
				measuremethodList : [],
		        //关注当前供应商的采购商初始化相关数据
		        customerSearchParam : {
		        	sellerId:local.get('sessionUser').typeCode,
		        	customerName : ''
		        },
		        customerOrderBy : [{label : '购买量', value : 1}, {label : '下单量', value : 2}],
		        customerOrderByValue : 1,
		        customerData : [],
		        selectCustomerValue : '',
		        selectCustomerId : '',
		        customerSelect : false,
		        orderSelect : false,
		        productSelect : false,
		        //购买商下面对应的订单初始化相关数据
		        orderSearchParam : {
		        	orderNum : ''
		        },
		        selectOrderValue : '',
		        selectOrderId : '',
		        orderData : [],
		        //在售商品数据
		        selectproductSkuValue : '',
		        selectproductSkuStock : '',
		        productSkuData : [],
		        //选择客户的订单数据
		        productListByCustomer : [],
		        //选择商品数据
		        orderTableByProData : [],
		        orderItemListData : [],
		        searchProductForm : {
		        	keyWord : '',
		        	supplierId : local.get('sessionUser').typeCode
		        },
		        validConfirm: {
                    flag: true,
                    msg: ''
                },
                form: {
                    orderTotal: null,
                    sortingOrderTotal: null,
                    inspectedOrderTotal: null,
                    comment: '',
                    orderStatusId: '',
                    cancelReason: ''
                },
                selectSkuId : '',
                orderCustomerInfoModal : false,
                createOrderInfo : '',
                orderStateList : '',
                selectOrder : '',
                sortData : [],
                sorWeighebasketList : [],
                productModal:false,
                multipleSelectionProduct: [],
                productSearchParam:{
					keyWord: '',
					supplierId : local.get('sessionUser').typeCode,
                },
                catchProduct: [],
                orderItemDataList:[],
                dialogModal:1,//1代表下单界面，2代表分拣界面
			}
		},
		mounted() {
			this.getInitData();
			productTableIds = [];
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
			calChargingModel(row) {
				//1.商品基本单位为计重、规格单位为计件、是否称重为是，仅仅这种商品在分拣时根据基本单位分拣。
				//2.其他所有类型的商品分拣时，是根据规格单位分拣。
                if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                	row.inspectMeasureName = row.baseMeasureName
                } else {
                	row.inspectMeasureName = row.skuMeasureName
                }
//				console.info(row.measureTypePro, row.measureTypeSKU, row.chargingModel)
                if(row.chargingModel == 2) {
                    return '计件'
                }else if(row.chargingModel == 1) {
                    return '计重'
                }
            },
			getInitData() {
				this.refreshProductListByCustomer()
				this.orderStateList = [{
					key : '0',
					value : '待受理'
				},{
					key : '1',
					value : '待分拣'
				},{
					key : '2',
					value : '待发货'
				}]
				this._ajax({url: this.rootAPI, name: 'measuremethod/list', param: {}})
				.then((function(d) {
					this.measuremethodList = d.aaData;
	            }).bind(this))
				this.refreshOrderList();
				//关注当前供应商的采购商数据
				this.refreshCustomerList();
				//查询报价单数据
				this._ajax({url: this.rootAPI, name: 'sorWeighebasket/list', param: {customerId : local.get('sessionUser').typeCode}})
				.then((function(d) {
					this.sorWeighebasketList = d.aaData;
	            }).bind(this))
				this.searchProduct()
			},
			refreshCustomerList() {
				this._ajax({url: this.rootAPI, name: "suppliercollection/getListBySellerId", param: this.customerSearchParam, loading: 'dataLoading'})
				.then((function(d){
					let data = d.aaData
					data.unshift({
						customerId : 0,
						customerName : '临时用户'
					})
					this.customerData = data
				}).bind(this))
			},
			refreshOrderList(buyerId) {
				let param = {
					buyerId : buyerId,
					sellerId:local.get('sessionUser').typeCode,
//					orderStatusId : 1//待分拣
					orderUmber : this.orderSearchParam.orderNum,
					orderStatusString: '0,1,2'
				}
				this._ajax({url: this.rootAPI, name: "order/listByStatus", param: param, loading: 'dataLoading'})
				.then((d)=>{
					let data = d.aaData
					this.orderData = data
				})
			},
			refreshProductListByCustomer(customerId) {
				this.productListByCustomer = [];
				/*let param = {
					supplierId : local.get('sessionUser').typeCode
				}
				this._ajax({url: this.rootAPI, name: "productsku/getCanUseSkuList", param: param, loading: 'dataLoading'})
				.then((function(d){
					let data = d.aaData
					$.each(data, function(i, obj) {
						obj.itemTotal = 0
						obj.skuName = obj.name
						obj.skuStock = obj.canUseQuantity
						obj.oriPrice = obj.basePrice
						obj.sortingTotal = 0
					});
					this.productListByCustomer = data;
				}).bind(this))*/
			},
			customerCurrentChange(row) {
				//选择客户
//				console.info(row)
				if(row) {
					this.selectCustomerId = row.customerId
					this.refreshOrderList(row.customerId)
					this.customerSelect = true;
					this.orderSelect = false;
					this.productSelect = false;
					this.radio = 0
					this.selectCustomerValue = row.customerName;
					this.refreshProductListByCustomer(this.selectCustomerId)
				}
			},
			orderCurrentChange(row) {
				//选择订单
				if(row) {
					this.customerSelect = false;
					this.orderSelect = true;
					this.productSelect = false;
					this.radio = 0
					this.selectOrderValue = row.orderUmber
					this.selectOrderId = row.id
					this.selectOrder = row
					this.refreashOrderItem()
				}
			},
			addOrderModal() {
				this.dialogModal = 1;
				productTableIds = [];
				this.productListByCustomer.forEach((function(el) {
					productTableIds.push(el.skuId);
				}).bind(this))
				this.catchProduct = [];
				this.showOrderProduct();
			},
			sortOrderModal() {
				this.dialogModal = 2;
				productTableIds = [];
				this.orderItemDataList.forEach((function(el) {
					productTableIds.push(el.skuId);
				}).bind(this))
				this.catchProduct = [];
				this.showOrderProduct();
			},
			showOrderProduct() {
				this.productModal = true;
				this.selectOrderProduct();
			},
			resetProductDialog() {
				this.productSearchParam.keyWord = '';
				this.selectOrderProduct();
			},
			selectOrderProduct() {
				this.pageNum = 1;
				this.pageSize = 10;
				this.searchTable();
			},
			searchTable() {
				//查询可用商品列表
				Object.assign(this.productSearchParam, {
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					joininSkuIdsString: productTableIds.join(",")
				});
                this._ajax({url: this.rootAPI, name: "productsku/getCanUseSkuList", param: this.productSearchParam, loading: 'dataLoading'})
				.then(this.renderTable)
				.then((function(){
					let data = this.dataList
					$.each(data, function(i, obj) {
						obj.skuId = obj.id
						obj.itemTotal = 0
						obj.skuName = obj.name
						obj.skuStock = obj.canUseQuantity
						obj.oriPrice = obj.basePrice
						obj.sortingTotal = 0
					});
				}).bind(this))
			},
			productSelectionChange(val) {
				this.multipleSelectionProduct = val;
			},
			changeProduct(row, type, isBatch) {
				if(type == '1') {
					var index = productTableIds.indexOf(row.skuId);
					if(index < 0) {
						let productSku = {
							productId: row.productId,
							productName: row.productName,
							skuId: row.skuId,
							name: row.name,
							stockLimit: row.stockLimit,
							price: row.price,
							canUseQuantity : row.canUseQuantity,
//							id: row.id,
							itemTotal: 0,
							//下面是分拣界面需要的属性
							oriPrice : row.basePrice,
							skuName: row.name,
							baseMeasureName: row.baseMeasureName,
							skuMeasureName : row.skuMeasureName,
							measureTypePro : row.measureTypePro,
							measureTypeSKU : row.measureTypeSKU,
							chargingModel : row.chargingModel,
							sortingTotal : 0,
						};
						if(this.dialogModal == 1)
							this.productListByCustomer.unshift(productSku);
						if(this.dialogModal == 2) 
							this.orderItemDataList.unshift(productSku);
						this.catchProduct.unshift(productSku);
						productTableIds.push(row.skuId);
						this.searchTable();
					} else {
						this.$message({
							type: 'failure',
							message: '该商品规格已加入订单列表'
						});
					}
				} else {
					//删除ids
					let skuId = row.id;
					var index = productTableIds.indexOf(skuId);
					productTableIds.splice(index, 1);
					//删除表格数据
					let tableData = [];
					if(this.dialogModal == 1)
						tableData = this.productListByCustomer;
					if(this.dialogModal == 2) 
						tableData = this.orderItemDataList;
					let indexTemp;
					$.each(tableData, function(i, obj) {
						if(obj.id == skuId) {
							indexTemp = i;
						}
					});
					tableData.splice(indexTemp, 1);
					this.catchProduct.splice(indexTemp, 1);
					if(this.dialogModal == 1)
						this.productListByCustomer = tableData;
					if(this.dialogModal == 2) 
						this.orderItemDataList = tableData;
				}
			},
			batchAddProduct() {
				let data = this.multipleSelectionProduct;
				let vm = this;
				$.each(data, function(i, row) {
					vm.changeProduct(row, '1', true);
				});
				this.productModal = false;
			},
			productBeforeClose() {
				this.productModal = false;
			},
			refreashOrderItem() {
				this._ajax({name: 'orderitem/getOrderItemList', param: {orderId: this.selectOrderId}, loading: 'modalDataLoading'})
//              .then(this.renderTable)
                .then((function(d) {
//              	orderItemDataList
					let resultData = d.aaData;
                    resultData.forEach((function(el) {
                        el.oriPrice = el.oriPrice/100
                        el.price = el.price/100
                        el.itemTotal = el.itemTotal/100
                        el.sortingTotal = el.sortingTotal/100
                        el.inspectMeasureName = ''
                        if(!el.sortingWeight || el.sortingWeight == 0) {
                        	if((el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                               (el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                               (el.measureTypePro == 1 && el.measureTypeSKU == 1 && el.chargingModel == 1)) {
                                el.sortingWeight = el.quantity
                                el.sortingTotal = this._parseFloat(el.priceForDecimal.mul(el.sortingWeight), 2)
                            }else if(el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                el.sortingWeight = el.quantity.mul(el.skuQuantity)
                                el.sortingTotal = this._parseFloat(el.oriPriceForDecimal.mul(el.sortingWeight), 2)
                            }
                        }
                        this.changeSortingWeight(el)
                    }).bind(this))
                    this.orderItemDataList = resultData;
                    /*let concatData = []
                    this.productListByCustomer.forEach((function(el) {
                    	let tempData = {}
                    	Object.assign(tempData, el)
                    	//商品列表订单id置空
                    	tempData.skuId = el.id
                    	tempData.id = ''
                    	//校验是否在订单明细里
                    	let flag = true;
                    	this.dataList.forEach((function(e) {
                    		if(e.skuId == tempData.skuId) flag = false;
                    	}).bind(this))
                    	if(flag)
                    		concatData.push(tempData)
                	}).bind(this))
                    this.orderItemListData  = this.dataList;
                    this.dataList = this.dataList.concat(concatData);*/
                }).bind(this))
			},
			productListChange(obj) {
				//选择商品
				this.$refs.customerDataTable.setCurrentRow();
				this.$refs.orderDataTable.setCurrentRow();
				this.selectCustomerId = ''
				this.selectOrderId = ''
				this.customerSelect = false;
				this.orderSelect = false;
				this.productSelect = true;
				this.selectproductSkuValue = obj.productName + "-" + obj.name
				this.selectSkuId = obj.id;
				this.refreashProductSorting(obj.id);
			},
			refreashProductSorting(skuId) {
				this._ajax({name: 'orderitem/getOrderItemList', param: {skuId: skuId, orderStatusString: '0,1'}})
				.then((function(d) {
					this.selectproductSkuStock = null;
					if(d.dataCount && d.dataCount > 0) {
						let dataTemp = d.aaData[0];
						if(dataTemp.stockLimit == 1) {
							this.selectproductSkuStock = dataTemp.skuStock / 100
						}
						else this.selectproductSkuStock = '库存充足'
					}
					let data = d.aaData
					data.forEach((function(el) {
                        el.oriPrice = el.oriPrice/100
                        el.price = el.price/100
                        el.itemTotal = el.itemTotal/100
						el.sortingTotal = el.sortingTotal/100
						if(!el.sortingWeight || el.sortingWeight == 0) {
                        	if((el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                               (el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                               (el.measureTypePro == 1 && el.measureTypeSKU == 1 && el.chargingModel == 1)) {
                                el.sortingWeight = el.quantity
                                el.sortingTotal = this._parseFloat(el.priceForDecimal.mul(el.sortingWeight), 2)
                            }else if(el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                el.sortingWeight = el.quantity.mul(el.skuQuantity)
                                el.sortingTotal = this._parseFloat(el.oriPriceForDecimal.mul(el.sortingWeight), 2)
                            }
                        }
                    }).bind(this))
					this.orderTableByProData = data
					//查询库存
					if(!this.selectproductSkuStock) {
						this._ajax({name: 'productstock/list', param: {skuId: skuId}})
						.then((function(d) {
							if(d.dataCount > 0) this.selectproductSkuStock = d.aaData[0].stockQuantity / 100
							else this.selectproductSkuStock = 0
						}).bind(this))
					}
				}).bind(this))
			},
			addOrder() {
				if(addOrderBtn == 1) {
					this.$message({type: 'info', message: '正在下单，请稍后...'});
					return;
				}
				addOrderBtn = 1
				//下单
				let customerId = this.selectCustomerId;
				let data = this.productListByCustomer;
				let submitItems = []
				let flag = true
				let flag1 = true
				let vm = this
				$.each(data, function(i, obj) {
					let temp = {}
					Object.assign(temp, obj)
					if(obj.quantity) {
						/*if(!vm.regPosPattern.test(obj.quantity) || obj.quantity <= 0) {
                			vm.$message({type: 'warning', message: '请输入大于0小于16位长度的整数'});
                			flag = false;
                		}*/
                		vm.changeQuantity(obj)
						var tempPrice = obj.itemTotal + ""
						if(tempPrice.length >= 16) {
							vm.$message({type: 'warning', message: obj.itemTotal + '-总金额超出限制，请重新输入需求量'});
                			flag1 = false;
						}
						temp.price = obj.price * 100
						temp.oriPrice = obj.oriPrice * 100
						temp.skuName = obj.name
						temp.skuId = obj.skuId
						temp.id = ''
						temp.itemTotal = obj.itemTotal * 100
						submitItems.push(temp);
					}
				});
//				console.info(submitItems)
				if(submitItems.length == 0) {
					addOrderBtn = 0
					vm.$message({type: 'warning', message: '请在需要下单的商品内填写需求数量'});
					return;
				}
				if(!flag) {
					addOrderBtn = 0
					vm.$message({type: 'warning', message: '需求数量应为大于0的整数'});
					return;
				}
				if(!flag1) {
					addOrderBtn = 0
					vm.$message({type: 'warning', message: '总金额超出限制，请重新输入需求量'});
					return;
				}
				if(flag) {
					let param = {
						buyerId : customerId,
						buyerName : this.selectCustomerValue,
						sellerId : local.get('sessionUser').typeCode,
						sellerName : local.get('sessionUser').nickName,
						orderitems : JSON.stringify(submitItems),
						distributionType : '0',//全部自提，不选择配送方式和支付方式
						payType : '0',
						createByOwn : '1',
					}
					this.submitAddOrder(param);
					
					/*if(customerId == 0) {
//						console.info(param)
						Object.assign(this.createOrderInfo, {
							distributionType : '0',
						})
						this.submitAddOrder(param);
					} else {
						//弹出框选择收货地址及送货时间
						this._ajax({url: this.rootAPI, name: "address/queryByCustomerId", param: {customerId : customerId}})
						.then((function(d){
							if(d.aaData.id) {
								this.createOrderInfo = param
								Object.assign(this.createOrderInfo, {
									shippingAdd : d.aaData.completeAddress,
									shippingAddId : d.aaData.id
								})
								//需要弹框所需步骤
								// this.orderCustomerInfoModal = true
								//不弹框直接提交
								this._ajax({name: 'store/queryBySellerId', param: {sellerId: this.createOrderInfo.sellerId}})
								.then((function(d) {
									let data = d.aaData;
									let startFlag = 0;
									if(data.distributionToday == 0) {
										startFlag = 1
									}
									let nowTime = new Date();
									nowTime.setTime(nowTime.getTime()+(startFlag * 24*60*60*1000));
									let dayTemp = nowTime.getFullYear()+"-" + (nowTime.getMonth()+1) + "-" + nowTime.getDate();
									
			                    	this.createOrderInfo.distributionTimeBegin = dayTemp + " " + data.distributionStart + ":00:00"
			                    	this.createOrderInfo.distributionTimeEnd = dayTemp + " " + (data.distributionStart + 1) + ":00:00"
//			                    	console.info(this.createOrderInfo)
			                    	this.submitAddOrder(this.createOrderInfo);
								}).bind(this))
							} else {
								this.$message({type: 'warning', message: '该采购商没有收货地址，请先完善收货地址'})
							}
						}).bind(this))
					}*/
				}
			},
			orderCustomerInfoModalClose() {
				this.refreshOrderList();
				this.orderCustomerInfoModal = false
			},
			orderCustomerInfoModalSubmit(obj) {
//				console.info(obj)
				this.orderCustomerInfoModal = false
				Object.assign(obj, {
					createByOwn : '1',
				})
				this.submitAddOrder(obj)
			},
			submitAddOrder(param) {
				//提交下单操作
				this._ajax({url: this.rootAPI, name: "order/createOrder", param: param})
				.then((function(d){
					if(d.state == 0) {
						this._ajax({url: this.rootAPI, name: "order/orderStateUpdate", param: {id : [d.aaData[0].id], state : 1}, arr : true})
						.then((function(d){
							this.$message({type: 'success', message: '操作完成'})
							this.customerSelect = false;
							this.refreshOrderList(this.selectCustomerId);
							addOrderBtn = 0
						}).bind(this))
					} else {
						addOrderBtn = 0
						this.$message({type: 'warning', message: d.msg})
					}
				}).bind(this))
			},
			confirmOrder(isSort) {
				if(!this.validConfirm.flag){
					return;
				}
				var arr = []
				//分拣确认
				let vm = this
				vm.sortData = []
				let flagSort = false
				let isZeroCheck = false;
				this.orderItemDataList.forEach((function(el) {
					if((el.sortingWeight && el.sortingWeight != 0) && (el.quantity && el.quantity != 0)) {
						let data = {};
						Object.assign(data, el)
						data.oriPrice = el.oriPrice * 100
						data.price = el.price * 100
						vm.sortData.push(data);
						if(el.orderId) {
							var batchId = el.batchId
							if(!batchId) {
								arr.push(el.productName)
							}
						} else {
							flagSort = true
						}
					} else {
						isZeroCheck = true
					}
				}).bind(this))
				if(isZeroCheck) {
					this.$message({type: 'warning', message: '请输入需求量和分拣量'})
					return;
				}
				if(flagSort && isSort == false) {
					this.$message({type: 'warning', message: '订单加入新的商品不能直接分拣发货，需要先操作分拣'})
					return;
				}
				if(arr.length > 0) {
					this.confirm(arr.join(',') + '未做进场，请先做进场' , (function() {
						this._go('inMarketDetail')
					}).bind(this))
				}else {
					let flag = false
					vm.sortData.forEach((function(el) {
						this.changeOriPrice(el)
		                this.changePrice(el)
		                this.changeSortingWeight(el)
		                if(this.validConfirm.flag) this.tableFormValid(el);
		                var tempItemPrice = el.itemTotal+""
		                var tempsortingPrice = el.sortingTotal+""
		                var tempsortBoxCount = el.sortBoxCount+""
		                if(tempItemPrice.length >= 16) {
							Object.assign(this.validConfirm, {
		                        flag: false,
		                        msg: tempItemPrice+'-需求价格超出限制，请重新输入需求量'
		                    })
						}
		                if(tempsortingPrice.length >= 16) {
							Object.assign(this.validConfirm, {
		                        flag: false,
		                        msg: tempsortingPrice+'-分拣价格超出限制，请重新输入需求量'
		                    })
						}
		                if(tempsortBoxCount && tempsortBoxCount.length >= 16) {
		                	Object.assign(this.validConfirm, {
		                        flag: false,
		                        msg: tempsortBoxCount+'-分拣载体超出限制，请重新输入分拣载体数量'
		                    })
		                }
	                }).bind(this))
	                if(this.validConfirm.flag) {
	                	if(this.selectOrder.orderStatusId == '0') {
							Object.assign(this.form, {
								orderStatusId: '1',
								id : this.selectOrder.id
							})
							this._updateOrder(this.form)
							.then((function(d) {
	                    		if(d.state === 0) {
	                    			Object.assign(this.form, {orderStatusId: '2'})
	                    			this.submit(isSort)
	                    		}
	                    	}).bind(this))
						} else {
							Object.assign(this.form, {orderStatusId: '2'})
	                    	this.submit(isSort)     
						}
					}
					else {
	                    this.$message({type: 'warning', message: this.validConfirm.msg});
	                }
				}               
			},
			batchSortingOrder() {
				//批量分拣订单商品
				let data = this.orderTableByProData;
				let sortingData = []
				$.each(data, function(i, obj) {
					if(obj.sortingWeight && obj.sortingWeight != 0) {
						let dataTemp = {};
						Object.assign(dataTemp, obj)
						dataTemp.oriPrice = obj.oriPrice * 100
                        dataTemp.price = obj.price * 100
                        dataTemp.itemTotal = obj.itemTotal * 100
                        dataTemp.sortingTotal = obj.sortingTotal * 100
						sortingData.push(dataTemp);
					}
					else {
	                    this.$message({type: 'warning', message:'请输入分拣量'});
	                }
				});
//				console.info(sortingData)
				this._ajax({url: this.rootAPI, name: "orderitem/batchUpdateItems", param: {orderitems : JSON.stringify(sortingData)}})
				.then((function(d){
					if(d.state === 0) {
						this.$message({type: 'success', message: '操作完成'})
						this.refreashProductSorting(this.selectSkuId);
						this.refreshOrderList();
					} else {
                        this.$message({type: 'warning', message: d.msg})
                    }
				}).bind(this))
				
			},
			submit(isSort) {
				let param = {
					mainOrderId : this.selectOrderId,
					sellerId : local.get('sessionUser').typeCode,
					orderitems : JSON.stringify(this.sortData),
				}
                this._ajax({url: this.rootAPI, name: "orderitem/supplierOperateSort", param: param})
                .then((function(result) {
                    if(result.state === 0) {
                        Object.assign(this.form, {
                            orderTotal: this.form.orderTotal.mul(100),
                            sortingOrderTotal: this.form.sortingOrderTotal.mul(100),
//                          inspectedOrderTotal: this.form.sortingOrderTotal.mul(100),
                            orderUmber : result.aaData.orderUmber,
                            id : this.selectOrderId
                        })
//                      console.info(this.form)
                        this._updateOrder(this.form)
                        .then((function(d) {
                            if(d.state === 0 || d.state === 2) {
                                this.$emit('submit')
                                this.$message({type: 'success', message: '操作完成'})
                                this.orderSelect = false;
                                
                                if(isSort == false) {
                                	//直接到已收货
	                            	this.updateOrderState(this.form, '3')
	                                this._ajax({name: 'order/listDto', param: {id : this.form.id}})
	                                .then((function(d){
	                                	this.modalEdit(d.aaData[0])
	                                }).bind(this))
                                } else {
                                	this.refreshOrderList(this.selectCustomerId);
                                }
                            }else {
                                this.$message({type: 'warning', message: d.msg})
                            }                        
                        }).bind(this))
                    }else {
                        this.$message({type: 'warning', message: result.msg})
                    }
                }).bind(this))   
                
            },
            updateOrderState(row, state) {
				Object.assign(row, {
					orderStatusId: state
				})		
				if(state === '1') {
					var ids = [row.id]
					this._batchUpdateOrderState(ids, state)
				}else {
					if(state === '3') {
						Object.assign(row, {
							shippingStatusId: '1',
						})
					}
					if(state === '4') {
						Object.assign(row, {
							shippingStatusId: '2'
						})
					}
					if(state === '5') {
						Object.assign(row, {
							paymentStatusId: '1'
						})
					}
//					console.info(row, state)
					this._updateOrder(row)
					.then((function(d) {
                        if(d.state == 0) {
                        	if(state === '3') {
                        		this.sortData.forEach((function(el) {
                        			//因为在显示订单金额和分拣金额的时候是处理之后另外显示的，原始数据并没有处理
                        			//_batchUpdateOrderItem这个方法里面会对金额乘以100处理，所以需要先除以100
                        			el.itemTotal = el.itemTotal / 100
                        			el.sortingTotal = el.sortingTotal / 100
									el.inspectedWeight = el.sortingWeight
									el.inspectedTotal = el.sortingTotal
								}).bind(this))
								this._batchUpdateOrderItem(this.sortData)
								this.updateOrderState(this.form, '4')
                        	} else if(state === '4') {
                        		this.updateOrderState(this.form, '5')
                        		this.refreshOrderList(this.selectCustomerId);
                        	}
                        }
                    }).bind(this))
				} 
			},
			changeOriPrice(row) {
                if(!row.oriPrice || !this.priceFloat.test(row.oriPrice) || row.oriPrice <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '价格输入不合法'
                    })
                }
            },
            changePrice(row) {
                if(!row.price || !this.priceFloat.test(row.price) || row.price <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '价格输入不合法'
                    })
                }
            },
            changeSortingWeight(row) {
                if(!row.sortingWeight || !this.weightFloat.test(row.sortingWeight) || row.sortingWeight <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过三位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '分拣重量输入不合法'
                    })
                } else {
                    this.tableFormValid(row)
                }
            },
            changeQuantity(row) {
            	if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    if(!this.regPosPattern.test(row.quantity) || row.quantity <= 0 || row.quantity > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的整数'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '需求数量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }else if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) || 
                         (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1)) {
                    if(!this.weightFloat.test(row.quantity) || row.quantity <= 0 || row.quantity > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的数字,小数位数不超过三位'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '需求数量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }
            },
            changeSortBoxCount(row) {
                if(!row.sortBoxCount || !this.regPosPattern.test(row.sortBoxCount) || row.sortBoxCount <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的整数'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '需求数量输入不合法'
                    })
                }else {
                    this.tableFormValid(row)
                }
            },
            tableFormValid(row) {
                Object.assign(this.validConfirm, {
                    flag: true,
                    msg: ''
                })
                this.orderSum(row)
            },
            orderSum(row) {
				let sortBoxCount = row.sortBoxCount == null ? 0 : row.sortBoxCount
				let baseSortBoxWeight = 0;
				let skuSortBoxWeight = 0;
				let sortBoxWeight = 0;
				if(sortBoxCount != 0 && row.sortBoxId) {
					let sortBoxPreWeight = 0;
					this.sorWeighebasketList.forEach(function(el) {
						if(el.id == row.sortBoxId) {
							sortBoxPreWeight = el.weight.mul(100)
						}
					})
//					console.info(sortBoxCount, sortBoxPreWeight, row.baseConversionRatio, row.skuConversionRatio)
					baseSortBoxWeight = sortBoxCount * (sortBoxPreWeight/100) / row.baseConversionRatio
					skuSortBoxWeight = sortBoxCount * (sortBoxPreWeight/100) / row.skuConversionRatio
//					console.info(baseSortBoxWeight, skuSortBoxWeight)
				}
//				console.info(sortBoxCount, baseSortBoxWeight, skuSortBoxWeight, row.sortBoxId, row.baseConversionRatio, row.skuConversionRatio)
				if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) ||
                   (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    if(row.price) {
                    	row.sortingTotal = this._parseFloat(row.price.mul(row.sortingWeight-skuSortBoxWeight), 2);
                    	sortBoxWeight = skuSortBoxWeight
                    }
                    row.itemTotal = this._parseFloat(row.price.mul(row.quantity), 2)
                } else if (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    row.itemTotal = this._parseFloat(row.price.mul(row.quantity), 2)
                    if(row.oriPrice) {
                    	row.sortingTotal = this._parseFloat(row.oriPrice.mul(row.sortingWeight-baseSortBoxWeight), 2)
                    	sortBoxWeight = baseSortBoxWeight
                    }
                } else {
                	row.itemTotal = this._parseFloat(row.price.mul(row.quantity), 2)
                	if(row.price) {
                    	row.sortingTotal = this._parseFloat(row.price.mul(row.sortingWeight-skuSortBoxWeight), 2)
                    	sortBoxWeight = skuSortBoxWeight
                    }
                }
                if(row.oriPrice) {
	                var orderTotal = 0, sortingOrderTotal = 0
	                this.orderItemDataList.forEach(function(el) {
	                	if(el.itemTotal && el.sortingTotal) {
	                		orderTotal = orderTotal.add(el.itemTotal == null ? 0 : el.itemTotal)
		                    sortingOrderTotal = sortingOrderTotal.add(el.sortingTotal == null ? 0 : el.sortingTotal)
		                    if(el.sortBoxId)
		                  		el.sortBoxWeight = sortBoxWeight
	                	}
	                })
	                Object.assign(this.form, {
	                    orderTotal,
	                    sortingOrderTotal,
	                })
                }
            },
			searchProduct() {
				//当前供应商在售商品productSkuData supplierId
				this._ajax({url: this.rootAPI, name: "productsku/getCanUseSkuList", param: this.searchProductForm, loading: 'dataLoading'})
				.then((function(d){
					let data = d.aaData
//					console.info(data)
					this.productSkuData = data;
				}).bind(this))
			},
			delItem(row) {
				if(this.orderItemDataList.length == 1) {
					this.$message({type: 'warning', message: '订单最后一条商品数据不允许删除'});
					return;
				}
                this._comfirm('确认删除?')
                    .then((function() {
                        return this._bathDeleteOrderItem([row.id], this.selectOrderId)
                    }).bind(this))
                    .then(this.refreashOrderItem)
                    .catch(this._confirmCancle)
            },
		}
	}
</script>

<style lang="sass">
	.baseCard{
    	margin-top : -20px;
    	height : 400px;
    }
</style>