var conf={
  //stopIntervalNotice:false,//false|true.是否停止监听消息
  //serverPath:"http://120.76.232.188:8080/dt/",    //外部地址，系统api调用接口地址
  // serverPath:"http://192.168.0.211:8080/dt/",    //系统api调用接口地址
  // serverPath:"http://localhost:8080/dt/",    //系统api调用接口地址
     serverPath:"http://118.113.147.113:33333/dt/",
  //serverPath:"",    //系统api调用接口地址
  ver:"1.0.0"
};

var TestAuthor={
  //管理员
  "A_13600000000":["订单中心","采购中心","发货单","出入库中心","验单中心","帐号审核","销售主管","采购主管","客服主管"],
  //销售主管
  "A_13600000100":["订单中心","发货单","帐号审核","销售主管"],
  //客服主管
  "A_13600000101":["订单中心","发货单","帐号审核","客服主管"],
  //采购主管
  "A_13600000102":["采购中心","帐号审核","采购主管"],
  //库管主管
  "A_13600000103":["出入库中心","帐号审核","库管主管"],
  //验收主管
  "A_13600000104":["验单中心","帐号审核","验收主管"],
  //总经理
  "13600000105":["帐号审核","总经理"]
};
