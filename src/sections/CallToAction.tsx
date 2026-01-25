'use client';
import Image from 'next/image';
import ArrowRigtht from "@/assets/arrow-right.svg";
import starImage from "@/assets/star.png";
import springImage from "@/assets/spring.png";
import { motion, useScroll, useTransform} from 'framer-motion';
import { useRef } from 'react';

export const CallToAction = () => {
    const sectionRef= useRef(null);
    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset:["start end","end start"]
    });

    const translateY = useTransform(scrollYProgress, [0,1], [150,-150]);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-[#D2DCFF] py-24">
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title ">Sign in ree today</h2>
          <p className="section-description mt-5">Celebrate thejoy accompishment with ana app design to tarck your progress and motivate your efforts</p>
          <motion.img src={starImage.src} alt="Star" width={360} className="absolute -left-[350px] -top-[137px]"
          style={{translateY,}}
           />
          <motion.img src={springImage.src} alt="Spring" width={360} className="absolute -right-[331px] -top-[19px]"
          style={{translateY,}}
           />
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-text gap-1"><span>Contact Sales</span>
          <ArrowRigtht className="w-5 h-5" />
          </button>
        </div>
      </div>
  </section>
  );
};
