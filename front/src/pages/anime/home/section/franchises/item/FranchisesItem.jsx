import { Link } from "react-router-dom"
import { getPostfix } from "../../../../../../utils/utils"

import "./style.sass"


export function FranchisesItem({item, imgData, ...props}){

    return(
        <li className="franchises__item" {...props}>
            <Link className="franchises__link" to={`anime/franchises/${item?.sequel_uuid}`}>
                <div className="franchises__bg-container">
                    <img className="franchises__bg" src={imgData} loading="lazy" alt="franchises" />
                </div>
                <div className="franchises__container">
                    <h3 className="franchises__desc_title">
                        {item?.title}
                    </h3>
                    <ul className="franchises__desc-list">
                        <li className="franchises__desc-item">
                            {item.start_year} - {item.end_year}
                        </li>
                        <li className="franchises__desc-item">
                            <span>
                                {item.seasons_count} {getPostfix("сезон", item.seasons_count)}
                            </span>
                            <span>
                                {item.total_episodes} {getPostfix("эпизод", item.total_episodes)}
                            </span>
                        </li>
                    </ul>
                </div>
            </Link>
        </li>
    )
}
