<?php
    // 引入mysql文件
    include('./mysql.php');
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    // 获取jsonp请求的函数
    $fn = $_GET['callback'];
    // 接收当前页码数
    $pageSize = $_GET['psize'];
    // 接收前端传过来的想要显示的条数
    $pagenum = $_GET['pagenum'];
    // 设置每页显示的条数
    $num = $pagenum;
    // 获取总的数据
    $sql1 = 'select count(*) cou from goods';
    $res = select($sql1);
    // 获取总的数据条数
    $count = $res[0]['cou'];
    // echo $pageSize;
    // 计算总页数
    $pageCount = ceil($count/$num);
    // 计算起始位置
    $start = ($pageSize - 1) * $num;
   
    // 获取数据的函数
    $sql = "select * from goods order by id limit $start,$num";
    $res = select($sql);
    // 重新构造数据
    $res = ['pageData'=>$res, 'pcount'=>$pageCount];
    $str = json_encode([
        'stateCode'=>200,
        'state'=>'success',
        'data'=>$res
    ]);
    echo $fn."($str)";   
    
?>