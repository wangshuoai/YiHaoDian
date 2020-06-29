<?php
    // 引入mysql文件
    include('./mysql.php');
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    // 接收前端请求的函数
    $fn = $_GET['callback'];
    $userid = $_GET['userid'];

    // 连表查询
    $sql = "select * from cart left join goods on cart.goodsid=goods.id where cart.userid=$userid";
    // echo $sql;
    $res = select($sql);
    $str = json_encode([
        'stateCode'=>200,
        'state'=>'success',
        'data'=>$res
    ]);
    echo $fn."($str)";
?>