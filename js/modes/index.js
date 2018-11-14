
layui.define(['layer', 'form', "usertable", "laypage", "element", "laytpl", "laydate"], function (exports) {
  // localStorage.setItem("token","eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiOEMxQzY1MEMtODlCQS00OERFLUJCMDUtMzY3RTM4REM2OTlCIn0.d29VWB4xBIhV9bhKq5NU81FIAoxb4VXiQsOFqW7Ep4Q")
  var layer = layui.layer
    , form = layui.form
    , $ = layui.$
    , laypage = layui.laypage
    , laydate = layui.laydate
    , element = layui.element
    , laytpl = layui.laytpl
    , usertable = layui.usertable
    , token = localStorage.getItem("token")
    , newtoken = localStorage.getItem("newtoken")
  // layui.data("table", {
  //   key: 0
  //   , value: '张勇'
  // })


  var table_option = {
    elem: '#demo'
    , id: 'usertable'
    , height: 500
    , url: 'http://api.xykoo.cn/manage/user/getUserPage' //数据接口
    , method: "get"
    , where: {
      // token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcm9tX3VzZXIiOiJCIiwidGFyZ2V0X3VzZXIiOiJBIn0.rSWamyAYwuHCo7IFAgd1oRpSP7nzL7BF5t7ItqpKViM"
    }
    , response: {
      statusName: 'status' //数据状态的字段名称，默认：code
      , statusCode: 200 //成功的状态码，默认：0
      , msgName: 'message' //状态信息的字段名称，默认：msg
      , countName: '' //数据总数的字段名称，默认：count
      , dataName: '' //数据列表的字段名称，默认：data

    }
    , page:true //开启分页

    , cols: [[ //表头
      { field: 'userId', title: 'userId', width: 80, type: "checkbox", fixed: "left" }
      // , { field: 'userId', title: 'ID', width: 80, sort: true }
      , { field: 'photo', title: '头像', width: 80, templet: '#photoTpl' }
      , { field: 'phone', title: '手机号', width: 140, align: "center" }
      , { field: 'nickname', title: '昵称', width: 150, align: "center" }
      , { field: 'creatTime', title: '创建日期', width: 177, templet: "#creatTimeTpl", align: "center" }
      , { field: 'newUser', title: '付费', width: 80, templet: "#newUserTpl", align: "center" }
      , { field: 'channel', title: '渠道', width: 80, align: "center" }
    ]]
    , request: {
      pageName: 'page' //页码的参数名称，默认：page
      , limitName: 'size' //每页数据量的参数名，默认：limit

    }
    , headers: { "X-Auth-Token": token }


  }

  var tableIns = usertable.render(table_option);
 
  //
  layui.sou1 = function () {
    tableIns.reload({
      where: { //设定异步数据接口的额外参数，任意设

        newUser: 1
        //…
      }
      , page: {
        curr: 1 //重新从第 1 页开始
      }

    });
  }

  active = {
    reload: function () {
      form.on('submit(reload)', function(data){
        var demoReload = $('#demoReload');
        tableIns.reload({
          page: {
            curr: 1 //重新从第 1 页开始
          }
          , where: {
            phone: demoReload.val()
          }
        });
        return false
      });
      

      //执行重载

      
    },
    yanz: function (arr, str) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].hasClass("layui-form-danger")) {
          return
        }
      }
    },
    sreload: function () {
      form.on('submit(sreload)', function(data){
      var channel = $('select[name=channel]');
      var newUser = $('select[name=newUser]');

      var time = $("#time").val().split(' ~ ')
      var yanz = [channel, newUser, $("#time")]
      for (let i = 0; i < yanz.length; i++) {
        if (yanz[i].hasClass("layui-form-danger")) {
          return
        }
      }
      $(".title").click()

      var where = {
        channel: channel.val(),
        newUser: newUser.val(),
        
      }
      if($("#time").val()==""){

      }else{
        where.startDateStr=time[0] + " 00:00:00",
        where.endDateStr= time[1] + " 23:59:59"
      }
      
      var newwhere = {

      }
      console.log(where)
      if (time[0] == false && time[1] == false) {
        where["startDateStr"] = "-"
        where["endDateStr"] = "-"
      }
      for (var i in where) {

        if (where[i] == "-") {

        } else {
          newwhere[i] = where[i]
        }
      }
      console.log(newwhere)
      //执行重载

      
        tableIns.reload({
          page: {
            curr: 1 //重新从第 1 页开始
          }
          , where: newwhere
        });
        return false
      });
      
    },
    getCheckData: function () { //获取选中数据
      var checkStatus = usertable.checkStatus('usertable')
        , data = checkStatus.data;
      // layer.alert(JSON.stringify(data));
      return data
    }
    , getCheckLength: function () { //获取选中数目
      var checkStatus = usertable.checkStatus('usertable')
        , data = checkStatus.data;
      layer.msg('选中了：' + data.length + ' 个');
    }
    , isAll: function () { //验证是否全选
      var checkStatus = usertable.checkStatus('usertable');
      layer.msg(checkStatus.isAll ? '全选' : '未全选')
    }
    , sendmsg: function () {
      layer.closeAll();
      layer.open({
        title: "短信发送",
        type: 1,
        resize: true,
        maxmin: true,
        area: ['auto', 'auto'],
        offset: '0',
        content: $("#sendMessagesTpl").html(), //这里content是一个普通的String
        success: function (layero, index) {
          form.render(null, 'sendMessagesTpl');
          // console.log(layero, index);
          if($(document).width()<1024){
            layer.full(index)
          }
          var phonelist = []
          var alert_phone = $(".layui-layer-content [name=phonelist]")
          var setI
          var nullnum = 0
          var rlength = 0
          for (var i = 0; i < active.getCheckData().length; i++) {
            if (active.getCheckData()[i].phone == null) {

              continue
            } else {
              rlength++
            }

            phonelist.push(active.getCheckData()[i].phone)
          }
          $(".phonenum").text("(" + rlength + ")")
          alert_phone.val(phonelist.join(",\n"))



          alert_phone.on("change", function () {

            phonelist = alert_phone.val().replace(/，/g, ",").split(",")
            
            phonelist = [...new Set(phonelist)]

            var rlength = 0
            for (var i = 0; i < phonelist.length; i++) {

              phonelist[i] = phonelist[i].replace(/\s*/g, "")
              if (phonelist[i] == false) {

                continue

              } else {
                // rlength++
              }
              phonelist[i] = phonelist[i].replace(/\s*/g, "")
            }
            phonelist = [...new Set(phonelist)]
            for (var i = 0; i < phonelist.length; i++) {

              phonelist[i] = phonelist[i].replace(/\s*/g, "")
              if (phonelist[i] == false) {

                continue

              } else {
                rlength++
              }
              phonelist[i] = phonelist[i].replace(/\s*/g, "")
            }


            console.log(phonelist)
            $(".phonenum").text("(" + rlength + ")")

            alert_phone.val(phonelist.join(",\n"))

            $(".sendMessages_box .layui-btn").on("click", function () {
            var filter = $(this).parents(".layui-form").attr("lay-filter")

            
              active.sendmsgAjax($(this).attr("btn-type"), $(this))

            })

          })
        }
      });
    },
    sendmsgAjax: function (type, obj) {
      var yanz = [$(".sendMessages_box [name=phonelist]"), $(".layui-layer-content [name=cont]")]
      var json = {
        phoneList: $(".layui-layer-content [name=phonelist]").val(),
        cont: $(".layui-layer-content [name=cont]").val()
      }
      for (var i = 0; i < yanz.length; i++) {
        console.log(yanz[i].hasClass("layui-form-danger"))
        if (yanz[i].hasClass("layui-form-danger")) {
          return
        }
      }

      if (type == 0) {
        json = {
          phoneList: 0,
          cont: $(".layui-layer-content [name=cont]").val()
        }
      } else if (type == 1) {
        json = {
          phoneList: 1,
          cont: $(".layui-layer-content [name=cont]").val()
        }
      } else if (type == 2) {
        json = {
          phoneList: 2,
          cont: $(".layui-layer-content [name=cont]").val()
        }
      } else if (type == "--") {
        return
      }


      $.ajax({
        url: 'http://api.xykoo.cn/manage/smsPush/sendMessages',
        beforeSend: function (request) {
          request.setRequestHeader("X-Auth-Token", token);
        },
        cache: false,
        dataType: 'json',
        data: json,
        type: 'post'
      })
        .done(function (data) {
          console.log("success");
          if (data.status == 200) {
            layer.msg("发送成功")
          } else if (data.status == 401) {
            layer.msg("请重新登录")
          } else {
            layer.msg("数据连接失败")
          }
        })
        .fail(function () {
          layer.msg("数据连接失败")
        })
        .always(function () {
          console.log("complete");
        });
    },
    sendpush: function () {
      layer.closeAll();
      layer.open({
        title: "群发推送",
        type: 1,
        resize: true,
        maxmin: true,
        area: ['', 'auto'],
        content: $(".sendMessages_box_tpl").html() //这里content是一个普通的String
      });
    },
    givecard: function () {
      layer.closeAll();
      layer.open({
        title: "赠送-卡券",
        type: 1,
        resize: true,
        maxmin: true,
        area: ['auto', 'auto'],
        offset: '0',
        content: $("#giveCardTpl").html(), //这里content是一个普通的String
        success: function (layero, index) {
          if($(document).width()<1024){
            layer.full(index)
          }
          form.render(null, 'giveCardTpl');
          var phonelist = []

          var alert_phone = $(".layui-layer-content [name=phones]")
          var setI
          var nullnum = 0
          var rlength = 0
          for (var i = 0; i < active.getCheckData().length; i++) {
            if (active.getCheckData()[i].phone == null) {

              continue
            } else {
              rlength++
            }

            phonelist.push(active.getCheckData()[i].phone)
          }
          $(".phonenum").text("(" + rlength + ")")
          alert_phone.val(phonelist.join(",\n"))



          alert_phone.on("change", function () {

            phonelist = alert_phone.val().replace(/，/g, ",").split(",")
            phonelist = [...new Set(phonelist)]

            var rlength = 0
            for (var i = 0; i < phonelist.length; i++) {

              phonelist[i] = phonelist[i].replace(/\s*/g, "")
              if (phonelist[i] == false) {

                continue

              } else {
                // rlength++
              }
              phonelist[i] = phonelist[i].replace(/\s*/g, "")
            }
            phonelist = [...new Set(phonelist)]
            for (var i = 0; i < phonelist.length; i++) {

              phonelist[i] = phonelist[i].replace(/\s*/g, "")
              if (phonelist[i] == false) {

                continue

              } else {
                rlength++
              }
              phonelist[i] = phonelist[i].replace(/\s*/g, "")
            }


            $(".phonenum").text("(" + rlength + ")")

            alert_phone.val(phonelist.join(",\n"))
            
          });
           //切换状态
           console.log($(".giveCardTpl_form [name=cardStyle]").val())
          
          
           $(".giveCardTpl_form .couponDays_box").hide(0)
           $(".giveCardTpl_form .couponAmount_box").hide(0)
           $(".giveCardTpl_form .couponDays_box").show(0)
            $(".giveCardTpl_form [name=couponAmount]").val(0) 

          form.on('select(cardStyle)', function(data){
            if(data.value==1){
              $(".giveCardTpl_form .couponDays_box").hide(0)
              $(".giveCardTpl_form .couponAmount_box").hide(0)
              $(".giveCardTpl_form .couponDays_box").show(0)
              $(".giveCardTpl_form [name=couponAmount]").val(0)

            }else if(data.value==2){
              $(".giveCardTpl_form .couponDays_box").hide(0)
              $(".giveCardTpl_form .couponAmount_box").hide(0)
              $(".giveCardTpl_form .couponAmount_box").show(0)
              $(".giveCardTpl_form [name=couponDays]").val(0)
            }
            console.log(data.elem); //得到select原始DOM对象
            console.log(data.value); //得到被选中的值
            console.log(data.othis); //得到美化后的DOM对象
            return false
          }); 

          $(".giveCardTpl_form [lay-submit]").on("click",function(){
            var filter = $(this).parents(".layui-form").attr("lay-filter")
            
            form.on('submit(' + filter + ')', function (data) {
              
              console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
              console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
              console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
              return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
            
            active.givecardAjax()
          })
          var filter = $(this).parents(".layui-form").attr("lay-filter")
          form.on('submit(' + filter + ')', function (data) {
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
          });

        }
      });
    },
    givecardAjax:function(){
      var cardStyle=$(".giveCardTpl_form [name=cardStyle]")
      var couponName=$(".giveCardTpl_form [name=couponName]")
      var couponDescribe=$(".giveCardTpl_form [name=couponDescribe]")
      var phones=$(".giveCardTpl_form [name=phones]")
      var couponDays=$(".giveCardTpl_form [name=couponDays]")
      var effectiveDays=$(".giveCardTpl_form [name=effectiveDays]")
      var couponAmount=$(".giveCardTpl_form [name=couponAmount]")
      var yanz=[cardStyle,couponName,couponDescribe,phones,couponDays,effectiveDays]

        setTimeout(function(){

      
          for(let i=0;i<yanz.length;i++){
            console.log(yanz[i].hasClass("layui-form-danger"))
            if(yanz[i].hasClass("layui-form-danger")){
              return

            }
          }
          var json={
            couponType :cardStyle.val(),
            couponName :couponName.val(),
            couponDescribe :couponDescribe.val(),
            phones :phones.val(),
            couponDays :couponDays.val(),
            couponAmount:couponAmount.val(),
            effectiveDays :effectiveDays.val(),
          }
          
          $(".giveCardTpl_form [lay-submit]").addClass("layui-btn-disabled")
          $(".giveCardTpl_form [lay-submit]").attr("disabled",true)
          
          $.ajax({
            url: 'http://api.xykoo.cn/manage/coupon/issuingCoupons',
            beforeSend: function(request) {
              request.setRequestHeader("X-Auth-Token", token);
            },
            type: 'get',
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            data: json
          })
          .done(function(data) {
            console.log("success");
            if(data.status == 200) {
              
                layer.msg("赠送成功")
              

            } else {
              layer.msg(data.msg)
            }
            
          })
          .fail(function() {
            layer.msg("数据连接失败")
            console.log("error");
          })
          .always(function() {
            console.log("complete");
            setTimeout(() => {
              $(".giveCardTpl_form [lay-submit]").removeClass("layui-btn-disabled")
              $(".giveCardTpl_form [lay-submit]").attr("disabled",false)
            }, 1000);
            
          },100)  
      });
        
        
        
        
        
        
         
        
    }

  };


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
    , btns: ['day30', 'day7', 'clear', 'confirm']
    , ready: function (value, date, endDate) {

      $('.laydate-btns-day30').text("近30天")
      $('.laydate-btns-day7').text("近7天")
      $(".laydate-footer-btns span").on("click", function () {
        var type = $(this).attr('lay-type');

        laydateActive[type] ? laydateActive[type].call(this) : '';
      })
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


  form.verify({
    select: function (value, item) { //value：表单的值、item：表单的DOM对象
      if (value == "") {

        return '请选择';
      }
    }

    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

  });
  //初始监听表单提交
  
  exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致

});