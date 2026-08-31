"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef=useRef<HTMLDivElement>(null);
  const ringRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!window.matchMedia("(pointer: fine)").matches||window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot=dotRef.current;
    const ring=ringRef.current;
    if(!dot||!ring) return;

    document.documentElement.classList.add("custom-cursor-active");
    let mouseX=-100,mouseY=-100,ringX=-100,ringY=-100,frame=0;
    const render=()=>{ringX+=(mouseX-ringX)*.16;ringY+=(mouseY-ringY)*.16;dot.style.transform=`translate3d(${mouseX}px,${mouseY}px,0)`;ring.style.transform=`translate3d(${ringX}px,${ringY}px,0)`;frame=requestAnimationFrame(render)};
    const move=(event:PointerEvent)=>{mouseX=event.clientX;mouseY=event.clientY;dot.classList.add("visible");ring.classList.add("visible")};
    const over=(event:PointerEvent)=>{const target=event.target as HTMLElement;ring.classList.toggle("interactive",Boolean(target.closest("a,button,input,select,textarea,[role='button']")))};
    const leave=()=>{dot.classList.remove("visible");ring.classList.remove("visible")};
    frame=requestAnimationFrame(render);
    window.addEventListener("pointermove",move,{passive:true});
    document.addEventListener("pointerover",over,{passive:true});
    document.addEventListener("mouseleave",leave);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("pointermove",move);document.removeEventListener("pointerover",over);document.removeEventListener("mouseleave",leave);document.documentElement.classList.remove("custom-cursor-active")};
  },[]);

  return <div className="custom-cursor" aria-hidden="true"><div ref={ringRef} className="cursor-ring"/><div ref={dotRef} className="cursor-dot"/></div>;
}
