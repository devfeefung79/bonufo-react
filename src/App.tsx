import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Logo from '../src/assets/logo.png';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Profile from './pages/profile/Profile';
import QuestionDetail from './pages/question/question-detail/QuestionDetail';
import WriteEssay from './pages/submission/write-essay/WriteEssay';
import WriteFeedback from './pages/submission/give-feedback/GiveFeedback';
import SubmissionDetail from './pages/submission/submission-detail/SubmissionDetail';
import NotFound from './pages/not-found/NotFound';
import Landing from './pages/landing/Landing';
import './App.css';
import { UserControlModel, defaultUserControl } from './utils/UserUtils';
import { Image } from 'semantic-ui-react'

const BASE_URL = `https://bonufo-express.vercel.app`;

function App() {

  const [user, setUser] = useState<UserControlModel>(defaultUserControl);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getAccessToken();
  }, []);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 60000);
    if (counter === 25) {
      getAccessToken();
      setCounter(0);
      return () => clearInterval(interval);
    }
  }, [counter]);
  */

  let getAccessToken = () => {
    axios.get(`${BASE_URL}/user/refresh`, { withCredentials: true })
      .then(res => {
        let decodedUser: UserControlModel = jwt_decode(res.data.accessToken);
        decodedUser.accessToken = res.data.accessToken;
        setUser({ ...user, ...decodedUser, isValid: true });
      })
  }

  let handleSuccessLogin = (accessToken) => {
    let decodedUser: UserControlModel = jwt_decode(accessToken);
    if (decodedUser) {
      setUser({ ...user, ...decodedUser, accessToken: accessToken, isValid: true });
    }
  }

  let handleLogout = () => {
    axios.get(`${BASE_URL}/user/logout`)
      .then(() => {
        setUser({ ...user, ...defaultUserControl, isValid: false });
      })
      .catch((err) => {
        console.log(err.message);
      })
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/">
            <Image src={Logo} className="app-logo" />
          </Link>
          {user.isValid ?
            <>
              <Link to={`/profile/${user._id}`}>
                {user.picture ?
                  <Image
                    className="app-header-user-image"
                    src={user.picture}
                    avatar />
                  :
                  <div className="app-header-user-icon">
                    <span>{user.username && user.username.toUpperCase().charAt(0)}</span>
                  </div>
                }
                <span className="username-text">{user.username}</span>
              </Link>
            </>
            : null}
        </header>
        <div className="app-main">
          {user.isValid ?
            <Switch>
              <Route exact path="/">
                <Home user={user} />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path={`/profile/:userId`}>
                <Profile user={user} handleLogout={handleLogout} />
              </Route>
              <Route exact path={`/question/:questionId`}>
                <QuestionDetail user={user} />
              </Route>
              <Route exact path={`/question/:questionId/write-essay`}>
                <WriteEssay user={user} />
              </Route>
              <Route exact path={`/submission/:essayId`}>
                <SubmissionDetail user={user} />
              </Route>
              <Route exact path={`/question/:essayId/write-feedback`}>
                <WriteFeedback user={user} />
              </Route>
              <Route component={NotFound} />
            </Switch> :
            <Landing
              handleSuccessLogin={handleSuccessLogin} />
          }
        </div>
        <footer className="app-footer">
          {user.isValid ?
            <Link to="/about" className="about-text">
              <span>
                About
              </span>
            </Link>
            : null}
          <span className="copyright-text">
            Copyright© 2022 BONUFO
          </span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
