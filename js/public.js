


function dataURLtoFile(dataurl, filename) {
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
function getBase64Image(src,img){
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
        
        
        
}