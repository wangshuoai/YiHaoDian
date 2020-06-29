export default class Cookie{
    //存cookie
    static setCookie(name, val, exp=0){
        // 判断是否传值
        // if(!name || !val) return;
        if(exp){
            //设置时间
            let d = new Date();
            let t = d.getTime();
            d.setTime(t + 1 * 1000 * 60 * exp);
            exp = d.toGMTString();
        }
        // 设置cookie
        document.cookie = name + '=' + val + ';expires=' + exp;
    }


    //取cookie
    static getCookie(name){
        // 没有name,就终止
        if(!name) return;
        let cookies = document.cookie;
        // 将字符串分割为数组
        cookies = cookies.split(';');
        // console.log(cookies);
        // 声明变量，保存取到的值：
        let val = '';
        cookies.forEach(ele =>{
            let res = ele.indexOf(name); // 查找到目标值返回1
            // console.log(res);
            if(res != -1){
                val = ele.split("=")[1];  // [age, 18]
                // console.log(ele, val);
            }
        })
        return val; 
    }

}