var IN_BROWSER = typeof window !== 'undefined';
var IN_WEEX = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var WEEX_PLATFORM = IN_WEEX && WXEnvironment.platform.toLowerCase();
var UA = IN_BROWSER && window.navigator.userAgent.toLowerCase();
var IS_IE = UA && /msie|trident/.test(UA);
var IS_IE_9 = UA && UA.indexOf('msie 9.0') > 0;
var IS_EDGE = UA && UA.indexOf('edge/') > 0;
var iS_ANDROID = (UA && UA.indexOf('android') > 0) || (WEEX_PLATFORM === 'android');
var iS_IOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (WEEX_PLATFORM === 'ios');
var IS_CHROME = UA && /chrome\/\d+/.test(UA) && !IS_EDGE;
var PRINT_HTML = {
    SUYUAN_CODE: `
        <div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">
            商家编号:
            <span style="font-weight: bolder;font-size: 15px;padding-left:30px;">{{args1}}</span>
            <span style="font-weight: bolder;font-size: 15px;padding-left:10px;">{{args2}}</span>
        </div>
        <div style="font-size: 13px;height: 20px;line-height: 20px;">商家:{{args3}}</div>
        <div style="font-size: 13px;height: 20px;line-height: 20px;">商品:{{args4}}</div>
        <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:{{args5}}</div>
        <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣人员:</div>
        <div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">{{args6}}</div>
        <div style="text-align: center;font-size: 12px;height: 20px;line-height: 20px;">{{args7}}</div>
    `
}