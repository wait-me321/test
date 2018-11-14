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
    layer.msg('欢迎进入押金管理', { time: 1000, anim: 1 });
    var depositTable_option={
        title: "押金列表"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#cardTable'
        , height: ""
        , method: "post"
        , url: 'http://api.xykoo.cn/manage/card/getCardPage' //数据接口
        , headers: { "X-Auth-Token": token }
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
        , request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit


        }
        , page: true //开启分页,

        , cols: [[ //表头
            { field: 'LAY_TABLE_INDEX', title: '序列', width: 60,templet: "#LAY_TABLE_INDEXTpl",  align: "center" }
            , { field: 'phone', title: '用户手机号', width: 120,  align: "center" }
            , { field: 'cardNum', title: '会员卡号', width: 100,  align: "center" }
            , { field: 'daysRemaining', title: '剩余天数', width: 100,  align: "center" }
            , { field: 'openingTime', title: '开通日期', width: 180, templet: "#openingTimeTpl",align: "center" }
            , { field: 'expirtTime', title: '结束日期', width: 180,templet: "#expirtTimeTpl", align: "center" }
            , { field: 'cardType', title: '会员卡类型', width: 100,templet: "#cardTypeTpl", align: "center" }
            , { field: 'effective', title: '会员卡状态', width: 100,templet: "#effectiveTpl", align: "center" }
            , { field: 'caozuo', title: '操作', width: 100,templet: "#caozuoTpl", align: "center",fixed:"right" }
        ]]
        ,done: function (obj,curr,count) {
            
            //解决获取信息失败后无法渲染表格

            if($(".layui-table-body").find("*").eq(0).get()==false){
                depositTable_option.page={
                    curr:curr
                }
                tableIns = table.render(depositTable_option);
                  
            }
            form.render()
            console.log(obj)
            var height = 0;
        
            var orderNo = $(".layui-table-body [data-field=depositId]")
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
            
          
            // table.exportFile(['名字','性别','年龄'], [
            //     ['张三','男','20'],
            //     ['李四','女','18'],
            //     ['王五','女','19']
            //   ], 'csv');
            
        }
    }
    var tableIns = table.render(depositTable_option);
    
    table.on('tool(cardTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        switch(layEvent){
            case "bianji":
            active.editBrand(data)
            break;
            case "off":
            layer.confirm("确定停用吗？",{icon:3},function(){
                let index = layer.load(2);
                active.updateCard(index,data.cardId,3)
                // setTimeout(function () {
                //     layer.close(index);
                // }, 2000)
            })
            break;
            
            case "huifu":
            layer.confirm("确定恢复吗？",{icon:3},function(){
                let index = layer.load(2);
                active.updateCard(index,data.cardId,1)
                // setTimeout(function () {
                //     layer.close(index);
                //     layer.msg("已恢复", { icon: 1, time: 1000 })
                // }, 2000)
            })
            break;
            default: 
            break;
        }
    })
      
    active = {
        //冻结
        updateCard:function(index,cardId,effective){
            $.ajax({
                url: 'http://api.xykoo.cn/manage/card/updateCard',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'post',
                dataType: 'json',
                data:{
                    cardId:cardId,
                    effective:effective
                },
                success: function (data) {
                    layer.close(index);
                    switch (data.status) {
                        
                        case 200:
                            table.reload('cardTable', {})
                            switch (effective) {
                            
                                case 1:
                                    layer.msg("已恢复", { icon: 1, time: 1000 })
                                    break;
                                case 3:
                                    layer.msg("已退款", { icon: 1, time: 1000 })
                                    break;
                                case 4:
                                    layer.msg("已冻结", { icon: 1, time: 1000 })
                                    break;
                                default:
                                    break;
                            };
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.message);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    
                    layer.close(index);
                }
            })
        },
        refundDeposit:function(index,depositId){
            $.ajax({
                url: 'http://api.xykoo.cn/manage/deposit/refundDeposit',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'post',
                dataType: 'json',
                data:{
                    depositId:depositId
                },
                success: function (data) {
                    layer.close(index);
                    switch (data.status) {
                       
                        case 200:
                            table.reload('cardTable', {})
                            layer.msg("已退款", { icon: 1, time: 1000 })
                                 
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.message);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    
                    layer.close(index);
                }
            })
        },
         getCardNum:function(index){
            $.ajax({
                url: 'http://api.xykoo.cn/manage/card/getCardNum',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    layer.close(index);
                    switch (data.status) {
                       
                        case 200:
                        active.intgetCardNum(data.data)
                                 
                            break;
                        case 401:
                            // layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.message);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.close(index);
                }
            })
        },
        intgetCardNum:function(data){
           
            $(".count").text(data.count)
            $(".season").text(data.season)
            $(".month").text(data.month)
            $(".year").text(data.year)
        },
        search_data:function(obj){
            table.reload('cardTable', {
                where:obj //设定异步数据接口的额外参数
                //,height: 300
              });
        },
        search_btn:function(){
            var btnarr=[$(".search_0"),$(".search_1"),$(".search_2"),$(".search_3")]
            $(".search_phone_btn").on("click",function(){
                active.search_data({phone:$("[name=phone]").val()})
            })
            $(".search_0").on("click",function(){
                click_btn(btnarr,btnarr[0])
                active.search_data({phone:"",effective:0})
            })
            $(".search_1").on("click",function(){
                click_btn(btnarr,btnarr[1])
                active.search_data({phone:"",effective:1})
            })
            $(".search_2").on("click",function(){
                click_btn(btnarr,btnarr[2])
                active.search_data({phone:"",effective:2})
            })
            $(".search_3").on("click",function(){
                click_btn(btnarr,btnarr[3])
                active.search_data({phone:"",effective:3})
            })
            function click_btn(objarr,this_btn){
                for(var i=0;i<objarr.length;i++){
                    objarr[i].removeClass("layui-bg-blue")
                }
                this_btn.addClass("layui-bg-blue")
            }

        }
        
    }

    active.search_btn()
    
    var index=layer.load(2);
    active.getCardNum(index)

    exports('cardTable');
})