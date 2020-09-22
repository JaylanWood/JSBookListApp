window.eventHub = {
  events: {},
  emit(eventName, data) {
    for (let key in this.events) {
      if (key === eventName) {
        let fnList = this.events[key];
        fnList.map((fn) => {
          fn.call(undefined, data);
        });
      }
    }
  },
  on(eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  },
};

// header MVC
const header = {
  view: {
    el: ".header",
    template: `📖My<span>Book</span>List`,
    init(selector) {
      this.domElement = document.querySelector(selector);
      return this;
    },
    render(elementText) {
      this.domElement.innerHTML = elementText;
      return this;
    },
  },
  model: {},
  controller: {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init(this.view.el).render(this.view.template);
      return this;
    },
  },
};
header.controller.init(header.view, header.model);

// form MVC
const form = {
  view: {
    el: ".form",
    template: `
      <div class="form-item">
        <label>
          <div>Title</div>
          <input type="text" name="Title"/>
        </label>
      </div>
      <div class="form-item">
        <label>
          <div>Author</div>
          <input type="text" name="Author"/>
        </label>
      </div>
      <div class="form-item">
        <label>
          <div>ISBN#</div>
          <input type="text" name="ISBN"/>
        </label>
      </div>
      <input type="submit" value="Submit" />
    `,
    init(selector) {
      this.domElement = document.querySelector(selector);
      return this;
    },
    render(elementText) {
      this.domElement.innerHTML = elementText;
      return this;
    },
  },
  model: {
    data: [],
    addToData(item) {
      this.data.push(item);
      return this;
    },
    saveDateToLocalStorage(keyName, keyValue) {
      window.localStorage.setItem(keyName, JSON.stringify(keyValue));
      return this;
    },
    getDateFromLocalStorage(keyName) {
      if (window.localStorage.getItem(keyName)) {
        this.data = JSON.parse(window.localStorage.getItem(keyName));
      } else {
        this.data = [];
      }
      return this;
    },
  },
  controller: {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init(this.view.el).render(this.view.template);
      this.bindEvents();
      return this;
    },
    bindEvents() {
      this.view.domElement.addEventListener("submit", (eee) => {
        eee.preventDefault();
        const newBook = {
          title: document.querySelector('input[name="Title"]').value,
          author: document.querySelector('input[name="Author"]').value,
          isbn: document.querySelector('input[name="ISBN"]').value,
        };

        if (newBook.title && newBook.author && newBook.isbn) {
          this.model
            .getDateFromLocalStorage("books")
            .addToData(newBook)
            .saveDateToLocalStorage("books", this.model.data);
          window.eventHub.emit("formSubmitEvent", newBook);
        } else {
          window.eventHub.emit("formSubmitEvent");
        }
      });
    },
  },
};
form.controller.init(form.view, form.model);

// bookList MVC
const bookList = {
  view: {
    el: `.bookList`,
    template: `
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>ISBN</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `,
    init(selector) {
      this.domElement = document.querySelector(selector);
      return this;
    },
    render(elementText) {
      this.domElement.innerHTML = elementText;
      return this;
    },
    renderNewItem(book) {
      const tableBody = this.domElement.querySelector("tbody");
      const newTableRow = document.createElement("tr");
      const { title, author, isbn } = book;
      newTableRow.innerHTML = `
        <td class='title'} >${title}</td>
        <td class='author' >${author}</td>
        <td class='isbn' >${isbn}</td>
        <td><span class="delete">x</span></td>
      `;
      tableBody.append(newTableRow);
      return this;
    },
    renderFromLocalStorage(books) {
      books.forEach((book) => {
        this.renderNewItem(book);
      });
      return this;
    },
  },
  model: {
    data: [],
    saveDateToLocalStorage(keyName, keyValue) {
      window.localStorage.setItem(keyName, JSON.stringify(keyValue));
      return this;
    },
    getDateFromLocalStorage(keyName) {
      if (window.localStorage.getItem(keyName)) {
        this.data = JSON.parse(window.localStorage.getItem(keyName));
      } else {
        this.data = [];
      }
      return this;
    },
    removeBookOfData(isbn) {
      this.data = this.data.filter((book) => {
        return book.isbn != isbn;
      });
      return this;
    },
  },
  controller: {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init(this.view.el).render(this.view.template);
      this.bindEvents();
      return this;
    },
    bindEvents() {
      window.eventHub.on("formSubmitEvent", (book) => {
        if (book) {
          this.view.renderNewItem(book);
          const deleteBtns = this.view.domElement.querySelectorAll(".delete");
          const lastDeleteBtn = deleteBtns[deleteBtns.length - 1];
          this.listenToDeleteBtn(lastDeleteBtn);
        }
      });

      window.onload = () => {
        this.model.getDateFromLocalStorage("books");
        this.view.renderFromLocalStorage(this.model.data);

        const deleteBtns = this.view.domElement.querySelectorAll(".delete");
        Array.from(deleteBtns).forEach((btn) => {
          this.listenToDeleteBtn(btn);
        });
      };
    },
    listenToDeleteBtn(btn) {
      btn.addEventListener("click", (eee) => {
        const tableRow = eee.target.parentElement.parentElement;
        const isbn = tableRow.querySelector(".isbn").innerHTML;
        this.model.removeBookOfData(isbn);
        this.model.saveDateToLocalStorage("books", this.model.data);
        tableRow.remove();
      });
    },
  },
};
bookList.controller.init(bookList.view, bookList.model);

// alert MVC
const alerter = {
  view: {
    el: `.alerter`,
    template: ``,
    init() {
      this.domElement = document.querySelector(this.el);
    },
    render(data) {
      this.domElement.innerHTML = data;
    },
    show() {
      this.domElement.classList.remove("hide");
      this.domElement.classList.add("show");
    },
    hide() {
      this.domElement.classList.remove("show");
      this.domElement.classList.add("hide");
    },
    success() {
      this.domElement.classList.remove("fail");
      this.domElement.classList.add("success");
    },
    fail() {
      this.domElement.classList.remove("success");
      this.domElement.classList.add("fail");
    },
  },
  model: {
    data: {
      success: "success",
      fail: "Please fill out all of the fields!",
    },
  },
  controller: {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init();
      this.bindEvents();
    },
    bindEvents() {
      window.eventHub.on("formSubmitEvent", (status) => {
        if (status) {
          this.view.render(this.model.data.success);
          this.view.success();
        } else {
          this.view.render(this.model.data.fail);
          this.view.fail();
        }
        this.view.show();
        setTimeout(() => {
          this.view.hide();
        }, 2000);
      });
    },
  },
};
alerter.controller.init(alerter.view, alerter.model);
