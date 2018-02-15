import React, { Component } from 'react';
import { Route, Link,} from 'react-router-dom'
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';

import Following from "./components/user/Following"
import Feed from './components/user/Feed';
import User from './components/user/User'



class App extends Component {
    render() {

        return (
            <div>
                <nav>
                    <Link to="/">Home</Link>
                    {/* <Link to="/user/following">Following</Link> 
                    <Link to="/user/followers">Followers</Link>  */}
                    <Link to="/feed">Feed</Link> {/*Will be Accessed Through Clicking On A Button*/}

                </nav>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/registration" component={Registration}/>
                <Route exact path="/feed" component={Feed}/>
                <Route path="/user" component={User} />
                
            </div>
        )
    }
}

export default App;
