import { Link } from "react-router-dom"

import { SubNav } from "../../../../../ui/nav/SubNav"
import { Rating } from "./../../mini_app/rating/Rating"

import { getPostfix } from "../../../../../utils/utils"

import { BtnSwitch } from "../../../../../ui/btn/BtnSwitch"
import { BtnDefault } from "../../../../../ui/btn/BtnDefault"

import "./style.sass"


export const AboutTitle = ({response, subNav}) => {

    return(
        <section className="title-data__section">
            <SubNav subNav={subNav}/>
            <div className="title-data__inner">
                <div className="title-data__about">
                    <div className="title-data__img-container">
                        <img className="title-data__img" src={`data:image/webp;base64,${response?.poster}`} alt="poster"/>
                    </div>
                    <div className="title-data__info">
                        <Rating title={response.title}/>
                        <h2 className="title-data__anime-title">
                            {response.title}
                        </h2>
                        <div className="title-data__age-shed">
                            <p className="title-data__age">
                                {response.age_restrict}
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
                                <dd>{response.type}</dd>
                            </div>
                            <div className="title-data__item">
                                <dt>Статус:</dt>
                                <dd>{response.status}</dd>
                            </div>
                            <div className="title-data__item">
                                <dt>Сезон:</dt>
                                <dd>{response.season}</dd>
                            </div>
                            <ul className="title-data__tag-list">
                                <li>Жанры:</li>
                                {response.genres.map(genre => {
                                    return (
                                        <Link 
                                            to={`/anime/genres/${genre}`} 
                                            key={genre} 
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
                                <dd>{response.year}</dd>
                            </div>
                            <div className="title-data__item">
                                <dt>Всего эпизодов:</dt>
                                <dd>
                                    {`${response.total_episode} `} 
                                    {getPostfix("эпизод", response.total_episode)}
                                </dd>
                            </div>
                            <div className="title-data__bottom">
                                <Link>

                                </Link>
                                <BtnSwitch>

                                </BtnSwitch>
                                <BtnDefault>

                                </BtnDefault>
                            </div>
                        </dl>
                    </div>
                </div>
                <p className="title-data__anime-description">
                    {response.description}
                </p>
            </div>
        </section>
    )
}
