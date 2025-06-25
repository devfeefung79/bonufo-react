import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Image } from "semantic-ui-react";
import Logo from "../src/assets/logo.png";
import "./App.css";
import About from "./pages/about/About";
import Home from "./pages/home/Home";
import Landing from "./pages/landing/Landing";
import NotFound from "./pages/not-found/NotFound";
import Profile from "./pages/profile/Profile";
import QuestionDetail from "./pages/question/question-detail/QuestionDetail";
import WriteFeedback from "./pages/submission/give-feedback/GiveFeedback";
import SubmissionDetail from "./pages/submission/submission-detail/SubmissionDetail";
import WriteEssay from "./pages/submission/write-essay/WriteEssay";
import { logout, refresh } from "./services/UserService";
import { UserControlModel, defaultUserControl } from "./utils/UserUtils";

function App() {
    const [user, setUser] = useState<UserControlModel>(defaultUserControl);

    useEffect(() => {
        getAccessToken();
    }, []);

    const getAccessToken = async () => {
        const token = await refresh();
        if (token) {
            let decodedUser: UserControlModel = jwt_decode(token.accessToken);
            decodedUser.accessToken = token.accessToken;
            setUser({ ...user, ...decodedUser, isValid: true });
        }
    };

    const handleSuccessLogin = (accessToken) => {
        let decodedUser: UserControlModel = jwt_decode(accessToken);
        if (decodedUser) {
            setUser({
                ...user,
                ...decodedUser,
                accessToken: accessToken,
                isValid: true,
            });
        }
    };

    const handleLogout = async () => {
        await logout;
        setUser({ ...user, ...defaultUserControl, isValid: false });
    };

    return (
        <Router>
            <div className='app-container'>
                <header className='app-header'>
                    <Link to='/'>
                        <Image src={Logo} className='app-logo' />
                    </Link>
                    {user.isValid ? (
                        <>
                            <Link to={`/profile/${user._id}`}>
                                {user.picture ? (
                                    <Image
                                        className='app-header-user-image'
                                        src={user.picture}
                                        avatar
                                    />
                                ) : (
                                    <div className='app-header-user-icon'>
                                        <span>
                                            {user.username &&
                                                user.username
                                                    .toUpperCase()
                                                    .charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <span className='username-text'>
                                    {user.username}
                                </span>
                            </Link>
                        </>
                    ) : null}
                </header>
                <div className='app-main'>
                    {user.isValid ? (
                        <Switch>
                            <Route exact path='/'>
                                <Home user={user} />
                            </Route>
                            <Route exact path='/about'>
                                <About />
                            </Route>
                            <Route exact path={`/profile/:userId`}>
                                <Profile
                                    user={user}
                                    handleLogout={handleLogout}
                                />
                            </Route>
                            <Route exact path={`/question/:questionId`}>
                                <QuestionDetail user={user} />
                            </Route>
                            <Route
                                exact
                                path={`/question/:questionId/write-essay`}
                            >
                                <WriteEssay user={user} />
                            </Route>
                            <Route exact path={`/submission/:essayId`}>
                                <SubmissionDetail user={user} />
                            </Route>
                            <Route
                                exact
                                path={`/question/:essayId/write-feedback`}
                            >
                                <WriteFeedback user={user} />
                            </Route>
                            <Route component={NotFound} />
                        </Switch>
                    ) : (
                        <Landing handleSuccessLogin={handleSuccessLogin} />
                    )}
                </div>
                <footer className='app-footer'>
                    {user.isValid ? (
                        <Link to='/about' className='about-text'>
                            <span>About</span>
                        </Link>
                    ) : null}
                    <span className='copyright-text'>
                        Copyright© 2022 BONUFO
                    </span>
                </footer>
            </div>
        </Router>
    );
}

export default App;
