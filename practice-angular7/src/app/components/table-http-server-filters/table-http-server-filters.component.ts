import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject, fromEvent, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, tap, delay } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { FormControl } from '@angular/forms';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'table-http-server-filters',
  styleUrls: ['table-http-server-filters.component.scss'],
  templateUrl: 'table-http-server-filters.component.html',
})
export class TableHttpServerFiltersComponent implements AfterViewInit {

  txtQuery: string; // bind this to input with ngModel
  txtQueryChanged: Subject<string> = new Subject<string>();

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

  searchCondition: any = {};
  searchValues: any = {};

  @ViewChild(MatPaginator, {}) paginator: MatPaginator;
  @ViewChild(MatSort, {}) sort: MatSort;

  constructor(private _httpClient: HttpClient) {

    this.txtQueryChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(model => {
        console.log(`txtQueryChanged: ${model} ${JSON.stringify(this.searchValues)}`);
        this.txtQuery = model;

        // Call your function which calls API or do anything you would like do after a lag of 1 sec
        //this.getDataFromAPI(this.txtQuery);
      });

  }

  onFieldChange(query: string) {
    this.txtQueryChanged.next(query);
  }

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpServerDatabase(this._httpClient);

    // If sort order changes reset back to first page
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // TODO: bind to relevant input elements only
    /*fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          console.log(`searchValues 1: ${JSON.stringify(this.searchValues)}`);
          this.paginator.pageIndex = 0;

          this.exampleDatabase!.getAcornItems(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchValues
          );
        })
      )
      .subscribe();*/

    /*fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {

          this.paginator.pageIndex = 0;

          this.exampleDatabase!.getAcornItems(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchValues
            );
        })
      )
      .subscribe();*/


    // Load a new page on sort or paginate
    // Merge multiple observables into a single observable
    merge(this.sort.sortChange, this.paginator.page)
      // Combine multiple functions calling each with the output of the previous
      .pipe(
        startWith({}),
        // Map to observable, complete previous inner observable, emit values
        switchMap(() => {
          this.isLoadingResults = true;

          return this.exampleDatabase!.getAcornItems(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.searchValues);
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
    pageSize: number,
    searchValues: any
  ): Observable<AcornAPI> {

    // http://localhost:3000/items?CoordinatorID=2&filter=bach&filterBy=AuthorArtist&sortBy=AuthorArtist&sortOrder=asc&pageSize=1000

    const baseUrl: string = `http://localhost:3000/`;
    const routeEndpoint: string = `items`;
    //const urlParams: string = `?sortBy=${sort}&sortOrder=${order}&pageNumber=${page}&pageSize=${pageSize}`;
    const requestUrl: string = `${baseUrl}${routeEndpoint}`;

    // Add URL encoded search parameters
    let options: any = {
      params: new HttpParams()
      .set('sortBy', sort)
      .set('sortOrder', order)
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize)
      .set('searchValues', JSON.stringify(searchValues))
    };

    //console.log(`QUERY PARAMS: ${sort} ${order} ${page} ${pageSize} ${searchValues}`);
    console.log(`searchValues 2: ${JSON.stringify(searchValues)}`);
    //console.log(`requestUrl: ${requestUrl}`);
    //return this._httpClient.get<AcornAPI>(requestUrl, queryParams);
    return this._httpClient.get<AcornAPI>(requestUrl, options);
  }

}
