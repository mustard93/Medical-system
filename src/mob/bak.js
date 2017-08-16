//初始化商品信息-es6 语法
function initGoodsInfo2(_data) {

    var tempdata = JSON.parse(_data);
if(tempdata.code !=200){
alert(tempdata.msg);
    return;
}

var data = tempdata.data;

console.log(">>>>>>>>>>>>>>>>",data[0]);


var goodsTitle=`
<h1>${data.logisticsCenterName}</h1>
                                 <h2>${data.OrderMedicalNo.name}质量信息</h2>
                                                                      `;

$('goods-title').innerHTML=goodsTitle;
var html=`
<div class="item">
<div class="goods-info-item">
<p class="lables">剂型／分类</p>
                         <p class="val">${data.OrderMedicalNo.dosageForms  || '暂无'}</p>
                                                                                     </div>
                                                                                       <div class="goods-info-item">
<p class="lables">规格／型号</p>
                         <p class="val">${data.OrderMedicalNo.specificationAndModelType  || '暂无'}</p>
                                                                                                   </div>
                                                                                                     </div>
                                                                                                       <div class="item">
<div class="goods-info-item">
<p class="lables">批号</p>
                      <p class="val">${data.OrderMedicalNo.productionBatch  || '暂无'}</p>
                                                                                      </div>
                                                                                        <div class="goods-info-item">
<p class="lables">灭菌批号</p>
                        <p class="val">${data.OrderMedicalNo.sterilizationBatchNumber  || '暂无'}</p>
                                                                                                 </div>
                                                                                                   </div>
                                                                                                     <div class="item">
<div class="goods-info-item">
<p class="lables">生产日期</p>
                        <p class="val">${ formatDate(data.OrderMedicalNo.productionDate,'yyyy-MM-dd')  || '暂无'}</p>
                                                                                                                 </div>
                                                                                                                   <div class="goods-info-item">
<p class="lables">有效期至</p>
                        <p class="val">${ formatDate(data.OrderMedicalNo.validTill,'yyyy-MM-dd')  || '暂无'}</p>
                                                                                                            </div>
                                                                                                              </div>
                                                                                                                <div class="item">
<div class="goods-info-item" style="width: 100%">
<p class="lables">生产企业</p>
                        <p class="val">${data.OrderMedicalNo.productEnterpriseName  || data.OrderMedicalNo.productEnterprise.name  || '暂无'}</p>
                                                                                                                                             </div>
                                                                                                                                               </div>
                                                                                                                                                 <div class="item">
<div class="goods-info-item" style="width: 100%">
<p class="lables">产品注册证号／备案凭证编号／批准文号</p>
                                      <p class="val">${data.OrderMedicalNo.medicalRegistryCode || '暂无' }</p>
                                                                                                          </div>
                                                                                                            </div>`;

$('goods-info').innerHTML=html;

}

//创建HTML内容-es6 语法
  function  ceateHtml2(arr) {
    var html='';
for(var i=0; i< arr.length; i++){
    var item=arr[i];
    var values= item.value;
if(values.length>1){
    html+=`<li class="">
    <div class="left">
    <div class="year">${item.year}</div>
    <div class="date">${item.date}</div>
    <div class="point2"></div>
    </div>
    <div class="right">
    <div class="title" style="visibility: hidden">${item.type}</div>
    </div>
    </li>`;
}
var className = values.length > 1 ?  'point3' :'point2';
for (var j=0 ; j<values.length; j++){
    var item2= values[j];

if(i==0){
    html+=`<li>
    <div class="left">
    <div class="year ${values.length > 1 ? 'hide':''}">${item.year}</div>
    <div class="date ${values.length > 1 ? 'hide':''}">${item.date}</div>
    <div class="${className}"></div>
    </div>
    <div class="right">
    <div class="title">${item.type}</div>
    <div class="item2"><div class="lables">客户名称：</div> <div class="val">${item2.supplierNameOrCustomerName}</div></div>
    <div class="item2"><div class="lables">采购数量：</div><div class="val">${item2.quantity}</div></div>
    <div class="item2"><div class="lables">收货时间：</div><div class="val">${formatDate(item2.receiveDate)}</div></div>
    <div class="item2"><div class="lables">出库时间：</div><div class="val">${formatDate(item2.inoutDate)}</div></div>
    </div>
    </li>`;

}else{
     html+=`<li>
     <div class="left">
     <div class="year ${values.length > 1 ? 'hide':''}">${item.year}</div>
     <div class="date ${values.length > 1 ? 'hide':''}">${item.date}</div>
     <div class="${className}"></div>
     </div>
     <div class="right">
     <div class="title">${item.type}</div>
     <div class="item2"><div class="lables">供应厂商：</div> <div class="val">${item2.supplierNameOrCustomerName}</div></div>
     <div class="item2"><div class="lables">采购数量：</div><div class="val">${item2.usedQuantity[orderMedicalNoUuid]}</div></div>
     <div class="item2"><div class="lables">收货时间：</div><div class="val">${formatDate(item2.inoutDate)}</div></div>
     </div>
     </li>`;
 }
}

}

return html;

}
