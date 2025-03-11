from email.message import EmailMessage


def email_confirm(email: EmailMessage, token: str):
    email["Subject"] = "Регистрация новой учетной записи"

    email.set_content(f"""
    <table style="
        width: 100%;
        background-color:#121212;
        color:#858484;
        font-size: 14px;"
    >
        <tbody>
            <tr style="vertical-align:top;">
                <td style="text-align:center;">
                    <div style="margin:15px 0;">
                        <img src="" alt="logo">
                    </div>
                    <div style="margin-top: 15px;">
                        Попытка регистрации учетной записи на
                        <a href="#" style="color:#fe3635; font-weight: 900;">
                            AniFun
                        </a>
                    </div>
                    <div>
                        Чтобы подтвердить учетную запись и авторизоваться  на сайте, введите одноразовый токен.
                    </div>
                    <div style="
                        background-color:#1d1d1d;
                        border-radius:12px;
                        padding:30px;
                        font-size:30px;
                        font-weight:700;
                        color:#ffffff;
                        text-align:center;
                        max-width:320px;
                        margin:20px auto;
                    ">
                        {token}
                    </div>
                    <div>
                        Токен действителен в течение 3 минут.
                        <br/>
                        Пожалуйста, скопируйте и впишите этот токен в форме подтверждения учетной записи.
                    </div>
                    <div style="margin-top:15px;">
                        Если Вы этого не делали, то просто проигнорируйте это письмо.
                        <br>
                        Если у Вас возникнут какие-либо вопросы, свяжитесь с нашей службой поддержки через бота в Telegram: 
                        <a href="#" style="color:#fe3635;">
                            @AniFunBot
                        </a>
                    </div>
                    <table style="width: 100%; margin: 15px 0;">
                        <tbody style="text-align: center;">
                            <tr>
                                <td>
                                    <a href="#">
                                        <img src="" alt="discord">
                                    </a>
                                    <a href="#" style="margin: 0 15px;">
                                        <img src="" alt="telegram">
                                    </a>
                                    <a href="#">
                                        <img src="" alt="youtube">
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    """, subtype="html")
    return email


def reset_password(email: EmailMessage, token: str):
    email["Subject"] = "Сброс пароля"

    email.set_content(f"""
        <div>{token}</div>
    """, subtype="html")
    return email
