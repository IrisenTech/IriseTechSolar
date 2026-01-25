'use client';
import acmeLogo from '@/assets/logo-acme.png';
import quantumLogo from '@/assets/logo-quantum.png';
import echoLogo from '@/assets/logo-echo.png';
import celestialLogo from '@/assets/logo-celestial.png';
import pulseLogo from '@/assets/logo-pulse.png';
import apexLogo from '@/assets/logo-apex.png';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12 bg-[#181c2a]">
      <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-14 flex-none pr-14 text-4xl text-shadow-neon text-purple-500"
            animate={{ translateX: "-40%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <p className='text-white'>EN LOS ULTIMOS 8 AÑOS EL COSTO DE LA ENERGÍA SE DUPLICO</p>
            <p className='text-white'>Aumento Kwh 9% Anual</p>
            <p className='text-white'>COSTOS DE ENERGÍA EN EL TIEMPO</p>
             <p className='text-white'>2017 = $450 / KWH</p>
              <p className='text-white'>2025 = $900 / KWH</p>
               <p className='text-white'>2017 = $500.000</p>
               <p className='text-white'>2025 = $1.000.000</p>
              

               <p className='text-white'>EN LOS ULTIMOS 8 AÑOS EL COSTO DE LA ENERGÍA SE DUPLICO</p>
            <p className='text-white'>Aumento Kwh 9% Anual</p>
            <p className='text-white'>COSTOS DE ENERGÍA EN EL TIEMPO</p>
             <p className='text-white'>2017 = $450 / KWH</p>
              <p className='text-white'>2025 = $900 / KWH</p>
               <p className='text-white'>2017 = $500.000</p>
               <p className='text-white'>2025 = $1.000.000</p>
                
          </motion.div>
        </div>
      </div>
    </div>
  );
  
  
};
