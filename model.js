var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
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
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
