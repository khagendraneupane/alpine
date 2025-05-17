import {InferSchemaType, Schema, model} from 'mongoose';

const serviceSchema = new Schema({

    service_name: {
        type: String,
        required: true,
    },
    service_description: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Service = InferSchemaType<typeof serviceSchema>;
export default model<Service>("Service", serviceSchema);