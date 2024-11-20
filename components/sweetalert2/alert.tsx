'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface AlertProps {
  title: string;
  text: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  confirmButtonColor?: string;
  onClose?: () => void; // Callback para executar ao fechar o alerta
}

export default function Alert({
  title,
  text,
  icon = 'info',
  confirmButtonText = 'OK',
  confirmButtonColor = '#4CAF50',
  onClose,
}: AlertProps) {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        title,
        text,
        icon,
        showConfirmButton: true,
        confirmButtonText,
        confirmButtonColor,
      }).then((result) => {
        if (result.isConfirmed) {
          setShowAlert(false); // Fecha o alerta
          if (onClose) {
            onClose(); // Chama o callback quando o alerta fecha
          }
        }
      });
    }
  }, [showAlert, title, text, icon, confirmButtonText, confirmButtonColor, onClose]);

  return null; // Não renderiza nada visível no DOM
}





// if (response.ok) {
//     await Swal.fire({
//       title: "Sucesso!",
//       text: "Produto criado com sucesso!",
//       icon: "success",
//       confirmButtonText: "OK",
//       confirmButtonColor: "#4CAF50", // Cor do botão
//     });
//   } else {
//     await Swal.fire({
//       title: "Erro",
//       text: "Falha ao criar o produto.",
//       icon: "error",
//       confirmButtonText: "Tentar novamente",
//     });
//   }
// } catch (error) {
//   await Swal.fire({
//     title: "Erro inesperado",
//     text: "Algo deu errado. Por favor, tente novamente.",
//     icon: "error",
//   });


// const confirmation = await Swal.fire({
//     title: "Tem certeza?",
//     text: "Esta ação não pode ser desfeita.",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Sim, deletar!",
//     cancelButtonText: "Cancelar",
//     confirmButtonColor: "#d33",
//     cancelButtonColor: "#3085d6",
//   });
//   if (confirmation.isConfirmed) {
//   try {