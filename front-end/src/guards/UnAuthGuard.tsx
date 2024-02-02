import React, { useEffect, ReactNode, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TwoFA } from '../TwoFA';

const UnAuthGuard = ({ component }: { component: ReactNode }) => {
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
		console.log('checkToken');
		axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user`, { withCredentials: true })
		.then((res) => {
			if (res.data.twoFA == true) {
				setStatus(true);
				navigate('/Verify2FA');
			}
			else if (res.data.isAuthenticated == false) {
				setStatus(true);
				navigate('/Config');
			}
			else if (res.data.isAuthenticated == true) {
				setStatus(true);
				navigate('/Profile');
			}
			else {
				setStatus(true);
				navigate('/');
			}
			
		}).catch(() => {
			setStatus(true);
			navigate('/');
		});
	};
	return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
};

export default UnAuthGuard;