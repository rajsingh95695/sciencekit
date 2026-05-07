import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import { createSession } from "@/lib/auth";
import { connectToDB } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          await connectToDB();

          // Check if user exists with this email
          let existingUser = await User.findOne({ email: profile.email });

          if (existingUser) {
            // User exists, link Google account if not already linked
            if (!existingUser.googleId) {
              existingUser.googleId = profile.sub;
              existingUser.provider = "google";
              if (profile.picture && !existingUser.profileImage) {
                existingUser.profileImage = profile.picture;
              }
              await existingUser.save();
            }
          } else {
            // Create new user
            existingUser = new User({
              name: profile.name || profile.email.split("@")[0],
              email: profile.email,
              provider: "google",
              googleId: profile.sub,
              profileImage: profile.picture,
              role: "user",
              password: null, // No password for Google users
            });
            await existingUser.save();
          }

          // Store user ID and role in token for session callback
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        try {
          await connectToDB();
          const user = await User.findById(token.sub);
          if (user) {
            // Create JWT session using existing auth system
            await createSession(user);

            session.user.id = user._id.toString();
            session.user.role = user.role;
          }
        } catch (error) {
          console.error("Error creating session:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;