import React from 'react';
import ContextMenu from '../components/ContextMenu';

export default function Root({children}) {
  return (
    <>
      {children}
      <ContextMenu />
    </>
  );
}
