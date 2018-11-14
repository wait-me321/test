
function tinyImgUpload(inputID, options) {
    
    var eleList = document.querySelectorAll('#'+inputID);
    if(eleList.length == 0){
        console.log('没有找到当前元素');
        return;
    }else if(eleList.length>1){
        console.log('ID是唯一的，不能赋值两次');
        return;
    }else {
        eleList[0].innerHTML ='<div id="img-container'+inputID+'" class="img-container">'+
                '<div class="img-up-add  img-item" id="img-up-add'+inputID+'"> <span class="img-add-icon">+</span> </div>'+
                '<input type="file" name="files" id="img-file-input'+inputID+'" class="img-file-input"  '+
                '</div>';
        var ele = eleList[0].querySelector('#img-container'+inputID);
        ele.files = [];   
    }


    var addBtn = document.querySelector('#img-up-add'+inputID);
    addBtn.addEventListener('click',function () {
        document.querySelector('#img-file-input'+inputID).value = null;
        document.querySelector('#img-file-input'+inputID).click();

        return false;
    },false)

    // 预览图片
    //处理input选择的图片
    function handleFileSelect(evt) {
        var files = evt.target.files;
        
        console.log(files[0])
        for(var i=0, f; f=files[i];i++){
            // 过滤掉非图片类型文件
            if(!f.type.match('image.*')){
                continue;
            }
            // 过滤掉重复上传的图片
            var tip = false;
            // for(var j=0; j<(ele.files).length; j++){
            //     if((ele.files)[j].name == f.name){
            //         tip = true;
            //         break;
            //     }
            // }
            if(!tip){
                // 图片文件绑定到容器元素上
                ele.files.push(f);

                var reader = new FileReader();

                reader.onload = (function (theFile) {
                    
                   
                    return function (e) {
                        var oDiv = document.createElement('div');
                        oDiv.className = 'img-thumb img-item';
                        // 向图片容器里添加元素
                        oDiv.innerHTML = '<img class="thumb-icon img'+inputID+'" src="'+e.target.result+'" />'+
                                        '<a href="" onclick="return false;" class="img-remove">x</a>'

                        ele.insertBefore(oDiv, addBtn);
                    };
                })(f);

                reader.readAsDataURL(f);
            }
        }
    }
    // input#img-file-input是一个隐藏的上传图片的input控件，当选择图片的时候会触发change事件
    document.querySelector('#img-file-input'+inputID).addEventListener('change', handleFileSelect, false);

    
    function removeImg(evt) {
        if(evt.target.className.match(/img-remove/)){
            console.log('3',ele.files);
        
            function getIndex(ele){

                if(ele && ele.nodeType && ele.nodeType == 1) {
                    var oParent = ele.parentNode;
                    var oChilds = oParent.children;
                    for(var i = 0; i < oChilds.length; i++){
                        if(oChilds[i] == ele)
                            return i;
                    }
                }else {
                    return -1;
                }
            }
            
            var index = getIndex(evt.target.parentNode);
            ele.removeChild(evt.target.parentNode);
            if(index < 0){
                return;
            }else {
                ele.files.splice(index, 1);
            }
            console.log('4',ele.files);
        }
    }
    ele.addEventListener('click', removeImg, false);

    
    // function uploadImg() {
    //     console.log(ele.files);

    //     var xhr = new XMLHttpRequest();
    //     var formData = new FormData();

    //     for(var i=0, f; f=ele.files[i]; i++){
    //         formData.append('files', f);
    //     }

    //     console.log('1',ele.files);
    //     console.log('2',formData);

    //     xhr.onreadystatechange = function (e) {
    //         if(xhr.readyState == 4){
    //             if(xhr.status == 200){
    //                 options.onSuccess(xhr.responseText);
    //             }else {
    //                 options.onFailure(xhr.responseText);
    //             }
    //         }
    //     }

    //     xhr.open('POST', options.path, true);
    //     xhr.send(formData);

    // }
    // return uploadImg;
}
