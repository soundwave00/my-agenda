import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventDialogComponent } from './new-event-dialog.component';

describe('EventDialogComponent', () => {
  let component: NewEventDialogComponent;
  let fixture: ComponentFixture<NewEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
