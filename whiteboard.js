import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

// Import your isNoAuthEnabled function
import { isNoAuthEnabled } from 'path-to-your-function';

export default NextAuth({
  providers: [
    Providers.Okta({
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      domain: process.env.OKTA_DOMAIN,
    }),
    // ...other providers if needed
  ],

  callbacks: {
    async signIn(user, account, profile) {
      // Check if no authentication is required
      if (isNoAuthEnabled()) {
        // Bypass Okta login
        return true;
      }

      // Proceed with regular Okta authentication
      return account.provider === 'okta';
    },

    // ...other callbacks
  },

  // ...other NextAuth options
});
