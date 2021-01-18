const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/restaurant_db', {
    useCreateIndex:true,
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connection established sucessfully");
}).catch((err)=>{
    console.log(`Database connection error`,err);
})
    
