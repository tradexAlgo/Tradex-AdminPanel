import React, { Fragment, Dispatch, useState, useEffect } from "react";
import WithdrawManagementList from "./WithdrawManagementList";
import WithdrawManagementForm from "./WithdrawManagementForm";
import TopCard from "../../common/components/TopCard";
import "./WithdrawManagement.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IProductState, IStateType, IRootPageStateType } from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  removeProduct, clearSelectedProduct, setModificationState,
  changeSelectedProduct
} from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import { ProductModificationStatus, IProduct } from "../../store/models/product.interface";
import axios from 'axios';

const WithdrawManagement: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState = useSelector((state: IStateType) => state.products);
  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [SelectedUser, setSelectedUser] = useState([] as any);
  const [SelectedUserDelete, setSelectedUserDelete] = useState([] as any);
  const [withdraws, setwithdraws] = useState<any[]>([]);
  const [withdrawsCount, setwithdrawsCount] = useState<number>(0);
  const [totalwithdrawsValue, setTotalwithdrawsValue] = useState<number>(0);

  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(updateCurrentPath("withdraws", "list"));

    // Fetch withdraws data from API
    axios.get('https://backend-tradex.onrender.com/user/payments')
      .then(response => {
        if (response.data.status) {
          const depositData = response.data.data.filter((item: any) => item.type === "WITHDRAW");
          setwithdraws(depositData);
          setwithdrawsCount(depositData.length);
          setTotalwithdrawsValue(depositData.reduce((sum: any, deposit: any) => sum + (deposit.amount || 0), 0));
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
          const depositData = response.data.data.filter((item: any) => item.type === "WITHDRAW");
          setwithdraws(depositData);
          setwithdrawsCount(depositData.length);
          setTotalwithdrawsValue(depositData.reduce((sum: any, deposit: any) => sum + (deposit.amount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching withdraws data:', error);
      });
  }



  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Withdraw Management</h1>
      <p className="mb-4">All Withdraw here</p>
      <div className="row">
        {/* Add a TopCard for WITHDRAW Count */}
        <TopCard title="WITHDRAW COUNT" text={`${withdrawsCount}`} icon="boxes" class="info" />
        { }
        <TopCard title="TOTAL WITHDRAW VALUE" text={`₹${totalwithdrawsValue}`} icon="dollar-sign" class="warning" />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Withdraw List</h6>
            </div>
            <div className="card-body">
              <WithdrawManagementList
                callAPIUpdateData={callAPIUpdateData}
                withdraws={withdraws}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WithdrawManagement;
