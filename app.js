const last = document.querySelector(".last");
const first = document.querySelector(".first");
const addcard = document.querySelectorAll(".addcard");
const title = document.querySelector("#title");
const removebtn = document.querySelector(".flex");
const des = document.querySelector("#des");
const priority = document.querySelector("#priority");
const flex = document.querySelector(".flex");
const flex2 = document.querySelector(".flex2");
const form = document.querySelector("form");
const btn = document.querySelector("#btn");
const cards = document.querySelector(".cards");
const container = document.querySelector(".container");
const search = document.querySelector("#search");

let editId = 0;
let editTask = 0;

//status элементүүд
const todoElement = document.querySelector("#todo");
const inprogressElement = document.querySelector("#inprogress");
const stuckElement = document.querySelector("#stuck");
const doneElement = document.querySelector("#done");

//id random тоо олох
const aid = () => {
  return Date.now().toString(36) + Math.random().toString(36);
};
// SAVE DATA

const savedata = () => {
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("id", id);
};
//search
let searchValue = "";
const setSearchValue = (newSearchValue) => {
  searchValue = newSearchValue;
  render();
};

//Картуудыг устгах X
flex2.addEventListener("click", () => {
  last.style.display = "none";
});

//Адд карт товчлуур дээр дарах үед
addcard.forEach((add) => {
  add.addEventListener("click", () => {
    last.style.display = "flex";
  });
});
// SAVE DATA
let id = localStorage.getItem("id") ?? 0;
let data = JSON.parse(localStorage.getItem("data")) ?? [];

//SETDATA
const setData = (arr) => {
  data = arr;
  savedata();
  render();
};

// RENDER
const render = () => {
  // console.log(data);

  todoElement.innerHTML = "";
  inprogressElement.innerHTML = "";
  stuckElement.innerHTML = "";
  doneElement.innerHTML = "";

  let todo = [];
  let inprogress = [];
  let stuck = [];
  let done = [];

  const sorted = data.sort((a, b) => {
    const sa = a.priority === "high" ? 0 : a.priority === "medium" ? 1 : 2;
    const sb = b.priority === "high" ? 0 : b.priority === "medium" ? 1 : 2;
    return sa - sb;
  });

  sorted
    .filter((item) => {
      return item.title.includes(searchValue);
    })
    .forEach((item) => {
      if (item.status === "todo") {
        todo.push(Card(item));
      } else if (item.status === "inprogress") {
        inprogress.push(Card(item));
      } else if (item.status === "stuck") {
        stuck.push(Card(item));
      } else if (item.status === "done") {
        done.push(Card(item));
      }
    });
  todo.forEach((item) => {
    todoElement.innerHTML += item;
  });

  inprogress.forEach((item) => {
    inprogressElement.innerHTML += item;
  });

  stuck.forEach((item) => {
    stuckElement.innerHTML += item;
  });

  done.forEach((item) => {
    doneElement.innerHTML += item;
  });

  // DRAG START
  const card = document.querySelectorAll(".card");
  card.forEach((drag) => {
    drag.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text", e.target.id);
    });
  });
  // REMOVE CARD
  const remove = document.querySelectorAll(".remove");
  remove.forEach((remove) => {
    remove.addEventListener("click", () => {
      const id = remove.id;
      // console.log("id=", id);
      const newData = data.filter((item) => {
        return item.id !== id;
      });
      setData(newData);
    });
  });

  // CLICK TO DONE
  const check = document.querySelectorAll(".check");
  check.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.id;
      const newData = data.map((item) => {
        if (item.id === id) {
          item.status = "done";
        }
        return item;
      });
      setData(newData);
      savedata();
    });
  });

  const edit = document.querySelectorAll(".edit");
  edit.forEach((e) => {
    e.addEventListener("click", () => {
      editId = e.parentNode.parentNode.id;
      // console.log(editId);
      const editTitle =
        e.parentNode.parentNode.querySelector(".title").textContent;

      const editDesc =
        e.parentNode.parentNode.querySelector(".card2").textContent;

      const editPrio =
        e.parentNode.parentNode.querySelector(".priority").textContent;

      const editStatus =
        e.parentNode.parentNode.querySelector(".status").textContent;
      // console.log(editStatus, editDesc, editPrio, editTitle);

      last.style.display = "flex";
      last.querySelector("#title").value = editTitle;
      last.querySelector("#des").value = editDesc;
      last.querySelector("#status").value = editStatus;
      last.querySelector("#priority").value = editPrio;

      editTask = 1;
    });
  });

  // COUNT
  document.querySelector("#todo-count").innerHTML = todo.length;
  document.querySelector("#inprogress-count").innerHTML = inprogress.length;
  document.querySelector("#stuck-count").innerHTML = stuck.length;
  document.querySelector("#done-count").innerHTML = done.length;
};

// PROPS
const Card = (props) => {
  return `
  <div class="card" id="${props.id}" draggable="true">
  <div>
    <img class="ch checked" id="${props.id}" src="./checkbox-5-512.png" alt="" />
    <img class="ch check" id="${props.id}" src="./uncheck-512.png" alt="" />
  </div>
  <div class="edit-father">
    <img class="edit" id="${props.id}" src="./pen-to-square-regular.svg" alt="" />
  </div>
  <h3 class="title">${props.title}</h3>
  <span class="remove" id="${props.id}">\u00d7</span>
  <p class="card2">${props.des}</p>
  <p class="status">${props.status}</p>
  <p class="priority">${props.priority}</p>
</div>

  `;
};

render();
//FORM & SUBMIT

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (editTask == 0) {
    const { elements } = event.target;
    // console.log(elements);
    const title = elements["title"].value;
    const des = elements["des"].value;
    const status = elements.status.value;
    const priority = elements.priority.value;
    const newData = [...data, { title, des, status, id: "id" + id, priority }];
    id++;
    setData(newData);

    last.style.display = "none";
  } else {
    let card = document.querySelectorAll(".card");
    card.forEach(() => {
      const newData = data.map((item) => {
        if (item.id == editId) {
          item.title = form.elements.title.value;
          item.des = form.elements.des.value;
          item.status = form.elements.status.value;
          item.priority = form.elements.priority.value;
        }
        return item;
      });
      setData(newData);
    });
  }
  id++;
  last.style.display = "none";
});

// DRAG DROP
const card = document.querySelectorAll(".card");
const content = document.querySelectorAll(".content");
content.forEach((content) => {
  content.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  content.addEventListener("drop", (event) => {
    const status = content.id;
    const id = event.dataTransfer.getData("text");
    setData(
      data.map((item) => {
        if (item.id === id) {
          item.status = status;
        }
        return item;
      })
    );
  });
});

//SEARCH
search.addEventListener("input", (event) => {
  setSearchValue(event.target.value);
});
