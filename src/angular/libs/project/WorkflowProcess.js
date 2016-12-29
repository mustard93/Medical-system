define('WorkflowProcess',['JTopo'], function(JTopo){





      var defaultOptions={
          spacingWidth:80,
          spacingHeight:20,
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
        function WorkflowProcess(divId,option){
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
              this.addWorkflowProcess(this.options.data);
          }
        };
      WorkflowProcess.prototype={
          //根据name返回node节点
          getNodesByName:function(name){
            var scene = this.stage.childs[0];

            var nodes = scene.childs.filter(function(e){
              return e instanceof JTopo.Node&&e.key==name;
            });
            if(nodes&&nodes.length>0)return nodes[0];

            return null;
          },
          //根据name返回node节点
          getNodesByEventType:function(name){
            var scene = this.stage.childs[0];

            var nodes = scene.childs.filter(function(e){
              return e instanceof JTopo.Node&&e.data.type==name;
            });

            return nodes;
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
               this.addWorkflowProcess(this.data);
          },

          //添加流程图定义数据，用于图形展示
          addWorkflowProcess:function(data){
            if(!data)return;
            this.data=data;
            if(!data.events)return;
            console.log("addWorkflowProcess.data=");
            console.log(data);

            //添加节点
            for(var i=0;i<data.events.length;i++){
               this.addEvent(data.events[i]);
            }
            //添加链接关系
            for(var i=0;i<data.events.length;i++){
               this.addLinkByEvent(data.events[i]);
            }

            var root=JTopo.layout.getRootNodes(this.scene.childs);
              console.log("JTopo.layout.TreeLayout");
            console.log(root);
            var that=this;


            require(['CanvasTreeLayout'],function(CanvasTreeLayout){
                var rootNodes=that.getNodesByEventType("StartEvent");
                that.scene.doLayout(CanvasTreeLayout.TreeLayout2(JTopo,'right-center', that.options.spacingWidth, that.options.spacingHeight,rootNodes));

            });


                //  TreeLayout2(JTopo,dirtion, width, height2)
              //  this.scene.doLayout(JTopo.layout.TreeLayout('right', 25, 120));
                  // this.scene.doLayout(JTopo.layout.FlowLayout('right', 25, 120));
              //  var json=this.stage.toJson();
              //  console.log(json)
          },
          //添加工作流运行节点，用于显示各个状态。
          addWorkflowTaskData:function(data){
            if(!data)return;
            this.workflowTaskData=data;
            console.log("addWorkflowTaskData.data=");
            console.log(data);
            this.showWorkflowTaskData();

          },
          //显示连线演示根据执行节点状态
          showWorkflowTaskDataLinks:function(){
                var arr=this.getAllLinks();
                if(arr)for(var i=0;i<arr.length;i++){
                    var link=arr[i];
                      //判断nodeA 是完成状态。
                    if(link.nodeA&&link.nodeA.status=="done"){
                      if(link.nodeZ){//nodeZ 是完成或者执行中
                          if(link.nodeZ.status=="done"){
                              link.strokeColor=this.options.status.strokeColor_done;
                          }else   if(link.nodeZ.status=="doing"){
                              link.strokeColor=this.options.status.strokeColor_doing;
                            }
                      }

                    }
                }
          },

          //显示节点状态
          showWorkflowTaskData:function(){
            if(!  this.workflowTaskData)return;


                {

                  //当前正在执行节点
                  var arr=this.workflowTaskData.currentEvent;
                  //已经执行过的节点
                  if(arr)for(var i=0;i<arr.length;i++){
                      var event=arr[i];
                      var node =this.getNodesByName(event.name);
                      if(node){
                          node.fillColor=this.options.status.fillColor_doing;
                          node.status="doing";
                      }

                  }
                }

            {

              var arr=this.workflowTaskData.eventRecords;
              //已经执行过的节点

              if(arr)for(var i=0;i<arr.length;i++){
                  var eventRecord=arr[i];
                  var node =this.getNodesByName(eventRecord.event.name);
                  if(node){

                    if(node.data.conditionType=="驳回"){
                      node.fontColor = this.options.status.fontColor_regject_done; // 填充颜色
                      node.fillColor =this.options.status.fillColor_regject_done; // 填充颜色
                    }else{
                      node.fillColor=this.options.status.fillColor_done;

                    }
                    node.status="done";


                  }

              }
            }


              //显示链接线
              this.showWorkflowTaskDataLinks();
          },
          //添加2个节点得链接
         addLinkByEvent:function(event1){
           //有上级就添加链接
             var node =this.getNodesByName(event1.name);
             if(!node)return;
           if(event1.sourceRef){
               var nodeA=this.getNodesByName(event1.sourceRef);
               if(nodeA)this.addLink(nodeA,node);
           }
           if(event1.targetRef){
               var nodeZ=this.getNodesByName(event1.targetRef);
               if(nodeZ)this.addLink(node,nodeZ);
           }
            console.log(node);
         },
            //添加2个节点得链接
           addLink:function(nodeA, nodeZ, dashedPattern){

             var key=nodeA.text+"-"+nodeZ.text;
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

          addStartNode:function(key){
            node = new JTopo.Node(key);
              node.setSize(120, 120);  // 尺寸
                // node.fontColor = event1.fontColor||this.options.node.fontColor;
            node.borderRadius = 4; // 圆角
            // node.borderWidth = 1; // 边框的宽度
            // node.borderColor = '154,154,154'; //边框颜色
            node.fillColor = '143,174,0'; // 填充颜色
              return node;

          //   node = new JTopo.CircleNode(key);
          //   node.radius = 24; // 半径
          //   node.fillColor = '0,0, 255'; // 填充颜色
          // //  node.textPosition = 'Middle_Center'; // 文本位置
          // return node;
          },
          addNode:function(key){
            node = new JTopo.Node(key);
              node.setSize(120, 44);  // 尺寸
            // node.fontColor = event1.fontColor||this.options.node.fontColor;
            node.borderRadius = 4; // 圆角
            // node.borderWidth = 2; // 边框的宽度
            // node.borderColor = '255,255,255'; //边框颜色
            node.fillColor = '110, 110, 255'; // 填充颜色
              return node;
          },
          addEndNode:function(key){
            // node = new JTopo.CircleNode(key);
            // node.radius = 24; // 半径
            // node.fillColor = '0,0,255'; // 填充颜色
            //   return node;
            node = new JTopo.Node(key);
            node.setSize(120, 120);  // 尺寸
            // node.fontColor = event1.fontColor||this.options.node.fontColor;
            node.borderRadius = 4; // 圆角
            // node.borderWidth = 2; // 边框的宽度
            // node.borderColor = '255,255,255'; //边框颜色
            node.fillColor = '238,187,45'; // 填充颜色
              return node;

          },

          addNodeByEvent:function(event1){
            var node=null;
            // var name=event1.name+"-"+event1.status;
              var name=event1.name;
            switch (event1.type) {
              case "StartEvent":
                  node=this.addStartNode(name);
                break;
                case "EndEvent":
                      node=this.addEndNode(name);
                  break;
              default:
                    node=this.addNode(name);
            }



            node.key=event1.name;
            return node;
          },
           addEvent:function(event1){
            var node = this.addNodeByEvent(event1);

            node.textPosition = 'Middle_Center';//设置字体出现的位置居中
            node.font='12px PingFangSC-Medium';

            node.data=event1;

            if(this.options.showStatus){
                node.fillColor=this.options.status.fillColor_ready;
            }


            // switch (event1.conditionType) {
            //   case "驳回":
            //             node.fontColor = this.options.node.rejectNodeFontColor; // 填充颜色
            //             node.fillColor =this.options.node.rejectNodefillColor; // 填充颜色
            //
            //     break;
            //   default:
            //     ;
            // }

            // node.alpha = 0.7; //透明度
            // node.setImage(event1.image||this.options.node.image, true);
            // node.setSize(10, 10);


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


            // node.mouseover(function(){
            //     // this.text = event1.name;
            // });
            // node.mouseout(function(){
            //     // this.text = event1.name;
            //     // this.text = null;
            // });


            return node;
          } //end addEvent
        } //end WorkflowProcess.prototype





          // function TreeLayout2(JTopo,dirtion, lineWidth2, lineHeight2)
          // {
          //
          //   var lineHeight=lineWidth2||100;
          //   var lineWidth=lineHeight2||100;
          //
          //     return function (scene)
          //     {
          //
          //       //获取所有节点得平均高度和宽带
          //       function getAvgRect(a)
          //       {
          //           var b = 0,
          //               c = 0;
          //           return a.forEach(function (a)
          //               {
          //                   b += a.width,
          //                   c += a.height
          //               }),
          //           {
          //                   width: b / a.length,
          //                   height: c / a.length
          //               }
          //       }
          //
          //
          //
          //         //根据name返回node节点
          //         function getNodeByParentKey(childs,parentKey){
          //           var nodes=[];
          //             for(var i=0;i<childs.length;i++){
          //               var e=childs[i];
          //               e.textPosition = 'Middle_Center';//设置字体出现的位置居中
          //               e.font='12px PingFangSC-Medium';
          //               if(e instanceof JTopo.Node&&e.parentKey==parentKey){
          //                 nodes.push(e);
          //               }
          //             }
          //           return nodes;
          //         }
          //         //递归设置位置
          //         function setXY(childs,rootNodes,nextLocation1){
          //           if(!rootNodes||rootNodes.length==0)return;
          //           var tmpX=nextLocation1.x;
          //
          //           var addHeight2=rootNodes[0].height+lineHeight;
          //           var addWidth2=lineWidth+rootNodes[0].width;
          //           var tmpY=nextLocation1.y-(rootNodes.length-1)/2*addHeight2; //y轴变化
          //           // if(tmpY<0){
          //           //   tmpY=10;
          //           // }
          //           nextLocation1.x=tmpX+lineWidth;
          //
          //           for(var i=0;i<rootNodes.length;i++){
          //             var rootNode=rootNodes[i];
          //
          //               console.log("location1,name="+rootNode.key+",x="+tmpX+",y="+tmpY);
          //               // nextLocation1.y=tmpY;
          //               rootNode.setLocation(tmpX, tmpY);
          //
          //             var tmpY=tmpY+addHeight2;
          //
          //               var tmpChilds=getNodeByParentKey(childs,rootNode.key);
          //
          //             nextLocation1.x=tmpX+addWidth2;
          //
          //             setXY(childs,tmpChilds,nextLocation1);
          //           }
          //
          //         }//end setXY
          //
          //
          //         var rootNodes = JTopo.layout.getRootNodes(scene.childs);
          //
          //           var location1 = scene.getCenterLocation();
          //           location1.x=10;
          //           setXY(scene.childs,rootNodes,location1);
          //     }
          // }//TreeLayout2

        return WorkflowProcess;
});
