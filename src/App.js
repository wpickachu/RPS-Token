import React, { useEffect, useState } from "react";
import "./App.css";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState();
  const [playersLength, setPlayersLength] = useState(0);
  const [value, setValue] = useState(0);
  const [card, setCard] = useState(0);

  const fetchData = async () => {
    console.log(lottery);
    const manager = await lottery.methods.manager().call();
    const playersLength = await lottery.methods.getPlayersLength().call();
    await window.ethereum.enable();
    setManager(manager);
    setPlayersLength(playersLength);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStatus = () => {
    if (playersLength == 0) return "Nobody! ";
    if (playersLength == 1) return "One entered. Try to win the prize... ";
    return "Full! Wait for a bit. ";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("here!");
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter(card, value * 1000).send({
      from: accounts[0],
    });

    await fetchData();
  };

  const onBuy = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.buy().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    await fetchData();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Lottery Contract</h2>
        <p>This contract owner is {manager}</p>
      </header>

      <div
        style={{
          padding: "3rem",
        }}
      >
        <p>{renderStatus()}</p>
        <hr />
        <form onSubmit={onSubmit}>
          <h4>Want to try luck?</h4>
          <div>
            <label>Amount of token to enter</label>
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              type="number"
            />
          </div>
          <div>
            <select value={card} onChange={(e) => setCard(e.target.value)}>
              <option value={0}>Rock</option>
              <option value={1}>Paper</option>
              <option value={2}>Scissors</option>
            </select>
          </div>
          <button type="submit">Enter</button>
        </form>
        <hr />
        <form onSubmit={onBuy}>
          <h4>Want to buy?</h4>
          <div>
            <label>Amount of ether to exchange</label>
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              type="number"
            />
          </div>
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}

export default App;
