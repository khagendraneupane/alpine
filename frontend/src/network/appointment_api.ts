import {Appointment} from "../models/appointment";
async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;   
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw new Error(errorMessage);
    }
}

export async function fetchAppointments(): Promise<Appointment[]> {
    const response = await fetchData("/api/appointments");
    return response.json();
}
export interface AppointmentInput {
    appointment_date: string;
    appointment_time: string;
    appointment_with: string;
    appointment_status: string;
}
export async function createAppointment(appointment: AppointmentInput): Promise<Appointment> {
    const response = await fetchData("/api/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
    });
    return response.json();
}

export async function deleteAppointment(appointmentId: string) {
     await fetchData("/api/appointments/" + appointmentId, {
        method: "DELETE"
     });
   
}