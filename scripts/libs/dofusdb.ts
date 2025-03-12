import axios from 'axios';

export const dofusdb = axios.create({baseURL: 'https://api.dofusdb.fr'})