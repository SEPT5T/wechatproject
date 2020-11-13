// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  loction:'',
  getid:'',
  choseID:''
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
   await db.collection('user').doc(event.choseID).update({
    // data 传入需要局部更新的数据
    data: {
      ['photo.'+event.loction+'.0.judgeget']:true,
      ['photo.'+event.locotion+'.0.get_id']:event.getid   
        },
        success:function(res){
          console.log("res",res)
          return res
        }
  })
   
}