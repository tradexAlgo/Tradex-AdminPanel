import React, { Fragment } from "react";
import LeftMenu from "../LeftMenu/LeftMenu";
import TopMenu from "../TopMenu/TopMenu";
import { Switch, Route } from "react-router";
import Users from "../Users/Users";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";
import Home from "../Home/Home";
import Notifications from "../../common/components/Notification";
import UserManagement from "../UserManagement/UserManagement";
import StockManagement from "../StockManagement/StockManagement";
import CommodityManagement from "../CommodityManagement/CommodityManagement";
import IntroManagement from "../IntroManagement/IntroManagement";
import DepositManagement from "../DepositManagement/DepositManagement";
import WithdrawManagement from "../WithdrawManagement/WithdrawManagement";
import PaymentDetails from "../PaymentDetails/PaymentDetails";

const Admin: React.FC = () => {

  return (
    <Fragment>
      <Notifications />
      <LeftMenu />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopMenu />
          <div className="container-fluid">
            <Switch>
              <Route path={`/users`}><Users /></Route>
              <Route path={`/products`}><Products /></Route>
              <Route path={`/UserManagement`}><UserManagement /></Route>
              <Route path={`/StockManagement`}><StockManagement /></Route>
              <Route path={`/CommodityManagement`}><CommodityManagement /></Route>
              <Route path={`/IntroManagement`}><IntroManagement /></Route>
              <Route path={`/DepositManagement`}><DepositManagement /></Route>
              <Route path={`/WithdrawManagement`}><WithdrawManagement /></Route>
              <Route path={`/PaymentDetails`}><PaymentDetails /></Route>
              {/* <Route path={`/orders`}><Orders /></Route> */}
              <Route path="/"><Home /></Route>
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
