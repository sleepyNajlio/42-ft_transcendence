import React from 'react'
import { Route } from 'react-router-dom'
import UnAuthGuard from '../guards/UnAuthGuard'
import { Chat } from '../Chat'
import { Login } from '../Login'

const UnAuthRoutes = [
	<Route key='Login' path='/' element={<UnAuthGuard component={<Login />} />}>
		{' '}
	</Route>
]

export default UnAuthRoutes