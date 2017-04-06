#Medical-service-system-web-API

搭建开发环境。
1.先安装最新版本nodejs，npm，gulp
2.下载按照项目需要的模块，只执行一次： npm-instal.bat
3.启动http server用于开发调试，项目对应表：
run-server-manage.bat -- 管理员平台
run-server-PG16-H.bat -- 医院SPD平台


complie-release-all.bat 执行编译所有项目，添加新项目需要在文件package.json
添加项目：
 "pg_projects":["manage","project-PG16-H"],

文件命名规范：
老版本不使用改名规则，后缀() ：_old_v版本号;
比如：left-side.html->left-side_old_v1.html

业务说明：
salesOrder（客户购需单）-》confirmOrder（订单）-》invoicesOrder（发货单）-》OutstockOrder（出库单）

PurchaseOrder（采购单）-




注释模版

代码注释规范

  package com.pangu.mss;
  /**
   *
  	* @Description: TODO(用一句话描述该文件做什么)
  	* @author liumingquan
  	* @date 2016年12月15日 下午4:32:59
   */
  public class HelloWorld {
  	/**
  	 *
  	* @Description: TODO(用一句话描述做什么)
  	* @method sayMsgToOther
  	* @param peopleA
  	* @param peopleB
  	* @param msg
  	* @return
  	* @author ecolouds-01
  	* @date 2016年12月15日 下午5:16:02

  	  修改记录：
  	   @Description: TODO(修改了什么)
  	* @author ecolouds-01
  	* @date 2016年12月15日 下午5:16:02

  	    关键步骤：
  	    //1.传如参数：人A，人B
  		//2.如果人B==null，则返回失败标准。
  		//3.A对B说。 该逻辑很复杂，或变化多则单独写成方法
  		//4.返回成功标志。
  	 */
  	public Boolean sayMsgToOther(Object peopleA,Object peopleB,String msg){
  		//1.传如参数：人A，人B

  		//2.如果人B==null，则返回失败标准。
  		if(peopleA==null){
  			return false;
  		}

  		//3.A对B说。 该逻辑很复杂，或变化多则单独写成方法
  		Boolean flag=say(peopleA,peopleB,msg);

  	    //4.返回成功标志。
  		return flag;
  	}


  	/**
  	 *
  	* @Description: TODO(用一句话描述做什么)
  	* @method say
  	* @param peopleA
  	* @param peopleB
  	* @param msg
  	* @return
  	* @author ecolouds-01
  	* @date 2016年12月15日 下午5:16:08

  	  修改记录：
  	   @Description: TODO(修改了什么)
  	* @author ecolouds-01
  	* @date 2016年12月15日 下午5:16:08

  	    关键步骤：
  	    //1.传如参数：人A，人B
  		//2.如果人B==null，则返回失败标准。
  		//3.A对B说。 该逻辑很复杂，或变化多则单独写成方法
  		//4.返回成功标志。
  	 */
  	public Boolean say(Object peopleA,Object peopleB,String msg){
  		System.out.println(peopleA+"对"+peopleB+"说:"+msg);
  		return true;
  	}

  }
