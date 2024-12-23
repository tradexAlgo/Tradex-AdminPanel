import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextInput from "../../common/components/TextInput";
import NumberInput from "../../common/components/NumberInput";
import Checkbox from "../../common/components/Checkbox";
import SelectInput from "../../common/components/Select";
import { addNotification } from "../../store/actions/notifications.action";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { editProduct, clearSelectedProduct, setModificationState, addProduct } from "../../store/actions/products.action";
import { OnChangeModel, IProductFormState } from "../../common/types/Form.types";

// Define the type for form state
interface FormField {
  error: string;
  value: any;
}

interface FormState {
  [key: string]: FormField;
}

const StockManagementForm = (props: any): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState | null = useSelector((state: IStateType) => state.products);
  let stock: any = props.SelectedUser;

  if (!stock) {
    stock = {
      _id: "",
      stockName: "",
      symbol: "",
      totalAmount: 0,
      stockType: "",
      userId: "",
      type: "",
      quantity: 0,
      targetPrice: null,
      stockPrice: 0,
      stopLoss: null,
      status: "",
      netProfitAndLoss: 0,
      soldDate: null,
      buyDate: "",
      squareOff: false,
      squareOffDate: null
    };
  }

  const [formState, setFormState] = useState<FormState>({
    stockName: { error: "", value: stock.stockName },
    symbol: { error: "", value: stock.symbol },
    totalAmount: { error: "", value: stock.totalAmount },
    stockType: { error: "", value: stock.stockType },
    type: { error: "", value: stock.type },
    quantity: { error: "", value: stock.quantity },
    stockPrice: { error: "", value: stock.stockPrice },
    status: { error: "", value: stock.status },
    netProfitAndLoss: { error: "", value: stock.netProfitAndLoss },
    buyDate: { error: "", value: stock.buyDate },
    squareOff: { error: "", value: stock.squareOff }
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    const { field, error, value } = model;
    setFormState(prevState => ({
      ...prevState,
      [field]: { error, value }
    }));
  }

  function saveStock(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // if (isFormInvalid()) {
    //   return;
    // }
    let saveStockFn: Function = editProduct;
    saveForm(formState, saveStockFn);
  }

  async function saveForm(formState: FormState, saveFn: Function): Promise<void> {
    if (stock) {
      try {
        const url = `https://backend-tradex.onrender.com/admin/stocks/${stock._id}`;

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
          props.onHide()
          props.callAPIUpdateData()
          dispatch(addNotification("Stock updated", `Stock ${formState.stockName.value} updated successfully`));
        } else {
          throw new Error("Failed to update stock");
        }
      } catch (error) {
        console.error("Error updating stock:", error);
        dispatch(addNotification("Error", "Failed to update stock"));
      }
    }
  }

  function cancelForm(): void {
    // Implement cancel logic here
  }

  function getDisabledClass(): string {
    return isFormInvalid() ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return Object.values(formState).some(field => field.error || !field.value);
  }

  return (
    <Fragment>
      <div className="text-start">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">Update Stock</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveStock}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_stockName"
                    value={formState.stockName.value}
                    field="stockName"
                    onChange={hasFormValueChanged}
                    required={true}
                    label="Stock Name"
                    placeholder="Stock Name"
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
                    id="input_stockType"
                    field="stockType"
                    label="Stock Type"
                    options={["MKT", "LIMIT", "STOP"]}
                    required={true}
                    onChange={hasFormValueChanged}
                    value={formState.stockType.value}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <SelectInput
                    id="input_type"
                    field="type"
                    label="Type"
                    options={["DELIVERY", "INTRADAY"]}
                    required={true}
                    onChange={hasFormValueChanged}
                    value={formState.type.value}
                  />
                </div>
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
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_stockPrice"
                    value={formState.stockPrice.value}
                    field="stockPrice"
                    onChange={hasFormValueChanged}
                    label="Stock Price"
                    // max={10000}
                    // min={0}
                  />
                </div>
                <div className="form-group col-md-6">
                  <NumberInput
                    id="input_netProfitAndLoss"
                    value={formState.netProfitAndLoss.value}
                    field="netProfitAndLoss"
                    onChange={hasFormValueChanged}
                    label="Net Profit & Loss"
                    // max={1000000}
                    // min={-1000000}
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
                    required={true}
                    label="Buy Date"
                    placeholder="Buy Date"
                    type="datetime-local"
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

              <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}`}>Save</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StockManagementForm;
