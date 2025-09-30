import { Schema, model, models, Document } from "mongoose";

interface INewsletter extends Document {
  email: string;
}

const NewsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});

const Newsletter =
  models.newsletter || model<INewsletter>("newsletter", NewsletterSchema);

export default Newsletter;
