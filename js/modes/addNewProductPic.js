layui.define(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate","upload"], function (exports) {
    // localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiOEMxQzY1MEMtODlCQS00OERFLUJCMDUtMzY3RTM4REM2OTlCIn0.d29VWB4xBIhV9bhKq5NU81FIAoxb4VXiQsOFqW7Ep4Q")
    var layer = layui.layer
        , form = layui.form
        , $ = layui.$
        , laypage = layui.laypage
        , laydate = layui.laydate
        , element = layui.element
        , laytpl = layui.laytpl
        , table = layui.table
        , upload = layui.upload
        , active
        , token = localStorage.getItem("token")
        , newtoken = localStorage.getItem("newtoken")
    var activityPicDOTS=[]
    layer.msg('欢迎进入本周上新管理', { time: 1000, anim: 1 });
    var addActivityPicTable_option={
        title: "本周上新管理"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#addActivityPicTable'

        , height: 'full'
        , method: "get"
        , url: 'http://api.xykoo.cn/manage/pic/searchNewProductList' //数据接口
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
                $.each(res.data,function(key,val){
                    val.indexI=key+1
                })
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.count, //解析数据长度
                    "data": res.data //解析数据列表
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
        ,limit: 1000
        , page: true //开启分页,

        , cols: [[ //表头
            { field: 'indexI', title: '序列', width: 100, edit:"text",  align: "center"  }            
            ,{ field: 'productImg', title: '上新图片', width: 120, templet: "#specialImgTpl", align: "center" }
            , { field: 'productUrl', title: '上新连接', width: 400,  edit:"text", align: "center" }
            , { field: 'caozuo', title: '操作', width: 100,templet: "#caozuoTpl", align: "center" }
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
            var height = 0;
        
            var productImg = $(".layui-table-body [data-field=productImg]")
            var caozuo = $(".layui-table-fixed-r .layui-table-body  [data-field=caozuo]")

            $(window).resize(function () {
                productImg.each(function (index, obj) {
                    caozuo.eq(index).css("height", productImg.eq(index).css("height"))
                });

            });
            $("body").on("mouseover click mousemove touchstart touchmove", function () {
                productImg.each(function (index, obj) {
                    setTimeout(function () {
                        caozuo.eq(index).css("height", productImg.eq(index).css("height"))
                    }, 1000)
                })

            });

            
            // ----------------------------------------------------------------------------------------------------------------
            var img={}
            // var clothingImg = obj.data;
            
            //初始化图片
            $(".layui-table-body tr").click()
            intImg()
            function intImg(){

                var loadindex=layer.load(2)
                $.each($(".layui-table-body .selectImg"),function(key,val){
                    var image = new Image();
                    image.crossOrigin = '';
                    image.src = $(val).attr("src");
                    image.onload = function(){
                        layer.close(loadindex)
                        var src = active.getBase64Image(image);
                        $(".selectImg").eq(key).attr("src",src);
                        activityPicDOTS=[]
                        $(".layui-table-body tr").click()
                        for(var i in activityPicDOTS){
                            delete(activityPicDOTS[i]["indexI"])
                        }
                        // console.log(activityPicDOTS)
                    }
                });
                
                $(".file_img").on('change', function(){
                    active.changeImg(this,img)
                });
                $("[data-field=productImg]").on('click', function(){
                    img=$(this).find("img")
                    $(".file_img").click()
                });
            }

            table.on('sort(addActivityPicTable)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                console.log(obj.field); //当前排序的字段名
                console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
                console.log(this); //当前排序的 th 对象
                activityPicDOTS=[]
                $(".layui-table-body tr").click()
                intImg()
                console.log(activityPicDOTS)

                
                //尽管我们的 table 自带排序功能，但并没有请求服务端。
                //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
                
            });
            table.on('row(addActivityPicTable)', function(obj){
                // console.log(obj.tr) //得到当前行元素对象
                obj.data.productImg=obj.tr.find("[data-field=productImg] img").attr("src")
                // console.log(obj.data) //得到当前行数据
                activityPicDOTS.push(obj.data)
                //obj.del(); //删除当前行
                //obj.update(fields) //修改当前行数据
            });
            
            
            
            // ----------------------------------------------------------------------------------------------------------------

            
            table.on('toolbar(addActivityPicTable)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                  case 'save':
                    
                    layer.confirm("确定保存更改吗？",function(){
                        var subdata=[]
                        activityPicDOTS=[]
                        $(".layui-table-body tr").click()
                        for(var i in activityPicDOTS){
                            var json={
                                newProductId:activityPicDOTS[i].newProductId,
                                imgFile:activityPicDOTS[i].productImg,
                                linkUrl:activityPicDOTS[i].productUrl
                            }
                            active.saveActivity(json)
                            subdata.push(json)
                        }
                        

                    })
                  break;
                  case 'addActivity':
                    active.addActivity()
                    
                  break;
                  case 'update':
                    layer.msg('编辑');
                  break;
                };
              });
            table.on('tool(addActivityPicTable)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
              var data = obj.data; //获得当前行数据
              var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
              var tr = obj.tr; //获得当前行 tr 的DOM对象
             
              if(layEvent === 'del'){ //删除
                layer.confirm('真的删除吗？', function(index){
                    layer.close(index)
                    active.deleteActivityPic(data.newProductId)
                    $(obj.tr).remove()
                    
                  //向服务端发送删除指令
                });
              }else if(layEvent === 'edit'){ //编辑
                //do something

                //同步更新缓存对应的值
                // obj.update({
                //   username: '123'
                //   ,title: 'xxx'
                // });
              }
            });
            // document.querySelector('#img-file-input'+inputID).addEventListener('change', handleFileSelect, false);
            // table.exportFile(['名字','性别','年龄'], [
            //     ['张三','男','20'],
            //     ['李四','女','18'],
            //     ['王五','女','19']
            //   ], 'csv');
            
        }
    }
    var addActivityPicTable_option1=JSON.parse(JSON.stringify(addActivityPicTable_option));

    var tableIns = table.render(addActivityPicTable_option);
    

    active={
        getBase64Image:function(img){
            var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
                var dataURL = canvas.toDataURL("image/"+ext);

                return dataURL;
        },
        changeImg:function(obj,img) {
            var index=layer.load(2)
            if(obj.files[0]==undefined){
                layer.close(index)
                return
            }
            var r = new FileReader();
            var image = new Image();
            f = obj.files[0];
            
            r.readAsDataURL(f);

            r.onload = function(e) {

                // alert(this.result)
                img.attr("src",this.result)
                layer.close(index)
                activityPicDOTS=[]
                $(".layui-table-body tr").click()
                for(var i in activityPicDOTS){
                    delete(activityPicDOTS[i]["indexI"])
                }
                console.log(activityPicDOTS)
                // document.getElementById('show'+imgid).src = this.result;

                // console.log(this.result)
            //    console.log(active.dataURLtoFile(this.result,"file"))

            }
            
        }
        ,deleteActivityPic: function (id) {
            if(id==0){
                tableIns.reload({})
                return false
            }
            var index=layer.load(2)
            $.ajax({
                url: "http://api.xykoo.cn/manage/pic/deleteNewProductPic",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'get',// 引号
                dataType: "json",
                data: {
                    id: id,
                },
                success: function (data) {
                    layer.close(index)
                    switch (data.status) {
                        case 200:
                            layer.msg("更新成功", { icon: 1 });
                            tableIns.reload({})
                            break;
                        case 401:
                            layer.alert('请重新登录');
                            break;
                        default:
                            layer.alert(data.message);
                            break;
                    };

                },
                error: function () {
                    layer.close(index)
                    layer.alert("接口异常");
                }
            })

        },
        addActivity:function(){
            layer.open({
                title: "添加本周上新",
                type: 1,
                maxmin: true,
                anim: 5,
                area: ['500px', "100%"],
                offset: '0',
                content: $("#addActivityDTO").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    upload.render({
                        elem: '#updateImg'
                        // ,url: '/api/upload/'
                        ,auto: false //选择文件后不自动上传
                        ,bindAction: '#testListAction' //指向一个按钮触发上传
                        ,choose: function(obj){
                          //将每次选择的文件追加到文件队列
                          var files = obj.pushFile();
                          var loadIndex=layer.load(2)
                          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                          obj.preview(function(index, file, result){
                            // console.log(index); //得到文件索引
                            // console.log(file); //得到文件对象
                            console.log(result); //得到文件base64编码，比如图片
                            $(".updateSelectImg").attr("src",result)
                            $("[name=specialImg]").val(result)
                            layer.close(loadIndex)
                            //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                            
                            //这里还可以做一些 append 文件列表 DOM 的操作
                            
                            //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                            //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                          });
                        }
                      }); 


                      form.on('submit(upImg)', function(data){
                        // console.log(data.field);
                        var newupImg={
                            "imgFile":data.field.specialImg,
                            "linkUrl":data.field.specialUrl,
                            
                            "newProductId":0
                        }
                        
                        active.saveActivity(newupImg,index)

                        return false;
                      });
                }
            })
        },
        saveActivity:function(activityData,opindex){
            
            var index=layer.load(2)
            $.ajax({
                url: "http://api.xykoo.cn/manage/pic/addNewProductPic",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(activityData),
                success: function (data) {
                    layer.close(index)
                    switch (data.status) {
                        case 200:
                            layer.close(opindex)
                            
                            tableIns = table.render(addActivityPicTable_option);
                            layer.msg("添加成功", { icon: 1 });
                            
                            break;
                        case 401:
                            layer.alert('请重新登录');
                            break;
                        default:
                            layer.alert(data.message);
                            break;
                    };

                },
                error: function () {
                    layer.close(index)
                    layer.alert("接口异常");
                }
            })
        },
        dataURLtoFile: function (dataurl, filename) {
            let arr = dataurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let suffix = mime.split('/')[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], `${filename}.${suffix}`, {type: mime})
        }
        
    }

    
    

    exports('addNewProductPic');
})