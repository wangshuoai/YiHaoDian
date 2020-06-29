import $ from './lib.js';
import Ajax from './promise-ajax.js';
import Cookie from './cookie.js';
import Jsonp from './jsonp.js';
class List{
    constructor(){
        this.size = 1;
        window.onload = ()=>{
            this.init();
            this.search();
            this.goCart(); // 直接点击上方购物车图标
            this.goBackIndex();  // 点击logo直接返回首页
        }
        window.onscroll = this.onscroll.bind(this);
    }
    init(size=1){
        // this.data = data;
        // console.log(data);
        // 渲染列表页数据，暂时用首页数据表
        Jsonp.jsonp('http://localhost/YiHaoDian/user/index.php','aa',{psize:size,pagenum:12},(res)=>{
            // console.log(this.data);
            this.pagenum = 12;
            this.pcount = res.data.pcount;
            // this.pageData =  res.data.pageData;
            // var data = this.data || this.pageData;
            let {pageData, pcount} = res.data;
            var mzlist = '';
            pageData.forEach(ele=>{
                let {id, title, imgMain, price} = ele;
                mzlist += `<li onclick="list.goDetail(${id})">
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
                                    <span class="s_num_line">300</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
                </li>`;
            })
            // 把超级单品的li追加到ul里
            $('.mzGoods').innerHTML += mzlist;
        })
    }
    // 绑定滚动事件
    onscroll(){
        //获取最后一个商品距离body的高度
        var contentTop = document.querySelectorAll('.mzGoods')[document.querySelectorAll('.mzGoods').length - 1].offsetTop;
        // console.log(contentTop);
        var scrollTop = this.getScrollTop();
        var clientTop = this.getClientTop().h;
        if(contentTop < (scrollTop + clientTop)){
           if(this.size == this.pcount) return;
            this.size++; 
            // this.get('http://localhost/YiHaoDian/user/lazyload.php', (res)=> {
            this.init(this.size);
            // })
        }
    }
    // 获取滚动条的高度
    getScrollTop(){
        return window.pageYOffset || document.body.scrollTop;
    }
    // 获取页面可视区高度
    getClientTop(){
        return {
            h: window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight,
            w: window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
        }
    }
    // get请求
    get(url, cb) {
        let xhr = new XMLHttpRequest();
        // 2打开请求资源
        // xhr.open('get', './01-get.php');  // 第一个参数是请求的方式,第二个是请求地址
        xhr.open('get', url);
        // 3 发送请求
        xhr.send();
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            // 存在并且调用
            cb && cb(xhr.response);
          }
        }
    }
    //进入详情页
    goDetail(id){
        window.location.href = '../dist/detail.html?id='+id;
    }
    goCart(){
        this.cart = $('#cart');
        this.cart.addEventListener('click',()=>{
            window.location.href = '../dist/carts.html';
        })
    }

    // 搜索筛选商品
    search(size=1){
        var searchInput = $('#searchInput');
        searchInput.addEventListener('keydown',(e)=>{
            this.searchVal = $('#searchInput').value;
            var e = e || window.event;
            if(e.keyCode == 13){
                Jsonp.jsonp('http://localhost/YiHaoDian/user/list.php','search',{psize:size,searchInfo:this.searchVal},(res)=>{
                    $('.mzGoods').innerHTML = '';
                    var searchList = '';
                    res.data.forEach(ele=>{
                        let {id, title, imgMain, price} = ele;
                        searchList += `<li onclick="list.goDetail(${id})">
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
                                            <span class="s_num_line">300</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                        </li>`;
                    })
                    // 把超级单品的li追加到ul里
                    $('.mzGoods').innerHTML = searchList;
                    window.onscroll = null;
                })
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
window.list = new List();