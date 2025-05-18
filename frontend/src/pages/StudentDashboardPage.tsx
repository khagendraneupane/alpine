import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDashboard = () => {
    interface Appointment {
        _id: string;
        appointment_date: string;
        appointment_time: string;
        appointment_with: string;
        appointment_status: string;
    }

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [formData, setFormData] = useState({
        appointment_date: "",
        appointment_time: "",
        appointment_with: "",
        appointment_status: "Pending",
    });
    interface Consultant {
        _id: string;
        consultant_name: string;
    }

    const [consultants, setConsultants] = useState<Consultant[]>([]);

    useEffect(() => {
        const fetchConsultants = async () => {
            try {
                const response = await axios.get("/api/consultants");
                setConsultants(response.data);
            } catch (error) {
                console.error("Error fetching consultants:", error);
            }
        };

        fetchConsultants();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/appointments", formData);
            setAppointments([...appointments, response.data]);
            alert("Appointment created successfully!");
        } catch (error) {
            console.error("Error creating appointment:", error);
        }
    };

    return (
        <div>
            <h2>Student Dashboard</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    required
                />
                <select
                    name="appointment_with"
                    value={formData.appointment_with}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Consultant</option>
                    {consultants.map((consultant) => (
                        <option key={consultant._id} value={consultant._id}>
                            {consultant.consultant_name}
                        </option>
                    ))}
                </select>
                <button type="submit">Make Appointment</button>
            </form>

            <h3>Your Appointments</h3>
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment._id}>
                        {appointment.appointment_date} - {appointment.appointment_time} with{" "}
                        {appointment.appointment_with}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentDashboard;