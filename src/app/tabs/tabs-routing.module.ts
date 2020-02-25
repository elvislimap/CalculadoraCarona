import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'pessoa',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pessoa/pessoa.module').then(m => m.PessoaPageModule)
          }
        ]
      },
      {
        path: 'carona',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../carona/carona.module').then(m => m.CaronaPageModule)
          }
        ]
      },
      {
        path: 'relatorio',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../relatorio/relatorio.module').then(m => m.RelatorioPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/carona',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/carona',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
