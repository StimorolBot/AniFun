
import { useContext } from "react"
import { Link } from "react-router-dom"

import { SubNav } from "../../ui/nav/SubNav"
import { Rating } from "../rating/Rating"
import { LinkWatch } from "../../ui/link/LinkWatch"
import { BtnAddFavorite } from "../../ui/btn/BtnAddFavorite"

import { getPostfix } from "../../utils/utils"
import { GenresContext } from "../../context/GenresContext"

import "./style/title_data.sass"


export const TitleData = ({response, subNav}) => {
    const {_, setGenresContext} = useContext(GenresContext)
    
    return(
        <section className="title-data__section">
            <SubNav subNav={subNav}/>
            <div className="title-data__inner">
                <div className="title-data__about">
                    <div className="title-data__img-container">
                        <img className="title-data__img" src={`data:image/webp;base64,${response?.poster}`} alt="poster"/>
                    </div>
                    <div className="title-data__info">
                        <Rating title={response.data.title}/>
                        <h2 className="title-data__anime-title">
                            {response.data.title}
                        </h2>
                        <div className="title-data__age-shed">
                            <p className="title-data__age">
                                {response.data.age_restrict}
                            </p>
                            {response?.day_week &&
                                <p className="title-data__shed">
                                    {response.day_week}
                                </p>
                            }
                        </div>
                        <dl className="title-data__list">
                            <div className="title-data__item">
                                <dt>Тип:</dt>
                                <dd>{response.data.type}</dd>
                            </div>
                            <div className="title-data__item">
                                <dt>Статус:</dt>
                                <dd>{response.data.status}</dd>
                            </div>
                            <div className="title-data__item">
                                <dt>Сезон:</dt>
                                <dd>{response.data.season}</dd>
                            </div>
                            <ul className="title-data__tag-list">
                                <li>Жанры:</li>
                                {response.genres.map(genre => {
                                    return (
                                        <Link 
                                            to={"/anime/catalog"} 
                                            key={genre} 
                                            onClick={() => setGenresContext(genre)}
                                        > 
                                            <li className="title-data__tag-item">
                                                {genre}
                                            </li>
                                        </Link>
                                    )    
                                })}
                            </ul>
                            <div className="title-data__item">
                                <dt>Год выхода:</dt>
                                <dd>{response.data.year}</dd>
                            </div>
                            <div className="title-data__item">
                                <dt>Всего эпизодов:</dt>
                                <dd>
                                    {`${response.data.total_episode} `} 
                                    {getPostfix("эпизод", response.data.total_episode)}
                                </dd>
                            </div>
                            <div className="title-data__bottom">
                                <LinkWatch alias={`/anime/video/episode/${response?.uuid}}`}>
                                    Смотреть с 1 эпизода
                                </LinkWatch>
                                <BtnAddFavorite/>
                            </div>
                        </dl>
                    </div>
                </div>
                <p className="title-data__anime-description">
                    {response.data.description}
                </p>
            </div>
        </section>
    )
}
