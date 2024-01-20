import React from 'react'
import { Route } from 'react-router-dom'
import UnAuthGuard from '../guards/UnAuthGuard'
import { Chat } from '../Chat'
import { Login } from '../Login'
import { Verify2FA } from '../Verify2FA'

const UnAuthRoutes = [
	<Route key='Login' path='/' element={<UnAuthGuard component={<Login />} />}>
		{' '}
	</Route>,
	<Route key='Verify2FA' path='/Verify2FA' element={<UnAuthGuard component={<Verify2FA />} />} />,

	
]

export default UnAuthRoutes