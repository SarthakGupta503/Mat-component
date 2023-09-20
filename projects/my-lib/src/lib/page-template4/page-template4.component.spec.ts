import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTemplate4Component } from './page-template4.component';

describe('PageTemplate4Component', () => {
  let component: PageTemplate4Component;
  let fixture: ComponentFixture<PageTemplate4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageTemplate4Component]
    });
    fixture = TestBed.createComponent(PageTemplate4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
