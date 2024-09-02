import { createContext, useContext } from 'react';
import { APIService } from '..';

export const APIServiceContext = createContext(new APIService());

export const useAPI = () => useContext(APIServiceContext);
