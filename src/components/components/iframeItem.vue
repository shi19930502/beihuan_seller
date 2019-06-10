<template>
	<div>
		<iframe :src="src" :frameborder="frameborder" :width="width" :height="height" :scrolling="scrolling"></iframe>
	</div>	
</template>
<script>
	export default {
		name: 'iframeItem',
		props: {
			src: {
				default: ''
			},
			frameborder: {
				default: 0
			},
			width: {
				default: '100%'
			},
			height: {
				default: '100px'
			},
			scrolling: {
				default: 'auto'
			}
		},
	}
</script>