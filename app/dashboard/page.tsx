"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [display, setDisplay] = useState(false);

  return (
    <div className=" mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {display && (
        <>
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Here is a gentle confirmation that your action was successful.
          </Alert>
          <Alert severity="success">This is a success Alert.</Alert>
          <Alert severity="info">This is an info Alert.</Alert>
          <Alert severity="warning">This is a warning Alert.</Alert>
          <Alert severity="error">This is an error Alert--.</Alert>

          <Alert variant="filled" severity="success">
            This is a filled success Alert.
          </Alert>
          <Alert variant="filled" severity="info">
            This is a filled info Alert.
          </Alert>
          <Alert variant="filled" severity="warning">
            This is a filled warning Alert.
          </Alert>
          <Alert variant="filled" severity="error">
            This is a filled error Alert.
          </Alert>

          <Alert variant="outlined" severity="success">
            This is an outlined success Alert.
          </Alert>
          <Alert variant="outlined" severity="info">
            This is an outlined info Alert.
          </Alert>
          <Alert variant="outlined" severity="warning">
            This is an outlined warning Alert.
          </Alert>
          <Alert variant="outlined" severity="error">
            This is an outlined error Alert.
          </Alert>

          <Alert severity="success" color="warning">
            This is a success Alert with warning colors.
          </Alert>
        </>
      )}
    </div>
  );
}
