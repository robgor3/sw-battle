import { Contender } from './contender';

export interface GameResult {
  winnerId: number | null;
  firstContender: NonNullable<Contender>;
  secondContender: NonNullable<Contender>;
}
