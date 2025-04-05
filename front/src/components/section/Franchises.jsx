import { Link } from "react-router-dom"

import "./style/franchises.sass"


export function Franchises(){
    
    return(
        <section className="franchises">
            <div className="container">
                <Link to={"/franchises"}>
                    <h2 className="section__title">
                        Популярный франшизы
                    </h2>
                </Link>
                <ul className="franchises__list">
                    <li className="franchises__item">
                        <div className="franchises__bg-container">
                            <img className="franchises__bg" src="/public/gJGpAJbGiPppMGPAJ5duGTgQHmZxRmvZ.webp" alt="franchises" />
                        </div>
                        <div className="franchises__container">
                            <ul className="franchises__desc-list">
                                <li className="franchises__desc_title franchises__desc-item">
                                    Корзинка с фруктами
                                </li>
                                <li className="franchises__desc-item">
                                    Fruits Basket
                                </li>
                            </ul>
                            <ul className="franchises__desc-list">
                                <li className="franchises__desc-item">
                                    2019 — 2021
                                </li>
                                <li className="franchises__desc-item">
                                    4 сезона 64 эпизода
                                </li>
                                <li className="franchises__desc-item">
                                    1 день 2 часа 29 минут
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="franchises__item">
                        <div className="franchises__bg-container">
                            <img className="franchises__bg" src="/public/gJGpAJbGiPppMGPAJ5duGTgQHmZxRmvZ.webp" alt="franchises" />
                        </div>
                        <div className="franchises__container">
                            <ul className="franchises__desc-list">
                                <li className="franchises__desc_title franchises__desc-item">
                                    Корзинка с фруктами
                                </li>
                                <li className="franchises__desc-item">
                                    Fruits Basket
                                </li>
                            </ul>
                            <ul className="franchises__desc-list">
                                <li className="franchises__desc-item">
                                    2019 — 2021
                                </li>
                                <li className="franchises__desc-item">
                                    4 сезона 64 эпизода
                                </li>
                                <li className="franchises__desc-item">
                                    1 день 2 часа 29 минут
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="franchises__item">
                        <div className="franchises__bg-container">
                            <img className="franchises__bg" src="/public/gJGpAJbGiPppMGPAJ5duGTgQHmZxRmvZ.webp" alt="franchises" />
                        </div>
                        <div className="franchises__container">
                            <ul className="franchises__desc-list">
                                <li className="franchises__desc_title franchises__desc-item">
                                    Корзинка с фруктами
                                </li>
                                <li className="franchises__desc-item">
                                    Fruits Basket
                                </li>
                            </ul>
                            <ul className="franchises__desc-list">
                                <li className="franchises__desc-item">
                                    2019 — 2021
                                </li>
                                <li className="franchises__desc-item">
                                    4 сезона 64 эпизода
                                </li>
                                <li className="franchises__desc-item">
                                    1 день 2 часа 29 минут
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    )
}