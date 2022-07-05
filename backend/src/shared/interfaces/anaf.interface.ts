export interface IAnafRequest {
  cui: string;
  data: string;
}

export interface IAnafHttpResponse {
  cod: number;
  message: string;
  found: IAnafCompany[];
  notfound: any[];
}

export interface IAnafCompany {
  cui: number;
  data: string;
  denumire: string;
  adresa: string;
  nrRegCom: string;
  telefon: string;
  fax: string;
  codPostal: string;
  act: string;
  stare_inregistrare: string;
  scpTVA: boolean;
  data_inceput_ScpTVA: string;
  daca_sfarsit_ScpTVA: string;
  data_anul_imp_ScpTVA: string;
  mesaj_ScpTVA: string;
  dataInceputTvaInc: string;
  dataSfarsitTvaInc: string;
  dataActualizareTvaInc: string;
  dataPublicareTvaInc: string;
  tipActTvaInc: string;
  statusTvaIncasare: boolean;
  dataInactivare: string;
  dataReactivare: string;
  dataPublicare: string;
  dataRadiere: string;
  statusInactivi: boolean;
  dataInceputSplitTVA: string;
  dataAnulareSplitTVA: string;
  statusSplitTVA: boolean;
  iban: string;
}
