import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // The "authorized" callback runs in Middleware (Edge)
    // It MUST NOT use Mongoose or Bcrypt
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');

      if (isOnLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true; 
      }

      if (isOnLoginPage) return true; 

      if (isLoggedIn) return true;

      return false; 
    },
    // JWT/Session callbacks are usually safe here too
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Keep this empty for now! We add providers in the Node file.
} satisfies NextAuthConfig;