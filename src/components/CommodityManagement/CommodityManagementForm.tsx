import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { IProduct, ProductModificationStatus } from "../../store/models/product.interface";
import TextInput from "../../common/components/TextInput";
import NumberInput from "../../common/components/NumberInput";
import Checkbox from "../../common/components/Checkbox";
import SelectInput from "../../common/components/Select";
import { editProduct, clearSelectedProduct, setModificationState, addProduct } from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import { OnChangeModel, IProductFormState } from "../../common/types/Form.types";

// Define the type for form state
interface FormField {
  error: string;
  value: any;
}

interface FormState {
  [key: string]: FormField;
}

const CommodityManagementForm = (props: any): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState | null = useSelector((state: IStateType) => state.products);
  let commodity: any | null = props.SelectedUser;

  if (!commodity) {
    commodity = {
      _id: "",
      commodityName: "",
      symbol: "",
      totalAmount: 0,
      type: "",
      userId: "",
      quantity: 0,
      targetPrice: null,
      commodityPrice: 0,
      stopLoss: null,
      status: "",
      netProfitAndLoss: 0,
      buyDate: "",
      sellDate: null,
      squareOff: false,
      squareOffDate: null,
      intervalId: null,
      executed: false,
      failed: false,
      toSquareOffOn: "",
    };
  }

  const [formState, setFormState] = useState<FormState>({
    commodityName: { error: "", value: commodity.commodityName },
    symbol: { error: "", value: commodity.symbol },
    totalAmount: { error: "", value: commodity.totalAmount },
    type: { error: "", value: commodity.type },
    quantity: { error: "", value: commodity.quantity },
    commodityPrice: { error: "", value: commodity.commodityPrice },
    status: { error: "", value: commodity.status },
    netProfitAndLoss: { error: "", value: commodity.netProfitAndLoss },
    buyDate: { error: "", value: commodity.buyDate },
    squareOff: { error: "", value: commodity.squareOff },
    squareOffDate: { error: "", value: commodity.squareOffDate },
    toSquareOffOn: { error: "", value: commodity.toSquareOffOn },
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    const { field, error, value } = model;
    setFormState(prevState => ({
      ...prevState,
      [field]: { error, value }
    }));
  }

  function saveCommodity(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // if (isFormInvalid()) {
    //   return;
    // }

    const saveFn: Function = editProduct;
    saveForm(formState, saveFn);
  }

  async function saveForm(formState: FormState, saveFn: Function): Promise<void> {
    if (commodity) {
      try {
        const url = `https://backend-tradex.onrender.com/admin/commodities/${commodity._id}`;

        const params = new URLSearchParams();
        Object.entries(formState).forEach(([key, field]) => {
          params.append(key, String(field.value));
        });

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        if (response.ok) {
          props.onHide();
          props.callAPIUpdateData();
          dispatch(addNotification("Commodity updated", `Commodity ${formState.commodityName.value} updated successfully`));
        } else {
          throw new Error("Failed to update commodity");
        }
      } catch (error) {
        console.error("Error updating commodity:", error);
        dispatch(addNotification("Error", "Failed to update commodity"));
      }
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(ProductModificationStatus.None));
  }

  function getDisabledClass(): string {
    return isFormInvalid() ? "" : "disabled";
    // return isFormInvalid() ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return Object.values(formState).some(field => field.error || !field.value);
  }

  return (
    <Fragment>
      <div className="text-start">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">Update Commodity</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveCommodity}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_commodityName"
                    value={formState.commodityName.value}
                    field="commodityName"
                    onChange={hasFormValueChanged}
                    required={true}
                    label="Commodity Name"
                    placeholder="Commodity Name"
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_symbol"
                    value={formState.symbol.value}
                    field="symbol"
                    onChange={hasFormValueChanged}
                    required={true}
                    label="Symbol"
                    placeholder="Symbol"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_totalAmount"
                    value={formState.totalAmount.value}
                    field="totalAmount"
                    onChange={hasFormValueChanged}
                    label="Total Amount"
                    max={1000000}
                    min={0}
                  />
                </div>
                <div className="form-group col-md-6">
                  <SelectInput
                    id="input_type"
                    field="type"
                    label="Type"
                    options={["BUY", "SELL"]}
                    required={true}
                    onChange={hasFormValueChanged}
                    value={formState.type.value}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_quantity"
                    value={formState.quantity.value}
                    field="quantity"
                    onChange={hasFormValueChanged}
                    label="Quantity"
                  // max={10000}
                  // min={0}
                  />
                </div>
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_commodityPrice"
                    value={formState.commodityPrice.value}
                    field="commodityPrice"
                    onChange={hasFormValueChanged}
                    label="Commodity Price"
                  // max={10000}
                  // min={0}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_buyDate"
                    value={formState.buyDate.value}
                    field="buyDate"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="Buy Date"
                    placeholder="Buy Date"
                    // type="datetime-local"
                    type="date"
                  />
                </div>
                <div className="form-group col-md-6">
                  <Checkbox
                    id="checkbox_squareOff"
                    field="squareOff"
                    value={formState.squareOff.value}
                    label="Square Off"
                    onChange={hasFormValueChanged}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_squareOffDate"
                    value={formState.squareOffDate.value}
                    field="squareOffDate"
                    onChange={hasFormValueChanged}
                    label="Square Off Date"
                    placeholder="Square Off Date"
                    // type="datetime-local"
                    type="date"
                    required={false}
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_toSquareOffOn"
                    value={formState.toSquareOffOn.value}
                    field="toSquareOffOn"
                    onChange={hasFormValueChanged}
                    label="To Square Off On"
                    placeholder="To Square Off On"
                    type="date"
                    required={false}
                  />
                </div>
              </div>

              {/* <button className="btn btn-danger" onClick={() => cancelForm()}>Cancel</button> */}
              <button className={`btn btn-success ${getDisabledClass()}`} type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CommodityManagementForm;
