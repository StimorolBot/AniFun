import { Helmet } from "react-helmet"

import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"

import { SwiperCustom } from "./section/swiper/SwiperCustom"
import { NewEpisodes } from "./section/new_episodes/NewEpisodes"
import { ComingSoon } from "./section/coming_soon/ComingSoon"
import { Franchises } from "./section/franchises/Franchises"
import { Genres } from "./section/genres/Genres"


export const Home = () => {
    return(
    <>
        <Helmet>
            <title>AniFun</title>
        </Helmet>
        <div className="wrapper">
            <Header/>
            <main className="main">
                <h1 className="title-page"> 
                    Главная страница 
                </h1>
                <SwiperCustom/>
                <NewEpisodes/> 
                <ComingSoon/>
                <Franchises/>
                <Genres/>
            </main>
            <Footer/>            
        </div>
    </>
    )
}
