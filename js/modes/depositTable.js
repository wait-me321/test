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
        , elem: '#depositTable'
        , height: ""
        , method: "post"
        , url: 'http://api.xykoo.cn/manage/deposit/findDepositPage' //数据接口
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
            if (res.status == 200) {
                res.count = res.data.length;
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.data.totalElements, //解析数据长度
                    "data": res.data.content //解析数据列表
                };
            } else if (res.status == 401) {
                res.message = "请重新登录"
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": "", //解析数据长度
                    "data": "" //解析数据列表
                };
            } else {
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": "", //解析数据长度
                    "data": "" //解析数据列表
                };
            }
        }
        , request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit


        }
        , page: true //开启分页,

        , cols: [[ //表头
            { field: 'LAY_TABLE_INDEX', title: '序列', width: 60,templet: "#LAY_TABLE_INDEXTpl",  align: "center" }
            , { field: 'userPhone', title: '用户手机号', width: 120, templet: "#brandDetailLogoTpl", align: "center" }
            , { field: 'orderNumber', title: '支付单号', width: 100, templet: "#brandDetailImgTpl", align: "center" }
            , { field: 'depositAmount', title: '押金金额', width: 100, align: "center" }
            , { field: 'depositType', title: '支付方式', width: 100,templet:"#depositTypeTpl", align: "center" }
            , { field: 'payTime', title: '开通日期', width: 180, templet: "#payTimeTpl",align: "center" }
            , { field: 'returnTime', title: '退还日期', width: 180,templet: "#returnTimeTpl", align: "center" }
            , { field: 'effective', title: '押金状态', width: 100,templet: "#effectiveTpl", align: "center" }
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
    
    table.on('tool(depositTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        switch(layEvent){
            case "bianji":
            active.editBrand(data)
            break;
            case "freezeBtn":
            layer.confirm("确定冻结吗？",{icon:3},function(){
                let index = layer.load(2);
                active.updateDeposit(index,data.depositId,4)
                // setTimeout(function () {
                //     layer.close(index);
                // }, 2000)
            })
            break;
            case "returnBtn":
            layer.confirm("确定退款吗？",{icon:5},function(){
                let index = layer.load(2);
                active.refundDeposit(index,data.depositId)
                
                // setTimeout(function () {
                //     layer.close(index);
                //     layer.msg("已退款", { icon: 1, time: 1000 })
                // }, 2000)
            })
            break;
            case "huifu":
            layer.confirm("确定恢复吗？",{icon:3},function(){
                let index = layer.load(2);
                active.updateDeposit(index,data.depositId,1)
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
        updateDeposit:function(index,depositId,effective){
            $.ajax({
                url: 'http://api.xykoo.cn/manage/deposit/updateDeposit',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'post',
                dataType: 'json',
                data:{
                    depositId:depositId,
                    effective:effective
                },
                success: function (data) {
                    layer.close(index);
                    switch (data.status) {
                        
                        case 200:
                            table.reload('depositTable', {})
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
                            table.reload('depositTable', {})
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
        getDepositNum:function(index){
            $.ajax({
                url: 'http://api.xykoo.cn/manage/deposit/getDepositNum',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    layer.close(index);
                    switch (data.status) {
                       
                        case 200:
                        active.intgetDepositNum(data.data)
                                 
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
        intgetDepositNum:function(data){
            $(".ineffectiveNum").text(data.ineffectiveNum)
            $(".ineffectivePrice").text(data.ineffectivePrice)
            $(".effectivePrice").text(data.effectivePrice)
            $(".effectiveNum").text(data.effectiveNum)
        },
        search_data:function(obj){
            table.reload('depositTable', {
                where:obj //设定异步数据接口的额外参数
                //,height: 300
              });
        },
        search_btn:function(){
            var btnarr=[$(".search_all"),$(".search_true"),$(".search_wait"),$(".search_over")]
            $(".search_phone_btn").on("click",function(){
                active.search_data({phone:$("[name=phone]").val()})
            })
            $(".search_all").on("click",function(){
                click_btn(btnarr,btnarr[0])
                active.search_data({phone:"",effective:0})
            })
            $(".search_true").on("click",function(){
                click_btn(btnarr,btnarr[1])
                active.search_data({phone:"",effective:1})
            })
            $(".search_wait").on("click",function(){
                click_btn(btnarr,btnarr[2])
                active.search_data({phone:"",effective:2})
            })
            $(".search_over").on("click",function(){
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
    active.getDepositNum(index)

    exports('depositTable');
})