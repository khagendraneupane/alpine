import React, { useEffect, useState } from 'react';
import {Appointment as AppointmentModel} from './models/appointment';
import Appointment from './components/Appointment';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from "./styles/AppointmentsPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as AppointmentsApi from './network/appointment_api';

import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';
import { BrowserRouter } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { Student } from './models/student';
import * as AppointmentApi from "./network/appointment_api";
import AppointmentPage from './pages/AppointmentsPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/StudentSignupPage";
import LoginPage from "./pages/StudentLoginPage";
import StudentDashboard from "./pages/StudentDashboardPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<Student | null>(null);

	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

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
						<Route
							path='/privacy'
							element={<PrivacyPage />}
						/>
						<Route
							path='/*'
							element={<NotFoundPage />}
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
			</div>
		</BrowserRouter>

  );
}

export default App;








