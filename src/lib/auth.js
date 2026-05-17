import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { jwt } from "better-auth/plugins";

const client = process.env.MONGO_URI
  ? new MongoClient(process.env.MONGO_URI)
  : null;
const db = client ? client.db("silentium") : null;
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 24 * 60 * 60,
  //     strategy: "jwt",
  //   },
  // },
  // plugins: [jwt()],
});
