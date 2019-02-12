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
                var _settings = {
                    url: settings.url,
                    method: settings.method,
                    data: $.extend(settings.data, {}),
                    headers: $.extend(settings.headers, {'token': $.cookie(adminConfig.tokenName()), 'deviceSource': adminConfig.deviceSource()}),
                    xhrFields: $.extend(settings.xhrFields, {withCredentials: true}),
                    dataType: 'json',
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    success: function(result) {
                        if (util.isSuccess(result)) {
                            settings.success(result);
                        } else {
                            settings.notSuccess(result);
                            util.error(result);
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
            /*构建分页*/
            util.pageTable = function (settings) {
                // 数据展示
                layui.use(['form', 'table'], function() {
                    // 执行渲染
                    var tableIns = layui.table.render({
                        elem: settings.elem
                        ,autoSort: false
                        ,headers: {'token': $.cookie(adminConfig.tokenName()), 'deviceSource': adminConfig.deviceSource()}
                        ,url: settings.url
                        ,parseData: function(res) { //res 即为原始返回的数据
                            return {
                                "code": res.code, //解析接口状态
                                "msg": res.showMsg, //解析提示文本
                                "count": res.content.total, //解析数据长度
                                "data": res.content.records //解析数据列表
                            };
                        }
                        ,request: {
                            pageName: 'page.current' // 页码的参数名称
                            ,limitName: 'page.size' // 每页数据量的参数名
                        }
                        ,height: settings.height || 'full'
                        ,even: true //开启隔行背景
                        ,size: 'sm' //小尺寸的表格
                        ,cols: settings.cols
                        ,toolbar: settings.toolbar
                        ,page: true //开启分页
                        ,layout: ['count', 'prev', 'page', 'next', 'skip', 'limit', 'refresh']
                        ,limit: settings.limit || 10
                        ,limits: [10, 20, 30, 40, 50]
                    });

                    function searchParam() {
                        var searchObject = {};
                        $('.search').each(function (index, domEle) {
                            var $domEle = $(domEle);
                            var name = $domEle.data('name');
                            var type = $domEle.data('type');

                            if ($domEle.val() != null && $.trim($domEle.val()) !== '') {
                                if ('checkbox' === type) {
                                    if ($domEle.prop('checked')) {
                                        searchObject[name] = (searchObject[name] == null ? '' : searchObject[name]) + ',' + $domEle.val();
                                    }
                                } else if ('radio' === type) {
                                    if ($domEle.prop('checked')) {
                                        searchObject[name] = $domEle.val();
                                    }
                                } else {
                                    searchObject[name] = $domEle.val();
                                }
                            }
                        });
                        return searchObject;
                    }

                    // 监听查询事件
                    layui.form.on('submit()', function(data){
                        tableIns.reload({
                            where: searchParam() // 重新获取条件
                            ,page: {
                                curr: 1 // 重新从第 1 页开始
                            }
                        });
                        return false;
                    });

                    // 监听排序事件
                    layui.table.on('sort()', function(obj){
                        var where = searchParam();
                        if (obj.type != null) {
                            where[obj.type] = obj.field;
                        }
                        tableIns.reload({where: where});
                    });
                });
            };
            return util;
        })
);