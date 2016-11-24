'use strict'


    console.log("js12312on");
var canvas = document.getElementById('myCanvas');
          var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
          var scene = new JTopo.Scene(stage); // 创建一个场景对象
          //
          // var node = new JTopo.Node("Hello111");    // 创建一个节点
          // node.setLocation(300,200);    // 设置节点坐标
          // scene.add(node); // 放入到场景中



        var nodeFrom = new JTopo.Node("1from");
        nodeFrom.setLocation(200,200);
        scene.add(nodeFrom);

        var nodeTo = new JTopo.Node("To");
        nodeTo.setLocation(300,200);
        scene.add(nodeTo);

        var link = new JTopo.Link(nodeFrom, nodeTo); // 增加连线
        scene.add(link);

           var json=stage.toJson();

          console.log("json");
  // $(function () {
  //
  // });
