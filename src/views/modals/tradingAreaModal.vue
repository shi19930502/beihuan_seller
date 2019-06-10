<template>
	<el-dialog custom-class="jz-modal" :title="tradingAreaModalType === 'add' ? '新增商圈' : '商圈编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="商圈名称" prop="name">
						<inputItem :value.sync="form.name" :maxlength="20" @blur="nameCilek"></inputItem>
						<span :style="{float:left,color:msgColor}">{{msg}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="区域范围" prop="comment">
						<inputItem :value.sync="form.comment" :maxlength="200" type="textarea"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel">取消</elBtn>
			<elBtn @click="submit" type="primary" :disabled="none">提交</elBtn>
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
					comment: '',
					name: '',
					customerId: ''
				},
				dataDic: {
					tradingAreaList: []
				},
				typeCode: '',
				msgColor:'red',
				textLeft:'right',
				msg:'',
				none:false,
				name:'',
				rules: {
					name: [{
						required: true,
						message: '名字不能为空'
					}, this._ruleLength(20)],
					comment: [{
						required: true,
						message: '区域范围不能为空'
					}, this._ruleLength(200)]
				},
				flag: true
			}
		},
		props: {
			modal: {
				default: false
			},
			tableRow: {
				default: function() {
					return {}
				},
			},
			tradingAreaModalType: {
				default: 'add'
			},
		},
		mounted() {
			if(this.tableRow != null) {
				this.form = this.tableRow;
				this.name = this.tableRow.name;
			}
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			submit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let user = local.get('sessionUser');
						this.form.customerId = parseInt((user.typeCode));
						var o = {
							name: this.form.name,
							comment: this.form.comment,
							id: this.tableRow.id,
							customerId: this.form.customerId,
							code: this.tableRow.code
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
			},
			nameCilek() {
				if(this.tableRow.name == this.name || this.form.name == '' || this.form.name == null){
					this.none = false;
					return;
				}
				this._ajax({
					url: this.rootAPI,
					name: 'tradingarea/cilekName',
					param: {
						name:this.form.name
					},
					loading: 'dataLoading'
				}).then((function(d) {
					if(d.state != 0 ){
							this.msgColor = 'red';
							this.msg="该商圈名已存在,请重新命名"
							this.none =true;
						}else{
							this.msg="";
							this.none = false;
						}
				}).bind(this));
			}
		}
	}
</script>