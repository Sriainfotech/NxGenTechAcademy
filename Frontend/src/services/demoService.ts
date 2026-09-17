import axiosInstance from '@/api/axiosInstance';

export interface Participant {
    id: number;
    name?: string;
    fullname?: string;
    attended: boolean;
    rescheduled?: boolean;
}

export interface Demo {
    id?: number;
    campaign: string;
    instructor: string;
    date: string;
    time: string;
    status: string;
    link: string;
    participants?: Participant[];
}

export interface DemoFormCourse {
    id: number;
    name: string;
    slug: string;
}

export interface DemoBookingPayload {
    full_name: string;
    email: string;
    phone: string;
    course: string;
}

export interface DemoBookingResponse {
    message: string;
    demo_request: {
        id: number;
        full_name: string;
        email: string;
        phone: string;
        course: string;
        created_at: string;
    };
}

export const demoService = {
    // Get the course list for the public "Book a Free Demo" sidebar form
    getFormCourses: async (): Promise<DemoFormCourse[]> => {
        const response = await axiosInstance.get('/api/demo/courses/');
        return response.data;
    },

    // Submit the public "Book a Free Demo" sidebar form
    bookDemo: async (data: DemoBookingPayload): Promise<DemoBookingResponse> => {
        const response = await axiosInstance.post('/api/demo/book/', data);
        return response.data;
    },

    // Schedule a new demo
    scheduleDemo: async (data: any) => {
        const response = await axiosInstance.post('/api/demo/schedule/', data);
        return response.data;
    },

    // Get all scheduled demos
    getAllDemos: async () => {
        const response = await axiosInstance.get('/api/demo/');
        return response.data;
    },

    // Get single demo details
    getDemo: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/`);
        return response.data;
    },

    // Update demo details (e.g., attendance or status)
    updateDemo: async (id: number | string, data: any) => {
        const response = await axiosInstance.put(`/api/demo/${id}/`, data);
        return response.data;
    },

    // Delete a demo
    deleteDemo: async (id: number | string) => {
        const response = await axiosInstance.delete(`/api/demo/${id}/`);
        return response.data;
    },

    // Get leads for a specific demo
    getDemoLeads: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/leads/`);
        return response.data;
    },

    // Post attendance for a demo
    postAttendance: async (id: number | string, attendanceData: any) => {
        const response = await axiosInstance.post(`/api/demo/${id}/attendance/`, attendanceData);
        return response.data;
    },

    // Reschedule absent participants
    rescheduleDemo: async (id: number | string, data: any) => {
        const response = await axiosInstance.post(`/api/demo/${id}/reschedule/`, data);
        return response.data;
    },

    // Get reschedule details
    getRescheduleDetails: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/reschedule/`);
        return response.data;
    },

    // Get demo status
    getDemoStatus: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/status/`);
        return response.data;
    }
};
