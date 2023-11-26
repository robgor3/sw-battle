export const getGreeting = () => cy.get('h1');
export const getGameModeSelect = () => cy.get(`sw-battle-ui-select[data-testId='game-mode-select']`);
export const getFirstPlayer = () => cy.get(`sw-battle-player[data-testId='player-1']`);
export const getFirstPlayerMatCard = () => cy.get(`sw-battle-player[data-testId='player-1']  mat-card`);
export const getSecondPlayer = () => cy.get(`sw-battle-player[data-testId='player-2']`);
export const getFightButton = () => cy.get(`sw-battle-ui-button[data-testId='fight-button']`);
export const getResetGameButton = () => cy.get(`sw-battle-ui-button[data-testId='reset-button']`);
