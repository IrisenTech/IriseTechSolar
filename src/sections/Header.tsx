import ArrowRigtht from "@/assets/arrow-right.svg";
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-[#181c2a] text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          La sostenibilidad y el exito empresarial van de la mano
        </p>
        <div className="inline-flex items-center gap-1">
          <p className="text-[#b3b8d1]">Cambiate a ser parte de la energia renovable</p>
          <ArrowRigtht className="w-6 h-6 text-white inline-flex justify-center items-center" />
        </div>
      </div>
      <div className="bg-[#22253a]">
        <div className="py-5">
          <div className="container">
            <div className="flex items-center justify-between ">
              <Image src={Logo} alt="Logo" width={40} height={40} />
              <MenuIcon className="w-5 h-5 md:hidden text-white" />
              <nav className="hidden md:flex gap-6 text-white/60 align-center">
                <a href="#" className="text-sm font-medium text-[#b3b8d1] hover:text-white py-2">
                  Presentacion
                </a>
                <a href="#" className="text-sm font-medium text-[#b3b8d1] hover:text-white py-2">
                  Sobre Nosotros
                </a>
                <button className="text-sm font-medium text-white bg-[#183EC2] hover:bg-[#001E80] px-4 py-2 rounded-lg ml-4 inline-flex align-items justify-center tracking-tight">
                  Agendar cita de cotizacion
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );


};
