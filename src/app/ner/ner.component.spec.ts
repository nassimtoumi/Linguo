import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NerComponent } from './ner.component';

describe('NerComponent', () => {
  let component: NerComponent;
  let fixture: ComponentFixture<NerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
