<template>
	<el-dialog custom-class="jz-modal order-item-modal" title="评价详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="75%">
		<el-form class="modal-form" v-if="modal" :model="form" :inline="true" label-width="160px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="订单号:">
						<inputItem :disabled='true' :value.sync='form.orderId'></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="订单简介:">
						<inputItem :disabled='true' :value.sync='form.orderSuggest'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="评价时间:">
						<inputItem :disabled='true' :value.sync='form.reviewDate' ></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="评价人:">
						<inputItem :disabled='true' :value.sync='form.reviewPersonName'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="评价内容:">
						<inputItem :disabled='true' :value.sync='form.reviewContent' type="textarea"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<div v-for="item in scoreList">
				<el-row  > 
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item :label="item.reviewName">
<!-- 							<el-rate v-model="item.score/20" disabled show-score text-color="#ff9900" :max="item.max"  score-template="{value}">
							</el-rate> -->
							<rateItem :value.sync='item.score/20' :max="item.max" :disabled="true" :showScore="true"></rateItem>
						</el-form-item>
					</el-col>
				</el-row>				
			</div>			
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">关闭</elBtn>
        </div>
	</el-dialog>
</template>
<script>
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
                form: {
                	orderId: '',
                	orderSuggest: '',
                	reviewDate: '',
                	reviewPersonName: '',
                	reviewContent: ''
                },
                scoreList: []
			}
		},
		props: {
			modal: {
				default: false,
			},
			params: {
				default: function() {
					return {}
				},
			}
		},
		mounted() {  
            this._ajax({
				name: 'orderitemreview/queryReviewAndScore',
				param: {
					orderId: this.params.orderId
				}
			}).then((d) => {
				if(d.aaData.length > 0) {
					Object.assign(this.form, d.aaData[0])
					this.scoreList = d.aaData[1];
				}else {
					this.$message({type: 'info', message: '暂无数据'})
					this.cancel()
				}				
			})
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
		}
	}
</script>