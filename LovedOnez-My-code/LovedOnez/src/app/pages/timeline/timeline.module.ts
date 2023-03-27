import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelinePageRoutingModule } from './timeline-routing.module';

import { TimelinePage } from './timeline.page';
import { TimelineComponent, TimelineItemComponent, TimelineTimeComponent } from 'src/app/timeline/timeline.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelinePageRoutingModule
  ],
  declarations: [
    TimelinePage,
    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent,
  ]
})
export class TimelinePageModule {}
