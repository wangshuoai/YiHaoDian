<?php
    include("./config.php");
    header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
    // 接收前端发送的数据
    $name = $_POST['username'];
    $pwd = $_POST['pwd'];
    //查询数据库里是否存在用户名和密码是否一致的用户
    $sql = "select * from user where user='$name' and pwd='$pwd'";
    $res = mysqli_query($link,$sql);
    //判断资源的长度大于0
    if(mysqli_num_rows($res)>0){
        $str = mysqli_fetch_assoc($res);
        //登录成功
        echo json_encode(array(
            // code是后端自定义，我们这里定义1成功，0失败
            "code" => 1,
            "msg" => $str
        ));
    }else{
        //登录失败
        echo json_encode(array(
            "code" => 0,
            "msg" => "用户名或密码错误"
        ));
    }

?>