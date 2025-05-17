import React, { useEffect } from 'react';
import {Appointment as AppointmentModel} from './models/appointment';
import Appointment from './components/Appointment';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from "./styles/AppointmentsPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as AppointmentsApi from './network/appointment_api';
import AddAppointmentDialog from './components/AddAppointmentDialog';
function App() {

  const [appointments, setAppointments] = React.useState<AppointmentModel[]>([]);

  const[showAddAppointmentDialog, setShowAddAppointmentDialog] = React.useState(false);

  useEffect(() => {
    async function loadAppointments() {
      try { 
        const appointments = await AppointmentsApi.fetchAppointments();
        setAppointments(appointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
        alert(error);
      }
      
    }
    loadAppointments();
  }, []);

  async function cancelAppointment(appointment:AppointmentModel) {
    try {
      await AppointmentsApi.deleteAppointment(appointment._id.toString());
      setAppointments(appointments.filter(a => a._id !== appointment._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <Container >
      <Button className={`mb-3 ${stylesUtils.blockCenter}`}
      onClick={() => setShowAddAppointmentDialog(true)}>
        Add Appointment
      </Button>
      <Row xs={1} md={2} lg={3}  className="g-4">
      {appointments.map(appointment => (
        <Col key={appointment._id}>
        <Appointment 
          appointment={appointment} 
          className={styles.appointment}
          onCancelAppointmentCLicked={(appointmentToCancel) => {
            setAppointments(appointments.filter(a => a._id !== appointmentToCancel._id));
          }}
        />
        </Col>
      
     ))}
      </Row>
     {
        showAddAppointmentDialog && 
          <AddAppointmentDialog 
          onDismiss={() => setShowAddAppointmentDialog(false)}
          onAppointmentSubmitted={(newAppointment) => {
            setAppointments([...appointments,newAppointment])
            setShowAddAppointmentDialog(false);
          }}

          />
        
      }
      
     
    </Container>
  );
}

export default App;
