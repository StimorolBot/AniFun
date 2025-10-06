import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"

import { SwiperCustom } from "../components/swiper/SwiperCustom"
import { LastEpisodes } from "../module/LastEpisodes"
import { Helmet } from "react-helmet"
import { ComingSoon } from "../module/ComingSoon"
import { Franchises } from "../module/Franchises"
import { Genres } from "../module/Genres"


export function Home(){
    return(<>
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
                <LastEpisodes/>
                <ComingSoon/>
                <Franchises/>
                <Genres/>
            </main>
            <Footer/>            
        </div></>
    )
}
