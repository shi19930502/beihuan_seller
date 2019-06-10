<template>
	<el-dialog custom-class="jz-modal" title="请选择商圈" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>

				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="所属商圈" prop="traCode">
						<searchInputItem >
							<selectInput :clearable='true' :value.sync="form.traCode">
								<el-option v-for="item in dataDic.tradingAreaList" :key="item.code" :label="item.name" :value="item.code">
								</el-option>
							</selectInput>
						</searchInputItem>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel">取消</elBtn>
			<elBtn @click="submit" type="primary">提交</elBtn>
		</div>
	</el-dialog>
</template>
<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	import configs from '../../configs.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				form: {
					traCode: ''
				},
				dataDic: {
					tradingAreaList: []
				},
				customerId: '',
				rules: {
					traCode: [{
						required: true,
						message: '所属商圈不能为空',
						tigger: 'change'
					}]
				},
				flag: true
			}
		},
		props: {
			modal: {
				default: false
			},
			ids: {
				default: function() {
					return {}
				},
			}

		},
		mounted() {
			let user = local.get('sessionUser');
			this.customerId = parseInt(user.typeCode);
			//初始化商圈列表
			this._ajax({
					url: this.rootAPI + 'tradingarea/tradingAreaList',
					param: {
						customerId: this.customerId
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
		methods: {
			cancel() {
				this.$emit('close')
			},
			submit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var o = {
							traCode: this.form.traCode,
							typeCode: this.customerId,
							ids: this.ids,
						}
						var vm = this;
						this.$emit('add', o);
						this.cancel();
					}
				})
			},
			beforeClose(done) {
				this.cancel()
				done()
			}
		}
	}
</script>