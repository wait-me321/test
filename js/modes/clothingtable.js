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
        , subtype = 0
        , subsizeType = 0//0添加  1 编辑
    //商品属性容器
    var subLoadIndex;  //提交ajax的集合  
    var addclothingstyle = {
        add: [],
        del: []
    }
    var addclothingsizeTable = []
    var addclothingdata = {
        "carouselImg": [],
        "clothingImg": [],
        "detailsImg": [],
        "clothingBrand": null,
        "clothingExplain": null,

        "clothingName": null,
        "clothingNo": "",
        "clothingPrice": 0,
        "occupySeat":1,
        "shelves": 2, //是否上架  1上架   2下架
        "standards": 0, //分类 
        "starSameStyle": 0
    }
    var modifyClothingdata = {
        "clothing": {
            "classify": 1,
            "clothingBrandId": null,
            "clothingExplain": null,
            "clothingId": null,
            "clothingName": null,
            "clothingNo": null,
            "clothingPrice": 0,
            "clothingStatus": 2,
            "starSameStyle": 0,
            "occupySeat":1,
        },
        "clothingImg": [],
        "carouselImg": [],
        "detailsImg": []
    }

    layer.msg('欢迎进入商品管理', { time: 1000, anim: 1 });
    var clothingtable_option = {
        title: "商品列表"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#clothingtable'
        , height: ""
        , width: "100%"
        , method: "get"
        , url: 'http://api.xykoo.cn/manage/clothing/findClothingPage' //数据接口
         //数据接口
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
            startDate: "2016-01-01 00:00:0"
            , endDate: "2099-01-01 00:00:00"
        }
        , page: true //开启分页,

        , cols: [[ //表头
            { field: 'checkbox', title: 'ID', width: 30, type: "checkbox", hide: false }
            , { field: 'clothingNo', title: '商品编号', width: 100, align: "center" }
            , { field: 'leaseNumber', title: '租衣次数', width: 100, align: "center", sort: "true" }
            , { field: 'clothingImgUrl', title: '图片', width: 100, templet: "#clothingImgUrlTpl" }
            , { field: 'clothingName', title: '商品名称', width: 100, align: "center" }
            , { field: 'clothingPrice', title: '商品价格', width: 100, align: "center" }
            , { field: 'brandName', title: '品牌', width: 100, align: "center" }
            , { field: 'clothingStatus', title: '商品状态', width: 120, templet: "#clothingStatusTpl" }
            , { field: 'biaoqian', title: '分类', width: 100, templet: "#biaoqianTpl", align: "center" }
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
                    console.log(data)
                    var index = layer.load(2)
                    var clothingId = $(data.elem).attr("data-id")
                    //模拟提交的网络延迟
                    active.clothingLabel(clothingId, data.value, index)
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
                console.log(obj)
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
    var tableIns = table.render(clothingtable_option);

    table.on('sort(clothingtable)', function (obj) {

        if (obj.field == "leaseNumber") {
            switch (obj.type) {
                case "desc":
                    layer.msg("降序")
                    tableIns.reload({
                        where: {
                            startDate: "2016-01-01 00:00:00",
                            endDate: "2099-01-01 00:00:00",
                            sort: 1,
                            properties: "leaseNumber"
                        }
                        , page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                    break;
                case "asc":
                    layer.msg("升序")
                    tableIns.reload({
                        where: {
                            startDate: "2016-01-01 00:00:00",
                            endDate: "2099-01-01 00:00:00",
                            sort: 2,
                            properties: "leaseNumber"
                        }
                        , page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                    break;
                case null:
                    layer.msg("默认")
                    tableIns.reload({
                        where: {
                            startDate: "2016-01-01 00:00:00",
                            endDate: "2099-01-01 00:00:00"
                        }
                        , page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                    break;
            }

        }
    })
    table.on('toolbar(clothingtable)', function (obj) {
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
                layer.msg('编辑');
                break;
            default:
                break;
        };
    });

    form.on('checkbox(style)', function (data) {
        // console.log(data.elem); //得到checkbox原始DOM对象
        // console.log(data.elem.checked); //是否被选中，true或者false
        // console.log(data.value); //复选框value值，也可以通过data.elem.value得到
        // console.log(data.othis); //得到美化后的DOM对象
        var styleArr = []
        var allstyle = []
        $(".clothingStyle .layui-unselect").each(function (i, v) {

            $(this).hasClass("layui-form-checked") ? styleArr.push($(this).prev().val()) : null;
            allstyle.push($(this).prev().val())
        })
        addclothingstyle.add = styleArr
        addclothingstyle.del = allstyle
        // console.log(styleArr)
        // console.log(allstyle)
        styleArr = active.unique(styleArr);


    });
    active = {
        intclothing: function (clothingNo) {

        },

        addclothing: function (clothingNo, html, styleHtml, click_f_t, edit) {
            var title
            switch (subtype) {
                case 1:
                    title = "添加商品"
                    break;
                case 2:
                    title = "编辑商品"
                    break;
                default:
                    break;
            };
            this.openIndex = layer.open({
                title: title,
                type: 1,
                maxmin: true,
                anim: 5,
                area: ['auto', "auto"],
                offset: '0',
                content: $("#ClothingDTO").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    // active.ClothingDTO.selector=layero.selector

                    form.val("ClothingDTO", {
                        "clothingNo": clothingNo
                    })

                    if (html && styleHtml) {
                        $("[name=brandlist]").html(html)
                        $(".clothingStyle").html(styleHtml)
                    } else {

                    }
                    if (edit) {
                        var onloadindex = layer.load(2)
                        var set = setInterval(function () {
                            if (active.ClothingStyle && active.brandOk) {

                                layer.close(onloadindex)
                                $(".search_btn").click()
                                clearInterval(set)
                                active.ClothingStyle = false
                                active.brandOk = false


                            }
                        }, 1000)



                    }
                    if (click_f_t) {
                    } else {
                        active.getbrandlist($(layero.selector + " [name=brandlist]"))
                        active.getClothingStyle($(layero.selector + " .clothingStyle"))
                    }




                    //再次搜索的操作



                    $(layero.selector + " .search_btn").on("click", function () {
                        active.clintdata()
                        active.killbtn($(this), true)
                        active.reset()
                        active.getClothingByClothingNo($(layero.selector + " [name=clothingNo]").val())
                        active.selectImg()


                    })
                    layer.full(index)
                    setTimeout(function () {
                        $(layero.selector).css("width", "100%")
                    }, 100)





                    form.render();


                    $(layero.selector + " [lay-filter=addclothingSubCancel]").on("click", function () {
                        layer.close(index)
                    })



                }
            })
        },
        getbrandlist: function (obj) {
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
        },
        getClothingStyle: function (obj) {
            $.ajax({
                url: 'http://api.xykoo.cn/manage/clothingStyle/getClothingStyle',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {


                    switch (data.status) {
                        case 200:
                            var stylelist = data.data;

                            // console.log(stylelist);
                            obj.html("")
                            var opstr = "";
                            obj.append(opstr)
                            for (var i = 0; i < stylelist.length; i++) {

                                opstr = "<input type='checkbox' name=" + stylelist[i].styleId + " title=" + stylelist[i].styleName + "  value=" + stylelist[i].styleId + " lay-filter='style' >"
                                obj.append(opstr)
                            };
                            active.ClothingStyle = true;
                            form.render();
                            break;
                        case 401:
                            layer.alert('请重新登录');
                            break;
                        default:
                            layer.msg(data.message);
                            break;
                    };


                },
                error: function () {
                    layer.alert('接口异常');
                }
            })

        },
        getClothingByClothingNo: function (clothingNo) {
            // layer.msg(clothingNo)
            if (clothingNo.length <= 0) {
                layer.msg("请填写商品编号！")
                return false;
            }
            $.ajax({
                url: 'http://api.xykoo.cn/manage/clothing/getClothingByClothingNo',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'get',
                dataType: 'json',
                data: {
                    page: 1,
                    ClothingNo: clothingNo
                },
                success: function (data) {

                    switch (data.status) {

                        case 200:
                            modifyClothingdata.clothing.clothingId = data.data[0].clothingId
                            active.getsizeTable(data.data[0].clothingId, data.data[0].clothingTypeOne, data)

                            active.clothingMsg(data.data)
                            active.intclothingImg(data.data[3])
                            active.getAddInfo(data.data[0].clothingTypeOne, data.data[0].clothingTypeId)

                            form.render();
                            break;
                        case 401:
                            layer.alert('请重新登录');
                            break;
                        default:
                            var msg
                            if (data.message) {
                                msg = data.message
                            } else {
                                msg = data.msg
                            }
                            layer.confirm(msg, {}, function (index) {
                                layer.close(index);
                            });
                            break;
                    };


                },
                error: function () {
                    layer.alert('接口异常');
                }
            })
        },
        getsizeTable: function (clothingId, clothingTypeOne, clothingdata) {

            $.ajax({
                url: 'http://api.xykoo.cn/manage/sizetable/getSizeTableByClothingId',
                beforeSend: function (request) {
                    request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'get',
                dataType: 'json',
                data: {
                    page: 1,
                    ClothingId: clothingId
                },
                success: function (data) {
                    active.killbtn($(this), false)
                    switch (data.status) {
                        case 200:
                            if (data.data.length <= 0) {
                                subsizeType = 0
                                active.intsizeTable(clothingdata, clothingTypeOne, true)
                            } else {
                                subsizeType = 1
                                active.intsizeTable(data.data, clothingTypeOne, false)
                            }
                            form.render();
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            var msg
                            if (data.message) {
                                msg = data.message
                            } else {
                                msg = data.msg
                            }

                            layer.confirm(msg, {}, function (index) {
                                layer.close(index);
                            });


                            break;
                    };


                },
                error: function () {
                    active.killbtn($(this), false)
                    layer.alert('接口异常');
                }
            })
        },
        intsizeTable: function (data, clothingTypeOne, add) {
            var intdata
            // console.log(data)
            if (add == true) {
                intdata = (function () {
                    var obj = []
                    function SizeJson() {
                        var _this = {}
                        var type = 0
                        var catId = String(clothingTypeOne)
                        switch (catId) {
                            case "100030":
                                type = 1
                                break;
                            case "100031":
                                type = 1
                                break;
                            case "100032":
                                type = 2
                                break;
                            case "100057":
                                type = 3
                                break;
                            case "100058":

                                break;
                            case "100070":
                                break;
                            default:
                                layer.alert("这件不是服装！应该是配饰", { icon: 7 }, function () {
                                    layer.closeAll()
                                })
                                break;
                        }
                        _this = {
                            "clothingId": 0,
                            "sizeId": 0,
                            "type": type,
                            "model": null,
                            "trousersLength": null,
                            "waistline": null,
                            "hipline": null,
                            "chestWidth": null,
                            "clothesLength": null,
                            "shoulderWidth": null,
                            "sleeveLength": null,
                            "skirtLength": null
                        }
                        return _this
                    }
                    for (let i = 0; i < data.data[2].length; i++) {

                        var sjosn = new SizeJson()
                        sjosn.clothingId = data.data[2][i].clothingId;
                        sjosn.model = data.data[2][i].clothingStockType;
                        obj.push(sjosn)

                    }

                    return obj
                })()
            } else {
                intdata = data

            }

            var sizeTable_option = {
                elem: '#sizeTable' //指定原始表格元素选择器（推荐id选择器）
                , width: "100%"
                //,…… //更多参数参考右侧目录：基本参数选项
                , data: intdata
                //衣长：clothingLength  胸围：bust  肩宽：ShoulderWidth  袖长：SleeveLength
                //裤长：trousersLength  腰围：waist   臀围：buttocks  裙长：skirtLength
                , cols: [[ //表头
                    { field: 'model', title: '尺码', width: 100, align: "center", edit: 'text' }
                    , { field: 'trousersLength', title: '裤长', width: 100, align: "center", edit: 'text' }
                    , { field: 'waistline', title: '腰围', width: 100, align: "center", edit: 'text' }
                    , { field: 'hipline', title: '臀围', width: 100, align: "center", edit: 'text' }
                    , { field: 'chestWidth', title: '胸围', width: 100, align: "center", edit: 'text' }
                    , { field: 'clothesLength', title: '衣长', width: 100, align: "center", edit: 'text' }
                    , { field: 'shoulderWidth', title: '肩宽', width: 100, align: "center", edit: 'text' }
                    , { field: 'sleeveLength', title: '袖长', width: 100, align: "center", edit: 'text' }
                    , { field: 'skirtLength', title: '裙长', width: 100, align: "center", edit: 'text' }


                    , { field: 'clothingId', title: '商品id', width: 100, align: "center", hide: true, edit: 'text' }
                    , { field: 'sizeId', title: '尺寸id', width: 100, align: "center", hide: true, edit: 'text' }
                    , { field: 'type', title: '服装类型', width: 100, align: "center", hide: true, edit: 'text' }
                ]]
                , done: function (res) {
                    var sizeTab = [];
                    // console.log(res.data)
                    table.on('edit(sizeTable)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
                        sizeTab = []
                        // console.log(obj.value); //得到修改后的值
                        // console.log(obj.field); //当前编辑的字段名
                        // console.log(obj.data); //所在行的所有相关数据  

                        $("#sizeTable").next().find("tr").each(function (i, v) {

                            $(this).click()

                        })
                        // console.log(sizeTab)
                        addclothingsizeTable = sizeTab
                    });
                    table.on('row(sizeTable)', function (obj) {
                        // console.log("【") //得到当前行元素对象
                        // console.log(obj.tr) //得到当前行元素对象
                        // console.log("】") //得到当前行元素对象
                        // console.log(obj.data) //得到当前行数据
                        //obj.del(); //删除当前行
                        //obj.update(fields) //修改当前行数据
                        sizeTab.push(obj.data)
                        //得到当前行数据

                    });
                    $(".onlySubSize").on("click",function(){
                        active.subSizeTable(addclothingsizeTable)
                    })


                }



            }
            var dd
            //衣服类型id  1上装  2裤装 3裙装
            var catId = String(clothingTypeOne)
            switch (catId) {
                case "100030":
                    dd = 1
                    break;
                case "100031":
                    dd = 1
                    break;
                case "100032":
                    dd = 2
                    break;
                case "100057":
                    dd = 3
                    break;
                case "100058":

                    break;
                case "100070":
                    break;
                default:
                    break;
            }
            switch (dd) {

                case 1:
                    sizeTable_option.cols = [[ //表头
                        { field: 'model', title: '尺码', width: 60, align: "center" }
                        , { field: 'clothesLength', title: '衣长', width: 100, align: "center", edit: 'text' }
                        , { field: 'chestWidth', title: '胸围', width: 100, align: "center", edit: 'text' }
                        , { field: 'shoulderWidth', title: '肩宽', width: 100, align: "center", edit: 'text' }
                        , { field: 'sleeveLength', title: '袖长', width: 100, align: "center", edit: 'text' }



                        , { field: 'trousersLength', title: '裤长', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'waistline', title: '腰围', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'hipline', title: '臀围', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'skirtLength', title: '裙长', width: 100, align: "center", hide: true, edit: 'text' }

                        , { field: 'clothingId', title: '商品id', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'sizeId', title: '尺寸id', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'type', title: '服装类型', width: 100, align: "center", hide: true, edit: 'text' }
                    ]]
                    break;

                case 2:
                    sizeTable_option.cols = [[ //表头
                        { field: 'model', title: '尺码', width: 60, align: "center" }
                        , { field: 'trousersLength', title: '裤长', width: 100, align: "center", edit: 'text' }
                        , { field: 'waistline', title: '腰围', width: 100, align: "center", edit: 'text' }
                        , { field: 'hipline', title: '臀围', width: 100, align: "center", edit: 'text' }


                        , { field: 'clothesLength', title: '衣长', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'chestWidth', title: '胸围', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'shoulderWidth', title: '肩宽', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'sleeveLength', title: '袖长', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'skirtLength', title: '裙长', width: 100, align: "center", hide: true, edit: 'text' }

                        , { field: 'clothingId', title: '商品id', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'sizeId', title: '尺寸id', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'type', title: '服装类型', width: 100, align: "center", hide: true, edit: 'text' }
                    ]]
                    break;

                case 3:
                    sizeTable_option.cols = [[ //表头
                        { field: 'model', title: '尺码', width: 60, align: "center" }
                        , { field: 'skirtLength', title: '裙长', width: 100, align: "center", edit: 'text' }
                        , { field: 'waistline', title: '腰围', width: 100, align: "center", edit: 'text' }
                        , { field: 'chestWidth', title: '胸围', width: 100, align: "center", edit: 'text' }
                        , { field: 'shoulderWidth', title: '肩宽', width: 100, align: "center", edit: 'text' }
                        , { field: 'sleeveLength', title: '袖长', width: 100, align: "center", edit: 'text' }


                        , { field: 'trousersLength', title: '裤长', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'hipline', title: '臀围', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'clothesLength', title: '衣长', width: 100, align: "center", hide: true, edit: 'text' }

                        , { field: 'clothingId', title: '商品id', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'sizeId', title: '尺寸id', width: 100, align: "center", hide: true, edit: 'text' }
                        , { field: 'type', title: '服装类型', width: 100, align: "center", hide: true, edit: 'text' }
                    ]]
                    break;

                default:
                    break;

            }
            table.render(sizeTable_option);


        },
        clothingMsg: function (data) {
            var intjson = {
                // "clothingNo": "贤心" // "name": "value"
                "clothingName": data[0].clothingName
                , "clothingPrice": data[0].clothingPrice
                , "clothingExplain": data[0].clothingExplain
                , "brandlist": data[0].clothingBrandId
                , "shelves": false
                , "occupySeat": String(data[0].occupySeat)
                , "starSameStyle": false
                , "addPopularityClothing": false
                , "standards": String(data[0].clothingSortId)
            }

            for (var i = 0; i < data[1].length; i++) {
                intjson[String(data[1][i].styleId)] = true
            }

            //明星同款
            if (data[0].starSameStyle == 0 || data[0].starSameStyle == null) {
                intjson.starSameStyle = false;
            } else {
                intjson.starSameStyle = true;
            }
            //上架
            if (data[0].clothingStatus == 1) {
                intjson.shelves = true;
            } else if (data[0].clothingStatus == 2) {

                intjson.shelves = false;
            } else {
                intjson.shelves = false;
            }
            if (data[0].clothingSortId == 3) {
                intjson.standards = "0"
            } else {
                // intjson.standards = "0"
            }

            form.val("ClothingDTO", intjson)
            form.render();

        },
        unique: function (arr) {
            return Array.from(new Set(arr));
        },

        selectImg: function () {
            var options = {
                path: '/',    // 上传图片时指定的地址路径，类似form变淡的action属性
                onSuccess: function (res) {    // 上传成功后执行的方法，res是接收的ajax响应内容
                    // console.log(res);
                },
                onFailure: function (res) {    // 上传失败后执行的方法，res是接收的ajax响应内容
                    // console.log(res);
                }
            }
            $("#mainImg").remove()
            $("#banner").remove()
            $("#details").remove()


            // 执行生成图片上传插件的方法, 第一个参数是上面提到的准备生成组件的div选择器，第二个参数是设置的组件信息，执行方法后返回一个函数指针，指向执行上传功能的函数，通过把执行上传功能的函数暴露出来，用户就可以自己控制何时上传图片了。
            var mainImg = tinyImgUpload('mainImg', options);
            var banner = tinyImgUpload('banner', options);
            var details = tinyImgUpload('details', options);
            $("#img-file-inputmainImg").on("change", function () {
                console.log($(this).get(0).files)
                verificationPicFile($(this).get(0),304,400)
                
                return false
            })
            $("#img-file-inputbanner").on("change", function () {
                console.log($(this).get(0).files)
                verificationPicFile($(this).get(0),750,852)
                
                return false
            })
            $("#img-file-inputdetails").on("change", function () {
                console.log($(this).get(0).files)
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

                    

            },
            reset: function () {
                    var brandlistHtml = $("[name=brandlist]").html()
                    var clothingNo = $("[name=clothingNo]").val()
                    var clothingStyleHtml = $(".clothingStyle").html()
                    var click_f_t = true
                    layer.close(active.openIndex)
                    active.addclothing(clothingNo, brandlistHtml, clothingStyleHtml, click_f_t, false)


                },
                intclothingImg: function (data) {
                    var clothingImg = data;
                    // console.log(clothingImg);
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
                killbtn: function (obj, Boolean) {
                    // console.log(obj.get(0))
                    if (Boolean) {
                        obj.hide(0)
                        obj.attr("disabled", Boolean)
                    } else {
                        setTimeout(function () {
                            obj.show(0)
                        }, 3000)

                        obj.removeAttr("disabled")
                    }


                },
                getAddInfo: function (one, two) {
                    $.ajax({
                        url: 'http://api.xykoo.cn/manage/clothing/getAddInfo',
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (data) {
                            console.log(one + " " + two);
                            switch (data.status) {
                                case 200:

                                    var a
                                    var b
                                    for (var i = 0; i < data.data[0].length; i++) {
                                        if (data.data[0][i].catId == one) {
                                            a = data.data[0][i].catName
                                        } else if (data.data[0][i].catId == two) {
                                            b = data.data[0][i].catName

                                        }

                                    }
                                    $(".clstyleName").text(a + "-" + b)
                                    break;
                                case 401:
                                    layer.alert('请重新登录');
                                    break;
                                default:
                                    layer.alert(data.data);

                                    break;
                            };

                        },
                        error: function () {
                            layer.alert("接口错误");
                        }
                    })
                },
                clintdata: function () {
                    addclothingstyle = {
                        add: [],
                        del: []
                    }
                    addclothingsizeTable = []
                    addclothingdata = {
                        "carouselImg": [],
                        "clothingImg": [],
                        "detailsImg": [],
                        "clothingBrand": null,
                        "clothingExplain": "string",

                        "clothingName": "string",
                        "clothingNo": "string",
                        "clothingPrice": 0,
                        "occupySeat":1,
                        "shelves": 2, //是否上架  1上架   2下架
                        "standards": 0, //分类 
                        "starSameStyle": 0
                    }
                    modifyClothingdata = {
                        "clothing": {
                            "classify": 1,
                            "clothingBrandId": null,
                            "clothingExplain": null,
                            "clothingId": null,
                            "clothingName": null,
                            "clothingNo": null,
                            "clothingPrice": 0,
                            "clothingStatus": 2,
                            "starSameStyle": 0,
                            "occupySeat":1,
                        },
                        "clothingImg": [],
                        "carouselImg": [],
                        "detailsImg": []
                    }
                }
        , delstyle: function (clothingId, styleId, start) {
                    var json = {
                        clothingId: clothingId,
                        styleId: styleId
                    }
                    $.ajax({
                        url: "http://api.xykoo.cn//manage/clothing/deleteClothingStyleInfo",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: json,
                        // contentType: "application/json;charset=UTF-8",
                        success: function (data) {
                            switch (data.status) {
                                case 200:
                                    if (start == 1) {
                                        active.addstyle(clothingId, addclothingstyle.add)
                                    };
                                    break;
                                case 400:
                                    if (start == 1) {
                                        active.addstyle(clothingId, addclothingstyle.add)
                                    };
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
                            layer.alert("接口异常");
                        }
                    })

                },
                addstyle: function (clothingId, styleIds) {

                    subLoadIndex = layer.load(2)
                    var json = {
                        styleIds: styleIds,
                        clothingId: clothingId
                    }
                    console.log(json)

                    $.ajax({
                        url: "http://api.xykoo.cn/manage/clothing/addClothingStyleInfo",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: JSON.stringify(json),
                        contentType: "application/json;charset=UTF-8",
                        success: function (data) {
                            layer.close(subLoadIndex)
                            switch (data.status) {
                                case 200:
                                    // layer.msg("风格完成",{icon:1});

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
                            layer.close(subLoadIndex)
                            layer.alert("接口异常");
                        }
                    })
                },
                substyle: function (clothingId) {
                    for (var i = 0; i < addclothingstyle.del.length; i++) {
                        if (i == addclothingstyle.del.length - 1) {
                            active.delstyle(clothingId, addclothingstyle.del[i], 1)
                        } else {
                            active.delstyle(clothingId, addclothingstyle.del[i])
                        }
                    };
                },
                subclothing: function (obj) {
                    subLoadIndex = layer.load(2)
                    $.ajax({
                        url: "http://api.xykoo.cn/manage/clothing/addClothingDTO",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: JSON.stringify(obj),
                        contentType: "application/json;charset=UTF-8",
                        success: function (data) {
                            layer.close(subLoadIndex)
                            switch (data.status) {
                                case 200:
                                    alert("商品添加成功", { icon: 1 });
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
                            layer.close(subLoadIndex)
                            layer.alert("接口异常");
                        }
                    })
                },
                subMdifyClothing: function (obj) {
                    subLoadIndex = layer.load(2)
                    $.ajax({
                        url: "http://api.xykoo.cn/manage/clothing/modifyClothing",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: JSON.stringify(obj),
                        contentType: "application/json;charset=UTF-8",
                        success: function (data) {
                            layer.close(subLoadIndex)
                            switch (data.status) {
                                case 200:
                                    alert("商品编辑成功", { icon: 1 });
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
                            layer.close(subLoadIndex)
                            layer.alert("接口异常");
                        }
                    })
                },
                subSizeTable: function (obj) {
                    var url
                    if (obj.length == 0) {
                        return false;
                    }
                    subLoadIndex = layer.load(2)

                    switch (subsizeType) {
                        case 0:
                            url = "http://api.xykoo.cn/manage/sizetable/addSizeTableByClothingId"
                            break;
                        case 1:
                            url = "http://api.xykoo.cn/manage/sizetable/modifySizeTableByClothingId"
                            break;
                        default:
                            break;
                    };


                    $.ajax({
                        url: url,
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: JSON.stringify(obj),
                        contentType: "application/json;charset=UTF-8",
                        success: function (data) {
                            layer.close(subLoadIndex)
                            switch (data.status) {
                                case 200:
                                    layer.msg("尺码表更新成功", { icon: 1 });
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
                            layer.close(subLoadIndex)
                            layer.alert("接口异常");
                        }
                    })
                },
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
                            layer.close(subLoadIndex)
                            layer.close(index)
                            layer.close(index1)
                            switch (data.status){
                                case 200:

                                    layer.msg("更新成功", { icon: 1 });
                                    // tableIns.reload()
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
                            layer.close(subLoadIndex)
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
                                    tableIns.reload()
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
                clothingLabel: function (clothingId, clothingLabel, index, index1) {
                    $.ajax({
                        url: "http://api.xykoo.cn/manage/clothing/updateClothing",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: {
                            clothingId: clothingId,
                            clothingLabel: clothingLabel
                        },
                        success: function (data) {
                            layer.close(subLoadIndex)
                            layer.close(index)
                            layer.close(index1)
                            switch (data.status) {
                                case 200:

                                    layer.msg("更新成功", { icon: 1 });
                                    // tableIns.reload({})
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
                            layer.close(subLoadIndex)
                            layer.close(index)
                            layer.close(index1)
                            layer.alert("接口异常");
                        }
                    })

                },
                addrenqi: function (clothingId, index, index1) {
                    $.ajax({
                        url: "http://api.xykoo.cn/manage/popularity/addPopularityClothing",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Auth-Token", token);
                        },
                        type: 'post',// 引号
                        dataType: "json",
                        data: {
                            clothingId: clothingId
                        },
                        success: function (data) {
                            layer.close(subLoadIndex)
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
                            layer.close(subLoadIndex)
                            layer.close(index)
                            layer.close(index1)
                            layer.alert("接口异常");
                        }
                    })

                },
                reloadStatus: function (clothingStatus) {

                    tableIns.reload({
                        where: {
                            startDate: "2016-01-01 00:00:00",
                            endDate: "2099-01-01 00:00:00",
                            sort: 1,
                            properties: "leaseNumber",
                            clothingStatus: 0
                        }
                        , page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }






            }



            table.on('tool(clothingtable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
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
                    
                    
                } else if (layEvent == 'addPopularity') { //编辑
                    //do something
                    //同步更新缓存对应的值
                    layer.confirm("确定加入人气美衣吗？", { icon: 3 }, function (index1) {

                        var index = layer.load(2)
                        //模拟提交的网络延迟
                        active.addrenqi(data.clothingId, index, index1)


                    }, function () {
                        //取消的操作



                    })
                } else if (layEvent === 'bianji') { //编辑
                    //do something
                    subtype = 2//编辑
                    //同步更新缓存对应的值
                    active.addclothing(data.clothingNo, "", "", "", true)
                } else if (layEvent === 'deletePopularity') { //编辑
                    //do something
                    layer.confirm('真的取消人气吗？', { icon: 3 }, function (index1) {
                        var index = layer.load(2)
    
                        active.deletePopularityClothing(data.clothingId, index, index1)
    
                        //向服务端发送删除指令
                    });
                }

                
                
            });






            form.on('submit(addclothingSub)', function (data) {
                if (addclothingstyle.del.length == 0) {

                } else {
                    active.substyle(modifyClothingdata.clothing.clothingId)

                }
                active.subSizeTable(addclothingsizeTable)

                var mainImgSrc = [];//商品主图
                var bannerSrc = []; //商品详情图
                var detailsSrc = [];//衣袋图
                var mainImgList = $('.imgmainImg');
                mainImgList.each(function (key, value) {
                    mainImgSrc[key] = mainImgList[key].src;
                });
                //获取轮播图信息
                var bannerList = $('.imgbanner');
                bannerList.each(function (key, val) {
                    bannerSrc[key] = bannerList[key].src;
                })
                //获取详情图信息
                var detailsList = $('.imgdetails');
                detailsList.each(function (key, val) {
                    detailsSrc[key] = detailsList[key].src;
                })
                // console.log(data.field)
                switch (subtype) {
                    case 1: //添加商品————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
                        addclothingdata.clothingBrand = data.field.brandlist
                        addclothingdata.clothingExplain = data.field.clothingExplain

                        addclothingdata.clothingName = data.field.clothingName
                        addclothingdata.clothingNo = data.field.clothingNo
                        addclothingdata.clothingPrice = data.field.clothingPrice
                        addclothingdata.standards = parseInt(data.field.standards)
                        addclothingdata.occupySeat = data.field.occupySeat
                        if (data.field.shelves == "on") {
                            addclothingdata.shelves = 1//上架
                        }

                        if (data.field.starSameStyle == "on") {
                            addclothingdata.starSameStyle = 1//明星同款
                        }




                        addclothingdata.detailsImg = detailsSrc
                        addclothingdata.carouselImg = bannerSrc
                        addclothingdata.clothingImg = mainImgSrc

                        // console.log(addclothingdata)
                        active.subclothing(addclothingdata)//添加商品详情
                        break;
                    case 2:  //修改商品————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
                        console.log(modifyClothingdata)
                        modifyClothingdata.clothing.clothingBrandId = data.field.brandlist
                        modifyClothingdata.clothing.clothingExplain = data.field.clothingExplain

                        modifyClothingdata.clothing.clothingName = data.field.clothingName
                        modifyClothingdata.clothing.clothingNo = data.field.clothingNo
                        modifyClothingdata.clothing.clothingPrice = data.field.clothingPrice
                        modifyClothingdata.clothing.clothingSortId = parseInt(data.field.standards)
                        modifyClothingdata.clothing.occupySeat = Number(data.field.occupySeat)
                        if (data.field.shelves == "on") {
                            modifyClothingdata.clothing.clothingStatus = 1//上架
                        }

                        if (data.field.starSameStyle == "on") {
                            modifyClothingdata.clothing.starSameStyle = 1//明星同款
                        }

                        modifyClothingdata.detailsImg = detailsSrc
                        modifyClothingdata.carouselImg = bannerSrc
                        modifyClothingdata.clothingImg = mainImgSrc

                        active.subMdifyClothing(modifyClothingdata)
                        break;
                    default:
                        break;
                }
                // layer.msg(JSON.stringify(data.field));
                // console.log(modifyClothingdata)

                return false;
            });


            form.on('submit(search_No)', function (data) {
                // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                var where = {
                    clothingStatus: 0
                    , clothingName: data.field.s_clothingNo
                    , clothingNo: data.field.s_clothingName
                    , startDate: "2016-01-01 00:00:0"
                    , endDate: "2020-01-01 00:00:00"
                }

                if (data.field.time == false) {

                } else {
                    var time = $("#time").val().split(' ~ ')
                    where.startDate = time[0] + " 00:00:00",
                        where.endDate = time[1] + " 23:59:59"
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
                        , startDate: "2016-01-01 00:00:0"
                        , endDate: "2020-01-01 00:00:00"
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
                        , startDate: "2016-01-01 00:00:0"
                        , endDate: "2099-01-01 00:00:00"
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
                        , startDate: "2016-01-01 00:00:0"
                        , endDate: "2099-01-01 00:00:00"
                    }
                })

                return false
            });
            form.on('submit(Popularity)', function (data) {
                // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                var clothingtable_option_1= JSON.parse(JSON.stringify(clothingtable_option));
                clothingtable_option_1.url="http://api.xykoo.cn/manage/popularity/getPopularityPage"
                clothingtable_option_1.where={
                    type:1,
                    
                }
                clothingtable_option_1.limit=1000
                clothingtable_option_1.toolbar="<div>人气商品</div>"
                clothingtable_option_1.parseData=function (res) { //res 即为原始返回的数据
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

                
               
                if($(data.elem).text()=="人气服装"){
                    $(data.elem).text("全部商品")
                    $(".search_box .layui-input-inline").hide()
                    $(".search_box .layui-inline").hide()
                    $(data.elem).parent().show()
                    tableIns=table.render(clothingtable_option_1)
                }else{
                    $(".search_box .layui-input-inline").show()
                    $(".search_box .layui-inline").show()

                    tableIns = table.render(clothingtable_option)
                    $(data.elem).text("人气服装")
                }
                
                return false
            });


            laydateActive = {
                day30: function () {
                    var oneday = 60 * 60 * 24 * 1000
                    var T = new Date()
                    var newdate = T.getTime()
                    var loddate = newdate - 29 * oneday

                    $("#time").val(reStrDate(loddate) + " ~ " + reStrDate(newdate))
                    $("#layui-laydate1").hide(100)
                },
                day7: function () {
                    var oneday = 60 * 60 * 24 * 1000
                    var T = new Date()
                    var newdate = T.getTime()
                    var loddate = newdate - 6 * oneday

                    $("#time").val(reStrDate(loddate) + " ~ " + reStrDate(newdate))
                    $("#layui-laydate1").hide(100)
                },
                today:function () {
                    var oneday = 60 * 60 * 24 * 1000
                    var T = new Date()
                    var newdate = T.getTime()
                    var loddate = newdate 

                    $("#time").val(reStrDate(loddate) + " ~ " + reStrDate(newdate))
                    $("#layui-laydate1").hide(100)
                }
            }
            $('.quncz_box .layui-btn,.layui-quote-nm .layui-btn').on('click', function () {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            laydate.render({
                elem: '#time' //指定元素
                , type: 'date'
                , range: "~"
                , position: ""
                , btns: ['day30', 'day7','today', 'clear', 'confirm']
                , ready: function (date) {

                    $('.laydate-btns-day30').text("近30天")
                    $('.laydate-btns-day7').text("近7天")
                    $('.laydate-btns-today').text("今天")
                    $(".laydate-footer-btns span").on("click", function () {
                        var type = $(this).attr('lay-type');

                        laydateActive[type] ? laydateActive[type].call(this) : '';
                    })


                },
                done: function (value, date, endDate) {
                    // {"year":2018,"month":11,"date":13,"hours":0,"minutes":0,"seconds":0}

                }

            });
            $("#time").on("focus", function () {
                // alert($("body").width())
                timer = setInterval(function () {
                    $("#layui-laydate1").css("left", 10)
                })
                $("body").css("min-width", 1024)
            })
            $("#time").on("blur", function () {
                clearInterval(timer)

                $("body").css("min-width", "auto")
            })
            function reStrDate(intDate) {
                function add0(m) {
                    return m < 10 ? '0' + m : m
                }

                var sDate = new Date(intDate);
                var year = sDate.getFullYear();
                var month = sDate.getMonth() + 1;
                var date = sDate.getDate();
                var hours = sDate.getHours();
                var minutes = sDate.getMinutes();
                var seconds = sDate.getSeconds();
                return year + '-' + add0(month) + '-' + add0(date)
                //  + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
            }


            exports('clothingtable', {})

        })