import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { GameMetadata } from '../models/game-metadata';
import { GameMode } from '../models/game-mode';
import { GameResult } from '../models/game-result';
import { Person } from '../models/person';
import { Starship } from '../models/starship';
import { BattleApiService } from '../state/api/battle-api.service';
import { BattleStore } from '../state/battle-store.service';
import { getDefaultBattleState } from '../state/get-default-battle-state';
import { BattleEngineService } from './battle-engine.service';
import DoneCallback = jest.DoneCallback;
import MockedObject = jest.MockedObject;

describe(BattleEngineService, () => {
  let service: BattleEngineService;
  let apiService: MockedObject<BattleApiService>;
  let store: MockedObject<BattleStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BattleEngineService,
        {
          provide: BattleApiService,
          useValue: {
            getGameMetadata$: jest.fn(() => of(undefined)),
            getPerson$: jest.fn(() => of(getMockPerson())),
            getStarship$: jest.fn(() => of(getMockStarship())),
          },
        },
        {
          provide: BattleStore,
          useValue: {
            patchState: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(BattleEngineService);
    apiService = TestBed.inject(BattleApiService) as MockedObject<BattleApiService>;
    store = TestBed.inject(BattleStore) as MockedObject<BattleStore>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getGameMetadata', () => {
    it('should get game metadata from api service', (done: DoneCallback) => {
      service.getGameMetadata$().subscribe(() => {
        expect(apiService.getGameMetadata$).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should set game metadata if it api call was successful', (done: DoneCallback) => {
      const gameMetadata: GameMetadata = {
        maxPeopleId: 1,
        maxStarshipsId: 1,
      };

      apiService.getGameMetadata$.mockReturnValue(of(gameMetadata));

      service.getGameMetadata$().subscribe(() => {
        expect(store.patchState).toHaveBeenCalledTimes(1);
        expect(store.patchState).toHaveBeenCalledWith({ gameMetadata });
        done();
      });
    });

    it('should fallback to default game metadata values for failed api call', (done: DoneCallback) => {
      const gameMetadata: GameMetadata = getDefaultBattleState().gameMetadata;

      apiService.getGameMetadata$.mockReturnValue(throwError(() => new Error('')));

      service.getGameMetadata$().subscribe({
        error: () => {
          expect(store.patchState).toHaveBeenCalledTimes(1);
          expect(store.patchState).toHaveBeenCalledWith({ gameMetadata: gameMetadata });
          done();
        },
      });
    });
  });

  describe('#playGame', () => {
    const mode$: BehaviorSubject<GameMode> = new BehaviorSubject<GameMode>(GameMode.PEOPLE);
    const metadata$: BehaviorSubject<GameMetadata> = new BehaviorSubject<GameMetadata>({
      maxPeopleId: 100,
      maxStarshipsId: 100,
    });

    afterEach(() => {
      mode$.next(GameMode.PEOPLE);
      metadata$.next({
        maxPeopleId: 100,
        maxStarshipsId: 100,
      });
    });

    it('should get people players for game if people game mode was selected', (done: DoneCallback) => {
      service.playGame$({ mode$, metadata$ }).subscribe(() => {
        expect(apiService.getPerson$).toHaveBeenCalled();
        expect(apiService.getStarship$).not.toHaveBeenCalled();
        done();
      });
    });

    it('should get starship players for game if people game mode was selected', (done: DoneCallback) => {
      mode$.next(GameMode.STARSHIPS);

      service.playGame$({ mode$, metadata$ }).subscribe(() => {
        expect(apiService.getPerson$).not.toHaveBeenCalled();
        expect(apiService.getStarship$).toHaveBeenCalled();
        done();
      });
    });

    it('should return game result object with contenders and winner id', (done: DoneCallback) => {
      service.playGame$({ mode$, metadata$ }).subscribe((result: GameResult) => {
        const firstPerson: Person = result.firstContender as Person;
        const secondPerson: Person = result.secondContender as Person;

        if (!firstPerson || !secondPerson) {
          fail('At this point contenders should be known!');
        }

        const winnerId: number = firstPerson.mass > secondPerson.mass ? firstPerson.id : secondPerson.id;

        expect(result.winnerId).toEqual(winnerId);
        expect(firstPerson).toBeDefined();
        expect(secondPerson).toBeDefined();

        done();
      });
    });
  });

  function getMockPerson(): Person {
    return {
      id: Math.floor(Math.random() * 100),
      name: `person name ${Math.random()}`,
      mass: Math.floor(Math.random() * 100),
    };
  }

  function getMockStarship(): Starship {
    return {
      id: Math.floor(Math.random() * 100),
      name: `starship name ${Math.random()}`,
      crew: Math.floor(Math.random() * 100),
    };
  }
});
