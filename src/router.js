export class Router {
    constructor(routes, outlet) {
        this.routes = routes;
        this.outlet = outlet;
        this.currentParams = {};

        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    }

    resolve() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.match(hash);

        if (route) {
            if (route.guard && !route.guard()) {
                return this.navigate(route.redirect || '/login');
            }
            this.currentParams = route.params;
            this.render(route.component);
        } else {
            console.log('404 Not Found', hash);
            // Optional: 404 page
            this.navigate('/');
        }
    }

    match(path) {
        for (const route of this.routes) {
            // Simple exact match
            if (route.path === path) {
                return { ...route, params: {} };
            }

            // Param match (simple implementation: /path/:id)
            if (route.path.includes(':')) {
                const routeParts = route.path.split('/');
                const pathParts = path.split('/');

                if (routeParts.length === pathParts.length) {
                    const params = {};
                    let match = true;

                    for (let i = 0; i < routeParts.length; i++) {
                        if (routeParts[i].startsWith(':')) {
                            params[routeParts[i].slice(1)] = pathParts[i];
                        } else if (routeParts[i] !== pathParts[i]) {
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        return { ...route, params };
                    }
                }
            }
        }
        return null;
    }

    navigate(path) {
        window.location.hash = path;
    }

    async render(componentFn) {
        this.outlet.innerHTML = '';
        const element = await componentFn(this.currentParams);
        if (element) {
            if (typeof element === 'string') {
                this.outlet.innerHTML = element;
            } else {
                this.outlet.appendChild(element);
            }
        }
    }
}
