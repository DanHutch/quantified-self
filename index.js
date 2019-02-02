{
  let container = document.querySelector("#container");
  let foodsIndex;
  let foodsTableBody;
  let diary;
  let newFoodName;
  let newFoodCalories;
  let addFoodButton;

  function getFoods() {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let foodsResponse = JSON.parse(xhr.response);
        loadFoods(foodsResponse)
      }
    };
    xhr.open('GET', `https://warm-cove-64806.herokuapp.com/api/v1/foods`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  };

  function loadStructure() {
    container.innerHTML = `
      <div id="foods-index">
        <div class="input-block">
          <input id="new-food-name-field" class="field" type="text" placeholder="New Food Name">
          <input id="new-food-calories-field" class="field" type="integer" placeholder="New Food Calories">
          <button id="add-food-button" class="button" disabled>Add New Food</button>
        </div>
        <table>
          <tr>
            <th>Name</th>
            <th>Calories</th>
          </tr>
        <tbody id="foods-table-body">
        </tbody>
        </table>
      </div>
      <div id="diary">
        Hello Diary!
      </div>
    `
    addFoodButton = document.querySelector('#add-food-button');
    newFoodName = document.querySelector('#new-food-name-field');
    newFoodCalories = document.querySelector('#new-food-calories-field');
    newFoodName.addEventListener('keyup', checkAddFoodButton);
    newFoodCalories.addEventListener('keyup', checkAddFoodButton);
    addFoodButton.addEventListener('click', newFood);
  };

  function checkAddFoodButton() {
    if (newFoodName.value !== "" && newFoodCalories.value !== "") {
      addFoodButton.disabled = false;
      addFoodButton.classList.add("active");
    }
    else {
      addFoodButton.disabled = true;
      addFoodButton.classList.remove("active");
    }
  };

  function newFood() {
    let name = newFoodName.value;
    let calories = newFoodCalories.value;
    let food = { "name": name, "calories": calories }
    addFood(food)
  };

  function addFood(foodInput) {
    let xhr = new XMLHttpRequest();
    let newFoodBody = JSON.stringify(foodInput)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        getFoods()
      }
      else {
        alert('something went wrong')
      }
    };
    xhr.open('POST', `https://warm-cove-64806.herokuapp.com/api/v1/foods`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      newFoodBody
    );
  };


  function loadFoods(foodsResponse) {
    console.log(foodsResponse)
    let foodsEntries = foodsResponse.map((food) => {
     return(`<tr class="food">
        <td>
          ${food.name}
        </td>
        <td>
          ${food.calories}
        </td>
      </tr>`)
    })
    foodsTableBody.innerHTML = foodsEntries.join(" ")
  };


  function loadFoodsAndDiary() {
    loadStructure();
    getFoods();
    foodsIndex = document.querySelector('#foods-index')
    foodsTableBody = document.querySelector('#foods-table-body')
    // load diary function will be invoked here
  };

  document.addEventListener('DOMContentLoaded', loadFoodsAndDiary);
}