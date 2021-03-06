import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import EqualizerIcon from '@material-ui/icons/Equalizer';

const Monitors = props => {

return(
    <div>
  <div style={{display: 'flex', flexDirection: 'row'}}>
    <h3>Monitores</h3>
    <div style={{padding: '5px 10px', fontSize: '1.1rem', color: '#A4A8AE', marginBottom: 30}}>
        <span>5 Total</span>
    </div>
  </div>
    <Link to="/painel/monitores/cadastro">
        <Button variant="contained" color="primary">Criar monitor</Button>
    </Link>
   <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
    {[1,2,3,4,5,6].map(() =>{
        return(
            <div style={{
                padding: '20px 40px',
                marginBottom: 30,
                marginRight: 30,
                fontSize: '1.1rem',
                background: '#fff',
                border: '1px solid #e3e1e1'}}>
                    <EqualizerIcon style={{fontSize: 35}} />
                    <p>Monitor x</p>
            </div>
        )
    })}
    </div>
</div>
)
}

export default Monitors;