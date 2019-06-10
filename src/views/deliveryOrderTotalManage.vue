<template>
	<div>
		<searchInputItems>
			<searchInputItem name="采购商">
				<inputItem :value.sync="searchForm.buyerName"></inputItem>
			</searchInputItem>
			<searchInputItem name="预计配送时间">
				<dateEditorDaterange type="date" :showShortcuts="showShortcuts" :dateValue.sync="distributionTimeBegin"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-printer" content="批量打印送货单" @click="batchPrint" type="warning">批量打印送货单</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<!-- <iconBtn iconClass="el-icon-sort" content="获取订单" @click="syncOrder">获取订单</iconBtn> -->
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<!--<el-table-column prop="orderUmber" label="订单编号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>-->
			<el-table-column prop="distributionTimeBegin" label="预计配送时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributionTimeBegin">
						<div>{{scope.row.distributionTimeBegin}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="channelName" label="渠道">
				<template slot-scope="scope">
					<toolTip :content="scope.row.channelName">
						<div>{{scope.row.channelName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="buyerName" label="采购商名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<div>{{scope.row.buyerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="shippingAdd" label="配送地址">
				<template slot-scope="scope">
					<toolTip :content="scope.row.shippingAdd">
						<div>{{scope.row.shippingAdd}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderCount" label="订单数">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderCount">
						<div>{{scope.row.orderCount}}</div>
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
			<!--<el-table-column prop="buyerBusinessNo" label="商圈序号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerBusinessNo">
						<div>{{scope.row.buyerBusinessNo}}</div>
					</toolTip>
				</template>
			</el-table-column>-->
			<!--<el-table-column prop="createdDate" label="创建时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<div>{{scope.row.createdDate}}</div>
					</toolTip>
				</template>
			</el-table-column>-->
			<el-table-column label="操作" >
				<template slot-scope="scope">
					<!--<iconBtn content="确认受理" v-if="scope.row.status!=1" @click="updateStatusToOne(scope.row)" type="primary" plain>确认受理</iconBtn>
					<iconBtn content="拒绝" v-if="scope.row.status!=1" @click="invoke(scope.row)" type="info" plain>拒绝</iconBtn>-->
					<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
					<iconBtn iconClass="el-icon-printer" content="打印送货单" @click="printRow(scope.row)"></iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<deliveryorderTotalModal :modal='showModal' v-if='showModal' @close='ModalClose' :tableRow='tableRow'></deliveryorderTotalModal>
		<div id="printtemp"></div>
	</div>
</template>
<script>
	import local from "../local.js";
	import mixin from "../mixin/mixin.js";
	// import "../../lib/printplugin/LodopFuncs.js";
	// import "../../lib/printplugin/lodopPrinter.js";
	import deliveryorderTotalModal from "./modals/deliveryorderTotalModal.vue";
	export default {
		mixins: [mixin],
		components: {
			deliveryorderTotalModal
		},
		data() {
			return {
				dataList: [],
				searchForm: {
					buyerName: "",
					distributorId:'',
					distributionTimeBegin:''
				},
				showModal: false,
				lodop: "",
				showShortcuts:false,
				distributionTimeBegin:'',
				orderDetils:[],
				distributorName:''
			};
		},
		mounted() {
			this.searchTable();
			this.lodop = new lodopPrinter();
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				//console.log(this.dateRange.length);
				/*if(this.dateRange.length == 0) {
					this.dateRange[0] = this.getToday;
					this.dateRange[1] = this.getBeforeDay_7;
				}*/
				/**customerid  需要从缓存中获取 */
				this.searchForm.distributorId = parseInt(user.typeCode);
				/*if(this.dateRange && this.dateRange.length > 0) {
					this.searchForm.startTime = this.dateRange[0];
					this.searchForm.endTime = this.dateRange[1];
				}*/
				//let time = this.formatDateTime(this.searchForm.distributionTimeBegin);
				if(this.distributionTimeBegin == '') {
					this.distributionTimeBegin = this.getToday;
				}
				
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-"),
					//orderField:'f_status'
				});
				return this._ajax({
					url: this.distributeAPI + "deliveryOrder/baseList",
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
						var vm = this;
					selection.forEach(function(el) {
						vm.printRow(el);
					});
				}
			},
			printRow(o) {
				var ob = {
					buyerId: o.buyerId,
					distributorId:o.distributorId,
					distributionTimeBegin:o.distributionTimeBegin
				};
				this.print(ob);
			},
			print(o) {
				//let distributorName;
				var vm = this;
				this._ajax({
					url: this.rootAPI + "customer/list",
					name: "",
					param: {
						id:o.distributorId
					},
					loading: "dataLoading"
				}).then((function(d) {
					vm.distributorName = d.aaData[0].name
				}))
				this._ajax({
					url: this.distributeAPI + "deliveryOrder/getDeliveryOrderTotal",
					name: "",
					param: o,
					loading: "dataLoading"
				}).then((function(d) {
					if(d.state == 0 && d.aaData && Array.isArray(d.aaData.orderInfos) && d.aaData.orderInfos.length > 0) {
						vm.orderDetils=d.aaData.orderDetils
						var totalItem = 0;
						d.aaData.orderInfos.forEach((function(em, index) {
							var printHtml = '';
							var itemHTML = '';
							var moneyTotle = 0;
							d.aaData.orderDetils.forEach((function(em1, index) {
								totalItem++;
								let _index = index + 1;
								let productName = em1.productName || '';
								let sellerName = em1.sellerName || '';
								let orderUmber = em1.orderUmber || '';
								let skuName = em1.skuName || '';
								let sortWeight = em1.sortWeight || '';
								let oriPrice = (Math.round(em1.sortitemTotal*100/em1.sortWeight)/100).toFixed(2) || '';
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
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sellerName}</td>
                                                <td style="text-align: center; border: solid 1px black;word-break:break-word;">${orderUmber}</td>
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
							if(vm.orderDetils && vm.orderDetils.length > 0) { 
								orderDetilsLength = vm.orderDetils.length + 1;
							}
							var orderTotal = em.orderTotal || '';
							var sortingOrderTotal = em.sortingOrderTotal || '';

							itemHTML += `
                                   <tr>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;">合计</td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;" ></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                       <td style="text-align: center; border: solid 1px black;word-break:break-word;" colspan="2">${sortingOrderTotal}</td>
                                   </tr>
                                   `;

							var orderCount = em.orderCount || '';
							var phoneNumber = em.phonenumber || '';
							var address = em.shippingAdd || '';
							//var orderId = em.orderId || '';
							var buyerName = em.buyerName || '';
							var deliveryDate = em.deliveryDate || '';
							var sortOrderTotal = em.sortOrderTotal || '';
							//var orderDate = em.orderDate || '';
							var printDate = this.formatDateTime(new Date());
							var orderTotal = em.orderTotal || '';
							var contacts = em.receiver || '';
							var sellerName = vm.distributorName;
							var marketTitle = this.$store.state.marketTitle || ''
							var content = `
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 15px;margin:0px;padding:0">
                              <span>${marketTitle}(${sellerName})送货单</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                              <span style="position: absolute;left: 0;">配送时间: ${deliveryDate}</span>
                              <span style="position: absolute;right: 0;">订单数量: ${orderCount}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                              <span style="position: absolute;left: 0;">采购单位: ${buyerName}</span>
                              <span style="position: absolute;right: 0;">收货人/联系电话: ${contacts}/${phoneNumber}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                              <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                              <span style="position: absolute;right: 0;">打印时间: ${printDate}</span>
                          </div>
                      <table style="text-align: center; border-collapse: collapse; width: 100%; font-size:13px;">
                          <thead >
                              <tr>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">供应商名称</th>
                                  <th style="text-align: center; border: solid 1px black;word-break:break-word;">订单号</th>
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
		                        <span style="width: 30%;display: inline-block;">配送员: </span>
		                        <span style="width: 30%;display: inline-block;">验收人1: </span>
		                        <span style="width: 30%;display: inline-block;">验收人2: </span>                                        
		                    </div>`;
							printHtml += content;
							printHtml += footer;
							console.log(orderDetilsLength);
							this.lodopoPrint('6%', '5%', '95%', '100%', printHtml, orderDetilsLength)
							// this.lodopoPreview('6%', '5%', '95%', '100%', printHtml)
						}).bind(this))
					}
				}).bind(this))
			},
			reset() {
				Object.assign(this.searchForm, {
					buyerName: "",
					startTime: "",
					endTime: ""
				});
				this.dateRange = [];
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
		}
	};
</script>