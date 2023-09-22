import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTemplate5Component } from './page-template5.component';

describe('PageTemplate5Component', () => {
  let component: PageTemplate5Component;
  let fixture: ComponentFixture<PageTemplate5Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageTemplate5Component]
    });
    fixture = TestBed.createComponent(PageTemplate5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
