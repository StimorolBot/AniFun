import { memo } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"
import { OAuthTelegram } from "./OAuthTelegram"

import "./style/oauth.sass"


export const OAuth = memo(() => {

    const [request, _] = useFetch(
        async (url) => {
            await api.get(`/auth/oauth2/${url}`).then((r) => window.location.href = r.data)
        }
    )
    
    return(
        <ul className="auth__oauth-list">
            <li className="auth__oauth-item">
                <button onClick={async () => await request("uri-google")}>
                    <svg>
                        <use xlinkHref="/public/main.svg#google-svg"/>
                    </svg>
                </button>
            </li>
            <li className="auth__oauth-item">
                <button onClick={async () => await request("uri-discord")}>
                    <svg>
                        <use xlinkHref="/public/main.svg#discord-svg"/>
                    </svg>
                </button>
            </li>
            <li className="auth__oauth-item">
                <OAuthTelegram basePath={"https://r72i08oj5fq0.share.zrok.io"}/> 
            </li>
        </ul>
    )
})
    