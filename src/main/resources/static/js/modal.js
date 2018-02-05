(function($){
    $.fn.createModal = function(options,callback) {
        var opts = $.extend({}, $.fn.createModal.defaults, options);
        return this.each(function() {
            $this = $(this);

            var modalContainer = document.createElement("div"),
                modalBg = document.createElement("div"),
                modalContent = document.createElement("div");

            $(modalBg).css({
                "position": "absolute",
                "top": 0,
                "left": 0,
                "width": "100%",
                "height": "100%",
                "background-color": opts.background,
                "opacity": 0.1
            });

            $(modalContent).css({
                "position": "fixed",
                "background": "#0F688B",
                "width": opts.width,
                "height": opts.height,
                "left": ($(document).width() - parseInt(opts.width))/2,
                "top": "300px",
                "color": "white",
                "letter-spacing": "2px",
                "margin": "10px",
                "font-size": "14px"
            }).attr("id","modalContent");

            $(modalContainer).css({
                position: "fixed",
                width: "100%",
                height: $(document).height(),
				zIndex: 1100,
				left: 0,
				top: 0
            }).attr("id","modalContainer").append(modalBg).append(modalContent);//确定modalContainer的位置

            var writeModal = function(_$this){
                $(window).resize(function(){
                    $(modalContent).css({
                        "left": ($(window).width() - parseInt(opts.width))/2,
                        "top": ($(window).height() - parseInt(opts.height))/2
                    });
                    $(modalBg).css({
                        "height": $(document).height()
                    })
                });//窗口大小变化时,将弹窗移动到屏幕中间位置

                var getTitle = _$this.attr("data-title");
                if(getTitle){
                    $(modalContent).append(
                            "<h1 class='modal-title' control-move>" + _$this.attr("data-title") + "</h1>"
                    );
                }//获取data-title的值

                $(modalContent).append(
                    "<div class='modal-close close-pos-r-t'>X</div>"
                );

                if(_$this.attr("data-url")){
                    htmlobj = $.ajax({
                        url: _$this.attr("data-url"),
                        async:false
                    });
                    $(modalContent).append("<p>" + htmlobj.responseText + "</p>");//写入ajax请求得到的值
                }else {
                    if(opts.html == ""){
                        var getContent = _$this.html();
                        $(modalContent).append("<p>" + getContent + "</p>").append("<p>这种情况就是直接读取触发当前事件的元素的html代码</p>");
                    }else{
                        $(modalContent).append(opts.html);
                    }
                };

                $(modalContainer).prependTo("body");

                if(opts.bgClose){
                    $(modalBg).click(function(){
                        $(modalContent).empty();
                        $(modalContainer).remove();
                    });
                };
                $(".modal-close").click(function(){
                    $(modalContent).empty();
                    $(modalContainer).remove();
                });

                if(opts.move){
                    $(modalContent).find("[control-move]").css("cursor","move").on("mousedown",function(e){
                        /*$(this)[0].onselectstart = function(e) { return false; }*///防止拖动窗口时，会有文字被选中的现象(事实证明不加上这段效果会更好)
                        $(this)[0].oncontextmenu = function(e) { return false; }//防止右击弹出菜单
                        var getStartX = e.pageX,
                            getStartY =  e.pageY;
                        var getPositionX = $(modalContent).offset().left,
                            getPositionY = $(modalContent).offset().top;
                        $(document).on("mousemove",function(e){
                            var getEndX = e.pageX,
                                getEndY =  e.pageY;
                            $(modalContent).css({
                                left: getEndX-getStartX+getPositionX,
                                top: getEndY-getStartY+getPositionY
                            });
                        });
                        $(document).on("mouseup",function(){
                            $(document).unbind("mousemove");
                        })
                    });
                };
                if(opts.resizable){//设定弹窗是否可以拖动改变大小
                    var resizeControl = "<div class='resizable-e'></div>" +
                        "<div class='resizable-s'></div>" +
                        "<div class='resizable-w'></div>" +
                        "<div class='resizable-n'></div>" +
                        "<div class='resizable-en'></div>" +
                        "<div class='resizable-es'></div>" +
                        "<div class='resizable-wn'></div>" +
                        "<div class='resizable-ws'></div>";

                    var e = "resizable-e",
                        s = "resizable-s",
                        w = "resizable-w",
                        n = "resizable-n",
                        en = "resizable-en",
                        es = "resizable-es",
                        ws = "resizable-ws",
                        wn = "resizable-wn";

                    $(modalContent).append(resizeControl);

                    $("." + e + "," + "." + s + "," + "." + w + "," + "." + n + "," + "." + en + "," + "." + es + "," + "." + ws + "," + "." + wn).mousedown(function(ev){
                        var getStartX = ev.pageX,
                            getStartY = ev.pageY,
                            getWidth = $(modalContent).width(),
                            getHeight = $(modalContent).height(),
                            getLeft = $(modalContent).offset().left,
                            getTop = $(modalContent).offset().top;
                        $this = $(this);
                        $(document).mousemove(function(ev){
                            var getEndX = ev.pageX,
                                getEndY = ev.pageY;
                            var getOffsetX =getEndX -getStartX,
                                getOffsetY =getEndY -getStartY;
                            if($this.attr("class") == e){$(modalContent).css("width", getWidth + getOffsetX);}
                            else if($this.attr("class") == s){$(modalContent).css("height", getHeight + getOffsetY);}
                            else if($this.attr("class") == w){
                                $(modalContent).css({
                                    "width": getWidth - getOffsetX,
                                    "left": getLeft + getOffsetX
                                });
                            }else if($this.attr("class") == n){
                                $(modalContent).css({
                                    "height": getHeight - getOffsetY,
                                    "top": getTop + getOffsetY
                                });
                            }else if($this.attr("class") == en){
                                $(modalContent).css({
                                    "width": getWidth + getOffsetX,
                                    "height": getHeight - getOffsetY,
                                    "top": getTop + getOffsetY
                                });
                            }else if($this.attr("class") == es){
                                $(modalContent).css({
                                    "width": getWidth + getOffsetX,
                                    "height": getHeight + getOffsetY
                                });
                            }else if($this.attr("class") == ws){
                                $(modalContent).css({
                                    "width": getWidth - getOffsetX,
                                    "height": getHeight + getOffsetY,
                                    "left": getLeft + getOffsetX
                                });
                            }else if($this.attr("class") == wn){
                                $(modalContent).css({
                                    "width": getWidth - getOffsetX,
                                    "height": getHeight - getOffsetY,
                                    "left": getLeft + getOffsetX,
                                    "top": getTop + getOffsetY
                                });
                            }
                        });
                        $(document).mouseup(function(){
                            $(this).unbind("mousemove");
                        });
                    })
                };
                if(callback){
                    callback();
                };
                if(opts.addFunction){
                    opts.addFunction();
                };

            }


            //注意这个if...else中的内容基本上是一样的，只是为了防止出现奇葩在元素上写的onclick的方法时 出现无限循环
            writeModal($this);
        });
    };
    $.fn.createModal.defaults = {
        background: '#000000',
        width: '600px',
        height: '500px',
        html: "",
        move: true,
        resizable: true,
		bgClose: false,
		addFunction: function(){}
    };
})(jQuery);

function close(){
    $('#modalContent').empty();
    $('#modalContainer').remove();
}

// 信息提示框
function showMsg(msg,div) {
    if(div==undefined){
        $("body").createModal({
            background: "#fff",//设定弹窗之后的覆盖层的颜色
            width: "200px",//设定弹窗的宽度
            height: "auto",//设定弹窗的高度
            resizable: true,//设定弹窗是否可以拖动改变大小
            move: true,//规定弹窗是否可以拖动
            bgClose: true,//规定点击背景是否可以关闭
            html: "<p class='tipMsg'>" + msg + "</p>"
        },function(){
            window.setTimeout('close()',3000);//设置定时器，3秒后自动关闭
        });
    }else{
        $(div).createModal({
            background: "#fff",//设定弹窗之后的覆盖层的颜色
            width: "200px",//设定弹窗的宽度
            height: "auto",//设定弹窗的高度
            resizable: true,//设定弹窗是否可以拖动改变大小
            move: true,//规定弹窗是否可以拖动
            bgClose: true,//规定点击背景是否可以关闭
            html: "<p class='tipMsg'>" + msg + "</p>"
        },function(){
            window.setTimeout('close()',3000);//设置定时器，3秒后自动关闭
        });
    }

    return false;
}



