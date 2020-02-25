import { Component } from '@angular/core';
import { Pessoa } from 'src/model/pessoa';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pessoa',
  templateUrl: 'pessoa.page.html',
  styleUrls: ['pessoa.page.scss']
})
export class PessoaPage {

  pessoa: Pessoa;

  constructor(private toastController: ToastController) {
    this.pessoa = new Pessoa();
  }

  async salvar() {
    if (this.pessoa.Nome == null || this.pessoa.Nome == "" ||
      this.pessoa.Whatsapp == null || this.pessoa.Whatsapp == "") {
      let toast = await this.toastController.create({
        message: "Formulário inválido",
        duration: 3000
      });

      toast.present();
      return;
    }

    let ls = window.localStorage;

    let pessoas = ls.getItem("pessoas") == null
      ? [] as Pessoa[]
      : JSON.parse(ls.getItem("pessoas")) as Pessoa[];

    this.pessoa.Whatsapp = this.pessoa.Whatsapp.substring(0, 2) == "55"
      ? this.pessoa.Whatsapp
      : `55${this.pessoa.Whatsapp}`

    pessoas.push(this.pessoa);
    window.localStorage.setItem("pessoas", JSON.stringify(pessoas));

    let toast = await this.toastController.create({
      message: "Salvo com sucesso",
      duration: 3000
    });

    toast.present();

    setTimeout(() => {
      this.pessoa.Nome = "";
      this.pessoa.Whatsapp = "";
    }, 3001);
  }
}