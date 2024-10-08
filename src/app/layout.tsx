import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {AuthContextProvider} from "@/modules/auth/AuthContextProvider";
import React from "react";
import {NavBar} from "@/modules/nav/NavBar";
import Background from "@/modules/utils/Background/Background";
import {getLocale, getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Another To-Do list app",
    description: "Another To-Do list app but with special features and more complex codebase",
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    const locale = await getLocale();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <head>
            <title>Just Another To-do List App</title>
            <meta name="title" content="Just Another To-do List App"/>
            <meta name="description" content="A app for to-do's"/>

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="justanothertodolist.vercel.app"/>
            <meta property="og:title" content="Just Another To-do List App"/>
            <meta property="og:description" content="A app for to-do's"/>
            <meta property="og:image"
                  content="https://www.gstatic.com/android/keyboard/emojikitchen/20231113/u1f4da/u1f4da_u1f431.png?fbx"/>

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content="justanothertodolist.vercel.app"/>
            <meta property="twitter:title" content="Just Another To-do List App"/>
            <meta property="twitter:description" content="A app for to-do's"/>
            <meta property="twitter:image"
                  content="https://www.gstatic.com/android/keyboard/emojikitchen/20231113/u1f4da/u1f4da_u1f431.png?fbx"/>
        </head>
        <body className={"bg-[#1C1C21] text-white"}>
        <NextIntlClientProvider messages={messages}>
            <AuthContextProvider>
                <Background>
                    <div className={"flex"}>
                        <NavBar/>
                        <div className={"flex-grow lg:pb-0 pb-20"}>
                            {children}
                        </div>
                    </div>
                </Background>
            </AuthContextProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    )
        ;
}
