import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import './App.css';



function Shop(){
  const [inventory, setInventory] = useState([]); 

  function addToInventory(e){
    e.preventDefault()
    console.log(e)

  }


  const categories = [
    {weapons:[
      {name:"platina dagger", price:1000}, 
      {name:"mage masher", price:2000}, 
      {name:"blind knife", price:3000}, 
      {name:"mythril knife", price:4000}, {name:"dagger", price:5000}, 
    ]},
    {armor:[
      {name:"buckler", price:1000}, 
      {name:"leather shield", price:2000}, 
      {name:"bronze shield", price:3000}, 
      {name:"mythril shield", price:4000}, 
      {name:"diamond shield", price:5000}, 
    ]},
  ]

  return (
    <div className="shop">
      {/* <table className="categories">
      <caption>
       The Shop
      </caption>
      <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
    </tr>
  </thead> */}

        {categories.map((category) => {
          return (
            <div className="category">
              <h3>{Object.keys(category)[0]}</h3>
              <div className="items">
                {Object.values(category)[0].map((item, i) => {
                  return (
                    <div className="item" id={i}>
                      <h4>{item.name}</h4>
                      <p>{item.price} gil</p>
                      <button onClick={addToInventory}>add</button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
    {/* </table> */}
    </div>
  )

}

function UnitDisplay({ unit }) {
  return (
    <div className="unit-display">
      {unit.unit_gender === "female" ? <img src="https://www.videogamesprites.net/FinalFantasyTactics/Party/Ramza1.gif" alt="femalePortrait"/> : <img src="https://www.videogamesprites.net/FinalFantasyTactics/Party/Ramza2.gif" alt="malePortrait"/> }
      <h1>{unit.unit_name}</h1>
      <p>{unit.id}</p>
    </div>
  )
}


function App() {
  const [money, setMoney] = useState(10_000);
  const [party, setParty] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null)
  // const [edit, setEdit] = useState(false)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        console.log("LEFT")
        const currentUnitIndex = party.findIndex(u => u.id === selectedUnit.id)
        const nextUnitIndex = currentUnitIndex - 1
        if (nextUnitIndex < 0) {
          setSelectedUnit(party[party.length - 1])
        } else {
          setSelectedUnit(party[currentUnitIndex - 1])
        }
      }

      if (e.key === "ArrowRight") {
        console.log("RIGHT")
        if (party.length > 0 && selectedUnit) {
          const currentUnitIndex = party.findIndex(u => u.id === selectedUnit.id)
          const nextUnitIndex = currentUnitIndex + 1
          if (nextUnitIndex >= party.length) {
            setSelectedUnit(party[0])
          } else {
            setSelectedUnit(party[nextUnitIndex])
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedUnit])

  function createBorderColor(unit) {
    if (unit.unit_gender === 'male') return 'blue';
    if (unit.unit_gender === 'female') return 'red';
    return 'black';
  }

  function hireUnit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    console.log("FORM", form);
    if (money < 1200) {
      return alert("You dont have enough money to hire someone");
    }

    const newUnit = { id: uuidv4() };
    for (const entry of form.entries()) {
      console.log("ENTRY", entry);
      newUnit[entry[0]] = entry[1];
    }
    if (!newUnit.unit_name) {
      return alert("You must add a name to the unit");
    }
    const unitCost = newUnit.unit_gender === 'male' ? 1500 : 1200;
    newUnit.border_color = createBorderColor(newUnit)
    setMoney((m) => m - unitCost);
    setParty((prev) => [...prev, newUnit]);

    console.log(newUnit.unit_name, "was hired");
  }
  
    return (
      <div>
        <div style={{display: "flex"}}>
        {party.map((unit) => {
          return (
            <div key={unit.id} style={{ padding: 12, borderWidth: 5, borderColor: selectedUnit?.id === unit.id ? "orange" : unit.border_color, borderStyle: 'solid' }}
              onClick={() => {
              if (selectedUnit?.id === unit.id) {
                setSelectedUnit(null)
              } else {
                setSelectedUnit(unit)
              }
            }
              }>
                {unit.unit_gender === "female" ? <img src='https://www.videogamesprites.net/FinalFantasyTactics/Party/Ramza1-S.gif' alt='female' /> : <img src='https://www.videogamesprites.net/FinalFantasyTactics/Party/Ramza2-S.gif' alt='male' /> }
              
              <h4>{unit.unit_name}</h4>
              <p>ID: {unit.id}</p>
              <div id='progressBar'>
                <div id="leftBox">
                  <h1>Hp</h1>
                  <progress id='bar' value="100" max="100"></progress>
                </div>
                <div id="rightBox">
                  <h1>773</h1>
                  <h1>/</h1>
                  <h1>773</h1>
                </div>
              </div>
            </div>
          )
        })}
        </div>
        {selectedUnit && <UnitDisplay unit={selectedUnit}/>}
        <h3>War Funds: {money} gil</h3>
        <h1>Hire a Soldier</h1>
        <form onSubmit={hireUnit}>
          <input type="text" name="unit_name" placeholder="Name your soldier" />
          <br />
          <label>
            <input type="radio" name="unit_gender" value="male" />
            <span>Male</span>
          </label>
          <br />
  
          <label>
            <input type="radio" name="unit_gender" value="female" />
            <span>Female</span>
          </label>
          <br />
          <label>
            <input type="radio" name="unit_weapon" value="dagger" />
            <span>Dagger</span>
          </label>
          <br />
          <label>
            <input type="radio" name="unit_weapon" value="sword" />
            <span>Sword</span>
          </label>
          <br />
          <label>
            <input type="checkbox" name="unit_ability" value="ability" />
            <span>Ability</span>
          </label>
          <br />
          <button type="submit">HIRE</button>
        </form>
        <Shop/>
  
      </div>
    );
}

// export default App;
export default Shop;

