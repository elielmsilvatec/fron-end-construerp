// src/components/Home.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;


interface DashboardData {
    totalClientes: number;
    totalProdutos: number;
    vendasHoje: number;
    totalVendas: number;
    totalReceitas: number;
    totalDespesas: number;
}


const Home = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulação de busca de dados da API com setTimeout
        const fetchData = async () => {
          setIsLoading(true);
          try{
               // Simulação de dados fictícios
            const data: DashboardData = {
                totalClientes: 120,
                totalProdutos: 500,
                vendasHoje: 30,
                totalVendas: 1500,
                totalReceitas: 12500.50,
                totalDespesas: 2800.75,
              };

             setTimeout(() => {
                setDashboardData(data);
                setIsLoading(false);
              }, 1000); // Simula o tempo de resposta da API
             } catch (err:any) {
                setError(err.message || 'Erro ao buscar dados do dashboard.');
                setIsLoading(false);
              }
           };
        fetchData();
      }, []);
    
        if (isLoading) {
          return <div>Carregando...</div>;
        }
      
        if (error) {
          return <div>Erro: {error}</div>;
        }

        if (!dashboardData) {
            return <div>Não foi possível carregar os dados do painel.</div>;
          }
    
      
  return (
    <div className="home-container">
      <Title level={2} style={{ marginBottom: '20px' }}>
        Painel de Controle
      </Title>

      <Title level={5} style={{ marginBottom: '14px' }}>
       Dados fictícios, em desenvolvimento...
      </Title>

      <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total de Clientes"
                  value={dashboardData.totalClientes}
                  prefix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
                  valueStyle={{ color: '#3f8600',fontSize:'20px'  }}
                  style={{textAlign:"center"}}
                />
            </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total de Produtos"
                  value={dashboardData.totalProdutos}
                  prefix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
                  valueStyle={{ color: '#3f8600' ,fontSize:'20px'}}
                  style={{textAlign:"center"}}
                />
            </Card>
        </Col>


        <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Vendas de Hoje"
                value={dashboardData.vendasHoje}
                prefix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
                valueStyle={{ color: '#3f8600',fontSize:'20px' }}
                style={{textAlign:"center"}}
              />
            </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
           <Card>
              <Statistic
                title="Total de Vendas"
                value={dashboardData.totalVendas}
                prefix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
                valueStyle={{ color: '#3f8600',fontSize:'20px' }}
                style={{textAlign:"center"}}
              />
            </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Receitas"
              value={`R$ ${dashboardData.totalReceitas.toFixed(2)}`}
              prefix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
              valueStyle={{ color: '#3f8600' ,fontSize:'20px'}}
                style={{textAlign:"center"}}
            />
        </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Despesas"
              value={`R$ ${dashboardData.totalDespesas.toFixed(2)}`}
              prefix={<ArrowDownOutlined style={{ color: '#cf1322' }} />}
              valueStyle={{ color: '#cf1322',fontSize:'20px' }}
                style={{textAlign:"center"}}
            />
          </Card>
        </Col>
      </Row>

        {/* <Space style={{marginTop:20}}>
           <Link href="/dashboard/sales/list">
            <button  className="btn btn-primary">Ir para lista de vendas</button>
          </Link>
          <Link href="/dashboard/clients/list">
             <button  className="btn btn-primary">Ir para lista de clientes</button>
          </Link>
           <Link href="/dashboard/products/list">
             <button  className="btn btn-primary">Ir para lista de produtos</button>
          </Link>
        </Space> */}
    </div>
  );
};

export default Home;