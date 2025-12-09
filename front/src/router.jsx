import { createBrowserRouter } from "react-router-dom"

import { Root } from "./pages/root/Root"
import {Anime } from "./pages/root/Anime"

import { Home } from "./pages/anime/home/Home"
import { Release } from "./pages/anime/release/Release"
import { Title } from "./pages/anime/title/Title"
import { Video } from "./pages/anime/video/Video"
import { NewEpisode } from "./pages/new_episode/NewEpisode"
import { Schedule } from "./pages/schedule/Schedules"

import { Genres } from "./pages/genre/genres/Genres"
import { Genre } from "./pages/genre/genre/Genre"

import { Franchises } from "./pages/franchise/franchises/Franchises"
import { Franchise } from "./pages/franchise/franchise/Franchise"

import { HomeUser } from "./pages/user/home/HomeUser"
import { Settings } from "./pages/user/settings/Settings"
import { Libs } from "./pages/user/libs/Libs"

import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { VerifyEmail } from "./pages/auth/VerifyEmail"
import { ResetPasswordToken } from "./pages/auth/ResetPasswordToken"
import { ResetPassword } from "./pages/auth/ResetPassword"
import { OAuthPage } from "./pages/auth/OAuthPage"

import { Error } from "./pages/error/Error"


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/anime",
        children: [
            {
                path: "",
                element: <Release/>
            },
            {
                path: ":alias",
                children: [
                    {
                        path: "",
                        element: <Title/>
                    },
                    {
                        path:"episode/:uuid",
                        element: <Video/>
                    }
                ]
            },
            {
                path: "new-episode",
                element: <NewEpisode/>
            },
            {
                path: "genres",
                children:[
                    {
                        path: "",
                        element: <Genres/>
                    },
                    {
                        path: ":genre",
                        element: <Genre/>
                    }
                ]
            },
            {
                path: "schedules",
                element: <Schedule/>
            },
            {
                path: "franchises",
                children: [
                    {
                        path: "",
                        element: <Franchises/>
                    },
                    {
                        path: ":alias",
                        element: <Franchise/>
                    }
                ]
            },
        ]
    },
    {
        path: "/users",
        children:[
            {
                path: ":uuid",
                children: [
                    {
                        path: "",
                        element: <HomeUser/>
                    },
                    {
                        path: "root",
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
                        path: "settings",
                        element: <Settings/> 
                    },
                    {
                        path: "libs",
                        element: <Libs/>
                    }

                ]
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
