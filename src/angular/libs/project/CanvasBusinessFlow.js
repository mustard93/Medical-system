
/**
业务单流程图形展示
*/
define('CanvasBusinessFlow',['JTopo'], function(JTopo){

      var defaultOptions={

           spacingWidth:20,
           spacingHeight:80,
          baseImageUrl:"../images/canvasBusinessFlow/",//图片路径
          parentKeyName:"id",
            //defaultOptions.status.fillColor_ready
          showStatus:false,//true 表示显示节点运行状态
           status:{

             strokeColor_doing:"153,153,153",//连线箭头执行中
             strokeColor_done:"143,174,0",//连线箭头已完成

             fillColor_ready:"229,229,229",//节点未执行
              fillColor_doing:"229,229,229",//节点执行中
               fillColor_done:"143,174,0" ,//节点已完成
              fontColor_regject_done:"255,255,255", //节点(驳回状态，已作废)已完成 字体
              fillColor_regject_done:"153,153,153" //节点(驳回状态，已作废)已完成
           },
            data:null,
            //defaultOptions.scene.background
            scene:{
                background:'',

            },
            node:{  //defaultOptions.node.fontColor
              rejectNodefillColor: '153,153,153',//.node.rejectNodefillColor
              rejectNodeFontColor: '255,255,255',
              clickCallback:null,
              fontColor:'0,0,0',
              image:"../images/logo.png"

            },
            link:{  //defaultOptions.link.direction
              direction : 'horizontal',
              image:"../images/logo.png"
            }
        };
        function CanvasBusinessFlow(divId,option){
          if(option){
              this.options=$.extend(true,{},defaultOptions,option);
          }else{
              this.options=$.extend(true,{},defaultOptions);
          }

          var canvas = document.getElementById(divId);
          var stage = new JTopo.Stage(canvas);
          var scene = new JTopo.Scene(stage);
          // stage.wheelZoom = 1.2; // 设置鼠标缩放比例
          scene.background = this.options.scene.background;
          this.stage=stage;
          this.scene=scene;
          this.currentNode=null;
          this.data=null;
          this.workflowTaskData=null;
          if(this.options.data){
              this.addCanvasBusinessFlow(this.options.data);
          }
        };
      CanvasBusinessFlow.prototype={
          //根据name返回node节点
          getEventByKey:function(key){
            var scene = this.stage.childs[0];
            var that =this;

            var nodes = scene.childs.filter(function(e){
              return e instanceof JTopo.Node&&e.data[that.options.parentKeyName]==key;
            });
            if(nodes&&nodes.length>0)return nodes[0];

            return null;
          },
          getLinkByKey:function(name){
            var scene = this.stage.childs[0];

            var nodes = scene.childs.filter(function(e){
              return e instanceof JTopo.Link&&e.key==name;
            });
            if(nodes&&nodes.length>0)return nodes[0];

            return null;
          },
          //获取所有得连接线
          getAllLinks:function(){
            var scene = this.stage.childs[0];

            var nodes = scene.childs.filter(function(e){
              return e instanceof JTopo.Link;
            });
            if(nodes&&nodes.length>0)return nodes;

            return null;
          },
          reload:function(data){
              if(data){
                  this.data=data;
              }
              console.log("reload");
               this.scene.clear();
               this.addCanvasBusinessFlow(this.data);
          },

          //添加流程图定义数据，用于图形展示
          addCanvasBusinessFlow:function(data){
            if(!data)return;
            this.data=data;
            if(!data.events)return;
            // console.log("addCanvasBusinessFlow.data=");
            // console.log(data);

            //添加节点
            for(var i=0;i<data.events.length;i++){
               this.addEvent(data.events[i]);
            }
            //添加链接关系
            for(var i=0;i<data.events.length;i++){
               this.addLinkByEvent(data.events[i]);
            }

            var root=JTopo.layout.getRootNodes(this.scene.childs);
              // console.log("JTopo.layout.TreeLayout");
            // console.log(root);

              this.showWorkflowTaskDataLinks();

                 this.scene.doLayout(TreeLayout2(JTopo,'right', this.options.spacingWidth, this.options.spacingHeight));
                //  TreeLayout2(JTopo,dirtion, width, height2)
              //  this.scene.doLayout(JTopo.layout.TreeLayout('right', 25, 120));
                  // this.scene.doLayout(JTopo.layout.FlowLayout('right', 25, 120));
              //  var json=this.stage.toJson();
              //  console.log(json)


          },

          //显示连线演示根据执行节点状态
          showWorkflowTaskDataLinks:function(){
                var arr=this.getAllLinks();
                if(arr)for(var i=0;i<arr.length;i++){
                    var link=arr[i];
                      //判断nodeA 是完成状态。
                    if(link.nodeA&&link.nodeA.status=="完成"){
                      if(link.nodeZ){//nodeZ 是完成或者执行中
                          if(link.nodeZ.status=="完成"){
                              link.strokeColor=this.options.status.strokeColor_done;
                          }else   if(link.nodeZ.status=="执行中"){
                              link.strokeColor=this.options.status.strokeColor_doing;
                            }
                      }

                    }
                }
          },

          //添加2个节点得链接
         addLinkByEvent:function(event1){
           //有上级就添加链接
             var node =this.getEventByKey(event1[this.options.parentKeyName]);
             if(!node)return;
           if(event1.sourceRef){
               var nodeA=this.getEventByKey(event1.sourceRef);
               if(nodeA)this.addLink(nodeA,node);
           }
           if(event1.targetRef){
               var nodeZ=this.getEventByKey(event1.targetRef);
               if(nodeZ)this.addLink(node,nodeZ);
           }
            // console.log(node);
         },
            //添加2个节点得链接
           addLink:function(nodeA, nodeZ, dashedPattern){

             var key=nodeA.data[this.options.parentKeyName]+"-"+nodeZ.data[this.options.parentKeyName];
             //连线之添加一次
             if(this.getLinkByKey(key)){
               console.log(key);
               return;
              }
              var link = new JTopo.FlexionalLink(nodeA, nodeZ);
              // var direction="vertical";

               link.arrowsRadius = 15;
               link.key=key;
              link.nodeA=nodeA;
              link.nodeZ=nodeZ;
              nodeA.key=nodeA.data[this.options.parentKeyName];
              nodeZ.parentKey=nodeA.key;//多个父类时，记录最后一个，用于布局。
                // link.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
                //  node.fillColor=this.options.status.fillColor_done;
              link.direction = this.options.link.direction;
              // link.strokeColor =this.options.status.fillColor_done;
              link.strokeColor = '204,204,204';//连线之间的颜色
              link.lineWidth = 1;//线段的粗细
              link.dashedPattern = 2;
              this.scene.add(link);
              return link;
          },
          //添加工作流节点


          addNodeByEvent:function(event1){
            var node = new JTopo.Node(event1.name);
               node.data=event1;
            node.setSize(120, 44);  // 尺寸

            node.borderRadius = 4; // 圆角
            // node.borderWidth = 2; // 边框的宽度
            // node.borderColor = '255,255,255'; //边框颜色
            node.fillColor = '110, 110, 255'; // 填充颜色
            //   node.radius = 24; // 半径
            //   node.fillColor = '0,0, 255'; // 填充颜色
           node.textPosition = 'Bottom_Center'; // 文本位置
           node.text=event1.name;
            node.font='12px PingFangSC-Medium';
             node.fontColor = this.options.node.fontColor;

             //saleOrder_doing.png
             //提供图片后开放
             var imageName="icon-"+event1.moduleType;

            //调试使用 icon-salesOrder-active.png
            //  var imageName="icon-salesOrder";

             if(node.data.status=="完成"){
                  node.fontColor =this.options.status.strokeColor_done;
                  imageName+="-done";
             }else   if(node.data.status=="执行中"){
               node.fontColor =this.options.status.strokeColor_doing;

                 imageName+="-active"
             }else {
               node.fontColor =this.options.status.strokeColor_doing;
                 imageName+="-null"
             }



           node.setImage( this.options.baseImageUrl+imageName+".png", true);

              return node;
          },
           addEvent:function(event1){
            var node = this.addNodeByEvent(event1);

            if(this.options.showStatus){
              //  node.fillColor=this.options.status.fillColor_ready;
            }
            this.scene.add(node);

            //注入node点击回掉函数
            if(this.options.node.clickCallback){
                  var that=this;
                  //：click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel
                  node.addEventListener('dbclick', function(event){
                     that.currentNode = this;
                     that.options.node.clickCallback(event,that);
                 });
            }


            return node;
          } //end addEvent
        } //end CanvasBusinessFlow.prototype



        //自动树形布局
        function TreeLayout2(JTopo,dirtion, lineWidth2, lineHeight2)
        {

          var lineWidth=lineWidth2||30;
          var lineHeight=lineHeight2||30;

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



                //根据name返回node节点
                function getNodeByParentKey(childs,parentKey){
                  var nodes=[];
                  if(!parentKey)return nodes;
                    for(var i=0;i<childs.length;i++){
                      var e=childs[i];

                      if(e instanceof JTopo.Node&&e.parentKey==parentKey){
                        nodes.push(e);
                      }
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

                  for(var i=0;i<rootNodes.length;i++){
                    var rootNode=rootNodes[i];

                      // console.log("location1,name="+rootNode.key+",x="+curNodeX+",y="+curNodeY);
                      // nextLocation1.y=tmpY;
                      rootNode.setLocation(curNodeX, curNodeY);

                      //获取当前节点的儿子列表
                     var tmpChilds=getNodeByParentKey(childs,rootNode.key);
                     //设置下一个兄弟节点的Y坐标
                     //儿子x变化。Y不变  rootNode.height
                    nextLocation1.x=curNodeX+lineWidth+rootNode.width;
                    nextLocation1.y=curNodeY;              //
                    setXY(childs,tmpChilds,nextLocation1);


                    curNodeY+=lineHeight+rootNode.height;
                  }


                }//end setXY


                var rootNodes = JTopo.layout.getRootNodes(scene.childs);
                  //  scene.getCenterLocation()
                  var location1 ={} ;
                  location1.x=10;
                  location1.y=10;
                  setXY(scene.childs,rootNodes,location1);
            }
        }//TreeLayout2

        return CanvasBusinessFlow;
});
