import { create } from 'zustand';

const useTokenStore = create((set) => ({
    token: null,
    setToken: (token) => set({ token }),
}));

export default useTokenStore;