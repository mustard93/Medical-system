define('CanvasTreeLayout',['JTopo'], function(JTopo){




  //自动树形布局
  function TreeLayout2(JTopo,dirtion, lineWidth2, lineHeight2,rootNodes,marginTop2,marginLeft2)
  {

    var lineWidth=lineWidth2||30, lineHeight=lineHeight2||30, marginTop=marginTop2||20,marginLeft=marginLeft2||20;
      return function (scene)
      {

        //获取所有节点得平均高度和宽带
        function getAvgRect(a)
        {
            var b = 0,
                c = 0;
            return a.forEach(function (a)
                {
                    b += a.width,
                    c += a.height
                }),
            {
                    width: b / a.length,
                    height: c / a.length
                }
        }


        //找不到满足条件的节点数组时，取第1个数据来开始。
        function getFirstNode(childs){
          var nodes=[];
            for(var i=0;i<childs.length;i++){
              var e=childs[i];
              //只取一个
              if(e instanceof JTopo.Node){
                nodes.push(e);
                return nodes;
              }
            }

          return nodes;
        }
          //根据name返回node节点
          function getNodeByParentKey(childs,parentKey){
            var nodes=[];
            if(!parentKey)return nodes;
              for(var i=0;i<childs.length;i++){
                var e=childs[i];
                if(e instanceof JTopo.Node&&e.parentKey){
                  if(e.parentKey.indexOf(parentKey)>-1){
                      nodes.push(e);
                  }

                }
                // if(e instanceof JTopo.Node&&e.parentKey==parentKey){
                //   nodes.push(e);
                // }
              }
            return nodes;
          }
          //递归设置位置
          /**
          nextLocation1 下一个坐标的位置
          */
          function setXY(childs,rootNodes,nextLocation1){
            if(!rootNodes||rootNodes.length==0)return;


            //当前节点x坐标
            var curNodeX=nextLocation1.x;
              //当前节点x坐标.
            var curNodeY=nextLocation1.y; //y轴变化
                // var curNodeY=nextLocation1.y-(rootNodes.length-1)/2*addHeight2; //多个情况，居中对其
            // if(tmpY<0){
            //   tmpY=10;
            // }

            //默认居中
            if(dirtion=="right-center"){
                var addHeight2=rootNodes[0].height+lineHeight;
              curNodeY=nextLocation1.y-(rootNodes.length-1)/2*addHeight2; //多个情况，居中对其
            }else{
                curNodeY=nextLocation1.y; //y轴变化
            }


            for(var i=0;i<rootNodes.length;i++){
              var rootNode=rootNodes[i];
              //标记已经设置过位置了，防止一直循环。
              if(rootNode.key=="反审"){
                var tmp=1;
              };
              if(rootNode.hasSetLocation)continue;
                rootNode.hasSetLocation=true;
                // console.log("location1,name="+rootNode.key+",x="+curNodeX+",y="+curNodeY);
                // nextLocation1.y=tmpY;
                // if(dirtion=="right-center"){
                //   curNodeY=curNodeY-rootNode.height/2;
                // }
                rootNode.setLocation(curNodeX, curNodeY);

                //获取当前节点的儿子列表
               var tmpChilds=getNodeByParentKey(childs,rootNode.key);
               //设置下一个兄弟节点的Y坐标
               //儿子x变化。Y不变  rootNode.height
              nextLocation1.x=curNodeX+lineWidth+rootNode.width;
              nextLocation1.y=curNodeY;

              setXY(childs,tmpChilds,nextLocation1);


              curNodeY+=lineHeight+rootNode.height;
            }


          }//end setXY

          if(!rootNodes||rootNodes.length==0){
            rootNodes= JTopo.layout.getRootNodes(scene.childs);
          }
              if(!rootNodes||rootNodes.length==0){
                rootNodes= getFirstNode(scene.childs);
            }
            //  scene.getCenterLocation()
            var location1 ={} ;

            //默认居中
            if(dirtion=="right-center"){

              location1 = scene.getCenterLocation();
                location1.x=10;



            }else{


              location1.x=marginTop;
              location1.y=marginLeft;
            }

            setXY(scene.childs,rootNodes,location1);
      }
  }//TreeLayout2



        return {
            TreeLayout2:TreeLayout2
        };
});
