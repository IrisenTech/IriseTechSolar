'use client'
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Footer } from "@/sections/Footer";
import { Content01 } from "@/sections/Content01";
import { FormEnergy } from "@/sections/FormEnergy";


export default function Home() {
  return <>
    <Header />
    
    <Hero/>
    <LogoTicker />
    <Content01 />
    <FormEnergy />
    <ProductShowcase />
    <Footer />
  </>
}
