'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface ConfirmActionProps {
  onConfirm: () => void; // Define o tipo da função onConfirm
}

export default function ConfirmAction({ onConfirm }: ConfirmActionProps) {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não será capaz de reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          onConfirm(); // Chama a função de confirmação passada como prop
          setShowAlert(false); // Fecha o alerta e atualiza o estado
        } else {
          setShowAlert(false); // Apenas fecha o alerta
        }
      });
    }
  }, [showAlert, onConfirm]);

  return null;
}
