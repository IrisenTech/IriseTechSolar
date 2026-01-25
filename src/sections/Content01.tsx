import React from 'react';
import FlippingCard from '@/components/FlippingCard';
import styles from  '../components/FlippingCard.module.css';

interface CardData {
  id: number;
  front: React.ReactNode;
  back: React.ReactNode;
}

export const Content01 = () => {
  const cardsData: CardData[] = [
    {
      id: 1,
      front: (
        <div className="p-4 text-center w-full">
          <h3 className="text-xl font-bold mb-3 text-gray-800">Ley 1715 de 2014</h3>
        </div>
      ),
      back: (
        <div className="p-4 text-center w-full">
          <h3 className="text-xl font-bold text-white mb-3">Ley 1715 de 2014</h3>
          <p className="text-white text-sm leading-relaxed">
            &quot;Las empresas tendrán derecho a reducir de su renta, en un periodo no mayor de 15 años, 
            contados a partir del año gravable siguiente en el que haya entrado en operación la inversión, 
            el 50% del total de la inversión realizada en proyectos de energías renovables.&quot;
          </p>
          <div className="mt-4 text-xs text-gray-300 italic">
            Artículo 11 - Beneficios Tributarios
          </div>
        </div>
      )
    },
    {
      id: 2,
      front: (
        <div className="p-4 text-center w-full">
          <h3 className="text-xl font-bold mb-3 text-gray-800">Resolution 174</h3>
          <p className="text-gray-600 mb-2">CREG 174 del 2021</p>
        </div>
      ),
      back: (
        <div className="p-4 text-center w-full">
          <h3 className="text-xl font-bold text-white mb-3">RESOLUCIÓN 174 2021</h3>
          <p className="text-white text-sm leading-relaxed mb-3">
            &quot;La Resolución CREG 174 de 2021 regula y simplifica la conexión y operación de los 
            autogeneradores a pequeña escala (hasta 1MW) y generadores distribuidos al Sistema 
            Interconectado Nacional.&quot;
          </p>
          <ul className="text-white text-xs text-left space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Conexión simplificada hasta 1MW</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Venta de excedentes permitida</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Reducción de trámites burocráticos</span>
            </li>
          </ul>
        </div>
      )
    }
    
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading at the top */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-400">
              Respaldo legal
            </h2>
          </div>

          {/* Flipping Cards Grid */}
          <div className="mt-12">
            
            
            {/* CHANGED: Use CSS Grid with proper alignment */}
            <div className={styles.cardsGrid}>
              {cardsData.map((card: CardData) => (
                <FlippingCard
                  key={card.id}
                  frontContent={card.front}
                  backContent={card.back}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};