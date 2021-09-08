import React from 'react'

export default function Equilibrium(props) {

    const colorGood_0 = {start: '#909D0D', stop:'#E9FF03'}
    const colorGood_1 = {start: '#D0E026', stop:'#7E8906'}
    const colorGood_2 = {start: '#D0E026', stop:'#E9FF00'}

    const colorBad_0 = {start: '#9D0D0D', stop:'#FF0303'}
    const colorBad_1 = {start: '#E02626', stop:'#890606'}
    const colorBad_2 = {start: '#E02626', stop:'#FF0000'}

   return (
    <svg width="396" height="138" viewBox="0 0 396 138" fill="none"  xmlns="http://www.w3.org/2000/svg">
    <path d="M-2.96495e-06 70.1697L51.2718 0.000287914L100.572 70.1697L51.2718 138L-2.96495e-06 70.1697Z" fill="url(#paint0_linear)" fillOpacity="0.81"/>
    <path d="M198 70.3022L50.2854 138L98.5581 70.3022L198 70.3022Z" fill="url(#paint1_linear)" fillOpacity="0.9"/>
    <path d="M198 70.3018L98.5581 70.3018L50.2854 3.05176e-05L198 70.3018Z" fill="url(#paint2_linear)" fillOpacity="0.89"/>
    <path d="M396 70.1697L344.728 0.000287914L295.428 70.1697L344.728 138L396 70.1697Z" fill="url(#paint3_linear)" fillOpacity="0.81"/>
    <path d="M198 70.3022L345.715 138L297.442 70.3022L198 70.3022Z" fill="url(#paint4_linear)" fillOpacity="0.9"/>
    <path d="M198 70.3018L297.442 70.3018L345.715 3.05176e-05L198 70.3018Z" fill="url(#paint5_linear)" fillOpacity="0.89"/>
    <defs>
    <linearGradient id="paint0_linear" x1="40.5484" y1="138.204" x2="68.9873" y2="38.9465" gradientUnits="userSpaceOnUse">
    <stop stopColor={colorGood_0.start}/>
    <stop offset="1" stopColor={colorGood_0.stop}/>
    </linearGradient>
    <linearGradient id="paint1_linear" x1="50.2854" y1="104.151" x2="198" y2="104.151" gradientUnits="userSpaceOnUse">
    <stop stopColor={colorGood_1.start}/>
    <stop offset="1" stopColor={colorGood_1.stop}/>
    </linearGradient>
    <linearGradient id="paint2_linear" x1="50.2854" y1="35.1509" x2="198" y2="35.1509" gradientUnits="userSpaceOnUse">
    <stop stopColor={colorGood_2.start}/>
    <stop offset="1" stopColor={colorGood_2.stop}/>
    </linearGradient>
    <linearGradient id="paint3_linear" x1="355.452" y1="138.204" x2="327.013" y2="38.9465" gradientUnits="userSpaceOnUse">
    <stop stopColor="#1E1E1E"/>
    <stop offset="1" stopColor="#818181"/>
    </linearGradient>
    <linearGradient id="paint4_linear" x1="345.715" y1="104.151" x2="198" y2="104.151" gradientUnits="userSpaceOnUse">
    <stop stopColor="#B5B5B5"/>
    <stop offset="1" stopColor="#212121"/>
    </linearGradient>
    <linearGradient id="paint5_linear" x1="345.715" y1="35.1509" x2="198" y2="35.1509" gradientUnits="userSpaceOnUse">
    <stop stopColor="#444444"/>
    <stop offset="1" stopColor="#8D8D8D"/>
    </linearGradient>
    </defs>
    </svg>
   )
}
