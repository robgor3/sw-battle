import { Contender } from './contender';

export interface GameResult {
  winnerId: number;
  firstContender: NonNullable<Contender>;
  secondContender: NonNullable<Contender>;
}
