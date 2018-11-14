
layui.define(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate"], function (exports) {
    // localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiOEMxQzY1MEMtODlCQS00OERFLUJCMDUtMzY3RTM4REM2OTlCIn0.d29VWB4xBIhV9bhKq5NU81FIAoxb4VXiQsOFqW7Ep4Q")
    var layer = layui.layer
        , form = layui.form
        , $ = layui.$
        , laypage = layui.laypage
        , laydate = layui.laydate
        , element = layui.element
        , laytpl = layui.laytpl
        , table = layui.table
        , active
        , token = localStorage.getItem("token")
        , newtoken = localStorage.getItem("newtoken")
    // , token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiOEMxQzY1MEMtODlCQS00OERFLUJCMDUtMzY3RTM4REM2OTlCIn0.d29VWB4xBIhV9bhKq5NU81FIAoxb4VXiQsOFqW7Ep4Q"

    layer.msg('欢迎进入订单管理');
    // layui.data("table", {
    //   key: 0
    //   , value: '张勇'
    // })


    var table_option = {
        elem: '#orderTable'
        //   , id: 'usertable'
        , height: "full"
        , toolbar: "<div>" + $(".tool_item").html() + "</div>"
        , defaultToolbar: ['filter']//, 'print', 'exports'
        , url: 'http://api.xykoo.cn/manage/order/findOrderPage' //数据接口
        , method: "post"
        , where: {
        }
        , response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 200 //成功的状态码，默认：0
            , msgName: 'msg' //状态信息的字段名称，默认：msg
            , countName: 'count' //数据总数的字段名称，默认：count
            , dataName: 'data' //数据列表的字段名称，默认：data

        }
        , parseData: function (res) { //res 即为原始返回的数据
            console.log(res.status)
            switch (res.status) {
                case 200:

                    break;
                case 401:
                    layer.confirm('请重新登录', function () {
                        top.location.href = "login.html"
                    });
                    break;
                default:
                    layer.alert(data.message);
                    break;
            };
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.data.totalElements, //解析数据长度
                "data": res.data.content //解析数据列表
            };
        }
        , page: true //开启分页

        , cols: [[ //表头
            // { field: 'clothingNo', title: 'userId', width: 80, type: "checkbox"},colspan
            { field: 'orderNo', title: '订单号', width: 100, align: "center" }
            
            , { field: 'orderVOList', title: '衣袋信息(图片/商品编号/尺码/数量)', width: 300, templet: '#clothingImgUrlTpl', align: "center" }
            , { field: 'orderStatus', title: '订单状态', width: 100, templet: "#orderStatusTpl", align: "center" }
            , { field: 'addressVo', title: '手机号', width: 200, templet: '#phoneTpl', align: "center" }
            , { field: 'createTime', title: '时间', width: 170, align: "center" }
            , { field: 'address', title: '收货信息', width: 200, templet: "#addressTpl", align: "center" }
            , { field: 'caozuo', title: '操作', width: 130, templet: "#tool", align: "center", fixed: "right" }
        ]
            // ,
            //     [

            //     { field: 'clothingImgUrl', title: '图片', width: 100, templet: '#clothingImgUrlTpl', align: "center" }
            //     , { field: 'clothingNo', title: '商品编号', width: 100,templet: '#clothingNoTpl', align: "center" }
            //     , { field: 'clothingStockType', title: '尺码', templet: '#clothingStockTypeTpl', align: "center" }
            //     , { field: '', title: '数量', templet: '#orderDetailsVoListTpl', align: "center" }
            //     ]
        ]
        , request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit

        }
        , headers: { "X-Auth-Token": token }
        // , headers: { "token": newtoken }
        , done: function (res, curr, count) {


            var orderNo = $(".layui-table-body [data-field=orderNo]")
            var caozuo = $(".layui-table-fixed-r .layui-table-body  [data-field=caozuo]")
            $(window).resize(function () {
                orderNo.each(function (index, obj) {
                    caozuo.eq(index).css("height", orderNo.eq(index).css("height"))
                });

            });
            $("body").on("mouseover click mousemove touchstart touchmove", function () {
                orderNo.each(function (index, obj) {
                    setTimeout(function () {
                        caozuo.eq(index).css("height", orderNo.eq(index).css("height"))
                    }, 1000)
                })

            });



            form.on("submit(reload)", function (data) {
                // layer.msg(JSON.stringify(data.field));
                var where = {}
                if (data.field.numstyle == 1) {
                    where = {
                        phone: data.field.numnum
                    }
                } else if (data.field.numstyle == 2) {
                    where = {
                        clothingNo: data.field.numnum
                    }

                } else if (data.field.numstyle == 3) {
                    where = {
                        orderNo: data.field.numnum
                    }
                }
                tableIns.reload({
                    where: where
                    , page: {
                        curr: 1 //重新从第 1 页开始
                    }

                });
                return false;
            })
            

            for(var i=0;i< res.data.length;i++){
                res.data[i].orderNo=String( res.data[i].orderNo)
            }
            // table.exportFile(tableIns.config.id, res.data)
            // table.exportFile(['名字','性别','年龄'], [
            //     ['张三','男',['张三','男','20']],
            //     ['李四','女','18'],
            //     ['王五','女','19']
            //   ], 'csv');



            // $("[data-field=caozuo]").eq(index).css("height",$(obj).eq(index).css("height"))






        }

    }


    var tableIns = table.render(table_option);

    $(".show_div .step").on("click", function () {
        active.step($(this).attr("data-status"))
        // if($(this).find(".font1").text()=="待分拣"){
        //     layer.msg("[分拣]"+"[删除]")
        // }else if($(this).find(".font1").text()=="待审核"){
        //     layer.msg("[审核] "+"[删除]")
        // }else if($(this).find(".font1").text()=="待出库"){
        //     layer.msg("[出库] "+"[删除]")
        // }else if($(this).find(".font1").text()=="待发货"){
        //     layer.msg("[发货] "+"[删除]")
        // }else if($(this).find(".font1").text()=="待归还"){
        //     layer.msg("[归还] "+"[删除]")
        // }else if($(this).find(".font1").text()=="异常订单"){
        //     layer.msg("[解决] [查看] "+"[删除]")
        // }else if($(this).find(".font1").text()=="已完成"){
        //     layer.msg("[已完成] "+"[删除]")
        // }

        $(".show_div .step").removeClass("active")
        $(this).addClass("active")
    })
    table.on('tool(orderTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"

        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        function intPh(){
            $(".printBox .orderNo").html(obj.data.orderNo)
            $(".printBox .orderDate").html(obj.data.createTime)
            $(".printBox .orderPhone").html(obj.data.addressVo.contactNumber)
            $(".printBox .orderAddress").html(obj.data.addressVo.region+obj.data.addressVo.detailedAddress)
            $(".printBox .contant").html("")
            for(var l=0;l<obj.data.orderDetailsVoList.length;l++){
                var str="<div class='item'>"+
                            "<div class='img_box'><img src="+obj.data.orderDetailsVoList[l].clothingImgUrl+" alt=><br><br></div>"+
                            "<div class='right'>"+
                                "<div>"+
                                    "<label>商品名称：</label><br>"+
                                    "<span class='clothingName'>"+obj.data.orderDetailsVoList[l].clothingName+"</span> "+
                                "</div>"+
                                "<div>"+
                                    "<label>商品编码：</label><br>"+
                                    "<span class='clothingNo'>"+obj.data.orderDetailsVoList[l].clothingNo+"</span>"+
                                "</div>"+
                                "<div>"+
                                    "<label>商品数量：</label><br>"+
                                    "<span class='sizeNum'>1</span><span class='sizeStyle'>["+obj.data.orderDetailsVoList[l].clothingStockType+"]</span>"+
                                "<div>"+
                            "</div>"+
                        "</div>"     

                // $(".printBox .contant .item").eq(l).find(".img_box").append("<img src="+obj.data.orderDetailsVoList[l].clothingImgUrl+" alt=><br><br>")
                // $(".printBox .contant .item").eq(l).find(".right .clothingName").html(obj.data.orderDetailsVoList[l].clothingName)
                // $(".printBox .contant .item").eq(l).find(".right .clothingNo").html()
                // $(".printBox .contant .item").eq(l).find(".right .sizeNum").html(1)
                // $(".printBox .contant .item").eq(l).find(".right .sizeStyle").html("["+obj.data.orderDetailsVoList[l].clothingStockType+"]")
                $(".printBox .contant").append(str)
            }
        }
        if (layEvent == 'fenjian') { //分拣
            intPh()
            // let tr = $("<tr></tr>")
            // let html = $("<div></div")
            // html.append(tr)
            console.log(obj.data)

            //JSON.stringify(obj.data)
           
            setTimeout(function(){
                // active.printPage($(tr).prop("outerHTML"))


                layer.confirm("确定打印配货和发货吗？",function(){

                
                active.printPage($(".printBox"),function(){

                    $("body").addClass("body")
                    active.deliverGoods(data.id,function(msg){
                        console.log(msg)
                        $("#pic").attr("src",msg.data.electricPic)
                        $("#zhe").attr("src",msg.data.electricPic)
                        $("body").removeClass("body")
                        $("#zhe").addClass("zhe")
                        $(".zhe").get(0).onload=function(){
                            if(data.orderStatus==1){
                                active.printPage2($(".ChukuBox"),function(){
    
                                    active.updateOrder(data.id,3,function(){
                                        active.creatSFEletricPic(data.orderNo)
                                        tableIns.reload({})
                                    })
                                })
                                $(".zhe").get(0).onload=function(){

                                }
                                $("#zhe").removeClass("zhe")

                            }
                        }
                        
                            
                        
                        
                        
                    })
                })
            })
            },500)
            
            //do somehing


        } else if (layEvent == 'shenhe') {//审核
            console.log(obj.data)
            active.examine(obj.data)
        } else if (layEvent == 'chuku'){
            layer.confirm("是否出库？", function () {
                // active.printPage($(".ChukuBox").html())
                    
                let index = layer.load();
                setTimeout(function () {
                    layer.close(index);
                    layer.msg("已出库", { icon: 1, time: 1000 })
                }, 5000)


            })
        } else if (layEvent == 'fahuo') {
            layer.confirm("是否发货？", function () {
                let index = layer.load(2);
                setTimeout(function () {
                    layer.close(index);
                    layer.msg("已发货", { icon: 1, time: 1000 })
                }, 5000)


            })
        } else if (layEvent == 'ok') {
            layer.confirm("是否已解决？", function () {
                layer.msg("已解决", { icon: 1, time: 1000 })
            })
        } else if (layEvent == 'printPh') {
        intPh()
        active.printPage($(".printBox"))
    // active.look(obj.data)


}else if (layEvent == 'printFh') {
    $("body").addClass("body")
    active.deliverGoods(data.id,function(msg){
        $("body").removeClass("body")
        $("#zhe").addClass("zhe")
        $("#pic").attr("src",msg.data.electricPic)
        $("#zhe").attr("src",msg.data.electricPic)
        $(".zhe").get(0).onload=function(){
            
            $("#zhe").removeClass("zhe")
            active.printPage2($(".ChukuBox"))
            $(".zhe").get(0).onload=function(){

            }
        }
        
    })
// active.look(obj.data)


}

else if(layEvent == "delorder"){
    layer.confirm("确定删除吗？",function(){
        active.updateOrder(data.id,7,function(){//删除
            tableIns.reload({})
        })
    })
    
}
else if(layEvent == "guihuan"){
    layer.confirm("确定归还吗？",function(){
        active.updateOrder(data.id,5,function(){//归还
            tableIns.reload({})
        })
    })
    
}
else if(layEvent == "lookFh"){
    active.deliverGoods(data.id,function(msg){
    layer.open({
        type: 1,
        title: "查看发货单",
        shadeClose: true,
        shade: 0.8,
        maxmin: true,
        shadeClose :true,
        area: ['500px', "700px"],
        content: "<img src="+msg.data.electricPic+" width=100% />",//iframe的url
        success:function(layero, index){
            if ($(document).width() < 1024) {
                layer.full(index)
            }
        }
        }); 
    })
    
}

});
    active = {
        examine: function (data) {
            console.log(data)
            layer.open({
                title: "审核订单",
                type: 1,
                maxmin: true,
                area: ['400px', "500px"],
                offset: '0',
                content: $("#examineTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    $(layero.selector + " .layui-form-checkbox").on("click", function () {
                        
                        return false
                    })
                    var lastTime = null
                        , nextTime
                        , lastCode = null
                        , nextCode
                        , setTime = null
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    // form.render(null, 'addstock_son');
                    element.init()
                    form.render()
                    console.log(layero.selector)
                    for (var l = 0; l < 4 - data.orderDetailsVoList.length; l++) {

                        $(layero.selector + " .clothingNo").eq(0).parents(layero.selector + " .layui-form-item").remove()
                    }



                    $(layero.selector + " .error-btn").on("click", function(){
                        // active.error(data)
                        layer.confirm("加入异常订单吗？",function(){
                           active.updateOrder(data.id,12)
                        })
                    })
                    console.log(data)

                    $(layero.selector + " .clothingNo").eq(0).focus()

                    $(layero.selector + " .clothingNo").on('keydown', function (event) {

                        var _this = $(this)
                        console.log(_this.index())




                        if (lastTime == null) {
                            lastTime = new Date().getTime()
                        };
                        nextTime = new Date().getTime()
                        let useTime = nextTime - lastTime
                        lastTime = nextTime
                        // console.log("code"+event.keyCode);
                        // console.log("["+useTime+"]");

                        // if (useTime<30) {
                        //     nextInput=false
                        // };

                        clearTimeout(setTime)
                        // if (nextInput) {
                        //     $(this).next("input").focus()
                        // }
                        setTime = setTimeout(function () {
                            var index = _this.parents(".layui-form-item").index()
                            // alert(_this.parents(".layui-form-item").index())

                            if (_this.val().indexOf(data.orderDetailsVoList[index].clothingNo)!=-1 ) {
                                _this.parents(".layui-form-item").find(".layui-form-checkbox").addClass("layui-form-checked")
                                layer.msg("对")
                            } else {

                                _this.parents(".layui-form-item").find(".layui-form-checkbox").removeClass("layui-form-checked")
                                layer.msg("不对")

                            }


                            if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 8) {

                            } else {
                                // console.log(typeof(_this.parents(".layui-form-item").next(".layui-form-item").find(".clothingNo").get(0))=="undefined"&&(event.keyCode!=8||event.keyCode!=46||event.keyCode!=8));
                                if (typeof (_this.parents(".layui-form-item").next(".layui-form-item").find(".clothingNo").get(0)) == "undefined") {

                                    _this.focus()
                                    // layer.msg("这是最后一个了")
                                    // return false


                                } else {
                                    _this.parents(".layui-form-item").next(".layui-form-item").find(".clothingNo").focus()
                                }
                            }







                        }, 100)

                    });
                    var data_t = data
                    form.on('submit(shenhe)', function (data) {
                        console.log(data_t)
                        setTimeout(function () {
                            if ($(layero.selector + " .layui-form-checked").length == data_t.orderDetailsVoList.length) {
                                // layer.msg(JSON.stringify(data.field));
                                $("body").addClass("body")
                                active.printPage2($(".ChukuBox"),function(){
                                    // undataOrder(data.)
                                },data_t.id)
                            } else {
                                layer.msg("商品存在异常");
                            }
                        }, 0)

                        return false;
                    });


                }
            })
        },
        look: function (data) {
            layer.open({
                type: 1,
                title: "异常信息",
                area: ['400px', "500px"],
                content: $("#errorTpl").html() //这里content是一个普通的String
            });
        },
        error: function (data) {
            layer.open({
                title: "异常订单",
                type: 1,
                maxmin: true,
                area: ['400px', "500px"],
                offset: '0',
                content: $("#errorTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    // form.render(null, 'addstock_son');
                    element.init()
                    form.render()
                    form.on('submit(shenhe)', function (data) {
                        layer.msg(JSON.stringify(data.field));
                        return false;
                    });

                    for (var l = 0; l < 4 - data.orderDetailsVoList.length; l++) {

                        $(layero.selector + " .clothingNo").eq(0).parents(layero.selector + " .layui-form-item").remove()
                    }

                    console.log(data)
                    for (let i = 0; i < data.orderDetailsVoList.length; i++) {
                        let No = data.orderDetailsVoList[i].clothingNo
                        $(layero.selector + " .clothingNo").eq(i).val(No)
                    }

                    //提交
                    form.on('submit(error)', function (data) {
                        if ($(layero.selector + " input[name=examine_item]:checked").length <= 0) {
                            layer.msg("请选择异常商品")
                        } else {
                            layer.msg(JSON.stringify(data.field));
                            layer.msg("已加入异常列表", { icon: 1 });

                        }

                        return false;
                    });




                }
            })
        },
        step: function (status) {
            tableIns.reload({
                where: { //设定异步数据接口的额外参数，任意设

                    orderStatus: status
                    //…
                }
                , page: {
                    curr: 1 //重新从第 1 页开始
                }

            });


        },

        print: function (html) {
            var newWindow = window.open("打印窗口", "_blank");

            newWindow.document.write(html);
            // newWindow.document.close();
            newWindow.print();



        },
        printPage: function (obj,fn,orderId,status) {
                
            // document.body.innerHTML = html;
            $(".top_nav").hide()
            $(".show_div").hide()
            $(".layui-quote-nm").hide()
            $(".layui-form").hide()
            obj.css("display","block")
            $("body").css("height","100vh")
            $("body").css("overflow","hidden")
            obj.find(">div").css("z-index","99999999999999999999999")
            window.print();
            obj.css("display","none")
            $("body").css("height","")
            $("body").css("overflow","inherit")
            obj.find(">div").css("z-index","-1")
            $(".top_nav").show()
            $(".show_div").show()
            $(".layui-quote-nm").show()
            $(".layui-form").show()

            if(fn!=undefined){
                fn()
            }
            
          
            // alert("printPage")
            
            // var defereds = []; 
            // $("img").each(function () {
            //     var dfd = $.Deferred(); 
            //     $(this).load(dfd.resolve); 
            //     defereds.push(dfd); 
            // }); 
            // $.when.apply(false, defereds).done(function(){ 
            //     console.log('load compeleted'); 
            //     window.print();
            //     tableIns.reload({})
            //     // window.location.href = window.location.href;
            //     if(fn!=undefined){
            //         fn()
            //     }
            // });


            
            

       


        // myPrint($(".big_box"))
    },printPage2: function (obj,fn,orderId) {
                    obj.css("display","block")
                    $(".top_nav").hide()
                    $(".show_div").hide()
                    $(".layui-quote-nm").hide()
                    $(".layui-form").hide()
                    
                    $("body").css("height","100vh")
                    $("body").css("overflow","hidden")
                    obj.find(">div").css("z-index","99999999999999999999999")
               
        // document.body.innerHTML = html;
                    window.print();
                    obj.css("display","none")
                    $("body").css("height","auto")
                    $("body").css("overflow","inherit")
                    obj.find(">div").css("z-index","-1")
                    $(".top_nav").show()
                    $(".show_div").show()
                    $(".layui-quote-nm").show()
                    $(".layui-form").show()
                    
                    
         
            
            if(fn!=undefined){
                fn()
            }
      
        
        

   


    // myPrint($(".big_box"))
},
        updateOrder:function(orderId,orderStatus,fn){
            var index=layer.load(2)
            $.ajax({
                url: 'http://api.xykoo.cn/manage/order/updateOrder',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                    request.setRequestHeader("Accept", "*/*");
                    
                },
                type: "post",
                data: {
                    orderId:orderId,
                    orderStatus:orderStatus
                },
                success: function (data) {
                    layer.close(index)
                    // console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg("订单更新成功！",{icon:1})

                        if(fn){
                            fn()
                        }
                            break;
                        case 401:
                            layer.alert('请重新登录',function(){
                                top.location.href = "login.html"
                            });
                            break;
                        default:
                            // layer.alert(data.message);
                            break;
                    };


                },
                error: function () {
                    layer.close(index)
                    // layer.alert('接口异常');
                }
            })
        },
        creatSFEletricPic:function(orderNo,fn){
            var index=layer.load(2)
            $.ajax({
                url: ' http://api.xykoo.cn/sf/creatSFEletricPic',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                    request.setRequestHeader("Accept", "*/*");
                    
                },
                type: "post",
                data: {
                    orderNo:orderNo,
                    printip:0
                },
                success: function (data) {
                    layer.close(index)
                    // console.log(data);
                    switch (data.status) {
                        case 200:
                            

                        if(fn){
                            fn()
                        }
                            break;
                        case 401:
                            layer.alert('请重新登录',function(){
                                top.location.href = "login.html"
                            });
                            break;
                        default:
                            // layer.alert(data.message);
                            break;
                    };


                },
                error: function () {
                    layer.close(index)
                    // layer.alert('接口异常');
                }
            })
        },
       
        deliverGoods:function(orderId,fn){
            var index=layer.load(2)
            $.ajax({
                url: 'http://api.xykoo.cn/manage/order/deliverGoods',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: "post",
                data: {
                    orderId:orderId
                },
                success: function (data) {
                    layer.close(index)
                    // console.log(data);
                    switch (data.status) {
                        case 200:
                        
                        if(fn){
                            fn(data)
                        }
                            break;
                        case 401:
                            layer.alert('请重新登录',function(){
                                top.location.href = "login.html"
                            });
                            break;
                        default:
                            layer.alert(data.message,function(){
                                top.location.href=""
                            });
                            break;
                    };


                },
                error: function () {
                    layer.close(index)
                    layer.alert('接口异常');
                    top.location.href=""
                }
            })
        }
        

    }


    
    exports('ordertable', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致

});