<template>
	<div class="page-khNolice">
		<div class="toubu_B">
			<span class="tliel_name">
				<searchInputItems>
			<searchInputItem name="商圈名称">
				<selectInput :clearable='true' :value.sync="searchForm.code" @selectChange="searchTable">
					<el-option v-for="item in dataDic.tradingAreaList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
			</span>

			<span class="addanniu">
				<iconBtn iconClass="el-icon-plus" content="新增" @click="addOver" type="success">新增</iconBtn>
			</span>
		</div>
		<!--商圈展示div-->
		<div v-for="(item,i) in dataDic.dataList" class="shangquan_zuiwaiceng">
			<div class="shangquan_ciwaiceng">
				<div class="tubian_quyu">
					<img src="../../lib/img/shangquan_beijing.png" />
					<div class="beijing_yanse" :style="{background:item.color}">
						<div class="mingzi">
							<font size="6">{{item.name}}</font>
						</div>
					</div>
				</div>
				<div class="mingzi_neirong">
					<span class="neirong">{{item.name}}</span>
					<el-tooltip v-if="item.comment.length>70" class="item" effect="dark" :content=item.comment placement="top-start">
				      <p class="comment">商圈范围：{{item.comment}}</p>
				    </el-tooltip>
				    <p v-else class="comment">商圈范围：{{item.comment}}</p>					
				</div>
				<div class="anniu">
					<span>
						<el-button type="primary" @click="lookOver(item)">&nbsp;&nbsp;修改&nbsp;&nbsp;</el-button>
					</span>
					<span class="shanchu">
						<el-button type="danger"  @click="delRow(item)" >&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
					</span>
				</div>
			</div>
		</div>
		<tradingAreaModal :modal='tradingAreaModal' :tradingAreaModalType="modalType" @add='modalAdd' :dataDic="dataDic" v-if='tradingAreaModal' @close='tradingAreaModalClose' :tableRow='tableRow'></tradingAreaModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import tradingAreaModal from './modals/tradingAreaModal.vue'
	export default {
		mixins: [mixin],
		components: {
			tradingAreaModal
		},
		data() {
			return {
				searchForm: {
					code: '',
					customerId: ''
				},
				dataDic: {
					tradingAreaList: [],
					dataList: []
				},
				dataList: [],
				modalShow: false,
				islookup: false,
				tradingAreaModal: false,
				modalType: '',
				colors: ["#2181d0 !important", "OrangeRed !important", "#f09d02 !important", "Crimson !important", "#2abfd7 !important"], //颜色数组
			}
		},
		mounted() {
			this.getInitData();
			this.searchTable();
		},
		methods: {
			modalAdd(o) {
				this._ajax({
					url: this.rootAPI + "tradingarea/addOrUpdate",
					param: o,
					arr: true
				}).then((function(d) {
					if(d.state == 0) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
					} else if(d.state == 2) {
						this.$message({
							type: 'warning',
							message: d.msg
						});
					} else if(d.state == 50) {
						this.$message({
							type: 'warning',
							message: d.msg
						});
					} else {
						this.$message({
							type: 'failure',
							message: '操作失败'
						});
					}
					this.$emit('submit')
				}).bind(this)).then(this.searchTable).then(this.getInitData)
			},
			getInitData() {
				let user = local.get('sessionUser');
				this.searchForm.customerId = parseInt((user.typeCode));
				//初始化商圈列表
				this._ajax({
						url: this.rootAPI + 'tradingarea/tradingAreaList',
						param: {
							customerId: this.searchForm.customerId
						},
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						Object.assign(this.dataDic, {
							tradingAreaList: data
						})
					}).bind(this));
			},
			searchTable() {
				let user = local.get('sessionUser');
				this.searchForm.customerId = parseInt((user.typeCode));
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				this._ajax({
					url: this.rootAPI,
					name: 'tradingarea/list',
					param: this.searchForm,
					loading: 'dataLoading',
				}).then((function(d) {
					let data = d.aaData;
					//下面循环渲染div背景颜色
					for(var i = 0; i < data.length; i++) {
						let index = i % 5;
						data[i].color = this.colors[index];
					}
					Object.assign(this.dataDic, {
						dataList: data
					})
				}).bind(this));
			},
			reset() {
				Object.assign(this.searchForm, {
					name: '',
					telephone: '',
					traCode: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			tradingAreaModalClose() {
				this.tradingAreaModal = false;
				this.searchTable();
			},
			lookOver(row) {
				this.tableRow = row;
				this.modalType = 'other';
				this.tradingAreaModal = true;
			},
			delRow(row) {
				this.confirm('确定删除？ 删除前请检查该商圈是否还有客户关联!', (function() {
					var o = {
						id: row.id
					}
					this._ajax({
							url: this.rootAPI + 'tradingarea/delete',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '删除成功'
								});
							} else {
								this.$message({
									type: 'warning',
									message: '当前商圈还有关联的客户,请重新设置客户商圈后再删除！'
								});
							}
							this.handleCurrentChange(1);
							this.getInitData();
						}).bind(this))
				}).bind(this))
			},
			addOver() {
				this.modalType = 'add';
				this.tableRow = {};
				this.tradingAreaModal = true;
			},
			bg() {
				this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
			}
		}
	}
</script>
<style lang="sass">
	.page-khNolice {
		.toubu_B {
			height: 45px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
		.shangquan_zuiwaiceng {
			float: left;
			margin: 20px;
			.shangquan_ciwaiceng {
				width: 377px;
				height: 451px;
				border: 1px solid #727B84;
				.tubian_quyu {
					width: 376px;
					height: 251px;
					img {
						width: 376px;
						position: absolute;
					}
					.beijing_yanse {
						width: 376px;
						position: absolute;
						height: 251px;
						float: left;
						color: #FFFFFF;
						/*background-color:#2abfd7;*/
						opacity: 0.9;
						.mingzi {
							text-align: center;
							margin-top: 25%;
						}
					}
				}
				.mingzi_neirong {
					width: 376px;
					height: 122px;
					padding: 10px;
					.neirong {
						line-height: 10px;
						font-size: 20px;
					}
				}
				.anniu {
					width: 376px;
					height: 77px;
					padding: 10px;
					.shanchu {
						float: right;
					}
				}
			}
		}
		/*.shangquan_zuiwaiceng:nth-child(2n){
       		.beijing_yanse{
       			background: #2181d0 !important;
       		}
       }
       .shangquan_zuiwaiceng:nth-child(3n){
       		.beijing_yanse{
       			background: OrangeRed !important;
       		}
       }
       .shangquan_zuiwaiceng:nth-child(4n){
       		.beijing_yanse{
       			background: #f09d02 !important;
       		}
       }
       .shangquan_zuiwaiceng:nth-child(5n-1){
       		.beijing_yanse{
       			background: Crimson !important;
       		}
       }*/
      
		.comment{
		    overflow: hidden;
		    -webkit-line-clamp: 3;
		    text-overflow: ellipsis;
		    display: -webkit-box;
		    -webkit-box-orient: vertical;
		}
	}
</style>