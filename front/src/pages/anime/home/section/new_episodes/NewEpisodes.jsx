import { memo, useRef } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { EpisodeItem } from "./item/EpisodeItem"
import { WrapperSection } from "../../../wrapper/WrapperSection"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const NewEpisodes= memo(() => {
  const transitionRef = useRef()

  const {data: episodeData, isLoading, error} = useQuery({
    queryKey: ["new-episode"],
    staleTime: 1000 * 60 * 3,
    retry: false,
    queryFn: async () => {
      return await api.get("/new-episode", {params: {"limit": 6}}).then(r => r.data)
    },
    placeholderData: []
  })
 
  const imgData = useQueries({
    queries: episodeData?.map(item => ({
      queryKey: ["new-episode-poster", item.anime.poster.poster_uuid],
      staleTime: 1000 * 60 * 3,
      queryFn: async () => {
        return await api.get(`/s3/anime-${item.anime.uuid}/${item.anime.poster.poster_uuid}`).then(r => r.data)
      }
    }))
  })
  
  return(
    <section className="new-episodes">
      <div className="container">
        <WrapperSection title={"Новые эпизоды"} link={"anime/new-episode"} ref={transitionRef} value={isLoading}>
          <div className="container-new-episodes transition" ref={transitionRef}>
            { isLoading
              ? <Loader/>
              : <ul className="episode__list">
                {episodeData?.map((item, index) => {
                  return <EpisodeItem item={item} imgData={imgData[index].data} key={index} />
                })}
              </ul>
            }
          </div>
        </WrapperSection>
      </div>
    </section>
  )
})
