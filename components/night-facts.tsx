'use client';
import {useState,useEffect} from 'react';
const facts=[
 ['Kitchen fact','Rice absorbs water and swells as it cooks. That’s why a little dry rice can turn into a generous serving.'],
 ['Kitchen fact','Rinsing rice removes some of the loose starch on the outside of the grains.'],
 ['Kitchen fact','A tightly covered pot traps steam, helping the food inside cook with moist heat.'],
 ['Kitchen fact','Whole spices add aroma as well as flavour. You don’t have to eat every whole spice on your plate!'],
 ['Kitchen fact','Browning onions changes their flavour and colour—one reason fried onions are such a good finishing touch.'],
 ['Kitchen fact','Layering rice and other ingredients means each spoonful can bring a different combination of flavours.'],
 ['Daawat tip','A quiet guest isn’t automatically guilty. Ask a specific question and listen to their answer.'],
 ['Daawat tip','A confident accusation is still only a claim. Look for a reason before you vote.'],
 ['Daawat tip','Not in the gang does not always mean trustworthy. The Aloo is trying to get voted out!'],
 ['Daawat tip','Your role stays secret on everyone else’s screen. What you choose to tell the daawat is up to you.'],
 ['Daawat tip','Raita Rescuers can protect themselves, but can’t protect the same guest two nights in a row.'],
 ['Daawat tip','Ameen’s night immunity does not stop a daytime vote. No plate is completely safe.']
];
export default function NightFacts(){const [index,I]=useState(0);function next(){I(i=>(i+1+crypto.getRandomValues(new Uint32Array(1))[0]%(facts.length-1))%facts.length);}useEffect(()=>{I(crypto.getRandomValues(new Uint32Array(1))[0]%facts.length);const timer=setInterval(next,8000);return()=>clearInterval(timer);},[]);return <section className="nightFacts" aria-label="While you wait"><span className="factIcon" aria-hidden="true">♨</span><div><span className="eyebrow">WHILE THE BIRYANI SIMMERS · {facts[index][0].toUpperCase()}</span><p aria-live="off">{facts[index][1]}</p><small>Fresh facts and tips every 8 seconds. If you have a night power, use the player cards below.</small></div><button className="subtle" onClick={next} aria-label="Show another fact">Another one ↻</button></section>}
