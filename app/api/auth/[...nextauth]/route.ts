import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from '@/lib/db'
import User from '@/models/user'


const googleCredentials = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}

if (!googleCredentials.clientId || !googleCredentials.clientSecret) {
  throw new Error('Missing google credentials')
}

const handler = NextAuth({
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
    async signIn({ profile }: any) {
      console.log(profile);
      try {
        await connectDB();
        const userExists = await User.exists({ email: profile.email });
        if (!userExists) {
          await User.create({
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
          });
        }

        return true
      } catch (error) {
        console.error(error);
        return false
      }
    },

  }

})

export { handler as GET, handler as POST }