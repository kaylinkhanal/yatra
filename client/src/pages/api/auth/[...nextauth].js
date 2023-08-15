
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


export const auths = {
    provider: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ]

}


export default NextAuth(auths);

