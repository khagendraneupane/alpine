import {Consultant} from "../models/consultant";
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

export async function fetchConsultant(): Promise<Consultant[]> {
    const response = await fetchData("/api/consultants");
    return response.json();
}
export interface ConsultantInput {
    name: string;
    specialization: string;
    email: string;
    phone: string;
    image: File;
    password: string;
}
export async function signupConsultant(consultant: ConsultantInput): Promise<Consultant> {
    const response = await fetchData("/api/consultants", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(consultant),
    });
    return response.json();
}

export async function deleteConsultant(consultantId: string) {
     await fetchData("/api/consultants/" + consultantId, {
        method: "DELETE"
     });
   
}