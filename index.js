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
  let todayGoal;
  let todayID;
  let todayMeals;
  let breakfast;
  let lunch;
  let snack;
  let dinner;


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
      <div id="nav-bar">
        <div>
          <input id="food-search-field" class="field" type="text" placeholder="Search foods...">
        </div>
        <div class="input-block">
          <button id="add-food-button" class="button" disabled><i class="fas fa-plus"></i></button>
          <input id="new-food-name-field" class="field" type="text" placeholder="New Food Name">
          <input id="new-food-calories-field" class="field" type="integer" placeholder="New Food Calories">
        </div>
      </div>

      <div id="foods-index">
        <table>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Calories</th>
          </tr>
        <tbody id="foods-table-body">
        </tbody>
        </table>
      </div>

      <div id="diary">

        <div id="breakfast" class="meal">
          <div class="diary-meal-header">Breakfast</div>
          <table>
            <tr>
              <th></th>
              <th class="diary-food-header">Name</th>
              <th class="diary-food-header">Calories</th>
            </tr>
            <tbody id="breakfast-table-body">
            </tbody>
          </table>
        </div>

        <div id="lunch" class="meal">
          <div class="diary-meal-header">Lunch</div>
          <table>
            <tr>
              <th></th>
              <th class="diary-food-header">Name</th>
              <th class="diary-food-header">Calories</th>
            </tr>
            <tbody id="lunch-table-body">
            </tbody>
          </table>
        </div>

        <div id="snack" class="meal">
          <div class="diary-meal-header">Snack</div>
          <table>
            <tr>
              <th></th>
              <th class="diary-food-header">Name</th>
              <th class="diary-food-header">Calories</th>
            </tr>
            <tbody id="snack-table-body">
            </tbody>
          </table>
        </div>

        <div id="dinner" class="meal">
          <div class="diary-meal-header">Dinner</div>
          <table>
            <tr>
              <th></th>
              <th class="diary-food-header">Name</th>
              <th class="diary-food-header">Calories</th>
            </tr>
            <tbody id="dinner-table-body">
            </tbody>
          </table>
        </div>

        <div id="day-info"></div>

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
     return(`
       <tr class="food">
        <td>
          <button id="delete-${food.id}-button", class="delete button" onclick="deleteFood(${food.id})">
            <i class="fa fa-minus" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          ${food.name}
        </td>
        <td>
          ${food.calories}
        </td>
        <td>
          <button id="edit-food-${food.id}" class="edit button" onclick="openEdit({id: ${food.id}, calories: ${food.calories}, name: '${food.name}'})">
            <i class="far fa-edit"></i>
          </button>
        </td>
        <td id="edit-${food.id}-name-input-area" class="edit-inputs"></td>
        <td id="edit-${food.id}-calories-input-area" class="edit-inputs"></td>
      </tr>
      `)
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
    let editFoodNameArea = document.querySelector(`#edit-${food.id}-name-input-area`);
    let editFoodCaloriesArea = document.querySelector(`#edit-${food.id}-calories-input-area`);

    let editButton = document.querySelector(`#edit-food-${food.id}`);

    editFoodNameArea.innerHTML = `<input id="name-${food.id}-field" value="${food.name}">`
    editFoodCaloriesArea.innerHTML = `<input id="calories-${food.id}-field" value="${food.calories}">`

    editButton.innerHTML = '<i class="fa fa-check"></i>';
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

  function deleteMealFood(mealID, foodID) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        getDiary();
      }
      else {
        alert('Something went wrong.');
      }
    };
    xhr.open('DELETE', `https://warm-cove-64806.herokuapp.com/api/v1/meals/${mealID}/foods/${foodID}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  };

  function loadDiary(mealsData) {
console.log(mealsData)
    let breakfastEntries = mealsData[0].foods.map((food) => {
      return(`<tr class="mealfood">
        <td>
          <button id="delete-meal${mealsData[0].id}-food${food.id}-button" onclick="deleteMealFood(${mealsData[0].id}, ${food.id})">
            <i class="fa fa-minus" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          ${food.name}
        </td>
        <td>
          ${food.calories}
        </td>
        </tr >
      `)
    });
    let addBreakfastFood = `
        <tr>
          <td>
          <button id="add-breakfast-food" onclick="addMealFood(${mealsData[0].id})">
            Add Breakfast Food
          </button>
          </td>
        </tr>
    `

    breakfast.innerHTML = breakfastEntries.join(" ") + addBreakfastFood;

    let lunchEntries = mealsData[1].foods.map((food) => {
      return (`<tr class="mealfood">
        <td>
          <button id="delete-meal${mealsData[1].id}-food${food.id}-button" onclick="deleteMealFood(${mealsData[1].id}, ${food.id})">
          <i class="fa fa-minus" aria-hidden="true"></i>
          </button>
        </td>
        <td>
          ${food.name}
        </td>
        <td>
          ${food.calories}
        </td>
        </tr>
      `)
    })
    let addLunchFood = `
    <tr>
      <td>
        <button id="add-lunch-food" onclick="addMealFood(${mealsData[1].id})">
          Add Lunch Food
            </button>
      </td>
    </tr>`
    lunch.innerHTML = lunchEntries.join(" ") + addLunchFood

    let snackEntries = mealsData[2].foods.map((food) => {
      return (`<tr class="mealfood">
      <td>
        <button id="delete-meal${mealsData[2].id}-food${food.id}-button" onclick="deleteMealFood(${mealsData[2].id}, ${food.id})">
          <i class="fa fa-minus" aria-hidden="true"></i>
        </button>
      </td>
      <td>
        ${food.name}
      </td>
      <td>
        ${food.calories}
      </td>
      </tr >`)
    })
    let addSnackFood = `
    <tr>
      <td>
        <button id="add-snack-food" onclick="addMealFood(${mealsData[2].id})">
          Add Snack Food
            </button>
      </td>
    </tr>`
    snack.innerHTML = snackEntries.join(" ") + addSnackFood;

    let dinnerEntries = mealsData[3].foods.map((food) => {
      return (`<tr class="mealfood">
      <td>
        <button id="delete-meal${mealsData[3].id}-food${food.id}-button" onclick="deleteMealFood(${mealsData[3].id}, ${food.id})">
          <i class="fa fa-minus" aria-hidden="true"></i>
        </button>
      </td>
      <td>
        ${food.name}
      </td>
      <td>
        ${food.calories}
      </td>
      </tr >`)
    })
    let addDinnerFood = `
    <tr>
      <td>
        <button id="add-dinner-food" onclick="addMealFood(${mealsData[3].id})">
          Add Dinner Food
            </button>
      </td>
    </tr>`

    dinner.innerHTML = dinnerEntries.join(" ") + addDinnerFood;
  };

  function getDiary() {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let todayResponse = JSON.parse(xhr.response);
        todayGoal = todayResponse.goal
        todayID = todayResponse.id
        getTodayMeals(todayID)
      }
    };
    xhr.open('GET', `https://warm-cove-64806.herokuapp.com/api/v1/today`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  };

  function getTodayMeals(dayID) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let todayMealsResponse = JSON.parse(xhr.response);
        todayMeals = todayMealsResponse
        loadDiary(todayMeals)
      }
    };
    xhr.open('GET', `https://warm-cove-64806.herokuapp.com/api/v1/days/${todayID}/meals`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  };

  function loadFoodsAndDiary() {
    loadStructure();
    getFoods();
    foodsIndex = document.querySelector('#foods-index')
    foodsTableBody = document.querySelector('#foods-table-body')
    breakfast = document.querySelector('#breakfast-table-body')
    lunch = document.querySelector('#lunch-table-body')
    snack = document.querySelector('#snack-table-body')
    dinner = document.querySelector('#dinner-table-body')
    getDiary();
  };

  document.addEventListener('DOMContentLoaded', loadFoodsAndDiary);
}
