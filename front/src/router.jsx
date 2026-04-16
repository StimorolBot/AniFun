import { createBrowserRouter } from "react-router-dom"

import { Login } from "./pages/auth/page/Login"
import { OAuthPage } from "./pages/auth/page/OAuthPage"
import { Register } from "./pages/auth/page/Register"
import { ResetPassword } from "./pages/auth/page/ResetPassword"
import { ResetPasswordToken } from "./pages/auth/page/ResetPasswordToken"
import { VerifyEmail } from "./pages/auth/page/VerifyEmail"

import { Home } from "./pages/anime/home/Home"
import { Release } from "./pages/anime/release/Release"
import { Title } from "./pages/anime/title/Title"
import { Video } from "./pages/anime/video/Video"

import { Franchise } from "./pages/franchise/franchise/Franchise"
import { Franchises } from "./pages/franchise/franchises/Franchises"

import { Schedule } from "./pages/schedule/Schedules"

import { Genre } from "./pages/genre/genre/Genre"
import { Genres } from "./pages/genre/genres/Genres"

import { NewEpisode } from "./pages/new_episode/NewEpisode"

import { RootAnime } from "./pages/root/anime/RootAnime"
import { Root } from "./pages/root/home/Root"

import { User } from "./pages/user/User"

import { Error } from "./pages/error/Error"

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/anime",
		children: [
			{
				path: "",
				element: <Release />,
			},
			{
				path: ":alias",
				children: [
					{
						path: "",
						element: <Title />,
					},
					{
						path: "episode/:uuid",
						element: <Video />,
					},
				],
			},
			{
				path: "new-episode",
				element: <NewEpisode />,
			},
			{
				path: "genres",
				children: [
					{
						path: "",
						element: <Genres />,
					},
					{
						path: ":genre",
						element: <Genre />,
					},
				],
			},
			{
				path: "schedules",
				element: <Schedule />,
			},
			{
				path: "franchises",
				children: [
					{
						path: "",
						element: <Franchises />,
					},
					{
						path: ":alias",
						element: <Franchise />,
					},
				],
			},
		],
	},
	{
		path: "/users/:userUuid",
		element: <User />,
	},
	{
		path: "/root",
		children: [
			{
				path: "",
				element: <Root />,
			},

			{
				path: "anime",
				element: <RootAnime />,
			},
		],
	},
	{
		path: "/auth",
		children: [
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "verify-email",
				element: <VerifyEmail />,
			},
			{
				path: "reset-password-token",
				element: <ResetPasswordToken />,
			},
			{
				path: "reset-password",
				element: <ResetPassword />,
			},
			{
				path: "oauth2",
				children: [
					{
						path: "uri-google",
						element: <OAuthPage url={"auth/oauth2/auth-google"} />,
					},
					{
						path: "uri-discord",
						element: <OAuthPage url={"auth/oauth2/auth-discord"} />,
					},
					{
						path: "uri-telegram",
						element: (
							<OAuthPage
								url={"auth/oauth2/auth-telegram"}
								isTelegram={true}
							/>
						),
					},
				],
			},
		],
	},
	{
		path: "*",
		element: <Error />,
	},
])
