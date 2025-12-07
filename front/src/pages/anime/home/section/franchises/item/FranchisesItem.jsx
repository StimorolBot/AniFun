import { Link } from "react-router-dom"

import "./style.sass"


export function FranchisesItem({item, ...props}){

    return(
        <li className="franchises__item" {...props}>
            <Link className="franchises__link" to={`anime/franchises/${item?.alias}`}>
                <div className="franchises__bg-container">
                    <img className="franchises__bg" src={`data:image/webp;base64,${item?.poster}`} loading="lazy" alt="franchises" />
                </div>
                <div className="franchises__container">
                    <h3 className="franchises__desc_title">
                        {item?.title}
                    </h3>
                </div>
            </Link>
        </li>
    )
}
