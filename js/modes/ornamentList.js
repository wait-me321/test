layui.use(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate"],function(){
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
        ,delimgId=[]
        var ornamentList_option = {
            title: "配饰列表"
            , toolbar: $("#toolbarTpl").html()
            , defaultToolbar: ['filter']
            , elem: '#ornamentList'
            , height: ""
            , width: "100%"
            , method: "get"
            , url: 'http://api.xykoo.cn/manage/ornament/getOrnamentPage' //数据接口
            , headers: { "X-Auth-Token": token }
            , response: {
                statusName: 'code' //数据状态的字段名称，默认：code
                , statusCode: 200 //成功的状态码，默认：0
                , msgName: 'msg' //状态信息的字段名称，默认：msg
                , countName: 'count' //数据总数的字段名称，默认：count
                , dataName: 'data' //数据列表的字段名称，默认：data
    
            }
            , parseData: function (res) { //res 即为原始返回的数据
                // console.log(res.status)
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
            , where: {
            }
            , page: true //开启分页,
    
            , cols: [[ //表头
                { field: 'checkbox', title: 'ID', width: 30, type: "checkbox", hide: false }
                , { field: 'clothingNo', title: '商品编号', width: 100, align: "center" }
                , { field: 'leaseNumber', title: '租赁次数', width: 100, align: "center", sort: "true" }
                , { field: 'clothingImgUrl', title: '图片', width: 100, templet: "#clothingImgUrlTpl" }
                , { field: 'clothingName', title: '商品名称', width: 100, align: "center" }
                , { field: 'clothingPrice', title: '商品价格', width: 100, align: "center" }
                , { field: 'brandName', title: '品牌', width: 100, align: "center" }
                , { field: 'clothingStatus', title: '商品状态', width: 120, templet: "#clothingStatusTpl" }
                // , { field: 'biaoqian', title: '分类', width: 100, templet: "#biaoqianTpl", align: "center" }
                , { field: 'caozuo', title: '操作', width: 150, templet: "#caozuoTpl", align: "center", fixed: "right" }
            ]]
            , done: function (obj) {
                form.render()
                // console.log(obj)
                var height = 0;
    
    
                var orderNo = $(".layui-table-body [data-field=checkbox]")
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
                    // console.log(data.elem); //得到radio原始DOM对象
    
                    $(data.elem).attr("checked", true)
                    // layer.confirm("确定更改？", { closeBtn: 0, offset: 0 }, function (index1) {
                        // console.log(data)
                        var index = layer.load(2)
                        var clothingId = $(data.elem).attr("data-id")
                        //模拟提交的网络延迟
                        active.clothingLabel(clothingId, data.value, index )
                        // setTimeout(function () {
                        //     layer.close(index)
                        //     layer.close(index1)
                        //     layer.msg("更新成功", { icon: 1 });
    
    
                        // }, 1000)
    
    
                    // }, function () {
                    //     //取消的操作
                    //     $("[name=" + $(data.elem).attr('name') + "]").each(function (i, v) {
                    //         if ($(v).attr("data-last") == "true") {
                    //             $(v).click()
                    //             form.render()
                    //         }
                    //     })
    
                    // })
                    //被点击的radio的value值
                });
                form.on('switch(clothingStatus)', function (obj) {
                    // console.log(obj)
                    // layer.confirm("确定更改？", { closeBtn: 0, offset: 0 }, function (index1) {
    
                        var index = layer.load(2)
                        var status
                        obj.elem.checked ? status = 1 : status = 2;
                        //模拟提交的网络延迟
                        active.updateClothing(obj.value, status, index)
                        // active.clothingLabel(clothingId, data.val, index, index1)
                        // setTimeout(function () {
                        //     layer.close(index)
                        //     layer.close(index1)
                        //     layer.msg("更新成功", { icon: 1 });
    
    
                        // }, 1000)
    
    
                    // }, function () {
                    //     //取消的操作
                    //     $(obj.elem).click()
                    //     form.render()
    
    
                    // })
                    // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
                })
                // form.on('switch(starSameStyle)', function (obj) {
                //     layer.confirm("确定更改？", { closeBtn: 0, offset: 0 }, function (index1) {
    
                //         var index = layer.load(2)
                //         //模拟提交的网络延迟
                //         setTimeout(function () {
                //             layer.close(index)
                //             layer.close(index1)
                //             layer.msg("更新成功", { icon: 1 });
    
    
                //         }, 1000)
    
    
                //     }, function () {
                //         //取消的操作
                //         $(obj.elem).click()
                //         form.render()
    
    
                //     })
                //     // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
                // })


                
            }
        }
        table.on('tool(ornamentList)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象

                if (layEvent === 'detail') { //查看
                    //do somehing
                } else if (layEvent == 'delclothing') { //删除
                    layer.confirm('真的删除吗？', { icon: 3 }, function (index1) {
                        var index = layer.load(2)
                        active.updateClothing(data.clothingId, 3, index, index1)

                        //向服务端发送删除指令
                    });
                }else if (layEvent == 'deletePopularity') { //删除
                    layer.confirm('真的取消人气吗？', { icon: 3 }, function (index1) {
                        var index = layer.load(2)
                        active.deletePopularityClothing(data.clothingId, index, index1)

                        //向服务端发送删除指令
                    });
                } else if (layEvent == 'addPopularity') { //编辑
                    //do something
                    //同步更新缓存对应的值
                    layer.confirm("确定加入人气配饰吗？", { icon: 3 }, function (index1) {

                        var index = layer.load(2)
                        //模拟提交的网络延迟
                        active.addrenqi(data.clothingId, index, index1)


                    }, function () {
                        //取消的操作



                    })
                } else if (layEvent === 'bianji') { //编辑
                    active.editclothing(data.clothingId)
                }
            });
        active={
            updateClothing: function (clothingId, clothingStatus, index, index1) {
                    $.ajax({
                        url: "http://api.xykoo.cn/manage/clothing/updateClothing",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: {
                            clothingId: clothingId,
                            clothingStatus: clothingStatus
                        },
                        success: function (data) {
                            layer.close(index)
                            layer.close(index1)
                            switch (data.status){
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
                            layer.close(index1)
                            layer.alert("接口异常");
                        }
                    })

            },
            deletePopularityClothing: function (clothingId, index, index1) {
                $.ajax({
                    url: "http://api.xykoo.cn/manage/popularity/deletePopularityClothing",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: 'post',// 引号
                    dataType: "json",
                    data: {
                        clothingId: clothingId
                    },
                    success: function (data) {
                        layer.close(index)
                        layer.close(index1)
                        switch (data.status){
                            case 200:

                                layer.msg("更新成功", { icon: 1 });
                                tableIns.reload({})
                                break;
                            case 401:
                                layer.alert('请重新登录');
                                break;
                            default:
                                layer.alert(data.msg);
                                break;
                        };

                    },
                    error: function () {
                        layer.close(index)
                        layer.close(index1)
                        layer.alert("接口异常");
                    }
                })

            },
            addrenqi: function (clothingId, index, index1) {
                $.ajax({
                    url: "http://api.xykoo.cn/manage/popularity/addPopularityOrnament",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: 'post',// 引号
                    dataType: "json",
                    data: {
                        clothingId: clothingId
                    },
                    success: function (data) {
                        layer.close(index)
                        layer.close(index1)
                        switch (data.status) {
                            case 200:

                                layer.msg("加入成功", { icon: 1 });
                                tableIns.reload({})
                                break;
                            case 401:
                                layer.alert('请重新登录');
                                break;
                            default:
                                layer.alert(data.msg);
                                break;
                        };

                    },
                    error: function () {
                        layer.close(index)
                        layer.close(index1)
                        layer.alert("接口异常");
                    }
                })

            },
            getOrnament: function (clothingId) {
                $.ajax({
                    url: "http://api.xykoo.cn/manage/popularity/addPopularityOrnament",
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: 'post',// 引号
                    dataType: "json",
                    data: {
                        clothingId: clothingId
                    },
                    success: function (data) {
                        layer.close(index)
                        layer.close(index1)
                        switch (data.status) {
                            case 200:

                                layer.msg("加入成功", { icon: 1 });
                                tableIns.reload({})
                                break;
                            case 401:
                                layer.alert('请重新登录');
                                break;
                            default:
                                layer.alert(data.msg);
                                break;
                        };

                    },
                    error: function () {
                        layer.close(index)
                        layer.close(index1)
                        layer.alert("接口异常");
                    }
                })

            },
            addclothing: function (clothingId) {
                // switch (subtype) {
                //     case 1:
                //         title = "添加商品"
                //         break;
                //     case 2:
                //         title = "编辑商品"
                //         break;
                //     default:
                //         break;
                // };
                this.openIndex = layer.open({
                    title: "添加商品",
                    type: 1,
                    maxmin: true,
                    anim: 5,
                    area: ['auto', "auto"],
                    offset: '0',
                    content: $("#ClothingDTO").html(), //这里content是一个普通的String
                    success: function (layero, index) {
                        layer.full(index)
                        
                        $(layero.selector + " [lay-filter=searchClothing]").on("click",function(){
                            if ($(layero.selector + " [name=clothingNo]").val().length <= 0) {
                                layer.msg("请填写商品编号！")
                                return false;
                            }
                            active.getOrnamentPage($(layero.selector + " [name=clothingNo]").val(),function(id){
                                active.getbrandlist($(layero.selector + " [name=brandlist]"),function(){
                                    active.getclothing(id,active.intclothing)
                                })
                            })
                            
                        })
                        
                        // active.ClothingDTO.selector=layero.selector
                        var options = {
                            path: '/',    // 上传图片时指定的地址路径，类似form变淡的action属性
                            onSuccess: function (res) {    // 上传成功后执行的方法，res是接收的ajax响应内容
                                // console.log(res);
                            },
                            onFailure: function (res) {    // 上传失败后执行的方法，res是接收的ajax响应内容
                                // console.log(res);
                            }
                        }
                        
                        var mainImg = tinyImgUpload('mainImg', options);
                        var banner = tinyImgUpload('banner', options);
                        var details = tinyImgUpload('details', options);

                        $("#img-file-inputmainImg").on("change", function () {
                            // console.log($(this).get(0).files)
                            verificationPicFile($(this).get(0),304,400)
                            
                            return false
                        })
                        $("#img-file-inputbanner").on("change", function () {
                            // console.log($(this).get(0).files)
                            verificationPicFile($(this).get(0),750,852)
                            
                            return false
                        })
                        $("#img-file-inputdetails").on("change", function () {
                            // console.log($(this).get(0).files)
                            verificationPicFile($(this).get(0),280,280)
                            
                            return false
                        })
                        function verificationPicFile(file,w,h) {
                            var filePath = file.value; if (filePath) {        //读取图片数据        
                                var filePic = file.files[0];        
                                var reader = new FileReader();        
                                reader.onload = function (e) {            
                                    var data = e.target.result;            //加载图片获取图片真实宽度和高度            
                                    var image = new Image();            
                                    image.onload=function(){               
                                         var width = image.width;                
                                         var height = image.height;                
                                         if (width == w && height == h){  
            
                                            }else {                    
                                                layer.alert("文件尺寸应为："+w+"*"+h+"！",{icon:7}); 
                                                $(file).prev().prev().remove()
                                                // $(file).parent().prev(".img-thumb").remove()               
                                                file.value = "";                    
                                                return false;                
                                            }            
                                        };            
                                        image.src= data;        
                                    };        
                                    reader.readAsDataURL(filePic);    
                                }else{        
                                    return false;    
                                }
                            }
                        
    
    
    
                    }
                })
            },
            getOrnamentPage:function(clothingNo,fn){
                var index=layer.load(2)
                $.ajax({
                    url: 'http://api.xykoo.cn/manage/ornament/getOrnamentPage',
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: 'get',
                    dataType: 'json',
                    data: {
                        page:1,
                        clothingNo:clothingNo,

                    },
                    success: function (data) {
                        layer.close(index)
                        // console.log(data);
                        switch (data.status) {
                            case 200:
                            fn(data.data.content[0].clothingId)
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
                        layer.alert('接口异常');
                    }
                })
            },
            
            editclothing: function (clothingId) {
                // switch (subtype) {
                //     case 1:
                //         title = "添加商品"
                //         break;
                //     case 2:
                //         title = "编辑商品"
                //         break;
                //     default:
                //         break;
                // };
                this.openIndex = layer.open({
                    title: "编辑商品",
                    type: 1,
                    maxmin: true,
                    anim: 5,
                    area: ['auto', "auto"],
                    offset: '0',
                    content: $("#EditclothingDTO").html(), //这里content是一个普通的String
                    success: function (layero, index) {
                        layer.full(index)
                        active.getbrandlist($(layero.selector + " [name=brandlist]"),function(){
                            active.getclothing(clothingId,active.intclothing)
                        })
                        // active.ClothingDTO.selector=layero.selector
                        var options = {
                            path: '/',    // 上传图片时指定的地址路径，类似form变淡的action属性
                            onSuccess: function (res) {    // 上传成功后执行的方法，res是接收的ajax响应内容
                                // console.log(res);
                            },
                            onFailure: function (res) {    // 上传失败后执行的方法，res是接收的ajax响应内容
                                // console.log(res);
                            }
                        }
                        
                        var mainImg = tinyImgUpload('mainImg', options);
                        var banner = tinyImgUpload('banner', options);
                        var details = tinyImgUpload('details', options);
                        $("#img-file-inputmainImg").on("change", function () {
                            // console.log($(this).get(0).files)
                            verificationPicFile($(this).get(0),304,400)
                            
                            return false
                        })
                        $("#img-file-inputbanner").on("change", function () {
                            // console.log($(this).get(0).files)
                            verificationPicFile($(this).get(0),750,852)
                            
                            return false
                        })
                        $("#img-file-inputdetails").on("change", function () {
                            // console.log($(this).get(0).files)
                            verificationPicFile($(this).get(0),280,280)
                            
                            return false
                        })
                        function verificationPicFile(file,w,h) {
                            var filePath = file.value; if (filePath) {        //读取图片数据        
                                var filePic = file.files[0];        
                                var reader = new FileReader();        
                                reader.onload = function (e) {            
                                    var data = e.target.result;            //加载图片获取图片真实宽度和高度            
                                    var image = new Image();            
                                    image.onload=function(){               
                                         var width = image.width;                
                                         var height = image.height;                
                                         if (width == w && height == h){  
            
                                            }else {                    
                                                layer.alert("文件尺寸应为："+w+"*"+h+"！",{icon:7}); 
                                                $(file).prev().prev().remove()
                                                // $(file).parent().prev(".img-thumb").remove()               
                                                file.value = "";                    
                                                return false;                
                                            }            
                                        };            
                                        image.src= data;        
                                    };        
                                    reader.readAsDataURL(filePic);    
                                }else{        
                                    return false;    
                                }
                            }
                        
    
    
    
                    }
                })
            },
            getbrandlist: function (obj,fn) {
                $.ajax({
                    url: 'http://api.xykoo.cn/manage/brand/findBrandPage',
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: 'post',
                    dataType: 'json',
                    data: {
                        page: 1,
                        size: 100000,
                        brandName: "",
                        brandStatus: 0
                    },
                    success: function (data) {
                        // console.log(data);
                        switch (data.status) {
                            case 200:
                                var brandlist = data.data.content;
    
                                obj.html("")
                                var opstr = "<option value=" + "" + " >请选择</option>";
                                obj.append(opstr)
                                for (var i = 0; i < brandlist.length; i++) {
                                    opstr = "<option value=" + brandlist[i].brandId + ">" + brandlist[i].brandName + "</option>"
                                    obj.append(opstr)
                                };
                                active.brandOk = true;
                                form.render();
                                if(fn){
                                    fn()
                                }

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
                        layer.alert('接口异常');
                    }
                })
            }
            ,intclothing:function(data){
                // console.log(data)
                if(data.data.clothing.starSameStyle==1){
                    data.data.clothing.starSameStyle=true
                }else{
                    data.data.clothing.starSameStyle=false
                }
                if(data.data.clothing.clothingStatus==1){
                    data.data.clothing.clothingStatus=true
                }else{
                    data.data.clothing.clothingStatus=false
                }
                form.val('ClothingDTO', {
                    "clothingNo": data.data.clothing.clothingNo
                    ,"clothingName": data.data.clothing.clothingName
                    ,"clothingPrice": data.data.clothing.clothingPrice
                    ,"brandlist": data.data.clothing.clothingBrandId
                    ,"clothingExplain": data.data.clothing.clothingExplain //开关状态
                    ,"shelves": data.data.clothing.clothingStatus
                    ,"starSameStyle": data.data.clothing.starSameStyle
                    ,"occupySeat": ""+data.data.clothing.occupySeat
                })
                form.render()
                
                active.intclothingImg(data.data.clothingImgs)
             
                
            },
            intclothingImg: function (data) {
                var clothingImg = data;
                // console.log(clothingImg);
                $('.img-thumb').remove()
                $.each(clothingImg, function (key, val) {
                    var image = new Image();
                    image.crossOrigin = '';
                    image.src = data[key].clothingImgUrl;
                    image.onload = function () {
                        var src = active.getBase64Image(image)
                        var imgtype = data[key].clothingImgType
                        
                        switch (imgtype) {
                            case 1:  //当等于1时 将图片展示在轮播图位置
                                $('#img-up-addbanner').before('<div class="img-thumb img-item"><img class="thumb-icon imgbanner" src="' + src + '"/>' + '<a href="" onclick="return false;" class="img-remove">x</a></div>');
                                break;
                            case 2: //当等于2时 将图片展示在详情图位置
                                $('#img-up-adddetails').before('<div class="img-thumb img-item"><img class="thumb-icon imgdetails" src="' + src + '"/>' + '<a href="" onclick="return false;" class="img-remove">x</a></div>');
                                break;
                            case 3:       //当等于3时 将图片展示在主图位置
                            $('#img-up-addmainImg').before('<div class="img-thumb img-item"><img class="thumb-icon imgmainImg" src="' + src + '"/>' + '<a href="" onclick="return false;" class="img-remove">x</a></div>');
                                break;
                        }
                    }

                })
            },
            getBase64Image: function (img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                var dataURL = canvas.toDataURL("image/" + ext);
                return dataURL;

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
            },
            getclothing:function(ornamentId,fn){
                
                var index = layer.load(2);
                $.ajax({
                    url: 'http://api.xykoo.cn/manage/ornament/getOrnamentInfo',
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: 'get',
                    dataType: 'json',
                    data: {
                        ornamentId:ornamentId
                    },
                    success: function (data) {
                        layer.close(index)
    
                        // console.log(data);
                        switch (data.status) {
                            case 200:
                                fn(data)
                                delimgId=[]
                                for(var i =0; i<data.data.clothingImgs.length;i++){
                                    delimgId.push(data.data.clothingImgs[i].clothingImgId)
                                }   
                                console.log(delimgId)
                                
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
                        layer.alert('接口异常');
                    }
                })
            },
            subclothing:function(formData,fn){
                var index=layer.load(2)
                $.ajax({
                    url: 'http://api.xykoo.cn/manage/ornament/addOrnamentInfo',
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: function (data) {
                        layer.close(index)
                        // console.log(data);
                        switch (data.status) {
                            case 200:
                                layer.msg("上传配饰成功",{icon:1})
                                tableIns.reload({})
                                layer.close(active.openIndex)
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
                                layer.alert(data.message);
                                break;
                        };
    
    
                    },
                    error: function () {
                        layer.close(index)
                        layer.alert('接口异常');
                    }
                })
            },
            delimg:function(ornamentImageId,fn){
                var index=layer.load(2)
                $.ajax({
                    url: 'http://api.xykoo.cn/manage/ornament/deleteOrnamentImage',
                    beforeSend: function (request) {
                        request.setRequestHeader("X-Auth-Token", token);
                    },
                    type: "get",
                    data: {
                        ornamentImageId:ornamentImageId
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
            }
            
        }

                
        var tableIns = table.render(ornamentList_option);
        table.on('toolbar(ornamentList)', function (obj) {
            var data = obj.data;
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'addclothing':
                    subtype = 1//添加
                    active.addclothing(data)
                    break;
                case 'delete':
                    layer.msg('删除');
                    break;
                case 'update':
                    break;
                default:
                    break;
            };
        });
        form.on('submit(search_No)', function (data) {
            // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
            // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
            // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            var where = {
                clothingStatus: 0
                ,clothingName: data.field.s_clothingName
                ,clothingNo: data.field.s_clothingNo
            }

            
            // console.log(data.field.time)
            tableIns.reload({ where })
            return false
        });
        form.on('submit(search_1)', function (data) {
            // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
            // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
            // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            tableIns.reload({
                where: {
                    clothingStatus: 1
                }
            })
            return false
        });
        form.on('submit(search_2)', function (data) {
            // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
            // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
            // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            tableIns.reload({
                where: {
                    clothingStatus: 2
                }
            })

            return false
        });
        form.on('submit(search_all)', function (data) {
            // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
            // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
            // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            tableIns.reload({
                where: {
                    clothingStatus: 0
                }
            })

            return false
        });
        form.on('submit(Popularity)', function (data) {
                // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                var ornamentList_option_1= JSON.parse(JSON.stringify(ornamentList_option));
                ornamentList_option_1.url="http://api.xykoo.cn/manage/popularity/getPopularityPage"
                ornamentList_option_1.where={
                    type:2
                }
                ornamentList_option_1.limit=1000
                ornamentList_option_1.toolbar="<div>人气商品</div>"
                ornamentList_option_1.parseData=function (res) { //res 即为原始返回的数据
                    // console.log(res.status)
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
                        "count": res.data.content.length, //解析数据长度
                        "data": res.data.content //解析数据列表
                    };
                }
                if($(data.elem).text()=="人气配饰"){
                    $(data.elem).text("全部商品")
                    $(".search_box .layui-input-inline").hide()
                    $(".search_box .layui-inline").hide()
                    $(data.elem).parent().show()
                    tableIns=table.render(ornamentList_option_1)
                }else{
                    $(".search_box .layui-input-inline").show()
                    $(".search_box .layui-inline").show()

                    tableIns = table.render(ornamentList_option)
                    $(data.elem).text("人气配饰")
                }
                
                return false
        })
        form.on('submit(addclothingSub)', function (data) {

            var cldata=data.field
            var formData=new FormData()
            var mainImgSrc = [];//商品主图
            var bannerSrc = []; //商品详情图
            var detailsSrc = [];//衣袋图
            var mainImgList = $('.imgmainImg');
            mainImgList.each(function (key, value) {
                
                // active.dataURLtoFile(mainImgList[key].src)
                // console.log(active.dataURLtoFile(mainImgList[key].src,"mainImgList"))
                formData.append("clothingImg",active.dataURLtoFile(mainImgList[key].src))
            });
            //获取轮播图信息
            var bannerList = $('.imgbanner');
            bannerList.each(function (key, val) {
                // console.log(active.dataURLtoFile(bannerList[key].src,"bannerList")) 
                formData.append("carouselImg",active.dataURLtoFile(bannerList[key].src))
                
            })
            //获取详情图信息
            var detailsList = $('.imgdetails');
            detailsList.each(function (key, val) {
                // console.log(active.dataURLtoFile(detailsList[key].src,"detailsList"))
                formData.append("detailsImg",active.dataURLtoFile(detailsList[key].src))
                
            })
            
            formData.append("standards",1)
            formData.append("clothingStyle",2)
            formData.append("clothingNo",cldata.clothingNo)
            formData.append("clothingName",cldata.clothingName)
            formData.append("occupySeat",cldata.occupySeat)
            formData.append("clothingPrice",cldata.clothingPrice)
            formData.append("clothingBrand",cldata.brandlist)
            formData.append("shelves",cldata.shelves=="on"?1:2)
            formData.append("starSameStyle",cldata.starSameStyle=="on"?1:0)
            formData.append("clothingExplain",cldata.clothingExplain)
            
            console.log(formData.getAll("carouselImg")) 
            active.subclothing(formData,function(){

                for(var i=0;i<delimgId.length;i++){
                        active.delimg(delimgId[i])
                    
                }
               
            })
            console.log(data) 

        })
        form.on('submit(addclothingSubCancel)', function (data) {
           layer.close(active.openIndex)
        })
})