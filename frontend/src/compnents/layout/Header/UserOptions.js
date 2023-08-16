import React, { Fragment } from "react";
import "./header.css"
import {SpeedDial,SpeedDialAction} from "@material-ui/lab"
import { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import { MdDashboard } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { BiExit } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import {useHistory} from "react-router-dom"
import {useAlert} from "react-alert"
import {logout} from "../../../actions/userAction"
import {useSelector,useDispatch} from "react-redux"
import { AiOutlineShoppingCart } from "react-icons/ai";

const UserOptions = ({user}) => {
  const [open, setOpen] = useState(false);
  const history=useHistory();
  const alert=useAlert();
  const dispatch=useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const options=[
    {icon:<AiOutlineUnorderedList/>,name:"Orders",func:orders},
    {icon:<BsFillPersonFill/>,name:"Profile",func:account},
    {icon: (<AiOutlineShoppingCart style={{ color: cartItems.length > 0 ? "#6F61C0" : "unset" }}/>),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    {icon:<BiExit/>,name:"Logout",func:logoutUser},
  ]
  if(user.role==="admin"){
    options.unshift((    {icon:<MdDashboard/>,name:"Dashboard",func:dashboard}))
  }

  function dashboard() {
    history.push("/admin/dashboard");
  }

  function orders() {
    history.push("/orders");
  }
  function account() {
    history.push("/account");
  }
  function cart() {
    history.push("/cart");
  }
  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully");
  }


  return (
    <Fragment>
     <Backdrop open={open} style={{ zIndex: "10" }} />
       <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }>
           {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
       </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
