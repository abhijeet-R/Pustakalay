const Order =require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchError = require("../middleware/catchError");

exports.newOrder = catchError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;
    const order=await Order.create({shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id})
    res.status(201).json({
        success:true,
        order,
    })
}) 

exports.getSingleOrder=catchError(async (req,res,next)=>{
 const order=await Order.findById(req.params.id).populate("user","name email");
 if(!order){
    return next(new ErrorHandler("Order not found",404))
 }
 res.status(200).json({
    success:true,
    order,
})
})

exports.myOrder=catchError(async (req,res,next)=>{
    const orders=await Order.find({user:req.user._id})
    
    res.status(200).json({
       success:true,
       orders,
   })
   })

   exports.getAllOrder=catchError(async (req,res,next)=>{
    const orders=await Order.find()
    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })
    res.status(200).json({
       success:true,
       totalAmount,
       orders,
   })
   })

   exports.updateOrder=catchError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found",404))
     }
     if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("you have already delivered this order"),400)
     }
     if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
      }
     order.orderStatus=req.body.status;
     if(order.orderStatus==="Delivered"){
        order.orderDeliveredAt=Date.now();
     }
     await order.save({validator:false})
    res.status(200).json({
       success:true
   })
   })

   async function updateStock(id,quantity){
       const product=Product.findById(id);
       product.stock-=quantity;
       await product.save()
   }

   exports.deleteOrder=catchError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found",404))
     }
    order.deleteOne();
    res.status(200).json({
       success:true,
   })
   })