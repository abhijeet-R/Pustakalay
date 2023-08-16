import React, { Fragment, useEffect,useState } from "react";
import Loader from "../layout/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { clearError, getProduct } from "../../actions/productAction";
import Product from "../home/Product";
import "./products.css";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination"
import { Slider, Typography } from "@mui/material";
import MetaData from "../layout/MetaData";

const Products = ({match}) => {
  const categories = [
    "Comic",
    "Fiction",
    "Historical",
    "Self Growth",
  ];
  const dispatch = useDispatch();
  const alert = useAlert();
  const keyword=match.params.keyword
  const [currentPage,setCurrentPage]=useState(1)
  const [price,setPrice]=useState([0,10000])
  const [category,setCategory]=useState("")
  const [ratings,setRatings]=useState(0)
  const { loading, error, products, productsCount ,resultPerPage,filterProductsCount} = useSelector(
    (state) => state.products
  );
  const setCurrentPageNo =(e)=>{
setCurrentPage(e)
  }
  const priceHandler=(event,newPrice)=>{
setPrice(newPrice)
  }
  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(getProduct(keyword,currentPage,price,category,ratings));
  }, [dispatch,keyword,currentPage,price,category,ratings,error,alert]);
  let count=filterProductsCount;
  return <Fragment>{loading ? <Loader /> : <Fragment>
  <MetaData title="PRODUCTS -- ECOMMERCE" />
    <h2 className="productsHeading">Products</h2>
    <div className="products">
    {products && products.map((product) => <Product product={product} />)}
    </div>
    <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
            value={price}
            onChange={priceHandler}
            valueLabelDisplay="auto"
            aria-labelledby="range-Slider"
            min={0}
            max={10000}></Slider>
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}>
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
    {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          

  </Fragment>}</Fragment>;
};

export default Products;
