"use client";

import React, { useState } from "react";
import ClientList from "@/components/clients/list-clients";
import New from "@/components/clients/new-client";

export default function App() {

  const [refreshClients, setRefreshClients] = useState(false);
  const updateRefresh = () => setRefreshClients(!refreshClients);

  return (
   <>
   <New update={updateRefresh} />
   <br /><br />
   <ClientList update={updateRefresh} />  
   
   
   </>
  );
}
