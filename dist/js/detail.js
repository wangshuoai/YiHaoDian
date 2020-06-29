import $ from './lib.js';
import Cookie from './cookie.js';
import Jsonp from './jsonp.js';
class Detail{
    constructor(){
        this.init();
        window.onload = ()=>{
            // 放大镜：获取元素
            this.shopping = $('#shopping');
            this.box = $('#box');
            this.mainImg = $('#mainImg');
            this.zoomSpan = $('#zoomSpan');
            this.imgList = $('#imgList').children;
            this.priceList = document.querySelectorAll('#priceList li');
            this.bigBox = $("#bigBox");
            this.bigImg = $('#bigImg');
            this.addBtn = $('.addBtn');
            this.reduceBtn = $('.reduceBtn');
            this.numInput = $('#numInput');
            this.num = Number(this.numInput.value);
            this.addCartBtn = $('#addCartBtn');

            //取出cookie里的值
            this.userinfo = Cookie.getCookie('userinfo');
            this.userinfo = JSON.parse(this.userinfo);
            this.userid = this.userinfo.userid;
            
            
            this.zoom();  // 放大镜
            this.changeEvent();  // 切换
            this.changeNum();  // 数量变化


            this.goBackIndex();  // 点击logo直接返回首页
        }
    }
    init(){
        // 拿到首页传过来的id
        var search = window.location.search;
        search = search.split('=');
        this.did = search[1];
        //通过jsonp请求数据
        var imgMain = '';
        var imgMin = '';
        var detailDes = '';
        Jsonp.jsonp('http://localhost/YiHaoDian/user/detail.php','get',{id:this.did},(res)=>{ 
            // 商品规格数据渲染
            var spec = JSON.parse(res.data.spec);
            var specStr = '';
            spec.forEach((ele)=>{
                specStr += `<li>${ele}</li>`;
            })
            // 详细信息追加
            detailDes += `<div class="left" id="left">
            <div class="girlImg" id="box">
                <img id="mainImg" src="${res.data.imgMain}">
                <span id="zoomSpan"></span>
            </div>
            <ol id="imgList" class="imgList">
                <li><img src="${res.data.imgMain}"></li>
                <li><img src="${res.data.img1}"></li>
                <li><img src="${res.data.img2}"></li>
                <li><img src="${res.data.img3}"></li>
            </ol>
            </div>
            <div class="right">
                <h3>${res.data.title}</h3>
                <div id="price" class="price">价格：<em>￥${res.data.price}</em> 元</div>
                <div id="youhuiquan" class="youhuiquan">优惠券：<span>${res.data.sale}</span></div>
                <div id="cuxiao" class="cuxiao">促销：<span>跨自营/店铺满减</span>立即参加</div>
                <ul id="priceList" class="priceList">
                    <span>选择颜色：</span>
                    ${specStr}
                </ul>
                <div id="changeNum" class="changeNum">
                    <span>选择数量：</span>
                    <input type="text" id="numInput" value="${res.data.num}">
                    <button class="addBtn" type="button">+</button>
                    <button class="reduceBtn" type="button" disabled>-</button>
                </div>
                <button id="addCartBtn" class="addCartBtn" type="button" onclick="detail.addCart()">加入购物车</button>
            </div>
            <div id="bigBox" class="bigBox"><img src="${res.data.imgMain}" id="bigImg" alt=""></div>`;
            $("#shopping").innerHTML = detailDes;
        })
    }
    zoom(){
        this.box.onmouseenter = () => {
            this.toggle('block');
        }
        this.box.onmouseleave = () => {
            this.toggle('none');
        }
        // 这里函数里并没有操作box，希望this仍然指向外层，所以用箭头函数
        this.box.onmousemove = e => {
            e = e || window.event;
            this.move(e);
        }
    }
    toggle(display) {
        // toggle 切换的意思
        // zoomSpan和bigBox的显示隐藏问题
        this.zoomSpan.style.display = display;
        this.bigBox.style.display = display;
    }
    move(e){
        // 鼠标距离浏览器边缘距离减去盒子到边缘的距离得到鼠标到盒子边缘的坐标
        var left = e.pageX - this.box.offsetLeft - this.shopping.offsetLeft - this.zoomSpan.offsetWidth / 2;
        var top = e.pageY - this.box.offsetTop - this.shopping.offsetTop - this.zoomSpan.offsetHeight / 2;
        // 限定范围
        if (left <= 0) left = 0;
        if (top <= 0) top = 0;
        if (left > this.box.clientWidth - this.zoomSpan.offsetWidth) left = this.box.clientWidth - this.zoomSpan.offsetWidth;
        if (top > this.box.clientHeight - this.zoomSpan.offsetHeight) top = this.box.clientHeight - this.zoomSpan.offsetHeight;
        this.zoomSpan.style.left = left + 'px';
        this.zoomSpan.style.top = top + 'px';
        // 大图片的坐标是span坐标的-2倍
        this.bigImg.style.left = -2 * left + 'px';
        this.bigImg.style.top = -2 * top + 'px';
    }
    changeEvent(){
        var _this = this;
       // 点击不同的规格来进行选项切换
       Array.from(this.priceList).forEach((price, index) => {
            price.onclick = function(){
                _this.toggleImg(index);
            }
        })
        // 鼠标移入小图也要切换
        Array.from(this.imgList).forEach((img, index) => {
            img.onmouseenter = function(){
                _this.toggleImg(index);
            }
        })
    }
    toggleImg(index){
        // 切换图片
        for(var i = 0; i < this.priceList.length; i++){
            this.priceList[i].classList.remove('ac');
            this.imgList[i].classList.remove('ac');
        }
        this.priceList[index].classList.add('ac');
        this.imgList[index].classList.add('ac');
        // 主图和放大镜的图片都要跟着变化
        this.mainImg.src = this.imgList[index].children[0].src;
        this.bigImg.src = this.imgList[index].children[0].src;
        // console.log(this.mainImg.src);
        
    }
    changeNum(){
        // 改变商品数量
        this.addBtn.onclick = ()=>{
            this.num++;
            // 只要加了，就可以减，所以减的按钮就取消禁用
            this.reduceBtn.disabled = false;
            this.numInput.value = this.num;
        }
        this.reduceBtn.onclick = ()=>{
            this.num--;
            if(this.num < 1){
                this.num = 1;
                this.reduceBtn.disabled = true;  // 减号禁用
            }
            this.numInput.value = this.num;
        } 
    }
    addCart(){
        // 加入购物车
        Jsonp.jsonp('http://localhost/YiHaoDian/user/cart.php','go',{userid:this.userid,gid:this.did, gnum:this.num, gsrc:this.mainImg.src},(res)=>{
            console.log(res);
            if(res.stateCode == 200){
                window.location.href = '../dist/carts.html';
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
window.detail = new Detail();