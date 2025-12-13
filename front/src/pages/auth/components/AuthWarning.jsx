import { memo } from "react"

import "./style/auth_warning.sass"


export const AuthWarning = memo(() => {
    return(
        <p className="auth__warning">
            Мы используем файлы cookies для более комфортной работы пользователя.
            <br/>
            Продолжая просмотр, Вы соглашаетесь с использованием файлов cookies
        </p>
    )
})