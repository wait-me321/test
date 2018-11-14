layui.define(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate"], function (exports) {
    // localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cueHlrb28uY24iLCJhZG1pbiI6MTUsImp0aSI6IjFENDhDQzQwLUU5QTktNEVDNi1BRTAwLUMwQjBFNkU4M0ZCQyJ9.DYoRWX393SmPGE0HMFdcKV3dquAmUB3R5oArC7RR5AU")
    var layer = layui.layer
        , form = layui.form
        , $ = layui.$
        , laypage = layui.laypage
        , laydate = layui.laydate
        , element = layui.element
        , laytpl = layui.laytpl
        , table = layui.table
        , active
        , cityArr
        , token = localStorage.getItem("token")
        , newtoken = localStorage.getItem("newtoken")
        // newtoken="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cueHlrb28uY24iLCJhZG1pbiI6MTUsImp0aSI6Ijc4RUQ5RTA3LUE2MTgtNERBMS1BQzU0LUY2RTYxNDM3QjYxNyJ9.9wNGFrhB7cfwVXetw0VMPgiFQC9dddYmPcqUiEEIC9M"
        
    // layer.msg('校园大使', { time: 1000, anim: 1 });
    var school_table_option = {
        elem: '#agency_school_table'
        //   , id: 'usertable'
        , height: ""
        , toolbar: "#toolbarTpl"
        , defaultToolbar: ['filter']//, 'print', 'exports'
        , url: 'http://api.console.xykoo.cn/schoolAgent/getSchoolAgentPage' //数据接口
        , method: "get"
        
        , response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 200 //成功的状态码，默认：0
            , msgName: 'msg' //状态信息的字段名称，默认：msg
            , countName: 'count' //数据总数的字段名称，默认：count
            , dataName: 'data' //数据列表的字段名称，默认：data
        }
        , parseData: function (res) { //res 即为原始返回的数据
            console.log(res.status)
            
            // res.count = res.data.length;
            if (res.status == 200) {
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.data.totalElements, //解析数据长度
                    "data": res.data.schoolAgentVOList //解析数据列表
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
        , page: true
        , cols: [[ //表头
            // { field: 'clothingNo', title: 'userId', width: 80, type: "checkbox"},colspan
            { field: 'name', title: '名字', width: 100, align: "left" }
            , { field: 'phone', title: '手机号', width: 120, align: "center" }
            , { field: 'city', title: '城市', width: 80, align: "center" }
            , { field: 'school', title: '院校', width: 170, align: "center" }
            , { field: 'cityAgent', title: '所属代理', width: 100, align: "center" }
            , { field: 'createDate', title: '日期', width: 200, align: "center", templet: "#creatTimeTpl" }
            , { field: 'registerNumber', title: '总注册数', width: 100, align: "center" }
            , { field: 'payNumber', title: '总付费数', width: 100, align: "center" }
            , { field: 'caozuo', title: '操作', width: 80, align: "center", templet: "#caozuoTpl", fixed: "right" }

        ]
            // ,
            //     [

            //     { field: 'clothingImgUrl', title: '图片', width: 100, templet: '#clothingImgUrlTpl', align: "center" }
            //     , { field: 'clothingNo', title: '商品编号', width: 100,templet: '#clothingNoTpl', align: "center" }
            //     , { field: 'clothingStockType', title: '尺码', templet: '#clothingStockTypeTpl', align: "center" }
            //     , { field: '', title: '数量', templet: '#orderDetailsVoListTpl', align: "center" }
            //     ]
        ]
        ,request: {
            pageName: 'page_1' //页码的参数名称，默认：page
            ,limitName: 'size' //每页数据量的参数名，默认：limit

        }
        , headers: { "token": newtoken,
        "Accept": "*/*"
    }
        , done: function (res, curr, count) {
        }
        ,where:{
        }


    }

    var city_table_option = {
        elem: '#agency_city_table'
        //   , id: 'usertable'
        , height: ""
        , toolbar: "#toolbarTpl"
        , defaultToolbar: ['filter']//, 'print', 'exports'
        , url: 'http://api.console.xykoo.cn/cityAgent/getCityAgentPage' //数据接口
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

            if (res.status == 200) {
                res.count = res.data.length;
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.data.totalElements, //解析数据长度
                    "data": res.data.cityAgentVOList //解析数据列表
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
        , page: true //开启分页

        , cols: [[ //表头
            // { field: 'clothingNo', title: 'userId', width: 80, type: "checkbox"},colspan
            { field: 'name', title: '名字', width: 100, align: "left" }
            , { field: 'phone', title: '手机号', width: 120, align: "center" }
            , { field: 'city', title: '城市', width: 100, align: "center" }
            , { field: 'schoolAgentCount', title: '下属人数', width: 100, align: "center" }
            , { field: 'count', title: '总注册数', width: 100, align: "center" }
            , { field: 'payCount', title: '总付费数', width: 100, align: "center" }
            , { field: 'ipCount', title: '(ip)总注册数', width: 130, align: "center" }
            , { field: 'ipPayCount', title: '(ip)总付费数', width: 130, align: "center" }
            , { field: 'caozuo', title: '操作', width: 80, templet: "#caozuoTpl", align: "center", fixed: "right" }

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
            pageName: 'page_1' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit

        }
        ,loading:true
        , headers: { "token": newtoken,
        "Accept": "*/*" }
        , done: function () {

        }

    }
    var schoolList_table_option = {
        elem: '#school_table'
        //   , id: 'usertable'
        , height: ""
        , toolbar: "#toolbarTpl"
        , defaultToolbar: ['filter']//, 'print', 'exports'
        , url: 'http://api.console.xykoo.cn/schoolAgent/getSchoolList' //数据接口
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
            if (res.status == 200) {
                res.count = res.data.length;
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
        ,limit:1000000
        , page: true //开启分页
        , cols: [[ //表头
            // { field: 'clothingNo', title: 'userId', width: 80, type: "checkbox"},colspan
            { field: 'schoolId', title: 'ID', width: 60, align: "left" }
            , { field: 'province', title: '省份', width: 80, align: "center" }
            , { field: 'city', title: '城市', width: 80, align: "center" }
            , { field: 'schoolName', title: '学校名称', width: 200, align: "center" }
            , { field: 'caozuo', title: '操作', width: 80, templet: "#caozuoTpl", align: "center", fixed: "right" }

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
        , headers: { "token": newtoken,
        "Accept": "*/*" }
        , done: function () {

        }

    }
    var school_tableIns = table.render(school_table_option);
  
    

    
    var city_tableIns = table.render(city_table_option);
    var schoolList_tableIns = table.render(schoolList_table_option);
    // school_tableIns.reload({});
    table.on('toolbar(agency_school_table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'addAgencySchool':
                active.addAgencySchool()
                break;
            case 'delete':
                layer.msg('删除');
                break;
            case 'update':
                layer.msg('编辑');
                break;
        };
    });

    table.on('tool(agency_school_table)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') { //查看
            //do somehing
        } else if (layEvent === 'delAgencySchool') { //删除
            layer.confirm('要删除吗?', { offset: '0' }, function (index) {
                active.delAgencySchool(obj.data.phone)
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);


                //向服务端发送删除指令
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            //同步更新缓存对应的值
            obj.update({
                username: '123'
                , title: 'xxx'
            });
        }
    });



    table.on('toolbar(agency_city_table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'addAgencyCity':
                active.addAgencyCity()
                break;
            case 'delete':
                layer.msg('删除');
                break;
            case 'update':
                layer.msg('编辑');
                break;
        };
    });
    table.on('tool(agency_city_table)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        if (layEvent === 'detail') { //查看
            //do somehing
        } else if (layEvent === 'delAgencyCity') { //删除
            layer.confirm('要删除吗?', { offset: '0' }, function (index) {
                // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                active.delAgencyCity(obj.data.phone)
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            //同步更新缓存对应的值
            obj.update({
                username: '123'
                , title: 'xxx'
            });
        }
    });



    table.on('toolbar(school_table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'addSchoolList':
                active.addSchoolList()
                break;
            case 'delete':
                layer.msg('删除');
                break;
            case 'update':
                layer.msg('编辑');
                break;
        };
    });

    table.on('tool(school_table)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') { //查看
            //do somehing
        } else if (layEvent === 'delSchool') { //删除
            layer.confirm('要删除吗?', { offset: '0' }, function (index) {

                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                active.delSchool(obj.data.schoolId)
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            //同步更新缓存对应的值
            obj.update({
                username: '123'
                , title: 'xxx'
            });
        }
    });

    active = {
        //打开校园大使弹窗
        addAgencySchool: function () {
            layer.open({
                title: "添加校园大使",
                type: 1,
                maxmin: true,
                area: ['400px', "500px"],
                offset: '0',
                content: $("#addAgencySchoolTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    active.getSchool($("[name=select_school]"))
                    active.getcityAgents($("[name=select_superiorName]"))
                    active.getcity($("[name=select_city]"))
                    form.render();


                    form.on('submit(AgencySchoolSub)', function (data) {
                        // layer.msg(JSON.stringify(data.field));
                        console.log(data.field);

                        var obj = {
                            "agentCity": data.field.select_city,
                            "agentName": data.field.name,
                            "agentPhone": data.field.phone,
                            "agentPwd": data.field.pass,
                            "agentSchool": $(layero.selector + " [namer=select_school]").val(),
                            "cityAgentName": data.field.select_superiorName,
                            "schoolId": data.field.select_school
                        }
                        active.addAgencySchoolSub(obj)
                        return false;

                    });
                    $(layero.selector + " [lay-filter=AgencySchoolCancel]").on("click", function () {
                        layer.close(index)
                    })

                }
            })
        },
        //打开城市代理弹窗
        addAgencyCity: function () {
            layer.open({
                title: "添加城市代理",
                type: 1,
                maxmin: true,
                area: ['400px', "500px"],
                offset: '0',
                content: $("#addAgencySchoolTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    // active.getSchool($("[name=select_school]"))
                    // active.getcityAgents($("[name=select_superiorName]"))
                    active.getcity($("[name=select_city]"))
                    form.render();


                    form.on('submit(AgencySchoolSub)', function (data) {
                        // layer.msg(JSON.stringify(data.field));
                        console.log(data.field)

                        var obj = {
                            "agentCity": data.field.select_city,
                            "agentName": data.field.name,
                            "agentPhone": data.field.phone,
                            "agentPwd": data.field.pass
                        }
                        active.addAgencyCitySub(obj)
                        return false;
                    });
                    $(layero.selector + " [lay-filter=AgencySchoolCancel]").on("click", function () {
                        layer.close(index)
                    })

                }
            })
        },
        //打开学校弹窗
        addSchoolList: function () {
            layer.open({
                title: "添加学校",
                type: 1,
                maxmin: true,
                area: ['400px', "500px"],
                offset: '0',
                content: $("#addSchoolListTpl").html(), //这里content是一个普通的String
                success: function (layero, index) {
                    if ($(document).width() < 1024) {
                        layer.full(index)
                    }
                    // active.getSchool($("[name=select_school]"))
                    // active.getcityAgents($("[name=select_superiorName]"))
                    active.getcity($("[name=select_city]"))
                    form.render();


                    form.on('submit(AgencySchoolSub)', function (data) {
                        // layer.msg(JSON.stringify(data.field));

                        console.log(data.field)
                        var obj = {
                            "city": data.field.select_city,
                            "province": $(layero.selector + " [name=select_city] option:checked").parent().attr("label"),
                            "schoolId": 0,
                            "schoolName": data.field.schoolName
                        }
                        active.addSchoolListSub(obj)
                        return false;
                    });
                    $(layero.selector + " [lay-filter=AgencySchoolCancel]").on("click", function () {
                        layer.close(index)
                    })

                }
            })
        },
        //获取学校信息
        getSchool: function (obj) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/schoolAgent/getSchoolList',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {


                    console.log(data);
                    switch (data.status) {
                        case 200:
                            var schools = data.data;

                            obj.html("")
                            var opstr = "<option value=" + "" + " >请选择</option>";
                            obj.append(opstr)
                            for (var i = 0; i < schools.length; i++) {
                                opstr = "<option value=" + schools[i].schoolId + ">" + schools[i].schoolName + "</option>"
                                obj.append(opstr)
                            };
                            form.render();
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
                }
            })
        },
        //获取城市代理信息
        getcityAgents: function (obj) {

            $.ajax({
                url: 'http://api.console.xykoo.cn/cityAgent/getCityAgentPage',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            var cityAgents = data.data.cityAgentVOList;

                            obj.html("")
                            var opstr = "<option value=" + "" + " >请选择</option> ";
                            obj.append(opstr)
                            for (var i = 0; i < cityAgents.length; i++) {
                                opstr = "<option value=" + cityAgents[i].name + ">" + cityAgents[i].name + "</option>"
                                obj.append(opstr)
                            };
                            form.render();

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

                }
            })
        },
        //获取城市列表
        getcity: function (obj) {
            obj.html("")
            var opstr = "<option value=" + "" + " >请选择</option> ";

            for (var i = 0; i < cityArr.provinces.length; i++) {
                opstr += "<optgroup label=" + cityArr.provinces[i].provinceName + ">"
                for (var j = 0; j < cityArr.provinces[i].citys.length; j++) {
                    opstr += "<option value=" + cityArr.provinces[i].citys[j].citysName + ">" + cityArr.provinces[i].citys[j].citysName + "</option>"

                }
                opstr += "</optgroup>"

            };
            obj.append(opstr)
            form.render();
        },
        //提交校园大使
        addAgencySchoolSub: function (obj) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/schoolAgent/addSchoolAgent',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg('添加成功', { icon: 1 });
                            school_tableIns.reload({});
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.data);

                            break;
                    };

                },
                error: function () {

                }
            })
        },
        //提交城市代理
        addAgencyCitySub: function (obj) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/cityAgent/addCityAgent',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg('添加成功', { icon: 1 });
                            city_tableIns.reload({});
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.data);

                            break;
                    };

                },
                error: function () {

                }
            })

        },
        addSchoolListSub: function (obj) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/schoolAgent/addSchool',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg('添加成功', { icon: 1 });
                            schoolList_tableIns.reload({});
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.data);

                            break;
                    };

                },
                error: function () {

                }
            })

        },
        delAgencySchool: function (schoolAgentPhone) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/schoolAgent/deleteSchoolAgent',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',
                dataType: 'json',
                data: {
                    schoolAgentPhone: schoolAgentPhone
                },
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg('删除成功', { icon: 1 });
                            school_tableIns.reload({});
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.data);

                            break;
                    };

                },
                error: function () {

                }
            })
        },
        delAgencyCity: function (cityAgentPhone) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/cityAgent/deleteCityAgent',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',
                dataType: 'json',
                data: {
                    cityAgentPhone: cityAgentPhone
                },
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg('删除成功', { icon: 1 });
                            city_tableIns.reload({});
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.data);

                            break;
                    };

                },
                error: function () {

                }
            })
        },


        delSchool: function (schoolId) {
            $.ajax({
                url: 'http://api.console.xykoo.cn/schoolAgent/deleteSchool',
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',
                dataType: 'json',
                data: {
                    schoolId: schoolId
                },
                success: function (data) {
                    console.log(data);
                    switch (data.status) {
                        case 200:
                            layer.msg('删除成功', { icon: 1 });
                            schoolList_tableIns.reload({});
                            break;
                        case 401:
                            layer.msg('请重新登录');
                            break;
                        default:
                            layer.msg(data.data);

                            break;
                    };

                },
                error: function () {

                }
            })
        }


    }

    //layui.$(".addAgencyCityBox [name=select_city] option:checked").parent().attr("label")
    cityArr = {
        "provinces": [
            {
                "citys": [
                    {
                        "citysName": "北京市"
                    }
                ],
                "provinceName": "北京市"
            },
            {
                "citys": [
                    {
                        "citysName": "天津市"
                    }
                ],
                "provinceName": "天津市"
            },
            {
                "citys": [
                    {
                        "citysName": "上海市"
                    }
                ],
                "provinceName": "上海市"
            },
            {
                "citys": [
                    {
                        "citysName": "重庆市"
                    }
                ],
                "provinceName": "重庆市"
            },
            {
                "citys": [
                    {
                        "citysName": "香港特别行政区"
                    }
                ],
                "provinceName": "香港"
            },
            {
                "citys": [
                    {
                        "citysName": "澳门特别行政区"
                    }
                ],
                "provinceName": "澳门"
            },
            {
                "citys": [
                    {
                        "citysName": "石家庄市"
                    },
                    {
                        "citysName": "邯郸市"
                    },
                    {
                        "citysName": "唐山市"
                    },
                    {
                        "citysName": "保定市"
                    },
                    {
                        "citysName": "秦皇岛市"
                    },
                    {
                        "citysName": "邢台市"
                    },
                    {
                        "citysName": "张家口市"
                    },
                    {
                        "citysName": "承德市"
                    },
                    {
                        "citysName": "沧州市"
                    },
                    {
                        "citysName": "廊坊市"
                    },
                    {
                        "citysName": "衡水市"
                    },
                    {
                        "citysName": "辛集市"
                    },
                    {
                        "citysName": "晋州市"
                    },
                    {
                        "citysName": "新乐市"
                    },
                    {
                        "citysName": "遵化市"
                    },
                    {
                        "citysName": "迁安市"
                    },
                    {
                        "citysName": "霸州市"
                    },
                    {
                        "citysName": "三河市"
                    },
                    {
                        "citysName": "定州市"
                    },
                    {
                        "citysName": "涿州市"
                    },
                    {
                        "citysName": "安国市"
                    },
                    {
                        "citysName": "高碑店市"
                    },
                    {
                        "citysName": "泊头市"
                    },
                    {
                        "citysName": "任丘市"
                    },
                    {
                        "citysName": "黄骅市"
                    },
                    {
                        "citysName": "河间市"
                    },
                    {
                        "citysName": "冀州市"
                    },
                    {
                        "citysName": "深州市"
                    },
                    {
                        "citysName": "南宫市"
                    },
                    {
                        "citysName": "沙河市"
                    },
                    {
                        "citysName": "武安市"
                    }
                ],
                "provinceName": "河北省"
            },
            {
                "citys": [
                    {
                        "citysName": "太原市"
                    },
                    {
                        "citysName": "大同市"
                    },
                    {
                        "citysName": "朔州市"
                    },
                    {
                        "citysName": "阳泉市"
                    },
                    {
                        "citysName": "长治市"
                    },
                    {
                        "citysName": "晋城市"
                    },
                    {
                        "citysName": "忻州市"
                    },
                    {
                        "citysName": "吕梁市"
                    },
                    {
                        "citysName": "晋中市"
                    },
                    {
                        "citysName": "临汾市"
                    },
                    {
                        "citysName": "运城市"
                    },
                    {
                        "citysName": "古交市"
                    },
                    {
                        "citysName": "潞城市"
                    },
                    {
                        "citysName": "高平市"
                    },
                    {
                        "citysName": "原平市"
                    },
                    {
                        "citysName": "孝义市"
                    },
                    {
                        "citysName": "汾阳市"
                    },
                    {
                        "citysName": "介休市"
                    },
                    {
                        "citysName": "侯马市"
                    },
                    {
                        "citysName": "霍州市"
                    },
                    {
                        "citysName": "永济市"
                    },
                    {
                        "citysName": "河津市"
                    }
                ],
                "provinceName": "山西省"
            },
            {
                "citys": [
                    {
                        "citysName": "呼和浩特市"
                    },
                    {
                        "citysName": "包头市"
                    },
                    {
                        "citysName": "乌海市"
                    },
                    {
                        "citysName": "赤峰市"
                    },
                    {
                        "citysName": "呼伦贝尔市"
                    },
                    {
                        "citysName": "通辽市"
                    },
                    {
                        "citysName": "乌兰察布市"
                    },
                    {
                        "citysName": "鄂尔多斯市"
                    },
                    {
                        "citysName": "巴彦淖尔市"
                    },
                    {
                        "citysName": "满洲里市"
                    },
                    {
                        "citysName": "扎兰屯市"
                    },
                    {
                        "citysName": "牙克石市"
                    },
                    {
                        "citysName": "根河市"
                    },
                    {
                        "citysName": "额尔古纳市"
                    },
                    {
                        "citysName": "乌兰浩特市"
                    },
                    {
                        "citysName": "阿尔山市"
                    },
                    {
                        "citysName": "霍林郭勒市"
                    },
                    {
                        "citysName": "锡林浩特市"
                    },
                    {
                        "citysName": "二连浩特市"
                    },
                    {
                        "citysName": "丰镇市"
                    }
                ],
                "provinceName": "内蒙古自治区"
            },
            {
                "citys": [
                    {
                        "citysName": "沈阳市"
                    },
                    {
                        "citysName": "大连市"
                    },
                    {
                        "citysName": "朝阳市"
                    },
                    {
                        "citysName": "阜新市"
                    },
                    {
                        "citysName": "铁岭市"
                    },
                    {
                        "citysName": "抚顺市"
                    },
                    {
                        "citysName": "本溪市"
                    },
                    {
                        "citysName": "辽阳市"
                    },
                    {
                        "citysName": "鞍山市"
                    },
                    {
                        "citysName": "丹东市"
                    },
                    {
                        "citysName": "营口市"
                    },
                    {
                        "citysName": "盘锦市"
                    },
                    {
                        "citysName": "锦州市"
                    },
                    {
                        "citysName": "葫芦岛市"
                    },
                    {
                        "citysName": "新民市"
                    },
                    {
                        "citysName": "瓦房店市"
                    },
                    {
                        "citysName": "庄河市"
                    },
                    {
                        "citysName": "北票市"
                    },
                    {
                        "citysName": "凌源市"
                    },
                    {
                        "citysName": "调兵山市"
                    },
                    {
                        "citysName": "开原市"
                    },
                    {
                        "citysName": "灯塔市"
                    },
                    {
                        "citysName": "海城市"
                    },
                    {
                        "citysName": "凤城市"
                    },
                    {
                        "citysName": "东港市"
                    },
                    {
                        "citysName": "大石桥市"
                    },
                    {
                        "citysName": "盖州市"
                    },
                    {
                        "citysName": "凌海市"
                    },
                    {
                        "citysName": "北镇市"
                    },
                    {
                        "citysName": "兴城市"
                    }
                ],
                "provinceName": "辽宁省"
            },
            {
                "citys": [
                    {
                        "citysName": "长春市"
                    },
                    {
                        "citysName": "吉林市"
                    },
                    {
                        "citysName": "白城市"
                    },
                    {
                        "citysName": "松原市"
                    },
                    {
                        "citysName": "四平市"
                    },
                    {
                        "citysName": "辽源市"
                    },
                    {
                        "citysName": "通化市"
                    },
                    {
                        "citysName": "白山市"
                    },
                    {
                        "citysName": "德惠市"
                    },
                    {
                        "citysName": "榆树市"
                    },
                    {
                        "citysName": "磐石市"
                    },
                    {
                        "citysName": "蛟河市"
                    },
                    {
                        "citysName": "桦甸市"
                    },
                    {
                        "citysName": "舒兰市"
                    },
                    {
                        "citysName": "洮南市"
                    },
                    {
                        "citysName": "大安市"
                    },
                    {
                        "citysName": "双辽市"
                    },
                    {
                        "citysName": "公主岭市"
                    },
                    {
                        "citysName": "梅河口市"
                    },
                    {
                        "citysName": "集安市"
                    },
                    {
                        "citysName": "临江市"
                    },
                    {
                        "citysName": "延吉市"
                    },
                    {
                        "citysName": "图们市"
                    },
                    {
                        "citysName": "敦化市"
                    },
                    {
                        "citysName": "珲春市"
                    },
                    {
                        "citysName": "龙井市"
                    },
                    {
                        "citysName": "和龙市"
                    },
                    {
                        "citysName": "扶余市"
                    }
                ],
                "provinceName": "吉林省"
            },
            {
                "citys": [
                    {
                        "citysName": "哈尔滨市"
                    },
                    {
                        "citysName": "齐齐哈尔市"
                    },
                    {
                        "citysName": "黑河市"
                    },
                    {
                        "citysName": "大庆市"
                    },
                    {
                        "citysName": "伊春市"
                    },
                    {
                        "citysName": "鹤岗市"
                    },
                    {
                        "citysName": "佳木斯市"
                    },
                    {
                        "citysName": "双鸭山市"
                    },
                    {
                        "citysName": "七台河市"
                    },
                    {
                        "citysName": "鸡西市"
                    },
                    {
                        "citysName": "牡丹江市"
                    },
                    {
                        "citysName": "绥化市"
                    },
                    {
                        "citysName": "尚志市"
                    },
                    {
                        "citysName": "五常市"
                    },
                    {
                        "citysName": "讷河市"
                    },
                    {
                        "citysName": "北安市"
                    },
                    {
                        "citysName": "五大连池市"
                    },
                    {
                        "citysName": "铁力市"
                    },
                    {
                        "citysName": "同江市"
                    },
                    {
                        "citysName": "富锦市"
                    },
                    {
                        "citysName": "虎林市"
                    },
                    {
                        "citysName": "密山市"
                    },
                    {
                        "citysName": "绥芬河市"
                    },
                    {
                        "citysName": "海林市"
                    },
                    {
                        "citysName": "宁安市"
                    },
                    {
                        "citysName": "安达市"
                    },
                    {
                        "citysName": "肇东市"
                    },
                    {
                        "citysName": "海伦市"
                    },
                    {
                        "citysName": "穆棱市"
                    },
                    {
                        "citysName": "东宁市"
                    },
                    {
                        "citysName": "抚远市"
                    }
                ],
                "provinceName": "黑龙江省"
            },
            {
                "citys": [
                    {
                        "citysName": "南京市"
                    },
                    {
                        "citysName": "徐州市"
                    },
                    {
                        "citysName": "连云港市"
                    },
                    {
                        "citysName": "宿迁市"
                    },
                    {
                        "citysName": "淮安市"
                    },
                    {
                        "citysName": "盐城市"
                    },
                    {
                        "citysName": "扬州市"
                    },
                    {
                        "citysName": "泰州市"
                    },
                    {
                        "citysName": "南通市"
                    },
                    {
                        "citysName": "镇江市"
                    },
                    {
                        "citysName": "常州市"
                    },
                    {
                        "citysName": "无锡市"
                    },
                    {
                        "citysName": "苏州市"
                    },
                    {
                        "citysName": "常熟市"
                    },
                    {
                        "citysName": "张家港市"
                    },
                    {
                        "citysName": "太仓市"
                    },
                    {
                        "citysName": "昆山市"
                    },
                    {
                        "citysName": "江阴市"
                    },
                    {
                        "citysName": "宜兴市"
                    },
                    {
                        "citysName": "溧阳市"
                    },
                    {
                        "citysName": "扬中市"
                    },
                    {
                        "citysName": "句容市"
                    },
                    {
                        "citysName": "丹阳市"
                    },
                    {
                        "citysName": "如皋市"
                    },
                    {
                        "citysName": "海门市"
                    },
                    {
                        "citysName": "启东市"
                    },
                    {
                        "citysName": "高邮市"
                    },
                    {
                        "citysName": "仪征市"
                    },
                    {
                        "citysName": "兴化市"
                    },
                    {
                        "citysName": "泰兴市"
                    },
                    {
                        "citysName": "靖江市"
                    },
                    {
                        "citysName": "东台市"
                    },
                    {
                        "citysName": "邳州市"
                    },
                    {
                        "citysName": "新沂市"
                    }
                ],
                "provinceName": "江苏省"
            },
            {
                "citys": [
                    {
                        "citysName": "杭州市"
                    },
                    {
                        "citysName": "宁波市"
                    },
                    {
                        "citysName": "湖州市"
                    },
                    {
                        "citysName": "嘉兴市"
                    },
                    {
                        "citysName": "舟山市"
                    },
                    {
                        "citysName": "绍兴市"
                    },
                    {
                        "citysName": "衢州市"
                    },
                    {
                        "citysName": "金华市"
                    },
                    {
                        "citysName": "台州市"
                    },
                    {
                        "citysName": "温州市"
                    },
                    {
                        "citysName": "丽水市"
                    },
                    {
                        "citysName": "临安市"
                    },
                    {
                        "citysName": "建德市"
                    },
                    {
                        "citysName": "慈溪市"
                    },
                    {
                        "citysName": "余姚市"
                    },
                    {
                        "citysName": "平湖市"
                    },
                    {
                        "citysName": "海宁市"
                    },
                    {
                        "citysName": "桐乡市"
                    },
                    {
                        "citysName": "诸暨市"
                    },
                    {
                        "citysName": "嵊州市"
                    },
                    {
                        "citysName": "江山市"
                    },
                    {
                        "citysName": "兰溪市"
                    },
                    {
                        "citysName": "永康市"
                    },
                    {
                        "citysName": "义乌市"
                    },
                    {
                        "citysName": "东阳市"
                    },
                    {
                        "citysName": "临海市"
                    },
                    {
                        "citysName": "温岭市"
                    },
                    {
                        "citysName": "瑞安市"
                    },
                    {
                        "citysName": "乐清市"
                    },
                    {
                        "citysName": "龙泉市"
                    }
                ],
                "provinceName": "浙江省"
            },
            {
                "citys": [
                    {
                        "citysName": "合肥市"
                    },
                    {
                        "citysName": "芜湖市"
                    },
                    {
                        "citysName": "蚌埠市"
                    },
                    {
                        "citysName": "淮南市"
                    },
                    {
                        "citysName": "马鞍山市"
                    },
                    {
                        "citysName": "淮北市"
                    },
                    {
                        "citysName": "铜陵市"
                    },
                    {
                        "citysName": "安庆市"
                    },
                    {
                        "citysName": "黄山市"
                    },
                    {
                        "citysName": "滁州市"
                    },
                    {
                        "citysName": "阜阳市"
                    },
                    {
                        "citysName": "宿州市"
                    },
                    {
                        "citysName": "六安市"
                    },
                    {
                        "citysName": "亳州市"
                    },
                    {
                        "citysName": "池州市"
                    },
                    {
                        "citysName": "宣城市"
                    },
                    {
                        "citysName": "巢湖市"
                    },
                    {
                        "citysName": "桐城市"
                    },
                    {
                        "citysName": "天长市"
                    },
                    {
                        "citysName": "明光市"
                    },
                    {
                        "citysName": "界首市"
                    },
                    {
                        "citysName": "宁国市"
                    }
                ],
                "provinceName": "安徽省"
            },
            {
                "citys": [
                    {
                        "citysName": "厦门市"
                    },
                    {
                        "citysName": "福州市"
                    },
                    {
                        "citysName": "南平市"
                    },
                    {
                        "citysName": "三明市"
                    },
                    {
                        "citysName": "莆田市"
                    },
                    {
                        "citysName": "泉州市"
                    },
                    {
                        "citysName": "漳州市"
                    },
                    {
                        "citysName": "龙岩市"
                    },
                    {
                        "citysName": "宁德市"
                    },
                    {
                        "citysName": "福清市"
                    },
                    {
                        "citysName": "长乐市"
                    },
                    {
                        "citysName": "邵武市"
                    },
                    {
                        "citysName": "武夷山市"
                    },
                    {
                        "citysName": "建瓯市"
                    },
                    {
                        "citysName": "永安市"
                    },
                    {
                        "citysName": "石狮市"
                    },
                    {
                        "citysName": "晋江市"
                    },
                    {
                        "citysName": "南安市"
                    },
                    {
                        "citysName": "龙海市"
                    },
                    {
                        "citysName": "漳平市"
                    },
                    {
                        "citysName": "福安市"
                    },
                    {
                        "citysName": "福鼎市"
                    }
                ],
                "provinceName": "福建省"
            },
            {
                "citys": [
                    {
                        "citysName": "南昌市"
                    },
                    {
                        "citysName": "九江市"
                    },
                    {
                        "citysName": "景德镇市"
                    },
                    {
                        "citysName": "鹰潭市"
                    },
                    {
                        "citysName": "新余市"
                    },
                    {
                        "citysName": "萍乡市"
                    },
                    {
                        "citysName": "赣州市"
                    },
                    {
                        "citysName": "上饶市"
                    },
                    {
                        "citysName": "抚州市"
                    },
                    {
                        "citysName": "宜春市"
                    },
                    {
                        "citysName": "吉安市"
                    },
                    {
                        "citysName": "瑞昌市"
                    },
                    {
                        "citysName": "共青城市"
                    },
                    {
                        "citysName": "乐平市"
                    },
                    {
                        "citysName": "瑞金市"
                    },
                    {
                        "citysName": "德兴市"
                    },
                    {
                        "citysName": "丰城市"
                    },
                    {
                        "citysName": "樟树市"
                    },
                    {
                        "citysName": "高安市"
                    },
                    {
                        "citysName": "井冈山市"
                    },
                    {
                        "citysName": "贵溪市"
                    }
                ],
                "provinceName": "江西省"
            },
            {
                "citys": [
                    {
                        "citysName": "济南市"
                    },
                    {
                        "citysName": "青岛市"
                    },
                    {
                        "citysName": "聊城市"
                    },
                    {
                        "citysName": "德州市"
                    },
                    {
                        "citysName": "东营市"
                    },
                    {
                        "citysName": "淄博市"
                    },
                    {
                        "citysName": "潍坊市"
                    },
                    {
                        "citysName": "烟台市"
                    },
                    {
                        "citysName": "威海市"
                    },
                    {
                        "citysName": "日照市"
                    },
                    {
                        "citysName": "临沂市"
                    },
                    {
                        "citysName": "枣庄市"
                    },
                    {
                        "citysName": "济宁市"
                    },
                    {
                        "citysName": "泰安市"
                    },
                    {
                        "citysName": "莱芜市"
                    },
                    {
                        "citysName": "滨州市"
                    },
                    {
                        "citysName": "菏泽市"
                    },
                    {
                        "citysName": "胶州市"
                    },
                    {
                        "citysName": "即墨市"
                    },
                    {
                        "citysName": "平度市"
                    },
                    {
                        "citysName": "莱西市"
                    },
                    {
                        "citysName": "临清市"
                    },
                    {
                        "citysName": "乐陵市"
                    },
                    {
                        "citysName": "禹城市"
                    },
                    {
                        "citysName": "安丘市"
                    },
                    {
                        "citysName": "昌邑市"
                    },
                    {
                        "citysName": "高密市"
                    },
                    {
                        "citysName": "青州市"
                    },
                    {
                        "citysName": "诸城市"
                    },
                    {
                        "citysName": "寿光市"
                    },
                    {
                        "citysName": "栖霞市"
                    },
                    {
                        "citysName": "海阳市"
                    },
                    {
                        "citysName": "龙口市"
                    },
                    {
                        "citysName": "莱阳市"
                    },
                    {
                        "citysName": "莱州市"
                    },
                    {
                        "citysName": "蓬莱市"
                    },
                    {
                        "citysName": "招远市"
                    },
                    {
                        "citysName": "荣成市"
                    },
                    {
                        "citysName": "乳山市"
                    },
                    {
                        "citysName": "滕州市"
                    },
                    {
                        "citysName": "曲阜市"
                    },
                    {
                        "citysName": "邹城市"
                    },
                    {
                        "citysName": "新泰市"
                    },
                    {
                        "citysName": "肥城市"
                    }
                ],
                "provinceName": "山东省"
            },
            {
                "citys": [
                    {
                        "citysName": "郑州市"
                    },
                    {
                        "citysName": "开封市"
                    },
                    {
                        "citysName": "洛阳市"
                    },
                    {
                        "citysName": "平顶山市"
                    },
                    {
                        "citysName": "安阳市"
                    },
                    {
                        "citysName": "鹤壁市"
                    },
                    {
                        "citysName": "新乡市"
                    },
                    {
                        "citysName": "焦作市"
                    },
                    {
                        "citysName": "濮阳市"
                    },
                    {
                        "citysName": "许昌市"
                    },
                    {
                        "citysName": "漯河市"
                    },
                    {
                        "citysName": "三门峡市"
                    },
                    {
                        "citysName": "南阳市"
                    },
                    {
                        "citysName": "商丘市"
                    },
                    {
                        "citysName": "周口市"
                    },
                    {
                        "citysName": "驻马店市"
                    },
                    {
                        "citysName": "信阳市"
                    },
                    {
                        "citysName": "荥阳市"
                    },
                    {
                        "citysName": "新郑市"
                    },
                    {
                        "citysName": "登封市"
                    },
                    {
                        "citysName": "新密市"
                    },
                    {
                        "citysName": "偃师市"
                    },
                    {
                        "citysName": "孟州市"
                    },
                    {
                        "citysName": "沁阳市"
                    },
                    {
                        "citysName": "卫辉市"
                    },
                    {
                        "citysName": "辉县市"
                    },
                    {
                        "citysName": "林州市"
                    },
                    {
                        "citysName": "禹州市"
                    },
                    {
                        "citysName": "长葛市"
                    },
                    {
                        "citysName": "舞钢市"
                    },
                    {
                        "citysName": "义马市"
                    },
                    {
                        "citysName": "灵宝市"
                    },
                    {
                        "citysName": "项城市"
                    },
                    {
                        "citysName": "巩义市"
                    },
                    {
                        "citysName": "邓州市"
                    },
                    {
                        "citysName": "永城市"
                    },
                    {
                        "citysName": "汝州市"
                    },
                    {
                        "citysName": "济源市"
                    }
                ],
                "provinceName": "河南省"
            },
            {
                "citys": [
                    {
                        "citysName": "武汉市"
                    },
                    {
                        "citysName": "十堰市"
                    },
                    {
                        "citysName": "襄阳市"
                    },
                    {
                        "citysName": "荆门市"
                    },
                    {
                        "citysName": "孝感市"
                    },
                    {
                        "citysName": "黄冈市"
                    },
                    {
                        "citysName": "鄂州市"
                    },
                    {
                        "citysName": "黄石市"
                    },
                    {
                        "citysName": "咸宁市"
                    },
                    {
                        "citysName": "荆州市"
                    },
                    {
                        "citysName": "宜昌市"
                    },
                    {
                        "citysName": "随州市"
                    },
                    {
                        "citysName": "丹江口市"
                    },
                    {
                        "citysName": "老河口市"
                    },
                    {
                        "citysName": "枣阳市"
                    },
                    {
                        "citysName": "宜城市"
                    },
                    {
                        "citysName": "钟祥市"
                    },
                    {
                        "citysName": "汉川市"
                    },
                    {
                        "citysName": "应城市"
                    },
                    {
                        "citysName": "安陆市"
                    },
                    {
                        "citysName": "广水市"
                    },
                    {
                        "citysName": "麻城市"
                    },
                    {
                        "citysName": "武穴市"
                    },
                    {
                        "citysName": "大冶市"
                    },
                    {
                        "citysName": "赤壁市"
                    },
                    {
                        "citysName": "石首市"
                    },
                    {
                        "citysName": "洪湖市"
                    },
                    {
                        "citysName": "松滋市"
                    },
                    {
                        "citysName": "宜都市"
                    },
                    {
                        "citysName": "枝江市"
                    },
                    {
                        "citysName": "当阳市"
                    },
                    {
                        "citysName": "恩施市"
                    },
                    {
                        "citysName": "利川市"
                    },
                    {
                        "citysName": "仙桃市"
                    },
                    {
                        "citysName": "天门市"
                    },
                    {
                        "citysName": "潜江市"
                    }
                ],
                "provinceName": "湖北省"
            },
            {
                "citys": [
                    {
                        "citysName": "长沙市"
                    },
                    {
                        "citysName": "衡阳市"
                    },
                    {
                        "citysName": "张家界市"
                    },
                    {
                        "citysName": "常德市"
                    },
                    {
                        "citysName": "益阳市"
                    },
                    {
                        "citysName": "岳阳市"
                    },
                    {
                        "citysName": "株洲市"
                    },
                    {
                        "citysName": "湘潭市"
                    },
                    {
                        "citysName": "郴州市"
                    },
                    {
                        "citysName": "永州市"
                    },
                    {
                        "citysName": "邵阳市"
                    },
                    {
                        "citysName": "怀化市"
                    },
                    {
                        "citysName": "娄底市"
                    },
                    {
                        "citysName": "耒阳市"
                    },
                    {
                        "citysName": "常宁市"
                    },
                    {
                        "citysName": "浏阳市"
                    },
                    {
                        "citysName": "津市市"
                    },
                    {
                        "citysName": "沅江市"
                    },
                    {
                        "citysName": "汨罗市"
                    },
                    {
                        "citysName": "临湘市"
                    },
                    {
                        "citysName": "醴陵市"
                    },
                    {
                        "citysName": "湘乡市"
                    },
                    {
                        "citysName": "韶山市"
                    },
                    {
                        "citysName": "资兴市"
                    },
                    {
                        "citysName": "武冈市"
                    },
                    {
                        "citysName": "洪江市"
                    },
                    {
                        "citysName": "冷水江市"
                    },
                    {
                        "citysName": "涟源市"
                    },
                    {
                        "citysName": "吉首市"
                    }
                ],
                "provinceName": "湖南省"
            },
            {
                "citys": [
                    {
                        "citysName": "广州市"
                    },
                    {
                        "citysName": "深圳市"
                    },
                    {
                        "citysName": "清远市"
                    },
                    {
                        "citysName": "韶关市"
                    },
                    {
                        "citysName": "河源市"
                    },
                    {
                        "citysName": "梅州市"
                    },
                    {
                        "citysName": "潮州市"
                    },
                    {
                        "citysName": "汕头市"
                    },
                    {
                        "citysName": "揭阳市"
                    },
                    {
                        "citysName": "汕尾市"
                    },
                    {
                        "citysName": "惠州市"
                    },
                    {
                        "citysName": "东莞市"
                    },
                    {
                        "citysName": "珠海市"
                    },
                    {
                        "citysName": "中山市"
                    },
                    {
                        "citysName": "江门市"
                    },
                    {
                        "citysName": "佛山市"
                    },
                    {
                        "citysName": "肇庆市"
                    },
                    {
                        "citysName": "云浮市"
                    },
                    {
                        "citysName": "阳江市"
                    },
                    {
                        "citysName": "茂名市"
                    },
                    {
                        "citysName": "湛江市"
                    },
                    {
                        "citysName": "英德市"
                    },
                    {
                        "citysName": "连州市"
                    },
                    {
                        "citysName": "乐昌市"
                    },
                    {
                        "citysName": "南雄市"
                    },
                    {
                        "citysName": "兴宁市"
                    },
                    {
                        "citysName": "普宁市"
                    },
                    {
                        "citysName": "陆丰市"
                    },
                    {
                        "citysName": "恩平市"
                    },
                    {
                        "citysName": "台山市"
                    },
                    {
                        "citysName": "开平市"
                    },
                    {
                        "citysName": "鹤山市"
                    },
                    {
                        "citysName": "四会市"
                    },
                    {
                        "citysName": "罗定市"
                    },
                    {
                        "citysName": "阳春市"
                    },
                    {
                        "citysName": "化州市"
                    },
                    {
                        "citysName": "信宜市"
                    },
                    {
                        "citysName": "高州市"
                    },
                    {
                        "citysName": "吴川市"
                    },
                    {
                        "citysName": "廉江市"
                    },
                    {
                        "citysName": "雷州市"
                    }
                ],
                "provinceName": "广东省"
            },
            {
                "citys": [
                    {
                        "citysName": "南宁市"
                    },
                    {
                        "citysName": "桂林市"
                    },
                    {
                        "citysName": "柳州市"
                    },
                    {
                        "citysName": "梧州市"
                    },
                    {
                        "citysName": "贵港市"
                    },
                    {
                        "citysName": "玉林市"
                    },
                    {
                        "citysName": "钦州市"
                    },
                    {
                        "citysName": "北海市"
                    },
                    {
                        "citysName": "防城港市"
                    },
                    {
                        "citysName": "崇左市"
                    },
                    {
                        "citysName": "百色市"
                    },
                    {
                        "citysName": "河池市"
                    },
                    {
                        "citysName": "来宾市"
                    },
                    {
                        "citysName": "贺州市"
                    },
                    {
                        "citysName": "岑溪市"
                    },
                    {
                        "citysName": "桂平市"
                    },
                    {
                        "citysName": "北流市"
                    },
                    {
                        "citysName": "东兴市"
                    },
                    {
                        "citysName": "凭祥市"
                    },
                    {
                        "citysName": "宜州市"
                    },
                    {
                        "citysName": "合山市"
                    },
                    {
                        "citysName": "靖西市"
                    }
                ],
                "provinceName": "广西壮族自治区"
            },
            {
                "citys": [
                    {
                        "citysName": "海口市"
                    },
                    {
                        "citysName": "三亚市"
                    },
                    {
                        "citysName": "三沙市"
                    },
                    {
                        "citysName": "儋州市"
                    },
                    {
                        "citysName": "文昌市"
                    },
                    {
                        "citysName": "琼海市"
                    },
                    {
                        "citysName": "万宁市"
                    },
                    {
                        "citysName": "东方市"
                    },
                    {
                        "citysName": "五指山市"
                    }
                ],
                "provinceName": "海南省"
            },
            {
                "citys": [
                    {
                        "citysName": "成都市"
                    },
                    {
                        "citysName": "广元市"
                    },
                    {
                        "citysName": "绵阳市"
                    },
                    {
                        "citysName": "德阳市"
                    },
                    {
                        "citysName": "南充市"
                    },
                    {
                        "citysName": "广安市"
                    },
                    {
                        "citysName": "遂宁市"
                    },
                    {
                        "citysName": "内江市"
                    },
                    {
                        "citysName": "乐山市"
                    },
                    {
                        "citysName": "自贡市"
                    },
                    {
                        "citysName": "泸州市"
                    },
                    {
                        "citysName": "宜宾市"
                    },
                    {
                        "citysName": "攀枝花市"
                    },
                    {
                        "citysName": "巴中市"
                    },
                    {
                        "citysName": "达州市"
                    },
                    {
                        "citysName": "资阳市"
                    },
                    {
                        "citysName": "眉山市"
                    },
                    {
                        "citysName": "雅安市"
                    },
                    {
                        "citysName": "崇州市"
                    },
                    {
                        "citysName": "邛崃市"
                    },
                    {
                        "citysName": "都江堰市"
                    },
                    {
                        "citysName": "彭州市"
                    },
                    {
                        "citysName": "江油市"
                    },
                    {
                        "citysName": "什邡市"
                    },
                    {
                        "citysName": "广汉市"
                    },
                    {
                        "citysName": "绵竹市"
                    },
                    {
                        "citysName": "阆中市"
                    },
                    {
                        "citysName": "华蓥市"
                    },
                    {
                        "citysName": "峨眉山市"
                    },
                    {
                        "citysName": "万源市"
                    },
                    {
                        "citysName": "简阳市"
                    },
                    {
                        "citysName": "西昌市"
                    },
                    {
                        "citysName": "康定市"
                    },
                    {
                        "citysName": "马尔康市"
                    }
                ],
                "provinceName": "四川省"
            },
            {
                "citys": [
                    {
                        "citysName": "贵阳市"
                    },
                    {
                        "citysName": "六盘水市"
                    },
                    {
                        "citysName": "遵义市"
                    },
                    {
                        "citysName": "安顺市"
                    },
                    {
                        "citysName": "毕节市"
                    },
                    {
                        "citysName": "铜仁市"
                    },
                    {
                        "citysName": "清镇市"
                    },
                    {
                        "citysName": "赤水市"
                    },
                    {
                        "citysName": "仁怀市"
                    },
                    {
                        "citysName": "凯里市"
                    },
                    {
                        "citysName": "都匀市"
                    },
                    {
                        "citysName": "兴义市"
                    },
                    {
                        "citysName": "福泉市"
                    }
                ],
                "provinceName": "贵州省"
            },
            {
                "citys": [
                    {
                        "citysName": "昆明市"
                    },
                    {
                        "citysName": "曲靖市"
                    },
                    {
                        "citysName": "玉溪市"
                    },
                    {
                        "citysName": "丽江市"
                    },
                    {
                        "citysName": "昭通市"
                    },
                    {
                        "citysName": "普洱市"
                    },
                    {
                        "citysName": "临沧市"
                    },
                    {
                        "citysName": "保山市"
                    },
                    {
                        "citysName": "安宁市"
                    },
                    {
                        "citysName": "宣威市"
                    },
                    {
                        "citysName": "芒市"
                    },
                    {
                        "citysName": "瑞丽市"
                    },
                    {
                        "citysName": "大理市"
                    },
                    {
                        "citysName": "楚雄市"
                    },
                    {
                        "citysName": "个旧市"
                    },
                    {
                        "citysName": "开远市"
                    },
                    {
                        "citysName": "蒙自市"
                    },
                    {
                        "citysName": "弥勒市"
                    },
                    {
                        "citysName": "景洪市"
                    },
                    {
                        "citysName": "文山市"
                    },
                    {
                        "citysName": "香格里拉市"
                    },
                    {
                        "citysName": "腾冲市"
                    }
                ],
                "provinceName": "云南省"
            },
            {
                "citys": [
                    {
                        "citysName": "西安市"
                    },
                    {
                        "citysName": "延安市"
                    },
                    {
                        "citysName": "铜川市"
                    },
                    {
                        "citysName": "渭南市"
                    },
                    {
                        "citysName": "咸阳市"
                    },
                    {
                        "citysName": "宝鸡市"
                    },
                    {
                        "citysName": "汉中市"
                    },
                    {
                        "citysName": "榆林市"
                    },
                    {
                        "citysName": "商洛市"
                    },
                    {
                        "citysName": "安康市"
                    },
                    {
                        "citysName": "韩城"
                    },
                    {
                        "citysName": "华阴"
                    },
                    {
                        "citysName": "兴平"
                    }
                ],
                "provinceName": "陕西省"
            },
            {
                "citys": [
                    {
                        "citysName": "兰州市"
                    },
                    {
                        "citysName": "嘉峪关市"
                    },
                    {
                        "citysName": "金昌市"
                    },
                    {
                        "citysName": "白银市"
                    },
                    {
                        "citysName": "天水市"
                    },
                    {
                        "citysName": "酒泉市"
                    },
                    {
                        "citysName": "张掖市"
                    },
                    {
                        "citysName": "武威市"
                    },
                    {
                        "citysName": "庆阳市"
                    },
                    {
                        "citysName": "平凉市"
                    },
                    {
                        "citysName": "定西市"
                    },
                    {
                        "citysName": "陇南市"
                    },
                    {
                        "citysName": "玉门市"
                    },
                    {
                        "citysName": "敦煌市"
                    },
                    {
                        "citysName": "临夏市"
                    },
                    {
                        "citysName": "合作市"
                    }
                ],
                "provinceName": "甘肃省"
            },
            {
                "citys": [
                    {
                        "citysName": "西宁市"
                    },
                    {
                        "citysName": "海东市"
                    },
                    {
                        "citysName": "格尔木市"
                    },
                    {
                        "citysName": "德令哈市"
                    },
                    {
                        "citysName": "玉树市"
                    }
                ],
                "provinceName": "青海省"
            },
            {
                "citys": [
                    {
                        "citysName": "拉萨市"
                    },
                    {
                        "citysName": "日喀则市"
                    },
                    {
                        "citysName": "昌都市"
                    },
                    {
                        "citysName": "林芝市"
                    },
                    {
                        "citysName": "山南市"
                    }
                ],
                "provinceName": "西藏自治区"
            },
            {
                "citys": [
                    {
                        "citysName": "银川市"
                    },
                    {
                        "citysName": "石嘴山市"
                    },
                    {
                        "citysName": "吴忠市"
                    },
                    {
                        "citysName": "中卫市"
                    },
                    {
                        "citysName": "固原市"
                    },
                    {
                        "citysName": "灵武市"
                    },
                    {
                        "citysName": "青铜峡市"
                    }
                ],
                "provinceName": "宁夏回族自治区"
            },
            {
                "citys": [
                    {
                        "citysName": "台北市"
                    },
                    {
                        "citysName": "新北市"
                    },
                    {
                        "citysName": "桃园市"
                    },
                    {
                        "citysName": "台中市"
                    },
                    {
                        "citysName": "台南市"
                    },
                    {
                        "citysName": "高雄市"
                    },
                    {
                        "citysName": "基隆市"
                    },
                    {
                        "citysName": "新竹市"
                    },
                    {
                        "citysName": "嘉义市"
                    }
                ],
                "provinceName": "台湾"
            },

            {
                "citys": [
                    {
                        "citysName": "乌鲁木齐市"
                    },
                    {
                        "citysName": "克拉玛依市"
                    },
                    {
                        "citysName": "吐鲁番市"
                    },
                    {
                        "citysName": "哈密市"
                    },
                    {
                        "citysName": "喀什市"
                    },
                    {
                        "citysName": "阿克苏市"
                    },
                    {
                        "citysName": "和田市"
                    },
                    {
                        "citysName": "阿图什市"
                    },
                    {
                        "citysName": "阿拉山口市"
                    },
                    {
                        "citysName": "博乐市"
                    },
                    {
                        "citysName": "昌吉市"
                    },
                    {
                        "citysName": "阜康市"
                    },
                    {
                        "citysName": "库尔勒市"
                    },
                    {
                        "citysName": "伊宁市"
                    },
                    {
                        "citysName": "奎屯市"
                    },
                    {
                        "citysName": "塔城市"
                    },
                    {
                        "citysName": "乌苏市"
                    },
                    {
                        "citysName": "阿勒泰市"
                    },
                    {
                        "citysName": "霍尔果斯市"
                    },
                    {
                        "citysName": "石河子市"
                    },
                    {
                        "citysName": "阿拉尔市"
                    },
                    {
                        "citysName": "图木舒克市"
                    },
                    {
                        "citysName": "五家渠市"
                    },
                    {
                        "citysName": "北屯市"
                    },
                    {
                        "citysName": "铁门关市"
                    },
                    {
                        "citysName": "双河市"
                    },
                    {
                        "citysName": "可克达拉市"
                    },
                    {
                        "citysName": "昆玉市"
                    }
                ],
                "provinceName": "新疆维吾尔自治区"
            }
        ]
    }
    //结束 
    exports('agency_table', {});
})