export default {
    api: ROOT_API + '/api',
    rootAPI: ROOT_API + '/api/trade/', //接口根路径
    userAPI: ROOT_API + '/api/user/',
    permissionAPI: ROOT_API + '/api/permission/',
    distributeAPI: ROOT_API + '/api/distribute/', //配送接口
    loginAPI: ROOT_API + '/login/login',
    prefix: 'jz_admin_ycmerchant', //本地存储key前缀
    // imgURL: 'http://10.2.15.82/',
    // uploadURL: ROOT_API + '/api/comm/fileUpload/file',/*http://10.2.15.82:8080*/
    imgURL: ROOT_API + '/',
    uploadURL: ROOT_API + '/api/comm/fileUpload/file',
    sysID: 8,
    suyuanURL: SY_URL + '/infomation.html?suyuanCode=',
    frontEndId: 1,  //前端系统Id 1:一批 2：电子结算
    city: '农鲜汇',
    hedong: 0 ,
    quickLogin:window.location.href.indexOf('ssbh')>=0?true:false, //是否开启二维码快捷登录
    wxUrl:WX_URL,
};