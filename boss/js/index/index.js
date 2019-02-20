$(function ($, window) {
    // 获取菜单
    function menu() {
        util.ajax({
            url: adminConfig.srvUrl() + '/user/sys/menu',
            method: 'get',
            success: (result) => {
                // 写入菜单
                var menus = result.content;
                $.each(menus, function (index, menu) {
                    appendMenu("#nav", menu);
                });

                // 应用样式
                layui.use(['jquery','admin'], function(){});
            }
        });
    }

    // 生成菜单
    function appendMenu(dom, /** JSON */menu) {
        $(dom).append(
            '<li class=' + menu.code + '>' +
            '<a _href="' + ((menu.url != null && menu.url !== '') ? menu.url : 'javascript:;') + '">' +
            '   <i class="iconfont">' + ((menu.icon != null && menu.icon !== '') ? menu.icon : '') + '</i>' +
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

    // 查看信息
    $("#userInfo").on("click", function () {
        util.adminEdit('查看', './user.html', {}, 450, 500);
    });

    // 退出登录
    $("#logOut").on("click", function () {
        util.ajax({
            url: adminConfig.srvUrl() + '/sys/logout',
            method: 'get',
            success: (result) => {
                $.removeCookie(`${adminConfig.tokenName()}`);
                window.location.href = './login.html';
            }
        });
    });

    // 菜单生成
    menu();

}($, window));