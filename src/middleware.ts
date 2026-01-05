import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Initialize NextAuth with ONLY the edge-safe config for middleware usage
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Logic is now handled inside authConfig.callbacks.authorized
  // So this wrapper function is just needed to initialize the middleware
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};