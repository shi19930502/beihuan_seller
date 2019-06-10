<template>
	<el-dialog custom-class="jz-modal" :close-on-click-modal="false"  :modal="false" width="1270px" title="待配送订单详情" :visible="modal" :before-close='beforeClose'>
        <el-form class="modal-form" v-if="modal" :model="form"  :inline="true"  label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="订单号">
						<inputItem :disabled='formDisabled' :value.sync='form.orderUmber'></inputItem>	
			    	</el-form-item>
			   </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="采购商名称">
						<inputItem :disabled='formDisabled' :value.sync='form.buyerName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="订单金额">
						<inputItem :disabled='formDisabled' :value.sync="form.orderTotal+'元'"></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="分拣金额" >
						<inputItem :disabled='formDisabled' :v-if="form.sortingOrderTotal != null" :value.sync="form.sortingOrderTotal ? form.sortingOrderTotal+'元':form.sortingOrderTotal"></inputItem>
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="预计配送时间">
						<inputItem :disabled='formDisabled' :value.sync='form.distributionTimeBegin'></inputItem>	
			    	</el-form-item>
			    </el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
			    	<el-form-item label="备注">
						<inputItem type='textarea' :disabled='formDisabled' :value.sync='form.comment'></inputItem>	
			    	</el-form-item>
			   </el-col>
			</el-row>
		</el-form>
		<elemTable 
			:dataList="dataList" 
			@sizeChange='handleSizeChange' 
			@currentChange='handleCurrentChange' 
			:currentPage='pagNum' 
			:pageSizes='pageSizes' 
			:pageSize='pageSize' 
			:pageTotal='pageTotal' >
			<el-table-column show-overflow-tooltip property="productName" label="商品名称" min-width="150"></el-table-column>
			<el-table-column show-overflow-tooltip property="skuName" label="规格" min-width="60"></el-table-column>
			<el-table-column show-overflow-tooltip property="oriPrice" label="基本价格" min-width="90">
		      	<template slot-scope="scope">
		    		<span>{{_priceFormat(scope.row.oriPrice)+' 元/'+scope.row.baseMeasureName}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="price" label="实际价格" min-width="100">
				<template slot-scope="scope">
		    		<span>{{_priceFormat(scope.row.price)+' 元/'+scope.row.skuMeasureName}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="quantity" label="需求量" min-width="100">
				<template slot-scope="scope">
		    		<span v-if="scope.row.quantity != null">{{scope.row.quantity+' '+scope.row.skuMeasureName}}</span>
		      </template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="itemTotal" label="需求金额" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.itemTotal != null">{{_priceFormat(scope.row.itemTotal)+' 元'}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="sortingWeight" label="分拣量" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.sortingWeight != null">{{scope.row.sortingWeight+' '+scope.row.baseMeasureName}}</span>
		      </template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="sortingTotal" label="分拣金额" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.sortingTotal != null">{{_priceFormat(scope.row.sortingTotal)+' 元'}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="batchId" label="批次号" min-width="90"></el-table-column>
			<el-table-column show-overflow-tooltip property="suyuanCode" label="溯源码" min-width="120"></el-table-column>
			<el-table-column show-overflow-tooltip property="comment" label="备注" min-width="150"></el-table-column>
		</elemTable>
	</el-dialog>
</template>

<script>
import mixin from '../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	props:{
		modal:{
			default:false,
		},
		tableRow:{
			default:function(){
				return {}
			},
		}
	},
	data(){
		return{
			dataList:[],
			formDisabled:true,
			form:{},
		}
	},
	mounted(){
		Object.assign(this.form, this.tableRow)
 		Object.assign(this.form, {
            orderTotal: this._priceFormat(this.form.orderTotal),
            sortingOrderTotal: this._priceFormat(this.form.sortingOrderTotal),
            inspectedOrderTotal: this._priceFormat(this.form.inspectedOrderTotal)
        })
		this.searchTable();	
	},
	methods:{
		searchTable(){
			this._ajax({url:this.
				tootAPI,name:'orderitem/list',
				param:{orderId: this.form.id}
			}).then(this.renderTable)
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
	},
}
</script>