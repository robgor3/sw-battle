import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';

describe(PlayerComponent, () => {
  let fixture: ComponentFixture<PlayerComponent>;
  let component: PlayerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
