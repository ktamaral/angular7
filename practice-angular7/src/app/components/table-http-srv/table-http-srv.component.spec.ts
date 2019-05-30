import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHttpSrvComponent } from './table-http-srv.component';

describe('TableHttpSrvComponent', () => {
  let component: TableHttpSrvComponent;
  let fixture: ComponentFixture<TableHttpSrvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHttpSrvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHttpSrvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
