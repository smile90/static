(
    function (window, factory) {
        window.dictUtil = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, dictUtil, $) {
            /* 获取字典 */
            dictUtil.getDict = function (name) {
                if (name === 'DataStatus') {
                    return {
                        NORMAL: '正常',
                        DISABLE: '禁用',
                        DELETED: '删除'
                    };
                } else if (name === 'UserStatus') {
                    return {
                        NORMAL: '正常',
                        UNREVIEW: '未审核',
                        REVIEWING: '审核中',
                        UNAPPROVED: '未审核通过',
                        DISABLE: '禁用',
                        LOCKED: '锁定',
                        EXPIRED: '失效（过期）',
                        DELETED: '删除'
                    };
                } else if (name === 'YesNo') {
                    return {
                        Y: '是',
                        N: '否'
                    };
                }
            };
            /* 获取字典指定值 */
            dictUtil.getValue = function (name, key) {
                return dictUtil.getDict(name)[key];
            };
            return dictUtil;
        }
    )
);

// 生成
$(function () {
    $('[data-dict]').each(function (index, domEle) {
        var html = '';
        var $domEle = $(domEle);

        var name = $domEle.data('name');
        var type = $domEle.data('type');
        var dict = dictUtil.getDict($domEle.data('dict'));
        var search = $domEle.hasClass('search');

        // 下拉选择
        if ('select' === type) {
            $domEle.attr('name', name);
            for (var item in dict) {
                html += `<option value="${ item }">${ dict[item] }</option>`;
            }
        } else if ('checkbox' === type) {
            for (var item in dict) {
                html += `<input type="checkbox" lay-skin="primary" ${ search ? 'class="search"' : '' } name="${ name }" value="${ item }" title="${ dict[item] }">`;
            }
        } else if ('radio' === type) {
            for (var item in dict) {
                html += `<input type="radio" ${ search ? 'class="search"' : '' } name="${ name }" value="${ item }" title="${ dict[item] }">`;
            }
        }
        $domEle.append(html);
    });
    layui.use(['form'], function() {
        layui.form.render();
    });
});