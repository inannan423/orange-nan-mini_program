// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
    env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
  })

// 云函数入口函数
exports.main = async (event, context) => {
    const db=cloud.database();
    let count=await db.collection('MarketList').count()
    count=count.total
    let all=[]
    for(let i=0;i<count;i+=100){
        let list =await db.collection('MarketList').skip(i).get()
        all=all.concat(list.data)
    }
    return all;
}