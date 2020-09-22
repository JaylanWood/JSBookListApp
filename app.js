// 添加项目到表格
const form = document.querySelector("form");

form.addEventListener("submit", addItemToTable);

function addItemToTable(e) {
  e.preventDefault();

  const title = document.querySelector('input[name="Title"]');
  const author = document.querySelector('input[name="Author"]');
  const isbn = document.querySelector('input[name="ISBN"]');

  if (title.value && author.value && isbn.value) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td>${title.value}</td>
      <td>${author.value}</td>
      <td>${isbn.value}</td>
      <td><span class="delete">x</span></td>
    `;
    const tableBody = document.querySelector("tbody");
    const deleteBtn = tableRow.querySelector(".delete");
    listenToDeleteBtn(deleteBtn);
    tableBody.append(tableRow);
  } else {
    alert("Please fill out all of the items!");
  }
}

// 删除表格项

const deleteBtns = document.querySelectorAll(".delete");
Array.from(deleteBtns).forEach((btn) => {
  listenToDeleteBtn(btn);
});
function listenToDeleteBtn(btn) {
  btn.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.remove();
  });
}
