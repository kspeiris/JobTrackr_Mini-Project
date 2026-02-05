import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'job_tracker_session';

export const AuthService = {
    async register(username, password) {
        const existing = await db.users.where('username').equals(username).first();
        if (existing) {
            throw new Error('Username already exists');
        }

        // In a real app, hash the password. Here we simulate storage.
        const user = {
            id: uuidv4(),
            username,
            password, // Plain text for demo as per plan
            createdAt: new Date()
        };

        await db.users.add(user);
        return user;
    },

    async login(username, password) {
        const user = await db.users.where('username').equals(username).first();
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        this.setSession(user);
        return user;
    },

    logout() {
        localStorage.removeItem(SESSION_KEY);
    },

    setSession(user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            id: user.id,
            username: user.username
        }));
    },

    getUser() {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    isAuthenticated() {
        return !!this.getUser();
    }
};
