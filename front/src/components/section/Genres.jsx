import { Link } from "react-router-dom"

import "./style/genres.sass"


export function Genres(){
    return(
        <section className="genres">
            <div className="container">
                <Link>
                    <h2 className="section__title">
                        Жанры
                    </h2>
                </Link>
                <ul className="genres__list">
                    <li className="genres__item">
                        <div className="genres__bg-container">
                            <img className="genres__bg" src="/public/uhQFwZzoHyzC6026wMbw99uuS9KHlXIy.webp" alt="genres-bg" />                            
                        </div>
                        <ul className="genres__desc-list">
                            <li className="genres__desc-item">
                                Музыка
                            </li>
                            <li className="genres__desc-item">
                                20 релизов
                            </li>
                        </ul>
                    </li>
                    <li className="genres__item">
                        <div className="genres__bg-container">
                            <img className="genres__bg" src="/public/uhQFwZzoHyzC6026wMbw99uuS9KHlXIy.webp" alt="genres-bg" />                            
                        </div>
                        <ul className="genres__desc-list">
                            <li className="genres__desc-item">
                                Музыка
                            </li>
                            <li className="genres__desc-item">
                                20 релизов
                            </li>
                        </ul>
                    </li>
                    <li className="genres__item">
                        <div className="genres__bg-container">
                            <img className="genres__bg" src="/public/uhQFwZzoHyzC6026wMbw99uuS9KHlXIy.webp" alt="genres-bg" />                            
                        </div>
                        <ul className="genres__desc-list">
                            <li className="genres__desc-item">
                                Музыка
                            </li>
                            <li className="genres__desc-item">
                                20 релизов
                            </li>
                        </ul>
                    </li>
                    <li className="genres__item">
                        <div className="genres__bg-container">
                            <img className="genres__bg" src="/public/uhQFwZzoHyzC6026wMbw99uuS9KHlXIy.webp" alt="genres-bg" />                            
                        </div>
                        <ul className="genres__desc-list">
                            <li className="genres__desc-item">
                                Музыка
                            </li>
                            <li className="genres__desc-item">
                                20 релизов
                            </li>
                        </ul>
                    </li>
                    <li className="genres__item">
                        <div className="genres__bg-container">
                            <img className="genres__bg" src="/public/uhQFwZzoHyzC6026wMbw99uuS9KHlXIy.webp" alt="genres-bg" />                            
                        </div>
                        <ul className="genres__desc-list">
                            <li className="genres__desc-item">
                                Музыка
                            </li>
                            <li className="genres__desc-item">
                                20 релизов
                            </li>
                        </ul>
                    </li>
                    <li className="genres__item">
                        <div className="genres__bg-container">
                            <img className="genres__bg" src="/public/uhQFwZzoHyzC6026wMbw99uuS9KHlXIy.webp" alt="genres-bg" />                            
                        </div>
                        <ul className="genres__desc-list">
                            <li className="genres__desc_title genres__desc-item">
                                Музыка
                            </li>
                            <li className="genres__desc-item">
                                20 релизов
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </section>
    )
}