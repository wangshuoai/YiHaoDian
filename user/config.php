<?php
    // 跟数据库服务器建立连接
    // localhost主机名; root用户名; 密码为空(如果设置列密码，第三个参数就写上密码)
    $link = mysqli_connect('127.0.0.1', 'root', 'root', 'test');
    //设置编码
    mysqli_query($link,'set names utf8');
    if(!$link)die("连接失败了");
    return $link;

    // // 这两句是用来设置编码，复制过来就行
    // mysql_query("set charset 'utf8'");
    // mysql_query("set character set 'utf8'");
?>