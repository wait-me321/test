layui.config({
    base: 'layui/extend/'
})
layui.use(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate", "treeGrid"], function (exports) {
    localStorage.setItem("newtoken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cueHlrb28uY24iLCJhZG1pbiI6MTUsImp0aSI6Ijc4RUQ5RTA3LUE2MTgtNERBMS1BQzU0LUY2RTYxNDM3QjYxNyJ9.9wNGFrhB7cfwVXetw0VMPgiFQC9dddYmPcqUiEEIC9M")
    var layer = layui.layer
        , form = layui.form
        , $ = layui.$
        , laypage = layui.laypage
        , laydate = layui.laydate
        , element = layui.element
        , laytpl = layui.laytpl
        , table = layui.table
        , treeGrid = layui.treeGrid
        , active
        , token = localStorage.getItem("token")
        , newtoken = localStorage.getItem("newtoken")
        , DOTS = []
        , carousel = layui.carousel;
    layer.msg('欢迎进入', { time: 1000, anim: 1 });
    var tableIns = table.render({
        title: "仓储管理"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#categoryTable'
        , height: "full"
        , method: "get"
        , url: 'http://api.console.xykoo.cn/category/getCategory' //数据接口
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
                "count": res.data.length, //解析数据长度
                "data": res.data //解析数据列表
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
            { field: 'sort', title: '序号', width: 100, sort: true, edit: "text" }
            , { field: 'categoryName', title: '品类名称', width: 150, edit: "text" }
            // , { field: 'caozuo', title: '操作', width: 80, templet: "#caozuoTpl",fixed:"right" }
        ]]
        , done: function (obj) {

            // form.render()
            console.log(obj)
            var height = 0;


            var item = $(".layui-table-body [data-field=warehouseNo]")
            var caozuo = $(".layui-table-fixed-r .layui-table-body  [data-field=caozuo]")
            $(window).resize(function () {
                item.each(function (index, obj) {
                    caozuo.eq(index).css("height", item.eq(index).css("height"))
                });

            });
            $("body").on("mouseover click mousemove touchstart touchmove", function () {
                item.each(function (index, obj) {
                    setTimeout(function () {
                        caozuo.eq(index).css("height", item.eq(index).css("height"))
                    }, 1000)
                })

            });
            $.each(obj.data, function (key, val) {
                // layer.photos({
                //     photos: $("[data-field=articleImages]").eq(key)
                //     ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                //     ,arrow:"always"
                // });
                layer.photos({
                    photos: $("[data-field=articleImages]").eq(key + 1)
                    , anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    , arrow: "always"
                });
            })



        }
    });
    tableInsConfig = tableIns.config
    table.on('tool(communityTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        switch (layEvent) {
            case "bianji":
                active.editBrand(data)

                break;
            case "delcommunity":
                layer.confirm("删除吗？", { icon: 3 }, function () {
                    active.shenghe(data.articleStatus, 2, data.articleId)

                })
                break;
            case "communityStatus":
                layer.confirm("确定更改？", { icon: 3 }, function () {
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
    table.on('toolbar(categoryTable)', function (obj) {
        http://127.0.0.1/new_admin/layui-admin/console.xykoo.cn/warehouse.html
        switch (obj.event) {
            case 'openadd':
                active.opendiv()
                break;
            case 'save':
                var newDOTS=[]
                for(let i=0;i<DOTS.length;i++){
                    newDOTS.push({
                        categoryId:DOTS[i].categoryId,
                        categoryName:DOTS[i].categoryName,
                        sort:Number(DOTS[i].sort),

                    })
                }
                active.modifyCategory(DOTS)
                break;

            default:
                break;
        };
    });
    form.on('submit(addbtn)', function (data) {
        // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        active.addCategory(data.field.categoryName)

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    table.on('sort(categoryTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        // console.log(obj.field); //当前排序的字段名
        // console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
        // console.log(this); //当前排序的 th 对象
        DOTS = []
        $(".layui-table-body tr").click()
        console.log(DOTS)


        //尽管我们的 table 自带排序功能，但并没有请求服务端。
        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：

    });
    table.on('edit(categoryTable)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        // console.log(obj.value); //得到修改后的值
        // console.log(obj.field); //当前编辑的字段名
        // console.log(obj.data); //所在行的所有相关数据  
        DOTS = []
        $(".layui-table-body tr").click()
        console.log(DOTS)
    });
    table.on('row(categoryTable)', function (obj) {
        // console.log(obj.tr) //得到当前行元素对象
        // obj.data.specialImg = obj.tr.find("[data-field=specialImg] img").attr("src")
        // console.log(obj.data) //得到当前行数据
        DOTS.push(obj.data)
        //obj.del(); //删除当前行
        //obj.update(fields) //修改当前行数据
    });


    active = {
        json: [],
        modifyCategory: function (json) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://192.168.1.109:8080/category/modifyCategory',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'post',
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(json),
                success: function (data) {
                    layer.closeAll('loading')
                    tableIns.reload({})
                    switch (data.status) {
                        
                        case 200:
                            layer.msg("修改成功", { icon: 1 })
                            tableIns.reload({})
                            setTimeout(function () {
                                layer.closeAll()
                            }, 1000)

                            break;
                        case 401:
                            layer.confirm('请重新登录', function () {
                                window.location.href = "login.html"
                            });

                            break;
                        default:
                            layer.msg(data.data);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },
        getcardnum: function (data) {
            $(".month").text(data.data.count.month)
            $(".season").text(data.data.count.season)
            $(".year").text(data.data.count.year)
            $(".jiayi").text(data.data.count.add)
        },
        addCategory: function (categoryName) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/category/addCategory',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'post',
                dataType: 'json',
                data: {
                    categoryName: categoryName
                },
                success: function (data) {
                    layer.closeAll('loading')
                    switch (data.status) {

                        case 200:
                            layer.msg("添加成功", { icon: 1 })
                            tableIns.reload({})
                            setTimeout(function () {
                                layer.closeAll()
                            }, 1000)

                            break;
                        case 401:
                            layer.confirm('请重新登录', function () {
                                window.location.href = "login.html"
                            });

                            break;
                        default:
                            layer.msg(data.msg);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },
        addWarehousePartition: function (form) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/WarehousePartition/addWarehousePartition',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'post',
                dataType: 'json',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(form),
                success: function (data) {
                    layer.closeAll('loading')
                    switch (data.status) {

                        case 200:
                            layer.msg("添加成功", { icon: 1 })
                            setTimeout(function () {
                                window.location.href = ""
                            }, 1000)
                            break;
                        case 401:
                            layer.confirm('请重新登录', function () {
                                window.location.href = "login.html"
                            });
                            break;
                        default:
                            layer.msg(data.data);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },
        addStockPosition: function (form) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/stockPosition/addStockPosition',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'post',
                dataType: 'json',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(form),
                success: function (data) {
                    layer.closeAll('loading')
                    switch (data.status) {

                        case 200:
                            layer.msg("添加成功", { icon: 1 })
                            setTimeout(function () {
                                window.location.href = ""
                            }, 1000)

                            break;
                        case 401:
                            layer.confirm('请重新登录', function () {
                                window.location.href = "login.html"
                            });
                            break;
                        default:
                            layer.msg(data.data);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },
        getWarehouse: function (fn) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/warehouse/getWarehouse',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'get',
                dataType: 'json',
                data: {
                    page: 0,
                    size: 1000
                },
                success: function (data) {
                    layer.closeAll('loading')
                    switch (data.status) {

                        case 200:


                            if (typeof (fn) == "function") {
                                fn(data)

                            }
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.msg);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },

        getWarehousePartition: function (warehouseNo, fn, dfn, f) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/WarehousePartition/getWarehousePartition',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'get',
                dataType: 'json',
                data: {
                    warehouseNo: warehouseNo
                },
                success: function (data) {
                    layer.closeAll('loading')
                    switch (data.status) {

                        case 200:


                            if (typeof (fn) == "function") {
                                fn(data)
                                if (typeof (dfn) == "function" && f == true) {
                                    dfn()
                                }

                            }
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.msg);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },

        getStockPosition: function (warehouseNo, fn, dfn, f) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/stockPosition/getStockPosition',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                    request.setRequestHeader("Accept", "*/*");

                },
                type: 'get',
                dataType: 'json',
                data: {
                    warehouseNo: warehouseNo
                },
                success: function (data) {
                    layer.closeAll('loading')
                    switch (data.status) {

                        case 200:


                            if (typeof (fn) == "function") {
                                fn(data)
                                if (typeof (dfn) == "function" && f == true) {
                                    dfn()
                                }

                            }
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.msg);
                            break;
                    };


                },
                error: function () {
                    layer.msg("接口异常")
                    layer.closeAll('loading')
                }
            })
        },
        opendiv: function (No) {
            layer.open({
                type: 1,
                title: "添加仓库",
                area: ['auto', "auto"],
                maxmin: true,
                resize: true,
                content: $("#addTpl").html(),//iframe的url
                success: function (layero, index) {
                    if ($(document).width() < 600) {
                        layer.full(index)
                    }
                    $(".quxiao").on("click", function () {
                        layer.close(index)
                    })
                    form.render()
                }
            });
        }
    }









})



