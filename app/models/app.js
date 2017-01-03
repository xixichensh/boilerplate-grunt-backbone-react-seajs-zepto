/**
 * Created by Administrator on 2016/3/8.
 */
define(function(require,exports,module){
    const common = require('common');

    const AppModel = {

        GetRouterData : function (data,tempUrl) {

            var defer = $.Deferred();

            data = $.extend({
                PhoneType:      common["browserInfo"].phoneType,
                Product:        common["browserInfo"].product,
                Location:       common["browserInfo"].userLanguage,
                Ip:             ""

            }, data || {});

            $.ajax({
                type: "POST",
                url: tempUrl,
                data: data,
                success: function (resultData) {
                    defer.resolve(result);
                },
                error: defer.reject
            });

            return defer.promise();
        }

    };

    module.exports = AppModel;
});