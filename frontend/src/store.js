import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {  productDetailsReducer, productsReducer,newReviewReducer,productReducer,newProductReducer,productReviewsReducer, reviewReducer,} from "./reducers/productReducer";
import {profileReducer, userReducer,allUsersReducer,userDetailsReducer} from "./reducers/userReducer";
import {cartReducer} from "./reducers/cartReducer";
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  user:userReducer,
  profile:profileReducer,
  cart:cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview:newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,
});
let initialState = {
  cartItems: localStorage.getItem("cartItems")?JSON.parse(localStorage.getItem("cartItems")):[],
  shippingInfo: localStorage.getItem("shippingInfo")?JSON.parse(localStorage.getItem("shippingInfo")):{},
};

const middleWare = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
