layui.define(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate"], function (exports) {
    localStorage.setItem("newtoken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cueHlrb28uY24iLCJhZG1pbiI6MTUsImp0aSI6Ijc4RUQ5RTA3LUE2MTgtNERBMS1BQzU0LUY2RTYxNDM3QjYxNyJ9.9wNGFrhB7cfwVXetw0VMPgiFQC9dddYmPcqUiEEIC9M")
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

        , carousel = layui.carousel;
    layer.msg('欢迎进入双十一活动统计', { time: 1000, anim: 1 });
    var tableIns = table.render({
        title: "双十一"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#communityTable'
        , height: "full"
        , method: "get"
        , url: 'http://api.console.xykoo.cn/activityStatistics/elevenActivityStatistics' //数据接口
        , headers: { "token": newtoken }
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
                "count": res.data.statisticsPage.totalElements, //解析数据长度
                "data": res.data.statisticsPage.content //解析数据列表
            };
        }
        , request: {
            pageName: 'page_1' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit


        }
        , where: {
        }
        , page: {
            // limits:[10]
        } //开启分页,

        , cols: [[ //表头
            { field: 'phone', title: '手机号', width: 150, templet: "#phoneTpl", align: "center" }
            , { field: 'payType', title: '礼包类型', width: 100, templet: "#payTypeTpl", align: "center" }
            , { field: 'couponPrice', title: '优惠券金额', width: 180, templet: "#couponPriceTpl", align: "center" }
            , { field: 'depositYN', title: '押金状态', width: 100, templet: "#depositYNTpl", align: "center" }
            , { field: 'payMethod', title: '支付方式', width: 180, templet: "#payMethodTpl", align: "center" }
            , { field: 'payDate', title: '支付时间', width: 180, templet: "#payDateTpl", align: "center" }
        ]]
        , done: function (obj) {
            
            // form.render()
            console.log(obj)
            var height = 0;
           

            var articleId = $(".layui-table-body [data-field=articleId]")
            var caozuo = $(".layui-table-fixed-r .layui-table-body  [data-field=caozuo]")
            $(window).resize(function () {
                articleId.each(function (index, obj) {
                    caozuo.eq(index).css("height", articleId.eq(index).css("height"))
                });

            });
            $("body").on("mouseover click mousemove touchstart touchmove", function () {
                articleId.each(function (index, obj) {
                    setTimeout(function () {
                        caozuo.eq(index).css("height", articleId.eq(index).css("height"))
                    }, 1000)
                })

            });
            $.each(obj.data,function(key,val){
                // layer.photos({
                //     photos: $("[data-field=articleImages]").eq(key)
                //     ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                //     ,arrow:"always"
                // });
                layer.photos({
                    photos: $("[data-field=articleImages]").eq(key+1)
                    ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    ,arrow:"always"
                });
            })
            
             
           
        }
    });
    tableInsConfig=tableIns.config
    table.on('tool(communityTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        switch(layEvent){
            case "bianji":
            active.editBrand(data)

            break;
            case "delcommunity":
            layer.confirm("删除吗？",{icon:3},function(){
                active.shenghe(data.articleStatus,2,data.articleId)
               
            })
            break;
            case "communityStatus":
            layer.confirm("确定更改？",{icon:3},function(){
                let index = layer.load();
                setTimeout(function () {
                    layer.close(index);
                    layer.msg("已更改", { icon: 1, time: 1000 })
                }, 2000)
            })
            break;
            default: 
            break;
        }
    })
    table.on('toolbar(communityTable)', function(obj){
        var data = obj.data;
        console.log(data)
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
          case 'all':   
        //   tableIns=table.render(tableInsConfig)
        //   tableIns.reload({
        //     where: {
        //         articleStatus: 0
        //     } //设定异步数据接口的额外参数
        //     //,height: 300
        //   });
          break;
          case 'jinxun':
          tableIns=table.render(tableInsConfig)
            tableIns.reload({
                where: {
                    articleStatus: 1
                } //设定异步数据接口的额外参数
                //,height: 300
            });
          break;
          case 'sousuo':
        //   tableIns=table.render(tableInsConfig)
            tableIns.reload({
                where: {
                    phone:$("[name=phone]").val(),
                    payType:$("[name=payType] option:selected").val(),
                    payMethod:$("[name=payMethod] option:selected").val()
                } //设定异步数据接口的额外参数
                //,height: 300
            });
          break;
          
          default: 
          break;
        };
      });


      $(".sousuo").on("click",function(){
        tableIns.reload({
            where: {
                phone:$("[name=phone]").val(),
                payType:$("[name=payType] option:selected").val(),
                payMethod:$("[name=payMethod] option:selected").val()
            } //设定异步数据接口的额外参数
            //,height: 300
        });
      })
      
    active = {

        getcardnum:function(data){
            $(".month").text(data.data.count.month)
            $(".season").text(data.data.count.season)
            $(".year").text(data.data.count.year)
            $(".jiayi").text(data.data.count.add)
        },
        getcardnumajax:function(){
            var index=layer.load(2)
            $.ajax({
                url: 'http://api.console.xykoo.cn/activityStatistics/elevenActivityStatistics',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");
                   
                },
                type: 'get',
                dataType: 'json',
                data:{
                    page:0,
                    size:10
                },
                success: function (data) {
                    layer.close(index);
                    switch (data.status){
                       
                        case 200:
                        active.getcardnum(data)
                                 
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
        }
}
active.getcardnumajax()
    
    


    exports('community');
})



