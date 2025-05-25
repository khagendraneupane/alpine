import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Appointment } from "../models/appointment";
import * as AppointmentsApi from "../network/appointment_api";
import { AppointmentInput } from "../network/appointment_api";

interface Consultant {
    _id: string;
    name: string;
}

interface Consultation {
    consultation_id: string;
    consultation_type: string;
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
            appointment_type: typeof appointmentToEdit?.appointment_type === "object"
            ? appointmentToEdit.appointment_type.consultation_type
            : appointmentToEdit?.appointment_type || "",
            appointment_with: typeof appointmentToEdit?.appointment_with === "object" 
                ? appointmentToEdit.appointment_with.consultant_name 
                : appointmentToEdit?.appointment_with || "",
            appointment_status: appointmentToEdit?.appointment_status || "confirmed",
        }
    });

    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [selectedConsultant, setSelectedConsultant] = useState<string>("");

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


    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<string>("");
    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await axios.get("/api/consultation");
                setConsultations(response.data);
            } catch (error) {
                console.error("Error fetching consultations:", error);
            }
        };
        fetchConsultations();
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
        <Form.Label>Appointment Type</Form.Label>
        <Form.Select
            isInvalid={!!errors.appointment_type}
            {...register("appointment_type", { required: "Please select appoinment type" })}
            value={selectedConsultation}
            onChange={(e) => {
                setSelectedConsultation(e.target.value);
                setValue("appointment_type", e.target.value); // Update the form value
            }}
        >
            <option value="">Select consultation Type</option>
            {consultations.map((consultation) => (
                <option key={consultation.consultation_id} value={consultation.consultation_id}>
                    {consultation.consultation_type}
                </option>
            ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
            {errors.appointment_with?.message}
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
                    {consultant.name}
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