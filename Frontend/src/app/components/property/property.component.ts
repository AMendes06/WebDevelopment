import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../lib/services/property.service';
import { Router } from '@angular/router';
import { propertyModel } from 'src/app/lib/models/propertyModel';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  properties: propertyModel[] = [];
  filteredProperties: propertyModel[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages?: number;
  searchQuery: string = '';

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit() {
    this.getProperties();
  }

  getProperties(): void {
    this.propertyService.getProperty().subscribe((list: propertyModel[]) => {
      this.properties = list;
      this.filterProperties();
    });
  }

  getPaginatedProperties(): propertyModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProperties.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  filterProperties(): void {
    this.filteredProperties = this.properties.filter(property => {
      const searchValue = this.searchQuery.toLowerCase().trim();
      const nameMatch = property.propertyName?.toLowerCase().includes(searchValue);
      const addressMatch = property.address?.toLowerCase().includes(searchValue);

      return nameMatch || addressMatch;
    });

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
  }
}
