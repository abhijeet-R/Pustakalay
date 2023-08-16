import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Loader from "../layout/Loader/Loader"
import Product from "./Product";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useAlert} from "react-alert"

const Home = () => {

  const alert=useAlert()
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if(error){
      return alert.error(error)
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);
  return (
    <Fragment>
    {loading?(<Loader/>):(<Fragment>
      <MetaData title="Ecommerce" />
      <div className="banner">
        <p>Welcome to Ecommerce website</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href="#container">
          <buttton>
            scroll <CgMouse />
          </buttton>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        {products && products.map((product) => <Product product={product} />)}
      </div>
    </Fragment>
    )}
    </Fragment>
  );
};

export default Home;
