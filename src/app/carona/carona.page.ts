import { Component } from '@angular/core';
import { Carona } from 'src/model/carona';
import { Pessoa } from 'src/model/pessoa';
import { PeriodoCaronaEnum } from 'src/enums/periodo-carona-enum';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carona',
  templateUrl: 'carona.page.html',
  styleUrls: ['carona.page.scss']
})
export class CaronaPage {

  private ls = window.localStorage;

  pessoas: Pessoa[];
  pessoaSelecionada: string;
  dataSelecionada: string;
  valor: string;
  periodoSelecionado: PeriodoCaronaEnum;

  constructor(private toastController: ToastController) { }

  ionViewWillEnter() {
    this.pessoas = this.ls.getItem("pessoas") == null || this.ls.getItem("pessoas") == ""
      ? []
      : JSON.parse(this.ls.getItem("pessoas")) as Pessoa[];

    this.pessoaSelecionada = "";
    this.dataSelecionada = "";
    this.periodoSelecionado = null;
    this.valor = "3,00";
  }

  async salvar() {
    if (this.pessoaSelecionada == null || this.pessoaSelecionada == "" ||
      this.dataSelecionada == null || this.dataSelecionada == "" ||
      this.periodoSelecionado == null || this.valor == null || this.valor == "") {
      let toast = await this.toastController.create({
        message: "Formulário inválido",
        duration: 3000
      });

      toast.present();

      return;
    }

    let carona = new Carona();
    carona.Pessoa = this.ObterPessoaSelecionada();
    carona.Data = this.ObterTimestampDataSelecionada();
    carona.PeriodoCarona = this.periodoSelecionado;
    carona.Valor = Number.parseFloat(this.valor.replace(",", "."));

    let caronas = this.ls.getItem("caronas") == null
      ? [] as Carona[]
      : JSON.parse(this.ls.getItem("caronas")) as Carona[];

    caronas.push(carona);
    this.ls.setItem("caronas", JSON.stringify(caronas));

    let toast = await this.toastController.create({
      message: "Salvo com sucesso",
      duration: 3000
    });

    toast.present();

    setTimeout(() => {
      this.pessoaSelecionada = "";
      this.dataSelecionada = "";
      this.periodoSelecionado = null;
      this.valor = "3,00";
    }, 3001);
  }

  private ObterTimestampDataSelecionada(): number {
    let dataSplit = this.dataSelecionada.split("T");
    this.dataSelecionada = `${dataSplit[0]}T00:00:00.0`;

    return new Date(this.dataSelecionada).getTime();
  }

  private ObterPessoaSelecionada(): Pessoa {
    let pessoaSplit = this.pessoaSelecionada.split("-");
    let pessoa = new Pessoa();

    pessoa.Nome = pessoaSplit[0];
    pessoa.Whatsapp = pessoaSplit[1];

    return pessoa;
  }
}