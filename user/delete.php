<?php
    // 引入mysql文件
    include('./mysql.php');
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    // 接收前端传的函数
    $func = $_GET['func'];
    $func();

    // 删除选中的
    function del(){
        // 接收前端请求的函数
        $fn = $_GET['callback'];
        //接收前端传过来的参数
        $gid = $_GET['gid'];
        // 删除的sql语句
        $sql = "delete from cart where goodsid=".$gid;
        $res = query($sql);
        if($res==1){
            $str = json_encode([
            'stateCode'=>200,
            'state'=>'success',
            'data'=>[]
            ]);
            echo $fn."($str)";
        }else{
            $str = json_encode([
            'stateCode'=>204,
            'state'=>'faile',
            'data'=>[]
            ]);
            echo $fn."($str)";
        }
    }
    
    // 全部删除
    function delAll(){
        // 接收前端请求的回调函数
        $fn = $_GET['callback'];
        // 删除的sql语句
        $sql = "delete from cart";
        $res = query($sql);
        if($res==1){
            $str = json_encode([
            'stateCode'=>200,
            'state'=>'success',
            'data'=>[]
            ]);
            echo $fn."($str)";
        }else{
            $str = json_encode([
            'stateCode'=>204,
            'state'=>'faile',
            'data'=>[]
            ]);
            echo $fn."($str)";
        }
    }

    // 当前商品的数量改变，更新数据库里的对应的商品数量
    function update(){
        // 接收前端请求的函数
        $fn = $_GET['callback'];
        //接收前端传过来的参数
        $gid = $_GET['gid'];
        $gnum = $_GET['gnum'];
        // 拼接sql语句
        $sql = "update cart set goodsnum='$gnum' where goodsid=$gid";
        $res = query($sql);
        if($res==1){
            $str = json_encode([
              'stateCode'=>200,
              'state'=>'success',
              'data'=>[]
            ]);
            echo $fn."($str)";
        }else{
            $str = json_encode([
              'stateCode'=>204,
              'state'=>'faile',
              'data'=>[]
            ]);
            echo $fn."($str)";
        }
    }
?>