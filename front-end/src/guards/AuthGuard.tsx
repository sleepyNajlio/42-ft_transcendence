import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthGuard = ({ component }: { component: ReactNode }) => {
	const [status, setStatus] = useState(false);
	const navigate = useNavigate();
	const isEffectRun = useRef(false);
	
	useEffect(() => {
		if (!isEffectRun.current) {
			checkToken();
			isEffectRun.current = true;
		}
	}, [component]);
	
	
	const checkToken = async () => {
		await axios.get('http://localhost:3000/user', { withCredentials: true })
		.then(res => {
			if (res.data.isAuthenticated == false) {
				setStatus(true);
				navigate('/Config');
			}
			else
				setStatus(true);
			console.log('AuthGuard');
		}).catch(error => {
			console.error(error.response.data.message);
			setStatus(false);
			navigate('/');
		});
		// try {
		// 	await axios.get('http://localhost:3000/profile', { withCredentials: true });
		// 	console.log('AuthGuard');
		// 	setStatus(true);
		// } catch (error) {
		// 	console.error(error);
		// 	navigate('/');
		// 	setStatus(false);
		// }
	};

	return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default AuthGuard