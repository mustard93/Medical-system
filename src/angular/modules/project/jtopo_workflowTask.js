define(['JTopo'], function(JTopo){
　　
      function newStage(divId,data){
        var canvas = document.getElementById(divId);
        var stage = new JTopo.Stage(canvas);
        var scene = new JTopo.Scene(stage);
        return stage;
      }


　　　　return {
　　　　　　newStage : newStage //创建画布对象
　　　　};
});
