import { AuthService } from '../services/auth';

export async function Register() {
    const container = document.createElement('div');
    container.className = "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8";

    container.innerHTML = `
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600">Start tracking your applications</p>
      </div>
      <form class="mt-8 space-y-6" id="register-form">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input id="username" name="username" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Username">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password">
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Register
          </button>
        </div>
        
        <div class="text-sm text-center">
          <a href="#/login" class="font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </a>
        </div>
      </form>
    </div>
  `;

    container.querySelector('#register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            await AuthService.register(formData.get('username'), formData.get('password'));
            // Auto login after register
            await AuthService.login(formData.get('username'), formData.get('password'));
            window.location.hash = '/';
        } catch (err) {
            alert(err.message);
        }
    });

    return container;
}
