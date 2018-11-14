
layui.define(['layer', 'form', "storageTable_tab", "laypage", "element", "laytpl", "laydate"], function (exports) {
  
  // localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiOEMxQzY1MEMtODlCQS00OERFLUJCMDUtMzY3RTM4REM2OTlCIn0.d29VWB4xBIhV9bhKq5NU81FIAoxb4VXiQsOFqW7Ep4Q")
  var layer = layui.layer
    , form = layui.form
    , $ = layui.$
    , laypage = layui.laypage
    , laydate = layui.laydate
    , element = layui.element
    , laytpl = layui.laytpl
    , storageTable_tab = layui.storageTable_tab
    , active
    , token = localStorage.getItem("token")
    , newtoken = localStorage.getItem("newtoken")
  // , token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiOEMxQzY1MEMtODlCQS00OERFLUJCMDUtMzY3RTM4REM2OTlCIn0.d29VWB4xBIhV9bhKq5NU81FIAoxb4VXiQsOFqW7Ep4Q"

  layer.msg('欢迎进入');
  // layui.data("table", {
  //   key: 0
  //   , value: '张勇'
  // })


  var table_option = {
    elem: '#storageTable'
    , id: 'usertable'
    , height: ""
    , url: 'http://api.xykoo.cn/manage/stock/findClothingStockPage' //数据接口
    , method: "get"
    , where: {
    }
    , response: {
      statusName: 'status' //数据状态的字段名称，默认：code
      , statusCode: 200 //成功的状态码，默认：0
      , msgName: 'message' //状态信息的字段名称，默认：msg
      , countName: '' //数据总数的字段名称，默认：count
      , dataName: '' //数据列表的字段名称，默认：data

    }
    , page: true //开启分页

    , cols: [[ //表头
      // { field: 'clothingNo', title: 'userId', width: 80, type: "checkbox"},
      { field: 'clothingNo', title: '商品编号', width: 100, sort: true, align: "center" }
      , { field: 'clothingImg', title: '图片', width: 80, templet: '#photoTpl', align: "center" }
      , { field: 'clothingStocks1', title: '尺码', width: 80, templet: '#sizeTpl', align: "center" }
      , { field: 'clothingStocks2', title: '总库存', width: 80, templet: '#stockTpl', align: "center" }
      , { field: 'clothingStocks3', title: '现库存', width: 80, templet: '#stockNumTpl', align: "center" }
      , { field: 'creatTime', title: '回库', width: 65, templet: "#return", align: "center" }
      // , { field: 'creatTime', title: '入库时间', width: 140, templet: "#creatTimeTpl" }
      , { field: 'caozuo', title: '操作', width: 130, templet: "#tool", align: "center" }
    ]]
    , request: {
      pageName: 'page' //页码的参数名称，默认：page
      , limitName: 'size' //每页数据量的参数名，默认：limit

    }
    , headers: { "X-Auth-Token": token }
    , done: function () {
      $(".layui-btn[lay-event=del]").on("click", function () {
        var _this = $(this)
        layer.confirm('确定删除吗？', {}, function (index) {
          $.ajax({
            //第一个参数url,要把参数传到什么位置
            url: "http://api.xykoo.cn/manage/stock/deleteStock",
            beforeSend: function (request) {
              request.setRequestHeader("X-Auth-Token", token);
            },
            type: 'get', //type是ajax的方法，可以用post可以用get，两种方法的区别可以自己查阅资料
            dataType: 'json', //传递的数据类型，对应我上面的数据格式，这里用json。数据类型也可以是html/xml等
            data: { clothingId: _this.attr("data-id") }, //传递数据
            success: function (data) { //success表示，当服务器返回数据成功后，该做什么，返回的数据储存在data中，我们直接把data传入函数中。
              if (data.status == 200) {
                layer.msg("删除成功", { icon: 1 })
                tableIns.reload({
                  page: {
                    curr: 1 //重新从第 1 页开始
                  }

                });

              } else {
                layer.msg(data.message)
              }
            },
            error: function (data) {
              layer.msg("删除失败")
            }
          });
          layer.close(index);
        })

      })
      $(".layui-btn[lay-event=return]").on("click", function () {
        var _this = $(this)
        layer.confirm("确定回库吗？", function () {
          if (Number(_this.attr("num")) >= Number(_this.attr("all"))) {
            layer.msg("库存已满，无法回库!")
            return false;
          } else {
            active.storage(_this.attr("lay-data-stockId"), 1, function () {
              layer.msg("回库成功！", { icon: 1 })
              tableIns.reload({})
            })
          }

        })

      })


    }

  }


  var tableIns = storageTable_tab.render(table_option);

  storageTable_tab.on('tool(storageTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"

    var data = obj.data; //获得当前行数据
    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
    var tr = obj.tr; //获得当前行 tr 的DOM对象

    if (layEvent == 'edit') { //查看
      console.log(obj.data)
      active.editstock(obj.data)
      //do somehing
    } else if (layEvent == "") {


    }
  });
  active = {
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
    getClothingNo: function (clothingNo, fn) {
      $("input[name='newclothingNo']").val("")
      var index = layer.load(2)
      setTimeout(function () {
        layer.close(index)
      }, 5000)
      $.ajax({
        url: 'http://api.console.xykoo.cn/clothingNo/getClothingNo',
        beforeSend: function (request) {
          request.setRequestHeader("token", newtoken);
          request.setRequestHeader("Accept", "*/*");

        },
        type: 'get',
        dataType: 'json',
        data: {
          clothingNo: clothingNo
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
    newgetClothingNo: function (obj, fn) {
      var index = layer.load(2)
      setTimeout(function () {
        layer.close(index)
      }, 5000)
      $.ajax({
        url: 'http://api.console.xykoo.cn/clothingNo/generateClothingNo',
        beforeSend: function (request) {
          request.setRequestHeader("token", newtoken);
          request.setRequestHeader("Accept", "*/*");

        },
        type: 'post',
        dataType: 'json',
        data: {
          clothingNo: obj.clothingNo,
          partitionId: obj.partitionId,
          positionId: obj.positionId,
          categoryId: obj.categoryId
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
    editstock: function (data) {
      layer.open({
        title: "商品编辑",
        type: 1,
        maxmin: true,
        area: ['600px', 'auto'],
        offset: '0',
        content: $("#editTpl").html(), //这里content是一个普通的String
        success: function (layero, index) {
          // form.render(null, 'addstock_son');
          if ($(document).width() < 600) {
            layer.full(index)
          }
          var editJson = {
            "clothingNo": data.clothingNo, // "name": "value"
            "clothingId": data.clothingId
            , "XS": null, "NXS": null
            , "S": null, "NS": null
            , "M": null, "NM": null
            , "L": null, "NL": null
            , "XL": null, "NXL": null
            , "JM": null, "NJM": null
          }
          var stockIdarr = {}
          console.log(data)
          for (var i = 0; i < data.clothingStocks.length; i++) {
            if (data.clothingStocks[i]["clothingStockType"] == "XS") {
              stockIdarr.XS = data.clothingStocks[i]["clothingStockId"]

              editJson.XS = data.clothingStocks[i]["clothingStockTotal"]
              editJson.NXS = data.clothingStocks[i]["clothingStockNum"]
            } else if (data.clothingStocks[i]["clothingStockType"] == "S") {
              stockIdarr.S = data.clothingStocks[i]["clothingStockId"]

              editJson.S = data.clothingStocks[i]["clothingStockTotal"]
              editJson.NS = data.clothingStocks[i]["clothingStockNum"]
            } else if (data.clothingStocks[i]["clothingStockType"] == "M") {
              stockIdarr.M = data.clothingStocks[i]["clothingStockId"]

              editJson.M = data.clothingStocks[i]["clothingStockTotal"]
              editJson.NM = data.clothingStocks[i]["clothingStockNum"]
            } else if (data.clothingStocks[i]["clothingStockType"] == "L") {
              stockIdarr.L = data.clothingStocks[i]["clothingStockId"]

              editJson.L = data.clothingStocks[i]["clothingStockTotal"]
              editJson.NL = data.clothingStocks[i]["clothingStockNum"]
            } else if (data.clothingStocks[i]["clothingStockType"] == "XL") {
              stockIdarr.XL = data.clothingStocks[i]["clothingStockId"]

              editJson.XL = data.clothingStocks[i]["clothingStockTotal"]
              editJson.NXL = data.clothingStocks[i]["clothingStockNum"]
            } else if (data.clothingStocks[i]["clothingStockType"] == "均码" || data.clothingStocks[i]["clothingStockType"] == "JM") {
              stockIdarr.JM = data.clothingStocks[i]["clothingStockId"]

              editJson.JM = data.clothingStocks[i]["clothingStockTotal"]
              editJson.NJM = data.clothingStocks[i]["clothingStockNum"]
            }
          }
          console.log(stockIdarr)
          //初始化表单
          form.val("editBox", editJson)
          form.on('submit(submitButton)', function (res) {
            // res.field.
            console.log(res.field)
            var StockNumDTOs = [
              {
                "clothingId": res.field.clothingId,
                "stockId": stockIdarr["XS"],
                "stockNum": res.field.NXS,
                "stockTotal": res.field.XS,
                "stockType": "XS"
              }, {
                "clothingId": res.field.clothingId,
                "stockId": stockIdarr["S"],
                "stockNum": res.field.NS,
                "stockTotal": res.field.S,
                "stockType": "S"
              }, {
                "clothingId": res.field.clothingId,
                "stockId": stockIdarr["M"],
                "stockNum": res.field.NM,
                "stockTotal": res.field.M,
                "stockType": "M"
              }, {
                "clothingId": res.field.clothingId,
                "stockId": stockIdarr["L"],
                "stockNum": res.field.NL,
                "stockTotal": res.field.L,
                "stockType": "L"
              }, {
                "clothingId": res.field.clothingId,
                "stockId": stockIdarr["XL"],
                "stockNum": res.field.NXL,
                "stockTotal": res.field.XL,
                "stockType": "XL"
              }, {
                "clothingId": res.field.clothingId,
                "stockId": stockIdarr["JM"],
                "stockNum": res.field.NJM,
                "stockTotal": res.field.JM,
                "stockType": "均码"
              },
            ]
            var ajaxStockNumDTOs = []
            for (var i = 0; i < StockNumDTOs.length; i++) {
              if (StockNumDTOs[i].stockTotal || StockNumDTOs[i].stockNum) {
                if (Boolean(StockNumDTOs[i].stockId) == false) {
                  StockNumDTOs[i].stockId = 0
                }
                ajaxStockNumDTOs.push(StockNumDTOs[i])
              }
            }


            console.log(StockNumDTOs)
            console.log(ajaxStockNumDTOs)
            $.ajax({
              url: "http://api.xykoo.cn/manage/stock/modifyStock",
              beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", token);
              },
              type: "post",
              async: false,
              dataType: "json",
              contentType: "application/json;charset=utf-8",
              data: JSON.stringify(ajaxStockNumDTOs),
              success: function (data) {
                if (data.status == 200) {
                  layer.msg('编辑成功', { icon: 1 });
                  tableIns.reload({
                    page: {
                      curr: 1 //重新从第 1 页开始
                    }

                  });
                  layer.closeAll('page');

                } else {
                  layer.msg(data.message);
                }
              },
              error: function () {
                layer.msg("获取数据失败！");
              }
            });

            return false;
          });
        }
      })
    },
    sousuo: function () {
      tableIns.reload({
        page: {
          curr: 1 //重新从第 1 页开始
        }
        , where: {
          clothingNo: $(".sousuo [name=phone]").val()
        }

      });
    },
    addstock: function () {
      layer.open({
        title: "商品入库",
        type: 1,
        maxmin: true,
        area: ['750px', '750px'],
        offset: '0',
        content: $("#addstockTpl").html(), //这里content是一个普通的String
        success: function (layero, index) {
          layui.form.render();
          form.render(null, 'addstock_son');
          if ($(document).width() < 1024) {
            layer.full(index)
          }
          $("input[name=stockstyle][value=1]").click()

          $(".checked_box").html($("#checked_box3").html())

          form.on('submit(submitButton1)', function (data) {
                  
            active.ajaxsubmit1()
          })
          
          form.on('submit(submitButton3)', function (data) {
            console.log(data.field)
            var json = {
              A: data.field.stockTotal1,
              S: data.field.stockTotal2,
              M: data.field.stockTotal3,
              L: data.field.stockTotal4,
              B: data.field.stockTotal5,
              J: data.field.stockTotal6
            }

            window.open("printPage.html?newNo=" + data.field.newclothingNo + "&sizeObj=" + JSON.stringify(json), '_blank', 'width=700,height=800')

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
          });



          

          form.on('radio(stockstyle)', function (data) {
            if (data.value == 1) {

              $(".checked_box").html($("#checked_box3").html())
              getAddInfo()
              
              
            } else if (data.value == 3) {
              $(".checked_box").html($("#checked_box1").html())
              active.getWarehouse(function (data) {
                var arr = []
                var f = false
                for (let i = 0; i < data.data.content.length; i++) {
                  if (i == data.data.content.length - 1) {
                    f = true
                  }
                  active.getWarehousePartition(data.data.content[i].warehouseNo, function (data1) {
                    for (let j = 0; j < data1.data.length; j++) {
                      arr.push(data1.data[j])
                    }

                  }, function () {
                    console.log(arr)
                    initKuqu(arr)
                  }, f)


                }


              })
              $(".addstock_son .getClothingNo").on("click", function () {

                active.getClothingNo($("input[name='clothingNo']").val(), function (data) {

                  $("input[name='newclothingNo']").val(data.data.clothingNumber)
                })
              })
              $(".addstock_son .newgetClothingNo").on("click", function () {
                var obj = {
                  clothingNo: $("input[name='clothingNo']").val(),
                  partitionId: $("select[name='kuqu'] option:selected").val(),
                  positionId: $("select[name='kuwei'] option:selected").val(),
                  categoryId: $("select[name='category'] option:selected").val(),
                }


                active.newgetClothingNo(obj, function (data) {
                  $("input[name='newclothingNo']").val(data.data)
                })
              })
              getCategory()
            } else if (data.value == 2) {

              $(".checked_box").html($("#checked_box2").html())
              $(".addstock_son .ajaxpeis").on("click", function () {
                setTimeout(function () {

                  var yanz = [$("input[name='clothingNo']"), $("input[name='stockType']")]
                  for (var i = 0; i < yanz.length; i++) {
                    console.log(yanz[i].hasClass("layui-form-danger"))
                    if (yanz[i].hasClass("layui-form-danger")) {
                      return
                    }
                  }
                  active.ajaxsubmit2()
                }, 100)
              })
            }

            form.render(null, 'addstock_son');

            // console.log(data.elem); //得到radio原始DOM对象
            // console.log(data.value); //被点击的radio的value值
            return false
          });

          // 
          getCategory()
          function getCategory() {
            layer.load(2)
            var url = 'http://api.console.xykoo.cn/category/getCategory';
            $.ajax({
              url: url,
              beforeSend: function (request) {
                request.setRequestHeader("token", newtoken);
              },
              type: "get",
              async: false,
              dataType: "json",
              data: {},
              success: function (data) {
                layer.closeAll("loading")
                console.log(data)

                if (data.status == 200) {
                  initgetCategory(data.data)
                } else {
                  layer.msg(data.message);
                }
                //初始化添加信息
              },
              error: function () {
                layer.closeAll("loading")
                layer.msg("获取数据失败！");
              }
            });
          }


          function initgetCategory(data) {
            initCategory_1(data);
            layui.form.render();

          }
          function initCategory_1(data) {
            $("#category option").remove();
            $("#category option").remove();
            $("#category").append("<option selected='selected' value=''>请选择品类</option>");

            for (var j = 0, l = data.length; j < l; j++) {


              $("#category").append("<option  value='" + data[j].categoryId + "'>" + data[j].categoryName + "</option>");

            }
          }
          getAddInfo()
          function getAddInfo() {
            var url = 'http://api.xykoo.cn/manage/clothing/getAddInfo';
            $.ajax({
              url: url,
              beforeSend: function (request) {
                request.setRequestHeader("X-Auth-Token", token);
              },
              type: "post",
              async: false,
              dataType: "json",
              data: {},
              success: function (data) {
                console.log(data)

                if (data.status == 200) {
                  initClothingInfo(data.data)
                } else {
                  layer.msg(data.message);
                }
                //初始化添加信息
              },
              error: function () {
                layer.msg("获取数据失败！");
              }
            });
          }


          function initClothingInfo(data) {
            var categoryList = data[0];
            console.log(categoryList)



            initCategory(categoryList, 0);
            layui.form.render();

          }
          function initCategory(data, id) {
            $("#levelOne option").remove();
            $("#levelTwo option").remove();
            if (id == 0) {
              $("#levelOne").append("<option selected='selected' value=''>请选择一级目录</option>");
            } else {
              $("#levelTwo").append("<option value=''>请选择二级目录</option>");
            }
            for (var j = 0, l = data.length; j < l; j++) {

              if (data[j].parentId == 0) {
                if (id != 0) {
                  if (id == data[j].catId) {
                    $("#levelOne").append("<option selected='selected' value='" + data[j].catId + "'>" + data[j].catName + "</option>");
                  } else {
                    $("#levelOne").append("<option value='" + data[j].catId + "'>" + data[j].catName + "</option>");
                  }
                } else {
                  $("#levelOne").append("<option value='" + data[j].catId + "'>" + data[j].catName + "</option>");
                }

              } else {
                if (id != 0) {
                  if (id == data[j].parentId) {
                    $("#levelTwo").append("<option value='" + data[j].catId + "'>" + data[j].catName + "</option>");
                  }
                }

              }
            }
            selectChange(data);
          }
          function selectChange(data) {
            layui.form.on("select(levelOne)", function () {
              var id = $("#levelOne").val();
              initCategory(data, id);
              layui.form.render();
            })
          }
          //



          active.getWarehouse(function (data) {
            var arr = []
            var f = false
            for (let i = 0; i < data.data.content.length; i++) {
              if (i == data.data.content.length - 1) {
                f = true
              }
              active.getWarehousePartition(data.data.content[i].warehouseNo, function (data1) {
                for (let j = 0; j < data1.data.length; j++) {
                  arr.push(data1.data[j])
                }

              }, function () {
                console.log(arr)
                initKuqu(arr)
              }, f)


            }


          })
          function initKuqu(data) {
            console.log(data)
            $("select[name=kuqu] option").remove();
            $("select[name=kuqu]").append("<option selected='selected' value=''>请选择品类</option>");

            for (var j = 0; j < data.length; j++) {


              $("select[name=kuqu]").append("<option data-No=" + data[j].warehouseNo + " data-No1=" + data[j].partitionNo + "  value='" + data[j].partitionId + "'>" + data[j].partitionName + "</option>");

            }
            form.on('select(kuqu)', function (data) {
              console.log(data.elem); //得到select原始DOM对象
              console.log(data.value); //得到被选中的值
              console.log(data.othis); //得到美化后的DOM对象

              var warehouseNo = $(data.elem).find("option:selected").attr("data-No")
              var partitionNo = $(data.elem).find("option:selected").attr("data-No1")
              active.getStockPosition(warehouseNo, function (data) {
                console.log(data)
                $("select[name=kuwei] option").remove();
                for (var j = 0; j < data.data.length; j++) {
                  for (var i = 0; i < data.data[j].length; i++) {


                    console.log(data.data[j][i].partitionNo == partitionNo)
                    if (data.data[j][i].partitionNo == partitionNo) {
                      $("select[name=kuwei]").append("<option  value=" + data.data[j][i].positionId + ">" + data.data[j][i].positionName + "</option>");
                    }
                    layui.form.render();

                  }


                }
              })
            });

            layui.form.render();
          }




        }
      })
    },
    //服装提交
    ajaxsubmit1: function () {
      var levelOne = $("#levelOne option:selected").val();
      var levelTwo = $("#levelTwo option:selected").val();
      // console.log(levelOne)
      // console.log(levelTwo)
      var clothingNo = $("input[name='clothingNo']").val();//商品编号
      var stockTotal1 = $("input[name='stockTotal1']").val();//stockType1 商品数量
      var stockTotal2 = $("input[name='stockTotal2']").val();//stockType2
      var stockTotal3 = $("input[name='stockTotal3']").val();//stockType3
      var stockTotal4 = $("input[name='stockTotal4']").val();//stockType4
      var stockTotal5 = $("input[name='stockTotal5']").val();//stockType5
      var stockTotal6 = $("input[name='stockTotal6']").val();//stockType6

      var stockType1 = $(".stockType1").text();//stockType1 商品型号
      var stockType2 = $(".stockType2").text();//stockType2
      var stockType3 = $(".stockType3").text();//stockType3
      var stockType4 = $(".stockType4").text();//stockType4
      var stockType5 = $(".stockType5").text();//stockType5
      var stockType6 = $(".stockType6").text();//stockType6


      var url = "http://api.xykoo.cn/manage/stock/addClothingInventory";

      // var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5aWt1QXBwQWRtaW4iLCJhZG1pbiI6NiwianRpIjoiM0ZBQUExREEtRkZCRi00NkE4LUI3MjEtRTAwQUM5NTlFMEY0In0.a31qrochC4QooS8MABSH8JXHQ0CJmpYXbtBMQVhB_I0";
      // var stockDTO = '{"categoryOne":"'+levelOne+'","categoryTwo":"'+levelTwo+'","clothingNo":"'+clothingNo+'","stock":[{"stockNum": "'+stockTotal1+'","stockType": "'+stockType1+'"},{"stockNum": "'+stockTotal2+'","stockType": "'+stockType2+'"},{"stockNum": "'+stockTotal3+'","stockType": "'+stockType3+'"},{"stockNum": "'+stockTotal4+'","stockType": "'+stockType4+'"},{"stockNum": "'+stockTotal5+'","stockType": "'+stockType5+'"},{"stockNum": "'+stockTotal6+'","stockType": "'+stockType6+'"}]}';
      var stockDTO = { "categoryOne": levelOne, "categoryTwo": levelTwo, "clothingNo": clothingNo, "stock": [{ "stockNum": parseInt(stockTotal1), "stockType": stockType1 }, { "stockNum": parseInt(stockTotal2), "stockType": stockType2 }, { "stockNum": parseInt(stockTotal3), "stockType": stockType3 }, { "stockNum": parseInt(stockTotal4), "stockType": stockType4 }, { "stockNum": parseInt(stockTotal5), "stockType": stockType5 }, { "stockNum": parseInt(stockTotal6), "stockType": stockType6 }] };
      var stock = []
      for (var i = 0; i < stockDTO.stock.length; i++) {
        if (stockDTO.stock[i].stockNum) {
          stock.push(stockDTO.stock[i])
        }
      };
      stockDTO.stock = stock

      $.ajax({
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("X-Auth-Token", token);
        },
        type: "post",
        async: false,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(stockDTO),
        success: function (data) {
          console.log(data);
          if (data.status == 200) {
            // 提示成功
            layer.msg('添加成功', { icon: 1 });
            // 刷新当前页面
            tableIns.reload({
              page: {
                curr: 1 //重新从第 1 页开始
              }

            });
          } else {
            if (data.status == 400 && data.msg == "已存在商品号") {
              layer.msg("已存在商品号");
              return false;
            }
            layer.msg('添加信息失败，请重试');
          }
        },
        error: function () {
          layer.msg("获取数据失败！");
        }
      });
      return false;
    },
    //配饰入库提交
    ajaxsubmit2: function () {
      var url = "http://api.xykoo.cn/manage/ornamentStock/addOrnamentStock";
      var json = {
        "ornamentNo": $("input[name='clothingNo']").val(),
        "stockTotal": $("input[name='stockType']").val()
      }

      $.ajax({
        url: url,
        beforeSend: function (request) {
          request.setRequestHeader("X-Auth-Token", token);
        },
        type: "post",
        async: false,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(json),
        success: function (data) {
          console.log(data);
          if (data.status == 200) {
            // 提示成功
            layer.msg('添加成功', { icon: 1 });
            tableIns.reload({
              page: {
                curr: 1 //重新从第 1 页开始
              }

            });
          } else {
            layer.msg(data.message);
          }
        },
        error: function () {
          layer.msg("获取数据失败！");
        }
      });
    },
    bianji: function (clothingId) {
      // window.open("http://api.xykoo.cn/editStock.html?clothingId=" + clothingId + "", "修改库存", 'height=500, width=800, top=10, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
    },
    storage: function (stockId, number, fn) {
      var index = layer.load(2)
      $.ajax({
        url: 'http://api.xykoo.cn/manage/stock/storage',
        beforeSend: function (request) {
          request.setRequestHeader("X-Auth-Token", token);
        },
        type: "get",
        data: {
          stockId: stockId,
          number: number
        },
        success: function (data) {
          layer.close(index)
          // console.log(data);
          switch (data.status) {
            case 200:

              if (fn) {
                fn(data)
              }
              break;
            case 401:
              layer.alert('请重新登录', function () {
                top.location.href = "login.html"
              });
              break;
            default:
              layer.alert(data.message, function () {
              });
              break;
          };


        },
        error: function () {
          layer.close(index)
          layer.alert('接口异常');
        }
      })
    }







  }
  //
  $(".addstock").on("click", function () {
    active.addstock()
  })
  $(".sousuo-btn").on("click", function () {
    active.sousuo()
  })


  $(".return_btn").on("click", function () {
    index = layer.open({
      title: "扫码入库",
        type: 1,
        maxmin: true,
        area: ['750px', '750px'],
        offset: '0',
        content: $("#return_box").html(), //这里content是一个普通的String
        success: function (layero, index) {
          layui.form.render();
          form.render(null, 'addstock_son');
          if ($(document).width() < 600) {
            layer.full(index)
          }
          $(layero.selector + " .saoma").on("keydown",function(e){
              e=e||event
              if(e.keyCode==13){
                if($(this).val()!=""){
                  $(layero.selector + " [name=malist]").val($(layero.selector + " [name=malist]").val()+$(this).val()+"\n")
                  $(this).val("")
                  $(this).focus()
                }
                
              }
          })
          $(layero.selector + " .add0").on("click",function(e){
            if($(layero.selector + " .saoma").val()!=""){
              $(layero.selector + " [name=malist]").val($(layero.selector + " [name=malist]").val()+$(layero.selector + " .saoma").val()+"\n")
              $(layero.selector + " .saoma").val("")
              $(layero.selector + " .saoma").focus() 
            }
          })
          form.on('submit(return_box)', function (data) {

            alert(JSON.stringify(data.field))

            return false;
        });

        }
    });
  })
  exports('storageTable', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致

});