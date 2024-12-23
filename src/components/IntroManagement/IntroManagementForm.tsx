import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import TextInput from "../../common/components/TextInput";
import { addNotification } from "../../store/actions/notifications.action";
import { OnChangeModel, IProductFormState } from "../../common/types/Form.types";

interface FormField {
  error: string;
  value: any;
}

interface FormState {
  [key: string]: FormField;
}

const IntroManagementForm = (props: any): JSX.Element => {
  const dispatch: Dispatch<any> = useDispatch();
  const intro: any | null = props.intro;
  const isEdit: boolean = props.IsEdit;

  const [formState, setFormState] = useState<FormState>({
    introTitle: { error: "", value: intro.introTitle || "" },
    introDescription: { error: "", value: intro.introDescription || "" },
    introHashtags: { error: "", value: intro.introHashtags || [] }, // Ensure this is an array
    introBanner: { error: "", value: intro.introBanner || "" }
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);

  function hasFormValueChanged(model: OnChangeModel): void {
    const { field, error, value } = model;
    setFormState(prevState => ({
      ...prevState,
      [field]: { error, value }
    }));
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files;
    if (files && files.length > 0) {
      setBannerFile(files[0]);
    }
  }

  async function saveCommodity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      let bannerUrl: string | null = null;

      if (bannerFile) {
        const bannerFormData = new FormData();
        bannerFormData.append('file', bannerFile);

        const uploadResponse = await fetch("https://backend-tradex.onrender.com/admin/intro/upload-image", {
          method: "POST",
          body: bannerFormData
        });

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          console.log("resultresultresult", result.fileUrl)
          bannerUrl = result.fileUrl;
        } else {
          throw new Error("Failed to upload banner image");
        }
      }

      const payload = {
        introTitle: formState.introTitle.value,
        introDescription: formState.introDescription.value,
        introHashtags: Array.isArray(formState.introHashtags.value)
          ? formState.introHashtags.value
          : formState.introHashtags.value.split(',').map((tag: any) => tag.trim()), // Convert string to array
        introBanner: bannerUrl ? `https://backend-tradex.onrender.com${bannerUrl}` : formState.introBanner.value
      };

      const url = isEdit
        ? `https://backend-tradex.onrender.com/admin/intro/update/${intro._id}`
        : "https://backend-tradex.onrender.com/admin/intro/add";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        props.onHide();
        props.callAPIUpdateData();
        dispatch(addNotification("Success", `Intro ${isEdit ? "updated" : "added"} successfully`));
      } else {
        throw new Error(`Failed to ${isEdit ? "update" : "add"} Intro`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "adding"} Intro:`, error);
      dispatch(addNotification("Error", `Failed to ${isEdit ? "update" : "add"} Intro`));
    }
  }

  return (
    <Fragment>
      <div className="text-start">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">{isEdit ? "Update" : "Add"} Intro</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveCommodity}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_introTitle"
                    value={formState.introTitle.value}
                    field="introTitle"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="Intro Title"
                    placeholder="Intro Title"
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_introDescription"
                    value={formState.introDescription.value}
                    field="introDescription"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="Intro Description"
                    placeholder="Intro Description"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_introHashtags"
                    value={Array.isArray(formState.introHashtags.value)
                      ? formState.introHashtags.value.join(", ")
                      : formState.introHashtags.value}
                    field="introHashtags"
                    onChange={hasFormValueChanged}
                    label="Intro Hashtags"
                    placeholder="Intro Hashtags (comma separated)"
                    required={false}
                  />
                </div>
                <div className="form-group col-md-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="form-control"
                  />
                </div>
              </div>

              <button className={`btn btn-success`} type="submit">
                {isEdit ? "Save" : "Add"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default IntroManagementForm;
