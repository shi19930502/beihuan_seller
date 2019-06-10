<template>
  <div class="page-app">
    <router-view></router-view>  
  </div>
</template>
<script>
export default {
	mounted() {		
		
	},
	watch:{
	    $route(to,from){
	        if (!to.matched.length) {
	            this.$router.push('/404');
	        }
	    }
    }
}
</script>
<style lang="sass">
	.page-app{
		height: 100%;
	}
</style>
