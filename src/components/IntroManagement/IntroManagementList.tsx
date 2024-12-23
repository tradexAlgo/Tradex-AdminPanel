import React from "react";
import { IProduct } from "../../store/models/product.interface";

export type IntroListProps = {
  onSelect?: (intro: any) => void;
  onSelectDelete?: (intro: any) => void;
  intros: any[];
};

const IntroManagementList: React.FC<IntroListProps> = (props) => {
  console.log("props.introsprops.intros", props.intros)
  const introElements = React.useMemo(() => {
    return props.intros.map((intro: any, i: number) => (
      <tr
        className={`table-row ${props.onSelect ? "selectable" : ""}`}
        key={intro._id}
      >
        <th scope="row">{i + 1}</th>
        <td>
          <img
            src={intro.introBanner}
            alt={intro.introTitle}
            style={{ maxWidth: "100px", maxHeight: "60px" }}
          />
        </td>
        <td>{intro.introTitle}</td>
        <td>{intro.introDescription}</td>
        <td>{intro.introHashtags.join(", ")}</td>
        <td>
          <div className="mT10 btnStyle" style={{ display: "flex" }}>
            <button
              className="btn btn-success btn-green"
              onClick={() => props.onSelect && props.onSelect(intro)}
            >
              <i className="fas fa fa-pen"></i>
            </button>
            <button
              className="btn btn-success btn-red"
              onClick={() => props.onSelectDelete && props.onSelectDelete(intro)}
            >
              <i className="fas fa fa-times"></i>
            </button>
          </div>
        </td>
        {/* <td>{new Date(intro.createdAt).toLocaleDateString()}</td>
        <td>{new Date(intro.updatedAt).toLocaleDateString()}</td> */}
      </tr>
    ));
  }, [props.intros, props.onSelect, props.onSelectDelete]);

  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Banner</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Hashtags</th>
            <th scope="col">Actions</th>
            {/* <th scope="col">Created At</th> */}
            {/* <th scope="col">Updated At</th> */}
          </tr>
        </thead>
        <tbody>
          {introElements}
        </tbody>
      </table>
    </div>
  );
};

export default IntroManagementList;
