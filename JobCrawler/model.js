var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/scraper',{useNewUrlParser:true});
mongoose.connection.on('error',function(){
    console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

var ListingsSchema=new mongoose.Schema({
    companyname:String,
    title:String,
    link:String,
    field:Array,
    career:String,
    levOfEdu:String,
    area:String,
    deadline:String,
    from:String
});

module.exports=mongoose.model('Listings',ListingsSchema);