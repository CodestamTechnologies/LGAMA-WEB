import mongoose, { Schema, Document } from 'mongoose';

export interface ISentEmail extends Document {
    query: string;
    location: string;
    platform: string;
    contactType: string;
    site: string;
    email: string;
    sentAt: Date;
}

const SentEmailSchema: Schema = new Schema({
    query: { type: String, required: true },
    location: { type: String, required: true },
    platform: { type: String, required: true },
    contactType: { type: String, required: true },
    site: { type: String, required: true },
    email: { type: String, required: true },
    sentAt: { type: Date, required: true, default: Date.now }
});

const SentEmail = mongoose.models.SentEmail || mongoose.model<ISentEmail>('SentEmail', SentEmailSchema);

export default SentEmail;
