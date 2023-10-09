import Navbar from './Components/Navbar.tsx';
import './styles/css/main.css';
import lock from './assets/lock_line.svg';

export function Profile() {
  return (
    <>
      <Navbar></Navbar>
      <main className="wrapper profile">
        <div className="profile container">
        <div className="title">
          <h1 className="ptitle">Profile</h1>
        </div>
        <div className="left-div">
          <div className="ptest">
            <div className="left-content profile__info">
              <img src="/bsk.png" alt="" className="profile__pic" />
              <div className="profile__user">
                <h4 className="profile__username">Richard</h4>
                <h6 className="profile__rank">#1</h6>
              </div>
            </div>
            <div className="left-content profile__card">
              <div className="profile__stats">
                <div className='profile__ratio'>
                  <h3>13%</h3>
                  <h6>Ratio</h6>
                  <svg>
                    <circle id="progress" cx="90" cy="90" r="80"></circle>
                  </svg>
                </div>
                <div className="profile__stats__info">
                  <div className="profile__stats__info__cell">
                    <h6>Total matches</h6>
                    <h3>13</h3>
                  </div>
                  <div className="profile__stats__info__cell">
                    <h6>Wins</h6>
                    <h3>13</h3>
                  </div>
                  <div className="profile__stats__info__cell">
                    <h6>Acheivemnt</h6>
                    <h3>13</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="left-content achivements">
            <h1 className="rank__title">Acheivements</h1>
            <div className="achivements_cells">
              <div className="cell">
                  <div className="achivements__cercle">
                  </div>
                  <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
              <div className="cell">
                <div className="achivements__cercle"></div>
                <img src={lock} alt="" className="achivement__img"/>
              </div>
            </div>
          </div>
        </div>
        <div className="right-div">
              <div className="history">
                <h1 className="rank__title">History</h1>
                <div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div><div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div><div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div><div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div><div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div><div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div><div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">---</span>
                        <span className="rankval">1</span>
                    </div>
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      </main>
    </>
  );
}
