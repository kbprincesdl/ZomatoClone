import React, { Component } from 'react'
import '../Styles/header.css';

import { withRouter } from 'react-router-dom';
class SubHeaher extends Component {

    handleLogo = () => {
        this.props.history.push('/');
    }

    render() {
        return (
            <React.Fragment>
                <div className="header">
                    <div className="s-logo" onClick={this.handleLogo}>
                        <p>e!</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(SubHeaher);