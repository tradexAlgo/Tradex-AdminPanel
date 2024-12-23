import React from "react";
import { IProduct } from "../../store/models/product.interface";

export type commodityListProps = {
  onSelect?: (commodity: IProduct) => void;
  commodities: any[];
};

const CommodityManagementList = (props: any): JSX.Element => {
  const commodityElements = React.useMemo(() => {
    return props.commodities.map((commodity: any, i: number) => (
      <tr
        className={`table-row ${props.onSelect ? "selectable" : ""}`}
        // onClick={() => props.onSelect && props.onSelect(commodity)}
        key={commodity._id}
      >
        <th scope="row">{i + 1}</th>
        <div className="mT10 btnStyle" style={{ display: "flex" }}>
          <button className="btn btn-success btn-green" onClick={() => {
            if (props.onSelect) props.onSelect(commodity);
          }}>
            <i className="fas fa fa-pen"></i>
          </button>
          <button className="btn btn-success btn-red" onClick={() => {
            if (props.onSelectDelete) props.onSelectDelete(commodity);
          }} >
            <i className="fas fa fa-times"></i>
          </button>
        </div>
        <td>{commodity.commodityName}</td>
        <td>{commodity.symbol}</td>
        <td>₹{commodity.totalAmount}</td>
        <td>{commodity.type}</td> {/* Updated to type instead of commodityType */}
        <td>{commodity.quantity}</td>
        <td>{commodity.targetPrice !== null ? commodity.targetPrice : 'N/A'}</td>
        <td>{commodity.commodityPrice}</td>
        <td>{commodity.stopLoss !== null ? commodity.stopLoss : 'N/A'}</td>
        <td>{commodity.status}</td>
        <td>{commodity.netProfitAndLoss}</td>
        <td>{commodity.sellDate ? new Date(commodity.sellDate).toLocaleDateString() : 'N/A'}</td> {/* Corrected field name */}
        <td>{new Date(commodity.buyDate).toLocaleDateString()}</td>
        <td>{commodity.squareOff ? 'Yes' : 'No'}</td>
        <td>{commodity.squareOffDate ? new Date(commodity.squareOffDate).toLocaleDateString() : 'N/A'}</td>
        <td>{new Date(commodity.toSquareOffOn).toLocaleDateString()}</td>
        <td>{commodity.createdAt ? new Date(commodity.createdAt).toLocaleDateString() : 'N/A'}</td> {/* Added createdAt */}
        <td>{commodity.updatedAt ? new Date(commodity.updatedAt).toLocaleDateString() : 'N/A'}</td> {/* Added updatedAt */}
      </tr>
    ));
  }, [props.commodities, props.onSelect]);

  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Actions</th>
            <th scope="col">Commodity Name</th>
            <th scope="col">Symbol</th>
            <th scope="col">Total Amount</th>
            <th scope="col">Type</th> {/* Updated column header */}
            <th scope="col">Quantity</th>
            <th scope="col">Target Price</th>
            <th scope="col">Commodity Price</th>
            <th scope="col">Stop Loss</th>
            <th scope="col">Status</th>
            <th scope="col">Net Profit/Loss</th>
            <th scope="col">Sell Date</th> {/* Updated header */}
            <th scope="col">Buy Date</th>
            <th scope="col">Square Off</th>
            <th scope="col">Square Off Date</th>
            <th scope="col">To Square Off On</th>
            <th scope="col">Created At</th> {/* Added column header */}
            <th scope="col">Updated At</th> {/* Added column header */}
          </tr>
        </thead>
        <tbody>
          {commodityElements}
        </tbody>
      </table>
    </div>
  );
};

export default CommodityManagementList;
