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
    layer.msg('欢迎进入品牌管理', { time: 1000, anim: 1 });
    var tableIns = table.render({
        title: "品牌列表"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#brandTable'
        , height: ""
        , method: "post"
        , url: 'http://api.xykoo.cn/manage/brand/findBrandPage' //数据接口
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
        , where: {
            brandName: "",
            brandStatus: 0
        }
        , page: true //开启分页,

        , cols: [[ //表头
            { field: 'brandId', title: 'brandId', width: 30, type: "checkbox" }
            , { field: 'brandDetailLogo', title: 'logo', width: 100, templet: "#brandDetailLogoTpl", align: "center" }
            , { field: 'brandDetailImg', title: '详情图', width: 100, templet: "#brandDetailImgTpl", align: "center", sort: "true" }
            , { field: 'brandName', title: '品牌名称', width: 100, templet: "#ImgUrlTpl" }
            , { field: 'brandDesc', title: '品牌描述', width: 400, align: "center" }
            , { field: 'createTime', title: '创建日期', width: 170, templet: "#createTimeTpl", align: "center" }
            , { field: 'status', title: '状态', width: 100,templet:"#brandStatusTpl", align: "center",fixed:"right" }
            //   ,{field: 'operator', title: '操作人', width: 100, templet:"#biaoqianTpl",align:"center"}
            , { field: 'caozuo', title: '操作', width: 100, fixed:"right", templet: "#caozuoTpl", align: "center" }
        ]]
        , done: function (obj) {
            form.render()
            console.log(obj)
            var height = 0;
           

            var orderNo = $(".layui-table-body [data-field=brandId]")
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
            form.on('radio(clothingSortId)', function (data) {
                console.log(data); //得到radio原始DOM对象
                console.log(data.value); //被点击的radio的value值
            });
        }
    });
    tableInsConfig=tableIns.config
    table.on('tool(brandTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        switch(layEvent){
            case "bianji":
            active.editBrand(data)

            break;
            case "delBrand":
            layer.confirm("删除吗？",{icon:3},function(){
                let index = layer.load();
                setTimeout(function () {
                    layer.close(index);
                    layer.msg("已删除", { icon: 1, time: 1000 })
                }, 2000)
            })
            break;
            case "brandStatus":
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
    table.on('toolbar(brandTable)', function(obj){
        var data = obj.data; 
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
          case 'addBrand':
          active.addBrand(data)
          break;
          case 'on':
          table.render(tableInsConfig)
          tableIns.reload({
              where:{
                brandStatus:1,
                brandName:""
              }
          })
          break;
          case 'off':
          table.render(tableInsConfig)
          tableIns.reload({
              where:{
                brandStatus:2,
                brandName:""
              }
          })
          break;
          case 'all':
          table.render(tableInsConfig)
          tableIns.reload({
              where:{
                brandStatus:0,
                brandName:""
              }
          })
          break;
          default: 
          break;
        };
      });
      form.on('switch(brandStatus)', function(data){
        // console.log(data.elem.class); //得到checkbox原始DOM对象
        // console.log(data.elem.checked); //开关是否开启，true或者false
        // console.log(data.value); //开关value值，也可以通过data.elem.value得到
        // console.log(data.othis); //得到美化后的DOM对象
        var brandStatus=data.elem.checked?1:2;
        active.updateBrand(data.value,brandStatus)
      }); 
    active = {
        //初始化顶部选项卡
        intShow_div: function () {
            $('.show_div .layui-col-item').on("click", function () {
                $('.show_div .layui-col-item').removeClass("active")
                $(this).addClass("active")
            })
       
        },
        editBrand: function(data){
            layer.open({
                title: "编辑品牌",
                type: 1,
                maxmin: true,
                area: ['500px', "500px"],
                offset: '0',
                content: $("#editBrandTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    form.render();


                    form.on('submit(editBrandSub)', function (data) {
                        return false;
                    });
                    $(layero.selector + " [lay-filter=editBrandSubCancel]").on("click", function () {
                        layer.close(index)
                    })

                }
            })
        },
        addBrand: function(data){
            layer.open({
                title: "添加品牌",
                type: 1,
                maxmin: true,
                area: ['500px', "500px"],
                offset: '0',
                content: $("#editBrandTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    form.render();


                    form.on('submit(editBrandSub)', function (data) {
                        return false;
                    });
                    $(layero.selector + " [lay-filter=editBrandSubCancel]").on("click", function () {
                        layer.close(index)
                    })

                }
            })
        },
        updateBrand:function(brandId,brandStatus){
            $.ajax({
                url: 'http://api.xykoo.cn/manage/brand/updateBrand',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'post',
                dataType: 'json',
                data: {brandId: brandId, brandStatus: brandStatus},
                success: function (data) {
                    switch (data.status) {
                        case 200:
                            layer.msg("更新成功",{icon:1})
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
                },
                error: function (data) {
                    alert("更新失败")
                    console.log("error" + data);
                }
            });
        }
    }
    active.intShow_div()


    exports('brandTable');
})