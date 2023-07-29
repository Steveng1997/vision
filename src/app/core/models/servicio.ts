export class Servicio {
  id?: number;
  idDocument?: string;
  terapeuta?: string;
  formaPago1?: string;
  formaPago2?: string;
  formaPago3?: string;
  formaPago4?: string;
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
  pago1?: number;
  pago2?: number;
  nota?: string;
  salida?: string;
  liquidado?: boolean;
  formaPago?: string;

  // servicios

  servicio?: number;
  bebidas?: number;
  tabaco?: number;
  vitaminas?: number;
  propina?: number;
  otros?: number;

  // Hora
  horaStart?: string;
  horaEnd?: string;
}
