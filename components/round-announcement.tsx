'use client';
import {useEffect,useRef,useState} from 'react';
import {roundAnnouncement} from '../lib/round-events.mjs';
type Announcement={id:string;kind:string;round:number;title:string;name?:string;message:string;detail:string};
export default function RoundAnnouncement({room}:{room:any}) {
 const [current,setCurrent]=useState<Announcement|null>(null);
 const seen=useRef(new Set<string>());
 const panel=useRef<HTMLElement>(null);
 const button=useRef<HTMLButtonElement>(null);
 const event=roundAnnouncement(room);
 const eventId=event?.id;
 useEffect(()=>{
  if(!event){setCurrent(null);return;}
  const key='biryani-announcement:'+event.id;
  if(seen.current.has(key))return;
  seen.current.add(key);
  try {if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'seen');} catch {}
  setCurrent(event);
 },[eventId]);
 useEffect(()=>{
  if(!current)return;
  const timer=setTimeout(()=>setCurrent(null),3000);
  return()=>clearTimeout(timer);
 },[current?.id]);
 useEffect(()=>{
  if(!current)return;
  const previous=document.activeElement as HTMLElement|null;
  const container=panel.current;
  const siblings=Array.from(container?.parentElement?.children||[]).filter(el=>el!==container) as HTMLElement[];
  const prior=siblings.map(el=>el.inert);
  siblings.forEach(el=>{el.inert=true;});
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  button.current?.focus();
  return()=>{siblings.forEach((el,i)=>{el.inert=prior[i];});document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus();};
 },[current]);
 if(!current)return null;
 return <section ref={panel} className={'roundAnnouncement '+current.kind} role="dialog" aria-modal="true" aria-labelledby="roundAnnouncementTitle" aria-describedby="roundAnnouncementMessage" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();setCurrent(null);}if(e.key==='Tab'){e.preventDefault();button.current?.focus();}}}>
  <div className="roundLight" aria-hidden="true"/>
  <div className="roundContent" key={current.id}>
   <span className="roundEyebrow">BIRYANI BETRAYAL · ROUND {current.round}</span>
   <div className="roundIcon" aria-hidden="true">{current.kind==='night'?'🌙':current.kind==='safe'?'🍲':'🥀'}</div>
   <h1 id="roundAnnouncementTitle">{current.title}</h1>
   {current.name&&<div className="eliminatedName">{current.name}</div>}
   <p id="roundAnnouncementMessage">{current.message}</p>
   <small>{current.detail}</small>
   <button ref={button} onClick={()=>setCurrent(null)}>Continue →</button>
   <span className="autoClose">Automatically continues after 3 seconds</span>
   <div className="roundProgress" aria-hidden="true"><i/></div>
  </div>
  <style jsx>{`
   .roundAnnouncement{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;overflow-y:auto;background:#11191e;color:#fff0d9;padding:30px 24px;text-align:center;isolation:isolate;min-height:100dvh}
   .roundLight{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#42556b55,transparent 65%);z-index:-1;pointer-events:none}
   .eliminated{background:#211516}.eliminated .roundLight{background:radial-gradient(ellipse at 50% 40%,#984b364f,transparent 65%)}
   .safe{background:#1b2116}.safe .roundLight{background:radial-gradient(ellipse at 50% 40%,#7f903e40,transparent 65%)}
   .roundContent{max-width:850px;width:100%;position:relative}.roundEyebrow{font-size:10px;letter-spacing:3px;color:#c6b596;line-height:1.8}
   .roundIcon{font-size:65px;margin:30px 0 24px}.roundContent h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(48px,10vw,114px);line-height:1.02;letter-spacing:-3px;margin:0 0 24px;font-weight:500;color:#ecc58a}
   .night h1{color:#dae3ed}.safe h1{color:#d8e3a9}.eliminatedName{font:500 clamp(32px,6vw,64px)/1.2 'Playfair Display',Georgia,serif;color:#f1c3a8;overflow-wrap:anywhere;margin:15px 0}
   .roundContent p{font-size:20px;line-height:1.7;margin:18px 0;color:#eadac8}.roundContent small{display:block;font-size:13px;color:#b5aa9d;line-height:1.8}
   .roundContent button{display:block;min-width:180px;margin:30px auto 15px;border:1px solid #7e715c;border-radius:8px;padding:14px 25px;background:#ead0a0;color:#2b2219;font-weight:600;font-size:14px;cursor:pointer}
   .roundContent button:focus-visible{outline:2px solid #fff;outline-offset:5px}.autoClose{display:block;font-size:10px;color:#a89f92;line-height:1.8}
   .roundProgress{max-width:200px;height:3px;background:#ffffff18;margin:20px auto 0;overflow:hidden;border-radius:5px}.roundProgress i{display:block;width:100%;height:100%;background:#e7c28a;transform-origin:left;animation:countdown 3s linear forwards}
   @keyframes countdown{to{transform:scaleX(0)}}
   @media(prefers-reduced-motion:no-preference){.roundContent{animation:arrive .3s ease-out both}@keyframes arrive{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}}
   @media(prefers-reduced-motion:reduce){.roundProgress i{animation:none}}
   @media(max-width:650px){.roundIcon{font-size:48px;margin:24px 0}.roundEyebrow{font-size:8px;letter-spacing:2px}.roundContent h1{letter-spacing:-1.5px;font-size:clamp(43px,12vw,70px)}.roundContent p{font-size:16px}.roundContent small{font-size:11px}.roundAnnouncement{padding:25px 20px}}
  `}</style>
 </section>;
}
