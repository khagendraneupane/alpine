export interface Appointment {
    _id: number;
    appointment_date: string;
    appointment_time: string;
    appointment_type: 
    { consultation_type: string;};
    appointment_with: 
    { consultant_name: string;};
    appointment_status: string; // e.g., 'pending', 'confirmed', 'cancelled'
    createdAt: string;
    updatedAt: string;
    }