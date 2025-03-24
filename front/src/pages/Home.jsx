import { Footer } from "../components/ui/footer/Footer"
import { Header } from "../components/ui/headers/Header"
import { Genres } from "../components/section/Genres"
import { ComingSoon } from "../components/section/ComingSoon"
import { Franchises } from "../components/section/Franchises"
import { NewEpisodes } from "../components/section/NewEpisodes"
import { SwiperCustom } from "../components/ui/swiper/SwiperCustom"
import { Announcements } from "../components/section/Announcements"


export function Home(){
    return(
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
                <Announcements/>
            </main>
            <Footer/>            
        </div>
    )
}
