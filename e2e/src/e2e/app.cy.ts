import { Interception } from 'cypress/types/net-stubbing';
import {
  getFightButton,
  getFirstPlayer,
  getFirstPlayerMatCard,
  getGameModeSelect,
  getResetGameButton,
  getSecondPlayer,
} from '../support/app.po';

describe('sw-battle', () => {
  const apiUrl: string = 'https://swapi.tech/api';
  const placeholderText: string = 'Start fight to see contender';

  beforeEach(() => cy.visit('/'));

  describe('on init', () => {
    it('should get people resource metadata from API', () => {
      cy.intercept({ url: 'people', method: 'GET' }).as('getPeopleMetadata');

      cy.visit('/');

      cy.wait('@getPeopleMetadata').then((interception: Interception) => {
        assert.isNumber(interception.response?.body.total_records, 'Total people records number is known');
      });
    });

    it('should get starships resource metadata from API', () => {
      cy.intercept({ url: 'starships', method: 'GET' }).as('getStarshipsMetadata');

      cy.visit('/');

      cy.wait('@getStarshipsMetadata').then((interception: Interception) => {
        assert.isNumber(interception.response?.body.total_records, 'Total people records number is known');
      });
    });
  });

  describe('initial layout', () => {
    it('should display game mode select', () => {
      getGameModeSelect().should('exist').should('contain', 'Choose game mode');
    });

    it('should display both players', () => {
      getFirstPlayer().should('exist').should('contain', 'Start fight to see contender');
      getSecondPlayer().should('exist').should('contain', 'Start fight to see contender');
    });

    it('should display fight button', () => {
      getFightButton().should('exist').should('contain', 'Fight');
    });

    it('should display reset game button', () => {
      getResetGameButton().should('exist').should('contain', 'Reset game');
    });
  });

  describe('when fight button was clicked', () => {
    beforeEach(() => {
      cy.intercept({ url: `${apiUrl}/people?*`, method: 'GET', times: 1 }).as('getMetadata');
      cy.wait('@getMetadata');
    });

    it('should get players data from API when fight button was clicked', () => {
      cy.intercept({ url: `${apiUrl}/people/*`, method: 'GET' }).as('getPlayers');

      getFightButton().trigger('click');

      cy.wait('@getPlayers')
        .wait('@getPlayers')
        .then(() => {
          getFirstPlayer().should('not.contain.text', placeholderText);
          getSecondPlayer().should('not.contain.text', placeholderText);
        });
    });

    it('should mark winnner card', () => {
      cy.intercept({ url: `${apiUrl}/people/*`, method: 'GET', times: 1 }, { fixture: 'first-player-person.json' }).as(
        'getFirstPlayer',
      );
      cy.intercept({ url: `${apiUrl}/people/*`, method: 'GET', times: 1 }, { fixture: 'second-player-person.json' }).as(
        'getSecondPlayer',
      );

      getFightButton().trigger('click');

      cy.wait('@getFirstPlayer');
      cy.wait('@getSecondPlayer');

      getFirstPlayerMatCard().should('have.class', 'player-card--winner');
    });
  });

  describe('when reset button was clicked', () => {
    beforeEach(() => {
      cy.intercept({ url: `${apiUrl}/people?*`, method: 'GET', times: 1 }).as('getMetadata');
      cy.wait('@getMetadata');

      cy.intercept({ url: `${apiUrl}/people/*`, method: 'GET' }).as('getPlayers');

      getFightButton().trigger('click');

      cy.wait('@getPlayers');
    });

    it('should restore game to initial state', () => {
      getResetGameButton().trigger('click');

      getFirstPlayer().should('contain.text', placeholderText);
      getSecondPlayer().should('contain.text', placeholderText);
    });
  });
});
