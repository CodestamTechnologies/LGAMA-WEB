
import { connectToDB } from "@/lib/connectToDb";
import User from "@/lib/UserModel";
import { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google"

export const authOptions: AuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })

    ],
    callbacks: {
        async signIn({ profile }) {
            try {
                if (profile) {
                    await connectToDB();

                    // check if user already exists
                    const userExists = await User.findOne({ email: profile.email });

                    // if not, create a new document and save user in MongoDB
                    if (!userExists) {
                        await User.create({
                            email: profile.email,
                            username: profile.email?.split('@')[0].replaceAll('\d', ''),
                            image: profile.image || '',
                            displayName: profile.name,
                        });
                    }
                    return true
                }
                console.log(profile);

                return false
            } catch (error) {
                console.log("Error checking if user exists: ", error);
                return false
            }
        },
    }
}
