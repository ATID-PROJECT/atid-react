import Index from 'pages/Index.js';
import Login from 'pages/Login.jsx';
import Registro from 'pages/Registro.jsx';
import LayoutDashboard from 'pages/LayoutDashboard.jsx';
//import Dashboard from 'pages/Dashboard.jsx';

export const privateRoutesList = [
    { path: "/painel", component: LayoutDashboard },
];

export const routesList = [
    { exact: true, path: "/", component: Index },
    { path: "/login", component: Login },
    { path: "/registro", component: Registro },
];
