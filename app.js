var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//const shortid = require('shortid');


var fs = require('fs');
var path = require('path');
require('dotenv/config');
var multer = require('multer');

//var val=1000;
var d = new Date();
var day = d.getDate();
var month=d.getMonth()+1;
var year=d.getFullYear();
var str=day+'/'+month+'/'+year;

var imgModel = require('./model');
mongoose.connect('mongodb://localhost:27017/Forms');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('./public'));



// Set EJS as templating engine
app.set("view engine", "ejs");


app.get('/', (req,res) => {
  res.render('app');
})

// Uploading the image
app.post('/sign_up', upload.single('image'), (req, res, next) => {
	 obj = {
    date:str,
    name: req.body.name,
    email: req.body.email,
    ticket: req.body.ticket,
    phone: req.body.phone,
    Regtype: req.body.type,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png/jpg'
		}
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
      // item.save();
      var phone1 = obj.phone;
             imgModel.find({phone: phone1 }, (err,docs) => {
              if(err) console.log(err);
              else
              res.render('register',{docs: docs});
            });
		}
	});
});


app.get('/admin', (req,res) => {
  res.render('admin');
})



app.post('/login', (req,res) => {
  var username = req.body.name;
  var password = req.body.pass;
  var collection = db.collection("admins");
  collection.findOne({username: username,password: password}, (err,user) => {
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    if(!user){
      return res.status(404).send();
    }

    return res.redirect('/adminview');
  });
});

app.get('/newroute', (req, res) => {
  imgModel.find({Regtype : "Self"}).count({}, function(err, a){

   if(err){
     console.log(err);
   }
   else{
     imgModel.find({Regtype : "Group"}).count({}, function(err, b)
     {
       if(err){
         console.log(err);
       }
       else{
        imgModel.find({Regtype : "Coporate"}).count({}, function(err, c)
     {
       if(err){
         console.log(err);
       }
       else{
        imgModel.find({Regtype : "Others"}).count({}, function(err, d)
     {
       if(err){
         console.log(err);
       }
       else{
        console.log("The count is:"+a+b+c+d);
        res.render('Piechart', {

            self: a,
            group: b,
            coporate: c,
            others: d

        });
      }

     }
    );
      }

     }
    );
      }

     }
    );
  }

});
});


app.get('/adminview', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('AdminView', { items: items });
        }
    });
  });


app.get('/details/:regId', (req,res) => {
  imgModel.find({_id: req.params.regId }, (err,docs) => {
    if(err) console.log(err);
    else res.render('single',{users: docs})
  });
});

app.listen('3000' || process.env.PORT, err => {
	if (err)
		throw err
	console.log('Server started')
})
