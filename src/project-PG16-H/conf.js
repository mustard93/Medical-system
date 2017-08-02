var conf={
  indexPage: "main.html", //默认打开的地址
  applyBindUrl:"user1.html#/reg/bind_done.html",
  //stopIntervalNotice:false,//false|true.是否停止监听消息
  // serverPath:"http://192.168.0.102:8080/spd/",    //外部地址，系统api调用接口地址
  serverPath:"http://192.168.0.211:8080/spd/",    //系统api调用接口地址
  // serverPath:"http://192.168.0.249:60456/spd/",    //系统api调用接口地址
  // serverPath:"http://192.168.0.249:60456/spd/",
  // serverPath:"http://localhost:3000/src/project-PG16-H/",    //系统api调用接口地址
  // serverPath:"http://118.113.146.159:33333/spd/",
  //  serverPath:"http://localhost:8080/spd/",    //系统api调用接口地址
  ver:"1.0.0",
  useTab:false
};

var moduleMap=[
    {
        moduleType:'salesOrder',
        moduleName:'购需单'
    },
    {
        moduleType:'confirmOrder',
        moduleName:'销售单'
    },
    {
        moduleType:'lendOrder',
        moduleName:'借出单'
    },
    {
        moduleType:'returnOrder',
        moduleName:'归还单'
    },
    {
        moduleType:'invoicesOrder',
        moduleName:'发货单'
    },
    {
        moduleType:'salesChangeOrder',
        moduleName:'销售换货单'
    },
    {
        moduleType:'saleReturnOrder',
        moduleName:'销售退货单'
    },
    {
        moduleType:'requestPurchaseOrder',
        moduleName:'请购单'
    },
    {
        moduleType:'purchaseOrder',
        moduleName:'采购单'
    },
    {
        moduleType:'purchaseVoucher',
        moduleName:'采购凭证'
    },
    {
        moduleType:'arrivalNoticeOrder',
        moduleName:'来货通知单'
    },
    {
        moduleType:'purchaseReturnOrder',
        moduleName:'采购退货单'
    },
    {
        moduleType:'saleOutstockOrder',
        moduleName:'销售出库单'
    },
    {
        moduleType:'saleOutstockOrder',
        moduleName:'销售出库单'
    },
    {
        moduleType:'otherOutstockOrder',
        moduleName:'其他出库单'
    },
    {
        moduleType:'otherInstockOrder',
        moduleName:'其他入库单'
    },
    {
        moduleType:'lossOrder',
        moduleName:'报损单'
    },
    {
        moduleType:'overOrder',
        moduleName:'报溢单'
    }
];