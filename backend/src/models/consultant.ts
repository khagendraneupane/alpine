import {InferSchemaType, Schema, model} from 'mongoose';

const consultantSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image:{
        filename: { type: String, required: true }, // Name of the uploaded file
        path: { type: String, required: true }, // Path to the file on the server
        mimetype: { type: String, required: true }, // MIME type of the file (e.g., image/jpeg)
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Consultant = InferSchemaType<typeof consultantSchema>;
export default model<Consultant>("Consultant", consultantSchema);