<template>
	<el-button :type="type" @click="click" :size="size" :icon="iconClass" @click.ctrl.exact="ctrlClick">
		<slot></slot>
	</el-button>
</template>
<script>
	export default {
		name: 'elBtn',
		props: {
			text: {
				default: ''
			},
			size: {
				default: 'mini',
			},
			type: {
				default: '',
			},
			iconClass: {
				default: ''
			}
		},
		methods: {
			click() {
				this.$emit('click')
			},
			ctrlClick() {
				this.$emit('ctrlClick')
			}
		}
	}
</script>