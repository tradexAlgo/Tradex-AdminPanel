import React, { Fragment, Dispatch, useState, useEffect } from "react";
import StockManagementList from "./StockManagementList";
import StockManagementForm from "./StockManagementForm";
import TopCard from "../../common/components/TopCard";
import "./StockManagement.css";
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

const StockManagement: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState = useSelector((state: IStateType) => state.products);
  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const numberItemsCount: number = products.products.length;
  const totalPrice: number = products.products.reduce((prev, next) => prev + ((next.price * next.amount) || 0), 0);
  const totalAmount: number = products.products.reduce((prev, next) => prev + (next.amount || 0), 0);
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [SelectedUser, setSelectedUser] = useState([] as any);
  const [SelectedUserDelete, setSelectedUserDelete] = useState([] as any);

  // State for stock data
  const [stocks, setStocks] = useState<any[]>([]);
  const [stockCount, setStockCount] = useState<number>(0);
  const [totalStockValue, setTotalStockValue] = useState<number>(0);

  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(updateCurrentPath("stocks", "list"));

    // Fetch stock data from API
    axios.get('https://backend-tradex.onrender.com/admin/stocks')
      .then(response => {
        if (response.data.status) {
          const stockData = response.data.data;
          setStocks(stockData);
          setStockCount(stockData.length);
          setTotalStockValue(stockData.reduce((sum: any, stock: any) => sum + (stock.totalAmount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
      });
  }, [path.area, dispatch]);

  function onProductSelect(product: IProduct): void {
    dispatch(changeSelectedProduct(product));
    dispatch(setModificationState(ProductModificationStatus.None));
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

  function onStockSelect(stock: any): void {
    setSelectedUser(stock)
    setPopup2(true)
    // dispatch(changeSelectedProduct(stock)); // You might want to create a similar action for stocks
    // dispatch(setModificationState(ProductModificationStatus.Edit));
  }
  function callAPIUpdateData() {
    axios.get('https://backend-tradex.onrender.com/admin/stocks')
      .then(response => {
        if (response.data.status) {
          const stockData = response.data.data;
          setStocks(stockData);
          setStockCount(stockData.length);
          setTotalStockValue(stockData.reduce((sum: any, stock: any) => sum + (stock.totalAmount || 0), 0));
        }
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
      });
  }


  const handleDelete = async () => {
    if (SelectedUserDelete._id) {
      try {
        const response = await fetch(`https://backend-tradex.onrender.com/admin/stocks/${SelectedUserDelete._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          dispatch(addNotification("Stock removed", `Stock ${SelectedUserDelete.stockName} was removed successfully`));
          axios.get('https://backend-tradex.onrender.com/admin/stocks')
            .then(response => {
              if (response.data.status) {
                const stockData = response.data.data;
                setStocks(stockData);
                setStockCount(stockData.length);
                setTotalStockValue(stockData.reduce((sum: any, stock: any) => sum + (stock.totalAmount || 0), 0));
              }
            })
            .catch(error => {
              console.error('Error fetching stock data:', error);
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
      <h1 className="h3 mb-2 text-gray-800">Stock Management</h1>
      <p className="mb-4">All Stocks here</p>
      <div className="row">
        {/* Add a TopCard for Stock Count */}
        <TopCard title="STOCK COUNT" text={`${stockCount}`} icon="boxes" class="info" />
        {/* Add a TopCard for Total Stock Value */}
        <TopCard title="TOTAL STOCK VALUE" text={`₹${totalStockValue}`} icon="dollar-sign" class="warning" />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Stock List</h6>
              <div className="header-buttons">
                {/* <button className="btn btn-success btn-green" onClick={() =>
                  dispatch(setModificationState(ProductModificationStatus.Create))}>
                  <i className="fas fa fa-plus"></i>
                </button> */}
                {/* <button className="btn btn-success btn-green" onClick={() =>
                  dispatch(setModificationState(ProductModificationStatus.Edit))}>
                  <i className="fas fa fa-pen"></i>
                </button>
                <button className="btn btn-success btn-red" onClick={() => onProductRemove()}>
                  <i className="fas fa fa-times"></i>
                </button> */}
              </div>
            </div>
            <div className="card-body">
              <StockManagementList
                onSelect={onStockSelect}
                stocks={stocks}
                onSelectDelete={onSelectDeleteUser}
              />
            </div>
          </div>
        </div>
        {/* {((products.modificationState === ProductModificationStatus.Create)
          || (products.modificationState === ProductModificationStatus.Edit && products.selectedProduct)) ?
          <StockManagementForm /> : null} */}
      </div>

      <Popup
        className="popup-modal-user"
        open={popup2}
        onClose={() => setPopup2(false)}
        closeOnDocumentClick
      >
        <StockManagementForm SelectedUser={SelectedUser} onHide={() => setPopup2(false)} callAPIUpdateData={callAPIUpdateData} />
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

export default StockManagement;
