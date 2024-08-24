import React from 'react';

interface MenuProps {
    handleNavigate: (path: string) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
  }

const Menu: React.FC<MenuProps> = ({handleNavigate, setIsMenuOpen} ) => {

  const handleClick = (path: string) => {
    handleNavigate(path);
    setIsMenuOpen(false);
  };


  return (
    <div className="menu">
       
              <div className="button-container">
                <button  className="poker-button" onClick={() => handleClick("/ranking")}>Ranking</button>
                <button className="poker-button" onClick={() => handleClick("/startGame")}>Start Partie</button>
                <button className="poker-button" onClick={() => handleClick("/results")}>Results</button>
                <button className="poker-button" onClick={() => handleClick("/addplayer")}>Add Player</button>
                <button className="poker-button" onClick={() => handleClick("/partypage")}>All Parties</button>
                <div className="sign-out-button">
                  {/* <SignOutButton /> */}
                </div>
              </div>
            </div>
  );
};

export default Menu;