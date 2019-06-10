export default {
	state: {
		loading: false,
		winWidth: window.innerWidth,
		datadicArr:[], //通知类型
		channelArr:[],
		categoryList: [],
		storePic: '',
		storeName: '',
		storeReviewList: [],
		customerAddress: '',
		userFilePath: '',
		today: moment().subtract(0, 'days').format('YYYY-MM-DD'),
		beforeDay_7: moment().subtract(7, 'days').format('YYYY-MM-DD'),
		beforeDay_30: moment().subtract(30, 'days').format('YYYY-MM-DD'),
		marketTitle: ''
	},
	mutations: {
    	loading(state, obj) {
	        state.loading = obj.state
	    },
	    datadic(state, obj) {
	    	state.datadicArr = obj.data
	    },
	    channel(state, obj){
	    	state.channelArr = obj.data
	    },
	    categoryList(state, obj) {
	    	state.categoryList = obj
	    },
	    storePic(state, obj) {
	    	state.storePic = obj
	    },
	    storeReviewList(state, obj) {
	    	state.storeReviewList = obj
	    },
	    storeName(state, obj) {
	    	state.storeName = obj
	    },
	    customerAddress(state, obj) {
	    	state.customerAddress = obj
	    },
	    userFilePath(state, obj) {
	    	state.userFilePath = obj
	    },
	    marketTitle(state, obj) {
	    	state.marketTitle = obj
	    },
    },
    getters: {
    	getLoading(state) {
			return state.loading;
		},
		getWinWidth(state) {
			return state.winWidth;
		},
		getDatadicArrNotice(state) {
			return state.datadicArr.filter(o=>o.dataType=='MESSAGE_TYPE');
		},
		getDatadicArrChildren:state=>id=>{
			return state.datadicArr.find(o => o.id == id)
		},
		getChannelArrChildren:state=>code=>{
			return state.channelArr.find(o => o.code == code)
		},
		getCategoryList(state) {
			return state.categoryList;
		},
		getStorePic(state) {
			return state.storePic;
		},
		getStoreReviewList(state) {
			return state.storeReviewList;
		},
		getStoreName(state) {
			return state.storeName;
		},
		getCustomerAddress(state) {
			return state.customerAddress;
		},
		getUserFilePath(state) {
			return state.userFilePath;
		},
		getMarketTitle(state) {
			return state.marketTitle;
		},
    },
    actions: {
    	loading: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('loading', obj);
				resolve()
			});
		},
		datadic({dispatch,commit,state},obj){
			return new Promise((resolve, reject) => {
//		      	setTimeout(() => {
			        	commit({
			        		type:'datadic',
			        		data:obj.data
			        	})
			        resolve()
//			    }, 3000)
			})
		},
		channel({dispatch,commit,state},obj){
			return new Promise((resolve, reject) => {
			        	commit({
			        		type:'channel',
			        		data:obj.data
			        	})
			        resolve()
			})
		},
		categoryList: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('categoryList', obj);
				resolve()
			});
		},
		storePic: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('storePic', obj);
				resolve()
			});
		},
		storeReviewList: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('storeReviewList', obj);
				resolve()
			});
		},
		storeName: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('storeName', obj);
				resolve()
			});
		},
		customerAddress: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('customerAddress', obj);
				resolve()
			});
		},
		userFilePath: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('userFilePath', obj);
				resolve()
			});
		},
		marketTitle: ({
			commit
		}, obj) => {
			return new Promise((resolve, reject) => {
				commit('marketTitle', obj);
				resolve()
			});
		},
    }
}