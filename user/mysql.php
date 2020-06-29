<?php 
    // 连接数据库
    function con(){
        $link = mysqli_connect('127.0.0.1', 'root', 'root', 'test');
        //设置编码
        mysqli_query($link,'set names utf8');
        if(!$link)die("连接失败了");
        return $link;
    }

    // 非查询的封装
    function query($sql){
        $link  = con();
        $res = mysqli_query($link, $sql);
        if($res){
            return 1;
        }else{
            return 2;
        }
    }

    // 查询的封装
    function select($sql){
        $link  = con();
        $res = mysqli_query($link, $sql);
        // 遍历结果集合
        $arr = [];
        while($str = mysqli_fetch_assoc($res)){
            $arr[] = $str;
        }
        return $arr;
    }
    // 查询单条数据
    function select1($sql){
        $link  = con();
        $res = mysqli_query($link, $sql);
        // 遍历结果集合
        $str = mysqli_fetch_assoc($res);
        return $str;
    }
?>