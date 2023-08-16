import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import { AiFillCreditCard,AiFillCalendar } from "react-icons/ai";
import { BiKey } from "react-icons/bi";
// import axios from "axios";
import "./Payment.css";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = ({ history }) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  // const stripe = useStripe();
  // const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  // const paymentData = {
  //   amount: Math.round(orderInfo.totalPrice * 100),
  // };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    quantity:orderInfo.quantity,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
    user:user,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {

      order.paymentInfo = {
        id: user._id,
        status: "succeded",
      };

      dispatch(createOrder(order));

      history.push("/success");
      // if (!stripe || !elements) return;
      // const result = await stripe.confirmCardPayment(client_secret, {
      //   payment_method: {
      //     card: elements.getElement(CardNumberElement),
      //     billing_details: {
      //       name: user.name,
      //       email: user.email,
      //       address: {
      //         line1: shippingInfo.address,
      //         city: shippingInfo.city,
      //         state: shippingInfo.state,
      //         postal_code: shippingInfo.pinCode,
      //         country: shippingInfo.country,
      //       },
      //     },
      //   },
      // });

      // if (result.error) {
      //   payBtn.current.disabled = false;

      //   alert.error(result.error.message);
      // } else {
      //   if (result.paymentIntent.status === "succeeded") {
          // order.paymentInfo = {
          //   id: result.paymentIntent.id,
          //   status: result.paymentIntent.status,
          // };

      //     dispatch(createOrder(order));

      //     history.push("/success");
      //   } else {
      //     alert.error("There's some issue while processing payment ");
      //   }
      // }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <AiFillCreditCard />
            <input
                type="number"
                placeholder="Card Number"
                required
                className="paymentInput"
                size="12"
              />
          </div>
          <div>
            <AiFillCalendar />
            <input
                type="number"
                placeholder="Validity Date"
                required
                className="paymentInput"
                size="4"
              />
          </div>
          <div>
            <BiKey />
            <input
                type="number"
                placeholder="Key"
                required
                className="paymentInput"
                size="3"
              />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;