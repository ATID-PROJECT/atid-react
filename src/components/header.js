import React from 'react';
import { Link } from "react-router-dom";

function Header(){
    return (
        <div style={{display: 'flex', padding: '20px 20px 0 20px'}}>
            <div>
                <Link to="/">
                    <img alt="logo" src="/static/img/atid_logo.png" style={styles.logo} />
                </Link>
            </div>
            <div className="text-right" style={{width: '100%'}}>
                <Link to="/caracteristicas">
                    <a href="/" className="text-white" style={styles.button}>Características</a>
                </Link>
                <Link to="/contato">
                    <a href="/" className="text-white" style={styles.button}>Contato</a>
                </Link>
                <Link to="/preco">
                    <a href="/" className="text-white" style={styles.button}>Preço</a>
                </Link>
                <Link to="/painel">
                    <a href="/" className="text-white white-outline-button">Login</a>
                </Link>
            </div>
        </div>
    );
}

const styles = {
    logo: {
        height: 60,
        cursor: 'pointer',
        marginTop: -4
    },
    button: {
        padding: '8px 15px',
        cursor: 'pointer',
        fontSize: '1rem',
        margin: '0 5px'
    },
}

export default Header;