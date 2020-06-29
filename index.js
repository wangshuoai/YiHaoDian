import $ from './lib.js';
import Ajax from './promise-ajax.js';
import Cookie from './cookie.js';
import Jsonp from './jsonp.js';
class Yhd{
    constructor(){
        this.center = $('.center');
        this.b = $('#bb');
        this.exit = $('#exit');
        // 获取轮播图的元素
        this.oDiv = document.querySelector('.slider');
        this.oLi = document.querySelectorAll('.slider li');
        this.rightBtn = document.querySelector('.arrow-right');
        this.leftBtn = document.querySelector('.arrow-left');
        this.index = 0;
        this.lastIndex = 0;
        this.timer = null;
        // 调用方法：
        this.cookie();
        
        this.singleList();
        this.init();
        
        this.lunbo();
        this.autoPlay();

        //取出cookie里的值
        this.userinfo = Cookie.getCookie('userinfo');
        this.userinfo = JSON.parse(this.userinfo);
        this.userid = this.userinfo.userid;
        
        this.goShopCart();
    }
    cookie(){
        //验证cookie是否存在
        var userinfo = Cookie.getCookie('userinfo');
        if(!userinfo){
            confirm("请先登录哦!");
            return;
        }
        userinfo = JSON.parse(userinfo);
        if(userinfo.username){
            // 已登录
            this.center.classList.add('islogin');
            this.b.innerHTML = userinfo.username +'，';
        }
        this.exit.onclick = ()=>{
            if(confirm("确定要退出吗？")){
                //删除cookie
                Cookie.setCookie('userinfo','',-1);
                this.center.classList.remove('islogin');
            }
        }
    }
    singleList(){
        // 超级单品数据渲染
        Jsonp.jsonp('http://localhost/YiHaoDian/user/index.php','single',{psize:1,pagenum:9},(res)=>{
            if(res.stateCode == 200){
                // 超级单品数据追加
                let singleStr = `<li class="single_one">
                    <a href="javascript:;"> 
                        <img class="single_logo" src="images/single_img.png" alt="">
                        <div class="single_text">
                            <span class="sing_text_font">限时 限量 品质 超值</span>
                            <span class="single_text_line"></span> 
                            <h2>尽情嗨购</h2>  
                        </div>
                    </a>
                </li>`;
                let {pageData, pcount} = res.data;
                pageData.forEach(ele=>{
                    let {id, title, imgMain, price} = ele;
                    // 超级单品数据
                    singleStr += `<li>
                    <a href="javascript:;" class="superSingle_a" >
                        <div class="single_top">
                            <div class="s_bz"></div>
                            <img class="single_top_img" src="${imgMain}" alt="">
                        </div>
                        <div class="single_bottom">
                            <div class="s_title">${title}</div>
                            <div class="s_con">
                                <div class="s_num">
                                    <span class="s_num_unit">￥</span>
                                    <span class="s_num_act">${price}</span>
                                    <span class="s_num_underline">
                                        <span class="s_num_unit">￥</span>
                                        <span class="s_num_line">278</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                    </li>`;
                })
                // 把超级单品的li追加到ul里
                $('.singleGoods').innerHTML = singleStr;
            }
        })
    }
    
