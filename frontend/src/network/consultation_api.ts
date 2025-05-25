import { Consultation } from "../models/consultation";

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
export async function fetchConsultation(): Promise<Consultation[]> {
    const response = await fetchData("/api/consultation");
    return response.json();
}

export interface ConsultationInput {
    consultation_type: string;
    consultation_duration: string;
    consultant_name: string;
    appointment_status: string;
}
export async function addConsultation(consultant: ConsultationInput): Promise<Consultation> {
    const response = await fetchData("/api/consultation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(consultant),
    });
    return response.json();
}

export async function deleteConsultation(consultationId: string) {
     await fetchData("/api/consultation/" + consultationId, {
        method: "DELETE"
     });
   
}