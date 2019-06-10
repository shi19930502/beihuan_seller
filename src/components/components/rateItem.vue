<template>
	<el-rate :value="value" :max="max" :allow-half="allowHalf" :disabled="disabled" :show-text="showText" :show-score="showScore" @input="change"></el-rate>
</template>
<script>
	export default {
		name: 'rateItem',
		props: {
			value: {
				default: null,
			},
			max: {
				default: 5
			},
			allowHalf: {
				default: false
			},
			showText: {
				default: false
			},
			disabled: {
				default: false
			},
			showScore: {
				default: false
			}
		},
		methods: {
			change(value) {
				this.$emit('update:value', value)
			},			
		}
	}
</script>