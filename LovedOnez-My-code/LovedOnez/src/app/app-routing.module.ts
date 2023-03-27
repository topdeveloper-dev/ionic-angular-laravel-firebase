import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    pathMatch: 'full'
  },
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'welcome-video',
    loadChildren: () => import('./welcome-video/welcome-video.module').then( m => m.WelcomeVideoPageModule)
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'home/:id',
    loadChildren: () => import('../app/pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'first-login',
    loadChildren: () => import('./first-login/first-login.module').then( m => m.FirstLoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('../app/pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'test-demo',
    loadChildren: () => import('./test-demo/test-demo.module').then( m => m.TestDemoPageModule)
  },
  {
    path: 'pay-card',
    loadChildren: () => import('./pages/pay-card/pay-card.module').then( m => m.PayCardPageModule)
  },
  {
    path: 'pay-transaction',
    loadChildren: () => import('./pages/pay-transaction/pay-transaction.module').then( m => m.PayTransactionPageModule)
  },
  {
    path: 'pay-results',
    loadChildren: () => import('./pages/pay-results/pay-results.module').then( m => m.PayResultsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
