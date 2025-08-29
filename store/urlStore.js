import { create } from 'zustand';

const useUrlStore = create((set) => ({
    BaseUrl : "https://classic-judy-sodiumd5-850b487a.koyeb.app"
}));
export default useUrlStore;