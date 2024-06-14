import React from 'react';


interface FrontLayoutProps {
  children: React.ReactNode;
}

export default function FrontLayout({ children }: FrontLayoutProps) {
  return (
    <>
        <h1>comman layout</h1>
      {children}
      </>

  );
}
