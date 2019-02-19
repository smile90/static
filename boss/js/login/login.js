$(function ($, window) {
    // 登录页面清除所有session信息
    // sessionStorage.clear();

    // 刷新验证码
    function validCode() {
        $("#validCode").attr('src', adminConfig.srvUrl() + '/user/validCode/login');
    }

    // 登录请求
    function login(data) {
        util.ajax({
            url: adminConfig.srvUrl() + '/sys/login',
            method: 'post',
            data: data.field,
            success: (result) => {
                $.cookie(adminConfig.tokenName(), result.content.token, {path: adminConfig.cookiePath()});
                window.location.href = './index.html';
            },
            notSuccess: (result) => {
                $("#validCode").click();
            }
        });
    }

    // 回车登录
    $(document).on("keydown", function (event) {
        if (event.keyCode == 13) {
            $("#loginBtn").click();
        }
    });

    // 更换验证码
    validCode(); // 进入页面自动刷新
    $("#validCode").on("click", function () {
        validCode();
    });

    // 登录
    layui.use('form', function () {
        let form = layui.form;
        // 监听提交
        form.on('submit(login)', function (data) {
            login(data);
            return false;
        });
    });
}($, window));
