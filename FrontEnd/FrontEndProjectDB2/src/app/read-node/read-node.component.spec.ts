import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNodeComponent } from './read-node.component';

describe('ReadNodeComponent', () => {
  let component: ReadNodeComponent;
  let fixture: ComponentFixture<ReadNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
