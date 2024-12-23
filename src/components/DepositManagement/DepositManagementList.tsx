import React, { useState } from "react";
import axios from "axios"; // Make sure to install axios or use any other HTTP client
import { useDispatch } from "react-redux";
import { addNotification } from "../../store/actions/notifications.action";

const DepositManagementList = (props: any): JSX.Element => {
  // State to track loading for specific deposits
  const dispatch = useDispatch();
  const [loadingDepositId, setLoadingDepositId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "ACCEPTED":
        return "status-accepted";
      case "REJECTED":
        return "status-rejected";
      default:
        return "";
    }
  };

  const onDepositSelect = async (deposit: any, action: "ACCEPT" | "REJECT") => {
    try {
      setLoadingDepositId(deposit._id); // Set loading for the current deposit
      setError(null);

      const response = await axios.post("https://backend-tradex.onrender.com/user/accept", {
        paymentId: deposit._id,
        action: action,
      });

      if (response.status === 200) {
        // Handle successful response
        console.log("Action successful:", response.data);
        // Optionally refresh or update the deposits list
        dispatch(addNotification("Success", response.data.message));
        if (props.callAPIUpdateData) {
          props.callAPIUpdateData(deposit);
        }
      } else {
        dispatch(addNotification("Failed", response.data.message));
        // Handle error response
        setError("Failed to process the request. Please try again.");
      }
    } catch (err) {
      dispatch(addNotification("Failed", "An error occurred. Please try again."));
      setError("An error occurred. Please try again.");
      console.error("API error:", err);
    } finally {
      setLoadingDepositId(null); // Reset loading state
    }
  };

  const commodityElements = React.useMemo(() => {
    return props.deposits.map((commodity: any, i: number) => (
      <tr
        className={`table-row`}
        key={commodity._id}
      >
        <th scope="row">{i + 1}</th>
        <td>
          {commodity.status === "PENDING" && (
            <div className="btnStyle" style={{ display: "flex" }}>
              <button
                className="btn btn-success btn-green"
                onClick={() => onDepositSelect(commodity, "ACCEPT")}
                disabled={loadingDepositId === commodity._id}
              >
                {loadingDepositId === commodity._id ? "..." : <><i className="fas fa-check"></i></>}
              </button>
              <button
                className="btn btn-danger btn-red"
                onClick={() => onDepositSelect(commodity, "REJECT")}
                disabled={loadingDepositId === commodity._id}
              >
                {loadingDepositId === commodity._id ? "..." : <><i className="fas fa-times"></i></>}
              </button>
            </div>
          )}
        </td>
        <td>{commodity.userId ? commodity.userId.fullName : 'N/A'}</td>
        <td>{commodity.userId ? commodity.userId.email : 'N/A'}</td>
        <td>{commodity.type}</td>
        <td>₹{commodity.amount}</td>
        <td>{commodity.transactionId ? commodity.transactionId : 'N/A'}</td>
        {/* <td>{commodity.upiId ? commodity.upiId : 'N/A'}</td> */}
        <td>{commodity.currency}</td>
        {/* <td>{commodity.gateway}</td> */}
        <td className={getStatusClass(commodity.status)}>{commodity.status}</td>
        <td>{commodity.clientUp ? commodity.clientUp : 'N/A'}</td>
        <td>{commodity.createdAt ? new Date(commodity.createdAt).toLocaleDateString() : 'N/A'}</td>
        <td>{commodity.updatedAt ? new Date(commodity.updatedAt).toLocaleDateString() : 'N/A'}</td>
      </tr>
    ));
  }, [props.deposits, loadingDepositId]);

  return (
    <div className="table-responsive portlet">
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Actions</th>
            <th scope="col">Full Name</th>
            <th scope="col">Email</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
            <th scope="col">Transaction ID</th>
            {/* <th scope="col">UPI ID</th> */}
            <th scope="col">Currency</th>
            {/* <th scope="col">Gateway</th> */}
            <th scope="col">Status</th>
            <th scope="col">Client UPI</th>
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {commodityElements}
        </tbody>
      </table>
    </div>
  );
};

export default DepositManagementList;
