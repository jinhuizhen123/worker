var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/zz1809";
var ObjectId=require('mongodb').ObjectId;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post('/register',(req,res)=>{
    mongodb.connect(db_str,(err,database)=>{
      database.collection('user',(err,coll)=>{
          coll.find({username:req.body.username}).toArray((err,data)=>{
           if(data.length>0){
             res.send('2')
             database.close()
           }else{
            coll.insert(req.body,()=>{
              res.send('1')
              database.close()	
            })
           }
        })
        })
      })
    })
//登录
router.post('/login',(req,res)=>{
       mongodb.connect(db_str,(err,database)=>{
         database.collection('user',(err,coll)=>{
            coll.find(req.body).toArray((err,data)=>{
             if(data.length>0){
               req.session.name=data[0].username;
               res.send('1')
               database.close()
             }else{
               res.send('2')
               database.close()
             }
           })
         })
      })
})
//账单
router.post('/billList',(req,res)=>{
      mongodb.connect(db_str,(err,database)=>{
        database.collection('billList',(err,coll)=>{
          coll.insert(req.body,()=>{
            res.send("1")
            database.close()
          })
        })
      })
})
//删除
router.get('/billList',(req,res)=>{
  var id=ObjectId(req.query.id);
  console.log(id)
	mongodb.connect(db_str,(err,database)=>{
		database.collection('billList',(err,coll)=>{
			coll.remove({_id:id},()=>{
           res.send("0")
				database.close()
			})
		})
	})
})
//修改
router.post('/billListUpdate',(req,res)=>{
  var id=ObjectId(req.body.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('billList',(err,coll)=>{
			coll.update({_id:id},{$set:{shopper:req.body.shopper,crash:req.body.crash,cost:req.body.cost}},(err,data)=>{
        res.send("0")
				database.close()
			})
		})
  })
})
//搜索
router.post('/search',(req,res)=>{
  res.send("0")
  database.close()
})
module.exports = router;
