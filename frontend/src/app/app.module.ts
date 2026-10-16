import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AtsComponent } from './ats/ats.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { ApplicationsListComponent } from './applications-list/applications-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AtsComponent,
    SidebarComponent,
    ApplicationFormComponent,
    ApplicationsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
