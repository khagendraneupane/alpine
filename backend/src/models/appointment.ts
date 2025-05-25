import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const appointmentSchema = new Schema({

    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    consultation_type: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Consultation',
        required: true,
    },
    consultant_name: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Consultant',
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Appointment = InferSchemaType<typeof appointmentSchema>;

export default model<Appointment>("Appointment", appointmentSchema);