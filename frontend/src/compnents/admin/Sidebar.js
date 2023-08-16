import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import { MdDashboard} from "react-icons/md";
import { BiAddToQueue } from "react-icons/bi";
import { BsFillPeopleFill,BsTextLeft } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaArrowDown,FaArrowUp } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";


const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <MdDashboard /> Dashboard
        </p>
      </Link>
      <Link to="/admin/dashboard">
        <TreeView
          defaultCollapseIcon={<FaArrowUp />}
          defaultExpandIcon={<FaArrowDown />}
        >
          <TreeItem nodeId="1" label="Products">
            <Link to="/admin/products">
              <TreeItem nodeId="2" label="All" icon={<RiArrowUpDownFill />} />
            </Link>

            <Link to="/admin/product">
              <TreeItem nodeId="3" label="Create" icon={<BiAddToQueue />} />
            </Link>
          </TreeItem>
        </TreeView>
      </Link>
      <Link to="/admin/orders">
        <p>
          <AiOutlineUnorderedList />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <BsFillPeopleFill /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <BsTextLeft />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;