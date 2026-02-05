import './style.css'
import { Router } from './router';
import { AuthService } from './services/auth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { JobDetails } from './pages/JobDetails';
import { Board } from './pages/Board';

const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
        path: '/',
        component: Dashboard,
        guard: () => AuthService.isAuthenticated()
    },
    {
        path: '/applications',
        component: Applications,
        guard: () => AuthService.isAuthenticated()
    },
    {
        path: '/applications/:id',
        component: JobDetails,
        guard: () => AuthService.isAuthenticated()
    },
    {
        path: '/board',
        component: Board,
        guard: () => AuthService.isAuthenticated()
    }
];

const app = document.querySelector('#app');
const router = new Router(routes, app);

// Global logout handler (event delegation can be cleaner, but this works for now)
document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-btn') {
        AuthService.logout();
        router.navigate('/login');
    }
});

