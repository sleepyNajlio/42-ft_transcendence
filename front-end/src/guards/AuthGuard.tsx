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
			if (res.data.twoFA == true) {
				// console.log("verify azzbi ", res.data);
				setStatus(true);
				navigate('/Verify2FA');
			}
			else if (res.data.isAuthenticated == false) {
				setStatus(true);
				navigate('/Config');
			}
			else if (res.data.isAuthenticated == true) {
				setStatus(true);
			}
			else {
				setStatus(true);
				navigate('/');
			}
		}).catch(() => {
			// console.error(error.response.data.message);
			setStatus(false);
			navigate('/');
		});
	};

	return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default AuthGuard