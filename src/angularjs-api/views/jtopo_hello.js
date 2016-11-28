'use strict'


    console.log("js12312on");
var canvas = document.getElementById('myCanvas');
          var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
          var scene = new JTopo.Scene(stage); // 创建一个场景对象


           scene.background = 'http://image.evget.com/images/article/2014/pixe.jpg';
          //
          var node = new JTopo.Node("Hello111");    // 创建一个节点
          node.setLocation(1300,1200);    // 设置节点坐标
          scene.add(node); // 放入到场景中


          var animates = [
                        {rotate: 2*Math.PI},
                        {scaleX: 2},
                        {height:130, y: 180},
                        {alpha: 0.1},
                        {alpha: 0.2, y: 90},
                        {rotate: -4*Math.PI, scaleX: 2.5, scaleY: 2.5},
                        {x: 300, y: 400, width: 10, height: 10, rotate: 2*Math.PI}
                    ];

          for(var i=0; i<animates.length; i++){
              var node = new JTopo.Node("node");
              node.setCenterLocation(100 + i * 90, 300);
              var color = JTopo.util.randomColor();
              node.fillColor = color; // 颜色
              scene.add(node);

              JTopo.Animate.stepByStep(node, animates[i], 3000, true).start();
          }
        var nodeFrom = new JTopo.Node("1from");
        nodeFrom.setLocation(200,200);
          nodeFrom.setImage('http://cdn-img.easyicon.net/png/12065/1206563.gif', true);
        scene.add(nodeFrom);
        //
        var nodeTo = new JTopo.Node("To");
        nodeTo.setLocation(800,300);
        scene.add(nodeTo);
        //
        var link = new JTopo.Link(nodeFrom, nodeTo); // 增加连线
        //
        //
        scene.add(link);

            var json=stage.toJson();

          console.log(json);
  // $(function () {
  //
  // });
