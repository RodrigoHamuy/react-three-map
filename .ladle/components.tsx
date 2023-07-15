import { GlobalProvider } from "@ladle/react";
import './style.css';
import React, { memo, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import burgerSvg from './burger.svg';

export const Provider: GlobalProvider = ({ children }) => {
  const [header] = useState(() => document.createElement('div'));

  const toggle = useCallback(() => {
    if (!header.parentElement) return;
    header.parentElement.classList.toggle('hide')
  }, [])

  const hide = useCallback((e: any)=>{
    if (!header.parentElement) return;
    if(e.target.nodeName !== 'A') return;
    header.parentElement.classList.add('hide')
  }, [])

  useEffect(() => {
    const container = document.querySelector('.ladle-aside');
    if (!container) return;
    container.prepend(header);
    container.classList.add('hide');
    container.addEventListener('click', hide)
    return () => {
      header.remove();
      container.removeEventListener('click', hide)
    }
  }, [])
  return <>
    {createPortal(<Header toggle={toggle} />, header)}
    {children}
  </>
}

interface HeaderProps {
  toggle: () => void;
}

const Header = memo<HeaderProps>(({ toggle }) => {
  return <>
    <button className="story-menu-btn" onClick={toggle}><img src={burgerSvg} alt="toggle menu" /></button>
    <h1><img src="favicon.svg" style={{ width: '1rem' }} /> react-three-map</h1>
    <div style={{ paddingBottom: 15 }} className="story-header">
      <p>R3F inside Mapbox & Maplibre</p>
      <div style={{ display: 'inline-grid', gap: 10, gridTemplateColumns: 'repeat(2,auto' }}>
        <a href="https://github.com/RodrigoHamuy/react-three-map">
          <img src="https://img.shields.io/static/v1?&message=github&style=flat&colorA=000000&colorB=000000&label=&logo=github&logoColor=ffffff" alt="react-three-map repository" />
        </a>
        <a href="https://www.npmjs.com/package/react-three-map">
          <img src={`https://img.shields.io/npm/v/react-three-map?style=flat&colorA=000000&colorB=000000&logo=npm`} alt="react-three-map NPM package" />
        </a>
      </div>
    </div>
  </>
})
Header.displayName = 'Header';