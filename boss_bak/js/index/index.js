$(function ($, window) {
    // 获取菜单
    function menu() {
        adminConfig.ajax({
            url: `${adminConfig.srvUrl()}/sys/menu`,
            method: 'get',
            success: (result) => {
                console.info(result);
                if (result.code == '000000000000') {
                    var menus = result.content;
                    // 写入菜单
                    $.each(menus, function (index, menu) {
                        appendMenu("#nav", menu);
                    });
                } else {
                    layui.use('layer', function () {
                        layui.layer.msg(result.showMsg);
                    });
                }
            }
        });
    }

    // 生成菜单
    function appendMenu(dom, /** JSON */menu) {
        $(dom).append(
            '<li class=' + menu.code + '>' +
            '<a _href="' + ((menu.url != null && menu.url !== '') ? menu.url : 'javascript:;') + '">' +
            '   <i class="iconfont">' + ((menu.icon != null && menu.icon !== '') ? menu.icon : '&#xe6a7;') + '</i>' +
            '   <cite>' + (menu.name != null ? menu.name : '') + '</cite>' +
            (!$.isEmptyObject(menu.children) ?  '   <i class="iconfont nav_right">&#xe697;</i>' : '') +
            '</a>' +
            '</li >'
        );
        if (!$.isEmptyObject(menu.children)) {
            $(dom + ' li.' + menu.code).append('<ul class="sub-menu ' + menu.code + '"></ul>');
            $.each(menu.children, function (childIndex, childMenu) {
                appendMenu(dom + ' li.' + menu.code + ' ul.' + menu.code, childMenu);
            });
        }
    }

    //退出登录
    $("#logOut").on("click", function () {
        adminConfig.ajax({
            url: `${adminConfig.srvUrl()}/sys/logout`,
            method: 'get',
            success: (result) => {
                console.info(result);
                if (result.code == '000000000000') {
                    $.removeCookie(`${adminConfig.tokenName()}`);
                    window.location.href = './login.html';
                } else {
                    layui.use('layer', function () {
                        layui.layer.msg(result.showMsg);
                    });
                }
            }
        });
    });

    menu();

}($, window));
