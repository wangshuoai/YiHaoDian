<?php
    // 引入mysql文件
    include('./mysql.php');
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    // 接收前端请求的函数
    $fn = $_GET['callback'];
    // 接收参数
    $userid = $_GET['userid'];
    $gid = $_GET['gid'];
    $gnum = $_GET['gnum'];
    $gsrc = $_GET['gsrc'];
    // 查询表，如果表里有数据
    $sql = "select * from cart";
    if(select($sql)){
        // 判断是否有这个商品
        $sql = "select * from cart where goodsid=$gid";
        if(select1($sql)){
            // 如果有这个商品，直接修改当前商品的数量即可
            $sql = "update cart set goodsnum=goodsnum+'$gnum' where goodsid=$gid";
            // 判断执行结果
            $res = query($sql);
            if($res == 1){
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
        else{
            // 如果没有商品，就插入一条商品
            $sql = "insert into cart values(null, $userid, $gid, '$gsrc', $gnum)";
            // 判断执行结果
            $res = query($sql);
            if($res == 1){
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
    }else{
        // 如果表里没有数据，直接插入数据即可
        //插入的sql语句
        $sql = "insert into cart values(null, $userid, $gid, '$gsrc', $gnum)";
        // 判断执行结果
        $res = query($sql);
        if($res == 1){
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