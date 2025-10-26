import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PurchaseHistoryPageRoutingModule } from './purchase-history-routing.module';
import { PurchaseHistoryPage } from './purchase-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseHistoryPageRoutingModule
  ],
  declarations: [PurchaseHistoryPage]
})
export class PurchaseHistoryPageModule {}
