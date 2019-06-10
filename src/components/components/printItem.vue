<template>
	<div :id="id" class="item-cant-see">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'printItem',
		data() {
			return {
			}
		},
		mounted() {
		},
		props: {
			id: {
				default: 'printItem'
			}
		},
	}
</script>