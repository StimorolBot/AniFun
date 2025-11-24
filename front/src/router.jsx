import { createBrowserRouter } from "react-router-dom"

import { Root } from "./pages/root/Root"
import {Anime } from "./pages/root/Anime"

import { Home } from "./pages/Home"
import { Video } from "./pages/anime/Video"
import { TitleEpisodes } from "./pages/anime/TitleEpisodes"
import { Catalog } from "./pages/anime/Catalog"

import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { VerifyEmail } from "./pages/auth/VerifyEmail"
import { ResetPasswordToken } from "./pages/auth/ResetPasswordToken"
import { ResetPassword } from "./pages/auth/ResetPassword"
import { OAuthPage } from "./pages/auth/OAuthPage"

import { Error } from "./pages/Error"


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/root",
        children: [
            {
                path: "",
                element: <Root/>
            },
            {
                path: "anime",
                element: <Anime/>
            }
        ]
        
    },
    {
        path: "/anime",
        children: [
            {
                path: "releases",
                children: [
                    {
                        path: "latest",
                        element: <h2>Недавно добавленные</h2>
                    },
                    {
                        path: "release/:alias/episodes",
                        element: <TitleEpisodes/>
                    }
                ]
            },
            {
                path: "catalog",
                element: <Catalog/>
            },
            {
                path: "genres",
                children:[
                    {
                        path: "",
                        element: <h2>Жанры</h2>,
                    },
                    {
                        path: ":genre",
                        element: <h2>Жанр</h2>
                    }
                ]
            },
            {
                path: "announce",
                element: <h2>Анонсы</h2>
            },
            {
                path: "schedule",
                element: <h2>Расписание</h2>
            },
            {
                path: "franchises/:alias",
                element: <h2>Франшизы</h2>
            },
            {
                path:"video/episode/:uuid",
                element: <Video/>
            },
        ]
    },
    {
        path: "/users",
        children:[
            {
                path: "settings/:uuid",
                element: <h2>Настройки аккаунта</h2>
            }
        ]
    },
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path: "verify-email",
                element: <VerifyEmail/>
            },
            {
                path: "reset-password-token",
                element: <ResetPasswordToken/>
            },
            {
                path: "reset-password",
                element: <ResetPassword/>
            },
            {
                path: "oauth2",
                children: [
                    {
                        path: "uri-google",
                        element:<OAuthPage url={"auth/oauth2/auth-google"}/>
                    },
                    {
                        path: "uri-discord",
                        element: <OAuthPage url={"auth/oauth2/auth-discord"}/>
                    },
                    {
                        path: "uri-telegram",
                        element: <OAuthPage url={"auth/oauth2/auth-telegram"} isTelegram={true}/>
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Error/>,
    }
])
