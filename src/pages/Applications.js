import { Layout } from '../components/Layout';
import { JobForm } from '../components/JobForm';
import { JobService, JOB_STATUS } from '../services/jobs';
import { AuthService } from '../services/auth';

export async function Applications() {
  const user = AuthService.getUser();
  if (!user) return document.createElement('div');

  let allJobs = await JobService.getAll(user.id);

  // State for filters
  let filters = {
    search: '',
    status: 'ALL',
    sort: 'newest'
  };

  const contentDiv = document.createElement('div');

  const getFilteredJobs = () => {
    let result = [...allJobs];

    // Filter by status
    if (filters.status !== 'ALL') {
      result = result.filter(job => job.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(job =>
        job.company.toLowerCase().includes(term) ||
        job.role.toLowerCase().includes(term)
      );
    }

    // Sort
    if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.sort === 'company') {
      result.sort((a, b) => a.company.localeCompare(b.company));
    }

    return result;
  };

  const render = () => {
    const filteredJobs = getFilteredJobs();

    const renderJobs = () => {
      return filteredJobs.map(job => {
        const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=128`;

        // Status Logic for Badge
        const getStatusColor = (s) => {
          const colors = {
            'APPLIED': 'bg-blue-100 text-blue-800',
            'INTERVIEW': 'bg-purple-100 text-purple-800',
            'OFFER': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'GHOSTED': 'bg-gray-100 text-gray-800',
            'WISHLIST': 'bg-yellow-100 text-yellow-800',
            'SCREENING': 'bg-indigo-100 text-indigo-800'
          };
          return colors[s] || 'bg-gray-100 text-gray-800';
        };

        return `
            <tr class="hover:bg-white/60 transition-colors cursor-pointer group" onclick="window.location.hash='/applications/${job.id}'">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full shadow-sm" src="${logoUrl}" alt="${job.company}">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900">${job.company}</div>
                    ${job.link ? `<a href="${job.link}" target="_blank" onclick="event.stopPropagation()" class="text-xs text-indigo-500 hover:text-indigo-700 hover:underline">Visit Website</a>` : ''}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${job.role}</div>
                <div class="text-xs text-gray-500">${job.salary || 'Salary not specified'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}">
                  ${job.status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    ${job.location || 'Remote'}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(job.updatedAt).toLocaleDateString()}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${job.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors hover:bg-indigo-100 mr-2" onclick="event.stopPropagation()">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button data-id="${job.id}" class="delete-btn text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors hover:bg-red-100" onclick="event.stopPropagation()">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
            `;
      }).join('');
    };

    contentDiv.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
        <button id="add-job-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Add Application
        </button>
      </div>

      <div class="bg-white p-4 rounded-lg shadow mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
        <div class="flex-1">
            <input type="text" id="search-input" placeholder="Search company or role..." value="${filters.search}" 
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="w-full md:w-48">
            <select id="status-filter" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="ALL">All Status</option>
                ${Object.values(JOB_STATUS).map(s => `<option value="${s}" ${filters.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
        </div>
        <div class="w-full md:w-48">
            <select id="sort-filter" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="newest" ${filters.sort === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="oldest" ${filters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                <option value="company" ${filters.sort === 'company' ? 'selected' : ''}>Company A-Z</option>
            </select>
        </div>
      </div>

      <div class="bg-white/30 backdrop-blur-lg rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white/50 backdrop-blur-lg">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role / Salary</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th scope="col" class="relative px-6 py-3"><span class="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody class="bg-white/40 divide-y divide-gray-200">
            ${renderJobs()}
          </tbody>
        </table>
        ${filteredJobs.length === 0 ? '<p class="p-4 text-center text-gray-500">No applications found.</p>' : ''}
      </div>
    `;

    // Re-attach event listeners
    const addBtn = contentDiv.querySelector('#add-job-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const modal = JobForm({
          onSubmit: async (data) => {
            await JobService.create(data, user.id);
            allJobs = await JobService.getAll(user.id);
            render();
          }
        });
        document.body.appendChild(modal);
      });
    }

    const searchInput = contentDiv.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('change', (e) => {
        filters.search = e.target.value;
        render();
      });
    }

    const statusSelect = contentDiv.querySelector('#status-filter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        filters.status = e.target.value;
        render();
      });
    }

    const sortSelect = contentDiv.querySelector('#sort-filter');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        filters.sort = e.target.value;
        render();
      });
    }

    contentDiv.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // prevent row click if we add it later
        if (confirm('Are you sure?')) {
          await JobService.delete(e.target.dataset.id);
          allJobs = await JobService.getAll(user.id);
          render();
        }
      });
    });

    contentDiv.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const job = allJobs.find(j => j.id === e.target.dataset.id);
        const modal = JobForm({
          initialData: job,
          onSubmit: async (data) => {
            await JobService.update(job.id, data);
            allJobs = await JobService.getAll(user.id);
            render();
          }
        });
        document.body.appendChild(modal);
      });
    });
  };

  render(); // Initial render

  return Layout(contentDiv);
}
