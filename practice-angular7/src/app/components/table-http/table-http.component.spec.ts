import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHttpComponent } from './table-http.component';

describe('TableHttpComponent', () => {
  let component: TableHttpComponent;
  let fixture: ComponentFixture<TableHttpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHttpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHttpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
