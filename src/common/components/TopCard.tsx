import React, { PropsWithChildren, ReactElement } from "react";
import { ICardProperties } from "../types/TopCard.types";

function TopCard(props: PropsWithChildren<ICardProperties>): ReactElement {
    const borderColorClass = props.status === 'profit' ? 'border-left-success' : props.status === 'loss' ? 'border-left-danger' : `border-left-${props.class}`;
    const textColorClass = props.status === 'profit' ? 'text-success' : props.status === 'loss' ? 'text-danger' : 'text--gray-800';
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={`card ${borderColorClass} shadow h-100 py-2 `}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={`text-xs font-weight-bold text-${!props.class || "green"} ${textColorClass} text-uppercase mb-1`}>{props.title}</div>
                            <div className={`h5 mb-0 font-weight-bold text-gray-800 ${textColorClass}`}>{props.text}</div>
                        </div>
                        <div className="col-auto">
                            <i className={`fas fa-${props.icon} fa-2x text-gray-300 ${textColorClass}`}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default TopCard;
