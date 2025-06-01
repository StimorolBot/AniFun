import { memo } from "react"
import { useNavigate } from "react-router-dom"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"


export const BtnRandomAnime = memo(() => {
    const navigate = useNavigate()
    const [request, isLoading, error] = useFetch(
            async () => {
                await api.get("/random-title")
                .then((r) => {
                    navigate(`anime/releases/release/${r.data["alias"]}/episodes`)
                })
            }
        )

    return(
        <button className="btn-random-title" style={{"padding":0}} onClick={async () => await request()} title="Случайный релиз">
            <svg>
                <use xlinkHref="/main.svg#random-svg"/>
            </svg>
        </button>
    )
})
