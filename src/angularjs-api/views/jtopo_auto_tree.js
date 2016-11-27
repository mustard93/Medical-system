$(document).ready(function(){
       var canvas = document.getElementById('canvas');
       var stage = new JTopo.Stage(canvas);
       //显示工具栏
       showJTopoToobar(stage);
       var scene = new JTopo.Scene(stage);
       scene.alpha = 1;

       function addNode(text, color){
           var node = new JTopo.Node();
           node.setImage('./img/topo/'+ color +'.png', true);
           node.fontColor = '0,0,0';
           scene.add(node);

           node.mouseover(function(){
               this.text = text;
           });
           node.mouseout(function(){
               this.text = null;
           });
           return node;
       }

       function addLink(nodeA, nodeZ){
           var link = new JTopo.FlexionalLink(nodeA, nodeZ);
           link.strokeColor = '204,204,204';
           link.lineWidth = 1;
           scene.add(link);
           return link;
       }

       var rootNode = addNode('root', 'gray');

       var icons = ['green', 'blue', 'red1', 'red2'];
       for(var i=0; i<icons.length; i++){

           var node = addNode('second_' + i, icons[i]);
           addLink(rootNode, node);
           if(i == 0 || i == icons.length - 1){
               for(var j=0; j<4; j++){
                   var thirdNode = addNode('third_' + j, 'green');
                   addLink(node, thirdNode);

                   if(j == 3){
                       for(var k=0; k<4; k++){
                           var kNode = addNode('leaf_' + k, 'gray');
                           addLink(thirdNode, kNode);
                       }
                   }
               }
           }
       }

       // 树形布局
       scene.doLayout(JTopo.layout.TreeLayout('left', 30, 107));
   });
