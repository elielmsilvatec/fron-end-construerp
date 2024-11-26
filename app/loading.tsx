


"use client";
import { useEffect, useState } from "react";
export default function Loading() {
  
  // const [showLoading, setShowLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowLoading(false);
  //   }, 90000); // 3 segundos

  //   return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  // }, []);
  // if (!showLoading) {
  //   return null; // Retorna nada após o atraso
  // }

  return (
    <>
      <style jsx>{`
        /* Estilização do container */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f9f9f9;
        }

        /* Círculo animado */
        .loading-circle {
          width: 50px;
          height: 50px;
          border: 5px solid #e0e0e0;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Texto animado */
        .loading-text {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
          color: #555;
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Animação de rotação */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Animação de pulsação */
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      <div className="loading-container">
        <div className="loading-circle"></div>
        <span className="loading-text">Carregando...</span>
      </div>
    </>
  );
}
