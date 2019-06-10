<template>
	<el-dialog custom-class="jz-modal dataCheck-modal" title="系统重复数据校验及详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-collapse v-model="activeNames">
		  	<el-collapse-item  name="1">
		  		<template slot="title">
			     	送货单重复数据--{{dataListCount1}}条
			    </template>
			    <iconBtn iconClass="el-icon-setting" content="批量处理" @click="solveRepeatData" type="success">批量处理</iconBtn>
			    <el-table :data="dataList1" style="width: 100%">
      				<el-table-column prop="orderUmber" label="订单号" width="180"></el-table-column>
      				<el-table-column prop="sellerName" label="供应商名称" width="380"></el-table-column>
      				<el-table-column prop="buyerName" label="采购商名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="2">
			    <template slot="title">
			     	订单数据推送配送数据异常--{{dataListCount2}}条
			    </template>
			    <iconBtn iconClass="el-icon-setting" content="批量处理" @click="solveSynData" type="success">批量处理</iconBtn>
			    <el-table :data="dataList2" style="width: 100%">
      				<el-table-column prop="orderUmber" label="订单号" width="180"></el-table-column>
      				<el-table-column prop="sellerName" label="供应商名称" width="380"></el-table-column>
      				<el-table-column prop="buyerName" label="采购商名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		</el-collapse>
	</el-dialog>
</template>
<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	var user = local.get('sessionUser');
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				dataList1:[],
				dataListCount1:0,
				dataList2:[],
				dataListCount2:0,
			}
		},
		props: {
			modal: {
				default: false,
			},
		},
		mounted() {
			this.checkDeliveryOrderRepeat();
			this.checkNoSynDeliveryOrder();
		},
		methods: {
			checkDeliveryOrderRepeat() {
				this._ajax({url: this.distributeAPI + 'deliveryOrder/checkDeliveryOrderRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	console.info(d)
                	this.dataList1 = d.aaData;
            		this.dataListCount1 = d.aaData.length
                }).bind(this))
			},
			checkNoSynDeliveryOrder() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkNoSynDeliveryOrder', param: {
					'distributorId' : user.typeCode
				}, loading: 'dataLoading'})
                .then((function(d) { 
                	console.info(d)
                	this.dataList2 = d.aaData;
            		this.dataListCount2 = d.aaData.length
                }).bind(this))
			},
			solveSynData() {
				if(this.dataList2.length == 0) {
					this.$message({type: 'info', message: "没有未同步数据"})
					return
				}
				this._ajax({url: this.rootAPI + 'commonDataCheck/solveNoSynDeliver', param: {
					orderList : JSON.stringify(this.dataList2),
					distributorId : user.typeCode,
				}, loading: 'dataLoading'})
                .then((function(d) { 
                	if(d.state == 0) {
                		this.$message({type: 'success', message: '同步成功！'})
                		this.dataList2 = [];
                		this.dataListCount2 = 0;
                		this.checkNoSynDeliveryOrder();
                	} else {
                		this.$message({type: 'info', message: d.msg})
                	}
                }).bind(this))
                this.$message({type: 'info', message: '正在同步数据，请暂时不要进行其他操作！'})
			},
			solveRepeatData() {
				if(this.dataList1.length == 0) {
					this.$message({type: 'info', message: "没有需要处理的数据"})
					return
				}
				let orderNumList = []
				this.dataList1.forEach(v=>{
				    orderNumList.push(v.orderUmber)
				});
				this._ajax({url: this.distributeAPI + 'deliveryOrder/solveRepeatData', param: {
					orderNumList : orderNumList
				}, loading: 'dataLoading', arr: true})
                .then((function(d) { 
                	if(d.state == 0) {
                		this.$message({type: 'success', message: '处理成功！'})
                		this.dataList1 = [];
                		this.dataListCount1 = 0;
                		this.checkDeliveryOrderRepeat();
                	} else {
                		this.$message({type: 'info', message: d.msg})
                	}
                }).bind(this))
			},
			beforeClose() {
				this.$emit('close');
			}
		}
	}
</script>
<style lang="sass">
	
</style>