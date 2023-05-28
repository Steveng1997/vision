export class Servicio {
  id?: number;
  idDocument?: string;
  terapeuta?: string;
  encargada?: string;
  cliente?: string;
  fecha?: string;
  hora?: string;
  minuto?: number;
  efectPiso1?: boolean;
  bizuPiso1?: boolean;
  tarjPiso1?: boolean;
  transPiso1?: boolean;
  efectPiso2?: boolean;
  bizuPiso2?: boolean;
  tarjPiso2?: boolean;
  transPiso2?: boolean;
  efectTerap?: boolean;
  bizuTerap?: boolean;
  tarjTerap?: boolean;
  transTerap?: boolean;
  efectEncarg?: boolean;
  bizuEncarg?: boolean;
  tarjEncarg?: boolean;
  transEncarg?: boolean;
  efectOtro?: boolean;
  bizuOtro?: boolean;
  tarjOtro?: boolean;
  transOtro?: boolean;
  numberPiso1?: number;
  numberPiso2?: number;
  numberTerap?: number;
  numberEncarg?: number;
  numberOtro?: number;
  nota?: string;

  // servicios

  servicio?: number;
  bebidas?: number;
  tabaco?: number;
  vitaminas?: number;
  propina?: number;
  otros?: number;
}
