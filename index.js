{
  let container = document.querySelector("#container");
  let foodsIndex;
  let foodsTableBody;
  let diary;
  let newFoodName;
  let newFoodCalories;
  let addFoodButton;
  let foods;
  let foodSearch;


  function getFoods() {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let foodsResponse = JSON.parse(xhr.response);
        foods = foodsResponse;
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
        <div>
          <input id="food-search-field" class="field" type="text" placeholder="Find Food by Name">
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
    foodSearch = document.querySelector('#food-search-field');
    newFoodName.addEventListener('keyup', checkAddFoodButton);
    newFoodCalories.addEventListener('keyup', checkAddFoodButton);
    newFoodName.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        addFoodButton.click();
      }
    });
    newFoodCalories.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        addFoodButton.click();
      }
    });
    addFoodButton.addEventListener('click', newFood);
    foodSearch.addEventListener('keyup', function () {
      searchFood(foodSearch.value)
    });
  };

  function searchFood(input) {
    if(input !== "") {
      let query = input.toLowerCase();
      let filtered = foods.filter((food) => {
        let foodName = food.name.toLowerCase()
        return(foodName.includes(query))
      })
      loadFoods(filtered)
    } else {
      loadFoods(foods)
    }
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
    let food = { "name": name, "calories": calories };
    addFood(food);
    newFoodName.value = "";
    newFoodCalories.value = "";
  };

  function addFood(foodInput) {
    let xhr = new XMLHttpRequest();
    let newFoodBody = JSON.stringify(foodInput);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        getFoods();
      }
      else {
        alert('something went wrong');
      }
    };
    xhr.open('POST', `https://warm-cove-64806.herokuapp.com/api/v1/foods`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(newFoodBody);
  };


  function loadFoods(foodsIn) {
    let foodsEntries = foodsIn.map((food) => {
     return(`<tr class="food">
        <td>
          <button id="delete-${food.id}-button", class="button" onclick="deleteFood(${food.id})">
          Delete
          </button>
        </td>
        <td>
          ${food.name}
        </td>
        <td>
          ${food.calories}
        </td>
        <td>
          <button class="button" id="edit-food-${food.id}" onclick="openEdit({id: ${food.id}, calories: ${food.calories}, name: '${food.name}'})">
          Edit
          </button>
        </td>
        <td id="edit-${food.id}-input-area"></td>
      </tr>`)
    })
    foodsTableBody.innerHTML = foodsEntries.join(" ")
  };

  function deleteFood(foodID) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        getFoods();
      }
      else {
        alert('Something went wrong. Foods may not be deleted if already part of a meal.');
      }
    };
    xhr.open('DELETE', `https://warm-cove-64806.herokuapp.com/api/v1/foods/${foodID}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  };

  function openEdit(food) {
    let editFoodArea = document.querySelector(`#edit-${food.id}-input-area`);
    let editButton = document.querySelector(`#edit-food-${food.id}`);
    editFoodArea.innerHTML = `
      <input id="name-${food.id}-field" value="${food.name}">
      <input id="calories-${food.id}-field" value="${food.calories}">
    `
    editButton.innerHTML = 'Submit';
    editButton.onclick = function() {catchFood(food)};
  };

  function catchFood(food) {
    let updateNameField = document.querySelector(`#name-${food.id}-field`)
    let updateCalField = document.querySelector(`#calories-${food.id}-field`)
    let newName = updateNameField.value
    let newCal = updateCalField.value
    let newAttributes = {
      "name": newName,
      "calories": newCal
    }
    patchFood(food.id, newAttributes)
  };

  function patchFood(id, attributes) {
    let xhr = new XMLHttpRequest();
    let editFoodBody = JSON.stringify(attributes);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        getFoods();
      }
      else {
        alert('something went wrong');
      }
    };
    xhr.open('PATCH', `https://warm-cove-64806.herokuapp.com/api/v1/foods/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(editFoodBody);
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