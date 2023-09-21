import Navbar from './Components/Navbar.tsx';
import  './styles/css/main.css'

export function Leaderboard() {
    return (
        <>
            <Navbar></Navbar>
            <main className="wrapper leader">
                <h1 className="rank__title">Leaderboard</h1>
                <div className="rankbar">
                    <div className="rank">
                        <span className="rankval">#1</span>
                        <span className="rankname">Rank</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                        <span className="rank__name">Richard</span>
                    </div>
                    <div className="stats">
                        <span className="statval">341</span>
                        <span className="statname">Matches played</span>
                    </div>
                    <div className="stats">
                        <span className="statval">203</span>
                        <span className="statname">Wins</span>
                    </div>
                    <div className="stats">
                        <span className="statval">64%</span>
                        <span className="statname">Ratio</span>
                    </div>
                    <div className="stats">
                        <span className="statval">65</span>
                        <span className="statname">Achievements</span>
                    </div>
                </div>
            </main>
        </>
    )
}