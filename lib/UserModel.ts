import { Schema, model, models, Document, Model } from "mongoose";

// Define the TypeScript interface
interface IUser {
    email: string;
    username?: string;
    displayName?: string;
    image?: string;
}

interface IUserModel extends IUser, Document { }

// Create the schema using the interface
const UserSchema = new Schema<IUserModel>({
    email: {
        type: String,
        required: [true, 'Email is Required !'],
        unique: true,
    },
    username: {
        type: String,
    },
    displayName: {
        type: String,
    },
    image: {
        type: String,
    }
}); 

// Create the Mongoose model using the interface
const User: Model<IUserModel> = models.User || model<IUserModel>("User", UserSchema);

export default User;
