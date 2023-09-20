import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTemplate3Component } from './page-template3.component';

describe('PageTemplate3Component', () => {
  let component: PageTemplate3Component;
  let fixture: ComponentFixture<PageTemplate3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageTemplate3Component]
    });
    fixture = TestBed.createComponent(PageTemplate3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
