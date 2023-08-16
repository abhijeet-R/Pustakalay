const app = require("./app");
const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database");

process.on("uncaughtException",(err)=>{
    console.log(err.message);
    console.log("shutting down server")
    process.exit(1);
})

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }
connectDatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`serveris listening on port ${process.env.PORT}`);
})

process.on("unhandledRejection",(err)=>{
    console.log(err)
    console.log("shutting down server")
    server.close(()=>{
        process.exit(1);
    })

})
