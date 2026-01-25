"use client";
import Image from 'next/image';
import ArrowIcon2 from '@/assets/arrow-right.svg';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react'; 
import SceneHouse from '@/components/SceneHouse';

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  // State to control which camera view is active
  const [activeCamera, setActiveCamera] = useState<string>('');
  const [playCounter, setPlayCounter] = useState<number>(0);
  const [resetCounter, setResetCounter] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to handle the camera animation trigger and reset
  const handleCameraAction = () => {
    if (isAnimating) {
      // Reset state and camera position
      setIsAnimating(false);
      setActiveCamera('');
      setResetCounter(c => c + 1); // Trigger camera reset
    } else {
      // Trigger animation
      setIsAnimating(true);
      setPlayCounter(c => c + 1);
      setActiveCamera('CamerarbACK');
    }
  };

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-2 md:pt-2 md:pb-2 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#0a1832,#1a233a_80%)] text-white"
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="tag bg-[#22253a] text-[#b3b8d1]">Autoconsumo</div>
            <h1 className="text-5xl tracking-tighter font-bold bg-gradient-to-b from-white to-[#183EC2] text-transparent bg-clip-text mt-6 py-2">
              Genera tu propia electricidad y reduce tu factura.
            </h1>
            <p className="text-xl text-[#b3b8d1] tracking-tight mt-6">
              Toma el control de tu consumo y producción.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
               <button 
                className={`btn btn-primary ${
                  isAnimating 
                    ? 'bg-[#D32F2F] hover:bg-[#B71C1C]' 
                    : 'bg-[#183EC2] hover:bg-[#001E80]'
                } text-white transition-colors duration-300`}
                onClick={handleCameraAction}
              >
                {isAnimating ? 'Reset Camera' : 'Sistema Inversor'}
              </button>
            </div>
          </div>
        </div>

        {/* Updated 3D Model Container */}
        <div className="mt-8">
          <div className="relative w-full h-[700px]">
            <SceneHouse 
              activeCamera={activeCamera} 
              playTrigger={playCounter}
              resetSignal={resetCounter}
              onAnimationComplete={() => setIsAnimating(false)}
            />
          </div>
        </div>
      </div>
    </section>
  )
};