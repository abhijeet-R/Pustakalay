const ErrorHandler= require("../utils/errorhandler");

module.exports=(err,req,res,next)=>{
    err.statuscode=err.statuscode||500;
    err.message=err.message||"Internal server error";
    
    if(err.name==="CastError"){
        const message=`resource not found ${err.path}`;
        err=new ErrorHandler(message,400)
    }
    if(err.code===11000){
        const message=`Duplicate ${object.keys(err.keyvalue)} Entered`;
        err=new ErrorHandler(message,400)
    }
    if(err.name==="TokenExpiredError"){
        const message=`Json Web Token is Expired, try again`;
        err=new ErrorHandler(message,400)
    }
    res.status(err.statuscode).json({
        success:false,
        error:err.stack
    });
}