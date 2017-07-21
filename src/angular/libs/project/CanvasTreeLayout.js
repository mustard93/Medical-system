/**
基于JTopo组件

*/
/**
  *
   * @Description: 基于JTopo组件，显示树形节点，自动布局。从左往右（布局），子节点往下。
   * @author liumingquan
   * @date 2016年12月15日 下午4:32:59

   修改记录：
      @Description: 多个节点显示是，有重叠情况。优化为不重叠
   * @author liumingquan
   * @date 2017年7月20日
  */
define('CanvasTreeLayout',['JTopo'], function(JTopo){

  //自动树形布局
  function TreeLayout2(JTopo,dirtion, lineWidth2, lineHeight2,rootNodes,marginTop2,marginLeft2)
  {

    var lineWidth=lineWidth2||30, lineHeight=lineHeight2||30, marginTop=marginTop2||20,marginLeft=marginLeft2||20;

      return function (scene)
      {

        // 最大坐标，用于返回自适应的 宽高
          var maxXY={x:0,y:0};
          //start 定义内部方法
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
          /**
          *
           * @Description:   获取当前节点准备设置的XY轴。不允许重叠。根据当前节点获取下个节点
            @param {Object} curLocation={x:0,y:0},当前节点xy坐标
            @returns {Object} nextLocation1={x:0,y:0},下个节点xy坐标

           * @author liumingquan

           * @date 2017年7月20日
          */
          //用于判断，重叠
          var LocationRecord={
            locationMap:{},//"x_y":100_00
            _getKey:function(location){
                // key="xy"+location.x+"_"+location.y;
                var  key="y"+location.y;
                return key;
            },
            //是否该坐标已经存在。LocationRecord.isExistlocation(location);LocationRecord.setRecord(location);
            isExistlocation:function(location){
              var key=this._getKey(location);
              return this.locationMap[key]==true;
            },
            //记录坐标
            setRecord:function(location){
                var key=this._getKey(location);
                this.locationMap[key]=true;

            }
          }

          //递归设置位置
          /**
          nextLocation1 下一个坐标的位置
          @param {Object} curLocation={x:0,y:0},当前节点xy坐标
          @returns {Object} nextLocation1={x:0,y:0},下个节点xy坐标

          */
          /**
          *
           * @Description:  下一个坐标的位置
            @param {Array} childs 儿子节点列表
            @param {Node} rootNodes 节点列表
            @param {Object} nextLocation1={x:0,y:0},下个节点xy坐标
           * @author liumingquan
           * @date 2017年7月20日
          */
          function setXY(childs,rootNodes,nextLocation){
            //复制一份新的对象，方式递归方法，修改坐标影响当前坐标。
            var nextLocation1={x:nextLocation.x,y:nextLocation.y};

            if(!rootNodes||rootNodes.length==0)return;
            // //当前节点x坐标
            // var curNodeX=nextLocation1.x;
            //   //当前节点x坐标.
            // var curNodeY=nextLocation1.y; //y轴变化
                // var curNodeY=nextLocation1.y-(rootNodes.length-1)/2*addHeight2; //多个情况，居中对其
            // if(tmpY<0){
            //   tmpY=10;
            // }
            //垂直居中 ，让中间节点与父亲节点，同一水平线
            if(dirtion=="right-center"){
                var addHeight2=rootNodes[0].height+lineHeight;
                nextLocation1.y=nextLocation1.y-(rootNodes.length-1)/2*addHeight2; //多个情况，居中对其
            }
              //同级节点，x轴不编号
              var sameLevelNodeX=nextLocation1.x;
            for(var i=0;i<rootNodes.length;i++){
              var rootNode=rootNodes[i];
          
              // //标记已经设置过位置了，防止一直循环。
              // if(rootNode.key=="反审"){
              //   var tmp=1;
              // };
              //标记节点已经，出现在画布上，就不在设置坐标了
              if(rootNode.hasSetLocation)continue;
                rootNode.hasSetLocation=true;

                //不允许重叠，重叠则计算下一个可以用的坐标。
                // while(LocationRecord.isExistlocation(nextLocation1) ){
                //           nextLocation1.x=nextLocation1.x+lineWidth+rootNode.width;
                // }

                  //不允许重叠，重叠则计算下一个可以用的坐标。需要记录已经使用的坐标。
                LocationRecord.setRecord(nextLocation1);

                rootNode.setLocation(nextLocation1.x, nextLocation1.y);
                //记录最后一个节点的坐标，用于返回，画布自适应 宽高
                if(maxXY.x<nextLocation1.x)maxXY.x=nextLocation1.x;
                  if(maxXY.y<nextLocation1.y)maxXY.y=nextLocation1.y;
                maxXY=nextLocation1;
                //获取当前节点的儿子列表
               var tmpChilds=getNodeByParentKey(childs,rootNode.key);
               //设置下一个兄弟节点的Y坐标
               //儿子x变化。Y不变  rootNode.height
              nextLocation1.x=nextLocation1.x+lineWidth+rootNode.width;


              setXY(childs,tmpChilds,nextLocation1);


              //同级节点，Y增加。
              nextLocation1.y+=lineHeight+rootNode.height;
                  //同级节点，x轴不编号
              nextLocation1.x=sameLevelNodeX;
              //不允许重叠，重叠则计算下一个可以用的坐标。
              while(LocationRecord.isExistlocation(nextLocation1)){
                      nextLocation1.y+=lineHeight+rootNode.height;
              }

            }


          }//end setXY


          //end 定义内部方法

          if(!rootNodes||rootNodes.length==0){
            rootNodes= JTopo.layout.getRootNodes(scene.childs);
          }
              if(!rootNodes||rootNodes.length==0){
                rootNodes= getFirstNode(scene.childs);
            }
            //  scene.getCenterLocation()
            var location1 ={} ;


            //垂直居中 开始第1个
            if(dirtion=="right-center"){
              location1 = scene.getCenterLocation();
                location1.x=10;
            }else{ //默认情况，左上开始第1个
              location1.x=marginTop;
              location1.y=marginLeft;
            }

            setXY(scene.childs,rootNodes,location1);

            return maxXY;
      }
  }//TreeLayout2

        return {
            TreeLayout2:TreeLayout2
        };
});
