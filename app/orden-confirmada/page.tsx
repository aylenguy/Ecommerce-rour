import { Suspense } from "react";
import OrdenConfirmada from "./OrdenConfirmada";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <OrdenConfirmada />
    </Suspense>
  );
}