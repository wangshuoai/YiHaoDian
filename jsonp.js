class Jsonp{
    static jsonp(url, callbackName, data, fn){
        url += `?callback=${callbackName}`;
        if(data){
            for(var attr in data){
                url += `&${attr}=${data[attr]}`;
            }
        }
        console.log(url);
        //创建script标签
        var script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        // document.head.removeChild(script); //过河拆桥
        window[callbackName]= res =>{
            fn(res);
        }
    }
}
export default Jsonp;