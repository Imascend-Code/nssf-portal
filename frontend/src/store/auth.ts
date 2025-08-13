import { create } from "zustand";
import { api } from "../api/client";
type User = { id:number; email:string; role:"PENSIONER"|"STAFF"|"ADMIN"; full_name:string; phone:string }
type State = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (email:string,password:string)=>Promise<void>;
  register: (payload:{email:string;password:string;full_name?:string;phone?:string})=>Promise<void>;
  fetchMe: ()=>Promise<void>;
  setTokens: (a:string|null, r:string|null)=>void;
  logout: ()=>void;
}
export const useAuthStore = create<State>((set,get)=>({
  accessToken: null, refreshToken:null, user:null,
  async login(email,password){
    const {data} = await api.post("/auth/login/", {email,password});
    get().setTokens(data.access, data.refresh);
    await get().fetchMe();
  },
  async register(payload){
    await api.post("/auth/register/", payload);
    await get().login(payload.email, payload.password);
  },
  async fetchMe(){
    const {data} = await api.get("/auth/me/");
    set({user:data});
  },
  setTokens(a,r){ set({accessToken:a, refreshToken:r}); },
  logout(){ set({accessToken:null, refreshToken:null, user:null}); },
}));
