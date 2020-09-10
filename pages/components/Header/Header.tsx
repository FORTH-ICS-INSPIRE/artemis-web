import React from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import Router from 'next/router';

type MyProps = {
   loggedIn: boolean
};

class Header extends React.Component<MyProps> {

    capitalize(s:string) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    render(){
        // let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
        // if(props.location.pathname === '/') {
            
        // }
        let title = 'Login '
        // function renderLogout() {
        //     if(props.location.pathname === '/home'){
        //         return(
        //             <div className="ml-auto">
        //                 <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
        //             </div>
        //         )
        //     }
        // }
        // function handleLogout() {
        //     localStorage.removeItem(ACCESS_TOKEN_NAME)
        //     props.history.push('/login')
        // }
        return(<>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" style={{marginBottom: '20px'}}>
                <div className="container">
                    <a className="navbar-brand" href="/"><img src="/static/artemis_logo.png" width="128px;"/></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav mr-auto">
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                        <li className="nav-item">
                            <a className="nav-link" target="_blank" href="https://www.inspire.edu.gr/artemis/">About</a>
                        </li>
                        {!this.props.loggedIn && (
                            <>
                                <li id="security.login" className="nav-item">
                                    <Link href="/login"><a className="nav-link">login</a></Link>
                                </li>
                                <li id="security.register_user" className="nav-item">
                                    <Link href="/signup"><a className="nav-link">Create Account</a></Link>
                                </li>
                            </>
                        )}
                        {this.props.loggedIn && (
                            <>
                                <li id="security.login" className="nav-item">
                                   <a href="#" className="nav-link" onClick={() => {
                                        cookie.remove('token');
                                        //   revalidate();
                                        Router.push('/');
                                        window.location.reload(false);
                                    }}>Logout</a>
                                </li>
                            </>
                        )}
                          
                        </ul>
                    </div>
                </div>
            </nav>
            </>
        )
    }
}

export default Header;
