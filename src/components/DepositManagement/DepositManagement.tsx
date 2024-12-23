import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DepositManagementList from "./DepositManagementList";
import TopCard from "../../common/components/TopCard";
import "./DepositManagement.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IProductState, IStateType, IRootPageStateType } from "../../store/models/root.interface";
import {
  removeProduct, clearSelectedProduct, setModificationState,
  changeSelectedProduct
} from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import axios from 'axios';

const DepositManagement: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  // State for deposit data
  const [deposits, setDeposits] = useState<any[]>([]);
  const [depositCount, setDepositCount] = useState<number>(0);
  const [totalDepositValue, setTotalDepositValue] = useState<number>(0);

  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(updateCurrentPath("deposits", "list"));

    // Fetch deposits data from API
    axios.get('https://backend-tradex.onrender.com/user/payments')
      .then(response => {
        if (response.data.status) {
          const depositData = response.data.data.filter((item: any) => item.type === "DEPOSIT");
          setDeposits(depositData);
          setDepositCount(depositData.length);
          setTotalDepositValue(depositData.reduce((sum: any, deposit: any) => sum + (deposit.amount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching deposits data:', error);
      });
  }, [path.area, dispatch]);

  
  function callAPIUpdateData() {
    axios.get('https://backend-tradex.onrender.com/user/payments')
      .then(response => {
        if (response.data.status) {
          const depositData = response.data.data.filter((item: any) => item.type === "DEPOSIT");
          setDeposits(depositData);
          setDepositCount(depositData.length);
          setTotalDepositValue(depositData.reduce((sum: any, deposit: any) => sum + (deposit.amount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching deposits data:', error);
      });
  }


  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Deposit Management</h1>
      <p className="mb-4">All deposits here</p>
      <div className="row">
        {/* Add a TopCard for Deposit Count */}
        <TopCard title="DEPOSIT COUNT" text={`${depositCount}`} icon="boxes" class="info" />
        {/* Add a TopCard for Total Deposit Value */}
        <TopCard title="TOTAL DEPOSIT VALUE" text={`₹${totalDepositValue}`} icon="dollar-sign" class="warning" />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Deposit List</h6>
            </div>
            <div className="card-body">
              <DepositManagementList
                callAPIUpdateData={callAPIUpdateData}
                deposits={deposits}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DepositManagement;
