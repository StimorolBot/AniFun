import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"

import { SwiperCustom } from "../components/swiper/SwiperCustom"
import { LastEpisodes } from "../module/LastEpisodes"
import { ComingSoon } from "../module/ComingSoon"
import { Franchises } from "../module/Franchises"
import { Genres } from "../module/Genres"
import { Announcements } from "../module/Announcements"


export function Home(){
    return(
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
                <Announcements/>
            </main>
            <Footer/>            
        </div>
    )
}
