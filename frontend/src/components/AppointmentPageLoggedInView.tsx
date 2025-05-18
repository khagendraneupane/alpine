import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import styles from "../styles/AppointmentsPage.module.css";
import { Appointment as AppointmentModel } from '../models/appointment';
import * as AppointmentsApi from "../network/appointment_api";
import styleUtils from "../styles/utils.module.css";
import AddEditAppointmentDialog from "./AddEditAppointmentDialog";
import Appointment from './Appointment';


const AppointmentsPageLoggedInView = () => {

    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [showAppointmentsLoadingError, setShowAppointmentsLoadingError] = useState(false);

    const [showAddAppointmentDialog, setShowAddAppointmentDialog] = useState(false);
    const [appointmentToEdit, setAppointmentToEdit] = useState<AppointmentModel | null>(null);

    useEffect(() => {
        async function loadAppointments() {
            try {
                setShowAppointmentsLoadingError(false);
                setAppointmentsLoading(true);
                const appointments = await AppointmentsApi.fetchAppointments();
                setAppointments(appointments);
            } catch (error) {
                console.error(error);
                setShowAppointmentsLoadingError(true);
            } finally {
                setAppointmentsLoading(false);
            }
        }
        loadAppointments();
    }, []);

    async function deleteAppointment(appointment: AppointmentModel) {
        try {
            await AppointmentsApi.deleteAppointment(String(appointment._id));
            setAppointments(appointments.filter(existingAppointment => existingAppointment._id !== appointment._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const appointmentsGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.appointmentsGrid}`}>
            {appointments.map(appointment => (
                <Col key={appointment._id}>
                    <Appointment
                        appointment={appointment}
                        className={styles.note}
                        onAppointmentClicked={setAppointmentToEdit}
                        onCancelAppointmentCLicked={deleteAppointment}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddAppointmentDialog(true)}>
                {/* <FaPlus /> */}
                Add new Appointment
            </Button>
            {appointmentsLoading && <Spinner animation='border' variant='primary' />}
            {showAppointmentsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!appointmentsLoading && !showAppointmentsLoadingError &&
                <>
                    {appointments.length > 0
                        ? appointmentsGrid
                        : <p>You don't have any Appointments yet</p>
                    }
                </>
            }
            {showAddAppointmentDialog &&
                <AddEditAppointmentDialog
                    onDismiss={() => setShowAddAppointmentDialog(false)}
                    onAppointmentSaved={(newAppointment) => {
                        setAppointments([...appointments, newAppointment]);
                        setShowAddAppointmentDialog(false);
                    }}
                />
            }
            {appointmentToEdit &&
                <AddEditAppointmentDialog
                    appointmentToEdit={appointmentToEdit}
                    onDismiss={() => setAppointmentToEdit(null)}
                    onAppointmentSaved={(updatedAppointment) => {
                        setAppointments(appointments.map(existingAppointment => existingAppointment._id === updatedAppointment._id ? updatedAppointment : existingAppointment));
                        setAppointmentToEdit(null);
                    }}
                />
            }
        </>
    );
}

export default AppointmentsPageLoggedInView;