import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import TopCard from "../../common/components/TopCard";
import { IProductState, IStateType } from "../../store/models/root.interface";
import { IOrder } from "../../store/models/order.interface";
import { DashboardInfo, fetchDashboardInfo } from "./HomeAPICall";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const products: IProductState = useSelector((state: IStateType) => state.products);
  const orders: IOrder[] = useSelector((state: IStateType) => state.orders.orders);

  const [dashboardData, setDashboardData] = useState<DashboardInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(updateCurrentPath("home", ""));

    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardInfo(); // Use the function here
        if (data) {
          setDashboardData(data);
        } else {
          setError("Failed to load dashboard info.");
        }
      } catch (err) {
        setError("Error fetching dashboard info.");
      }
      setLoading(false);
    };

    loadDashboardData();
  }, [dispatch]);

  // Calculate totals
  const numberItemsCount: number = products.products.length;
  const totalPrice: number = products.products.reduce((prev, next) => prev + ((next.price * next.amount) || 0), 0);
  const totalProductAmount: number = products.products.reduce((prev, next) => prev + (next.amount || 0), 0);
  const totalSales: number = orders.reduce((prev, next) => prev + next.totalPrice, 0);
  const totalOrderAmount: number = orders.reduce((prev, next) => prev + next.amount, 0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!dashboardData) return <p>No dashboard data available.</p>;

  const profitLossStyle = {
    color: dashboardData.totalStockProfitLoss < 0 ? 'red' : 'green'
  };

  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Dashboard</h1>
      <p className="mb-4">Summary and overview of our admin stuff here</p>

      <div className="row">
        <TopCard title="TOTAL STOCKS" text={dashboardData.totalStocks.toString()} icon="box" class="primary" />
        <TopCard title="TOTAL COMMODITIES" text={dashboardData.totalCommodities.toString()} icon="warehouse" class="danger" />
        <TopCard title="TOTAL INVESTED" text={`₹${dashboardData.totalInvested.toFixed(2)}`} icon="dollar-sign" class="success" />
        <TopCard title="STOCK PROFIT/LOSS" text={`₹${dashboardData.totalStockProfitLoss.toFixed(2)}`} icon="chart-line" class="info" status={dashboardData.totalStockProfitLoss < 0 ? 'loss' : 'profit'} />
      </div>

      <div className="row">
        <TopCard title="STOCK VALUE" text={`₹${dashboardData.totalStockValue.toFixed(2)}`} icon="money-bill" class="primary" />
        <TopCard title="COMMODITY VALUE" text={`₹${dashboardData.totalCommodityValue.toFixed(2)}`} icon="coins" class="danger" />
        <TopCard title="USER WITH HIGHEST WALLET" text={`${dashboardData.userWithHighestWallet.fullName} - ₹${dashboardData.userWithHighestWallet.wallet.toFixed(2)}`} icon="user" class="success" />
      </div>

      <div className="row">
        {/* <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Top Stocks</h6>
            </div>
            <div className="card-body">
              <ul>
                {dashboardData.topStocks.map(stock => (
                  <li key={stock._id}>{stock.stockName} ({stock.symbol}): ₹{stock.totalAmount.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div> */}
        <div className="col-xl-6 col-lg-6 col-md-12 unique-top-stocks-container">
          <div className="card shadow mb-4 unique-card">
            <div className="card-header py-3 unique-card-header">
              <h6 className="m-0 font-weight-bold text-green unique-card-title">Top Stocks</h6>
            </div>
            <div className="card-body unique-card-body">
              <table className="table unique-table">
                <thead>
                  <tr>
                    <th className="unique-table-header">Stock Name</th>
                    <th className="unique-table-header">Symbol</th>
                    <th className="unique-table-header">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topStocks.map(stock => (
                    <tr key={stock._id}>
                      <td className="unique-table-data">{stock.stockName}</td>
                      <td className="unique-table-data">{stock.symbol}</td>
                      <td className="unique-table-data">₹{stock.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Latest Users</h6>
            </div>
            <div className="card-body">
              <ul className="HomeUserUI">
                {dashboardData.latestUsers.map(user => (
                  <li key={user._id}>
                    <img src={user.userPicture} alt={user.fullName} className="rounded-circle" width="50" height="50" />
                    {user.fullName} ({user.email.length > 10 ? `${user.email.slice(0, 10)}...` : user.email})
                    - Joined on {new Date(user.joinedOn).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
