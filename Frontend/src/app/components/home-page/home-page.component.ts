import { Component, OnInit } from '@angular/core';
import { eventModel } from 'src/app/lib/models/eventModel';
import { propertyModel } from 'src/app/lib/models/propertyModel';
import { EventService } from 'src/app/lib/services/event.service';
import { PropertyService } from 'src/app/lib/services/property.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  events: eventModel[] = [];
  properties?: propertyModel[];
  ngOnInit() {
    this.getEvent()
    this.getProperties()
  }

  constructor(private eventService: EventService,private propertyService: PropertyService) { }

  getEvent(): void {
    this.eventService.getEvent().subscribe((list: eventModel[]) => {
      // Filter out events with undefined dates
      const filteredEvents = list.filter(event => event.date !== undefined);
  
      // Sort events based on their proximity to the current date
      this.events = filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date!).getTime();
        const dateB = new Date(b.date!).getTime();
        const currentDate = new Date().getTime();
        const differenceA = Math.abs(dateA - currentDate);
        const differenceB = Math.abs(dateB - currentDate);
        return differenceA - differenceB;
      });
      this.events = this.events.slice(0, 3);
    });
  }

  getProperties(): void {
    this.propertyService.getProperty().subscribe((list: propertyModel[]) => {
      const shuffledEvents = list.sort(() => 0.5 - Math.random());
      this.properties = shuffledEvents.slice(0, 5);
    });
  }
}
