import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { useDispatch } from "react-redux";
import TextInput from "../../common/components/TextInput";
import NumberInput from "../../common/components/NumberInput";
import Checkbox from "../../common/components/Checkbox";
import { addNotification } from "../../store/actions/notifications.action";

interface IUserFormState {
  role: { error: string; value: string };
  email: { error: string; value: string };
  fullName: { error: string; value: string };
  password: { error: string; value: string };
  wallet: { error: string; value: number };
  overallProfit: { error: string; value: number };
  todayProfit: { error: string; value: number };
  userPicture: { error: string; value: string };
  totalInvested: { error: string; value: number };
  otp: { error: string; value: string };
  isProfileComplete: { error: string; value: boolean };
  currency: { error: string; value: string };
  joinedOn: { error: string; value: string };
  profileStatus: { error: string; value: string };
  phoneNumber: { error: string; value: string };
  isPhoneNumberVerified: { error: string; value: boolean };
}

const UserManagementForm = (props: any): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();
  const SelectedUser: any | null = props.SelectedUser;
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<IUserFormState>({
    role: { error: "", value: SelectedUser.role || "" },
    email: { error: "", value: SelectedUser.email || "" },
    fullName: { error: "", value: SelectedUser.fullName || "" },
    password: { error: "", value: SelectedUser.password },
    wallet: { error: "", value: SelectedUser.wallet || 0 },
    overallProfit: { error: "", value: SelectedUser.overallProfit || 0 },
    todayProfit: { error: "", value: SelectedUser.todayProfit || 0 },
    userPicture: { error: "", value: SelectedUser.userPicture || "" },
    totalInvested: { error: "", value: SelectedUser.totalInvested || 0 },
    otp: { error: "", value: SelectedUser.otp || "" },
    isProfileComplete: {
      error: "",
      value: SelectedUser.isProfileComplete || false,
    },
    currency: { error: "", value: SelectedUser.currency || "" },
    joinedOn: { error: "", value: SelectedUser.joinedOn || "" },
    profileStatus: { error: "", value: SelectedUser.profileStatus || "" },
    phoneNumber: { error: "", value: SelectedUser.phoneNumber || "" },
    isPhoneNumberVerified: {
      error: "",
      value: SelectedUser.isPhoneNumberVerified || false,
    },
  });

  function hasFormValueChanged(model: {
    field: keyof IUserFormState;
    error: string;
    value: any;
  }): void {
    setFormState({
      ...formState,
      [model.field]: { error: model.error, value: model.value },
    });
  }

  function saveUser(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // if (isFormInvalid()) {
    //   return;
    // }
    saveForm(formState);
  }

  // async function saveForm(formState: IUserFormState): Promise<void> {
  //   if (SelectedUser) {
  //     try {
  //       const url = `https://backend-tradex.onrender.com/admin/users/${SelectedUser._id}`;

  //       const params = new URLSearchParams();
  //       Object.entries(formState).forEach(([key, field]) => {
  //         params.append(key, String(field.value));
  //       });

  //       const response = await fetch(url, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //         body: params.toString(),
  //       });

  //       if (response.ok) {
  //         props.onHide()
  //         dispatch(addNotification("User updated", `User ${formState.fullName.value} updated successfully`));
  //       } else {
  //         throw new Error("Failed to update user");
  //       }
  //     } catch (error) {
  //       console.error("Error updating user:", error);
  //       dispatch(addNotification("Error", "Failed to update user"));
  //     }
  //   }
  // }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  async function saveForm(formState: IUserFormState): Promise<void> {
    if (SelectedUser) {
      try {        
        //https://backend-tradex.onrender.com/admin/users/${SelectedUser._id}
        //
        const url = `https://backend-tradex.onrender.com/admin/users/${SelectedUser._id}`;
        
        // Create a plain object with the form values.
        const bodyData = Object.entries(formState).reduce(
          (acc, [key, field]) => {
            acc[key] = field.value;
            return acc;
          },
          {} as Record<string, any>
        );

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData), // Convert the object to a JSON string
        });

        if (response.ok) {
          props.onHide();
          dispatch(
            addNotification(
              "User updated",
              `User ${formState.fullName.value} updated successfully`
            )
          );
          window.location.reload(); 
        } else {
          throw new Error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        dispatch(addNotification("Error", "Failed to update user"));
      }
    }
  }

  function cancelForm(): void {
    // Implement cancellation logic here
  }

  function getDisabledClass(): string {
    return isFormInvalid() ? "" : "disabled";
    // return isFormInvalid() ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return Object.values(formState).some(
      (field) => field.error || !field.value
    );
  }

  return (
    <Fragment>
      <div className="text-start">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">Update User</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_fullName"
                    value={formState.fullName.value}
                    field="fullName"
                    onChange={hasFormValueChanged}
                    required={true}
                    label="Full Name"
                    placeholder="Full Name"
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_email"
                    value={formState.email.value}
                    field="email"
                    onChange={hasFormValueChanged}
                    required={true}
                    label="Email"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_password"
                    value={formState.password.value}
                    field="password"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="Password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"} // Dynamically change type
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </button>
                </div>

                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_wallet"
                    value={formState.wallet.value}
                    field="wallet"
                    onChange={hasFormValueChanged}
                    label="Wallet"
                    // max={100000}
                    // min={0}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_overallProfit"
                    value={formState.overallProfit.value}
                    field="overallProfit"
                    onChange={hasFormValueChanged}
                    label="Overall Profit"
                    // max={1000000}
                    // min={-1000000}
                  />
                </div>
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_todayProfit"
                    value={formState.todayProfit.value}
                    field="todayProfit"
                    onChange={hasFormValueChanged}
                    label="Today Profit"
                    // max={100000}
                    // min={-100000}
                  />
                </div>
              </div>

              <div className="form-group">
                <TextInput
                  id="input_userPicture"
                  value={formState.userPicture.value}
                  field="userPicture"
                  onChange={hasFormValueChanged}
                  required={false}
                  label="User Picture URL"
                  placeholder="User Picture URL"
                />
              </div>

              <div className="form-group">
                <Checkbox
                  id="checkbox_isProfileComplete"
                  field="isProfileComplete"
                  value={formState.isProfileComplete.value}
                  label="Profile Complete"
                  onChange={hasFormValueChanged}
                />
              </div>

              {/* <button className="btn btn-danger" onClick={() => cancelForm()}>Cancel</button> */}
              <button
                type="submit"
                className={`btn btn-success left-margin ${getDisabledClass()}`}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserManagementForm;
