import { PeriodoCaronaEnum } from 'src/enums/periodo-carona-enum';
import { Pessoa } from './pessoa';

export class Carona {
    Pessoa: Pessoa;
    Data: number;
    PeriodoCarona: PeriodoCaronaEnum;
    Valor: number;
}