import { create } from 'zustand';

const useUrlStore = create((set) => ({
    BaseUrl : "http://192.168.2.2:8081"
}));
export default useUrlStore;