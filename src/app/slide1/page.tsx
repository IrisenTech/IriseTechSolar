"use client";
import Image from 'next/image';
import ArrowIcon from '@/assets/arrow-right.svg';
import cogImage from '@/assets/cog.png';
import Logo from '@/assets/img/bb_Logo.webp';
import ApoyadosLogo from '@/assets/img/apoyan2.png';
import Noodle from '@/assets/noodle.png';
import sunriseImage from '@/assets/background/sunrise1.jpg';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import  Link  from 'next/link';

export default function HomePage() {
  return (
    <section
      className="relative w-screen h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${sunriseImage.src})` }}
    >
      {/* Overlay bg */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        
          <motion.div
                className=" md:pt-5 md:pb-10 sm:pb-0 sm:pt-10 rounded-2xl sm:p-10"
                style={{
                  background: "radial-gradient(ellipse 200% 100% at bottom left, rgba(24,62,194,0.5), rgba(0, 0, 0, 0.5)  50%)"
                }}
                  initial={{ opacity: 0, x: -100 }} // Initial state of the animation
                  animate={{ opacity: 1, x: 0 }}    // Target state for the animation
                  transition={{ duration: 0.5, type: "spring" }} // Transition properties
                 
              >
              <div className="container">
                  <div className="tag sm:mb-4 opacity-60">Version 2.01</div>
                  <div className="md:flex items-center">
                    
                      {/* <h1 className="text-5xl tracking-tighter font-bold bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 py-2">Bienvenidos</h1> */}
                      <div className='flex flex-col items-center'>
                            <motion.img 
                              src={Logo.src}
                              alt="Logo" 
                              width={500} 
                              height={150} 
                              className="p-2 mb-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut"}}
                            />
                            {/* Animated lines for paragraph */}
                            {(() => {
                              const lines = [
                                "Es un programa que impulsa a organizaciones públicas y privadas para que puedan tener ahorros en sus gastos de energías",
                                "y acceder a beneficios tributarios que se puedan certificar en sostenibilidad y hacer incluso esto sin dinero."
                              ];
                              const container = {
                                hidden: {},
                                visible: {
                                  transition: {
                                    staggerChildren: 0.7,
                                    
                                  }
                                }
                              };
                              const child = {
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut",delay: 0.5 } }
                              };
                              return (
                                <motion.div
                                  className="lg:text-2xl md:text-xl sm:text-xl sm:tracking-tight font-base text-[#ffffff] mt-6 border border-black/50 p-4 rounded-2xl bg-white/20 lg:p-10"
                                  variants={container}
                                  initial="hidden"
                                  animate="visible"
                                 
                                  
                                  
                                >
                                  {lines.map((line, idx) => (
                                    <motion.p key={idx} variants={child} className="mb-2 last:mb-0">{line}</motion.p>
                                  ))}
                                </motion.div>
                              );
                            })()}



                        <div className="flex-1 gap-1 items-center mt-[30px] sm:pb-5">
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 2 }}
                            className="text-white/70 italic"
                          >
                            Apoyados por:
                          </motion.p>
                          <motion.img 
                            src={ApoyadosLogo.src}
                            alt="Logo" 
                            width={700} 
                            height={250} 
                            className="p-2 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 2.5 }}
                          />
                        </div>
                            

                              
                                    {/* Button */}
                                  <div className="flex gap-1 items-center mt-[30px] sm:pb-5">
                                    <Link href="/slide2">
                                        <motion.button
                                          className="btn btn-text gap-1 text-slate-400 hover:transition ease-out duration-300  hover:bg-white/20 hover:text-slate-50 hover:border border-cyan-300"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <span>Continuar </span>
                                          <ArrowIcon className="h-5 w-5" />
                                        </motion.button>
                                    </Link>
                                  </div>
                                 
                          </div>
              

                    </div>
                </div>
           </motion.div>


           {/* <div className="absolute right-[-100px] sm:right-[-140px] top-1/2 transform -translate-y-1/2 flex items-center justify-end w-full h-full pointer-events-none">
                <motion.img 
                  src={cogImage.src} 
                  alt="Cog" 
                  className="h-[300px] max-h-[300px] w-auto object-contain sm:h-[300px] sm:max-h-[300px] md:max-w-[350px] lg:max-w-[800px] lg:h-[800px] xl:max-w-[800px] xl:h-[900px]"
                  style={{maxWidth: '100vw'}}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: 1.2,
                    ease: 'easeInOut'
                  }}
                  whileInView={{
                    translateY: [-30, 30],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut'
                    }
                  }}
                />
            </div> */}




        
      </div>
       {/* ArrowIcon at bottom left, rotated to look 'back' */}
                                  <button
                                    className="absolute left-6 bottom-6 z-20 bg-transparent border-none outline-none cursor-pointer"
                                    onClick={() => window.history.back()}
                                    aria-label="Volver"
                                  >
                                   <ArrowIcon className="h-10 w-10 text-slate-400 hover:text-green-300" style={{ transform: 'rotate(180deg)' }} />
                                    
                                  </button>
     
    </section>
  );
}
