import { useRef, useState } from "react"

import Masonry from "react-masonry-css"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { WrapperSection } from "../../../wrapper/WrapperSection"
import { ComingSoonItem } from "./item/ComingSoonItem"

import { SwitchDay } from "./ui/SwitchDay"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const ComingSoon = () => {
    const transitionRef = useRef()
    const [schedule, setSchedule] = useState("today")
    
    const {data: scheduleData, isLoading, error} = useQuery({
        queryKey: ["schedule", schedule],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get("/schedules", {params: {"schedule": schedule}}).then(r => r.data)
        },
        placeholderData: []
    })

    const imgData = useQueries({
        queries: scheduleData?.map(item => ({
            queryKey: ["schedule-poster", item.anime.poster.poster_uuid],
            staleTime: 1000 * 60 * 3,
            queryFn: async () => {
                return await api.get(`/s3/anime-${item.anime.uuid}/${item.anime.poster.poster_uuid}`).then(r => r.data)
            }
        }))
    })

    const breakpoints = {
        default: 4,
        1280: 3,
        880: 2,
        590: 1
    }

    return(
        <section className="coming-soon">
            <div className="container">
                <WrapperSection title={"Расписание релизов"} link={"/anime/schedules"} ref={transitionRef} value={isLoading}>
                    <>
                        <div className="switch-day__wrapper">
                            <SwitchDay value={schedule} setValue={setSchedule}/> 
                        </div>
                        <div className="container-coming-soon transition" ref={transitionRef}>
                            { isLoading
                                ? <Loader/>
                                : scheduleData.length >= 1 
                                    ? <Masonry breakpointCols={breakpoints} className="masonry" columnClassName="masonry__column">
                                        {scheduleData?.map((item, index) => {
                                            return <ComingSoonItem item={item} imgData={imgData[index].data} key={index}/>
                                        })}
                                    </Masonry>
                                    :<p className="coming-soon__empty">
                                        К сожалению, в ближайшее время новых серий не ожидается :( 
                                    </p>
                            }
                        </div>
                    </>                
                </WrapperSection>        
            </div>
        </section>
    )
}
