(
    function (window, factory) {
        window.pageConfig = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, pageConfig, $) {
            /* 构建分页 */
            pageConfig.pageTable = function (settings) {
                // 数据展示
                layui.use(['form', 'table'], function() {
                    // 执行渲染
                    var tableIns = layui.table.render({
                        elem: settings.elem
                        ,autoSort: false
                        ,headers: {'token': $.cookie(adminConfig.tokenName())}
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
                            pageName: 'current' // 页码的参数名称
                            ,limitName: 'size' // 每页数据量的参数名
                        }
                        ,height: settings.height || 523
                        ,cols: settings.cols
                        ,toolbar: settings.toolbar
                        ,page: true //开启分页
                        ,layout: ['count', 'prev', 'page', 'next', 'skip', 'limit', 'refresh']
                        ,limit: settings.limit || 10
                        ,limits: [10, 20, 30, 40, 50]
                    });

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
            /* 查询参数 */
            pageConfig.searchParam = function() {
                var searchObject = {};
                $('.search').each(function (index, domEle) {
                    var $domEle = $(domEle);
                    if ($domEle.val() != null && $.trim($domEle.val()) !== '') {
                        searchObject[$domEle.attr('name')] = $domEle.val();
                    }
                });
                return searchObject;
            };

            return pageConfig;
        })
);