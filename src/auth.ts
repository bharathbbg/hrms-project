import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // Import the edge-safe config
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import Employee from "@/models/Employee";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ... imports (NextAuth, authConfig, Credentials, dbConnect, Employee, bcrypt, z)

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Inherit the Edge configuration
  providers: [
    Credentials({
      authorize: async (credentials) => {
        await dbConnect();
        
        const { email, password } = await loginSchema.parseAsync(credentials);
        const user = await Employee.findOne({ email }).select("+password");

        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // Return the object that goes into the JWT
        return { 
            id: user._id.toString(), 
            email: user.email, 
            name: `${user.firstName} ${user.lastName}`, // Ensure Name is constructed here
            role: user.role 
        };
      },
    }),
  ],
  // ADD THIS SECTION to explicitly handle data passing
  callbacks: {
    async jwt({ token, user }: any) {
      // 1. When user logs in, copy data from User object to the Token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name; 
      }
      return token;
    },
    async session({ session, token }: any) {
      // 2. When frontend checks session, copy data from Token to Session object
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name; 
      }
      return session;
    },
  }
});