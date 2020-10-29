import React from "react";

import ViewModeler from "view-modeler";
import atidPackage from "assets/json/qa.json";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Link } from "react-router-dom";

import "assets/css/style.css";
import "assets/css/viewCourse.css";
import "assets/css/diagram-js.css";
import "assets/css/vendor/bpmn-font/css/bpmn-embedded.css";
import Chart from 'react-apexcharts'

import InfoActivity from 'components/InfoActivity';

import PropTypes from 'prop-types';
import { userService } from "_services";
import { dialogActions } from "_actions";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';

import { useState } from "react";
import { useEffect } from "react";
import { TextField } from "@material-ui/core";

import DeleteDialog from "./DeleteDialog";

library.add(fab, fas, far);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

let modeler = {};

function EditNetwork(props) {

  const id_network = props.match.params.network;
  const id_course = props.match.params.id;

  const [title_network, setTitleNetwork] = useState('');
  const [current_element, setCurrentElement] = useState( {} );

  const [curretSelectedElement, setCurretSelectedElement ] = useState( {} );

  const [activityLength, setActivityLength] = useState( 0 );
  const [usersLength, setUsersLength] = useState( 0 );
  const [allUsers, setAllUser] = useState( [] );
  const [user_filtered, setFilteredUser] = useState( [] );

  const [searchUser, setSearchUser] = useState( '' );

  const [tab_value, setTabValue] = useState( 0 );
  const [hasLoad, setLoadStatus] = useState( false );

  const [optionsGrade, setOptionsGrade] = useState( {
    chart: {
      width: 380,
      type: 'pie',
    },
    dataLabels: {
      enabled: false
    },
    labels: ['Quiz', 'Lesson', 'Fórum', 'LTI', 'Database'],
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
  const [seriesGrade, setSeriesGrade] = useState( [44, 55, 13, 43, 22] );
  

  const [seriesColumn, setSeriesColumn] = useState( 
    []
   );
   
  const [columnOptions, setColumnOptions] = useState( {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
      title: {
        text: 'Quantidade de atividades'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        }
      }
    }
  } );

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

  const [series, setSeries] = useState( [0, 0, 0, 1] );
  const options = {
    chart: {
      width: 380,
      type: 'pie',
    },
    dataLabels: {
      enabled: false
    },
    labels: ['10.0 - 9.0', '8.9 - 6.0', '5.9 - 3.0', '2.9 - 0.0'],
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
  };

  const filterSearch = ( value ) => {
    //if(searchUser.length == 0) return true;
    return (value.fullname.toLowerCase().search( searchUser.toLowerCase() ) >= 0)
  };

  const getStatusXml = (xml) => {
    var petri_reachability = {};

    var transiction_activity = {};
    var activity_transiction = {};

    var id_elements = {};

    for (var element of xml) {
      //console.log(element)
      if (element["type"] === "custom:start") {
        petri_reachability[element["id"]] = { value: 1, type: element["type"] };
      } else if (element["type"] === "custom:connection") {
        addElement(
          activity_transiction,
          element["source"],
          element["target"]
        );
        addElement(
          transiction_activity,
          element["target"],
          element["source"]
        );
      } else if (
        element["type"] === "custom:atividadeBasica" ||
        element["type"] === "custom:atividadeComposta" ||
        element["type"] === "custom:end"
      ) {
        petri_reachability[element["id"]] = { value: 0, type: element["type"] };
      }

      id_elements[element["id"]] = element;
    }

    return [
      transiction_activity,
      activity_transiction,
      petri_reachability,
      id_elements
    ];
  }


  const addElement = (object, key, value) => {
    if (object[key]) {
      object[key].push(value);
    } else {
      object[key] = [value];
    }
  }

  const selectActivity = (e) => {

    var vetor_result = getStatusXml( modeler.getCustomElements() );
    var activity_elements = vetor_result[3];

    var list_sources_names = [];
    var list_sources_objects = [];

    for(var key in activity_elements){
      if( activity_elements[key].hasOwnProperty("target") && activity_elements[key]["target"] === e.element.id){
        list_sources_names.push( activity_elements[key]["source"] );
      }
    }
    list_sources_names.forEach(function(key){
      if( activity_elements[key].hasOwnProperty("suggestion_uuid") )
      {
        list_sources_objects.push( activity_elements[key] );
      }
    })
  
    setCurrentElement( e.element );

    if( e.element.type === "custom:atividadeBasica" ||
    e.element.type === "custom:start" ||
    e.element.type === "custom:end" )
    {
      props.openDialogConfig("activity_info", current_element.suggestion_uuid, id_network);
    }
    else if( e.element.type === "custom:transicao" ){
      //this.props.openDialogConfig("transction_config", null, this.state.id_network);
    }
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  useEffect(() => {
    if( !hasLoad ){
      setLoadStatus( true );

      userService.sendGETRequest(
        "/status/get",
        {
          network_id: id_network,
          course_id: props.match.params.id,
        },
        function(response) {
          
          if( response.length === 0) return; 
          
          var current_month = new Date().getMonth();

          var month = [];
          month[0] = "Jan";
          month[1] = "Feb";
          month[2] = "Mar";
          month[3] = "Apr";
          month[4] = "May";
          month[5] = "Jun";
          month[6] = "Jul";
          month[7] = "Aug";
          month[8] = "Sep";
          month[9] = "Oct";
          month[10] = "Nov";
          month[11] = "Dec";

          setColumnOptions( {
            chart: {
              type: 'bar',
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: [month[ mod(current_month-8, 12)], month[mod(current_month-7, 12)], month[mod(current_month-6, 12)], month[mod(current_month-5, 12)], month[mod(current_month-4, 12)], month[mod(current_month-3, 12)], month[mod(current_month-2, 12)], month[ mod(current_month-1, 12) ], month[ mod(current_month,12) ]],
            },
            yaxis: {
              title: {
                text: 'Quantidade de atividades'
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val;
                }
              }
            }
          });
          var min_year = new Date().getMonth() > 8 ? new Date().getFullYear() : new Date().getFullYear() -1;
          var min_month = mod(new Date().getMonth()-9, 12);

          var rr = response.filter((item) => {
            var date_split = item.date.split('-');
            return new Date(date_split[0], date_split[1]-1, date_split[2]) > new Date(min_year,min_month,1);
          });

          var r = [];
          
          for(var i = 0; i < (9 - rr.length); i++ )
          {
            r.push({
              'chat': 0,
              'quiz': 0,
              'choice': 0,
            })
          }
          for(var j = 0; j < rr.length; j++ ){
            r.push(rr[j]);
          }

          setSeriesColumn( 
            [{
              name: 'Chat',
              data: [r[0]['chat'], r[1]['chat'], r[2]['chat'], r[3]['chat'], r[4]['chat'], r[5]['chat'], r[6]['chat'], r[7]['chat'], r[8]['chat']],
            }, {
              name: 'Quiz',
              data: [r[0]['quiz'], r[1]['quiz'], r[2]['quiz'], r[3]['quiz'], r[4]['quiz'], r[5]['quiz'], r[6]['quiz'], r[7]['quiz'], r[8]['quiz']],
            }, {
              name: 'Database',
              data: [r[0]['records'], r[1]['records'], r[2]['records'], r[3]['records'], r[4]['records'], r[5]['records'], r[6]['records'], r[7]['records'], r[8]['records']],
            }, {
              name: 'Choice',
              data: [r[0]['choice'], r[1]['choice'], r[2]['choice'], r[3]['choice'], r[4]['choice'], r[5]['choice'], r[6]['choice'], r[7]['choice'], r[8]['choice']],
            }]
           );
        }
      );

      userService.sendGETRequest(
        "/grade_status/get",
        {
          network_id: id_network,
          course_id: props.match.params.id,
        },
        function(response) {

          var names = ['', '', '', '', ''];
          var values_grades = [0, 0, 0, 0, 0]
          var series_grades = [0, 0, 0, 0];
          

          response.forEach((item, index) => {
           
            var current_grade = (item.current_grade / item.total_grade) * 100;

            if( index < names.length) {
              names[index] = item.name;
              values_grades[index] = current_grade;
            }

            if( current_grade < 30 || isNaN( current_grade ) ){
              series_grades[3] = series_grades[3] + 1;
            } else if( current_grade < 60){
              series_grades[2] = series_grades[2] + 1;
            } else if( current_grade < 90){
              series_grades[1] = series_grades[1] + 1;
            } else {
              series_grades[0] = series_grades[0] + 1;
            }
          });

          setSeries( series_grades );

          setBarSeries([{
            data: values_grades
          }]);

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
              categories: [names[0], names[1], names[2], names[3], names[4]],
            }
          });
        }
      );

      userService.sendGETRequest(
        "/get_enrolled_users",
        {
          network_id: id_network,
          course_id: props.match.params.id,
        },
        function(response) {
          
          setUsersLength( response.length );
          setAllUser( response );
          setFilteredUser( response.filter(filterSearch) );

          
          
        }
      );

      userService.sendGETRequest(
        "/questions/getAll",
        {
          page: 1,
          page_size: 5,
          network_id: id_network
        },
        function(response) {
          var suggestions = [];
          var hash_map = {};

          var array = Array.from(
            Object.keys(response),
            k => response[k]["question"]
          );
          array.forEach(function name(params) {
            if(params.label in hash_map)
            {
              hash_map[ params.label ] += 1;
            }
            else{
              hash_map[ params.label ] = 1;
            }

            suggestions.push({
              label: params.name,
              type: params.label,
              uuid: params.uuid
            });
          });

          setActivityLength( suggestions.length );

          setOptionsGrade( {
            chart: {
              width: 380,
              type: 'pie',
            },
            dataLabels: {
              enabled: false
            },
            labels: Object.keys( hash_map ),
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
          }
          );
          
          setSeriesGrade( Object.values(hash_map) );

        }
      );

      modeler = new ViewModeler(
        {
          container: "#canvas",
          keyboard: {
            bindTo: document
          },
          moddleExtensions: {
            atid: atidPackage
          }
        },
        selectActivity);
      
        var pizzaDiagram = '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>';
          
          modeler.importXML(pizzaDiagram, function(err) {
            if (err) {
              console.error("something went wrong:", err);
            }
      
            var eventBus = modeler.get("eventBus");
      
            var events = [
              "element.hover",
              "element.out",
              "element.click",
              "element.dblclick",
              "element.mousedown",
              "element.mouseup"
            ];
            events.forEach(function(event) {
              eventBus.on(event, function(e) {
                if (event === "element.dblclick") { 
                  setCurretSelectedElement( e.element );
 
                  if (e.element.type === "custom:atividadeComposta") {
                    getSubNetwork(e.element.businessObject.uuid);
                  }
                }
              });
            });
            
            getActivity(id_network);
          });
          loadCourseInfo();
    }
    
  }, []);

  const handleChange = (event, newValue) => {
    
    setTabValue( newValue );
  };

  const loadCourseInfo = () => {
    
    userService.sendGETRequest("/courses/get", 
      {
        course_id: props.match.params.id,
      },
      function(response)
      {
        if(response.length === 0) return;

        setTitleNetwork( response[0].fullname );
      });
  }

  const clearNetwork = () => {
    modeler.clearAll();

    var pizzaDiagram = '<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn2:process id="Process_1" isExecutable="false"></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>';
    
    modeler.importXML(pizzaDiagram, function(err) {
      if (err) {
        console.error("something went wrong:", err);
      }
    });
  }

  const getActivity = (id) => {

    userService.sendGETRequest(
      "/users/activity/get/id",
      { id: id },
      function(response) {
        modeler.addCustomElements(JSON.parse(response["all_data"]));
      }
    );
  }

  const getProperties = prop => {
    
    if( current_element['type'] === 'custom:start' || current_element.businessObject['type'] === 'custom:start' )
    {
      return 'custom:start';
    }

    if (current_element.businessObject && current_element.businessObject[prop])
      return current_element.businessObject[prop];
    if (typeof current_element[prop] !== "undefined")
      return current_element[prop];
    return "";
  };

  const updateProperties = (prop, value) => {
    if (current_element.businessObject) {
      modeler.get("modeling").updateProperties(current_element, {
          [prop]: value
        });
    }
      var temp = current_element;
      temp[prop] = value;
      setCurrentElement( current_element );
    
  };

  const getSubNetwork = ( id_subnetwork ) => {

    clearNetwork();

    userService.sendGETRequest(
      "/users/activity/subnetwork/get/id",
      { id_activity: id_network, id_subnetwork: id_subnetwork },

      function(result) {

        setTimeout(function() {
          modeler.addCustomElements(JSON.parse(result["all_data"]));
        }, 100);
      }
    );
  };


    return (
      <div className="viewer">
        <div style={{marginBottom: 10}}>
          <Link to="/painel/turmas/">
            <KeyboardBackspaceIcon fontSize="large" style={{marginRight: 10}} />
          </Link>
            Curso: <b>{title_network.toUpperCase()}</b>
            <span style={{
                  display: 'inline-block',
                  textAlign: 'right',
                  width: 'calc(100% - 160px)',
            }}>
              <DeleteDialog id_course={id_course} />
            </span>
        </div>
        <AppBar position="static" color="default">
          
        <Tabs
          value={tab_value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Rede de Atividades" {...a11yProps(1)} />
          <Tab label="Estatísticas Gerais" {...a11yProps(1)} />
          <Tab label="Alunos" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      
      <TabPanel value={tab_value} index={0}>

        <div className="content with-diagram" id="js-drop-zone">
          <div
            style={{ height: "calc(100vh - 50px)" }}
            className="canvas"
            id="canvas"
          ></div>
        </div>

        </TabPanel>

        <TabPanel value={tab_value} index={1}>
        <Grid container spacing={2}>
          <Grid md={6} xs={12}>
            <div style={{marginBottom: 10}}>
              <div style={{
                  '-webkit-box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  '-moz-box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  backgroundColor: '#fff',
                  paddingRight: 10,
                  width: 'calc(50% - 10px)',
                  marginRight: 10,
                  display: 'inline-block',
                }}>
                  <p>Quantidade de alunos</p>
              <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: 29, margin: 0}}>{usersLength}</p>
              </div>
              <div style={{
                  '-webkit-box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  '-moz-box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  backgroundColor: '#fff',
                  paddingRight: 10,
                  width: 'calc(50% - 10px)',
                  marginRight: 10,
                  display: 'inline-block',
                }}>
                  <p>Quantidade de atividades</p>
                  <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: 29, margin: 0}}>{ activityLength }</p>
              </div>
                
            </div>
           
            <div style={{
              flexDirection: 'row',
              display: 'flex',
              width: 'calc(100% - 10px)',
            }}>
              <Chart style={{
                  display: 'block',
                  backgroundColor: '#fff',
                  flex: 1,
                  marginRight: 10,
      
                  'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  }} options={options} series={series} type="pie" />

                <Chart style={{
                  display: 'block',
                  backgroundColor: '#fff',
                  flex: 1,

                  'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  }} options={optionsGrade} series={seriesGrade} type="pie" />
            </div>
                  
                <Chart style={{
                  display: 'block',
                  marginTop: 10,
                  backgroundColor: '#fff',
                  width: 'calc(100% - 10px)',
                  'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  }} options={columnOptions} series={seriesColumn} type="bar" />
       
            </Grid>
            <Grid md={6} xs={12}>

              <div style={{
                display: 'block',
                backgroundColor: '#fff',
                
                'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                }}>
                <Chart options={barOptions} series={barSeries} type="bar" />
              </div>
            </Grid>
        </Grid>
        
        </TabPanel>
        <TabPanel value={tab_value} index={2}>
            <Grid container justify="flex-start">
              <Grid xs={12} style={{marginBottom: 10}}>
                <TextField value={searchUser} onChange={(e) => {
                  setSearchUser(e.target.value);
                  setFilteredUser( allUsers.filter((value) =>{
                    return (value.fullname.toLowerCase().search( e.target.value.toLowerCase() ) >= 0)
                  }) );
                } } fullWidth variant="filled" />
              </Grid>
       
                {user_filtered.map((item, index) =>
                <Grid item xs={4} style={{padding: 4}} key={index}>
                  <div style={{
                  cursor: 'pointer',
                  backgroundColor: '#fff', 
                  'box-shadow': '0px 0px 5px 0px rgba(102,102,102,1)',
                  padding: 10}}>
                    <h2>{item.fullname}</h2>
                  <p>{item.email}</p>
                  </div>
                </Grid>
                )}
    
            </Grid>
        </TabPanel>

        <InfoActivity
        curretSelectedElement={curretSelectedElement}
        id_course={id_course}
        getProperties={getProperties}
        setProperties={updateProperties}/>
      </div>
    );
  
}

const mapStateToProps = state => ({ dialog: state.dialog });

const mapDispatchToProps = dispatch => ({
  openDialogConfig( name, uuid, id_network ) {
    dispatch( dialogActions.openDialog( name, uuid, id_network ))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditNetwork);
