import {InferSchemaType, Schema, model} from 'mongoose';

const serviceSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    image: {
        filename: { type: String, required: true }, // Name of the uploaded file
        path: { type: String, required: true }, // Path to the file on the server
        mimetype: { type: String, required: true }, // MIME type of the file (e.g., image/jpeg)
    },
}, {timestamps: true});

type Service = InferSchemaType<typeof serviceSchema>;
export default model<Service>("Service", serviceSchema);