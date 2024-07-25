import mongoose, { Schema, Document } from 'mongoose';

export interface IUnsentEmail extends Document {
    query: string;
    location: string;
    platform: string;
    contactType: string;
    site: string;
    email: string;
}

const UnsentEmailSchema: Schema = new Schema({
    query: { type: String, required: true },
    location: { type: String, required: true },
    platform: { type: String, required: true },
    contactType: { type: String, required: true },
    site: { type: String, required: true },
    email: { type: String, required: true }
});

const UnsentEmail = mongoose.models.UnsentEmail || mongoose.model<IUnsentEmail>('UnsentEmail', UnsentEmailSchema);

export default UnsentEmail;
