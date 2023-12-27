import { Component, OnInit } from '@angular/core';
import { eventModel } from 'src/app/lib/models/eventModel';
import { EventService } from '../../lib/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: eventModel[] = [];
  filteredEvents: eventModel[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages?: number;
  searchQuery: string = '';
  startDate?: Date;
  endDate?: Date;


  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.getEvent();
  }

  getEvent(): void {
    this.eventService.getEvent().subscribe((list: eventModel[]) => {
      this.events = list;
      this.filterEvents();
    });
  }

  getPaginatedEvents(): eventModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const searchValue = this.searchQuery.toLowerCase().trim();
      const nameMatch = event.name?.toLowerCase().includes(searchValue);
      const propertyMatch = event.property?.propertyName?.toLowerCase().includes(searchValue);

      // Date range filtering
      const startDateMatch = !this.startDate || !event.date || new Date(event.date) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || !event.date || new Date(event.date) <= new Date(this.endDate);

      return (nameMatch || propertyMatch) && startDateMatch && endDateMatch;
    });

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }
}
