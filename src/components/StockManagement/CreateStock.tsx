import React, { useState } from "react";
import axios from "axios";
import "./CreateStock.css";

interface StockData {
  stockName: string;
  symbol: string;
  quantity: number;
  price: number;
}

interface CreateStockProps {
  onClose: () => void;
  onStockCreated: () => void;
}

const CreateStock: React.FC<CreateStockProps> = ({ onClose, onStockCreated }) => {
  const [stockData, setStockData] = useState<StockData>({
    stockName: "",
    symbol: "",
    quantity: 0,
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockData({ ...stockData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
    //http://localhost:5001/admin/stocks
    //https://backend-tradex.onrender.com/admin/stocks
      const response = await axios.post("https://backend-tradex.onrender.com/admin/stocks", stockData);

      if (response.status === 201) {
        onStockCreated();
        onClose();
      } else {
        throw new Error("Failed to create stock");
      }
    } catch (err) {
      setError("An error occurred while creating the stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create New Stock</h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Stock Name</label>
            <input
              type="text"
              name="stockName"
              value={stockData.stockName}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter stock name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={stockData.symbol}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter stock symbol"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={stockData.quantity}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <input
              type="hidden"
              name="price"
              value={stockData.price}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter stock price"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button className="button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStock;
