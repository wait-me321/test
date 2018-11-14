

layui.use(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate","upload"], function () {
   
    var layer = layui.layer
        , form = layui.form
        , $ = layui.$
        , laypage = layui.laypage
        , laydate = layui.laydate
        , element = layui.element
        , laytpl = layui.laytpl
        , upload = layui.upload
        , table = layui.table
        , active
        , token = localStorage.getItem("token")
        , newtoken = localStorage.getItem("newtoken")
        layer.msg('风格管理');
    var table_option = {
        elem: '#activityPageTable'
        //   , id: 'usertable'
        , height: "full"
        , toolbar: "<div>" + "风格管理"+ "</div>"
        , defaultToolbar: ['filter']//, 'print', 'exports'
        , url: 'http://api.xykoo.cn/manage/communityActivity/getCommunityActivityPage' //数据接口
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
            { field: 'activityId', title: 'activityId', width: 30, type: "checkbox",align: "left" }
            , { field: 'activityStatus', title: '活动状态',templet:"#activityStatusTpl",  width: 200, align: "center" }
            , { field: 'activityTitle', title: '活动标题', width: 130, align: "center"}
            , { field: 'activityLabel', title: '活动标签',  width: 200, align: "center" }
            , { field: 'activityExplain', title: '活动描述',  width: 200, align: "center" }
            , { field: 'exampleDiagram', title: '示例图',templet:"#exampleDiagramTpl",  width: 100, align: "center" }
            , { field: 'mainDiagram', title: '主图',templet:"#mainDiagramTpl",  width: 100, align: "center" }
            , { field: 'caozuo', title: '操作', width: 150, templet: "#caozuoTpl", align: "center",fixed:"right"}
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
            var trh = $(".layui-table-body [data-field=styleName]")
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

            $("tr img").each(function(i,val){
                active.getBase64Image($(this).attr("src"),val)

            
            })

            $("tr img").on("dblclick",function(){
                active.lookimg($(this).attr("src"))
            })

        }
    }

    active={
        getBase64Image:function (src,img){
            console.log(1)
            var image = new Image();
                image.crossOrigin = '';
                image.src = src;
                image.onload = function(){
                    
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    var ext = image.src.substring(image.src.lastIndexOf(".")+1).toLowerCase();
                    var dataURL = canvas.toDataURL("image/"+ext);
                    img.src=dataURL;
                    // return dataURL;
                }
                
                
        },
        lookimg:function(src){
            layer.open({
                type: 1,
                title: "查看图片",
                shadeClose: true,
                shade: 0.8,
                maxmin: true,
                shadeClose :true,
                area: ['auto', "auto"],
                content: "<img src="+src+" width=100% />",//iframe的url
                success:function(layero, index){
                    if ($(document).width() < 1024) {
                        // layer.full(index)
                    }
                }
                }); 
        },
        openActivity:function(acdata){
            layer.open({
                type: 1,
                title: "添加活动",
                area: ['auto', "auto"],
                maxmin: true,
                content: $("#editStyleTpl").html(),//iframe的url
                success:function(layero, index){
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    var uploadInstExample = upload.render({
                        elem: '#exampleDiagram' //绑定元素
                        ,auto: false 
                        ,choose: function(obj){
                            //将每次选择的文件追加到文件队列
                            var files = obj.pushFile();
                            console.log(files);
                            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                            obj.preview(function(index, file, result){
                            //   console.log(index); //得到文件索引
                            //   console.log(file); //得到文件对象
                            //   console.log(result); //得到文件base64编码，比如图片
                            
                              //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                              
                              //这里还可以做一些 append 文件列表 DOM 的操作
                              
                              //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                              //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                            });


                          }
                        ,done: function(res){

                          //上传完毕回调
                          
                        }
                        ,error: function(){
                          //请求异常回调
                        }
                      });
                      var uploadInstMain = upload.render({
                          elem: '#mainDiagram' //绑定元素
                          ,auto: false 
                          ,choose: function(obj){
                            //将每次选择的文件追加到文件队列
                            var files = obj.pushFile();
                            
                            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                            obj.preview(function(index, file, result){
                            //   console.log(index); //得到文件索引
                            //   console.log(file); //得到文件对象
                            //   console.log(result); //得到文件base64编码，比如图片
                              
                              //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                              
                              //这里还可以做一些 append 文件列表 DOM 的操作
                              
                              //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                              //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                            });
                          }
                          ,done: function(res){
                            //上传完毕回调
                          }
                          ,error: function(){
                            //请求异常回调
                          }
                        });

                    form.render()
                }
                }); 
        }

    }
    form.on('submit(submit_activity)', function(data){
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}


        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    active.openActivity()
    form.on('submit(submit_activity)', function(data){
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}


        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

      


    var tableIns = table.render(table_option);
})