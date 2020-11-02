import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';

import TimelineIcon from '@material-ui/icons/Timeline';
import ExtensionIcon from '@material-ui/icons/Extension';
import EventIcon from '@material-ui/icons/Event';
import AdjustIcon from '@material-ui/icons/Adjust';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import BuildIcon from '@material-ui/icons/Build';
import AddIcon from '@material-ui/icons/Add';
import { Link } from "react-router-dom";

function Nav(props){

    const link_list = [
        {
            link: "/painel",
            title: "Geral",
            icon: <TimelineIcon style={styles.icon} />
        },
        {
            link: "/painel/cursos",
            title: "Cursos",
            icon: <ExtensionIcon style={styles.icon} />
        },
        {
            link: "/painel/calendario",
            title: "Calendário",
            icon: <EventIcon style={styles.icon} />
        },
        {
            link: "/painel/motor-de-busca",
            title: "Motor de busca",
            icon: <AdjustIcon style={styles.icon} />
        },
        {
            link: "/painel/monitores",
            title: "Monitores",
            icon: <EqualizerIcon style={styles.icon} />
        },
        {
            link: "/painel/alertas",
            title: "Alertas",
            icon: <NotificationImportantIcon style={styles.icon} />
        },
        {
            link: "/painel/configuracoes",
            title: "Configurações",
            icon: <BuildIcon style={styles.icon} />
        },
    ];

        return (
            <Fragment>
                <div style={styles.menuLink}>
                    <Link to="/painel/conectar">
                        <div className="secondary-btn mt-3 mb-4" style={{ display: 'flex' }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>Conectar</div>
                            <AddIcon />
                        </div>
                    </Link>
                    {link_list.map((item, index) => {
                        return(
                            <Link to={item.link} key={index}>
                                <div style={styles.link}>
                                    {item.icon}
                                    <span className={item.link === props.location.pathname ? "font-weight-bold" : ""} style={{color: "#333"}}>{item.title}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </Fragment>
        );
}


const styles = {
    sidePanel: {
        minWidth: 240,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    menuLink: {
        display: 'flex',
        flexDirection: 'column'
    },
    icon: {
        marginRight: 15,
        color: '#21819F'
    },
    link: {
        padding: '5px 0',
        marginBottom: 2,
        fontSize: '14px',
        cursor: 'pointer'
    },
    panelLinks: {
        borderRight: '1px solid rgba(118, 115, 115, 0.25)',
        height: '100%',
        padding: '0 20px',
    }
}

export default withRouter(Nav);