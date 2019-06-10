
<template>
	<div class="customerAnaly">
		<div id="selectAddr">
			<div   class="search_input">
				<input v-model='inputValue' @focus='inputFocus' class="input" type="text" name="keyword" id='keywordId' placeholder="搜索" />
				<div class="detaile_address_father">
					<div class="detaile_address" v-show='detaileAddress'>
						<span>所选地址为：{{detaileAddress}}</span>
						<p class="btn_span" >
							<span @click='btnSpan'>确&nbsp;定</span>
						</p>
					</div>
	
				</div>
			</div>
			<div class="map" :style='mapStyle' id='container'  ref='container'>
	
			</div>
			
			<div  class="addr_result" :style='addStyle' id="addrResult">
				
			</div>
		</div>
	</div>
</template>
<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js' //公共方法，包括主要的ajax
	var map, geolocation, toolBar, autocomplete,placeSearch;
	export default {
		mixins: [mixin],
		data(){
			return{
				inputValue:'',
				detaileAddress:'',
				cityName:'',
				getAddr:{},
				mapStyle:{
					height:'100%'
				},
				addStyle:{
					height:0
				},
			}
		},
		mounted(){	
			var vm=this
			map = new AMap.Map('container', {
				resizeEnable: true,
				zoom: 20,
				keyboardEnable: false
			});
			//关于定位偏移我记得好像跟那个key有关
			map.plugin('AMap.Geolocation', function() {
				console.log(1321)
				geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					timeout: 10000, //超过10秒后停止定位，默认：无穷大
					buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					buttonPosition: 'RB',
					useNative: true,
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', vm.onComplete); //返回定位信息
				AMap.event.addListener(geolocation, 'error', vm.onError); //返回定位出错信息
			
			});

			let activeName=this.$route.query.actiName;
			console.log(activeName)
		},
		methods:{
			searchInput(){
				var vm=this
				this.$nextTick(()=>{
					map.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'],function(){
						var auto = new AMap.Autocomplete({
							input:'keywordId',
							citylimit:true,
							city:vm.cityName
						});
					     placeSearch = new AMap.PlaceSearch({
					        map: map,
					        pageSize: 5,
				            pageIndex: 1,
				            panel: "addrResult"
					    });  //构造地点查询类
					    AMap.event.addListener(auto, "select", vm.selectAddr);//注册监听，当选中某条记录时会触发
					})
				})
			},
			selectAddr(e) {
				var vm=this;
//				this.detaileAddress=e.poi.district+e.poi.name
				console.log(this.detaileAddress)
		        placeSearch.setCity(e.poi.adcode);
		        placeSearch.search(e.poi.name,function(state,result){
		        	console.log(state,result)
		        });  //关键字查询查询
//		        placeSearch.listElementClick()markerClick
				AMap.event.addListener(placeSearch, 'listElementClick', vm.placeSearchFun);
				AMap.event.addListener(placeSearch, 'markerClick', vm.placeSearchFun);
				
		        this.$nextTick(()=>{
		        	this.mapStyle={
		        		width:'100%',
						height:'100%'
					}
		        	this.addStyle={
		        		height:'35%'
		        	}
		        })
			},
			placeSearchFun(e){
				console.log(e)
				this.getAddr=e.data
				this.detaileAddress=
//				+e.data.pname
//				+'/'+e.data.cityname
//				+'/'+e.data.adname +'，'
				e.data.name+'，'
				+e.data.address
			},
			btnSpan(){
				var vm=this;
				window.sessionStorage.setItem('getAddr',JSON.stringify(vm.getAddr))
				this.$router.push({path: '/essentialInformation',query:{adduass:vm.getAddr}})
			},
			inputFocus(){
				
			},
			onComplete(data) {
				this.inputValue = ''
				this.cityName=data.addressComponent.city
				this.searchInput()
			},
			onError(data) {
				this.cityName='全国'
				this.searchInput();
			},
		},
	}
</script>
<style lang="sass">
	.app-index .page-container{
		padding: 0;
	}
	.customerAnaly{
		width: 100%;
		height: 600px;
		#selectAddr{
		.yd-scrollview:after{
			display: none;
		}
		width: 100%;
		height: 100%;
		.map {
			width: 100%;
			height: 300px;
			overflow: initial;
			position: relative;
		}
		.search_input{
			position: absolute;
		    top: 200px;
		    width: 60%;
		    left: 30%;
		    z-index: 999;
			.input{
				width: 70%;
				border: 1px solid #666666;
				line-height:40px;
				border-radius: 10px;
				background-image: url(../../../lib/img/fangdajing.png) ;
				background-repeat: no-repeat;

				background-color: rgba(255,255,255,1);
				text-indent: 50px;
				background-repeat: no-repeat;
				background-size: 40px 40px;
				background-position: 10px;
				background-size:30px;
				
			}
			.detaile_address_father{
				position: absolute;
				left: 0;
				width: 400px;
				top: 50px;
				.btn_span{
					margin-top: 50px;
					display: flex;
					justify-content: space-around;
					span{
						display: block;
						padding: 13px 15px;
						width: 80px;
						text-align: center;
						border:  1px solid #00A3FF;
						border-radius: 3px;
						position: relative;
						z-index: 9999;
					}
				}
			}
			.detaile_address{
				width: 100%;
				padding: 20px 20px;
				margin: 20px 0 0 0;
				color: #000000;
				background: rgba(255,255,255,1); 
				border-radius: 10px;
				border: 1px solid #666666;
			}
		}
		.addr_result{
			    width: 100%;
			    height: 100%;
			    overflow: scroll;
			    position: relative;
			    background: #fff;
		}
		.poi-more {
		    display: none!important;
		}
	}
	}
</style>