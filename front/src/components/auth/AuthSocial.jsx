import { memo } from "react"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"
import { LinkTelegramAuth } from "../../ui/link/LinkTelegramAuth"

import "./style/auth_social.sass"


export const AuthSocial = memo(() => {

    const [request, isLoading, error] = useFetch(
        async (url) => {
            await api.get(`/auth/social/login-${url}`).then((r) => window.location.href = r.data)
        }
    )
    
    return(
        <ul className="auth__social-list">
            <li className="auth__social-item">
                <button className="auth__social-link" onClick={async () => await request("google")}>
                    <svg>
                        <use xlinkHref="/public/main.svg#google-svg"/>
                    </svg>
                </button>
            </li>
            <li className="auth__social-item">
                <button className="auth__social-link" onClick={async () => await request("discord")}>
                    <svg>
                        <use xlinkHref="/public/main.svg#discord-svg"/>
                    </svg>
                </button>
            </li>
            <li className="auth__social-item">
                <LinkTelegramAuth/> 
            </li>
        </ul>
    )
})
    