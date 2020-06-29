class Ajax{
    static init({method, url, data}){
        if(method == 'get'){
            if(data){
                url += '?';
                for(var key in data){
                    url += `${key}=${data[key]}&`;
                }
                // 把最后一个&删掉
                url = url.slice(0,-1);
            }
        }
        if(method == 'post'){
            var str = '';
            if(data){
                for(var key in data){
                    str += `${key}=${data[key]}&`;
                }
                str = str.slice(0,-1);
            }
        }
        return new Promise(function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            // 设置响应头
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            xhr.send(str);
            xhr.addEventListener('readystatechange', fn);
            function fn(){
                if(xhr.readyState == 4 ){
                    if(xhr.status == 200){
                        // console.log(xhr.responseText);
                        resolve(xhr.responseText);
                    }else{
                        reject("请求失败，失败状态码为："+ xhr.status);
                    }
                }
            }
        })
    }
}
export default Ajax;