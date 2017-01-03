/**
 * Created by Administrator on 2016/7/6.
 */
define(function (require,exports,module) {

    const common = require("common");

    (function($){

        //将Date型format成("yyyy年MM月dd日hh小时mm分ss秒");
        Date.prototype.format = function(format){
            /*
             * eg:format="YYYY-MM-dd hh:mm:ss";
             使用方法:
             var testDate = new Date();
             var testStr = testDate.format("yyyy年MM月dd日hh小时mm分ss秒");
             alert(testStr);
             */
            var o = {
                "M+" :  this.getMonth()+1,  //month
                "d+" :  this.getDate(),     //day
                "h+" :  this.getHours(),    //hour
                "m+" :  this.getMinutes(),  //minute
                "s+" :  this.getSeconds(), //second
                "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
                "S"  :  this.getMilliseconds() //millisecond
            }

            if(/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        };

        //timeoutFun 空函数用来填充某些逻辑
        var timeoutFun = function(){};

        // 侦听整个页面input的focus和blur事件，使其在转场的时候失去焦点
        var inputFocus = {
            init: function() {
                $("input").on("focus blur", this.inputEvents);
            },

            inputEvents: function(e) {
                if (e.type === "focus") {
                    inputFocus.isFocus = true;
                    inputFocus.elem = this;
                } else {
                    inputFocus.isFocus = false;
                    inputFocus.elem = null;
                }
            },
            isFocus: false,
            element: null
        };

        //转场动画变量
        var pageToVars = {
            current: null,
            target: null,
            type: null,
            callback: null,
            hover: null,
            pageRelative: 1,
            back: null,
            isCurrentPageFinish: false,
            isTargetPageFinish: false,
            timeout: 0,
            runTime: 0.4,
            ease: "ease-out",
            // 根据pid属性判断两个页面的关系
            // 1表示目标页为后页, -1表示目标页为前页, 0表示两页不在同一层级
            catchId: function(current, target){
                if (current && target) {

                    var _current = current.split('/'), _target = target.split('/');
                    if(_current.length != _target.length) {
                        if (current.indexOf(target) != -1)
                            return -1;
                        else if (target.indexOf(current) != -1)
                            return 1;
                        else
                            return 0;
                    }else{
                        if (_current.length > 2 && _current.slice(0, _current.length - 1) != _target.slice(0, _target.length - 1) && _target[_target.length - 1] - _current[_current.length - 1] == 0)
                            return 0;
                        else if (_target[_target.length - 1] - _current[_current.length - 1] > 0)
                            return 1;
                        else
                            return -1;
                    }
                }
            },
            start: function () {
                var _this = this;
                // 如果正在转场，不执行动画
                if ($.isPageMoving) {
                    return false;
                }

                $.isPageMoving = true;

                // 如果转场动画为none或者设备为android2.x|3.x
                if (_this.type == "none") {
                    this.end();
                    return false;
                }

                // 如果有高亮，添加
                if (_this.hover) {
                    clearTimeout(_this.hover.attr("hoverTimeout"));
                    _this.hover.removeAttr("hoverTimeout");
                    _this.hover.attr("hover", "on");
                }

                // 如果没有设置过back参数，判断两页面的关系

                if (_this.back === undefined) {
                    _this.pageRelative = _this.catchId(_this.current.data("pid"), _this.target.data("pid"));
                } else {
                    _this.pageRelative = _this.back ? -1 : 1;
                }


                // 初始化动画完成的布尔
                _this.isCurrentPageFinish = false;
                _this.isTargetPageFinish = false;

                // 开始做转场动画
                _this.current.css({"display": "block", "zIndex": "1", "opacity": "1"}).on("webkitAnimationEnd", pageToVars.onAnimateEnd);
                _this.target.css({"display": "block", "zIndex": "2", "opacity": "1"}).on("webkitAnimationEnd", pageToVars.onAnimateEnd);


                //开始定义动画
                var moveAnimateFrame = $("#_moveAnimateFrame_");
                if (moveAnimateFrame != null) {
                    moveAnimateFrame.remove();
                }

                var _styleCss = "<style id='_moveAnimateFrame_'>";

                switch (pageToVars.type) {
                    case "move":
                        pageToVars.runTime = 0.3;
                        pageToVars.ease = "ease-out";
                        if (pageToVars.pageRelative != -1) {
                            _styleCss += "@-webkit-keyframes pageAnimateRunCurrent { from {-webkit-transform: translate3d(0px, 0px, 0px);} to {-webkit-transform: translate3d(-100%, 0px, 0px);} }";
                            _styleCss += "@-webkit-keyframes pageAnimateRunTarget { from {-webkit-transform: translate3d(100%, 0px, 0px);} to {-webkit-transform: translate3d(0px, 0px, 0px);} }";
                        } else {
                            _styleCss += "@-webkit-keyframes pageAnimateRunCurrent { from {-webkit-transform: translate3d(0px, 0px, 0px);} to {-webkit-transform: translate3d(100%, 0px, 0px);} }";
                            _styleCss += "@-webkit-keyframes pageAnimateRunTarget { from {-webkit-transform: translate3d(-100%, 0px, 0px);} to {-webkit-transform: translate3d(0px, 0px, 0px);} }";
                        }
                        break;
                    case "fade":
                        pageToVars.runTime = 0.3;
                        pageToVars.ease = "ease-out";
                        _styleCss += "@-webkit-keyframes pageAnimateRunCurrent { from {opacity: 1;} to {opacity: 0;} }";
                        _styleCss += "@-webkit-keyframes pageAnimateRunTarget { from {opacity: 0;} to {opacity: 1;} }";
                        break;
                }

                _styleCss += "</style>";

                $("head").append(_styleCss);

                // 添加animation样式，动画形式为scale或poker时，target暂时不添加，并隐藏
                var vendor = $.getBrowserVendor();

                switch (_this.type) {
                    default:
                        _this.current.css("-" + vendor + "-animation", "pageAnimateRunCurrent " + pageToVars.runTime + "s " + pageToVars.ease);
                        if (_this.type !== "scale" && _this.type !== "poker") {
                            _this.target.css("-" + vendor + "-animation", "pageAnimateRunTarget " + pageToVars.runTime + "s " + pageToVars.ease);
                        } else {
                            _this.target.hide();
                        }

                        break;
                }

                // 动画安全锁，2秒后动画未结束，自动结束
                clearTimeout(_this.timeout);

                var animateTime;
                switch (_this.type) {
                    default:
                        animateTime = 2000;
                        break;
                }

                _this.timeout = setTimeout(function () {
                    if ($.pageToing) {
                        pageToVars.current.off("webkitAnimationEnd", pageToVars.onAnimateEnd);
                        pageToVars.target.off("webkitAnimationEnd", pageToVars.onAnimateEnd);
                        pageToVars.end();
                    }
                }, animateTime);

            },
            onAnimateEnd: function(e) {
                if (e.type === "webkitAnimationEnd") {
                    // 如果事件对象是current，说明current的动画已经完成
                    // current隐藏，删除侦听，并删除动画时添加的样式
                    // 如果转场动画为scale或poker，执行下半部分动画
                    if (e.target == pageToVars.current[0]) {
                        pageToVars.isCurrentPageFinish = true;
                        pageToVars.current.hide();
                        pageToVars.current.off("webkitAnimationEnd", pageToVars.onAnimateEnd);
                        if (pageToVars.isTargetPageFinish) {
                            pageToVars.end();
                        }
                    } else if (e.target == pageToVars.target[0]) {
                        pageToVars.isTargetPageFinish = true;
                        pageToVars.target.off("webkitAnimationEnd", pageToVars.onAnimateEnd);
                        if (pageToVars.isTargetPageFinish) {
                            pageToVars.end();
                        }
                    }

                }
            },
            end: function() {
                if ($.isPageMoving) {
                    $.isPageMoving = false;

                    // 如果有高亮，去除
                    if (this.hover) {
                        this.hover.removeAttr("hover");
                    }

                    var vendor = $.getBrowserVendor();

                    // 去除动画样式
                    pageToVars.current.removeCss("-" + vendor + "-animation");
                    pageToVars.target.removeCss("-" + vendor + "-animation");

                    // 转出去的页隐藏，转进来的页显示
                    this.current.hide();
                    this.target.show();

                    // 如果有回调函数，回调
                    if (this.callback) {
                        this.callback();
                    }
                }
            }
        };

        $.extend($,{

            /*get device system type name*/
            getDeviceType: function() {
                if ($.os.android)
                    return "android";
                else if ($.os.ios)
                    return "ios";
                else if(navigator.userAgent.indexOf('MicroMessenger') > -1)
                    return "weixin";
                else if (!$.os.phone && !$.os.tablet)
                    return "windows";
            },

            isEmpty: function(value, allowEmptyString){
                return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0) || (value == "(null)");
            },

            isInApp:function () {
                return true;
            },

            /*get app version*/
            getAppVersion: function () {
                return "1.0.0";
            },

            /*get native param*/
            getViewPageParam : function(){
                if(location.href.indexOf('?') > 0){
                    var pairs = location.search.substring(1).split('&');
                    var param = this.saveSplitNativeParam(pairs);
                    return param;

                }
                else if(location.href.indexOf('#') > 0){
                    var pairs = location.hash.slice(1).split('&');
                    var param = this.saveSplitNativeParam(pairs);
                    return param;
                }
            },

            /*save native param*/
            saveSplitNativeParam:function (pairs) {
                var param = {};
                pairs.forEach(function(pair){
                    pair = pair.split('=');

                    if(pair.length > 2){
                        pair.forEach(function (item,i) {
                            if(i > 1) {
                                pair[1] = pair[1] + "=" + pair[i];
                            }
                        });
                    }

                    param[pair[0]] = decodeURIComponent(pair[1] || '');
                });

                return param;
            },

            /*change page to another*/
            movePageTo:function(start, end, animate, callback,hoverBtn,isBack){
                start.pageTo({
                    target:     end,
                    type:       animate,
                    hover:      hoverBtn,
                    back:       isBack,
                    callback:   callback
                });
                return false;
            },

            height:function(){
                return (window.webviewHeight && window.webviewHeight / window.devicePixelRatio) || (document.documentElement.offsetHeight);
            },

            getBrowserVendor:function(){
                return (/webkit/i).test(navigator.appVersion) ? 'webkit' :
                    (/firefox/i).test(navigator.userAgent) ? 'Moz' :
                        (/trident/i).test(navigator.userAgent) ? 'ms' :
                            'opera' in window ? 'O' : '';
            },

            cookie:function (key, value, options) {

                var days, time, result, decode;

                if (arguments.length > 1 && String(value) !== "[object Object]") {

                    options = $.extend({}, options);

                    if (value === null || value === undefined) options.expires = -1;

                    if (typeof options.expires === 'number') {
                        days = (options.expires * 24 * 60 * 60 * 1000);
                        time = options.expires = new Date();

                        time.setTime(time.getTime() + days)
                    }

                    value = String(value);

                    return (document.cookie = [
                        encodeURIComponent(key), '=',
                        options.raw ? value : encodeURIComponent(value),
                        options.expires ? '; expires=' + options.expires.toUTCString() : '',
                        options.path ? '; path=' + options.path : '',
                        options.domain ? '; domain=' + options.domain : '',
                        options.secure ? '; secure' : ''
                    ].join(''))
                }

                options = value || {};

                decode = options.raw ? function (s) { return s } : decodeURIComponent;

                return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
            },


            hideMask:function(){

                var loadingMaskUI = $("#_loadingMaskUI_");
                loadingMaskUI.css("display","none");
                clearTimeout(timeoutFun);

            }


        });

        $.extend($.fn, {

            pageTo: function(event) {
                // 如果在转场时有input的获焦状态，则取消
                if (inputFocus.isFocus) {
                    $(inputFocus.element).blur();
                    inputFocus.isFocus = false;
                    inputFocus.element = null;
                }

                if (event) {
                    if (event.target) {
                        pageToVars.current = this;
                        pageToVars.target = event.target;
                        pageToVars.type = event.type;
                        pageToVars.callback = event.callback;
                        pageToVars.hover = event.hover;
                        pageToVars.back = event.back;
                        pageToVars.start();
                    }
                }

            },

            removeCss: function(cssKey) {
                if (cssKey) {
                    this.css(cssKey, "");
                    if (this.css(cssKey) == null)
                        this.removeAttr("style");
                }
                else
                    this.removeAttr("style");

                return this;
            }


        });




        $.extend($,{

            initAlertMask:function(){

                var alertMaskerUI = $("#_alertMaskerUI_");
                if(alertMaskerUI != null) {
                    alertMaskerUI.remove();
                }

                var alertMaskhtml=
                    '<div class="alertMasker" id="_alertMaskerUI_">'+
                    '<div>'+
                    '<div class="alert">'+
                    '<div class="inner">'+
                    '<h2>温馨提示</h2>'+
                    '<p></p>'+
                    '<footer>' +
                    '<a href="javascript:void(0);" class="button" for="yes" >确定</a>' +
                    '</footer>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';

                $("body").append(alertMaskhtml);

            },

            alertWindow:function(txt,callback,option){

                $("input").blur();
                var _this = this;
                var target = $("#_alertMaskerUI_");

                if(target.is(":visible"))
                     return false;

                var tempTxt = txt ? txt : "";
                var tempCallback = callback ? callback :function(){};

                var btnTxt = option ?  option : "确定" ;
                target.find(".button").html(btnTxt);
                if(option) target.find("h2").remove();

                target.show();
                target.find("p").html(tempTxt);
                target.find(".alert").addClass("show");

                var tempTapFun = function(){
                    _this.closeAlertWindow();
                    tempCallback();
                };

                var btn = target.find(".button[for=yes]");
                //btn.off("tap").on("tap",tempTapFun);
                btn.off("click").on("click",tempTapFun);
            },

            closeAlertWindow:function(){
                var target = $("#_alertMaskerUI_");
                target.hide();
                target.find(".alert").removeClass("show");
            },

            initConfirmMask:function(){

                var confirmMaskerUI = $("#_confirmMaskerUI_");

                if(confirmMaskerUI != null)
                    confirmMaskerUI.remove();

                var confirmMaskhtml=
                    '<div class="confirmMasker" id="_confirmMaskerUI_">'+
                    '<div>'+
                    '<div class="confirm">'+
                    '<div class="inner">'+
                    '<h2>温馨提示</h2>'+
                    '<p></p>'+
                    '<footer>' +
                    '<a href="javascript:void(0)" class="button" id="confirmCon" for="yes" >确定</a>' +
                    '<a href="javascript:void(0)" class="button" id="confirmCancel" for="no" >取消</a>' +
                    '</footer>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';

                $("body").append(confirmMaskhtml);

            },

            confirmWindow:function(txt,yesCallback,noCallback,option){
                var _this = this;
                var target = $("#_confirmMaskerUI_");
                if(target.is(":visible"))
                    return false;

                var tempTxt = txt ? txt : "";
                var tempYesCallback = yesCallback ? yesCallback :function(){};
                var tempNoCallback = noCallback ? noCallback :function(){};

                target.show();
                target.find("p").html(tempTxt);
                target.find(".confirm").addClass("show");

                var tempYesTapFun = function(){
                    _this.closeConfirmWindow();
                    tempYesCallback();
                };

                var tempNoTapFun = function(){
                    _this.closeConfirmWindow();
                    tempNoCallback();
                };


                var yesBtn = target.find(".button[for=yes]");
                var closeBtn= target.find("#a_close");

                yesBtn.off("tap").on("tap",tempYesTapFun);
                closeBtn.off("tap").on("tap",_this.closeConfirmWindow);

                var noBtn = target.find(".button[for=no]");
                noBtn.off("tap").on("tap",tempNoTapFun);

                switch (option) {
                    default:
                        yesBtn.find("label").html("确定");
                        noBtn.find("label").html("取消");
                        break
                }

                return false;


            },

            closeConfirmWindow:function(){
                var target = $("#_confirmMaskerUI_");
                target.hide();
                target.find(".confirm").removeClass("show");
            }

        });

        $.initAlertMask();
        $.initConfirmMask();



        $.extend($,{

            initLoadingMask:function(){
                var loadingMaskUI = $("#_loadingMaskUI_");
                if(loadingMaskUI != null)
                    loadingMaskUI.remove();

                var _uihtml =
                    "<div id='_loadingMaskUI_'>" +
                    "<div class='inner'>" +

                    '<div class="loadWrap loadShow">'+
                    '<div class="loadInner">'+
                    '<div class="loadIcon">'+
                    '<span class="load_circle loadAnimateInfinite"></span>'+
                    '<img class="lognPNG" src="data:image/gif;base64,R0lGODlhZABkAIABAP///////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NTlBQTMxNjQ0RjAxMUU2Qjg2Q0NBN0NGNEFEMzk1RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NTlBQTMxNTQ0RjAxMUU2Qjg2Q0NBN0NGNEFEMzk1RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUNFNzU5QzlERTg2MTFFNUFGMzhENDI5Qjk0RjY0REQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUNFNzU5Q0FERTg2MTFFNUFGMzhENDI5Qjk0RjY0REQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAABACwAAAAAZABkAAAC/4yPqcvtD6OctNqLs968+w+G4kiW5kkCB6Ci7sWu8UtLbBvc9e7ohp/jCXPAW2s2pBllOmDyZMRFf8hnakpdEnHWUBT5zXK7nS84vB2TM+YzFrvGtIvotDoOmWvn4iq+p0dn1nf3hxAIx0douIAIZ6cFyXjomKgIWWhVOcjEiRm3qdfZNurHExpIKUqYaYJaWepJ6vIaqrqK2apRy3t7mQvCK1zl6Bu5MSxsPMtqCpNcu8ycq2sDjSo9jSt3bZvtSV390L2ZgB3rZEEO+w2eyrb+jr4t/xwP3lxfr35fN6+/jV+/dOHo7asw0Jmyf84mDGQwrJ24Bv0gLmQ40SI5iu8RMWZs1I1jR4+7oAFKZg5RyYsgTUps6DDaSZceP7ZkN5NmPn/2VI6Ll7LYyoAaN74kKJBnzpBHbRZFKnJdUKHIoC69psDbkIdNnXq5l7VckopTqQoBW9bsKaBpfW6V2vbgDrhdrSrBGvbcE7xx3Y5FmfdVF8B9/e7tFVgwGcSF1f7VW1fpYbGJFa/R2tixJs0FOU8mWhP05l+VZf4hXRoyHnxPTRt6dFX1apg3XU9COPI2bsa6k8rubc0ycN84h+/GbJzC7+TBPTP/6fw5dNHSm0+rTvwY9p6wt2f3zqE7+J7jy3gtjz69+vXs268vAAA7" />'+
                    '</div>'+
                    '<div class="loadContent">'+
                    '<p>加载中...</p>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+

                    "</div>" +
                    "</div>";



                $("body").append(_uihtml);
            },

            load: function(txt) {
                $("#_loadingMaskUI_ div[ui]").hide();
                $("#_loadingMaskUI_ ._maskload_").show().find("span").html(txt);
            },

            hardLoad:function(txt,callback){
                var loadingMaskUI = $("#_loadingMaskUI_");
                if(loadingMaskUI.is(":visible"))
                    return false;

                var _this = this;
                _this.load(txt ? txt : "加载中");

                loadingMaskUI.css({"display": "table", "background": "rgba(0,0,0,0)"});

                var tempCustomFun = callback ? callback : function(){_this.alertWindow("系统繁忙，请稍后重试");};

                var tempCallback = function(){
                    _this.hideMaskForce();
                    tempCustomFun();
                };

                clearTimeout(timeoutFun);
                timeoutFun = setTimeout(tempCallback, 30000);
            },

            hideMaskForce : function(){
                var loadingMaskUI = $("#_loadingMaskUI_");
                loadingMaskUI.css("display","none");
                clearTimeout(timeoutFun);
            }

        });

        $.initLoadingMask();



        window.$ = Zepto;
    })(Zepto);

});

