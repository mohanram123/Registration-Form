var mongoose = require('mongoose');
const shortid = require('shortid');

var imageSchema = new mongoose.Schema({
  id:{
    type: String,
    default: shortid.generate
  },
  date:{
    type:String,
  },
  name: String,

	email: {
    type:String,
    unique: true,
    required: true
  },
  ticket: Number,
  phone: {
    type: Number,
    unique: true,
    required: true
  },
  Regtype: {
		type: String
	},
	img:
	{
		data: Buffer,
		contentType: String
	}
},{
  timestamps: true
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('users', imageSchema);
