import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { Appointment as AppointmentModel } from '../models/appointment';
import { Consultant as ConsultantModel } from '../models/consultant';
import * as ConsultantsApi from "../network/consultant_api";
import styles from "../styles/AppointmentsPage.module.css";
import AddEditAppointmentDialog from "./AddEditAppointmentDialog";
import Consultant from './Consultant';


const ConsultantList = () => {
    const [consultants, setConsultants] = useState<ConsultantModel[]>([]);
    const [consultantsLoading, setConsultantsLoading] = useState(true);
    const [showConsultantsLoadingError, setShowConsultantsLoadingError] = useState(false);
    const [showBookConsultantDialog, setShowBookConsultantDialog] = useState(false);
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);


    useEffect(() => {
        async function loadConsultants() {
            try {
                setShowConsultantsLoadingError(false);
                setConsultantsLoading(true);
                const consultants = await ConsultantsApi.fetchConsultant();
                setConsultants(consultants);
            } catch (error) {
                console.error(error);
                setShowConsultantsLoadingError(true);
            } finally {
                setConsultantsLoading(false);
            }
        } 
           loadConsultants(); 
        }, []);


        const consultantsGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.consultantsGrid}`}>
            {consultants.map(consultant => (
                <Col key={consultant._id}>
                    <Consultant
                        consultant={consultant}
                        className={styles.note}
                        onConsultantClicked={(consultant) => console.log(consultant)}
                        onBookConsultantCLicked={(consultant) => console.log(consultant)}
                    />
                </Col>
            ))}
        </Row>
        

    return (
        <>
           
            {consultantsLoading && <Spinner animation='border' variant='primary' />}
            {showConsultantsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!consultantsLoading && !showConsultantsLoadingError &&
                <>
                    {consultants.length > 0
                        ? consultantsGrid
                        : <p>Sorry all cunsultant are busy for that moment, please try for new date</p>
                    }
                </>
            }
            {showBookConsultantDialog &&
                <AddEditAppointmentDialog
                    onDismiss={() => setShowBookConsultantDialog(false)}
                    onAppointmentSaved={(newAppointment) => {
                        setAppointments([...appointments, newAppointment]);
                        setShowBookConsultantDialog(false);
                    }}
                />
            }
            
        </>
    );
}

export default ConsultantList;