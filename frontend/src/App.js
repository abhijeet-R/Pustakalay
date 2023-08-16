import React, { useEffect } from "react";
import "./App.css";
import Header from "./compnents/layout/Header/header";
import Footer from "./compnents/layout/footer/footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import webFont from "webfontloader";
import Home from "./compnents/home/Home";
import About from "./compnents/layout/About/About"
import Contact from "./compnents/layout/About/Contact"
import ProductDetails from "./compnents/product/productDetails";
import Products from "./compnents/product/Products"
import Search from "./compnents/product/Search"
import Login from "./compnents/User/LoginSignUp"
import Profile from "./compnents/User/Profile"
import store from "./store"
import {loadUser} from "./actions/userAction"
import UserOptions from "./compnents/layout/Header/UserOptions"
import { useSelector } from "react-redux";
import ProtectedRoute from "./compnents/route/ProtectedRoute"
import UpdateProfile from "./compnents/User/UpdateProfile";
import UpdatePassword from "./compnents/User/UpdatePassword"
import Cart from "./compnents/cart/Cart"
import Shipping from "./compnents/cart/Shipping"
import ConfirmOrder from "./compnents/cart/ConfirmOrder"
import Payment from "./compnents/cart/Payment"
import OrderSuccess from "./compnents/cart/OrderSuccess";
import MyOrders from "./compnents/Order/MyOrders";
import OrderDetails from "./compnents/Order/OrderDetails";
import Dashboard from "./compnents/admin/Dashboard"
import ProductList from "./compnents/admin/ProductList"
import NewProduct from "./compnents/admin/NewProduct"
import UpdateProduct from "./compnents/admin/UpdateProduct.js"
import OrderList from "./compnents/admin/OrderList.js";
import ProcessOrder from "./compnents/admin/ProcessOrder";
import UsersList from "./compnents/admin/UsersList";
import UpdateUser from "./compnents/admin/UpdateUser"
import ProductReviews from "./compnents/admin/ProductReviews";
import NotFound from "./compnents/layout/Not Found/NotFound";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // const [stripeApiKey, setStripeApiKey] = useState("")

  // async function getStripeApiKey() {
  //   const { data } = await axios.get("/api/v1/stripeapikey");
  //   setStripeApiKey(data.stripeApiKey);
  // }

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid sans", "chilanka"],
      },
    });
    store.dispatch(loadUser())

    // getStripeApiKey();
  }, []);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user}/>}
      
      {/* {stripeApiKey && ( */}
        {/* <Elements stripe={loadStripe(stripeApiKey)}> */}
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        {/* </Elements> */}
      {/* )} */}

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />
        <Route exact path="/search" component={Search} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
        <ProtectedRoute exact path="/password/update" component={UpdatePassword} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/shipping" component={Shipping} />
        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/products"
          component={ProductList}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/product"
          component={NewProduct}
        />
        <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />
         <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
        />
        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
        />
<ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />

        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />

        <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        />
        <Route path="/" component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
