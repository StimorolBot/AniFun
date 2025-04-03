import { memo } from "react"
import { LoginButton } from "@telegram-auth/react"


import { useFetch } from "../../hook/useFetch"
import { api } from "../../../config/api"


export const BtnTelegramAuth = memo(() => {

    const [r] = useFetch(
        async (data) =>{
            await api.post("/auth/social/auth-telegram", data)
        }       
    )


    return (
        <button className="btn-telegram-auth">
            <LoginButton
                botUsername={"Aharen_San_Bot"}
                buttonSize="large"
                cornerRadius={5}
                showAvatar={false}
                lang="ru"
                onAuthCallback={(data) => {
                    console.log(data);
                    r(data)
                }}
                
            />
        </button>
    )

})

import "./style/btn_telegram_auth.sass"

{/* <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="" data-size="small" data-radius="10" data-auth-url="http://localhost:5173/auth/social/login-telegram" data-request-access="write"></script>  */}



