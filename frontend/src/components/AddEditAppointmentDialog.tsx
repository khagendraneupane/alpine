import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Appointment } from "../models/appointment";
import { AppointmentInput } from "../network/appointment_api";
import * as AppointmentsApi from "../network/appointment_api";
import TextInputField from "./form/TextInputField";

interface Consultant {
    _id: string;
    consultant_name: string;
}

interface AddEditAppointmentDialogProps {
    appointmentToEdit?: Appointment,
    onDismiss: () => void,
    onAppointmentSaved: (note: Appointment) => void,
}


const AddEditAppointmentDialog = ({ appointmentToEdit, onDismiss, onAppointmentSaved }: AddEditAppointmentDialogProps) => {

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<AppointmentInput>({
        defaultValues: {
            appointment_date: appointmentToEdit?.appointment_date || "",
            appointment_time: appointmentToEdit?.appointment_time || "",
            appointment_with: typeof appointmentToEdit?.appointment_with === "object" 
                ? appointmentToEdit.appointment_with.consultant_name 
                : appointmentToEdit?.appointment_with || "",
            appointment_status: appointmentToEdit?.appointment_status || "",
        }
    });

    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [selectedConsultant, setSelectedConsultant] = useState<string>("");

    useEffect(() => {
        const fetchConsultants = async () => {
            // if (searchTerm.trim() === "") {
            //     setConsultants([]);
            //     return;
            // }

            try {
                const response = await axios.get("/api/consultants");
                setConsultants(response.data);
            } catch (error) {
                console.error("Error fetching consultants:", error);
            }
        };

        fetchConsultants();
    }, []);
    async function onSubmit(input: AppointmentInput) {
        try {
            let appointmentResponse: Appointment;
            if (appointmentToEdit) {
                appointmentResponse = await AppointmentsApi.updateAppointment(appointmentToEdit._id.toString(), input);
            } else {
                appointmentResponse = await AppointmentsApi.createAppointment(input);
            }
            onAppointmentSaved(appointmentResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
            <Modal.Title>Add Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* Form to add appointment */}
            <Form id="addAppointmentForm" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Appointment Date</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="Select appointment date"
                        isInvalid={!!errors.appointment_date}
                        {...register("appointment_date", { required: "Appointment date is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.appointment_date?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Appointment Time</Form.Label>
                    <Form.Control
                        type="time"
                        placeholder="Select appointment time"
                        isInvalid={!!errors.appointment_time}
                        {...register("appointment_time", { required: "Appointment time is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.appointment_time?.message}
                    </Form.Control.Feedback>
                </Form.Group>
    
                <Form.Group>
        <Form.Label>Appointment With</Form.Label>
        <Form.Select
            isInvalid={!!errors.appointment_with}
            {...register("appointment_with", { required: "Please select a consultant" })}
            value={selectedConsultant}
            onChange={(e) => {
                setSelectedConsultant(e.target.value);
                setValue("appointment_with", e.target.value); // Update the form value
            }}
        >
            <option value="">Select a Consultant</option>
            {consultants.map((consultant) => (
                <option key={consultant._id} value={consultant._id}>
                    {consultant.consultant_name}
                </option>
            ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
            {errors.appointment_with?.message}
        </Form.Control.Feedback>
    </Form.Group>
                <Form.Group>
                    <Form.Label>Appointment Status</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter appointment status"
                        isInvalid={!!errors.appointment_status}
                        {...register("appointment_status", { required: "Appointment status is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.appointment_status?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                type="submit"
                form="addAppointmentForm"
                disabled={isSubmitting}
            >
                Book Appointment
            </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default AddEditAppointmentDialog;