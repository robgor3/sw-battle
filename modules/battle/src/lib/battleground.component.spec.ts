import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattlegroundComponent } from './battleground.component';

describe('BattleComponent', () => {
  let component: BattlegroundComponent;
  let fixture: ComponentFixture<BattlegroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattlegroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BattlegroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
