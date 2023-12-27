import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { PropertyComponent } from './components/property/property.component';
import { EventComponent } from './components/event/event.component';
import { LoginStatusComponent } from './components/auth/login-status/login-status.component';
import { AuthInterceptor } from './lib/interceptors/auth.interceptor';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SettingsComponent } from './components/clients/settings/settings.component';
import { ProfileComponent } from './components/clients/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';
import { TicketComponent } from './components/clients/ticket/ticket.component';
import { EventDetailsComponent } from './components/event/event-details/event-details.component';
import { PropertyDetailsComponent } from './components/property/property-details/property-details.component';
import { SuccessComponent } from './components/clients/ticket/success/success.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    PropertyComponent,
    EventComponent,
    LoginStatusComponent,
    SettingsComponent,
    ProfileComponent,
    CartComponent,
    TicketComponent,
    EventDetailsComponent,
    PropertyDetailsComponent,
    SuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    CarouselModule.forRoot()
  ],
  providers: [LoginStatusComponent,{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
