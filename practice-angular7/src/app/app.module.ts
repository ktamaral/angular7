import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MatButtonModule, MatCheckboxModule, MatMenuModule } from '@angular/material';
import { MaterialModule } from './material-module';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { TableComponent } from './components/table/table.component';
import { TableHttpComponent } from './components/table-http/table-http.component';
import { TableHttpSrvComponent } from './components/table-http-srv/table-http-srv.component';
import { TableHttpServerComponent } from './components/table-http-server/table-http-server.component';

@NgModule({
  // Components, directives, and pipes that belong to this module
  // A declarable can only belong to one module
  declarations: [
    AppComponent,
    MenuComponent,
    TableComponent,
    TableHttpComponent,
    TableHttpSrvComponent,
    TableHttpServerComponent
  ],
  // @NgModule references only
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    //HttpModule,
    HttpClientModule
  ],
  // Services
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
