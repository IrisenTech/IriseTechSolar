"use client";
import React from "react";
import Image from "next/image";
import ArrowIcon from "@/assets/arrow-right.svg";
import TaxImage from "@/assets/img/Taxonomía-Verde_Colombia.png";
import Logo from "@/assets/img/Taxonomía-Verde_Colombia2.png";
import SuperLogo from "@/assets/img/Logo-de-la-Superintendencia-Financiera-de-Colombia2.png";
import MinHaciendaLogo from "@/assets/img/Logo-de-MinHacienda.png";
import LanscapeImage from "@/assets/background/landscape.jpg";
import CityLanscape from "@/assets/background/city.jpg";
import TableImage from "@/assets/background/table.jpg";
import LogoIcon from "@/assets/img/icon.png";
import FoneImage from "@/assets/img/f1.png";
import FtwoImage from "@/assets/img/f2.png";
import FthreeImage from "@/assets/img/f3.png";
import FfourImage from "@/assets/img/f4.png";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";

export default function Page() {
  // Carousel state
  const [activeIndex, setActiveIndex] = React.useState(0);
  const carouselContents = [
    <div key="carousel-1" className="flex flex-col items-center">
      <motion.img
        src={Logo.src}
        alt="Logo"
        width={350}
        height={150}
        className="p-2 mb-3 bg-white rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.p
        className="text-slate-200 text-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        Que es?
      </motion.p>
      <motion.div
        className="lg:text-2xl md:text-xl sm:text-xl sm:tracking-tight font-base text-[#ffffff] mt-6 border border-black/50 p-4 rounded-2xl bg-white/20 lg:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
      >
        <div className="flex border border-green-400 p-4 rounded-2xl">
          <p className="mb-2 text-center md:text-2xl">
            Es un sistema para Financiar proyectos de energía renovable a través
            de un mecanismo que se llama Taxonomía Verde.
          </p>
        </div>
      </motion.div>
    </div>,
    <div key="carousel-2" className="flex flex-col items-center">
      <motion.img
        src={TaxImage.src}
        alt="Logo"
        width={200}
        height={50}
        className="p-6 mb-3 bg-white rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* <h2 className="text-2xl font-bold text-white mb-4">Contenido 2</h2> */}
      <div className="flex border border-green-400 p-4 rounded-2xl">
        <p className="text-white text-center md:text-2xl">
          Fue creada por superintendencia  financiera de colombia y el
          Ministerio de hacienda  para dinamizar la inversiones verdes que
          contribuyen al cumplimiento de los objetivos ambientales de Colombia .
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4 w-full items-center justify-center">
        <motion.img
          src={SuperLogo.src}
          alt="Logo"
          width={200}
          height={50}
          className="p-4 mb-3 bg-white rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.img
          src={MinHaciendaLogo.src}
          alt="Logo"
          width={200}
          height={50}
          className="p-2 mb-3 bg-white rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>,
    <div key="carousel-3" className="flex flex-col items-center">
      <h2 className="text-4xl font-bold text-white mb-4">Casos de Éxito</h2>
      <p className="text-white mb-6">
        Ellos han tomado la decisión de ahorrar en su factura de energía
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl sm:overflow-y-auto sm:h-[550px] ">
        <div className="flex flex-col items-center">
          <Image
            src={FoneImage}
            alt="F1"
            className="w-32 md:w-48 sm:w-40 lg:w-full h-auto rounded-xl bg-white p-2 mx-auto"
          />
          <ul className="text-white text-left mt-2 text-sm border border-white p-2 rounded-lg list-disc list-inside">
            <p className="tracking-tight text-center mb-2 font-semibold text-base">
              {" "}
              Superintendencia <br></br>Financiera de Colombia
            </p>
            <hr className="mb-1"></hr>
            <li>145 kWp</li>
            <li>336 Paneles Solares</li>
            <li>+11 Millones Ahorro / mes</li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={FtwoImage}
            alt="F2"
            className="w-32 md:w-48 sm:w-40 lg:w-full h-auto rounded-xl bg-white p-2 mx-auto"
          />
          <ul className="text-white text-left mt-2 text-sm border border-white p-2 rounded-lg list-disc list-inside">
            <p className="tracking-tight text-center mb-2 font-semibold text-base">
              {" "}
              Teatro Julio Mario<br></br> Santo Domingo
            </p>
            <hr className="mb-1"></hr>
            <li>99 kWp</li>
            <li>182 Paneles Solares</li>
            <li>+8 Millones Ahorro / mes</li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={FthreeImage}
            alt="F3"
            className="w-32 md:w-48 sm:w-40 lg:w-full h-auto rounded-xl bg-white p-2 mx-auto"
          />
          <ul className="text-white text-left mt-2 text-sm border border-white p-2 rounded-lg list-disc list-inside">
            <p className="tracking-tight text-center mb-2 font-semibold text-base">
              {" "}
              Alcaldía de Cota
              <br></br>Financiera de Colombia
            </p>
            <hr className="mb-1"></hr>
            <li>32 kWp</li>
            <li>55 Paneles Solares</li>
            <li>+4 Millones Ahorro / mes</li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={FfourImage}
            alt="F4"
            className="w-32 md:w-48 sm:w-40 lg:w-full h-auto rounded-xl bg-white p-2 mx-auto"
          />
          <ul className="text-white text-left mt-2 text-sm border border-white p-2 rounded-lg list-disc list-inside">
            <p className="tracking-tight text-center mb-2 font-semibold text-base">
              {" "}
              Banco de Tejidos <br></br>Humanos
            </p>
            <hr className="mb-1"></hr>
            <li>15 kWp</li>
            <li>33 Paneles Solares</li>
            <li>+1.5 Millones Ahorro / mes</li>
          </ul>
        </div>
      </div>
    </div>,
  ];

  // Select background image based on activeIndex
  const bgImages = [LanscapeImage, CityLanscape, TableImage];
  const currentBg = bgImages[activeIndex] || LanscapeImage;

  return (
    <section
      className="relative w-screen h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${currentBg.src})` }}
    >
      {/* Overlay bg */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <motion.div
          className="md:pt-5 md:pb-10 sm:pb-0 sm:pt-10 rounded-2xl sm:p-10"
          style={{
            background:
              "radial-gradient(ellipse 200% 100% at bottom left, rgba(24,62,194,0.5), rgba(0, 0, 0, 0.5)  50%)",
          }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="container">
            <div className="sm:mb-4 opacity-90">
              <motion.img
                src={LogoIcon.src}
                alt="Logo"
                height={50}
                width={50}
              />
            </div>
            <div className="md:flex items-center">
              {/* Carousel Container */}
              <div className="w-full flex flex-col items-center">
                {carouselContents[activeIndex]}
                {/* Navigation Dots (larger size) */}
                <div className="flex justify-center mt-6 mb-2 gap-3">
                  {carouselContents.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-6 h-6 rounded-full border-2 border-white ${
                        activeIndex === idx
                          ? "bg-white"
                          : "bg-gray-400 opacity-50"
                      } transition-all`}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Ir al slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
      {activeIndex === 2 && (
        <button
          className="absolute right-6 bottom-6 z-20 bg-transparent border-none outline-none cursor-pointer"
          onClick={() => window.location.href = '/slide3'}
          aria-label="Siguiente"
        >
          <ArrowIcon
            className="h-10 w-10 text-slate-400 hover:text-green-300"
          />
        </button>
      )}
    </section>
  );
}
