(
    function (window, factory) {
        window.verify = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, verify, $) {
            // verify.verifyCard = function (cardNo) {}
            return verify;
        }
    )
);

// 生成
$(function () {
    layui.use(['form'], function() {
        layui.form.verify({
            checked: function(value, item){ //value：表单的值、item：表单的DOM对象
                if ($(item).children('input:checked').length <= 0) {
                    return '必选项不能为空';
                }
            }
        });
    });
});