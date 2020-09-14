import React from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import Router from 'next/router';

type MyProps = {
    loggedIn: boolean
};

class Header extends React.Component<MyProps> {

    capitalize(s: string) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    render() {

        let title = 'Login '
        return (<>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" style={{ marginBottom: '20px' }}>
                <div className="container">
                    <a className="navbar-brand" href="/"><img src="/static/artemis_logo.png" width="128px;" /></a>
                    {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="nav navbar-nav navbar-right">
                        {this.props.loggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link href="/overview"><a className="nav-link">Overview</a></Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/bgpupdates"><a className="nav-link">BGP Updates</a></Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/hijacks"><a className="nav-link">Hijacks</a></Link>
                                </li>
                            </>
                        )}
                        </ul>
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li className="nav-item">
                            <a className="nav-link" target="_blank" href="https://www.inspire.edu.gr/artemis/">About</a>
                        </li>
                        {!this.props.loggedIn && (
                            <>
                                <li id="security.login" className="nav-item">
                                    <Link href="/login"><a className="nav-link">Login</a></Link>
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
