import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

export const JOB_STATUS = {
    WISHLIST: 'WISHLIST',
    APPLIED: 'APPLIED',
    SCREENING: 'SCREENING',
    INTERVIEW: 'INTERVIEW',
    OFFER: 'OFFER',
    REJECTED: 'REJECTED',
    GHOSTED: 'GHOSTED'
};

export const JobService = {
    async create(jobData, userId) {
        const job = {
            id: uuidv4(),
            userId,
            ...jobData,
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: []
        };
        await db.jobs.add(job);
        return job;
    },

    async getAll(userId) {
        return await db.jobs.where('userId').equals(userId).reverse().sortBy('createdAt');
    },

    async update(id, updates) {
        updates.updatedAt = new Date();
        await db.jobs.update(id, updates);
        return await db.jobs.get(id);
    },

    async delete(id) {
        await db.jobs.delete(id);
    },

    async get(id) {
        return await db.jobs.get(id);
    }
};
