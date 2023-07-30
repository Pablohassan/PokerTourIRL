import React, { ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';

interface Props {
  newGame: any,
  handleNewGameChange: (event: ChangeEvent<HTMLInputElement>) => void,
  handleDateChange: (date: Date) => void,
  handleAddNewGame: () => void
}

export const NewGameForm: React.FC<Props> = ({ newGame, handleNewGameChange, handleDateChange, handleAddNewGame }) => {
  return (
    <div>
      <label htmlFor="newGameDate">Date : </label>
      <DatePicker selected={newGame.date} onChange={handleDateChange} />

      <label htmlFor="newGamePoints">Points: </label>
      <input id="newGamePoints" name="points" type="number" value={newGame.points} onChange={handleNewGameChange} />

      <label htmlFor="newGameRebuys">Rebuys: </label>
      <input id="newGameRebuys" name="rebuys" type="number" value={newGame.rebuys} onChange={handleNewGameChange} />

      <button onClick={handleAddNewGame}>Ajouter</button>
    </div>
  );
};
