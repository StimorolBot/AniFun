import { createBrowserRouter } from "react-router-dom"

import { Home } from "./pages/Home"
import { Error } from "./pages/Error"

import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { ResetPassword } from "./pages/auth/ResetPassword"

import { VerifyEmail } from "./pages/auth/VerifyEmail"
import { ResetPasswordToken } from "./pages/auth/ResetPasswordToken"

import { SocialAuth } from "./pages/auth/social/SocialAuth"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
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
                path: "reset-password",
                element: <ResetPassword/>
            },
            {
                path: "reset-password-token",
                element: <ResetPasswordToken/>
            },
            {
                path: "social",
                children:[
                    {
                        path: "login-google",
                        element:<SocialAuth url={"auth/social/auth-google"}/>
                    },
                    {
                        path: "login-discord",
                        element:<SocialAuth url={"auth/social/auth-discord"}/>
                    },
                    {
                        path: "login-telegram",
                        element:<SocialAuth url={"auth/social/auth-telegram"}/>
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

export default router
