import Dexie from 'dexie';

export const db = new Dexie('JobTrackerDB');

db.version(1).stores({
    users: 'id, username', // Primary key and indexed props
    jobs: 'id, userId, company, role, status'
});
