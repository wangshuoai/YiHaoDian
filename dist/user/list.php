<?php
    // 引入mysql文件
    include('./mysql.php');
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    // 获取jsonp请求的函数
    $fn = $_GET['callback'];
    // 接收前端传过来的参数
    $searchInfo = $_GET['searchInfo'];
    // 获取数据的函数
    $sql = "select * from goods where title like '%$searchInfo%'";
    $res = select($sql);
    $str = json_encode([
        'stateCode'=>200,
        'state'=>'success',
        'data'=>$res
    ]);
    echo $fn."($str)";  
?>