import prisma from '@/lib/prisma'
import { ErrorCode, verifyPassword } from '@/utils'
import NextAuth, { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        // error: '/auth/error', // Error code passed in query string as ?error=
    },
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'invee',
            type: 'credentials',
            credentials: {
                email: { label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com' },
                password: { label: 'Password', type: 'password', placeholder: 'Your super secure password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    console.error(`For some reason credentials are missing`)
                    throw new Error(ErrorCode.InternalServerError)
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase(),
                    },
                })

                if (!user) {
                    throw new Error(ErrorCode.UserNotFound)
                }

                if (!user.passwordHash) {
                    throw new Error(ErrorCode.UserMissingPassword)
                }

                const isCorrectPassword = await verifyPassword(credentials.password, user.passwordHash)
                if (!isCorrectPassword) {
                    throw new Error(ErrorCode.IncorrectPassword)
                }

                return {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.name
                token.avatarUrl = user.avatarUrl
            }
            return token
        },
        async session({ session, token }) {
            const userSession: Session = {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    name: token.username as string,
                    avatarUrl: token.avatarUrl as string,
                },
            }
            return userSession
        },
    },
})
