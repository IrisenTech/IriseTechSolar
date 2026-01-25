"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import ArrowIcon from "@/assets/arrow-right.svg";
import logoCliente from "@/assets/img/enbajadoresenergeticos.png";


export default function Page() {
  return (
    <section className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="container flex items-center justify-center mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-lg"
          >
            {/* Logo */}
            <Image
              src={logoCliente}
              alt="Logo"
              className="mx-auto mb-8 w-40 h-auto"
            />

            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bienvenidos
            </h1>

            {/* Paragraph */}
            <p className="text-gray-300 mb-6 tracking-tight ">
              Transformando la energía en soluciones sostenibles para un futuro
              mejor.
            </p>

            {/* Arrow Button with Next Link */}
            <Link
              href="/slide1"
              className="inline-flex items-center px-6 py-3 rounded-full bg-lime-500 text-black font-semibold hover:bg-lime-600 transition"
            >
              Comenzar
              <ArrowIcon className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>

          {/* Right image */}
         
        </div>
      </div>
    </section>
  );
}
