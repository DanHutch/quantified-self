{
  let container = document.querySelector("#container");
  let foodsIndex;
  let foodsTableBody;
  let diary;

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