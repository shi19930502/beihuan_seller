<template>
	<div>
		<searchInputItems>
			<searchInputItem name="订单编号">
				<inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="卖方名称">
				<inputItem :value.sync="searchForm.sellerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="买方名称">
				<inputItem :value.sync="searchForm.buyerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="配送时间段">
				<dateEditorDaterange :dateValue.sync="deliveryDateRange" ></dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="订单创建时间">
				<dateEditorDaterange :dateValue.sync="dateRange" ></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-setting" content="配送数据校验及处理" @click="dataCheckAndSolve" type="success">配送数据校验及处理</iconBtn>
					<iconBtn iconClass="el-icon-edit" content="批量确认受理" @click="updateStatusToOneMany">批量确认受理</iconBtn>
					<iconBtn iconClass="el-icon-printer" content="批量打印送货单" @click="batchPrint" type="warning">批量打印送货单</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<!-- <iconBtn iconClass="el-icon-sort" content="获取订单" @click="syncOrder">获取订单</iconBtn> -->
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="orderUmber" label="订单编号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<!--<el-table-column prop="channelName" label="渠道">
				<template slot-scope="scope">
					<toolTip :content="scope.row.channelName">
						<div>{{scope.row.channelName}}</div>
					</toolTip>
				</template>
			</el-table-column>-->
			<el-table-column prop="sellerName" label="卖方名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sellerName">
						<div>{{scope.row.sellerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="buyerName" label="买方名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<div>{{scope.row.buyerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="distributionTimeBegin" label="配送时间" width="140">
				<template slot-scope="scope">
					<div>{{scope.row.distributionTimeBegin}}~{{scope.row.distributionTimeEnd}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="shippingAdd" label="配送地址">
				<template slot-scope="scope">
					<toolTip :content="scope.row.shippingAdd">
						<div>{{scope.row.shippingAdd}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderTotal" label="订单总额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderTotal">
						<div>{{scope.row.orderTotal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sortingOrderTotal" label="分拣总额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingOrderTotal">
						<div>{{scope.row.sortingOrderTotal}}&nbsp;元</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="buyerBusinessNo" label="商圈序号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerBusinessNo">
						<div>{{scope.row.buyerBusinessNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="createdDate" label="创建时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<div>{{scope.row.createdDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template slot-scope="scope">
					<iconBtn content="确认受理" v-if="scope.row.status!=1" @click="updateStatusToOne(scope.row)" type="primary" plain>确认受理</iconBtn>
					<iconBtn content="拒绝" v-if="scope.row.status!=1" @click="invoke(scope.row)" type="info" plain>拒绝</iconBtn>
					<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
					<iconBtn iconClass="el-icon-printer" content="打印送货单" @click="printRow(scope.row)"></iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<deliveryorderModal :modal='showModal' v-if='showModal' @close='ModalClose' :tableRow='tableRow'></deliveryorderModal>
		<dataCheckModal v-if="dataCheckModalShow" :modal="dataCheckModalShow" @close="dataCheckModalClose"></dataCheckModal>
		<div id="printtemp"></div>
	</div>
</template>
<script>
	import local from "../local.js";
	import mixin from "../mixin/mixin.js";
	// import "../../lib/printplugin/LodopFuncs.js";
	// import "../../lib/printplugin/lodopPrinter.js";
	import deliveryorderModal from "./modals/deliveryorderModal.vue";
	import dataCheckModal from "./modals/dataCheckModal.vue";
	import configs from '../configs.js'
	export default {
		mixins: [mixin],
		components: {
			deliveryorderModal,
			dataCheckModal
		},
		data() {
			return {
				dataList: [],
				searchForm: {
					sellerName: "",
					buyerName: "",
					orderUmber: "",
					startTime: "",
					endTime: "",
					distributionTimeBegin: "",
					distributionTimeEnd: ""
				},
				dateRange: [],
				deliveryDateRange: [],
				showModal: false,
				lodop: "",
				dataCheckModalShow: false,
			};
		},
		mounted() {
			this.searchTable();
			this.lodop = new lodopPrinter();
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				/**customerid  需要从缓存中获取 */
				this.searchForm.distributorId = parseInt(user.typeCode);
				if(this.dateRange && this.dateRange.length > 0) {
					this.searchForm.startTime = this.dateRange[0];
					this.searchForm.endTime = this.dateRange[1];
				} else {
					this.searchForm.startTime = null;
					this.searchForm.endTime = null;
				}
				if(this.deliveryDateRange && this.deliveryDateRange.length > 0) {
					this.searchForm.distributionTimeBegin = this.deliveryDateRange[0];
					this.searchForm.distributionTimeEnd = this.deliveryDateRange[1] + " 23:59:59";
				} else {
					this.searchForm.distributionTimeBegin = null;
					this.searchForm.distributionTimeEnd = null;
				}
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					orderField: 'f_status'
				});
				return this._ajax({
					url: this.distributeAPI + "deliveryOrder/list",
					name: "",
					param: this.searchForm,
					loading: "dataLoading"
				}).then(
					this.renderTable);
			},
			batchPrint() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: "info",
						message: "请选择行"
					});
				} else {
					let selection = this.delSelection;
					var arr = [],
						o = {};
					selection.forEach(function(el) {
						arr.push(el.id);
					});
					o.orderIds = arr.join(',');
					this.print(o);
				}
			},
			updateStatusToOneMany() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: 'info',
						message: '请选择行'
					});
				} else {
					let selection = this.delSelection
					this.confirm('确定批量确认受理？', (function() {
						var arr = [],
							o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						o.id = arr;
						//获取当前用户的登录信息，设置问审核人员的信息
						this._ajax({
							url: this.distributeAPI + 'deliveryOrder/updateStutasByArrayIds',
							param: {
								id : o.id
							},
							arr: true
						}).then((function(d) {
								if(d.state != 0){
									this.$message({
										type: 'warning',
										message: d.msg
									});
								}else{
									this.$message({
										type: 'success',
										message: '受理成功'
									});
								}
								this.handleCurrentChange(1)
							}).bind(this))
					}).bind(this))
					this.searchTable();
				}
			},
			printRow(o) {
				var ob = {
					orderIds: o.id
				};
				this.print(ob);
			},
			print(o) {
				this._ajax({
					url: this.distributeAPI + "deliveryOrder/GetDeliveryOrder",
					name: "",
					param: o,
					loading: "dataLoading"
				}).then((function(d) {
					if(d.state == 0 && d.aaData && Array.isArray(d.aaData.orderInfos) && d.aaData.orderInfos.length > 0) {

						var totalItem = 0;
						d.aaData.orderInfos.forEach((function(em, index) {
							var printHtml = '';
							var itemHTML = '';
							var moneyTotle = 0;
							em.orderDetils.forEach((function(em1, index) {
								totalItem++;
								let _index = index + 1;
								let productName = em1.productName || '';
								let skuName = em1.skuName || '';
								let sortWeight = em1.sortWeight || '';
								let oriPrice = (Math.round(em1.sortitemTotal * 100 / em1.sortWeight) / 100).toFixed(2) || '';
								let quantity = em1.quantity || '';
								let price = em1.price || '';
								let itemTotal = em1.itemTotal || '';
								let comment = em1.comment || '';
								let sortitemTotal = em1.sortitemTotal || '';
								let measurementUnit = em1.measurementUnit || '';
								let skuMeasureName = em1.skuMeasureName || '';
								moneyTotle += em1.sortTotol;
								var item = `
                                            <tr>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${quantity}${skuMeasureName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortWeight}${measurementUnit}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${oriPrice}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortitemTotal}</td>
                                            </tr>
                                          `;
								itemHTML += item
							}).bind(this));
							var orderDetilsLength = 1
							if(em.orderDetils && em.orderDetils.length > 0) {
								orderDetilsLength = em.orderDetils.length + 1
							}

							var orderTotal = em.orderTotal || '';
							var sortOrderTotal = em.sortOrderTotal || '';

							itemHTML += `
                                   <tr>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;">合计</td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;" ></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;" colspan="2">${sortOrderTotal}</td>
                                   </tr>
                                   `;

							var orderNumber = em.orderNumber || '';
							var phoneNumber = em.phoneNumber || '';
							var address = em.address || '';
							var orderId = em.orderId || '';
							var buyerName = em.buyerName || '';
							var deliveryDate = em.deliveryDate || '';
							var sortOrderTotal = em.sortOrderTotal || '';
							var orderDate = em.orderDate || '';
							var printDate = this.formatDateTime(new Date());
							var orderTotal = em.orderTotal || '';
							var contacts = em.contacts || '';
							var sellerName = em.sellerName || '';
							var marketTitle = this.$store.state.marketTitle || ''
							var footer1 = '送货人'
		                    var footer2 = '收货人'
		                    var footer3 = '验收人'
		                    var footer4 = ''
							if(configs.hedong == 1) {
			                    marketTitle = '临沂市食品追溯市场'
			                    sellerName = '临沂德润食品有限公司'
			                    footer1 = '配送员'
			                    footer2 = '验收员'
			                    footer3 = '复核员'
			                    footer4 = '负责人'
			                }
							var content = `
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 17px;margin:0px;padding:0">
                              <span>${marketTitle}(${sellerName})送货单</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                              <span style="position: absolute;left: 0;">配送时间: ${deliveryDate}</span>
                              <span style="position: absolute;right: 0;">订单号: ${orderNumber}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                              <span style="position: absolute;left: 0;">采购单位: ${buyerName}</span>
                              <span style="position: absolute;right: 0;">收货人/联系电话: ${contacts}/${phoneNumber}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                              <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                              <span style="position: absolute;right: 0;">打印时间: ${printDate}</span>
                          </div>
                      <table style="text-align: center; border-collapse: collapse; width: 100%;">
                          <thead style="font-size:14px;">
                              <tr>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">需求量</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">送货量</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">单价(元)</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">金额(元)</th>
                              </tr>
                          </thead>
                          ${itemHTML}
                      </table>
                    `;
							// 	var footer = `
							//   <div style="position: relative;text-align: center;font-size: 13px;">
							//       <span style="position: absolute;left: 0;">送货人签字: </span>
							//       <span >收货人签字:</span>
							//       <span style="position: absolute;right: 0;">验收人签字:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
							//   </div>`;
							var footer = `
							<div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
		                        <span style="width: 25%;display: inline-block;">${footer1}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer2}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer3}: </span> 
		                        <span style="width: 25%;display: inline-block;">${footer4}: </span>                                        
		                    </div>`;
							printHtml += content;
							printHtml += footer;
							this.lodopoPrint('6%', '5%', '95%', '100%', printHtml, orderDetilsLength)
							// this.lodopoPreview('6%', '5%', '95%', '100%', printHtml)
						}).bind(this))
					}
				}).bind(this))
			},
			reset() {
				Object.assign(this.searchForm, {
					orderUmber: "",
					startTime: "",
					endTime: ""
				});
				this.dateRange = [];
				this.deliveryDateRange = [];
				this.searchTable()
			},
			lookOver(o) {
				this.tableRow = o;
				this.showModal = true;
			},
			ModalClose() {
				this.showModal = false;
			},
			syncOrder() { //没用
			},
			formatDateTime(date) {
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours();
				var minute = date.getMinutes();
				var ss = date.getSeconds();
				minute = minute < 10 ? ('0' + minute) : minute;
				ss = ss < 10 ? ('0' + ss) : ss;
				return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + ss;
			},
			updateStatusToOne(row) {
				this.confirm('确定受理？', (function() {
					var o = {
						id: [row.id],
						status: 1
					};
					this._ajax({
							url: this.distributeAPI + 'deliveryOrder/update',
							param: o,
							arr: true
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '受理成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this));
				this.searchTable();
			},
			invoke(row) {
				this.confirm('确定拒绝？', (function() {
					var o = {
						id: [row.id]
					};
					this._ajax({
							url: this.distributeAPI + 'deliveryOrder/invoke',
							param: o,
							arr: true
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '拒绝成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this));
				this.searchTable();
			},
			dataCheckAndSolve() {
				this.dataCheckModalShow = true;
			},
			dataCheckModalClose() {
				this.searchTable();
				this.dataCheckModalShow = false;
			}
		}
	};
</script>