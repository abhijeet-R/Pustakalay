const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchError = require("../middleware/catchError");
const ApiFeature = require("../utils/apiFeature");
const cloudinary = require("cloudinary");

exports.createProduct = catchError(async (req, res, next) => {

    // const result = await cloudinary.v2.uploader.upload(req.body.image, {
    //   folder: "avatars",
    //   width: 150,
    //   crop: "scale",
    // });
  //   const imagesLinks={
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   };

  // req.body.image = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    sucess: true,
    product,
  });
});
exports.getAllProducts = catchError(async (req, res, next) => {
  let resultPerPage = 8;
  let productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeature(Product.find(), req.query).search().filter().pagination(resultPerPage);
let products = await apiFeature.query;

const filteredApiFeature = new ApiFeature(Product.find(), req.query).search().filter()
let filteredProducts = await filteredApiFeature.query;
let filterProductsCount = filteredProducts.length;


  res.status(200).json({
    sucess: true,
    products,
    productsCount,
    resultPerPage,
    filterProductsCount,
  });
});

exports.getAdminProducts = catchError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.updateProduct = catchError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }

  // Images Start Here
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.image);
  // } else {
  //   images = req.body.image;
  // }

  // if (images !== undefined) {
  //   // Deleting Images From Cloudinary
  //   for (let i = 0; i < product.images.length; i++) {
  //     await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  //   }

  //   const imagesLinks = [];

  //   for (let i = 0; i < images.length; i++) {
  //     const result = await cloudinary.v2.uploader.upload(images[i], {
  //       folder: "products",
  //     });

  //     imagesLinks.push({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   }
  //   req.body.images = imagesLinks;
  // }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    sucess: true,
    product,
  });
});

exports.deleteProduct = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  await Product.deleteOne(product);

  res.status(200).json({
    sucess: true,
    message: "product deleted successfully",
  });
});

exports.getProductDetail = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  res.status(200).json({
    sucess: true,
    product,
  });
});

exports.createProductReview = catchError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numberofreviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.getAllReviews = catchError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteReview = catchError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() != req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings;
  if (reviews.length == 0) ratings = 0;
  else ratings = avg / reviews.length;
  console.log(ratings);
  const numberofreviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numberofreviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
  });
});
