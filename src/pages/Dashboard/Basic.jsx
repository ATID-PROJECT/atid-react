import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import DataTable from 'react-data-table-component';

import { userService } from "_services";


const data = [
    { name: 'Mateus Brito', progress: '', grade: '95', last_data: '21/03/2020' }, 
    { name: 'Mateus Brito', progress: '', grade: '95', last_data: '21/03/2020' }, 
    { name: 'Mateus Brito', progress: '', grade: '95', last_data: '21/03/2020' }, 
    { name: 'Mateus Brito', progress: '', grade: '95', last_data: '21/03/2020' }, 
    { name: 'Mateus Brito', progress: '', grade: '95', last_data: '21/03/2020' }, 
    { name: 'Mateus Brito', progress: '', grade: '95', last_data: '21/03/2020' }, 
];

const columns = [
  {
    name: 'Nome',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Progresso',
    selector: 'progress',
    sortable: true,
  },
  {
    name: 'Nota',
    selector: 'grade',
    sortable: true,
  },
  {
    name: 'Último registro',
    selector: 'last_data',
    sortable: true,
    right: true,
  },
];

export default class BasicDashboard extends Component {
    constructor() {
        super();

        this.state = {
            dropdownOpen: false,
            activeTab1: '11',
            total_networks: 0,
            total_courses: 0,
            total_students: 0,
            total_activitys: 0,

            chat_percentage: 0,
            forum_percentage: 0,
            choice_percentage: 0,
            quiz_percentage: 0,
        };
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);

        const that = this;
        userService.sendGETRequest(
            "/general/status",
            {
            },
            function(response) {
              
              that.setState({ 
                total_networks: response['networks'],
                total_courses: response['courses'],
                total_students: response['users'],
                total_activitys: response['activitys'],

                chat_percentage: this.calculatePercentage(response['chat'] , response['activitys']),
                forum_percentage: this.calculatePercentage(response['forum'] , response['activitys']),
                choice_percentage: this.calculatePercentage(response['choice'] , response['activitys']),
                quiz_percentage: this.calculatePercentage(response['quiz'] , response['activitys']),
                })
              
            }
          );

    }

    calculatePercentage(unity, total) {
        const result = ((unity / total) * 100).toFixed(2);
        return result ? result : 0;
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    toggle1(tab) {
        if (this.state.activeTab1 !== tab) {
            this.setState({
                activeTab1: tab
            });
        }
    }

    render() {

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        
                        <h3>Visão Geral</h3>

                        <div>
                        <DataTable
                            columns={columns}
                            data={data}
                            theme="solarized"
                        />
                        </div>
                        
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
