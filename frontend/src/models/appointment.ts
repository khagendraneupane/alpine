export interface Appointment {
    _id: number;
    appointment_date: string;
    appointment_time: string;
    appointment_with: string;
    appointment_status: string; // e.g., 'pending', 'confirmed', 'cancelled'
    createdAt: string;
    updatedAt: string;
    }