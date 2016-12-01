define(['JTopo'], function(JTopo){

      var defaultOptions={
            //defaultOptions.status.fillColor_ready
          showStatus:false,//true 表示显示节点运行状态
           status:{
             fillColor_ready:"90,228,230",//未执行
              fillColor_doing:"240,239,44",//执行中
               fillColor_done:"80,230,30" //已完成
           },
            data:null,
            //defaultOptions.scene.background
            scene:{
                background:''
            },

            node:{  //defaultOptions.node.fontColor
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
          getEventByName:function(name){
            var scene = this.stage.childs[0];

            var nodes = scene.childs.filter(function(e){
              return e instanceof JTopo.Node&&e.key==name;
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
               this.scene.doLayout(JTopo.layout.TreeLayout('right', 80, 120));
              //  var json=this.stage.toJson();
              //  console.log(json);
          },
          //添加工作流运行节点，用于显示各个状态。
          addWorkflowTaskData:function(data){
            if(!data)return;
            this.workflowTaskData=data;

            console.log("addWorkflowTaskData.data=");
            console.log(data);

            this.showWorkflowTaskData();
          },
          //显示节点状态
          showWorkflowTaskData(){
            if(!  this.workflowTaskData)return;
            var arr=this.workflowTaskData.eventRecords;
            //已经执行过的节点

            if(arr)for(var i=0;i<arr.length;i++){
                var eventRecord=arr[i];
                var node =this.getEventByName(eventRecord.event.name);
                if(node){
                    node.fillColor=this.options.status.fillColor_done;
                }

            }
              //当前正在执行节点

              var arr=this.workflowTaskData.currentEvent;
              //已经执行过的节点
              if(arr)for(var i=0;i<arr.length;i++){
                  var event=arr[i];
                  var node =this.getEventByName(event.name);
                  if(node){
                      node.fillColor=this.options.status.fillColor_doing;
                  }

              }


          },
          //添加2个节点得链接
         addLinkByEvent:function(event1){
           //有上级就添加链接
             var node =this.getEventByName(event1.name);
             if(!node)return;
           if(event1.sourceRef){
               var nodeA=this.getEventByName(event1.sourceRef);
               if(nodeA)this.addLink(nodeA,node);
           }
           if(event1.targetRef){
               var nodeZ=this.getEventByName(event1.targetRef);
               if(nodeZ)this.addLink(node,nodeZ);
           }
         },
            //添加2个节点得链接
           addLink:function(nodeA, nodeZ){

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

                // link.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
              link.direction = this.options.link.direction;
              link.strokeColor = '204,204,204';
              link.lineWidth = 3;
              this.scene.add(link);
              return link;
          },
          //添加工作流节点

          addStartNode:function(key){
            node = new JTopo.CircleNode(key);
            node.radius = 24; // 半径
            node.fillColor = '0, 0, 255'; // 填充颜色
          //  node.textPosition = 'Middle_Center'; // 文本位置
          return node;
          },
          addNode:function(key){
            node = new JTopo.Node(key);
              node.setSize(60, 60);  // 尺寸
                // node.fontColor = event1.fontColor||this.options.node.fontColor;
            node.borderRadius = 5; // 圆角
            node.borderWidth = 2; // 边框的宽度
            node.borderColor = '255,255,255'; //边框颜色
            node.fillColor = '110, 110, 255'; // 填充颜色
              return node;
          },
          addEndNode:function(key){
            node = new JTopo.CircleNode(key);
            node.radius = 24; // 半径
            node.fillColor = '0, 0, 255'; // 填充颜色
              return node;
          },

          addNodeByEvent:function(event1){
            var node=null;
            var name=event1.name+"-"+event1.status;
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
            switch (event1.conditionType) {
              case "驳回":
                        node.fontColor = '255,0, 0'; // 填充颜色
                break;

              default:
                ;
            }


            node.key=event1.name;
            return node;
          },
           addEvent:function(event1){
            var node = this.addNodeByEvent(event1);
            node.data=event1;

            if(this.options.showStatus){
                node.fillColor=this.options.status.fillColor_ready;
            }

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
        return WorkflowProcess;
});
