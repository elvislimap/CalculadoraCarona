import { Component } from '@angular/core';
import { Carona } from 'src/model/carona';
import { Pessoa } from 'src/model/pessoa';
import { ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PeriodoCaronaEnum } from 'src/enums/periodo-carona-enum';

@Component({
  selector: 'app-relatorio',
  templateUrl: 'relatorio.page.html',
  styleUrls: ['relatorio.page.scss']
})
export class RelatorioPage {
  private ls = window.localStorage;

  mesSelecionado: string;
  valorTotalReceber: number;
  valorTotalReceberFormatado: string;
  caronasFiltradasPorPessoa: any[];

  constructor(private toastController: ToastController, private socialSharing: SocialSharing) { }

  ionViewWillEnter() {
    this.mesSelecionado = "";
    this.valorTotalReceber = 0;
    this.valorTotalReceberFormatado = "";
    this.caronasFiltradasPorPessoa = [];
  }

  filtrarRelatorio() {
    this.valorTotalReceber = 0;
    this.valorTotalReceberFormatado = "";
    this.caronasFiltradasPorPessoa = [];

    let mesSelecionadoSplit = this.mesSelecionado.split("-");
    let inicioPeriodo = `${mesSelecionadoSplit[0]}-${mesSelecionadoSplit[1]}-01T00:00:00.0`;
    let dataInicio = new Date(inicioPeriodo);
    let dataFim = new Date(new Date(inicioPeriodo).setMonth(new Date(inicioPeriodo).getMonth() + 1));
    dataFim = new Date(dataFim.setDate(dataFim.getDate() - 1));

    this.ObterRegistrosPorPeriodo(dataInicio.getTime(), dataFim.getTime());

    for (let i = 0; i < this.caronasFiltradasPorPessoa.length; i++) {
      const carona = this.caronasFiltradasPorPessoa[i];

      console.log(this.ObterMensagemEnviarWhatsapp(carona));
    }
  }

  enviarPorWhatsapp(caronaPorPessoa: any) {
    this.socialSharing.shareViaWhatsAppToReceiver(caronaPorPessoa.Whatsapp,
      this.ObterMensagemEnviarWhatsapp(caronaPorPessoa))
      .then(async () => {
        let toast = await this.toastController.create({
          message: "Mensagem enviada com sucesso",
          duration: 3000
        });

        toast.present();
      })
      .catch(async ex => {
        console.log("Erro ao enviar mensagem via whatsapp:", ex);
        let toast = await this.toastController.create({
          message: "Não foi possível enviar a mensagem, verifique sua conexão com a internet e tente novamente mais tarde.",
          duration: 5000
        });

        toast.present();
      });
  }


  private ObterRegistrosPorPeriodo(timeInicio: number, timeFim: number): void {
    let caronas = this.ls.getItem("caronas") == null
      ? [] as Carona[]
      : JSON.parse(this.ls.getItem("caronas")) as Carona[];

    let caronasFiltradas: Carona[] = [];

    for (let i = 0; i < caronas.length; i++) {
      const carona = caronas[i];

      if (carona.Data >= timeInicio && carona.Data <= timeFim)
        caronasFiltradas.push(carona);
    }

    for (let i = 0; i < caronasFiltradas.length; i++) {
      const caronaFiltrada = caronasFiltradas[i];
      this.valorTotalReceber += caronaFiltrada.Valor;
    }

    this.valorTotalReceberFormatado = this.valorTotalReceber.toFixed(2).replace(".", ",");
    this.ObterRegistrosFiltradosPorPessoa(caronasFiltradas);
  }

  private ObterRegistrosFiltradosPorPessoa(caronasFiltradas: Carona[]): void {
    let pessoas = this.ls.getItem("pessoas") == null
      ? [] as Pessoa[]
      : JSON.parse(this.ls.getItem("pessoas")) as Pessoa[];

    for (let i = 0; i < pessoas.length; i++) {
      const pessoa = pessoas[i];
      let caronasPessoa: Carona[] = [];

      for (let j = 0; j < caronasFiltradas.length; j++) {
        const caronaFiltrada = caronasFiltradas[j];

        if (caronaFiltrada.Pessoa.Nome == pessoa.Nome)
          caronasPessoa.push(caronaFiltrada);
      }

      let valorTotalPorPessoa: number = 0;
      let detalhesCaronas: any[] = []

      if (caronasPessoa.length) {
        for (let j = 0; j < caronasPessoa.length; j++) {
          const carona = caronasPessoa[j];
          valorTotalPorPessoa += carona.Valor;

          detalhesCaronas.push({ Data: carona.Data, Periodo: carona.PeriodoCarona, Valor: carona.Valor.toFixed(2).replace(".", ",") });
        }

        this.caronasFiltradasPorPessoa.push({
          NomePessoa: caronasPessoa[0].Pessoa.Nome, Whatsapp: caronasPessoa[0].Pessoa.Whatsapp,
          Valor: valorTotalPorPessoa.toFixed(2).replace(".", ","), DetalhesCaronas: detalhesCaronas
        });
      }
    }
  }

  private ObterMensagemEnviarWhatsapp(caronaPorPessoa: any): string {
    let dataDetalheCarona = new Date(caronaPorPessoa.DetalhesCaronas[0].Data);

    let mesFechamento = (dataDetalheCarona.getMonth() + 1) >= 1 && (dataDetalheCarona.getMonth() + 1) <= 9
      ? `0${dataDetalheCarona.getMonth() + 1}`
      : dataDetalheCarona.getMonth() + 1;

    let anoFechamento = dataDetalheCarona.getFullYear();

    let texto = `Esta é uma mensagem automática de Elvis Lima para ${caronaPorPessoa.NomePessoa}\n
------------------------------------------------
FECHAMENTO DO MÊS (CARONA) ${mesFechamento}/${anoFechamento}
------------------------------------------------\n\n`;

    for (let i = 0; i < caronaPorPessoa.DetalhesCaronas.length; i++) {
      const detalhe = caronaPorPessoa.DetalhesCaronas[i];
      let data = new Date(detalhe.Data);
      let dia = data.getDate() >= 1 && data.getDate() <= 9
        ? `0${data.getDate()}`
        : data.getDate();
      let mes = (data.getMonth() + 1) >= 1 && (data.getMonth() + 1) <= 9
        ? `0${data.getMonth() + 1}`
        : data.getMonth() + 1;
      let ano = data.getFullYear().toString().substring(2, 4);

      texto += `${dia}/${mes}/${ano} - ${Number.parseInt(detalhe.Periodo) == PeriodoCaronaEnum.Ida
        ? "Ida"
        : "Volta"} - ${detalhe.Valor}\n`;
    }

    texto += `\n------------------------------------------------\n`;
    texto += `TOTAL A PAGAR: R$ ${caronaPorPessoa.Valor}\n`;
    texto += `------------------------------------------------`;

    return texto;
  }
}