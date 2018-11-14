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

        , carousel = layui.carousel;
    layer.msg('欢迎进入文章管理', { time: 1000, anim: 1 });
    var tableIns = table.render({
        title: "文章列表"
        , toolbar: $("#toolbarTpl").html()
        , defaultToolbar: ['filter']
        , elem: '#communityTable'
        , height: "full"
        , method: "get"
        , url: 'http://api.xykoo.cn/manage/community/articlesList' //数据接口
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
                "data": res.data.articleVOS //解析数据列表
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
            { field: 'articleId', title: 'articleId', width: 30, type: "checkbox" }
            , { field: 'headPhoto', title: '用户头像', width: 100, templet: "#headPhotoTpl", align: "center" }
            , { field: 'articleImages', title: '图片', width: 300, templet: "#articleImagesTpl", align: "center" }
            , { field: 'articleStatus', title: '状态', width: 100, templet: "#articleStatusTpl", align: "center" }
            , { field: 'caozuo', title: '操作', width: 100, fixed:"right", templet: "#caozuoTpl", align: "center" }
        ]]
        , done: function (obj) {
            
            form.render()
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
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
          case 'all':
          console.log(tableIns)
          tableIns=table.render(tableInsConfig)
          tableIns.reload({
            where: {
                articleStatus: 0
            } //设定异步数据接口的额外参数
            //,height: 300
          });
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
          
          default: 
          break;
        };
      });
      form.on('switch(brandStatus)', function(data){
        console.log(data.elem); //得到checkbox原始DOM对象
        console.log(data.elem.checked); //开关是否开启，true或者false
        console.log(data.value); //开关value值，也可以通过data.elem.value得到
        console.log(data.othis); //得到美化后的DOM对象
      }); 
    active = {
        
        shenghe:function(articleStatus,auditorStatus,articleId){
            var index=layer.load(2)
            $.ajax({
                url: 'http://api.xykoo.cn/manage/community/articlesReview',
                beforeSend: function (request) {
                                request.setRequestHeader("X-Auth-Token", token);
                },
                type: 'get',
                dataType: 'json',
                data: {
                    articleStatus: articleStatus,
                    auditorStatus: auditorStatus,
                    articleId: articleId
                }
            
            ,success:function(data) {
                switch (data.status) {
                    case 200:
                        layer.close(index)
                        tableIns.reload({where:{}});
                        layer.msg("操作成功", { icon: 1 });
                        
                        break;
                    case 401:
                        layer.alert('请重新登录');
                        break;
                    default:
                        layer.alert(data.message);
                        break;
                }
            }
            ,errorfunction() {
                layer.msg("接口异常！")
            }
        })
    }
}
    form.on('switch(articleStatus)', function(obj){

        var auditorStatus
        if(obj.elem.checked){
            auditorStatus=1
        }else{
            auditorStatus=2
        }
        active.shenghe(auditorStatus,0,this.value)
      });


    exports('community');
})



