import {InferSchemaType, Schema, model} from 'mongoose';

const consultationSchema = new Schema({

    consultation_type: {
        type: String,
        required: true,
    },
    consultation_duration: {
        type: String,
        required: true,
    },
    
}, {timestamps: true});

type Consultation = InferSchemaType<typeof consultationSchema>;
export default model<Consultation>("Consultation", consultationSchema);