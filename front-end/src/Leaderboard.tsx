import axios from 'axios';
import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'
import { user } from './Components/types.ts';
import { useContext, useState } from 'react';
import { UserContext } from './UserProvider.tsx';

export function Leaderboard() {

    const { leadboard } = useContext(UserContext);
    console.log(leadboard);
    return (
        <>
            <main className="wrapper leader">
                <h1 className="rank__title">Leaderboard</h1>
                {leadboard?.map((user, index) => (
                    <div key={index} className="rankbar">
                        <div className="rank">
                            <span className="rankval">#{index+1}</span>
                            <span className="rankname">Rank</span>
                        </div>
                        <div className="rank__user">
                            <div className="rank__cercle" style={{backgroundImage: `url(${user?.avatar})`}}></div>
                            <span className="rank__name">{user.username}</span>
                        </div>
                        <div className="stats">
                            <span className="statval">{user.user_stats.total_matches}</span>
                            <span className="statname">Matches played</span>
                        </div>
                        <div className="stats">
                            <span className="statval">{user.user_stats.wins}</span>
                            <span className="statname">Wins</span>
                        </div>
                        <div className="stats">
                            <span className="statval">{(user.user_stats.winsRat * 100).toFixed(0)}%</span>
                            <span className="statname">Ratio</span>
                        </div>
                        <div className="stats">
                            <span className="statval">{user.achievement.length}</span>
                            <span className="statname">Achievements</span>
                        </div>
                    </div>
                ))}
            </main>
        </>
    )
}