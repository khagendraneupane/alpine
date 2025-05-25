import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddEditConsultantDialog from './components/AddEditConsultantDialog';
import AddServiceForm from './components/AddServiceForm';
import ConsultantList from './components/ConsultantList';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { Student } from './models/student';
import * as AppointmentsApi from './network/appointment_api';
import AppointmentPage from './pages/AppointmentsPage';
import HomePage from './pages/HomePage';
import PrivacyPage from './pages/PrivacyPage';
import ServicesPage from './pages/ServicesPage';
import styles from "./styles/AppointmentsPage.module.css";
import AddConsultantForm from './components/AddConsultantForm';



function App() {
  const [loggedInUser, setLoggedInUser] = useState<Student | null>(null);

	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showAddEditConsultantDialog, setShowAddEditConsultantDialog] = useState(false);

  // const [appointments, setAppointments] = React.useState<AppointmentModel[]>([]);

  // const[showAddAppointmentDialog, setShowAddAppointmentDialog] = React.useState(false);


  useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await AppointmentsApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		fetchLoggedInUser();
	}, []);
 
  return (
<BrowserRouter>
			<div>
				<NavBar
					loggedInUser={loggedInUser}
					onLoginClicked={() => setShowLoginModal(true)}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<Container className={styles.pageContainer}>
					<Routes>
						<Route
							path='/'
							element={<AppointmentPage loggedInUser={loggedInUser} />}
						/>
						{/* <Route
						path='/'
						element={<HomePage />} /> */}
							

						<Route
							path='/privacy'
							element={<PrivacyPage />}
						/>
					</Routes>
				</Container>
				{showSignUpModal &&
					<SignUpModal
						onDismiss={() => setShowSignUpModal(false)}
						onSignUpSuccessful={(user) => {
							setLoggedInUser(user);
							setShowSignUpModal(false);
						}}
					/>
				}
				{showLoginModal &&
					<LoginModal
						onDismiss={() => setShowLoginModal(false)}
						onLoginSuccessful={(user) => {
							setLoggedInUser(user);
							setShowLoginModal(false);
						}}
					/>
				}
				{ showAddEditConsultantDialog &&
					<AddEditConsultantDialog
						onDismiss={() => setShowAddEditConsultantDialog(true)}
						onConsultantSaved={(consultant) => {
							setShowAddEditConsultantDialog(false);
							console.log('Consultant saved:', consultant);
						}}
					/>

				}
			</div>
			<Routes>

				<Route path="/services" element={<ServicesPage />} />

				<Route path="/services/add" element={<AddServiceForm />} />
				<Route path="/consultants" element={<ConsultantList />} />
				<Route path="/consultants/add" element={<AddConsultantForm />} />
				<Route path="/landing" element={<HomePage />} />
			</Routes>
		</BrowserRouter>

  );
}

export default App;








