"use client";
import Image from "next/image";
import ArrowIcon from "@/assets/arrow-right.svg";

import Logo from "@/assets/img/bb_Logo.webp";
import Iconuno from "@/assets/img/icon1.webp";
import Icondos from "@/assets/img/icon2.webp";
import Icontres from "@/assets/img/icon3.webp";
import LogoIcon from "@/assets/img/icon.png";
import BulbImage from "@/assets/img/img-bulb.jpg";
import Tributarios from "@/assets/img/strategic savings.webp";
import Sellos from "@/assets/img/sustainability.webp";
import Sellos2 from "@/assets/img/sellos de sostenibilidad.png";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";

import React from "react";

export default function Page() {                                                                                                         
  // Inner slides data
  const slides = [
    {
      icon: Iconuno.src,
      image: BulbImage.src,
      video: "/background/video2.mp4",
      title: "Beneficios del Programa",
      items: [
        "Incentivos tributarios",
        "Reducción de gastos de energía",
        "Sellos de sostenibilidad",
        "Indicadores de sostenibilidad",
        "Atracción de inversion",
      ],
    },
    {
      icon: Icondos.src,
      image: Tributarios.src,
      video: "/background/video3.mp4",
      title: "Beneficios Tributarios",
      items: [
        "Descuento de la renta hasta del 50% de valor de la inversión",
        "Descuento de la renta sobre el total del IVA del proyecto",
        "Depreciación acelerada del activo en un plazo de 3 años",
        "Exención de aranceles",
      ],
    },
    {
      icon: Icontres.src,
      image: Sellos.src,
      video: "/background/video5.mp4",
      title: "Sellos de Sostenibilidad",
      items: [
        "Participar en el programa le otorgará certificados verdes, reforzando su compromiso con la sostenibilidad y proporcionando pruebas tangibles de sus esfuerzos medioambientales"
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <section className="relative w-screen h-screen bg-cover bg-center overflow-hidden">
      {/* Video background (changes per slide) */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={slides[currentSlide].video}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay bg */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <motion.div
          className=" md:pt-5 md:pb-10 sm:pb-0 sm:pt-10 rounded-2xl sm:p-10"
          style={{
            background:
              "radial-gradient(ellipse 200% 100% at bottom left, rgba(24,62,194,0.5), rgba(0, 0, 0, 0.5)  50%)",
          }}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="sm:mb-4 opacity-90">
            <motion.img src={LogoIcon.src} alt="Logo" height={50} width={50} />
          </div>

          <div className="container mx-auto flex flex-col md:flex-row items-stretch gap-8">
            {/* Left: Image (changes per slide) */}
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={slides[currentSlide].image}
                alt="Main Cover"
                width={500}
                height={500}
                className="object-cover w-full h-full rounded-xl shadow-lg"
              />
            </div>
            {/* Right: Inner slide */}
            <div className="flex-1 flex flex-col justify-center bg-white/10 rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Image src={slides[currentSlide].icon} alt="Icon" width={62} height={62} />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {slides[currentSlide].title}
                </h2>
              </div>
              <hr className="border-2 border-cyan-400 mb-4 font-bold" />
              <ul className="list-disc list-inside text-lg font-bold text-white space-y-2 mb-6">
                {slides[currentSlide].items.map((item, idx) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: idx * 1.15 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
              {/* Show extra image only for third slide */}
              {currentSlide === 2 && (
                <div className="w-full flex justify-center mb-4">
                  <motion.div
                    className="bg-white/30 rounded-lg p-2 w-[380px] flex items-center justify-center shadow-md"
                    whileHover={{ scale: 2.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Image src={Sellos2.src} alt="Sellos de sostenibilidad" width={480} height={80} style={{objectFit: 'contain'}} />
                  </motion.div>
                </div>
              )}
              {/* Dots navigation */}
              <div className="flex justify-center gap-3 mt-2 mb-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 border-cyan-400 transition-all duration-200 ${
                      currentSlide === idx ? "bg-cyan-400" : "bg-transparent"
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Ir a slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="relative flex-1 text-center justify-center mt-12">
            <Link href="/slide4">
              <motion.button
                className="btn btn-text gap-1 text-slate-400 hover:transition ease-out duration-300 hover:bg-white/20 hover:text-slate-50 hover:border border-cyan-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>Continuar </span>
                <ArrowIcon className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
      {/* ArrowIcon at bottom left, rotated to look 'back' */}
      <button
        className="absolute left-6 bottom-6 z-20 bg-transparent border-none outline-none cursor-pointer"
        onClick={() => window.history.back()}
        aria-label="Volver"
      >
        <ArrowIcon
          className="h-10 w-10 text-slate-400 hover:text-green-300"
          style={{ transform: "rotate(180deg)" }}
        />
      </button>
    </section>
  );
}
