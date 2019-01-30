(
    function (window, factory) {
        window.adminConfig = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, adminConfig, $) {
            /* 接口地址 */
            adminConfig.srvUrl = function () {
                return 'http://127.0.0.1:10001';
            };
            /* Token名称 */
            adminConfig.tokenName = function () {
                return 'token';
            };
            /* 设备来源 */
            adminConfig.deviceSource = function () {
                return 'WEB';
            };
            /* 后台Token名称 */
            adminConfig.cookiePath = function () {
                return '/boss';
            };

            /* Ajax接口二次封装 */
            adminConfig.ajax = function (settings) {
                var _settings = {
                    url: settings.url,
                    method: settings.method,
                    data: $.extend(settings.data, {'deviceSource': adminConfig.deviceSource()}),
                    headers: $.extend(settings.headers, {'token': $.cookie(adminConfig.tokenName())}),
                    xhrFields: $.extend(settings.xhrFields, {withCredentials: true}),
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    success: settings.success,
                    error:
                        function (error) {
                            console.info(error);
                            if (error.status == 403) {
                                layui.use('layer', function () {
                                    var layer = layui.layer;
                                    layer.msg('登录超时，请重新登录！');
                                });
                                setTimeout(function () {
                                    window.location.href = './login.html';
                                }, 2000);
                            } else {
                                layui.use('layer', function () {
                                    var layer = layui.layer;
                                    layer.msg('服务器繁忙，请稍后再试！');
                                });
                            }
                        }
                };
                $.ajax(_settings);
            }
            return adminConfig;
        })
);

layui.config({
    base: './lib/weadmin/js/',
    version: '101100'
});