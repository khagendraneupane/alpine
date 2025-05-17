import {InferSchemaType, Schema, model} from 'mongoose';

const adminSchema = new Schema({
    admin_name: {
        type: String,
        required: true,
    },
    admin_email: {
        type: String,
        required: true,
    },
    admin_phone: {
        type: String,
        required: true,
    },
    admin_password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Admin = InferSchemaType<typeof adminSchema>;
export default model<Admin>("Admin", adminSchema);