<template>
	<div>
		<div class="order-number-box clearfix">
			<div class="order-number-box-l">
				<span>订单号</span>
				<span class="order-number-txt">{{row.orderUmber}}</span>
			</div>
			<div class="order-number-box-r">
				<span>创建时间</span>
				<span>{{row.createdDate}}</span>
			</div>
		</div>
		<el-row :gutter="20">
<!-- 			<el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
				<imgItem :path="returnImgURL(row.orderitemList[0])" width="100%"></imgItem>
			</el-col> -->
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<div class="clearfix" style="height: 30px;line-height: 30px;padding-left: 5px;">
					<span class="pull-left">
						{{row.orderitemList[0] ? row.orderitemList[0].productName : ''}}
					</span>
					<!-- <span class="pull-right">
						{{row.orderitemList[0] ? _priceFormat(row.orderitemList[0].price) : ''}}
					</span> -->
					<!-- <span>规格</span> -->
					<span>({{row.orderitemList[0] ? row.orderitemList[0].skuName : ''}})</span>
					<span>等{{row.orderitemList.length}}件商品</span>
				</div>
				<!-- <div class="text-cont">
					<span>买家备注</span>
					<toolTip :content="row.orderitemList[0] ? row.orderitemList[0].comment : ''">
						<span>{{row.orderitemList[0] ? row.orderitemList[0].comment : ''}}</span>
					</toolTip>
				</div> -->
			</el-col>
<!-- 			<el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
				<div>
					<span>需求量</span>
					<span>{{row.orderitemList[0] ? row.orderitemList[0].quantity : ''}}</span>
				</div>
				<div>
					<span>分拣量</span>
					<span>{{row.orderitemList[0] ? row.orderitemList[0].sortingWeight : ''}}</span>
				</div>
				<div>
					<span>验收量</span>
					<span>{{row.orderitemList[0] ? row.orderitemList[0].inspectedWeight : ''}}</span>
				</div>
			</el-col>
			<el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
				<div>
					<span>需求金额(元)</span>
					<span>{{row.orderitemList[0] ? _priceFormat(row.orderitemList[0].itemTotal) : ''}}</span>
				</div>
				<div>
					<span>分拣金额(元)</span>
					<span>{{row.orderitemList[0] ? _priceFormat(row.orderitemList[0].sortingTotal) : ''}}</span>
				</div>
				<div>
					<span>验收金额(元)</span>
					<span>{{row.orderitemList[0] ? _priceFormat(row.orderitemList[0].inspectedTotal) : ''}}</span>
				</div>
			</el-col> -->
		</el-row>
		<div class="order-item-box-bottom">
			<el-row :gutter="20">
				<el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
					<span>合计</span>
				</el-col>
				<el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
					<span>需求总额(元)</span>
					<span>{{_priceFormat(row.orderTotal)}}</span>
				</el-col>
				<el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
					<span>分拣总额(元)</span>
					<span>{{_priceFormat(row.sortingOrderTotal)}}</span>
				</el-col>
				<el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
					<span>验收总额(元)</span>

					<span>{{_priceFormat(row.inspectedOrderTotal==null?0:row.inspectedOrderTotal)}}</span>
				<!-- {{row.sortingOrderTotal}} -->

				</el-col>
				<el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" v-if="row.distributionType!='0'">
					<span>订单配送金额(元)</span>
				{{row.shippingTotal==null?0:row.shippingTotal}}
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		props: {
			row: {
				default: function() {
                    return {}
                }
			},
		},
		methods: {
			returnImgURL(rowItem) {
				if(rowItem) {
					if(rowItem.productPicUrl) {
						return rowItem.productPicUrl
					}else {
						return rowItem.skuPicUrl
					}
				}else {
					return ''
				}
			}
		}
	}
</script>
