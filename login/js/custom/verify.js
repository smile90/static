(
    function (window, factory) {
        window.verify = factory(window, {}, window.$);                // 直接引入的话就设为全局变量
    }
    (
        window, function (global, verify, $) {
            verify.phone = function (value) {
                var regexp = /^(((13[0-9])|(14[0-9])|(15[0-9])|17[0-9])|(18[0,5-9]))\d{8}$/;
                return verify.regexp(value, regexp);
            };
            verify.email = function (value) {
                var regexp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return verify.regexp(value, regexp);
            };
            verify.url = function (value) {
                var regexp = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
                return verify.regexp(value, regexp);
            };
            verify.identity = function (value) {
                var regexp = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
                return verify.regexp(value, regexp);
            };
            verify.date = function (value) {
                var regexp = /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;
                return verify.regexp(value, regexp);
            };
            verify.number = function (value) {
                if (!value||isNaN(value)) {
                    return false;
                } else {
                    return true;
                }
            };

            /*正则表达式校验*/
            verify.regexp = function(value, regexp) {
                if(new RegExp(regexp).test(value)){
                    return true;
                } else {
                    return false;
                }
            }
            return verify;
        }
    )
);

// 生成
$(function () {
    layui.use(['form'], function() {
        layui.form.verify({
            checked: function(value, item) { //value：表单的值、item：表单的DOM对象
                if ($(item).children('input:checked').length <= 0) {
                    return '必选项不能为空';
                }
            },
            phone: function(value, item) {
                if (value != null && value != '') {
                    if(!verify.phone(value)){
                        return '手机号格式不正确';
                    }
                }
            },
            email: function(value, item) {
                if (value != null && value != '') {
                    if(!verify.email(value)){
                        return '邮箱格式不正确';
                    }
                }
            },
            url: function(value, item) {
                if (value != null && value != '') {
                    if(!verify.url(value)){
                        return '链接格式不正确';
                    }
                }
            },
            identity: function(value, item) {
                if (value != null && value != '') {
                    if(!verify.identity(value)){
                        return '身份证格式不正确';
                    }
                }
            },
            date: function(value, item) {
                if (value != null && value != '') {
                    if(!verify.date(value)){
                        return '日期格式不正确';
                    }
                }
            },
            number: function(value, item) {
                if (value != null && value != '') {
                    if (!verify.number(value)) {
                        return '只能填写数字';
                    }
                }
            }
        });
    });
});