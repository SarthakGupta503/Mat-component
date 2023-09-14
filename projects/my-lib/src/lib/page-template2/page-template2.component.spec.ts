import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTemplate2Component } from './page-template2.component';

describe('PageTemplate2Component', () => {
  let component: PageTemplate2Component;
  let fixture: ComponentFixture<PageTemplate2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageTemplate2Component]
    });
    fixture = TestBed.createComponent(PageTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
