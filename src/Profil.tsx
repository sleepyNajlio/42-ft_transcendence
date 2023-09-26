import Navbar from './Components/Navbar.tsx';
import './styles/css/main.css';
import lock from './assets/lock_line.svg';

export function Profil() {
  return (
    <>
        <Navbar ></Navbar>

      <main id='page-wrap' className="wrapper profil">
        <div className="profil container">
        <div className="title">
          <div className="hamburger">
            <input type="checkbox" id="menu-toggle"/>
            <label htmlFor="menu-toggle" className="menu-icon">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </label>
          </div>
            <h1 className="ptitle">Profile</h1>
        </div>
        <div className="left-div">
          <div className="ptest">
            <div className="left-content profil__info">
              <img src="/bsk.png" alt="" className="profil__pic" />
              <div className="profil__user">
                <h4 className="profil__username">Richard</h4>
                <h6 className="profil__rank">#1</h6>
              </div>
            </div>
            <div className="left-content profil__card">
              <div className="profil__stats">
                <div className='profil__ratio'>
                  <h3>13%</h3>
                  <h6>Ratio</h6>
                  <svg>
                    <circle id="progress" cx="90" cy="90" r="80"></circle>
                  </svg>
                </div>
                <div className="profil__stats__info">
                  <div className="profil__stats__info__cell">
                    <h6>Total matches</h6>
                    <h3>13</h3>
                  </div>
                  <div className="profil__stats__info__cell">
                    <h6>Wins</h6>
                    <h3>13</h3>
                  </div>
                  <div className="profil__stats__info__cell">
                    <h6>Acheivemnt</h6>
                    <h3>13</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="left-content achivements">
            <h1 className="ach__title">Acheivements</h1>
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
              <h1 className="rank__title">History</h1>
              <div className="history">
                <div className="rankbar">
                    <div className="rank__user">
                        <div className="rank__cercle"></div>
                    </div>
                    <div className="score">
                        <span className="rankval">1</span>
                        <span className="rankname">-</span>
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
                        <span className="rankname">-</span>
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
                        <span className="rankname">-</span>
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
                        <span className="rankname">-</span>
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
                        <span className="rankname">-</span>
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
                        <span className="rankname">-</span>
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
                        <span className="rankname">-</span>
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
