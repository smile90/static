(
    function (window, factory) {
        window.util = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, util, $) {
            /* 获取页面之间传递的参数 */
            util.getQueryParams = function () {
                var urlParams = location.search.replace('?', '');
                if (urlParams == null || urlParams === '') {
                    return null;
                }
                var para = urlParams;
                if (urlParams.indexOf("&") > -1) {
                    para = urlParams.split("&");
                }
                var len = para.length;
                var res = {};
                var arr = [];
                for(var i=0;i<len;i++){
                    arr = para.split("=");
                    res[arr[0]] = arr[1];
                }
                return res;
            },
            /* 校验是否成功 */
            util.isSuccess = function(data) {
                return data.code === '000000000000';
            };
            /* 错误执行 */
            util.error = function(data) {
                layui.use('layer', function () {
                    layui.layer.msg('[' + data.code + ']'+ data.showMsg);
                });
            };
            /* Ajax接口二次封装 */
            util.ajax = function (settings) {
                var async = true;
                if (settings.async != null && settings.async == false) {
                    async = false;
                }
                var _settings = {
                    async: async,
                    url: settings.url,
                    method: settings.method,
                    data: $.extend(settings.data, {}),
                    headers: $.extend(settings.headers, {'bossToken': $.cookie(adminConfig.tokenName()), 'deviceSource': adminConfig.deviceSource()}),
                    xhrFields: $.extend(settings.xhrFields, {withCredentials: true}),
                    dataType: settings.dataType || 'json',
                    contentType: settings.contentType || "application/x-www-form-urlencoded; charset=UTF-8",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(result) {
                        if (util.isSuccess(result)) {
                            settings.success(result);
                        } else {
                            util.error(result);
                            if (settings.notSuccess) {
                                settings.notSuccess(result);
                            }
                        }
                    },
                    error:
                        function (error) {
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
            };
            /** 编辑窗口 */
            util.adminEdit = function(title, url, data, w, h) {
                if(title == null || title == '') {
                    title = false;
                };
                if(url == null || url == '') {
                    url = "404.html";
                };
                if(w == null || w == '') {
                    w = ($(window).width() * 0.9);
                };
                if(h == null || h == '') {
                    h = ($(window).height() - 50);
                };
                layer.open({
                    type: 2,
                    area: [w + 'px', h + 'px'],
                    fix: false, //不固定
                    maxmin: true,
                    shadeClose: true,
                    shade: 0.4,
                    title: title,
                    content: url,
                    success: function(layero, index) {
                        //向iframe页的id=house的元素传值  // 参考 https://yq.aliyun.com/ziliao/133150
                        var body = layer.getChildFrame('body', index);
                        var form = body.contents().find('.layui-form');
                        for (var item in data) {
                            form.append(`<input type="hidden" name="${ item }" id="${ item }" value="${ data[item] }" />`);
                        }

                        layui.use(['form'], function() {
                            layui.form.render();
                        });
                    },
                    error: function(layero, index) {
                        alert('layui open error.');
                    }
                });
            };
            return util;
        })
);