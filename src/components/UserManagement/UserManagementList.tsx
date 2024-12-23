import React from "react";
import { useSelector } from "react-redux";
import { IStateType, IUserState } from "../../store/models/root.interface";
import { IUser } from "../../store/models/user.interface";

export type userListProps = {
  onSelect?: (user: IUser) => void;
  children?: React.ReactNode;
};

function UserManagementList(props: any): JSX.Element {
  // Assuming you have a user state similar to the product state
  const users: any = useSelector((state: IStateType) => state.users);
  console.log("props.SelectedUserprops.SelectedUser", props.SelectedUser)
  const userElements: (JSX.Element | null)[] = props.users.map((user: any, i: any) => {
    if (!user) { return null; }
    return (
      <tr className={`table-row ${(props.SelectedUser && props.SelectedUser.id === user.id) ? "selected" : ""}`}
        // onClick={() => {
        //   if (props.onSelect) props.onSelect(user);
        // }}
        key={`user_${user.id}`}>
        <th scope="row">{i + 1}</th>
        <td>{user.fullName}</td>
        <td>{user.email}</td>
        <td>₹{user.wallet}</td>
        <td>{new Date(user.joinedOn).toLocaleDateString()}</td>
        <div className="mT10 btnStyle">
          <button className="btn btn-success btn-green" onClick={() => {
            if (props.onSelect) props.onSelect(user);
          }}>
            <i className="fas fa fa-pen"></i>
          </button>
          <button className="btn btn-success btn-red" onClick={() => {
            if (props.onSelectDelete) props.onSelectDelete(user);
          }} >
            <i className="fas fa fa-times"></i>
          </button>
        </div>
      </tr>
    );
  });

  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Wallet</th>
            <th scope="col">Registered Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userElements}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagementList;
