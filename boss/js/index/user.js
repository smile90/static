$(function ($, window) {
    util.ajax({
        url: adminConfig.srvUrl() + '/user/sys/userInfo',
        method: 'get',
        success: (result) => {
            $('.value').each(function (index, domEle) {
                var $domEle = $(domEle);

                var value = result.content[$domEle.attr('name')];
                $domEle.val(`${ value || ''}`);
            });
        }
    });
}($, window));