import {Student} from "../models/student";
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

export async function fetchAppointments(): Promise<Student[]> {
    const response = await fetchData("/api/students");
    return response.json();
}
export interface StudentInput {
    student_name: string;
    student_email: string;
    student_phone: string;
    student_nationality: string;
    student_password: string;
}
export async function signupStudent(student: StudentInput): Promise<Student> {
    const response = await fetchData("/api/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });
    return response.json();
}

export async function deleteStudent(studentId: string) {
     await fetchData("/api/studentss/" + studentId, {
        method: "DELETE"
     });
   
}