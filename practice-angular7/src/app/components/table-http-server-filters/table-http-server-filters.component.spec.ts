import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHttpServerFiltersComponent } from './table-http-server-filters.component';

describe('TableHttpServerFiltersComponent', () => {
  let component: TableHttpServerFiltersComponent;
  let fixture: ComponentFixture<TableHttpServerFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHttpServerFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHttpServerFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
