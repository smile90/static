layui.use(['jquery'], function () {
    var $ = layui.jquery;
    $(function () {
        var login = $.cookie(`${adminConfig.tokenName()}`);
        if (login == null) {
            window.location.href = './login.html';
            return false;
        } else {
            return false;
        }
    });
});