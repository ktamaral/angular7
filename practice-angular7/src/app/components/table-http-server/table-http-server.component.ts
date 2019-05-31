import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'table-http-server',
  styleUrls: ['table-http-server.component.scss'],
  templateUrl: 'table-http-server.component.html',
})
export class TableHttpServerComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'ItemID',
    'IdentificationID',
    'CoordinatorID',
    'IsNonCollectionMaterial',
    'AuthorArtist',
    'DateOfObject',
    'CollectionName',
    'Storage'
  ];

  exampleDatabase: ExampleHttpServerDatabase | null;
  data: AcornItem[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isLoadingError = false;

  @ViewChild(MatPaginator, {}) paginator: MatPaginator;
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, {}) sort: MatSort;
  //@ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private _httpClient: HttpClient) { }

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpServerDatabase(this._httpClient);

    // If sort order changes reset back to first page
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    console.log(`${this.paginator.pageSize}`);
    // Merge multiple observables into a single observable
    merge(this.sort.sortChange, this.paginator.page)
      // Combine multiple functions calling each with the output of the previous
      .pipe(
        startWith({}),
        // Map to observable, complete previous inner observable, emit values
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getAcornItems(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        // Apply a projection to each value and emit projection in output observable
        map(data => {
          this.isLoadingResults = false;
          this.isLoadingError = false;
          this.resultsLength = data.totalCount;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isLoadingError = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
}

export interface AcornAPI {
  items: AcornItem[];
  totalCount: number;
}

export interface AcornItem {
  ItemID: number;
  IdentificationID: number;
  CoordinatorID: number;
  IsNonCollectionMaterial: number;
  AuthorArtist: string;
  DateOfObject: string;
  CollectionName: string;
  Storage: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpServerDatabase {
  constructor(private _httpClient: HttpClient) { }

  getAcornItems(
    sort: string,
    order: string,
    page: number,
    pageSize: number
  ): Observable<AcornAPI> {

    // http://localhost:3000/items?CoordinatorID=2&filter=bach&filterBy=AuthorArtist&sortBy=AuthorArtist&sortOrder=asc&pageSize=1000

    const baseUrl = `http://localhost:3000/`;
    const routeEndpoint = `items`;
    const queryParams = `?sortBy=${sort}&sortOrder=${order}&pageNumber=${page}&pageSize=${pageSize}`;
    const requestUrl = `${baseUrl}${routeEndpoint}${queryParams}`;

    console.log(`QUERY PARAMS: ${sort} ${order} ${page} ${pageSize}`);
    console.log(`requestUrl: ${requestUrl}`);
    return this._httpClient.get<AcornAPI>(requestUrl);
  }

}
