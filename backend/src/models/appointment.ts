import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const appointmentSchema = new Schema({

    appointment_date: {
        type: Date,
        required: true,
    },
    appointment_time: {
        type: String,
        required: true,
    },
    appointment_with: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Consultant',
        required: true,
    },
    appointment_status: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Appointment = InferSchemaType<typeof appointmentSchema>;

export default model<Appointment>("Appointment", appointmentSchema);