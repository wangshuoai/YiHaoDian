import $ from './lib.js';
import Ajax from './promise-ajax.js';
import Cookie from './cookie.js';
class Reg{
    constructor(){
        // 获取属性
        this.regBtn = $('#regBtn');
        this.userInput = $('#userInput');
        this.phoneInput = $('#phoneInput');
        this.pwdInput = $('#pwdInput');

        this.reg();
    }
    reg(){
        this.regBtn.onclick = e=>{
            var e = e || window.event;
            //取到用户名,手机号和密码发送到后端
            var username = userInput.value;
            var phone = phoneInput.value;
            var pwd = pwdInput.value;
            // 发送请求
            Ajax.init({
                method:'post',
                'url':'../user/register.php',
                data:{username, phone, pwd}
            }).then(res=>{
                console.log(res);
                res = JSON.parse(res);
                if(res.code == 1){
                    // 代表注册成功
                    location.href = '../dist/login.html';
                }else{
                    alert(res.msg);
                }
            })

            //阻止默认行为，让表单不提交
            if(e && e.preventDefault){
                e.preventDefault();
            }else{
                e.returnValue = false;
            }

        }
    }
}
export default Reg;