import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PropertyComponent } from './components/property/property.component';
import { EventComponent } from './components/event/event.component';
import { LoginStatusGuard } from './lib/guards/login-status.guard';
import { SettingsComponent } from './components/clients/settings/settings.component';
import { ProfileComponent } from './components/clients/profile/profile.component';
import { EventDetailsComponent } from './components/event/event-details/event-details.component';
import { TicketComponent } from './components/clients/ticket/ticket.component';
import { PropertyDetailsComponent } from './components/property/property-details/property-details.component';
import { SuccessComponent } from './components/clients/ticket/success/success.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'property', component: PropertyComponent},
  { path: 'property/:propertyName', component: PropertyDetailsComponent},
  { path: 'event', component: EventComponent},
  { path: 'event/:id', component: EventDetailsComponent },
  { path: 'settings', component: SettingsComponent,canActivate:[LoginStatusGuard] },
  { path: 'profile', component: ProfileComponent,canActivate:[LoginStatusGuard] },
  { path: 'tickets', component: TicketComponent,canActivate:[LoginStatusGuard] },
  { path: 'success', component: SuccessComponent,canActivate:[LoginStatusGuard] },
  { path: '**', redirectTo: '/' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
