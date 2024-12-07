import React, { useState } from "react";

const CurrencyInput: React.FC = () => {
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (input === "") {
      setValue(""); // Se o valor for vazio, mantém o campo vazio
      return;
    }

    const numericValue = parseInt(input, 10); // Converte para número
    const formattedValue = (numericValue / 100).toFixed(2); // Formata como decimal
    const result = formattedValue.replace(".", ","); // Substitui ponto por vírgula

    setValue(result);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      inputMode="numeric" // Força o teclado numérico em dispositivos móveis
      style={{ textAlign: "right" }} // Alinha à direita (opcional)
      placeholder="Digite o valor" // Texto auxiliar quando vazio
    />
  );
};

export default CurrencyInput;
