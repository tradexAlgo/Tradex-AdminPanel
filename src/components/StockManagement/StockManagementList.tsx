import React from "react";
import { IProduct } from "../../store/models/product.interface";

export type stockListProps = {
  onSelect?: (stock: IProduct) => void;
  stocks: any;
};

const StockManagementList = (props: any): JSX.Element => {
  const stockElements = React.useMemo(() => {
    return props.stocks.map((stock: any, i: any) => (
      <tr
        className={`table-row ${props.onSelect ? "selectable" : ""}`}
        // onClick={() => props.onSelect && props.onSelect(stock)}
        key={stock._id}
      >
        <th scope="row">{i + 1}</th>
        <div className="mT10 btnStyle" style={{ display: "flex" }}>
          <button className="btn btn-success btn-green" onClick={() => {
            if (props.onSelect) props.onSelect(stock);
          }}>
            <i className="fas fa fa-pen"></i>
          </button>
          <button className="btn btn-success btn-red" onClick={() => {
            if (props.onSelectDelete) props.onSelectDelete(stock);
          }} >
            <i className="fas fa fa-times"></i>
          </button>
        </div>
        <td>{stock.stockName}</td>
        <td>{stock.symbol}</td>
        <td>₹{stock.totalAmount}</td>
        <td>{stock.stockType}</td>
        <td>{stock.quantity}</td>
        <td>{stock.targetPrice !== null ? stock.targetPrice : 'N/A'}</td>
        <td>{stock.stockPrice}</td>
        <td>{stock.stopLoss !== null ? stock.stopLoss : 'N/A'}</td>
        <td>{stock.status}</td>
        <td>{stock.netProfitAndLoss}</td>
        <td>{stock.soldDate ? new Date(stock.soldDate).toLocaleDateString() : 'N/A'}</td>
        <td>{new Date(stock.buyDate).toLocaleDateString()}</td>
        <td>{stock.squareOff ? 'Yes' : 'No'}</td>
        <td>{stock.squareOffDate ? new Date(stock.squareOffDate).toLocaleDateString() : 'N/A'}</td>
        <td>{new Date(stock.toSquareOffOn).toLocaleDateString()}</td>
        <td>{stock.expiryDate}</td>
        <td>{stock.optionType}</td>
        <td>{stock.identifier}</td>
      </tr>
    ));
  }, [props.stocks, props.onSelect]);

  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Actions</th>
            <th scope="col">Stock Name</th>
            <th scope="col">Symbol</th>
            <th scope="col">Total Amount</th>
            <th scope="col">Stock Type</th>
            <th scope="col">Quantity</th>
            <th scope="col">Target Price</th>
            <th scope="col">Stock Price</th>
            <th scope="col">Stop Loss</th>
            <th scope="col">Status</th>
            <th scope="col">Net Profit/Loss</th>
            <th scope="col">Sold Date</th>
            <th scope="col">Buy Date</th>
            <th scope="col">Square Off</th>
            <th scope="col">Square Off Date</th>
            <th scope="col">To Square Off On</th>
            <th scope="col">Expiry Date</th>
            <th scope="col">Option Type</th>
            <th scope="col">Identifier</th>
          </tr>
        </thead>
        <tbody>
          {stockElements}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagementList;
