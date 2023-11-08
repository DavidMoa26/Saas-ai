import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@/lib/db'
import User from '@/models/user'


const googleCredentials = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

if (!googleCredentials.clientId || !googleCredentials.clientSecret) {
  throw new Error('Missing google credentials')
}


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: googleCredentials.clientId,
      clientSecret: googleCredentials.clientSecret,
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      const sessionUser = await User.findOne({ email: session.user.email });
      if (sessionUser) {
        session.user.id = sessionUser._id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ profile }: any) {
      try {
        await connectDB();
        const userExists = await User.exists({ email: profile.email });
        if (!userExists) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
          });
        }

        return true
      } catch (error) {
        console.error(error);
        return false
      }
    },

  }

}

