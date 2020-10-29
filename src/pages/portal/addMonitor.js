import React, { useState } from "react";
import Button from "@material-ui/core/Button";

const AddMonitor = props => {

  const [monitorsOptions, setMonitorsOptions] = useState([
    {
      title: 'Cursos ativos',
      selected: false,
    },
    {
      title: 'Informações de alunos',
      selected: false,
    },
    {
      title: 'Sessões de usuários por semana',
      selected: false,
    },
    {
      title: 'Mapa de usuários',
      selected: false,
    },
    {
      title: 'Mapear atividades da semana',
      selected: false,
    },
  ]);

  const toggleSelection = ( option ) => {
    
    let updated_options = [...monitorsOptions];
    for(let i = 0; i < updated_options.length; i++)
    {
      if( updated_options[i].title == option)
      updated_options[i].selected = !updated_options[i].selected;
    }
    setMonitorsOptions( updated_options );
  
  }

return(
    <div>
  <div className="container">
    <div>
      <h3>Cadastro de Monitor</h3>
    </div>
    <div className="row">
      <div className="col-12 col-md-8">
        <input className="form-control" type="text" style={{width: '100%'}} placeholder/>

        <div style={{minHeight: 400, marginTop: 20}}>

          {monitorsOptions.filter((item) => item.selected).map((item) => {
            return(
              <div style={{
                border: '1px solid grey',
                padding: 10,
                backgroundColor: "#3984A3",
                marginBottom: 5,
                color: '#fff',
              }}>
                {item.title}
              </div>
            )
          })

          }

        </div>

        <Button variant="contained" color="primary">Cadastrar</Button>
      </div>
      <div className="col-12 col-md-4">
        <select style={{minWidth: 200}}>
          <option>Rede 1</option>
          <option>Rede 2</option>
          <option>Rede 3</option>
          <option>Rede 4</option>
        </select>

        <div style={{flex: 1, minHeight: '80vh', backgroundColor: '#fff', borderLeft: '1px solid #cacaca'}}>
        <p style={{
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          paddingBottom: 25,
          margin: '5px 0'
        }}>Monitores disponiveis</p>       

        <div>
          {monitorsOptions.map((option) => {
            return(
              <div
              onClick={() => toggleSelection(option.title)}
              style={{
                backgroundColor: option.selected ? '#40bda6' : '#fff',
                padding: 5,
                borderBottom: '1px solid #c2c2'}}>
                <p style={{
                  color: option.selected ? '#fff' : '#444',
                }}>{option.title}</p>
              </div>
            )
          })}
        </div>

        </div>
      </div>
    </div>
    
  </div>
</div>
)
}

export default AddMonitor;