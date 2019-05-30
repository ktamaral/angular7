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
  selector: 'table-http-srv',
  styleUrls: ['table-http-srv.component.scss'],
  templateUrl: 'table-http-srv.component.html',
})
export class TableHttpSrvComponent implements AfterViewInit {
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

  exampleDatabase: ExampleHttpSrvDatabase | null;
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
    this.exampleDatabase = new ExampleHttpSrvDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getAcornItems(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isLoadingError = false;
          this.resultsLength = data.totalcount;
          console.log(data);
          return data.page;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isLoadingError = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
}

export interface AcornAPI {
  page: AcornItem[];
  totalcount: number;
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
export class ExampleHttpSrvDatabase {
  constructor(private _httpClient: HttpClient) { }

  /*getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl =
      `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

    return this._httpClient.get<GithubApi>(requestUrl);
  }*/

  // http://localhost:3000/items?CoordinatorID=2&filter=bach&filterBy=AuthorArtist&sortBy=AuthorArtist&sortOrder=asc&pageSize=1000
  getAcornItems(
    sort: string,
    order: string,
    page: number
  ): Observable<AcornAPI> {

    const baseUrl = 'http://localhost:3000/';
    const routeEndpoint = 'items/'
    const queryParams = '';
    //  `?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;
    const requestUrl = `${baseUrl}${routeEndpoint}${queryParams}`;
    /*const requestUrl =
      `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;*/

    return this._httpClient.get<AcornAPI>(requestUrl);
  }

}
