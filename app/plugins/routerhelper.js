/**
 * Created by Administrator on 2016/1/4.
 */
define(function (require, exports, module) {
    const common = require("common");
    const bodyView = $("body");

    const RouterHelper = {

        /* save browser relative parameters such as phone type,useragent  */
        saveBrowserInfo:function () {
            common.browserInfo["phoneType"] =       $.getDeviceType();
            common.browserInfo["userAgent"] =       navigator.userAgent;
            common.browserInfo["userLanguage"] =    navigator.language;
            common.browserInfo["serverVersion"] =   $.getAppVersion();
        },

        /*save native relative parameters*/
        saveNativeParam:function () {
            //custom logic
        },

        /*uid  format space*/
        formatSpace: function(tempStr) {
            return tempStr.replace("\u0000","").replace("%00","").replace('platid','').replace(' ','');
        },

        /*initialize app */
        initAppView : function () {
            if($.isEmpty(bodyView.data("isload"))){
                const appView = require("../views/app");
                new appView();
            }
        },

        /*get current server url*/
        getCurrentServerUrl:function () {
            //custom logic
        },

        /*set server url*/
        setServerUrl : function (tempZone) {
            common.tradeServer = common.serverList[common.environment]["tradeServer" + tempZone];
            return false;
        }

    };

    /*global function set user customerNo*/
    window.setCustomerNo = function(customerNo){
        //custom logic
    };

    module.exports = RouterHelper;

});