import { memo } from "react"
import { Link } from "react-router-dom"
import { BtnAddFavorite } from "../../ui/btn/BtnAddFavorite"

import "./style/catalog_item.sass"


export const CatalogItem = memo(({item}) => {

    return(
        <li className="catalog__item">
            <Link className="catalog__link" to={`/anime/releases/release/${item?.alias}/episodes`}>
                <div className="catalog__img-container">
                    <img className="catalog__img" src={`data:image/webp;base64,${item?.img_rs?.poster}`} alt="poster"/>
                </div>
                <div className="catalog__item-info">
                    <h3 className="catalog__item-title">
                        {item?.title}
                    </h3>
                    <div className="catalog__item-container">
                        <ul className="catalog__desc-list">
                            {item?.genres_rs?.map((genre, index) => {
                                return(
                                    <li key={index}>
                                        {genre["genres"]}
                                    </li>
                                )
                            })}
                        </ul>
                        <ul className="catalog__desc-list">
                            <li>
                                {item?.year}
                            </li>
                            <li>
                                {item?.season}
                            </li>
                            <li>
                                {item?.type}
                            </li>
                            <li>
                                {item?.age_restrict}
                            </li>
                        </ul>
                    </div>
                    <p className="catalog__item-description">
                        {item?.description}
                    </p>
                    <div className="catalog__btn-container">
                        <BtnAddFavorite title={item?.title}/>                
                    </div>  
                </div>
        </Link>
    </li>
    )
})
