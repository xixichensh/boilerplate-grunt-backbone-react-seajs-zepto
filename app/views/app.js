/**
 * Created by Administrator on 2016/11/16 0016.
 */
define(function(require, exports, module) {

    const common = require('common');
    const appModel = require("../models/app");
    const viewHelper = require("viewhelper");
    const loadMask = $("#loadingContent");

    const AppView = Backbone.View.extend({

        el: "body",

        events: {},

        templates: {

        },

        initialize: function() {
            const _this = this;

            _this.$el.on("initIndexView", function() {
                const target = $("#indexView");
                if($.isEmpty(target.data("isload"))) {
                    require.async("./index", function (indexView) {
                        new indexView();
                        loadMask.remove();
                    });
                }
                else {
                    loadMask.remove();
                }



            });

            _this.render();
        },

        render: function() {
            const _this = this;

            _this.$el.data("isload","true");
        }

    });

    module.exports = AppView;
});