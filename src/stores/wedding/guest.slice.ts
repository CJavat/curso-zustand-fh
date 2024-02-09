import { StateCreator } from "zustand";

export interface GuestSlice {
  guestCount: number;

  setGuestCount: ( guestCount: number ) => void;
}

export const createGuestSlice: StateCreator<GuestSlice, [["zustand/devtools", never]]> = ( set, get, storeApi ) => ({
  guestCount: 0,

  setGuestCount: ( guestCount: number ) => set( 
    { guestCount: guestCount > 0 ? guestCount : 0 }, 
    false, 
    'setGuestCount' ) // Para ponerle el nombre en las devTools. Y es necesario agregarle el tipado: [["zustand/devtools", never]] en el generico.
  ,
})