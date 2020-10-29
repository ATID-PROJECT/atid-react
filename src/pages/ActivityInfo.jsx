import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from '@material-ui/core/Grid';
import { userService } from "_services";

import UserAttemps from "./Modal/UserAttemps.jsx";
import {
  useParams
} from "react-router-dom";
import { useEffect, useState } from "react";
import Chart from 'react-apexcharts'
import Button from '@material-ui/core/Button';

const styles = theme => ({
  fullView: {
    height: "auto",
    width: "100vw",
    position: 'fixed',
    left: 0,
  },

  button:{
    marginTop: 3
  }
});

function ActivityInfo( props ){

  const [resCount, setResCount] = useState(0);

  const [medianGrade, setMedianGrade] = useState( 0 );
  const [activityInfo, setActivityInfo] = useState( [] );
  const [rows, setRows] = useState( [] );
  const [_, setAttempsInfo] = useState( [] );
  const [optionsGrade, setOptionsGrade] = useState( {
    chart: { width: 380, type: 'pie', }, dataLabels: { enabled: false },
    labels: ['0 - 2.9', '3 - 4.9', '5 - 6.9', '7 - 8.9', '9 - 10'],
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
  } );
  const [optionsAttemps, setOptionsAttemps] = useState( {
    chart: { width: 380, type: 'pie', }, dataLabels: { enabled: false },
    labels: ['1 tentativa', '2 tentativas'],
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
  } );
  const [seriesGrade, setSeriesGrade] = useState( [2, 0, 3, 0, 0] );
  const [seriesAttemps, setSeriesAttemps] = useState( [10, 8] );
  
  const [barSeries, setBarSeries] = useState( [{
    data: [0, 0, 0, 0, 0]
  }] );

  const [barOptions, setBarOptions] = useState({
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['', '', '', '', ''],
    }
  });

  const [open, setOpen] = React.useState(false);
  
  const { id, network, id_activity } = useParams();

  useEffect(() => {  
    getAnalyze(id, network, id_activity);
    getAttempsAnalyze(id, network, id_activity);
  }, []);

  const plural = ( qt ) => {
    if( qt === 1) return "s";
    else return "";
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const getAttempsAnalyze = ( course_id, prop_id_network, activity_id) => {
    userService.sendGETRequest(
      "/attemps_analyze",
      {
        course_id: course_id,
        network_id: prop_id_network,
        activity_id: activity_id,
      },
      function(response) {

        setAttempsInfo( response );
        var num_map = {};
        var temp_index = 0;
        response.map((item) => {
          if( num_map[`${item.tentativas}`] !== null) return [];
          num_map[`${item.tentativas}`] = temp_index;
          temp_index+=1;
        });

        var tentativas = response.map((item) => `${item.tentativas} tentativa`+plural(item.tentativas));
        tentativas = tentativas.filter(function(item, pos, self) {
          return self.indexOf(item) === pos;
        })
        var array_attemps = tentativas.map(() => 0);
        setOptionsAttemps( {
          chart: { width: 380, type: 'pie', }, dataLabels: { enabled: false },
          labels: tentativas,
          responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
        } );
     
        for(let i = 0; i < response.length; i++)
        {
          var item = response[ i ];
          const index = num_map[`${item.tentativas}`];

          array_attemps[ index ] = array_attemps[ index ] + 1;
        }

        setSeriesAttemps( array_attemps );

        var new_rows = response.map((item) => createData(item.firstname, item.tentativas));
        setRows( new_rows );
      });
  }

  const getAnalyze = ( course_id, prop_id_network, activity_id) => {
    userService.sendGETRequest(
      "/activity_analyze",
      {
        course_id: course_id,
        network_id: prop_id_network,
        activity_id: activity_id,
      },
      function(response) {
        
        setActivityInfo( response );

        var students = [];
        var grades = [];
        var response_count = 0;
        var maxgrade = 0;
        var series_grade_array= [0,0,0,0,0];

        for(var i = 0; i < response.length; i++)
        {
          maxgrade=parseInt(response[i]['maxgrade']);
          
          var value_grade = parseInt(response[i]['grade']);
          value_grade = value_grade !== 'null' ? value_grade : 0;
          if(!isNaN(value_grade)) response_count+=1;
          value_grade = isNaN( value_grade )? 0 : parseInt(value_grade);
          
          students.push(response[i]['firstname']);
          grades.push( value_grade );

          if( value_grade < 0.3 * maxgrade )
          {
            series_grade_array[0] = series_grade_array[0] + 1;
          } else if( value_grade < 0.5 * maxgrade)
          {
            series_grade_array[1] = series_grade_array[1] + 1;
          }else if( value_grade < 0.7 * maxgrade)
          {
            series_grade_array[2] = series_grade_array[2] + 1;
          }else if( value_grade < 0.9 * maxgrade)
          {
            series_grade_array[3] = series_grade_array[3] + 1;
          } else {
            series_grade_array[4] = series_grade_array[4] + 1;
          }
        }

        

      
        setBarOptions({
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: students,
          }
        });

        setBarSeries( [{ 
          data: grades
        }]  );



        
        setOptionsGrade( {
          chart: {
            width: 380,
            type: 'pie',
          },
          dataLabels: {
            enabled: false
          },
          labels: [
            `0 - ${parseFloat(maxgrade * 0.29).toFixed(2)}`, 
            `${parseFloat(maxgrade * 0.3).toFixed(2)} - ${parseFloat(maxgrade * 0.49).toFixed(2)}`,
            `${parseFloat(maxgrade * 0.5).toFixed(2)} - ${parseFloat(maxgrade * 0.69).toFixed(2)}`,
            `${parseFloat(maxgrade * 0.7).toFixed(2)} - ${parseFloat(maxgrade * 0.89).toFixed(2)}`,
            `${parseFloat(maxgrade * 0.9).toFixed(2)} - ${parseFloat(maxgrade * 1.0).toFixed(2)}`,
          ],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        } );

        setMedianGrade( grades.reduce((a,b) => a+b)/grades.length )
        setSeriesGrade( series_grade_array )
        setResCount(response_count);

      }
    );
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const height_graph_students = activityInfo.length > 0 ? 40 * activityInfo.length : 1;

  return (
    <div className="App">
      <UserAttemps rows={rows} open={open} onClose={handleClose}  />
        <div style={{padding: "10px 85px", background: "#d9d9d9"}}>

            <h2>Análise das atividades</h2>
            
        </div>

      <Grid container>
        <Grid xs={4}>
          <p>Notas</p>
          <Grid spacing={2}>
            <div>
            <Chart style={{
                display: 'block',
                backgroundColor: '#fff',
                flex: 1,

                'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                }} options={optionsGrade} series={seriesGrade} type="pie" />
            </div>
          </Grid>
        </Grid>
        <Grid xs={4} style={{paddingTop: 30}}>
          <div style={styles.button}>
            <Button variant="contained" >
              { resCount === 1
                ? `${resCount} aluno respondeu`
                : `${resCount} alunos responderam`
              }
            </Button>
          </div>
          <div style={{marginTop: 5}}>
            <Button variant="contained" >
              { (activityInfo.length - resCount) === 1
                ? `${activityInfo.length - resCount} Aluno não respondeu`
                : `${activityInfo.length - resCount} Alunos não responderam`
              }
            </Button>
          </div>
          <div style={{marginTop: 5}}>
            <Button variant="contained" >Nota média: {parseFloat(medianGrade).toFixed(1)}</Button>
          </div>
        </Grid>
        <Grid xs={4}>
        <div style={{marginTop: 10}}>
          <p>Tentativas <Button onClick={handleClickOpen} variant="contained">+ Detalhes</Button></p>
            <Chart style={{
                display: 'block',
                backgroundColor: '#fff',
                flex: 1,

                'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                }} options={optionsAttemps} series={seriesAttemps} type="pie" />
            </div>
        </Grid>
        <Grid xs={12}>
          <Chart height={height_graph_students} style={{width: '90%'}} options={barOptions} series={barSeries} type="bar" />
        </Grid>
      </Grid>
    </div>
  );
 
}

export default withStyles(styles)(ActivityInfo);