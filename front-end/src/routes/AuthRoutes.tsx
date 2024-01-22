import React from 'react'
import { Route } from 'react-router-dom'
import AuthGuard from '../guards/AuthGuard'
import { Chat } from '../Chat'
import { Config } from '../Config'
import { Leaderboard } from '../Leaderboard'
import { Play } from '../Play'
import { Profile } from '../Profile'
import { Settings } from '../Settings'
import { TwoFA } from '../TwoFA'
// import { Verify2FA } from '../Verify2FA'

const AuthRoutes = [
    <Route key='Config' path='/Config' element={<AuthGuard component={<Config />} />} />,
    <Route key='TwoFA' path='/TwoFA' element={<AuthGuard component={<TwoFA />} />} />,
    // <Route key='Verify2FA' path='/Verify2FA' element={<AuthGuard component={<Verify2FA />} />} />,
    <Route key='Profile' path='/Profile' element={<AuthGuard component={<Profile />} />} />,
    <Route key='Play' path='/Play' element={<AuthGuard component={<Play />} />} />,
    <Route key='Chat' path='/Chat' element={<AuthGuard component={<Chat />} />} />,
    <Route key='Settings' path='/Settings' element={<AuthGuard component={<Settings />} />} />,
    <Route key='Leaderboard' path='/Leaderboard' element={<AuthGuard component={<Leaderboard />} />} />,
]

export default AuthRoutes