    init(size=1){
        // 请求数据获取甄选品质和懂你想要的数据
        Jsonp.jsonp('http://localhost/YiHaoDian/user/index.php','get',{psize:size,pagenum:12},(res)=>{
            if(res.stateCode == 200){
                // 甄选品质数据追加
                let qualityStr = `<a href="javascript:;" class="import_snacks">
                    <p class="import_tit live_import_tit">科技质感</p>
                    <p class="voucher_tit live_voucher_tit">部分领券满减</p>
                    <div class="buy_btn" style="border:1px solid rgba(114,191,37,0.50)!important;color:#72BF25!important;">立即购买</div>
                    <img src="images/like1.jpg" alt="">
                </a>`;
                // 懂你想要
                var underStr = '';
                let {pageData, pcount} = res.data;
                pageData.forEach(ele=>{
                    let {id, title, imgMain, price, num} = ele;
                    // 品质生活数据
                    qualityStr += `<a href="" class="bursting" style="border-right:1px solid #eee">
                        <p class="burting_font">${title}</p>
                        <p class="eat_money">￥<span>${price}</span></p>
                        <img src="${imgMain}" alt="">
                    </a>`;

                    // 懂你想要数据
                    underStr += `<li class="under_list_single" >
                     <div class="under_pro_pic" onclick="yhd.goDetail(${id})">
                         <img class="sin_img" data-id='${id}' src="${imgMain}" alt="">
                     </div>
                     <p class="single_tit" data-id='${id}' ><span>自营</span>${title}</p>
                     <p class="single_money">￥<span>${price}</span></p>
                     <div class="pro_tag">
                        <button class="add_btn" onclick="yhd.goCart(${id},${num},'${imgMain}')">加入购物车</button>
                     </div>
                 </li>`;
                })
                // 把甄选品质数据追加到页面
                $('.qua_right_con').innerHTML = qualityStr;
                // 把懂你想要数据追加到页面
                $('.like_goodsList').innerHTML = underStr;

                // 渲染分页
                let pageStr = `<li onclick="yhd.prev()">
                    <a href="javascript:;" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;
                var active = '';
                for(let i = 1; i <= pcount; i++){
                    // 当前点击那一页，样式加在那一页上
                    if(i == size) active='class="active"';
                    else active='';
                    pageStr += `<li ${active}><a href="javascript:;" onclick="yhd.init(${i})">${i}</a></li>`;
                }
                
                pageStr += `<li onclick="yhd.next()">
                    <a href="javascript:;" aria-label="Next">
                    <span aria-hidden="true" >&raquo;</span>
                    </a>
                </li>`;
                // 将分页追加到页面
                $('.pagination').innerHTML = pageStr;
            }
        });
    }


    // 轮播图功能
    lunbo(){
        // 显示第一张图片
        this.change();
        // 给右边添加点击事件
        this.rightBtn.onclick = ()=>{
            this.lastIndex = this.index;
            this.index++;
            // 判断
            if(this.index == this.oLi.length){
                this.index = 0;
            }
            this.change();
        }
        // 给左边添加点击事件
        this.leftBtn.onclick = ()=>{
            this.lastIndex = this.index;
            this.index--;
            // 判断
            if(this.index < 0){
                this.index = this.oLi.length - 1;
            }
            this.change();
        }
    }
    change(){
        // 显示当前图片，隐藏其他的
        this.oLi[this.lastIndex].classList.remove('current');
        this.oLi[this.index].classList.add('current');
        this.oLi[this.lastIndex].style.display = 'none';
        this.oLi[this.index].style.display = 'block';
    }
    // 自动播放
    autoPlay(){
        this.timer = setInterval(()=>{
            this.rightBtn.click();
        },2000)

        // 鼠标移入停止自动播放
        this.oDiv.onmouseenter = ()=>{
            clearInterval(this.timer);
        }
        // 鼠标离开继续
        this.oDiv.onmouseleave = ()=>{
            this.timer = setInterval(()=>{
                this.rightBtn.click();
            },2000)
        }
    }
    //点击跳转详情页
    goDetail(id){
        window.location.href = '../dist/detail.html?id='+id;
    }
    // 点击加入购物车
    goCart(id, num, src){
        Jsonp.jsonp('http://localhost/YiHaoDian/user/cart.php','go',{userid:this.userid,gid:id, gnum:num, gsrc:src},(res)=>{
            console.log(res);
            if(res.stateCode == 200){
                window.location.href = '../dist/carts.html';
            }
        })
    }
    // 点击下一页
    next(){
        this.inner = $('.active').children[0].innerHTML;
        if(this.inner == $('.pagination').children.length-2){
            return;
        }
        this.inner++;
        this.init(this.inner);
    }
    // 点击上一页
    prev(){
        this.inner = $('.active').children[0].innerHTML;
        if(this.inner == 1){
            return;
        }
        this.inner--;
        this.init(this.inner);
    }
    // 点击头部购物车按钮
    goShopCart(){
        this.cart = $('#cart');
        this.cart.addEventListener('click',()=>{
            window.location.href = '../dist/carts.html';
        })
    }
}
window.yhd = new Yhd();

   