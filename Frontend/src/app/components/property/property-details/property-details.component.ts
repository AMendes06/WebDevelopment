import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/lib/services/property.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  events: any[] = [];

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,){}

  ngOnInit() {
    this.getEventsFromProperty()
  }

  getEventsFromProperty(){
    const propertyName = this.route.snapshot.params['propertyName'];
    this.propertyService.getEventsFromProperty(propertyName).subscribe({
      next: (data) => {
        this.events = data;
        console.log(this.events)
      }
    })
  }
}
