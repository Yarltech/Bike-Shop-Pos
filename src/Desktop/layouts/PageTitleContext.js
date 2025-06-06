import React, { createContext, useContext, useState } from 'react';

const PageTitleContext = createContext();

export const usePageTitle = () => useContext(PageTitleContext);

export const PageTitleProvider = ({ children }) => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  return (
    <PageTitleContext.Provider value={{ isTitleVisible, setIsTitleVisible }}>
      {children}
    </PageTitleContext.Provider>
  );
}; 