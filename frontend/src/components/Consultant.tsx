import { Card, Button } from "react-bootstrap";
import { Appointment as AppointmentModel } from "../models/appointment";
import { Consultant as ConsultantModel } from "../models/consultant";
import styles from "../styles/Appointment.module.css";
import styleUtils from "../styles/utils.module.css";

interface ConsultantProps {
    consultant: ConsultantModel,
    onConsultantClicked: (consultant: ConsultantModel) => void,
    onBookConsultantCLicked: (consultant: AppointmentModel) => void,
    className?: string,
}

const Consultant = ({consultant,onConsultantClicked, onBookConsultantCLicked, className}: ConsultantProps) => {
    const {
        name,
        specialization,
        email,
        phone,
    } = consultant;
        
 return (
    
    <Card className={`${styles.consultantcard} ${className}`}>
        <Card.Body className={styles.cardbody}>
            <Card.Title className={styleUtils.flexCenter}>
            </Card.Title>
            <Card.Text className={styles.cardText}>
                <strong>Name:</strong> {name}<br />
                <strong>Specialization:</strong> {specialization}<br />
                <strong>Email:</strong> {email}<br />
                <strong>Phone:</strong> {phone}<br />
                <strong>Avaliable From: {phone}</strong>

            </Card.Text>
            
        </Card.Body>
<Button> Book Appointment</Button>
    </Card>
  
 )
}

export default Consultant;
