import { Link } from "react-router-dom"

import { SubNav } from "../../../../../ui/nav/SubNav"
import { Rating } from "./../../mini_app/rating/Rating"

import { getPostfix } from "../../../../../utils/utils"

import "./style.sass"


export const AboutTitle = ({titleData, imgData}) => {
    const subNav = [
        {
            "name": "Главная страница",
            "path": "/"
        },
        {
            "name": "Аниме",
            "path": "/anime/"
        },
        {
            "name": titleData.anime.title,
            "path": "#"
        }
    ]

    return(
        <section className="title-data__section">
            <SubNav subNav={subNav}/>
            <div className="title-data__inner">
                <div className="title-data__about">
                    <div className="title-data__img-container">
                        <img className="title-data__img" src={imgData} alt="poster"/>
                    </div>
                    <div className="title-data__info">
                        <Rating title={titleData.anime.title}/>
                        <h2 className="title-data__anime-title">
                            {titleData.anime.title}
                        </h2>
                        <div className="title-data__age-shed">
                            <Link>
                                <p className="title-data__age">
                                    {titleData.anime.age_restrict.label}
                                </p>
                            </Link>
                            {titleData.anime.release_day &&
                                <Link 
                                    className="title-data__link" to={"/anime/schedules"}
                                    state={{ releaseDay: titleData.anime.release_day.value }}
                                >
                                    {titleData.anime.release_day.label}
                                </Link>
                            }
                        </div>
                        <dl className="title-data__list">
                            <div className="title-data__item">
                                <dt>Тип:</dt>
                                <Link>
                                    <dd>{titleData.anime.type.label}</dd>
                                </Link>
                            </div>
                            <div className="title-data__item">
                                <dt>Статус:</dt>
                                <Link>
                                    <dd>{titleData.anime.status.label}</dd>
                                </Link>
                            </div>
                            <div className="title-data__item">
                                <dt>Сезон:</dt>
                                <Link>
                                    <dd>{titleData.anime?.season.label}</dd>
                                </Link>
                            </div>
                            <ul className="title-data__tag-list">
                                <li>Жанры:</li>
                                {titleData.anime.genres.map(genre => {
                                    return (
                                        <Link className="title=link"
                                            to={`/anime/genres/${genre.value}`} 
                                            state={genre.value}
                                            key={genre.value}
                                        > 
                                            <li className="title-data__tag-item">
                                                {genre.label}
                                            </li>
                                        </Link>
                                    )    
                                })}
                            </ul>
                            <div className="title-data__item">
                                <dt>Год выхода:</dt>
                                <Link>
                                    <dd>{titleData.anime.year}</dd>
                                </Link>
                            </div>
                            <div className="title-data__item">
                                <dt>Всего эпизодов:</dt>
                                <dd>
                                    {`${titleData.anime.total_episode} `} 
                                    {getPostfix("эпизод", titleData.anime.total_episode)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <p className="title-data__anime-description">
                    {titleData.anime.description}
                </p>
            </div>
        </section>
    )
}
