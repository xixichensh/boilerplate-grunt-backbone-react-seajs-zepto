/**
 * Created by sue on 2016/7/15.
 */

define(function(require,exports,module){
    require("backbone");
    require("react");
    require("react-dom");
    require('core');
    require('viewhelper');

    const routerHelper = require("routerhelper");
    const common = require("common");
    const bodyView = $("body");

    const RouteWorkSpace = Backbone.Router.extend({

        routes:{
            "*filter":              "routeStart"
        },

        routeStart:function(){

            /* get native parameters */
            common.nativeParam = {};
            common.nativeParam = $.getViewPageParam();

            /* save browser parameters */
            routerHelper.saveBrowserInfo();

            /* save native parameters */
            routerHelper.saveNativeParam();

            /*get current server url*/
            routerHelper.getCurrentServerUrl();

            /*initialize app view*/
            routerHelper.initAppView();

            /*判断去到到页面类型*/
            var goPage = (!$.isEmpty(common.nativeParam) && !$.isEmpty(common.nativeParam["goPage"])) ? common.nativeParam["goPage"] : "";

            /* navigator view router */
            switch (goPage){
                default:
                    this.indexView();
                    break;
            }

        },

        indexView:function () {
            bodyView.trigger("initIndexView");
            $("#indexView").show();
        }


    });

    new RouteWorkSpace();
    Backbone.history.start();

    module.exports = RouteWorkSpace;
});
