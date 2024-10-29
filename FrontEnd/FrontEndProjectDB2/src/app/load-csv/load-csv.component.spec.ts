import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCsvComponent } from './load-csv.component';

describe('LoadCsvComponent', () => {
  let component: LoadCsvComponent;
  let fixture: ComponentFixture<LoadCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
