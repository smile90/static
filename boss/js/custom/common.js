(
    function (window, factory) {
        window.adminConfig = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, adminConfig, $) {
            /* 接口地址 */
            adminConfig.srvUrl = function () {
                return 'http://127.0.0.1:10000';
            };
            /* Token名称 */
            adminConfig.tokenName = function () {
                return 'bossToken';
            };
            /* 设备来源 */
            adminConfig.deviceSource = function () {
                return 'WEB';
            };
            /* 保存cookie的位置 */
            adminConfig.cookiePath = function () {
                return '/boss';
            };
            return adminConfig;
        }
    )
);

layui.config({
    base: './lib/weadmin/js/'
    ,version: '101100'
});