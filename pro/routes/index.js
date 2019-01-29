var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/zz1809";
var ObjectId=require('mongodb').ObjectId;
var async=require('async')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',name:req.session.name});
});
//登录
router.get('/login',(req,res)=>{
  res.render('login',{})
})
//注册
router.get('/register',(req,res)=>{
  res.render('register',{})
})
//账单管理
router.get('/billList',(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection('billList',(err,coll)=>{			
//			页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
//			每页展示的条数
			var size=3;
//			总页数
			var page=0;
//			总条数
			var totals=0;	
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{	
						totals=data.length;
						page=Math.ceil(totals/size)
//						上一页下一页
						pageNo=pageNo<1?1:pageNo;
						pageNo=pageNo>page?page:pageNo;	
					})
					callback(null,'')
				},
				function(callback){
					coll.find({}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
						callback(null,data)
					})	
				}
			],function(err,data){
//				data  [ '',data ]
				res.render('billList',{data:data[1],pageNo:pageNo,page:page,totals:totals})
				database.close()
			})
		})
	})
})
//详情
router.get('/detail',(req,res)=>{
	console.log(req.query)
	var id=ObjectId(req.query.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('billList',(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				res.render('detail',{detail:data})
				database.close()
			})
		})
	})
})
//删除
router.get('/billList',(req,res)=>{
  res.render('billList',{})
})
//修改
router.get('/billListUpdate',(req,res)=>{
	var id=ObjectId(req.query.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('billList',(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				res.render('billListUpdate',{billListUpdate:data})
				database.close()
			})
		})
	})
})
//搜索
router.get('/search',(req,res)=>{
	console.log(req.query.keywords)
	//var id=ObjectId(req.query.id);
	mongodb.connect(db_str,(err,database)=>{
		database.collection('billList',(err,coll)=>{
			coll.find({shopper:req.query.keywords}).toArray((err,data)=>{
				res.render('search',{search:data})
				database.close()
			})
		})
	})
})
module.exports = router;
