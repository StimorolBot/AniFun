import { memo } from "react"


export const LinkTelegramAuth = memo(() => {

    const searchParams = new URLSearchParams({
        "bot_id": "5346665018",
        "request_access": "write",
        "origin": "https://r72i08oj5fq0.share.zrok.io",
        "return_to": "https://r72i08oj5fq0.share.zrok.io/auth/social/login-telegram",
        "embed": 1,
      });
      
    const url = "https://oauth.telegram.org/auth?" + searchParams.toString();

    return (
        <a className="link__telegram-auth" href={url}>
            <svg>
                <use xlinkHref="/main.svg#tg-svg"/>
            </svg>
        </a>
    )
})
