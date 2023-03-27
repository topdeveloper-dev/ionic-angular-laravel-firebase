import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';

const routes: Routes = [
{
  path: 'menu',
  component: MenuPage,
  children: [
    {
    path: 'home',
    loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'create-new-message',
    loadChildren: () => import('../create-new-message/create-new-message.module').then( m => m.CreateNewMessagePageModule)
  },
  {
    path: 'view-message',
    loadChildren: () => import('../view-message/view-message.module').then( m => m.ViewMessagePageModule)
  },
  {
    path: 'received-message',
    loadChildren: () => import('../received-message/received-message.module').then( m => m.ReceivedMessagePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'timeline',
    loadChildren: () => import('../timeline/timeline.module').then( m => m.TimelinePageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('../contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'pay-card',
    loadChildren: () => import('./../pay-card/pay-card.module').then( m => m.PayCardPageModule)
  },
  {
    path: 'pay-transaction',
    loadChildren: () => import('./../pay-transaction/pay-transaction.module').then( m => m.PayTransactionPageModule)
  },
  {
    path: 'pay-results',
    loadChildren: () => import('./../pay-results/pay-results.module').then( m => m.PayResultsPageModule)
  },
  ]
}, 
{
  path: '**',
  redirectTo: '/login'
}
];




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
