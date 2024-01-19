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
		axios.get('http://localhost:3000/user', { withCredentials: true })
		.then((res) => {
			if (res.data.TwoFA == true) {
				// setStatus(true);
				navigate('/Verify2FA');
			}
			else if (res.data.isAuthenticated == true) {
				// setStatus(true);
				navigate('/Profile');
			}
			else {
				setStatus(false);
				// navigate("/Profile");
			}});
			// console.log(res);
			// console.log('mlogi');
		// try {
		// 	const res = await axios.get('http://localhost:3000/profile', { withCredentials: true });
		// 	console.log(res);
		// 	console.log('mlogi');
		// 	navigate('/Profile');
		// } catch (error) {
		// 	console.error(error);
		// 	setStatus(false);
		// }
	};
	return status ? <React.Fragment></React.Fragment> : <React.Fragment>{component}</React.Fragment>;
};

export default UnAuthGuard;