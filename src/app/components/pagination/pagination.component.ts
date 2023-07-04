import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from 'src/app/models/pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input()
  paginacion: Pagination = {};

  @Output()
  recargar: EventEmitter<any> = new EventEmitter();
  @Output()
  nextPage: EventEmitter<any> = new EventEmitter();
  @Output()
  prevPage: EventEmitter<any> = new EventEmitter();

  valuesPerPage: Array<number> = [1, 5, 10, 20, 30, 50];

  constructor() { }

  ngOnInit(): void {
    if (this.paginacion.perPage === undefined || this.paginacion.perPage === null) {
      this.paginacion.perPage = 10;
    }
  }

  changePagination() {
    this.recargar.emit(this.paginacion);
  }

  prevPageF() {
    this.prevPage.emit();
  }

  nextPageF() {
    this.nextPage.emit();
  }

}
