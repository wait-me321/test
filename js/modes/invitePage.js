

layui.use(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate"], function () {
   
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
        layer.msg('邀请检测');
    var table_option = {
        elem: '#invitePageTable'
        //   , id: 'usertable'
        , height: "full"
        , toolbar: "<div>" + "邀请检测"+ "</div>"
        , defaultToolbar: ['filter']//, 'print', 'exports'
        , url: 'http://api.xykoo.cn/manage/invite/inviteList' //数据接口
        , method: "get"
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
            { field: 'phone', title: '手机号', width: 150, align: "center" }
            , { field: 'acceptInvitedUserPhone', title: '被邀请人\n（手机号）',  width: 150, templet: '#clothingImgUrlTpl', align: "center" }
            , { field: 'inviteNumber', title: '邀请人数', width: 100, templet: "#orderStatusTpl", align: "center" }
            , { field: 'invitePayNumber', title: '邀请付费数', width: 200, templet: '#phoneTpl', align: "center" }
            , { field: 'totalAmount', title: '总获取金额', width: 170, align: "center" }
            , { field: 'surplusAmount', title: '剩余金额', width: 200, templet: "#addressTpl", align: "center" }
            , { field: 'cashAmount', title: '已提现金额', width: 130, templet: "#tool", align: "center"}
            , { field: 'deductibleAmount', title: '充值抵扣金额', width: 130, templet: "#tool", align: "center"}
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
        , done: function () {
            var trh = $(".layui-table-body [data-field=phone]")
            var caozuo = $(".layui-table-fixed-r .layui-table-body  [data-field=caozuo]")
            $(window).resize(function () {
                trh.each(function (index, obj) {
                    caozuo.eq(index).css("height", trh.eq(index).css("height"))
                });

            });
            $("body").on("mouseover click mousemove touchstart touchmove", function () {
                trh.each(function (index, obj) {
                    setTimeout(function () {
                        caozuo.eq(index).css("height", trh.eq(index).css("height"))
                    }, 1000)
                })

            });
        }
    }


    var tableIns = table.render(table_option);
})