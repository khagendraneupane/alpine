import {InferSchemaType, Schema, model} from 'mongoose';

const studentSchema = new Schema({

    student_name: {
        type: String,
        required: true,
    },
    student_email: {
        type: String,
        required: true,
        unique: true,
    },
    student_phone: {
        type: String,
        required: true,
    },
    student_nationality: {
        type: String,
        required: true,
    },
    student_password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

type Student = InferSchemaType<typeof studentSchema>;
export default model<Student>("Student", studentSchema);