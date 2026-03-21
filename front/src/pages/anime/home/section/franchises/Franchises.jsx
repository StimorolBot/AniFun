import { useRef } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { WrapperSection } from "../../../wrapper/WrapperSection"
import { FranchisesItem } from "./item/FranchisesItem"
import { Loader } from "../../../../../components/loader/Loader"

import { franchisesCache, franchisesPosterCache } from "../../../../../query_key"
import "./style.sass"


export function Franchises(){
    const transitionRef = useRef()

    const {data: FranchisesData = [], isLoading} = useQuery({
        queryKey: [franchisesCache],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get("/franchises").then(r => r.data)
        }
    })

    const imgData = useQueries({
        queries: FranchisesData?.map(item => ({
            queryKey: [franchisesPosterCache, item.poster_uuid],
            staleTime: 1000 * 60 * 3,
            queryFn: async () => {
                return await api.get(`/s3/anime-${item.title_uuid}/${item.poster_uuid}`).then(r => r.data)
            }
        }))
    })

    return(
        <section className="franchises">
            <div className="container">
                <WrapperSection title={"Франшизы"} link={"/anime/franchises"} ref={transitionRef} value={isLoading}>
                    <div className="transition" ref={transitionRef}>
                        {isLoading
                            ? <Loader/>
                            : <ul className="franchises__list">                    
                                {FranchisesData?.map((item, index) => {
                                    return <FranchisesItem item={item} imgData={imgData[index].data} key={index}/>
                                })}  
                            </ul> 
                        }
                    </div>
                </WrapperSection>
            </div>
        </section>
    )
}
