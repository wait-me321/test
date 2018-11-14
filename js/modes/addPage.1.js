

layui.use(['layer', 'form', "table", "laypage", "element", "laytpl", "laydate", "upload"], function () {
    localStorage.setItem("newtoken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cueHlrb28uY24iLCJhZG1pbiI6MTUsImp0aSI6Ijc4RUQ5RTA3LUE2MTgtNERBMS1BQzU0LUY2RTYxNDM3QjYxNyJ9.9wNGFrhB7cfwVXetw0VMPgiFQC9dddYmPcqUiEEIC9M")

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
    layer.msg("卡券赠送");
    for(let i=0;i<10000;i++){
        $(".sele").append("<option value="+1+">1</option>")
    }
    form.render()
    active = {
        processFiles: function (files, nofn, okfn) {
            var file = files[0];

            if (file == undefined) {
                if (typeof (nofn) == "function") {
                    nofn()
                }
                return false
            };
            var reader = new FileReader();
            reader.onload = function (e) {
                // 这个事件发生，意为着数据准备好了
                // 把它复制到页面的<div>元素中
                str=String(e.target.result.replace(/[\r\n]/g,","))
                console.log(str.split(','))
                phoneListf=str.split(',')
                if (typeof (okfn) == "function") {
                    okfn(e.target.result)
                }




            };
            reader.readAsText(file);
        },
        selectfile: function (potion) {//{selectbtnid,choosefn}
            upload.render({
                elem: '#'+potion.selectbtnid
                , url: ''
                ,exts:"txt"
                , auto: false //选择文件后不自动上传
                , choose: function (obj) {
                    //将每次选择的文件追加到文件队列
                    $("#"+potion.selectbtnid).parent().prev().find("[name=addlist]").val("已选择文件")
                    var files = obj.pushFile();
                    //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                        obj.preview(function (index, file, result) {
                        console.log(index); //得到文件索引
                        console.log(file); //得到文件对象
                        console.log(result); //得到文件base64编码，比如图片

                        //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增

                        //这里还可以做一些 append 文件列表 DOM 的操作

                        //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                        //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                        });
                    if (typeof (potion.choosefn) == "function") {
                        potion.choosefn(obj)
                    }


                }

            });
        },
        addsub:function(phone,number){
            var index = layer.load(2)
            $.ajax({
                url: "http://api.console.xykoo.cn/give/giveAddClothingVoucher",
                beforeSend: function (request) {
                    request.setRequestHeader("token", newtoken);
                },
                type: 'post',// 引号
                dataType: "json",
                data: {
                    phone: phone,
                    number: number
                },
                success: function (data) {
                    layer.close(index)
                    switch (data.status) {
                        case 200:
                            if (typeof (fn) == "function") {
                                fn(data)
                            }
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
        showtoggle:function(style){
            switch(style){
                case "1":
                active.hide([$(".item2"),$(".item3"),$(".item4")])
                active.show([$(".item1")])
                break;
                case "2":
                active.hide([$(".item1"),$(".item3"),$(".item4")])
                active.show([$(".item2")])
                break;
                case "3":
                active.hide([$(".item2"),$(".item1"),$(".item4")])
                active.show([$(".item3")])
                break;
                case "4":
                active.hide([$(".item2"),$(".item3"),$(".item1")])
                active.show([$(".item4")])
                break;


            }
        },
        show:function(obj){
            for(let i=0;i<obj.length;i++){
                obj[i].stop(false,true).fadeIn(0)
            }
        },
        hide:function(obj){
            for(let i=0;i<obj.length;i++){
                obj[i].stop(false,true).fadeOut(0)
            }
        }

    }
    active.selectfile({
        selectbtnid:"giveaddfile",
        choosefn:function(obj){
            // active.processFiles()
        }
    })




//加衣券
    form.on('submit(submit1)', function (data) {
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });



    form.on("radio(style)",function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        active.showtoggle(data.value)
    })
    form.on("radio(time)",function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        switch(data.value){
            case "7":
            $("[name=day]").hide()
            break;
            case "30":
            $("[name=day]").hide()
            break;
            case "0":
            $("[name=day]").show()
            break;
        }
    })

    






})