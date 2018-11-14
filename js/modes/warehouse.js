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

        , carousel = layui.carousel;
    layer.msg('欢迎进入', { time: 1000, anim: 1 });
    // var tableIns = table.render({
    //     title: "仓储管理"
    //     , toolbar: $("#toolbarTpl").html()
    //     , defaultToolbar: ['filter']
    //     , elem: '#warehouseTable'
    //     , height: "full"
    //     , method: "get"
    //     , url: 'http://api.console.xykoo.cn/warehouse/getWarehouse' //数据接口
    //     , headers: { "token": newtoken }
    //     , response: {
    //         statusName: 'code' //数据状态的字段名称，默认：code
    //         , statusCode: 200 //成功的状态码，默认：0
    //         , msgName: 'msg' //状态信息的字段名称，默认：msg
    //         , countName: 'count' //数据总数的字段名称，默认：count
    //         , dataName: 'data' //数据列表的字段名称，默认：data

    //     }
    //     , parseData: function (res) { //res 即为原始返回的数据
    //         //console.log(res.status)

    //         switch (res.status) {
    //             case 200:

    //                 break;
    //             case 401:
    //                 layer.confirm('请重新登录', function () {
    //                     top.location.href = "login.html"
    //                 });
    //                 break;
    //             default:
    //                 layer.alert(data.message);
    //                 break;
    //         };
    //         return {
    //             "code": res.status, //解析接口状态
    //             "msg": res.message, //解析提示文本
    //             "count": res.data.totalElements, //解析数据长度
    //             "data": res.data.content //解析数据列表
    //         };

    //     }
    //     , request: {
    //         pageName: 'page_1' //页码的参数名称，默认：page
    //         , limitName: 'size' //每页数据量的参数名，默认：limit


    //     }
    //     , where: {
    //     }
    //     , page: {
    //         // limits:[10]
    //     } //开启分页,

    //     , cols: [[ //表头
    //         { field: 'warehouseNo', title: '仓库编号', width: 150, align: "center" }
    //         , { field: 'warehouseName', title: '仓库名称', width: 150, align: "center" }
    //         , { field: 'warehouseAddress', title: '仓库地址', width: 150, align: "center" }
    //         , { field: 'warehousePersonLiable', title: '仓库负责人', width: 100, align: "center" }
    //         , { field: 'warehouseDetails', title: '仓库描述', width: 180, align: "center" }
    //         , { field: 'createDate', title: '生成日期', width: 180, templet: "#createDateTpl", align: "center" }
    //         , { field: 'createDate', title: '修改日期', width: 180, templet: "#updateDateTpl", align: "center" }
    //     ]]
    //     , done: function (obj) {

    //         // form.render()
    //         //console.log(obj)
    //         var height = 0;


    //         var item = $(".layui-table-body [data-field=warehouseNo]")
    //         var caozuo = $(".layui-table-fixed-r .layui-table-body  [data-field=caozuo]")
    //         $(window).resize(function () {
    //             item.each(function (index, obj) {
    //                 caozuo.eq(index).css("height", item.eq(index).css("height"))
    //             });

    //         });
    //         $("body").on("mouseover click mousemove touchstart touchmove", function () {
    //             item.each(function (index, obj) {
    //                 setTimeout(function () {
    //                     caozuo.eq(index).css("height", item.eq(index).css("height"))
    //                 }, 1000)
    //             })

    //         });
    //         $.each(obj.data, function (key, val) {
    //             // layer.photos({
    //             //     photos: $("[data-field=articleImages]").eq(key)
    //             //     ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    //             //     ,arrow:"always"
    //             // });
    //             layer.photos({
    //                 photos: $("[data-field=articleImages]").eq(key + 1)
    //                 , anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    //                 , arrow: "always"
    //             });
    //         })



    //     }
    // });
    // tableInsConfig = tableIns.config
    // table.on('tool(communityTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
    //     var data = obj.data; //获得当前行数据
    //     var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
    //     var tr = obj.tr; //获得当前行 tr 的DOM对象

    //     switch (layEvent) {
    //         case "bianji":
    //             active.editBrand(data)

    //             break;
    //         case "delcommunity":
    //             layer.confirm("删除吗？", { icon: 3 }, function () {
    //                 active.shenghe(data.articleStatus, 2, data.articleId)

    //             })
    //             break;
    //         case "communityStatus":
    //             layer.confirm("确定更改？", { icon: 3 }, function () {
    //                 let index = layer.load();
    //                 setTimeout(function () {
    //                     layer.close(index);
    //                     layer.msg("已更改", { icon: 1, time: 1000 })
    //                 }, 2000)
    //             })
    //             break;
    //         default:
    //             break;
    //     }
    // })
    // table.on('toolbar(warehouseTable)', function (obj) {
    //     http://127.0.0.1/new_admin/layui-admin/console.xykoo.cn/warehouse.html
    //     switch (obj.event) {
    //         case 'openadd':
    //             active.opendiv()
    //             break;

    //         default:
    //             break;
    //     };
    // });
    form.on('submit(addbtn)', function (data) {
        //console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        //console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        active.addWarehouse({

            "warehouseAddress": data.field.warehouseAddress,
            "warehouseDetails": data.field.warehouseDetails,
            "warehouseName": data.field.warehouseName,
            "warehouseNo": data.field.warehouseNo,
            "warehousePersonLiable": data.field.warehousePersonLiable
        })

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    form.on('submit(addbtn2)', function (data) {
        //console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        //console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        active.addWarehousePartition({

            "partitionDesc": data.field.partitionDesc,
            "partitionName": data.field.partitionName,
            "partitionNo": data.field.partitionNo,
            "warehouseNo": data.field.warehouseNo
        })

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    
    form.on('submit(addbtn3)', function (data) {
        //console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        //console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        //console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        active.addStockPosition({

            "partitionNo": data.field.partitionNo,
            "positionDesc": data.field.positionDesc,
            "positionName": data.field.positionName,
            "positionNo": data.field.positionNo,
            "warehouseNo": data.field.warehouseNo
        })

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });



    active = {
        json: [],
        getcardnum: function (data) {
            $(".month").text(data.data.count.month)
            $(".season").text(data.data.count.season)
            $(".year").text(data.data.count.year)
            $(".jiayi").text(data.data.count.add)
        },
        addWarehouse: function (form) {
            var index = layer.load(2)
            setTimeout(function () {
                layer.close(index)
            }, 5000)
            $.ajax({
                url: 'http://api.console.xykoo.cn/warehouse/addWarehouse',
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
                            setTimeout(function(){
                                window.location.href=""
                            },1000)
                            break;
                        case 401:
                            layer.confirm('请重新登录',function(){
                                window.location.href="login.html"
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
                            setTimeout(function(){
                                window.location.href=""
                            },1000)
                            break;
                        case 401:
                        layer.confirm('请重新登录',function(){
                            window.location.href="login.html"
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
                            setTimeout(function(){
                                window.location.href=""
                            },1000)
                            
                            break;
                        case 401:
                        layer.confirm('请重新登录',function(){
                            window.location.href="login.html"
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
                                if (typeof (dfn) == "function"&&f == true) {
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
                                if (typeof (dfn) == "function"&&f == true) {
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
                    form.render()
                }
            });
        },
        opendiv2: function (NO) {
            layer.open({
                type: 1,
                title: "添加库区",
                area: ['auto', "auto"],
                maxmin: true,
                resize: true,
                content: $("#addTpl2").html(),//iframe的url
                success: function (layero, index) {
                    if ($(document).width() < 600) {
                        layer.full(index)
                    }
                    $(layero.selector).find("[name=warehouseNo]").val(NO)
                    form.render()
                }
            });
        },
        opendiv3: function (warehouseNo,partitionNo) {
            layer.open({
                type: 1,
                title: "添加库位",
                area: ['auto', "auto"],
                maxmin: true,
                resize: true,
                content: $("#addTpl3").html(),//iframe的url
                success: function (layero, index) {
                    if ($(document).width() < 600) {
                        layer.full(index)
                    }
                    $(layero.selector).find("[name=warehouseNo]").val(warehouseNo)
                    $(layero.selector).find("[name=partitionNo]").val(partitionNo)
                    form.render()
                }
            });
        },
        treeGridRender: function (res) {
            tableId = 'warehouseTable'
            ptable = treeGrid.render({
                id: tableId
                , elem: '#' + tableId
                , method: 'get'
                , url: 'http://api.console.xykoo.cn/warehouse/getWarehouse'
                , cellMinWidth: 100
                , idField: 'id'//必須字段
                , treeId: 'id'//树形id字段名称
                , treeUpId: 'pid'//树形父id字段名称
                , treeShowName: 'name'//以树形式显示的字段
                , heightRemove: [".dHead", 10]//不计算的高度,表格设定的是固定高度，此项不生效
                , height: '500'
                , isFilter: false
                , iconOpen: false//是否显示图标【默认显示】
                , isOpenDefault: true//节点默认是展开还是折叠【默认展开】
                , loading: true
                , isPage: false
                , cols: [[
                    { type: 'numbers' }
                    // , { type: 'radio' }
                    // , { type: 'checkbox', sort: true }
                    , {
                        title: '操作', align: 'center'/*toolbar: '#barDemo'*/
                       , templet: function (d) {
                        var html = '';
                        var addBtn = '';
                        switch(d.lay_level){
                            case 1:
                            return addBtn = '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="add">添加库区</a>';
                            break;
                            case 2:
                            return addBtn = '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="add">添加库位</a>';
                            break;
                            case 3:
                            return addBtn= "<div>暂无操作</div>"
                            break;
                            
                        }
                           
                           
                       }
                   }
                    , { field: 'name',minWidth:"200",templet:function(d){
                        var re
                        switch(d.lay_level){
                            case 1:
                            re = "仓库("+d.children.length+")-"+d.warehouseName
                            break;
                            case 2:
                            re = "库区("+d.children.length+")-"+d.partitionName
                            break;
                            case 3:
                            re = "库位-"+d.positionName
                            break;
                            
                        }
                        return re

                        
                    } ,title: '名称' }
                    , { field: 'about', width: 150,templet:$("#aboutTpl"), title: '衣位' }
                    , { field: 'warehouseDetails', minWidth: 100, title: '描述',templet:function(d){
                        var re
                        switch(d.lay_level){
                            case 1:
                            re = d.warehouseDetails
                            break;
                            case 2:
                            re = d.partitionDesc
                            break;
                            case 3:
                            re = d.positionDesc
                            break;
                            
                        }
                        return re

                        
                    }  }
                    , { field: 'id', minWidth: 150, title: '编号',  }
                    , { field: 'pid', title: '上级编号', minWidth: 150 }
                    
                ]]
                // , request: {
                //             pageName: 'page_1' //页码的参数名称，默认：page
                //             , limitName: 'size' //每页数据量的参数名，默认：limit


                // },
                , parseData: function () {//数据加载后回调
                    return res

                }
                , done: function (res) {
                    // //console.log(res)
                }
                , onClickRow: function (index, o) {
                    //console.log(index, o, "单击！");
                }
                , onDblClickRow: function (index, o) {
                    //console.log(index, o, "双击");
                }
            });
            $(".layui-btn-xstree").on("click", function () {
                eval($(this).attr("data-onclick"))
                
            })
            treeGrid.on('tool(' + tableId + ')', function (obj) {
                if (obj.event === 'del') {//删除行
                    del(obj);
                } else if (obj.event === "add") {//添加行
                    // add(obj);
                    //console.log(obj)
                    switch(obj.data.lay_level){
                        case 1:
                        active.opendiv2(obj.data.warehouseNo)
                        break;
                        case 2:
                        active.opendiv3(obj.data.warehouseNo,obj.data.partitionNo)
                        break;
                        case 3:
                        break;
                        
                    }
                }
            });

            function del(obj) {
                layer.confirm("你确定删除数据吗？如果存在下级节点则一并删除，此操作不能撤销！", { icon: 3, title: '提示' },
                    function (index) {//确定回调
                        obj.del();
                        layer.close(index);
                    }, function (index) {//取消回调
                        layer.close(index);
                    }
                );
            }

            var i = 1000000;
            //添加
            function add(pObj, param) {
                var pdata = pObj ? pObj.data : null;
                var param = {};
                param.id = ++i;
                param.pid = pdata ? pdata.id : null;
                //console.log(pdata[treeGrid.config.indexName])
                treeGrid.addRow(tableId, pdata ? pdata[treeGrid.config.indexName] + 1 : 0, param);
            }

            function print() {
                //console.log(treeGrid.cache[tableId]);
                var loadIndex = layer.msg("对象已打印，按F12，在控制台查看！", {
                    time: 3000
                    , offset: 'auto'//顶部
                    , shade: 0
                });
            }

            function openorclose() {
                var map = treeGrid.getDataMap(tableId);
                var o = map['102'];
                treeGrid.treeNodeOpen(tableId, o, !o[treeGrid.config.cols.isOpen]);
            }


            function openAll() {
                var treedata = treeGrid.getDataTreeList(tableId);
                treeGrid.treeOpenAll(tableId, !treedata[0][treeGrid.config.cols.isOpen]);
            }

            function getCheckData() {
                var checkStatus = treeGrid.checkStatus(tableId)
                    , data = checkStatus.data;
                layer.alert(JSON.stringify(data));
            }
            function radioStatus() {
                var data = treeGrid.radioStatus(tableId)
                layer.alert(JSON.stringify(data));
            }
            function getCheckLength() {
                var checkStatus = treeGrid.checkStatus(tableId)
                    , data = checkStatus.data;
                layer.msg('选中了：' + data.length + ' 个');
            }

            function reload() {
                treeGrid.reload(tableId, {
                    page: {
                        curr: 1
                    }
                });
            }
            function query() {
                treeGrid.query(tableId, {
                    where: {
                        name: 'sdfsdfsdf'
                    }
                });
            }

            function test() {
                //console.log(treeGrid.cache[tableId], treeGrid.getClass(tableId));


                /*var map=treeGrid.getDataMap(tableId);
                var o= map['102'];
                o.name="更新";
                treeGrid.updateRow(tableId,o);*/
            }
           
        }
    }
    
    $(".addWarehouse").on("click", function () {
        active.opendiv()
    })
    active.getWarehouse(function (res) {
        var f=false
        var level=0
        for (let i = 0; i < res.data.content.length; i++) {
            if(i== res.data.content.length-1){
                f=true
            }
            res.data.content[i].id = res.data.content[i].warehouseNo
            res.data.content[i].pid = 0
            active.json.push(res.data.content[i])
            active.getWarehousePartition(res.data.content[i].warehouseNo,function(res1){
                for (let j = 0; j < res1.data.length; j++) {
                    res1.data[j].id = res1.data[j].warehouseNo+"-"+res1.data[j].partitionNo
                    res1.data[j].pid = res1.data[j].warehouseNo
                    
                    active.json.push(res1.data[j])
                    
                }
               
               
            },function(){
                level++
                if(level==2){
                    active.treeGridRender({
                        msg:"",
                        code:0,
                        data:active.json
                    })
                    //console.log(active.json)
                }

            },f)
            active.getStockPosition(res.data.content[i].warehouseNo,function(res2){
                for (let j = 0; j < res2.data.length; j++) {
                    for (let l = 0; l < res2.data[j].length; l++) {
                    res2.data[j][l].id =res.data.content[i].warehouseNo+"-"+res2.data[j][l].partitionNo+"-"+ res2.data[j][l].positionNo
                    res2.data[j][l].pid = res.data.content[i].warehouseNo+"-"+res2.data[j][l].partitionNo
                    
                    active.json.push(res2.data[j][l])
                    }
                }
               
               
            },function(){
                level++
                if(level==2){
                    active.treeGridRender({
                        msg:"",
                        code:0,
                        data:active.json
                    })
                    //console.log(active.json)
                }

            },f)
        }



    
        // active.treeGridRender(res)
    })






})



