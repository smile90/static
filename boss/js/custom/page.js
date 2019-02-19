(
    function (window, factory) {
        window.page = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, page, $) {
            /**
             * 初始化默认
              * @param settings
             */
            page.initDefault = function (settings) {
                var deleteUrl = settings.deleteUrl;
                var detail = settings.detail;

                layui.use(['table', 'admin'], function() {
                    layui.table.on('tool(table)', function(obj){
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        if(layEvent === 'detail') { // 查看
                            util.adminEdit('查看', detail.htmlUrl, {
                                id: obj.data.id,
                                event: 'detail'
                            }, detail.width, detail.height);
                        } else if(layEvent === 'edit'){ // 编辑
                            util.adminEdit('编辑', detail.htmlUrl, {
                                id: obj.data.id,
                                event: 'edit'
                            }, detail.width, detail.height);
                        } else if(layEvent === 'del'){ // 删除
                            layer.confirm('确认删除么？', function(index){
                                util.ajax({
                                    url: adminConfig.srvUrl() + deleteUrl + '/' + obj.data.id,
                                    method: 'delete',
                                    success: (result) => {
                                        $("#tableSearch form").submit();
                                        // 关闭窗口
                                        layer.close(index);
                                    }
                                });
                            });
                        }
                    });

                    layui.table.on('toolbar(table)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                        var data = obj.data; // 获得当前行数据
                        var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                        if(layEvent === 'save'){ // 新增
                            util.adminEdit('新增', detail.htmlUrl, {
                                event: 'save'
                            }, detail.width, detail.height);
                        } else if(layEvent === 'del'){ // 删除
                            layer.confirm('确认删除么？', function(index){
                                var checkStatus = layui.table.checkStatus('table');
                                if (checkStatus.data.length > 0) {
                                    var ids = [];
                                    $.each(checkStatus.data, function(index, value) {
                                        ids.push(value.id);
                                    });
                                    util.ajax({
                                        url: adminConfig.srvUrl() + deleteUrl,
                                        method: 'delete',
                                        data: {'ids': ids},
                                        success: (result) => {
                                            $("#tableSearch form").submit();
                                            // 关闭窗口
                                            layer.close(index);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            };

            /*构建分页*/
            page.pageTable = function (settings) {
                // 数据展示
                layui.use(['form', 'table'], function() {
                    // 执行渲染
                    var tableIns = layui.table.render({
                        elem: settings.elem
                        ,autoSort: false
                        ,headers: {'bossToken': $.cookie(adminConfig.tokenName()), 'deviceSource': adminConfig.deviceSource()}
                        ,url: settings.url
                        ,parseData: function(res) { //res 即为原始返回的数据
                            return {
                                "code": res.code, //解析接口状态
                                "msg": res.showMsg, //解析提示文本
                                "count": res.content != null ? res.content.total : 0, //解析数据长度
                                "data": res.content != null ? res.content.records : [] //解析数据列表
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
                        ,done: function(res, curr, count) {
                            // TODO 这里不知道为什么不行
                            // if (!util.isSuccess(res)) {
                            //     util.error(res);
                            // }
                        }
                    });

                    function searchParam() {
                        var searchObject = {};
                        $('.search').each(function (index, domEle) {
                            var $domEle = $(domEle);
                            var name = $domEle.attr('name');
                            var type = $domEle.attr('type');

                            if ($domEle.val() != null && $.trim($domEle.val()) !== '') {
                                if ('checkbox' === type) {
                                    if ($domEle.prop('checked')) {
                                        searchObject[name] = (searchObject[name] == null ? '' : searchObject[name]) + ',' + $domEle.val();
                                    }
                                } else if ('radio' === type) {
                                    if ($domEle.prop('checked') == true) {
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
            /*构建详情*/
            page.detail = function(settings) {
                var event = $('#event').val();
                if (event == 'detail') {
                    $('.submit').remove();
                }

                // form事件处理
                if (event != 'detail') {
                    layui.use('form', function(){
                        var form = layui.form;

                        //监听提交
                        form.on('submit(form)', function(data) {
                            var url = '';
                            if (event == 'edit') {
                                url = settings.editUrl;
                            } else if (event == 'save') {
                                url = settings.saveUrl;
                            }
                            var field = {};
                            for (var item in data.field) {
                                var value = data.field[item];
                                if (value != null && value != '') {
                                    field[item] = value;
                                }
                            }
                            util.ajax({
                                url: url,
                                method: 'post',
                                data: field,
                                success: (result) => {
                                if(util.isSuccess(result)) {
                                layer.msg('提交成功！');
                                setTimeout(function () {
                                    // var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                                    // parent.layer.close(index);
                                    parent.location.reload();
                                },1000);
                            } else {
                                util.error(result);
                            }
                        }
                        });
                            return false;
                        });
                    });
                }

                if (event != 'save') {
                    // 查询详细信息并回写
                    util.ajax({
                        url: settings.detailUrl,
                        method: settings.method || 'get',
                        success: (result) => {
                        if(util.isSuccess(result)) {
                        var readOnly = (event == 'detail') || false;

                        $('.value').each(function (index, domEle) {
                            var $domEle = $(domEle);

                            var type = $domEle.data('type');
                            if ('radio' == type) {
                                var value = result.content[$domEle.data('name')];
                                $domEle.children(`[value=${ value }]:input`).attr('checked', true);
                                if (readOnly) {
                                    $domEle.children(`:input`).attr('disabled', true);
                                }
                            } else if ('checkbox' == type) {
                                result.content[$domEle.data('name')].each(function(i, value) {
                                    $domEle.children(`[value=${ value }]:input`).attr('checked', true);
                                });
                                if (readOnly) {
                                    $domEle.children(`:input`).attr('disabled', true);
                                }
                            } else {
                                var value = result.content[$domEle.attr('name')];
                                $domEle.val(`${ value || '-'}`);
                                if (readOnly) {
                                    $domEle.attr('disabled', true);
                                }
                            }

                            layui.use(['form'], function() {
                                layui.form.render();
                            });
                        });
                    } else {
                        util.error(result);
                    }
                }
                });
                }
            };
            return page;
        })
);