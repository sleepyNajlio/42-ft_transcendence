import React, { useEffect, ReactNode, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
		try {
			await axios.get('http://localhost:3000/auth/postAuthData', { withCredentials: true });
			console.log('mlogi');
			navigate('/Profile');
		} catch (error) {
			console.error(error);
			setStatus(false);
		}
	};
  return status ? <React.Fragment></React.Fragment> : <React.Fragment>{component}</React.Fragment>;
};

export default UnAuthGuard;