import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import {Appointment} from "../models/appointment";
import { Student } from "../models/student";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;   
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<Student> {
    const response = await fetchData("/api/students", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    student_name: string,
    student_email: string,
    student_phone: string,
    student_nationality: string,
    student_password: string,
}
export async function signUp(credentials: SignUpCredentials): Promise<Student> {
    const response = await fetchData("/api/students/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}


export interface LoginCredentials {
    student_email: string,
    student_password: string,
}

export async function login(credentials: LoginCredentials): Promise<Student> {
    const response = await fetchData("/api/students/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export async function logout() {
    await fetchData("/api/students/logout", { method: "POST" });
}

export async function fetchAppointments(): Promise<Appointment[]> {
    const response = await fetchData("/api/appointments", { method: "GET" });
    return response.json();
}
export interface AppointmentInput {
    appointment_date: string;
    appointment_time: string;
    appointment_type: string;
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

export async function updateAppointment(appointmentId: string, appointment: AppointmentInput): Promise<Appointment> {
    const response = await fetchData("/api/appointments/" + appointmentId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
    });
    return response.json();
}
export async function deleteAppointment(appointmentId: string) {
    await fetchData("/api/appointments/" + appointmentId, { method: "DELETE" });
}
