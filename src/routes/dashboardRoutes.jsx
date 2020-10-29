import Dashboard from 'pages/Dashboard.jsx';
import Networks from 'pages/Networks.jsx';
import Courses from 'pages/Courses.jsx';
import ViewCourse from 'pages/Dashboard/ViewCourse.jsx';
import NewNetwork from 'components/network/NewNetwork.jsx';
import DuplicateNetwork from 'components/network/DuplicateNetwork.jsx';
import ActivityItem from 'pages/ActivityItem.jsx';
import ActivityInfo from 'pages/ActivityInfo.jsx';
import ResourcesNetwork from 'pages/ResourcesNetwork.jsx';
import BasicDashboard from 'pages/Dashboard/Basic';
import Calendar from 'pages/portal/calendar/index.js';
import Alerts from 'pages/portal/alerts';
import Monitors from 'pages/portal/monitors';
import AddMonitor from 'pages/portal/addMonitor';

export const dashboardRoutes = [
    { exact: true, path: "/", component: Dashboard },
];

export const internRoutes = [

    { exact: true, path: "/painel/", component: BasicDashboard },
    { path: "/painel/cursos/editar/:id", component: ResourcesNetwork },
    { path: "/painel/preferencias", component: Networks },
    { path: "/painel/cursos/cadastro", component: NewNetwork },
    { path: "/painel/cursos/:id/duplicar", component: DuplicateNetwork },
    { path: "/painel/cursos/:id/recursos", component: ResourcesNetwork },
    { path: "/painel/cursos/:id/atividade/editar/:tipo/uuid/:uuid", component: ActivityItem },
    { path: "/painel/cursos/:id/atividade/cadastro/:tipo", component: ActivityItem },
    { path: "/painel/turma/:id/rede/:network/activity/:id_activity", component: ActivityInfo },
    { path: "/painel/cursos", component: Networks },
    { path: "/painel/turmas", component: Courses },
    { path: "/painel/turma/:id/rede/:network", component: ViewCourse },
    { exact: true, path: "/painel/alertas", component: Alerts },
    { path: "/painel/calendario", component: Calendar },
    { exact: true, path: "/painel/monitores", component: Monitors },
    { path: "/painel/monitores/cadastro", component: AddMonitor },

    // { exact: true, path: "/", component: BasicDashboard },
];