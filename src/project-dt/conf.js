var conf={
  indexPage: "index.html#/main.html", //默认打开的地址
  applyBindUrl:"user1.html#/reg/bind_done.html",//
  //stopIntervalNotice:false,//false|true.是否停止监听消息
  //serverPath:"http://120.76.232.188:8080/dt/",    //外部地址，系统api调用接口地址
  // serverPath:"http://192.168.0.249:60456/dt/",    //系统api调用接口地址
  // serverPath:"http://192.168.0.131:8090/dt/",    //系统api调用接口地址
    serverPath:"http://192.168.0.211:8080/dt/",    //系统api调用接口地址
  //   serverPath:"http://192.168.0.139:8888/dt/",    //系统api调用接口地址
  //  serverPath:"http://localhost:8082/dt/",    //系统api调用接口地址
  // serverPath:"http://118.113.146.159:33333/dt/",
  // serverPath:"http://predep.pangu16.com:8080/dt/",
  // serverPath:"",    //系统api调用接口地址


    // serverPath:"http://127.0.0.1:8080/dt/",

    ver:"V1.01.01.5.6_Alpha",
    useTab:true
};
//模块对应关系列表-用于tab页 tabName 的显示；
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
    },{
        moduleType:'productEnterprise',
        moduleName:'生成企业管理'
    },
    {
        moduleType:'announcement',
        moduleName:'通知公告'
    } ,
    {
        moduleType:'requestPurchaseOrderDetail',
        moduleName:'生成企业管理'
    }
];

/**
 *
 * autocomplete:自动选择
 * select: 下拉选择
 * dateRange:时间区间
 * date:时间
 * typeChoice:分类选择
 * input:文本输入
 * inputRange:文本区间
 * checkmore:多选
 *
 *
 */
var queryParams=[
    {
        name:'商品通用名',
        modelName:'name',
        type:'autocomplete',
        url:'rest/authen/customerAddress/query.json?isFilterDefault=true'
    },
    {
        name:'商品编号',
        modelName:'salesDepartmentId',
        type:'select',
        url:'rest/authen/department/queryForSelectOption'
    },
    {
        name:'原商品编号',
        modelName:'saleUserId',
        type:'input',
        url:'rest/authen/organizationAndUser/queryForSelectOption?departmentId={{filterObject.salesDepartmentId}}&isReturnNullOfNoCondition=true'
    },
    {
        name:'批号',
        modelName:'batchCode',
        type:'input',
        url:''
    },
    {
        name:'灭菌批号',
        modelName:'batchCode2',
        type:'input',
        url:''
    },
    {
        name:'生产日期',
        modelName:['updateAtBeg','updateAtEnd'],
        type:'dateRange',
        url:''
    },
    {
        name:'有效期至',
        modelName:['updateAtBeg1','updateAtEnd1'],
        type:'dateRange',
        url:''
    },
    {
        name:'剩余有效期天数',
        modelName:['updateAtBeg','updateAtEnd'],
        type:'inputRange',
        url:''
    },
    {
        name:'可用量',
        modelName:'canUseCount',
        type:'inputRange',
        url:''
    },
    {
        name:'仓库',
        modelName:'canUseCount',
        type:'checkmore',
        url:''
    }
];




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
