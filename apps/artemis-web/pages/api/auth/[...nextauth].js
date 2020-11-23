import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const ldap = require("ldapjs");

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    }),
    Providers.Credentials({
      name: "LDAP",
      authorize: async () => {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: process.env.LDAP_URI,
        });

        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          client.bind("cn=admin,dc=planetexpress,dc=com", "GoodNewsEveryone", (err) => {
            if (err) {
              console.error(err);
              reject();
            } else {
              console.log("Binded");
            }
          });
          let entries = [];
          client.search("ou=people,dc=planetexpress,dc=com", {filter: "(uid=bender)", scope: "sub"}, (err, res) => {
            if (err) {
              console.error(err);
              reject();
            }

            res.on('searchEntry', function (entry) {
              var r = entry.object;
              entries.push(r);
              console.log('search find one user');
              console.log(entries); 
            });
        
            res.on('error', function (err) {
              reject(err);
            });
        
            res.on('end', function (result) {
              resolve(entries);
            });
          })
        });
      },
    }),
  ],

  session: {
    jwt: true,
    secret: process.env.JWT_SECRET
  },

  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGODB_URI,

  secret: process.env.HASH_SECRET,

  callbacks: {
    session: async (session, user) => {
      const val = { ...session, user: user }
      console.log("Session", val)
      return Promise.resolve(val)
    },

    jwt: async (token, user, account, profile, isNewUser) => {
      console.log("Token", token)
      console.log("User", user)
      console.log("Account", account)
      console.log("Profile", profile)
      return Promise.resolve(token)
    }
  }
};

export default (req, res) => NextAuth(req, res, options);
