import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { lacbel: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          const {username, password} = credentials as any
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_API_ENDPOINT}/auth/login`,
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    username,   
                    password
                })
            }
          )
          const user = await res.json()
          if (res.ok && user){
            return user.data
          }
          else return null
           
        }
      })
  ],
  session: {
    strategy:"jwt"
  },
  pages: {
    signIn: '/signin'
  },
  callbacks:{
    async jwt({token, user}){
        return {...token, ...user}
    },
    async session({session, token, user}){
        session.user  = token
        return session
    }
  }
}

export default NextAuth(authOptions)