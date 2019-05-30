import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHttpServerComponent } from './table-http-server.component';

describe('TableHttpServerComponent', () => {
  let component: TableHttpServerComponent;
  let fixture: ComponentFixture<TableHttpServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHttpServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHttpServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
