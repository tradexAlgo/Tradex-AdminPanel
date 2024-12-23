import React, { Fragment, Dispatch, useState, useEffect } from "react";
import IntroManagementList from "./IntroManagementList";
import IntroManagementForm from "./IntroManagementForm";
import TopCard from "../../common/components/TopCard";
import "./IntroManagement.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IProductState, IStateType, IRootPageStateType } from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import { addNotification } from "../../store/actions/notifications.action";
import axios from 'axios';

const IntroManagement: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState = useSelector((state: IStateType) => state.products);
  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const [popup, setPopup] = useState(false);
  const [IsEdit, setIsEdit] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [selectedIntro, setSelectedIntro] = useState<any>(null);
  const [selectedIntroDelete, setSelectedIntroDelete] = useState<any>(null);

  // State for intro data
  const [intros, setIntros] = useState<any[]>([]);
  const [introCount, setIntroCount] = useState<number>(0);

  useEffect(() => {
    dispatch(updateCurrentPath("intro", "list"));

    // Fetch intro data from API
    axios.get('https://backend-tradex.onrender.com/admin/intro')
      .then(response => {
        console.log('API response:', response.data); // Debugging line
        if (response.data) {
          const introData = response.data;
          setIntros(introData);
          setIntroCount(introData.length);
        }
      })
      .catch(error => {
        console.error('Error fetching intro data:', error);
      });
  }, [dispatch]);

  function onIntroSelect(intro: any): void {
    setSelectedIntro(intro);
    setIsEdit(true)
    setPopup(true);
  }
  function addIntro() {
    setSelectedIntro([]);
    setIsEdit(false)
    setPopup(true);
  }

  function onIntroRemove() {
    if (selectedIntro) {
      setPopup(true);
    }
  }

  const handleDelete = async () => {
    if (selectedIntroDelete._id) {
      try {
        const response = await fetch(`https://backend-tradex.onrender.com/admin/intro/${selectedIntroDelete._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          dispatch(addNotification("Intro removed", `Intro ${selectedIntroDelete.introTitle} was removed successfully`));
          // Refresh intro data
          axios.get('https://backend-tradex.onrender.com/admin/intro')
            .then(response => {
              if (response.data) {
                const introData = response.data;
                setIntros(introData);
                setIntroCount(introData.length);
              }
            })
            .catch(error => {
              console.error('Error fetching intro data:', error);
            });
          setPopup2(false);
        } else {
          throw new Error("Failed to remove intro");
        }
      } catch (error) {
        console.error("Error removing intro:", error);
        dispatch(addNotification("Error", "Failed to remove intro"));
      }
    }
  };

  function callAPIUpdateData() {
    axios.get('https://backend-tradex.onrender.com/admin/intro')
      .then(response => {
        if (response.data) {
          const introData = response.data;
          setIntros(introData);
          setIntroCount(introData.length);
        }
      })
      .catch(error => {
        console.error('Error fetching intro data:', error);
      });
  }

  function onSelectDeleteUser(into: any) {
    setSelectedIntroDelete(into); //(user)
    setPopup2(true);
  }

  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Intro Management</h1>
      <p className="mb-4">All intros here</p>
      <div className="row">
        {/* Add a TopCard for Intro Count */}
        <TopCard title="INTRO COUNT" text={`${introCount}`} icon="info" class="info" />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Intro List</h6>
              <div className="header-buttons">
                <button className="btn btn-success btn-green" onClick={addIntro}>
                  <i className="fas fa fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <IntroManagementList
                onSelect={onIntroSelect}
                intros={intros}
                onSelectDelete={onSelectDeleteUser}
              />
            </div>
          </div>
        </div>
      </div>

      <Popup
        className="popup-modal-user"
        open={popup}
        onClose={() => setPopup(false)}
        closeOnDocumentClick
      >
        <IntroManagementForm
          intro={selectedIntro}
          onHide={() => setPopup(false)}
          callAPIUpdateData={callAPIUpdateData}
          IsEdit={IsEdit}
        />
      </Popup>

      <Popup
        className="popup-modal"
        open={popup2}
        onClose={() => setPopup2(false)}
        closeOnDocumentClick
      >
        <div className="popup-modal">
          <div className="popup-title">
            Are you sure?
          </div>
          <div className="popup-content">
            <button type="button"
              className="btn btn-danger"
              onClick={handleDelete}>Remove
            </button>
          </div>
        </div>
      </Popup>
    </Fragment>
  );
};

export default IntroManagement;
