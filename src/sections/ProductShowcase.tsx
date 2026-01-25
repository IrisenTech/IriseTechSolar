'use client';
import Image from 'next/image';
import productImage from '@/assets/product-image.png';
import pyramidImage from '@/assets/pyramid.png';
import tubeImage from '@/assets/tube.png';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ProductShowcase = () => {
  const sectionRef = useRef(null); 
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#181c2a] to-[#22253a] py-24 overflow-x-clip text-white"
    >
      <div className="container">
        <div className="w-full ">
          <div className="flex justify-center">
            <div className="tag bg-[#22253a] text-[#b3b8d1]">Boost your productivity</div>
          </div>
          <h2 className="section-title mt-5 text-white">A way more effecty to ttacrk progress</h2>
          <p className="section-description mt-5 text-[#b3b8d1]">
            Our platform offers a comprehensive suite of tools designed to streamline your workflow and enhance collaboration across teams. Experience the difference with our intuitive interface and powerful features that adapt to your business needs.
          </p>
        </div>
      </div>
    </section>
  );
};
