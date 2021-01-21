import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../Styles/header.css';
import { withRouter } from 'react-router-dom';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'solid 2px brown'
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            signUpModalIsOpen: false,
            loginModalIsOpen: false,
            email: '',
            pwd: '',
            name: '',
            isLoggedIn: false,
            loggedInUser: ''
        }
    }

    MyOrders=()=>{
        this.props.history.push('/MyOrders');
    }

    signUp = () => {
        this.setState({ signUpModalIsOpen: true });
    }

    login = () => {
        this.setState({ loginModalIsOpen: true });
    }

    handleCancelSignUp = () => {
        this.setState({ signUpModalIsOpen: false });
    }

    handleCancelLogin = () => {
        this.setState({ loginModalIsOpen: false });
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSignUp = () => {
        const { email, pwd, name } = this.state;
        const signUpObj = {
            email: email,
            password: pwd,
            name: name
            
        };
        axios({
            method: 'POST',
            url: 'http://localhost:8901/signup',
            headers: { 'Content-Type': 'application/json' },
            data: signUpObj
        })
            .then(response => {
                if (response.data.message == 'User SignedUp Sucessfully') {
                    this.setState({
                        signUpModalIsOpen: false,
                        email: '',
                        pwd: '',
                        name: ''
                      
                    });
                    alert(response.data.message);
                }
            })
            .catch(err => console.log(err))
    }

    handleLogin = () => {
        const { email, pwd } = this.state;
        const loginObj = {
            email: email,
            password: pwd
        };
        axios({
            method: 'GET',
            url: 'http://localhost:8901/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginObj
        })
            .then(response => {
                this.setState({
                    isLoggedIn: response.data.isAuthenticated,
                    loginModalIsOpen: false,
                    email: '',
                    pwd: '',
                });
                sessionStorage.setItem('isLoggedIn', response.data.isAuthenticated);
            })
            .catch(err => console.log(err))
    }

    handleLogo = () => {
        this.props.history.push('/');
    }

    responseGoogle = (response) => {
        this.setState({ loggedInUser: response.profileObj.name, isLoggedIn: true, loginModalIsOpen: false });
    }

    responseFacebook = (response) => {
        this.setState({ loggedInUser: response.name, isLoggedIn: true, loginModalIsOpen: false });
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, loggedInUser: undefined })
    }
    handleClose = () => {
        this.setState({ loginModalIsOpen: false })
    }

    handleCloseSignup =()=>{
        this.setState({ signUpModalIsOpen: false })
    }
    render() {
        const { signUpModalIsOpen, loginModalIsOpen, email, pwd, name, isLoggedIn, loggedInUser } = this.state;
        return (
            <div className="header">
                <div className="s-logo" onClick={this.handleLogo}>
                    <p>e!</p>
                </div>
                {!isLoggedIn ? <div className="btn-group login-block">
                    <span onClick={this.login} className="login">LogIn</span>
                    <span onClick={this.signUp} className="signUp">Create an account</span>
                    <span onClick={this.MyOrders} className="login">MyOrders</span>
                </div> : <span className="user">{`Logged In As : ${loggedInUser}`}<span className="signUp" style={{marginLeft: '30px'}} onClick={this.handleLogout}>Logout</span></span>}
                <Modal

                    style={customStyles}
                >
                    <div>
                        <h3>SignUp User</h3>
                        <div><span>Email : </span><input type="text" value={email} onChange={(event) => this.handleChange(event, 'email')} /></div>
                        <div><span>Password : </span><input type="password" value={pwd} onChange={(event) => this.handleChange(event, 'pwd')} /></div>
                        <div><span>Name: </span><input type="text" value={name} onChange={(event) => this.handleChange(event, 'name')} /></div>
                        <button onClick={this.handleSignUp} className="btn btn-sm btn-primary">SignUp</button>
                        <button className="btn btn-sm btn-primary" onClick={this.handleCancelSignUp}>Cancel</button>
                    </div>
                </Modal>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="login-heading">Login</div>
                        <div style={{width :'150px', marginBottom: '2px' }}>
                            <GoogleLogin
                                clientId="398221811516-7g4tdhnemd5ke5gmod0mfp1b9ovpfh1u.apps.googleusercontent.com"
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                // className="btn google"
                                cookiePolicy={'single_host_origin'}
                            /></div>
                            <br />
                            <div  style={{width :'150px'}}>
                        <FacebookLogin
                            appId="241783303998158"
                            textButton="Continue with Facebook"
                            
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        /></div>
                        <br />
                        <button className="btn normal-login">
                            <span className="glyphicon glyphicon-user user-icon"></span>
                            Login with Credentials</button>
                        <hr />
                        <div>Don't have account? <span style={{ color: 'red' }}>SignUp</span></div>
                        <div>Don't want to login <span style={{ color: 'blue' }} onClick= {this.handleClose}>Close</span></div>
                    </div>
                </Modal>
                <Modal
                    isOpen={signUpModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="login-heading">Sign Up</div>
                        <div style={{ marginBottom: '2px' }}>
                            <GoogleLogin
                                clientId="745717577080-5uo0jrq7g23qqioe155h28u94a0co1cj.apps.googleusercontent.com"
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                className="google"
                                cookiePolicy={'single_host_origin'}
                            /></div>
                        <FacebookLogin
                            appId="1938560389620287"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        />
                        <hr />
                        <div>Already have an account? <span style={{ color: 'red' }}>Login</span></div>
                        <div>Don't want to login <span style={{ color: 'blue' }} onClick= {this.handleCloseSignup}>Close</span></div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);