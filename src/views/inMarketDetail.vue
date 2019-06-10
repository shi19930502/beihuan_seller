<template>
	<div><br/>
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name='车牌号'>
				<inputItem :value.sync="searchForm.transporterId" @enter="searchTable" placeHolder="请输入车牌号"></inputItem>
			</searchInputItem>
			<searchInputItem name="渠道" v-if="!isChannel">
				<cascaderItem :options="channelSearchList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
			<!-- <searchInputItem name='商品名称'>
				<inputItem :value.sync="searchForm.goodsCode" @enter="searchTable" placeHolder="请输入商品名称"></inputItem>
			</searchInputItem> -->
			<!-- <searchInputItem name="商品名称">
				<selectInput :value.sync="searchForm.goodsCode" @selectChange="searchTable">
					<el-option v-for="item in dataDic.goodsList" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</selectInput>
			</searchInputItem> -->
			<searchInputItem name="进场时间区间">
				<dateEditorDaterange :dateValue.sync='inDate'>
				</dateeditordaterange>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="add" type="success">新增</iconBtn>
					<iconBtn iconClass="el-icon-check" content="补录" @click="record" type="success">补录</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
				</el-button-group>
			</template>
		</optionItems>

		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="inDate" label="进场时间">
				<template slot-scope="scope">
					<span>{{scope.row.inDate}}</span>
				</template>
			</el-table-column>
				<el-table-column prop="channelName" label="渠道信息">
				<template slot-scope="scope">
					<span>{{scope.row.channelName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="tranId" label="交易凭证号">
				<template slot-scope="scope">
					<span>{{scope.row.tranId}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="animalQuarantineId" label="动物产品检疫合格证号">
				<template slot-scope="scope">
					<span>{{scope.row.animalQuarantineId}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="meatInspectionId" label="肉类检疫合格证号">
				<template slot-scope="scope">
					<span>{{scope.row.meatInspectionId}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="provId" label="产地证明号">
				<template slot-scope="scope">
					<span>{{scope.row.provId}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="vegInspectionId" label="检测合格证号">
				<template slot-scope="scope">
					<span>{{scope.row.vegInspectionId}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="transporterId" label="运输车牌号">
				<template slot-scope="scope">
					<span>{{scope.row.transporterId}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="statusName" label="进场状态">
				<template slot-scope="scope">
					<span>{{scope.row.statusName}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="185">
				<template slot-scope="scope">
					<optionItems v-if="isCode" style="position: absolute;right:0;top:-7px">
						<template slot="right">
							<el-popover placement="right" width="275" trigger="click" @show="getQRcode(scope.row)">
								<template>
									<qriously :value="initQCode" :size="250" />
									<iconBtn content="打印二维码" @click="printQRCode(scope.row)">打印二维码</iconBtn>
								</template>
								<img slot="reference" src="../../lib/img/qr_code.jpg" width="35px" height="35px"></img>
							</el-popover>
						</template>
					</optionItems>
					<el-button-group>
						<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
						<iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="scope.row.sourceId === null && scope.row.statusId < 1"></iconBtn>
						<iconBtn iconClass="el-icon-plus" content="快速新建" @click="fastAdd(scope.row)"></iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<inMarketDetailModal :modal="modalShow" :inMarketDetailModalType="modalType" :extendModalType='extendType' v-if="modalShow" @submit="modalSubmit" @close='modalClose' :tableRow='tableRow'></inMarketDetailModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' // 公共方法，包括主要的ajax
	import inMarketDetailModal from './modals/inMarketDetailModal.vue'
	import configs from '../configs.js'
	export default {
		mixins: [mixin],
		components: {
			inMarketDetailModal
		},
		data() {
			return {
				searchForm: {
					wholesalerId: '',
					goodsCode: '',
					startTime: '',
					endTime: '',
					channelCode: '',
					batchId: '',
					transporterId: '',
				},
				// dataDic: {
				// 	goodsList: []
				// },
				inDate: [],
				dataList: [],
				inMarketDetailModal: false,
				tableRow: {},
				inMarketDetailModalType: 'add',
				extendType: "",
				channelCode: '',
				isChannel: '',
				channelList: [],
				loginName: '',
				channelName: [],
				channelSearchList: [],
				initQCode: '',
				isCode: false,
				extendId:'',
			}
		},
		mounted() {
			this.getInitData().then(this.searchTable);
		},
		methods: {
			printQRCode(row) {
				var printHtml = `
        			<div style="position: center;height: 30px;line-height: 30px;font-size: 40px;">
        			<br/>
                    <span style="width: 80%;display: inline-block;left:0;">供应商:${row.wholesalerName}</span>
                    <br/>
                    <br/>
                    <span style="width: 80%;display: inline-block;left:0">车牌号:${row.transporterId}</span>
		            </div>`;
				if(typeof LODOP === 'undefined') {
					this.$message({
						showClose: true,
						duration: 0,
						dangerouslyUseHTMLString: true,
						message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
					});
				} else {
					LODOP.PRINT_INIT("");
					LODOP.ADD_PRINT_HTM('6%', '15%', '95%', '100%', printHtml, )
					LODOP.ADD_PRINT_BARCODE('28%', "15%", 600, 600, "QRCode", this.initQCode);
					LODOP.PRINT()
				}
			},
			getQRcode(row) {
				var vm = this;
				var name = ""
				if(this.extendId=='001'||this.extendId=='007'){
					name='fLogin_first'
				}else if(this.extendId=='002'||this.extendId=='004'||this.extendId=='008') {
					name = 'fLogin_second'
					if(this.extendId=='004'){
						name = 'mLogin_second'
					}
				}
				var urlParams = name + "_" + local.get('sessionUser').typeCode +'_'+row.id
				if(configs.quickLogin) {
					this.initQCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri=" + configs.wxUrl + "&response_type=code&scope=snsapi_base&state=" + urlParams + "#wechat_redirect"
				} else {
					this.initQCode = configs.wxUrl + "?code=081H2kqP1CRtO11HO6sP1JHZpP1H2kqv&state=" + urlParams + "#/qr_index"
				}
//				this._ajax({
//					url: this.tootAPI,
//					name: 'inmarketmain/getQRCode',
//					param: {
//						id: row.id
//					}
//				}).then((d) => {
//					let data = d.aaData
//					vm.initQCode = data.qrCodeUrl;
//				})
			},
			getInitData() {
				let user = local.get('sessionUser');
				var vm = this;
				this._ajax({
					url: this.tootAPI,
					name: 'customer/list',
					param: {
						id: user.typeCode || 0
					}
				}).then((d) => {
					let data = d.aaData
					//可以反起判断，
					if(data[0].extend == "001"||data[0].extend == "002"||data[0].extend == "004"||data[0].extend == "007" || data[0].extend == "008" ) {
						this.extendId=data[0].extend 
						vm.isCode = true
					}
				})

				this._ajax({
						url: this.rootAPI,
						name: 'channel/listByParent',
						param: {
							parentChannelCode: ''
						}
					})
					.then((function(d) {
						this.channelSearchList = d.aaData
					}).bind(this))
				//查询进场表附表中自己渠道下所有商品名称和商品编码
				// this._ajax({
				// 		url: this.rootAPI + 'inmarketdetail/goodsList',
				// 		param: {},
				// 		arr: true
				// 	})
				// 	.then((function(d) {
				// 		let data = d.aaData;
				// 		Object.assign(this.dataDic, {
				// 			goodsList: data
				// 		});
				// 	}).bind(this))

				return this._ajax({
						name: 'channel/list',
						param: {
							level: 3
						}
					})
					.then((function(d) {
						Object.assign(this.channelList, d.aaData)
					}).bind(this))

			},
			channelChange(val) {
				if(val.length > 0) {
					Object.assign(this.searchForm, {
						channelCode: val[val.length - 1]
					})
				} else {
					Object.assign(this.searchForm, {
						channelCode: ''
					})
				}
				// this.searchTable()
			},
			renderDic(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.key == dicKey) {
						dicShow = obj.value;
					}
				});
				return dicShow;
			},
			searchTable() {
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				let typeId = user.typeId;
				if(this.loginName == 'admin' || typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					this.isChannel = true;
				}
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.inDate[0],
					endTime: this.inDate[1]
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'inmarketmain/baseList',
					param: param,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				this.inDate = [];
				Object.assign(this.searchForm, {
					wholesalerId: '',
					goodsCode: '',
					startTime: '',
					endTime: '',
					channelCode: '',
					batchId: '',
					transporterId: ''
				})
				this.handleCurrentChange(1)
				this.channelName = []
			},
			dele() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: 'info',
						message: '请选择行'
					});
				} else {
					let selection = this.delSelection
					this.confirm('确定删除？', (function() {
						var arr = [],
							o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						o.id = arr
						o.deleted = 1
						this._ajax({
								url: this.rootAPI + 'inmarketmain/delete',
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
				}
			},
			inMarketDetailModalClose() {
				this.inMarketDetailModal = false;
			},
			lookOver(row) {
				this.tableRow = row;
				this.modalCheck();
			},
			edit(row) {
				if(null != row.sourceId) {
					this.$message({
						type: 'warning',
						message: '不可编辑,该数据为同步数据'
					});
					return;
				}
				this.tableRow = row;
				this.modalEdit();
				this.extendType = "";
			},
			record(row) {
				this.tableRow = null;
				this.modalAdd();
				this.extendType = "record";
			},
			fastAdd(row) {
				this.tableRow = row;
				this.modalEdit();
				this.extendType = "fastAdd";
			},
			add(row) {
				this.tableRow = null;
				this.modalAdd();
				this.extendType = "";
			}
		}
	}
</script>