export default [{
        path: '/login',
        name: 'login',
        component: function(resolve) {
            require(['./views/login.vue'], resolve)
        },
    },
    {
        path: '/complementingInformation',
        name: 'complementingInformation',
        component: function(resolve) {
            require(['./views/complementingInformation.vue'], resolve)
        },
    },
     {
        path: '/registerNewtwo',
        name: 'registerNewtwo',
        component: function(resolve) {
            require(['./views/registerNewtwo.vue'], resolve)
        },
    },
    {
        path: '/customerRegist',
        name: 'customerRegist',
        component: function(resolve) {
            require(['./views/customerRegist.vue'], resolve)
        },
    },
    {
        path: '/',
        name: 'index',
        component: function(resolve) {
            require(['./views/index.vue'], resolve)
        },
        children: [{
                path: '/',
                name: 'index_index',
                meta: {
                    father: '首页',
                    name: '首页',
                },
                component: function(resolve) {
                    require(['./views/index_index.vue'], resolve)
                }
            },
            {
                path: '/merchant/orderManage',
                name: 'merchant_orderManage',
                meta: {
                    useType: 'merchant',
                    father: '订单管理',
                    name: '销售订单',
                },
                component: function(resolve) {
                    require(['./views/orderManage.vue'], resolve)
                }
            },
            {
               path: '/arrearsMerchants',
               name: 'arrearsMerchants',
               meta: {
                   useType: 'merchant',
                   father: '订单管理',
                   name: '欠款商户统计',
               },
               component: function(resolve) {
                   require(['./views/arrearsMerchants.vue'], resolve)
               },
           },
            {
                path: '/buyer/orderManage',
                name: 'buyer_orderManage',
                meta: {
                    useType: 'buyer',
                    father: '订单管理',
                    name: '采购订单',
                },
                component: function(resolve) {
                    require(['./views/orderManage_buyer.vue'], resolve)
                }
            },
            {
                path: '/order/orderReview',
                name: 'orderReview',
                meta: {
                    father: '订单管理',
                    name: '订单评价',
                },
                component: function(resolve) {
                    require(['./views/orderReview.vue'], resolve)
                }
            },
            {
                path: '/commodityQuotation',
                name: 'commodityQuotation',
                meta: {
                    father: '商品管理',
                    name: '商品报价',
                },
                component: function(resolve) {
                    require(['./views/commodityQuotation.vue'], resolve)
                }
            },
            {
                path: '/quotationModal',
                name: 'quotationModal',
                meta: {
                    father: '商品报价',
                    name: '报价管理',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/quotationNewModal.vue'], resolve)
                }
            },
            {
                path: '/promotion',
                name: 'promotion',
                meta: {
                    sysName: 'promotion',
                    father: ' 商品管理',
                    name: '促销活动',
                },
                component: function(resolve) {
                    require(['./views/promotion.vue'], resolve)
                }
            },
            {
                path: '/promotionModal',
                name: 'promotionModal',
                meta: {
                    sysName: 'promotionModal',
                    father: ' 商品管理',
                    name: '促销活动',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/promotionModal.vue'], resolve)
                }
            },
            {
                path: '/productOnline',
                name: 'productOnline',
                meta: {
                    sysName: 'productOnline',
                    father: '商品管理',
                    name: '在售商品',
                },
                component: function(resolve) {
                    require(['./views/productOnline.vue'], resolve)
                }
            },
            {
                path: '/productOnlineModal',
                name: 'productOnlineModal',
                meta: {
                    sysName: 'productOnlineModal',
                    father: '在售商品',
                    name: '在售商品详情',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/productOnlineModal.vue'], resolve)
                }
            },
            {
                path: '/kh_notice',
                name: 'kh_notice',
                meta: {
                    father: '客户管理',
                    name: '客户公告',
                },
                component: function(resolve) {
                    require(['./views/kh_notice.vue'], resolve)
                }
            },
            {
                path: '/customerGroupSet',
                name: 'customerGroupSet',
                meta: {
                    sysName: 'merchant',
                    father: '客户管理',
                    name: '客户管理',
                    modal:1
                },
                component: function(resolve) {
                    require(['./views/customerGroupSet.vue'], resolve)
                }
            },
            {
                path: '/tradingAreaManager',
                name: 'tradingAreaManager',
                meta: {
                    sysName: 'merchant',
                    father: '客户管理',
                    name: '商圈管理',
                    modal:1
                },
                component: function(resolve) {
                    require(['./views/tradingAreaManager.vue'], resolve)
                }
            },
            {
                path: '/buySummary',
                name: 'buySummary',
                meta: {
                    sysName: 'merchant',
                    father: '订单管理',
                    name: '采买汇总',
                },
                component: function(resolve) {
                    require(['./views/buySummary.vue'], resolve)
                }
            },
            {
                path: '/buyPriceSetView',
                name: 'buyPriceSetView',
                meta: {
                    father: '订单管理',
                    name: '采购价格设置',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/buyPriceSetView.vue'], resolve)
                }
            },
            {
                path: '/productNeedDistribut',
                name: 'productNeedDistribut',
                meta: {
                    sysName: 'merchant',
                    father: '订单管理',
                    name: '需配送商品汇总',
                },
                component: function(resolve) {
                    require(['./views/productNeedDistribut.vue'], resolve)
                }
            },
            {
                path: '/essentialInformation',
                name: 'essentialInformation',
                meta: {
                    sysName: 'essentialInformation',
                    father: '基本信息管理',
                    name: '基本信息',
                },
                component: function(resolve) {
                    require(['./views/essentialInformationModal.vue'], resolve)
                }
            },
            {
                path: '/storeInformationModel',
                name: 'storeInformationModel',
                meta: {
                    sysName: 'essentialInformation',
                    father: '基本信息管理',
                    name: '店铺信息',
                },
                component: function(resolve) {
                    require(['./views/storeInformationModel.vue'], resolve)
                }
            },
            {
                path: '/sorterManage',
                name: 'sorterManage',
                meta: {
                    sysName: 'merchant',
                    father: '分拣管理',
                    name: '分拣员管理',
                },
                component: function(resolve) {
                    require(['./views/sorterManage.vue'], resolve)
                }
            },
            {
                path: '/weightBasketManage',
                name: 'weightBasketManage',
                meta: {
                    sysName: 'merchant',
                    father: '分拣管理',
                    name: '称重筐管理',
                },
                component: function(resolve) {
                    require(['./views/weightBasketManage.vue'], resolve)
                }
            },
            {
                path: '/outofstockManage',
                name: 'outofstockManage',
                meta: {
                    sysName: 'merchant',
                    father: '分拣管理',
                    name: '缺货管理',
                },
                component: function(resolve) {
                    require(['./views/outofstockManage.vue'], resolve)
                }

            },
            {
                path: '/inventorySituation',
                name: 'inventorySituation',
                meta: {
                    sysName: 'merchant',
                    father: '库存管理',
                    name: '库存状况',
                    modal:1
                },
                component: function(resolve) {
                    require(['./views/inventorySituation.vue'], resolve)
                }
            },
            {
                path: '/inventoryChange',
                name: 'inventoryChange',
                meta: {
                    sysName: 'merchant',
                    father: '库存管理',
                    name: '库存流水',
                },
                component: function(resolve) {
                    require(['./views/inventoryChange.vue'], resolve)
                }

            },
            {
                path: '/stock/inStock',
                name: 'inStock',
                meta: {
                    sysName: 'merchant',
                    father: '库存管理',
                    name: '入库管理',
                },
                component: function(resolve) {
                    require(['./views/inStock.vue'], resolve)
                }

            },
            {
                path: '/stock/outStock',
                name: 'outStock',
                meta: {
                    sysName: 'merchant',
                    father: '库存管理',
                    name: '出库管理',
                },
                component: function(resolve) {
                    require(['./views/outStock.vue'], resolve)
                }

            },
            {
                path: '/sortingorderManage',
                name: 'sortingorderManage',
                meta: {
                    sysName: 'merchant',
                    father: '分拣管理',
                    name: '分拣任务管理',
                },
                component: function(resolve) {
                    require(['./views/sortingorderManage.vue'], resolve)
                }
            },
            {
                path: '/sorttaskChange',
                name: 'sorttaskChange',
                meta: {
                    sysName: 'merchant',
                    father: '分拣管理',
                    name: '分拣任务变更',
                },
                component: function(resolve) {
                    require(['./views/sorttaskChange.vue'], resolve)
                }

            },
            {
                path: '/sorttaskStatistics',
                name: 'sorttaskStatistics',
                meta: {
                    sysName: 'merchant',
                    father: '分拣管理',
                    name: '分拣任务统计',
                },
                component: function(resolve) {
                    require(['./views/sorttaskStatistics.vue'], resolve)
                }

            },
            {
                path: '/supplierManager',
                name: 'supplierManager',
                meta: {
                    sysName: 'supplier',
                    father: '库存管理',
                    name: '供应商管理',
                },
                component: function(resolve) {
                    require(['./views/supplierManager.vue'], resolve)
                }

            },
            {
                path: '/supplierModal',
                name: 'supplierModal',
                meta: {
                    sysName: 'supplierModal',
                    father: '供应商管理',
                    name: '新增供应商',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/supplierModal.vue'], resolve)
                }

            },
            {
                path: '/inventoryManager',
                name: 'inventoryManager',
                meta: {
                    sysName: 'inventory',
                    father: '库存管理',
                    name: '盘点管理',
                },
                component: function(resolve) {
                    require(['./views/inventoryManager.vue'], resolve)
                }

            },
            {
                path: '/inventoryModal',
                name: 'inventoryModal',
                meta: {
                    sysName: 'inventoryModal',
                    father: '库存管理',
                    name: '新增盘点单',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/inventoryModal.vue'], resolve)
                }

            },
            {
                path: '/productSkuPriceUpdateQuickly',
                name: 'productSkuPriceUpdateQuickly',
                meta: {
                    sysName: 'productSkuPriceUpdateQuickly',
                    father: '商品管理',
                    name: '商品快速改价',
                },
                component: function(resolve) {
                    require(['./views/productSkuPriceUpdateQuickly.vue'], resolve)
                }

            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    father: '用户管理',
                    name: '用户管理',
                },
                component: function(resolve) {
                    require(['./views/user.vue'], resolve)
                }
            },
            {
                path: '/user_role',
                name: 'userRole',
                meta: {
                    father: '用户管理',
                    name: '角色管理',
                },
                component: function(resolve) {
                    require(['./views/userRole.vue'], resolve)
                }
            },
            {
                path: '/distributionVehicle',
                name: 'distributionVehicle',
                meta: {
                    father: '配送管理',
                    name: '车辆管理',
                },
                component: function(resolve) {
                    require(['./views/distributionVehicle.vue'], resolve)
                }
            },
            {
                path: '/deliveryOrderManage',
                name: 'deliveryOrderManage',
                meta: {
                    father: '配送管理',
                    name: '送货单管理',
                },
                component: function(resolve) {
                    require(['./views/deliveryOrderManage.vue'], resolve)
                }
            },
            {
                path: '/distributionOrderManage',
                name: 'distributionOrderManage',
                meta: {
                    father: '配送管理',
                    name: '配送单管理',
                },
                component: function(resolve) {
                    require(['./views/distributionOrderManage.vue'], resolve)
                }
            },
            {
                path: '/dataSaleAnalysis',
                name: 'saleAnalysis',
                meta: {
                    father: '统计分析',
                    name:'销售统计',
                },
                component: function (resolve) {
                    require(['./views/saleAnalysis.vue'],resolve)
                }
            },
             {
                path: '/orderStatistics',
                name: 'orderStatistics',
                meta: {
                    father: '统计分析',
                    name:'订单统计',
                    modal:1
                },
                component: function (resolve) {
                    require(['./views/orderStatistics.vue'],resolve)
                }
            },
            {
                path: '/supplierOperate',
                name: 'supplierOperate',
                meta: {
                    father: '快速工作台',
                    name: '快速工作台',
                },
                component: function(resolve) {
                    require(['./views/supplierOperate.vue'], resolve)
                }
            },
            {
                path: '/commoditySaleStatistics',
                name: 'saleStatistics',
                meta: {
                    father: '统计分析',
                    name:'商品统计',
                },
                component: function (resolve) {
                    require(['./views/commoditySaleStatistics.vue'],resolve)
                }
            },
            {
                path: '/customerAnalysis',
                name: 'customerAnalysis',
                meta: {
                    father: '统计分析',
                    name:'客户分析',
                },
                component: function (resolve) {
                    require(['./views/customerAnalysis.vue'],resolve)
                }
            },
            {
                path: '/customerAnalysisModal',
                name: 'customerAnalysisModal',
                meta: {
                    father: '统计分析 / 客户分析',
                    name: '客户分析详情',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/customerAnalysisModal.vue'], resolve)
                }
            },
            {
                path: '/inMarketDetail',
                name: 'inMarketDetail',
                meta: {
                    father: '库存管理',
                    name: '来溯管理',
                },
                component: function (resolve) {
                    require(['./views/inMarketDetail.vue'], resolve)
                }
            },
           	{
                path: '/mapSearchModal',
                name: 'mapSearchModal',
                meta: {
                    father: '基本信息 ',
                    name: '地址管理',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/modals/mapSearchModal.vue'], resolve)
                }
            },
            {
                path: '/distributionSummary',
                name: 'distributionSummary',
                meta: {
                    //sysName: 'merchant',
                    father: '订单管理',
                    name: '待配送信息汇总',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/distributionSummary.vue'], resolve)
                }
            },
             {
                path: '/deliveryOrderTotalManage',
                name: 'deliveryOrderTotalManage',
                meta: {
                    //sysName: 'merchant',
                    father: '配送管理',
                    name: '运货单汇总',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/deliveryOrderTotalManage.vue'], resolve)
                }
            },
            {
                path: '/orderReturnManage',
                name: 'orderReturnManage',
                meta: {
                    father: '订单管理',
                    name: '退换货管理',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/orderReturnManage.vue'], resolve)
                }
            },
            {
                path: '/deliveryOrderNewModule',
                name: 'deliveryOrderNewModule',
                meta: {
                    father: '配送管理',
                    name: '送货单分类汇总',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/deliveryOrderNewModule.vue'], resolve)
                }
            },
            {
                path: '/deliveryAccManage',
                name: 'deliveryAccManage',
                meta: {
                    father: '配送管理',
                    name: '事故、损失管理',
                    modal : 1,
                },
                component: function(resolve) {
                    require(['./views/deliveryAccManage.vue'], resolve)
                }
            },
            {
                path: '/reportReserve',
                name: 'reportReserve',
                meta: {
                    father: '基本信息管理',
                    name: '报表订阅',
                },
                component: function(resolve) {
                    require(['./views/reportReserve.vue'], resolve)
                }
            },
            {
                path: '/deliveryUnit',
                name: 'deliveryUnit',
                meta: {
                    father: '配送管理',
                    name: '往来单位',
                },
                component: function (resolve) {
                    require(['./views/deliveryUnit.vue'], resolve)
                }
            },
        ]
    }
]
