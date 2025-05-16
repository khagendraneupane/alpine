import mongoose, {InferSchemaType, Schema, model} from 'mongoose';

const consultantSchema = new Schema({
    consultant_id: {
        type: String,
        required: true,
    },
    consultant_name: {
        type: String,
        required: true,
    },
    consultant_specialization: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Service',
        required: true,
    },
    
    consultant_email: {
        type: String,
        required: true,
    },
    consultant_phone: {
        type: String,
        required: true,
    },
    consultant_password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Consultant = InferSchemaType<typeof consultantSchema>;
export default model<Consultant>("Consultant", consultantSchema);