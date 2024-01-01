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
		try {
			const payload = await axios.get('http://localhost:3000/auth/postAuthData', { withCredentials: true });
			console.log('AuthGuard');
			setStatus(true);
			if (payload.data.sub === -42)
			{
				navigate('/Config');
			}
		} catch (error) {
			console.error(error);
			navigate('/');
			setStatus(false);
		}
	};

	return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default AuthGuard