import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {

  const [_filtered_content,_setFilteredContent]=useState([])
  
  

  const value = {
    _filtered_content,
    _setFilteredContent,
  };
  

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
   return useContext(SearchContext);
};