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

  /**
   * txtQueryChanged(): Observable<string> {
   *  return this.subject.asObservable();
   * }
   */

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

  acornHttpApi: AcornHttpApi | null;
  data: AcornItem[] = [];

  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isLoadingError: boolean = false;

  searchCondition: any = {};
  searchValues: any = {};

  @ViewChild(MatPaginator, {}) paginator: MatPaginator;
  @ViewChild(MatSort, {}) sort: MatSort;

  constructor(private _httpClient: HttpClient) { }

  onFieldChange(query: string) {
    this.txtQueryChanged.next(query);
  }

  /**
   * TODO:
   * https://blog.angular-university.io/angular-debugging/
   */
  /*ngOnInit() {

    // load the initial page
    this.dataSource.loadLessons(...);
  }*/

  ngAfterViewInit() {
    this.acornHttpApi = new AcornHttpApi(this._httpClient);

    // If sort order changes reset back to first page
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Load a new page on sort or paginate
    // Merge multiple observables into a single observable
    //merge(this.sort.sortChange, this.paginator.page, this.txtQueryChanged.pipe(debounceTime(100)))
    merge(this.sort.sortChange, this.paginator.page, this.txtQueryChanged)
      // Combine multiple functions calling each with the output of the previous
      .pipe(
        startWith({}),
        // Map to observable, complete previous inner observable, emit values
        switchMap(() => {
          this.isLoadingResults = true;

          return this.acornHttpApi!.getItems(
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

          console.log(`sort.direction ${this.sort.direction}`);
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
export class AcornHttpApi {
  constructor(private _httpClient: HttpClient) { }

  getItems(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    searchValues: any
  ): Observable<AcornAPI> {

    // http://localhost:3000/items?CoordinatorID=2&filter=bach&filterBy=AuthorArtist&sortBy=AuthorArtist&sortOrder=asc&pageSize=1000

    const BASE_URL: string = `http://localhost:3000/`;
    const ENDPOINT: string = `items`;
    const PAGINATION: string = `?sort=${sort}&order=${order}&page=${page}&pageSize=${pageSize}`;
    const SEARCH_QUERY: string = `&q=${JSON.stringify(searchValues)}`;
    const REQUEST_URL: string = `${BASE_URL}${ENDPOINT}${PAGINATION}${SEARCH_QUERY}`

    // Add URL encoded search parameters
    let options: any = {
      params: new HttpParams()
      .set('sortBy', sort)
      .set('sortOrder', order)
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString())
      .set('searchValues', JSON.stringify(searchValues))
    };

    console.log(`QUERY PARAMS: ${sort} ${order} ${page} ${pageSize} ${JSON.stringify(searchValues)}`);

    /**
     * TODO:
     * ERROR in src/app/components/table-http-server-filters/table-http-server-filters.component.ts(194,5):
     * error TS2322: Type 'Observable<HttpEvent<AcornAPI>>' is not assignable to type 'Observable<AcornAPI>'.
     */
    return this._httpClient.get<AcornAPI>(REQUEST_URL);
  }

}
