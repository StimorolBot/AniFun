import { memo } from "react"

import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../api"

import "../style/search_item.sass"


export const SearchItem = memo(({item, ...props}) => {
    
    const {data: imgData} = useQuery({
        queryKey: ["search-title-poster"],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get(`/s3/anime-${item.uuid}/${item.poster.poster_uuid}`).then(r => r.data)
        }
    })
    
    return(
        <li className="search-popup__item transition" {...props}>
            <Link className="search-popup__link" to={`/anime/${item?.alias}`}>
                <div className="search-popup__img-inner">
                    <img className="search-popup__img" src={imgData} alt="poster" />
                </div>
                <div className="search-popup__content">
                    <p className="search-popup__title">
                        {item.title}
                    </p>
                    <ul className="search-popup__bottom">
                        <li>
                            {item.year}
                        </li>
                        <li>
                            {item.type?.label}
                        </li>
                    </ul>
                </div>
            </Link>
        </li>
    )
})
