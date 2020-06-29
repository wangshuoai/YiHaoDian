import $ from './lib.js';
import Cookie from './cookie.js';
import Jsonp from './jsonp.js';
class Cart{
    constructor(){
        //取出cookie里的userid
        this.userinfo = Cookie.getCookie('userinfo');
        this.userinfo = JSON.parse(this.userinfo);
        this.userid = this.userinfo.userid;

        this.init(); // 渲染数据方法
        window.onload = ()=>{
            this.checkAll = document.querySelectorAll('.check-all');  // 两个全选按钮
            this.checks = document.querySelectorAll('tr .check-one'); // 找到所有的单选按钮
            this.count = 0; // 记录单选选中的个数

            this.allCheck(); // 全选联动单选
            this.checksed(); // 单选联动全选

            this.allDel(); // 全选后删除所有商品
            this.checkedDel();

            this.goBackIndex();  // 点击logo直接返回首页
        }
        this.timer = null;
        
    }
    init(){
        Jsonp.jsonp('http://localhost/YiHaoDian/user/link.php','get',{userid:this.userid},(res)=>{ 
            console.log(res.data);
            var str = '';
            res.data.forEach(ele=>{
                let {goodsid, title, price, choosesrc, goodsnum} = ele;
                str += `<tr>
                <td class="checkbox"><input class="check-one check" type="checkbox" aa="${goodsid}"/></td>
                <td class="goods"><img src="${choosesrc}" alt=""/><span>${title}</span></td>
                <td class="price">${price}</td>
                <td class="count">
                    <span class="reduce" onclick="cart.reduceGoodsNum(this, ${goodsid})">-</span>
                    <input class="count-input" type="text" value="${goodsnum}" oninput="cart.changeValue(this,${goodsid})"/>
                    <span class="add" onclick="cart.addGoodsNum(this, ${goodsid})">+</span></td>
                <td class="subtotal">${goodsnum * price}</td>
                <td class="operation"><span class="delete" onclick="cart.delGoods(this,${goodsid})">删除</span></td>
                </tr>`;
            })
            $('tbody').innerHTML=str;
        })
    }
    /**全选联动单选 */
    allCheck(){
        this.checkAll[0].addEventListener('click', ()=>{
            for(var i = 0; i < this.checks.length; i++){
                this.checks[i].checked = this.checkAll[0].checked;
                this.count = this.checkAll[0].checked ? this.checks.length : 0;
            }
            if(this.checkAll[0].checked){
                this.checkAll[1].checked = true;
            }else{
                this.checkAll[1].checked = false;
            }
            this.total();  // 调用重新计算总价格和总数量
        })
        this.checkAll[1].addEventListener('click', ()=>{
            for(var i = 0; i < this.checks.length; i++){
                this.checks[i].checked = this.checkAll[1].checked;
                this.count = this.checkAll[1].checked ? this.checks.length : 0;
            }
            if(this.checkAll[1].checked){
                this.checkAll[0].checked = true;
            }else{
                this.checkAll[0].checked = false;
            }
            this.total();  // 调用重新计算总价格和总数量
        })
    }
    /**单选联动全选 */
    checksed(){
        var _this = this;
        for(var i = 0; i < this.checks.length; i++){
            this.checks[i].addEventListener('click',function(){
                this.checked ? _this.count++ : _this.count--;
                if(_this.checks.length == _this.count){
                    _this.checkAll[0].checked = true;
                    _this.checkAll[1].checked = true;
                }else{
                    _this.checkAll[0].checked = false;
                    _this.checkAll[1].checked = false;
                }
                _this.total();  // 调用重新计算总价格和总数量
            }) 
        }
    }
    /**计算商品总价格和总数量 */
    total(){
        var checks = document.querySelectorAll('tr .check-one');
        var totalNum = 0;  // 总数量
        var totalPrice = 0;  // 总价格
        checks.forEach(ele=>{
            // 如果选中
            if(ele.checked == true){
                // 找到当前单选框所在的tr
                var tr = ele.parentNode.parentNode;
                var num = tr.querySelector('.count-input').value;
                var price = tr.querySelector('.price').innerHTML;
                // 计算总数量和总价
                totalNum = num - 0 + totalNum;
                totalPrice += num * price;
            }
        })
        // 把总价和总数量追加到页面
        $('#priceTotal').innerHTML = totalPrice.toFixed(2);
        $('#selectedTotal').innerHTML = totalNum;
    }
    addGoodsNum(ele, id){
        console.log(ele);
        
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            // 找到input框
            var inputNum = ele.previousElementSibling.value;
            var goodsNum = inputNum - 0 + 1;
            // 把修改后的value重新赋值给input框
            ele.previousElementSibling.value = goodsNum;

            //拿到单价
            var singlePrice = ele.parentNode.previousElementSibling.innerHTML;
            // 重新计算小计
            var xj = ele.parentNode.nextElementSibling;
            xj.innerHTML = (singlePrice * goodsNum).toFixed(2);
            // 重新计算总件数和总价
            this.total();
            // 发送请求修改数据库里的当前商品的数量
            Jsonp.jsonp('http://localhost/YiHaoDian/user/delete.php','update',{gid:id, gnum:goodsNum, func:'update'},(res)=>{
                console.log(res);
            })
        })
        
    }
    reduceGoodsNum(ele,id){
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            console.log(ele);
            // 找到input框
            var inputNum = ele.nextElementSibling.value;
            if(inputNum == 1){
                return;
            }else{
                var goodsNum = inputNum - 0 - 1;
                // 把修改后的value重新赋值给input框
                ele.nextElementSibling.value = goodsNum;
            }
            //拿到单价
            var singlePrice = ele.parentNode.previousElementSibling.innerHTML;
            // 重新计算小计
            var xj = ele.parentNode.nextElementSibling;
            xj.innerHTML = (singlePrice * goodsNum).toFixed(2);
            // 重新计算总件数和总价
            this.total();
            // 发送请求修改数据库里的当前商品的数量
            Jsonp.jsonp('http://localhost/YiHaoDian/user/delete.php','update1',{gid:id, gnum:goodsNum, func:'update'},(res)=>{
                console.log(res);
            })
        })
    }
    changeValue(ele, id){
        // 获取到input框
        var inputValue = ele.value;
        inputValue = inputValue - 0;
        // 拿到单价
        var singlePrice = ele.parentNode.previousElementSibling.innerHTML;
        // 计算小计
        var xj = ele.parentNode.nextElementSibling;
        xj.innerHTML = (singlePrice * inputValue ).toFixed(2);
        // 重新计算总件数和总价
        this.total();
        // 发送请求修改数据库里的当前商品的数量
        Jsonp.jsonp('http://localhost/YiHaoDian/user/delete.php','update2',{gid:id, gnum:inputValue, func:'update'},(res)=>{
            console.log(res);
        })
    }
    delGoods(ele, id){
        //找到当前所在的tr
        var tr = ele.parentNode.parentNode;
        // 判断当前删除的这条数据是否选中
        var checkone = tr.querySelector('.check-one');
        tr.remove();
        // 发送请求去数据库里删除数据
        Jsonp.jsonp('http://localhost/YiHaoDian/user/delete.php','del',{gid:id, func:'del'},(res)=>{
            console.log(res);
            if(res.stateCode == 200){
                alert('删除成功了！');
            }
        })
        if(checkone.checked){
            // 重新计算总件数和总价
            this.total();
        }
    }
    /**全选后删除所有商品 */
    allDel(){
        var deleteAll = $("#deleteAll");
        deleteAll.addEventListener('click',()=>{
            if(this.checkAll[0].checked || this.checkAll[1].checked){
                $('tbody').innerHTML ='购物车没有商品了，请先加入一些商品呦！';
                this.total(); // 重新计算价格
                this.checkAll[0].checked = false;
                this.checkAll[1].checked = false;
            }else{
                return false;
            }
            // 发送请求去数据库里删除数据
            Jsonp.jsonp('http://localhost/YiHaoDian/user/delete.php','del1',{func:'delAll'},(res)=>{
                console.log(res);
                if(res.stateCode == 200){
                    alert('删除成功了！');
                }
            })
        }) 
    }

    /**选中某一个商品，点击下方的删除按钮，删除掉对应的数据 */
    checkedDel(){
        var deleteAll = $("#deleteAll");
        var checks = document.querySelectorAll('tr .check-one');
        deleteAll.addEventListener('click', ()=>{
            console.log(checks);
            for(var i = 0; i < checks.length; i++){
                if(checks[i].checked){
                    checks[i].parentNode.parentNode.remove();
                    // 重新计算一下总数量和总价格
                    this.total();
                    var gid = checks[i].getAttribute('aa');
                    // 发送请求去数据库里删除数据
                    Jsonp.jsonp('http://localhost/YiHaoDian/user/delete.php','del1',{gid:gid, func:'del'},(res)=>{
                        console.log(res);
                        if(res.stateCode == 200){
                            alert('删除成功了！');
                        }
                    })
                }
            }
        })
    }

    //点击直接logo返回首页
    goBackIndex(){
        $('#logo').addEventListener('click',()=>{
            window.location.href = '../dist/index.html';
        })
    }

}
window.cart = new Cart();