import { Button, Form, Modal } from "react-bootstrap";
import { Appointment } from "../models/appointment";
import { AppointmentInput } from "../network/appointment_api";
import { useForm } from "react-hook-form";
import * as AppointmentsApi from "../network/appointment_api";
interface AddAppointmentDialogProps {
    onDismiss: () => void,
    onAppointmentSubmitted: (appointment: Appointment) => void,
}
const AddAppointmentDialog = ({onDismiss, onAppointmentSubmitted}: AddAppointmentDialogProps) => {
    
    const {register, handleSubmit, formState : {errors, isSubmitting}} = useForm<AppointmentInput>();

    async function onSubmit(input: AppointmentInput){
        try {
            const apointmentRseponse = await AppointmentsApi.createAppointment(input);
            onAppointmentSubmitted(apointmentRseponse);
        } catch(error) {
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
                    <Form.Label> Appointment date</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="Select appointment date" 
                    isInvalid={!!errors.appointment_time}
                    {...register("appointment_date", {required: "Appointment date is required"})}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.appointment_time?.message}
                        </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label> Appointment time</Form.Label>
                    <Form.Control 
                    type="time" 
                    placeholder="Select appointment time" 
                    {...register("appointment_time", {required: "Appointment time is required"})}
                    />
                    
                </Form.Group>
                <Form.Group>
                    <Form.Label> Appointment with</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter appointment with" 
                    {...register("appointment_with", {required: "Appointment with is required"})}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label> Appointment status</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter appointment status" 
                    {...register("appointment_status", {required: "Appointment status is required"})}
                    />
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
 
export default AddAppointmentDialog;