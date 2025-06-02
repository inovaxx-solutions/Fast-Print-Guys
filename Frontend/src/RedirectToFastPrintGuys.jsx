// src/RedirectToFastPrintGuys.jsx
import { useEffect } from 'react';

const RedirectToFastPrintGuys = () => {
  useEffect(() => {
    window.location.href = 'https://fastprintguys.com/';
  }, []);
  return null;
};

export default RedirectToFastPrintGuys;
