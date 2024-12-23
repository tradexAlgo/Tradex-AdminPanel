import React, { Fragment, Dispatch, useState, useEffect } from "react";
import CommodityManagementList from "./CommodityManagementList";
import CommodityManagementForm from "./CommodityManagementForm";
import TopCard from "../../common/components/TopCard";
import "./CommodityManagement.css";
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

const CommodityManagement: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState = useSelector((state: IStateType) => state.products);
  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [SelectedUser, setSelectedUser] = useState([] as any);
  const [SelectedUserDelete, setSelectedUserDelete] = useState([] as any);


  // State for commodity data
  const [commodities, setCommodities] = useState<any[]>([]);
  const [commodityCount, setCommodityCount] = useState<number>(0);
  const [totalCommodityValue, setTotalCommodityValue] = useState<number>(0);

  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(updateCurrentPath("commodities", "list"));

    // Fetch commodities data from API
    axios.get('https://backend-tradex.onrender.com/admin/commodities')
      .then(response => {
        if (response.data.status) {
          const commodityData = response.data.data;
          setCommodities(commodityData);
          setCommodityCount(commodityData.length);
          setTotalCommodityValue(commodityData.reduce((sum: any, commodity: any) => sum + (commodity.totalAmount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching commodities data:', error);
      });
  }, [path.area, dispatch]);

  function onCommoditySelect(commodity: any): void {
    setSelectedUser(commodity);
    setPopup2(true)
    // dispatch(changeSelectedProduct(commodity)); // Update this if you need a specific action for commodities
    // dispatch(setModificationState(ProductModificationStatus.Edit));
  }

  function onProductRemove() {
    if (products.selectedProduct) {
      setPopup(true);
    }
  }

  function onSelectDeleteUser(user: any) {
    setSelectedUserDelete(user); //(user)
    setPopup(true);
  }

  function callAPIUpdateData() {
    axios.get('https://backend-tradex.onrender.com/admin/commodities')
      .then(response => {
        if (response.data.status) {
          const commodityData = response.data.data;
          setCommodities(commodityData);
          setCommodityCount(commodityData.length);
          setTotalCommodityValue(commodityData.reduce((sum: any, commodity: any) => sum + (commodity.totalAmount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching commodities data:', error);
      });
  }

  const handleDelete = async () => {
    if (SelectedUserDelete._id) {
      try {
        const response = await fetch(`https://backend-tradex.onrender.com/admin/commodities/${SelectedUserDelete._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          dispatch(addNotification("Commodity removed", `Commodity ${SelectedUserDelete.commodityName} was removed successfully`));
          axios.get('https://backend-tradex.onrender.com/admin/commodities')
            .then(response => {
              if (response.data.status) {
                const commodityData = response.data.data;
                setCommodities(commodityData);
                setCommodityCount(commodityData.length);
                setTotalCommodityValue(commodityData.reduce((sum: any, commodity: any) => sum + (commodity.totalAmount || 0), 0));
              }
            })
            .catch(error => {
              console.error('Error fetching commodities data:', error);
            });
          setPopup(false);
        } else {
          throw new Error("Failed to remove user");
        }
      } catch (error) {
        console.error("Error removing user:", error);
        dispatch(addNotification("Error", "Failed to remove user"));
      }
    }
  };

  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Commodity Management</h1>
      <p className="mb-4">All commodities here</p>
      <div className="row">
        {/* Add a TopCard for Commodity Count */}
        <TopCard title="COMMODITY COUNT" text={`${commodityCount}`} icon="boxes" class="info" />
        {/* Add a TopCard for Total Commodity Value */}
        <TopCard title="TOTAL COMMODITY VALUE" text={`₹${totalCommodityValue}`} icon="dollar-sign" class="warning" />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Commodity List</h6>
              {/* <div className="header-buttons">
                <button className="btn btn-success btn-green" onClick={() =>
                  dispatch(setModificationState(ProductModificationStatus.Create))}>
                  <i className="fas fa fa-plus"></i>
                </button>
                <button className="btn btn-success btn-green" onClick={() =>
                  dispatch(setModificationState(ProductModificationStatus.Edit))}>
                  <i className="fas fa fa-pen"></i>
                </button>
                <button className="btn btn-success btn-red" onClick={() => onProductRemove()}>
                  <i className="fas fa fa-times"></i>
                </button>
              </div> */}
            </div>
            <div className="card-body">
              <CommodityManagementList
                onSelect={onCommoditySelect}
                commodities={commodities}
                onSelectDelete={onSelectDeleteUser}

              />
            </div>
          </div>
        </div>
        {/* {((products.modificationState === ProductModificationStatus.Create)
          || (products.modificationState === ProductModificationStatus.Edit && products.selectedProduct)) ?
          <CommodityManagementForm /> : null} */}
      </div>

      <Popup
        className="popup-modal-user"
        open={popup2}
        onClose={() => setPopup2(false)}
        closeOnDocumentClick
      >
        <CommodityManagementForm SelectedUser={SelectedUser} onHide={() => setPopup2(false)} callAPIUpdateData={callAPIUpdateData} />
      </Popup>

      <Popup
        className="popup-modal"
        open={popup}
        onClose={() => setPopup(false)}
        closeOnDocumentClick
      >
        <div className="popup-modal">
          <div className="popup-title">
            Are you sure?
          </div>
          <div className="popup-content">
            <button type="button"
              className="btn btn-danger"
              onClick={handleDelete}>Remove
            </button>
          </div>
        </div>
      </Popup>
    </Fragment>
  );
};

export default CommodityManagement;
