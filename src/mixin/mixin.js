import co from 'co'
import json2csv from 'json2csv'
import local from '../local.js'
import configs from '../configs.js'
import paginationMixin from './mixin_pagination.js'
import tableMixin from './mixin_table.js'
import modalMixin from './mixin_modal.js'
import regMixin from './mixin_reg.js'
import echartMixin from './mixin_echart.js'
import cascaderMixin from './mixin_cascader.js'
import uploadMixin from './mixin_upload.js'
import confirmMixin from './mixin_confirm.js'
import dataMixin from './mixin_data.js'
import dateMixin from './mixin_date.js'
import apiMixin from './mixin_api.js'
//ajax
function* $ajax(url, type, param, async, loading, jsonType, arr, valiToken) {
    let contentType = jsonType ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    let token = local.get('token')
    for (var key in param) {
        if (typeof param[key] === 'string') {
            param[key] = $.trim(param[key].replace(/<\/?[^>]*>/g, ''))
        }
    }
    if (valiToken && !token) {
        this.$message({ type: 'error', message: "token过期请重新登录" });
        this.$router.push({ name: 'login' })
    } else if (valiToken) {
        param.token = token
    }
    let o = {
        url: url,
        type: type,
        data: param,
        async: async,
        contentType: contentType
    }
    let data = {}
    if (arr) {
        o.traditional = true
    }
    if (loading) {
        this[loading] = true
    }

    data = yield $.ajax(o)
        .then((function(d) {
            if (loading) {
                this[loading] = false
            }
            if (d.state !== 0) {
                if (d.state == 97 || d.state == 98) {
                    this.$message({ type: 'error', message: d.msg });
                    this.$router.push({ name: 'login' })
                } else {
                    this.$message({ type: 'error', message: d.msg });
                    // this.$router.push({ name: 'page500' ,query:{error:d.readyState}})
                    console.error(d.msg)
                    if (typeof d.aaData === 'undefined' || d.aaData === null) {
                        d.aaData = []
                    }
                    return d
                }
            } else if (typeof d.aaData === 'undefined' || d.aaData === null) {
                d.aaData = []
                return d
            } else {
                return d
            }
        }).bind(this))
        .fail((function(d) {
            if (loading) {
                this[loading] = false
            }
            if (d.readyState === 4 && d.status === 404) {
                this.$router.push({ name: 'page404', query: { error: d.readyState } })
            } else if (d.status === 403) {
                this.$router.push({ name: 'page403' })
            } else if ((d.status + '').indexOf('50') === 0) {
                this.$router.push({ name: 'page500', query: { error: d.readyState } })
            } else {
                this.$message({ type: 'error', message: '接口异常' });
            }
        }).bind(this))
    return yield new Promise((function(resolve, reject) {
        resolve(data)
    }).bind(this))
}
export default {
    mixins: [paginationMixin, dataMixin, tableMixin, modalMixin, regMixin, cascaderMixin, uploadMixin, confirmMixin, echartMixin, dateMixin, apiMixin],
    data() {
        return {
            categoryList: [],
            localUser: local.get('userinfo'),
            api: configs.api,
            rootAPI: configs.rootAPI, //接口根路径
            userAPI: configs.userAPI,
            distributeAPI: configs.distributeAPI, //配送接口
            uploadURL: configs.rootAPI + 'plantingBaseInfo/imgupload?token=' + local.get('token'),
            rowStyle: {
                height: '30px',
                'line-height': '30px',
                'text-align': 'center'
            },
            filterable: true,
            clearable: true,
            userStateList: [{ label: '全部', value: '' }, { label: '激活', value: '1' }, { label: '注销', value: '0' }],
            dicUserState: [],
            dicEnabled: [],
            dicDeleted: [],
            dicRoleState: []
        }
    },
    methods: {
        handleDataList(d) {
            return d.aaData.map(function(el) {
                el.rowEditable = false
                el.rowError = false
                return el
            })
        },
        searchAll({
            url = this.rootAPI,
            type = 'POST',
            name = '',
            param = {},
            async = true,
            loading = '',
            jsonType = false,
            arr = false
        }, fn) {
            var params = Object.assign(param, {
                pageNum: 1,
                pageSize: 10000
            })
            var o = {
                url: url,
                type: type,
                name: name,
                param: params,
                async: async,
                loading: loading,
                jsonType: jsonType,
                arr: arr
            }
            return this._ajax(o)
        },
        renderTable(d) {
            let dataList = d.aaData
            if (Array.isArray(dataList)) {
                this.dataList = this.handleDataList(d)
                if (dataList.length > 0) {
                    this.pageTotal = d.dataCount
                } else {
                    this.pageTotal = 0
                }
            } else {
                this.handleDataList(d)
            }
        },
        _delSelection(urlObj, delKey, cb) {
            if (this.delSelection.length === 0) {
                this.$message({ type: 'info', message: '请选择行' });
            } else {
                let selection = this.delSelection
                this.confirm('确定删除？', (() => {
                    var arr = [],
                        o = { url: this.rootAPI, param: {}, arr: true }
                    selection.forEach(function(el) {
                        arr.push(el.delKey)
                    })
                    o.param[delKey] = arr
                    o = Object.assign(o, urlObj)
                    this._ajax(o)
                        .then((d) => {
                            cb(d);
                        })
                }))
            }
        },
        _ajax({
            url = this.rootAPI,
            type = 'POST',
            name = '',
            param = {},
            async = true,
            loading = '',
            jsonType = false,
            arr = false,
            valiToken = true
        } = {}) {
            if ((url === this.rootAPI || url === this.userAPI) && name !== '') {
                let api = url + name
                return co.wrap($ajax).call(this, api, type, param, async, loading, jsonType, arr, valiToken)
            } else {
                return co.wrap($ajax).call(this, url, type, param, async, loading, jsonType, arr, valiToken)
            }
        },
        //获取距离当天的时间
        _getDate(n) {
            const date = moment().subtract(n, 'days').format('YYYY-MM-DD');
            return date
        },
        //获取当前时间
        _getCurrentDate(n) {
            const date = moment().subtract(n, 'days').format('YYYY-MM-DD HH:mm:ss');
            return date
        },
        showMsg(msg, scs) {
            Ext.Msg.show({
                cls: 'jz-msg',
                title: '提示信息',
                message: msg,
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                minWidth: 500,
                fn: function(btn) {
                    if (btn === 'yes') {
                        scs()
                    }
                    if (btn === 'no') {
                        console.log('No pressed');
                    }
                }
            });
        },
        confirm(msg, scs) {
            return this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(scs).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        _csvExport(data, fields, fieldNames, fileName) {
            try {
                var dataList = []
                data.map(function(el) {
                    var o = {}
                    fields.map(function(oo) {
                        o[oo] = el[oo]
                    })
                    dataList.push(o)
                })
                var result = json2csv({
                    data: dataList,
                    fields: fields,
                    fieldNames: fieldNames
                })
                var csvContent = 'data:text/csvcharset=GBK,\uFEFF' + result
                var encodedUri = encodeURI(csvContent)
                var link = document.createElement('a')
                link.setAttribute('href', encodedUri)
                link.setAttribute('download', `${(fileName || 'file')}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } catch (err) {
                console.error(err)
            }
        },
        _exportExcel(dataList, fields, filedsName, fileName) {
            if (dataList.length > 0) {
                this._csvExport(dataList, fields, filedsName, fileName)
            } else {
                this.$message({ type: 'info', message: '无导出数据' });
            }
        },
        $exportExcelBySelect(fields, filedsName, fileName) {
            if (this.rowSelection.length > 0) {
                this._csvExport(this.rowSelection, fields, filedsName, fileName)
            } else {
                this.$message({ type: 'info', message: '无导出数据' });
            }
        },
        _delList(apiurl, o) {
            this._ajax({ url: apiurl, param: o, arr: true })
                .then((function(d) {
                    this.$message({ type: 'success', message: '删除成功' });
                    this.handleCurrentChange(1)
                }).bind(this))
        },
        _searchDic(name) {
            return this._ajax({ url: this.rootAPI, name: 'datadic/list', param: { dataType: name, enabled: 1 } })
        },
        _dicKey(d) {
            var arr = []
            if (d.aaData.length > 0) {
                d.aaData.map(function(el) {
                    el.key = parseInt(el.key)
                    if(arr.length == 0) {
                        arr.push(el)
                    }else {
                        var flag = true
                        arr.forEach(function(em) {
                            if(em.key == el.key) {
                                flag = false
                            }
                        })
                        if(flag) {
                            arr.push(el)
                        }
                    }
                })
            }
            return arr
            
        },
        _dicValue(key, dic) {
            var value = ''
            dic.forEach(function(el) {
                if (key === el.key) {
                    value = el.value
                }
            })
            return value
        },
        _dateFormat({
            date = '',
            type = 'YYYY-MM-DD'
        } = {}) {
            if (date) {
                return moment(date).format(type)
            } else {
                return ''
            }

        },
        _parseFloat(val, num) {
            if (typeof val === "string") {
                return parseFloat(parseFloat(val).toFixed(num))
            } else if (typeof val === "number") {
                return parseFloat(val.toFixed(num))
            } else {
                return val
            }
        },
        _priceFormat(val) {            
            if (typeof val === 'number') {
                return val.div(100)
            } else {
                return val
            }
        },
        isObject(item) {
            return (item !== null && typeof item === 'object' && !Array.isArray(item));
        },
        isEmptyObject(obj) {
            return obj !== null && Object.keys(obj).length == 0
        },        
        _go(name, params) {
            if(params) {
                this.$router.push({name, params})
            }else {
                this.$router.push({name})
            }            
        },
        renderStoreInfo() {
            var user = local.get('sessionUser'), sellerId = ''
            if(user && user.typeId === 'merchant') {
                sellerId = parseInt(user.typeCode);
                return this._ajax({name: 'store/queryBySellerId',param: {sellerId}})
                .then((function(d) {
                  this.$store.dispatch('storePic', d.aaData.headPicUrl)
                  this.$store.dispatch('storeName', d.aaData.storeName)
                  return this._ajax({name: 'store/queryScoreByReviewTypeAndStore',param: {id:d.aaData.id}})     
                }).bind(this))
                .then((function(d) {
                  this.$store.dispatch('storeReviewList', d.aaData)
                }).bind(this))
            }else {
                this.$store.dispatch('storePic', '')
                this.$store.dispatch('storeName', '')
                this.$store.dispatch('storeReviewList', [])
            }
        },
        saveProCategory() {
            return this._ajax({name: 'category/childList', param: {parentCategoryId: 'top', filteEnabled: 1, filteDeleted: 0}})
            .then((function(d) {
              this.$store.dispatch('categoryList', d.aaData)
            }).bind(this))
        },
        _momentAddDay({
            days = 1,
            format = 'YYYY-MM-DD'
        } = {}) {
            return moment().add(days, 'days').format(format)
        },
        _momentSubDay({
            days = 1,
            format = 'YYYY-MM-DD'
        } = {}) {
            return moment().subtract(days, 'days').format(format)
        },
        _moment({
            format = 'YYYY-MM-DD'
        } = {}) {
            return moment().format(format)
        },
        _userInfo(userId) {
            return this._ajax({url: this.userAPI, name: 'user/list', param: {userId}})
            .then((function(d) {
                if(d.aaData.length > 0) {
                    var user = d.aaData[0]
                    this.$store.dispatch('userFilePath', user.filePath)
                }
            }).bind(this))
        },
        _isMerchantUser() {
            var user = local.get('sessionUser');
            return this.isObject(user) && (user.typeId === 'merchant' || user.typeId === 'merchant_buyer')
        },
        _isBuyerUser() {
            var user = local.get('sessionUser');
            return this.isObject(user) && user.typeId === 'buyer'
        },
        lodopoPrint(top, left, width, height, html, length) {
            var height = 930
            if(length && length > 7) {
                var count = length - 7
                var page = Math.ceil(count/11)
                height = height + page*930
            }
            if(typeof LODOP === 'undefined') {
                this.$message({
                    showClose: true,
                    duration: 0,
                    dangerouslyUseHTMLString: true,
                    message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
                });
            }else {
                LODOP.PRINT_INIT("");
                LODOP.SET_PRINT_PAGESIZE(1,2100,height,'');
                LODOP.ADD_PRINT_HTM(top, left, width, height, html);
                LODOP.PRINT()
            }
        },
        lodopoPreview(top, left, width, height, html, length) {
            var height = 930
            if(length && length > 7) {
                var count = length - 7
                var page = Math.ceil(count/11)
                height = height + page*930
            }
            if(typeof LODOP === 'undefined') {
                this.$message({
                    showClose: true,
                    duration: 0,
                    dangerouslyUseHTMLString: true,
                    message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
                });
            }else {
                LODOP.PRINT_INIT("");
                LODOP.SET_PRINT_PAGESIZE(1,2100,height,'');
                LODOP.ADD_PRINT_HTM(top, left, width, height, html);
                LODOP.PREVIEW()
            }
        },
        Gprinter(html, url) {
            LODOP.SET_LICENSES("成都九洲电子信息系统股份有限公司", "1DAA3FA17DD9EF73566A29AC39CE300C", "成都九洲電子信息系統股份有限公司", "F0F8A487D1A0DEBA028F42800034942A");
            LODOP.SET_LICENSES("THIRD LICENSE", "", "Chengdu Jiuzhou Electronic Information System Co., Ltd.", "1E6D08DE79B42A3871D5EF3423D77853");
            LODOP.PRINT_INIT("");
            LODOP.SET_PRINT_PAGESIZE(1, 600, 500, '');
            LODOP.ADD_PRINT_HTM(5, 5, '100%', '100%', html);
            LODOP.ADD_PRINT_BARCODE(62, 135, 94, 94, "QRCode", url);
            LODOP.SET_PRINT_MODE("RESELECT_PRINTER", true);
            LODOP.SET_PRINT_MODE("RESELECT_ORIENT", true);
            LODOP.SET_PRINT_MODE("RESELECT_PAGESIZE", true);
            LODOP.SET_PRINT_MODE("RESELECT_COPIES", true);
            LODOP.PRINT()
        },
        GprinterPreview(html, url) {
            LODOP.PRINT_INIT("");
            LODOP.SET_PRINT_PAGESIZE(1,600,500,'');
            LODOP.ADD_PRINT_HTM(5,5,'100%','100%', html);
            LODOP.ADD_PRINT_BARCODE(62,135,94,94,"QRCode",url);
            LODOP.SET_PRINT_MODE("RESELECT_PRINTER",true);
            LODOP.SET_PRINT_MODE("RESELECT_ORIENT",true);
            LODOP.SET_PRINT_MODE("RESELECT_PAGESIZE",true);
            LODOP.SET_PRINT_MODE("RESELECT_COPIES",true);
            LODOP.SET_LICENSES("成都九洲电子信息系统股份有限公司", "1DAA3FA17DD9EF73566A29AC39CE300C", "成都九洲電子信息系統股份有限公司", "F0F8A487D1A0DEBA028F42800034942A");
            LODOP.SET_LICENSES("THIRD LICENSE", "", "Chengdu Jiuzhou Electronic Information System Co., Ltd.", "1E6D08DE79B42A3871D5EF3423D77853");
            LODOP.PREVIEW()
        },
        SelectAsDefaultPrinter(fn) { 
            if (LODOP.CVERSION) {
                LODOP.On_Return=function(TaskID,Value){if(Value>=0) fn();};
                LODOP.SELECT_PRINTER();
                return;
            };
            if (LODOP.SELECT_PRINTER()>=0) 
            fn();
        },
        back2Top() {
            $('html, body').animate({scrollTop: 0}, 500);
        },
        renderPrintHtml(html) {
            for(var i = 1; i < arguments.length; i++) {
                var reg = new RegExp('{{args' + i + '}}',"g")
                html = html.replace(reg, arguments[i])
            }
            return html
        },
        _decNum(a){/*获取小数位数*/
            var r=0;
            a=a.toString();
            if(a.indexOf(".")!== -1) r=a.split(".")[1].length;
            return r;
        },
        _int(a){/*去除小数点并转成数值*/
            return parseInt(a.toString().replace(".",""));
        },
        _calc(a,b,type){//加减乘除
            var r,
                da=this._decNum(a),
                db=this._decNum(b),
                dsum=da+db,
                dmin=Math.min(da,db),
                dmax=Math.max(da,db);
            dsum+=dmax-dmin;
            dsum=Math.pow(10,dsum);
            dmax=Math.pow(10,dmax);
            a=this._int(a);
            b=this._int(b);
            if(da>db){
                b*=Math.pow(10,da-db);
            }else{
                a*=Math.pow(10,db-da);
            }
            switch(type){
                case "add":
                    r=(a+b)/dmax;
                    break;
                case "subtract":
                    r=(a-b)/dmax;
                    break;
                case "multiply":
                    r=(a*b)/dsum;
                    break;
                case "divide":
                    r=a/b;
                    break;
            }
            return r;
        }
    },
}