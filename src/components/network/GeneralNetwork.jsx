import React from 'react';
import AssignmentIcon from '@material-ui/icons/Assignment';
import book_lover from "assets/img/book_lover.svg"

function GeneralNetwork(props) {


    return (
        <div className="container" style={{ paddingTop: 20, paddingBottom: 20 }}>
            <div className="row">
                <div className="col-12 col-md-8" style={{ display: 'flex' }}>
                    <div className="p-3">
                        <AssignmentIcon style={{ color: '#ee7a14', fontSize: 40 }} />
                    </div>
                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                        <p style={{ marginBottom: 2 }}>sigla</p>
                        <h3 style={{ marginBottom: 2 }}>Course name</h3>
                        <p>Desc</p>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <img alt="" src={book_lover} style={{ width: '100%' }} />
                </div>
            </div>
        </div>
    );

}

export default GeneralNetwork;