"use client"; // Adicione esta linha no início do arquivo
import React from "react";


const Deliveries = () => {


  return (
    <div>

      <div >
        {/* O conteúdo da página vai aqui */}
        <div >
          <p className="fs-3">Tela de entregas</p>

          <form action="/entrega/entregue" method="get">
            <button type="submit" className="btn btn-outline-secondary">
              Visualizar pedidos entregues
            </button>
          </form>
          <br />

          <table className="table table-hover table-bordered">
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Data</th>
                <th>Valor</th>
                <th className="text-center align-middle">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>Em andamento</td>
                <td>2023-06-01</td>
                <td>R$ 50.00</td>
                <td className="text-center">
                  <button className="btn btn-primary">Detalhes</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
