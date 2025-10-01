import { type DefaultSession, type NextAuthConfig } from "next-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    /**
     * Add authentication providers here when needed.
     * For example, GitHub, Google, etc.
     *
     * @see https://next-auth.js.org/providers
     */
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  // Handle JWT errors gracefully by clearing invalid sessions
  events: {
    signOut: () => {
      // Clear any cached sessions on sign out
    },
  },
  // Configure session strategy
  session: {
    strategy: "jwt",
  },
  // Use a different cookie name to avoid conflicts with old sessions
  cookies: {
    sessionToken: {
      name: "next-auth.session-token-v2",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} satisfies NextAuthConfig;
