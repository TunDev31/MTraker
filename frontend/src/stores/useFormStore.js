import {create} from 'zustand'

export const useFormStore = create((set,get)=> ({
    isOpen: false,
    setOpenForm : ()=> {
       set({ isOpen : !get().isOpen});
    }
}))