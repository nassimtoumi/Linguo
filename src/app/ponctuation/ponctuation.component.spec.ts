import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonctuationComponent } from './ponctuation.component';

describe('PonctuationComponent', () => {
  let component: PonctuationComponent;
  let fixture: ComponentFixture<PonctuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonctuationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonctuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
