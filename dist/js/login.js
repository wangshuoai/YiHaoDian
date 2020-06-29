import $ from './lib.js';
import Ajax from './promise-ajax.js';
import Cookie from './cookie.js';
class Login{
    constructor(){
        //获取属性
        this.loginBtn = $('#logBtn');
        this.userInput = $('#userInput');
        this.pwdInput = $('#pwdInput');
        this.login();
    }
    login(){
        this.loginBtn.onclick = e =>{
            var e = e || window.event;
            //取到用户名和密码发送到后端
            var username = userInput.value;
            var pwd = pwdInput.value;
            Ajax.init({
                method:'post',
                'url':'../user/login.php',
                data:{username, pwd}
            }).then(res=>{
                res = JSON.parse(res);
                console.log(res.msg);
                if(res.code == 1){
                    //代表登录成功
                    //存cookie,这里演示直接存用户名，真实开发中，得结合后端，存令牌
                    var userinfo = {
                        username:res.msg.user,
                        userid:res.msg.id
                    }
                    Cookie.setCookie('userinfo', JSON.stringify(userinfo), {path:'/'});
                    location.href = '../dist/index.html';
                }else{
                    alert(res.msg);
                }
            })
            // 阻止默认事件
            if(e.preventDefault){
                e.preventDefault(); 
            }else{
                e.returnValue = false;
            }
        }
    }
}
export default Login;