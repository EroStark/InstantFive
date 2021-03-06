import React, { Component } from 'react';
import { Route, Link, Switch} from 'react-router-dom'
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Following from "./components/user/Following"
import Feed from './components/user/Feed';
import User from './components/user/User';
import U from './components/u/U';
import Settings from './components/Settings';

class App extends Component {
    render() {

        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/registration" component={Registration}/>
                    <Route exact path="/feed" component={Feed}/>
                    <Route exact path="/settings" component={Settings}/>
                    <Route path="/user" component={User} />
                    <Route path="/u" component={U} />
                </Switch>
            </div>
        )
    }
}

export default App;
