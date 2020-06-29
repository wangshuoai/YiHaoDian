<?php
    // 引入mysql文件
    include('./mysql.php');
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求

    // 获取jsonp请求的函数
    $fn = $_GET['callback'];
    $id = $_GET['id'];

    $sql = "select * from goods where id=$id";
    $res = select1($sql);
    $str = json_encode([
        'stateCode'=>200,
        'state'=>'success',
        'data'=>$res
    ]);
    echo $fn."($str)";   
?>