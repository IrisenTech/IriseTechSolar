'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { images } from '../../utils/constants';
import Image from 'next/image';

function Slider() {
    const [activeImage, setActiveImage] = useState(0);

    const clickNext = useCallback(() => {
        setActiveImage((prev) => 
            prev === images.length - 1 ? 0 : prev + 1
        );
    }, []);
    const clickPrev = useCallback(() => {
        setActiveImage((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            clickNext();
        }, 3000);
        return () =>{
            clearTimeout(timer);
        };
    }, [activeImage, clickNext]);  

  return (
    <div className='grid place-items-center  w-full mx-auto max-w-5xl shadow-2xl rounded-2xl p-20 '>
        <div className="w-full flex justify-center items-center gap-4 transition-transform ease-in-out duration-500 rounded-2xl">
        
        {images.map((pic, idx) => (
            <div className={`${
                idx === activeImage 
                ? 'block w-full h-[80vh] object-cover transition-all duration-500 ease-in-out rounded-tl-3xl rounded-bl-3x-l' 
                : 'hidden'
              }`} 
              key={idx}
              >
              <Image  
                src={pic.src} 
                alt={pic.alt} 
                height={400}
                width={400}
                className="w-full h-full object-cover rounded-tl-3xl rounded-bl-3x-l" 
                />
            </div>
        ))} 
        </div>
    </div>
  )
}

export default Slider