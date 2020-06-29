<?php
    include("./config.php");
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    $name = $_POST['username'];
    $phone = $_POST['phone'];
    $pwd = $_POST['pwd'];

    $sql = "insert into user (user,phone,pwd) values ('$name','$phone','$pwd')";
    // echo $sql;

    $res = mysqli_query($link, $sql);
    if($res){
        //插入成功
        echo json_encode(array(
            // code是后端自定义，我们这里定义1成功，0失败
            "code" => 1,
            "msg" => "注册成功"
        ));
    }else{
        //插入失败
        echo json_encode(array(
            "code" => 0,
            "msg" => "网络错误，请重试"
        ));
    }
?>