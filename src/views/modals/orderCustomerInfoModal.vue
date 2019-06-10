<template>
	<el-dialog custom-class="jz-modal" title="订单信息" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="140px">
        	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="row-block">
                    <el-form-item label="地址" prop="shippingAdd" >
                        <inputItem type="textarea" :value.sync="form.shippingAdd"></inputItem>
                    </el-form-item>
                </el-col>
           </el-row>
            <el-row>
            	<!--<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                	<el-form-item label="送货方式" prop="distributionType" >
                        <el-radio-group v-model="form.distributionType">
					      <el-radio-button label="0">次日配送</el-radio-button>
					      <el-radio-button label="1">当日配送</el-radio-button>
					    </el-radio-group>
                    </el-form-item>
                </el-col>-->
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                	<el-form-item label="送货时间" prop="payType" >
                		<selectInput :value.sync="form.selectDay" >
							<el-option
						      v-for="item in days"
						      :key="item"
						      :label="item"
						      :value="item">
						    </el-option>
						</selectInput>
						<selectInput :value.sync="form.selectTime" >
							<el-option
						      v-for="item in times"
						      :key="item"
						      :label="item"
						      :value="item">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                	<el-form-item label="支付方式" prop="payType" >
                        <el-radio-group v-model="form.payType">
					      <el-radio-button label="0">现金支付</el-radio-button>
					      <el-radio-button label="1">POS机刷卡</el-radio-button>
					      <el-radio-button label="2">微信支付</el-radio-button>
					      <el-radio-button label="3">支付宝支付</el-radio-button>
					    </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消">取消</elBtn>
            <elBtn @click="submit" text="提交" type="primary">提交</elBtn>
        </div>
    </el-dialog>
</template>

<script>/*distributionTimeBegin distributionTimeEnd*/
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	export default {
        mixins: [mixin],
        components: {},
		data() {
			return {
				form : {
					shippingAdd : '',
					shippingAddId : '',
					distributionType : '1',
					payType : 0,
					distributionTimeBegin : '',
					distributionTimeEnd : '',
					buyerId : '',
					buyerName : '',
					sellerId : '',
					sellerName : '',
					orderitems : '',
					selectDay : '',
					selectTime : '',
				},
				days : [],
				times : [],
			}
		},
		props: {
			modal: {
				default: false
			},
			createOrderInfo : {
                default: {}
            },
		},
		mounted() {
//			console.info(this.createOrderInfo)
			this._ajax({name: 'store/queryBySellerId', param: {sellerId: this.createOrderInfo.sellerId}})
			.then((function(d) {
				let data = d.aaData;
				let startFlag = 0;
				if(data.distributionToday == 0) {
					startFlag = 1
				}
				let days = []
				let nowTime = new Date();
				for(let i = 1; i <= data.period; i ++) {
					nowTime.setTime(nowTime.getTime()+(startFlag * 24*60*60*1000));
					let timeTemp = nowTime.getFullYear()+"-" + (nowTime.getMonth()+1) + "-" + nowTime.getDate();
					days.push(timeTemp);
				}
				this.days = days;
				let times = []
				for(let i = 0; i < data.distributionEnd - data.distributionStart; i ++) {
					let timeString = (data.distributionStart + i) + ":00:00-" + (data.distributionStart + i + 1) + ":00:00"
					times.push(timeString)
				}
				this.times = times;
			}).bind(this))
			Object.assign(this.form, this.createOrderInfo)
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			submit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                    	if(this.form.selectTime && this.form.selectDay) {
                    		let timeTemp = this.form.selectTime.split('-');
	                    	this.form.distributionTimeBegin = this.form.selectDay + " " + timeTemp[0]
	                    	this.form.distributionTimeEnd = this.form.selectDay + " " + timeTemp[1]
//	                    	console.info(this.form)
	                  		this.$emit('submit', this.form)
                    	} else {
                    		this.$message({type: 'warning', message: '请选择送货时间'});
                    	}
                    }
                })
			},
			beforeClose(done) {
                this.cancel()
                done()
            },
		}
	}
</script>
<style lang="sass">
    .jz-modal{
        .row-block{
        	width: 100%;
            .el-form-item__content {
                width: calc(100% - 150px);
                &>div{
                    width: 100%;
                }
            }            
        }
    }
</style>