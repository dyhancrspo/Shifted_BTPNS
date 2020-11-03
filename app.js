var userLogin = {},
  userList = [];

var getAll = function (attr) {
  return document.querySelectorAll(attr);
};

var get = function (attr) {
  return document.querySelector(attr);
};

var onMenuClicked = function (e) {
  var target = e.target.getAttribute("content");
  hideLastPage();
  showPage(target);
};

var hideLastPage = function () {
  var menu = get(".navbar-list.active");
  var page = get(".body-content.active");
  menu.classList.remove("active");
  page.classList.remove("active");
};

var showPage = function (target) {
  var menu = get(".navbar-list[content='" + target + "']");
  var page = get(".body-content[menu='" + target + "']");
  menu.classList.add("active");
  page.classList.add("active");

  // if (cb) cb()
  if (target == "home") renderHome();
};

var register = function () {
  var form = document.register;
  var name = form.nama.value;
  var email = form.email.value;
  var password = form.password.value;
  var gender = form.jk.value;
  var id = form.id.value; // admin@admin.com
  var idxUser = userList.length;

  if (name && email && password && gender) {
    var used = false;

    for (let index = 0; index < userList.length; index++) {
      var user = userList[index];

      if (email == user.email) {
        if (id) {
          idxUser = index;
          break;
        }

        used = true;
        break;
      }
    }

    if (used) {
      alert("Email telah digunakan!!");
      return;
    }

    var dataRegister = {
      name: name,
      email: email,
      password: password,
      gender: gender,
    };
    // userList.push(dataRegister)
    userList.splice(idxUser, 1, dataRegister);
    alert("Data telah tersimpan!!");
    form.reset();
    form.email.readOnly = false;
  } else alert("Harap lengkapi data Anda!!");
};

var doLogin = function () {
  var form = document.login;
  var email = form.email.value;
  var password = form.password.value;

  if (email && password) {
    var userLogin = userList.find(
      (user) => email == user.email && password == user.password
    );
    // var statusLogin = userList.some(user => (email == user.email && password == user.password))
    // for (let index = 0; index < userList.length; index++) {
    //     var user = userList[index];

    //     if (email == user.email && password == user.password) {
    //         statusLogin = true
    //         userLogin = user
    //         break
    //     }
    // }

    console.log("filter: ", userLogin);

    if (userLogin) {
      alert("Sukses login!!\nHai " + userLogin.name);
      form.reset();
      afterLogin();
    } else {
      alert("Email dan Password salah!!");
    }
  } else alert("Email dan Password tidak boleh kosong!!");
};

var afterLogin = function () {
  get(".navbar-list[content='keluar']").classList.remove("hidden");
  get(".navbar-list[content='masuk']").classList.add("hidden");
  hideLastPage();
  showPage("home");
};

var doLogout = function () {
  userLogin = {};
  get(".navbar-list[content='keluar']").classList.add("hidden");
  get(".navbar-list[content='masuk']").classList.remove("hidden");
};

var renderHome = async () => {
  var tableUsers = get("table[data='user']");
  var newTR = get("table[data='user'] tr").innerHTML;

  await fetch("https://jsonplaceholder.typicode.com/comments")
    .then((response) => response.json())
    .then((data) => {
      userList = data;
      console.info("userList: ", userList);
    })
    .catch((err) => console.warn("err: ", err))
    .finally(() => console.info("finally..."));

  console.warn("userList: ", userList);
  pagination(1);
  paginationButton();
};

var pagination = (page) => {
  var select = document.getElementById("select").value;
  console.log(select);
  let rowPerPage = select;
  // const rowPerPage = 10;
  let header = get("table[data='user'] tr:first-child").innerHTML;
  let table = get("table[data='user']");
  5;
  let no = (page - 1) * rowPerPage + 1;
  var newTr2 = userList
    .slice((page - 1) * rowPerPage, page * rowPerPage)
    .map((user, index) => {
      return `
        <tr>
            <td align="right">${no++}</td>
            <td>${user.name}</td>
            <td>
                ${
                  user.gender == "L"
                    ? "Laki-laki"
                    : user.gender == "P"
                    ? "Perempuan"
                    : ""
                }
            </td>
            <td align="center">
                <button onclick="editUser('${user.email}')">Edit</button>
                <button>Delete</button>
            </td>
        </tr>
    `;
    });
  paginationButton(page);
  table.innerHTML = header + newTr2.join("");
};

// var paginationButton = () => {
//   const rowPerPage = 10;
//   const totalUsers = userList.length;
//   const totalButtonPage = Math.ceil(totalUsers / rowPerPage);

//   get(
//     ".page-container"
//   ).innerHTML = `<div class="page-no" onclick="pagination(1)">First</div>`;
//   for (let i = 1; i <= totalButtonPage; i++) {
//     get(".page-container").innerHTML += `
//         <div class="page-no" onclick="pagination(${i})">${i}</div>
//     `;
//   }
//   get(
//     ".page-container"
//   ).innerHTML += `<div class="page-no" onclick="pagination(${totalButtonPage})">Last</div>`;
// };

var paginationButton = (page) => {
  var select = document.getElementById("select").value;
  console.log(select);
  let rowPerPage = select;
  // const rowPerPage = 10;
  const totalUsers = userList.length;
  let totalButtonPage = Math.ceil(totalUsers / rowPerPage);
  var last = page + 2 > totalButtonPage ? totalButtonPage : page + 2;
  get(
    ".page-container"
  ).innerHTML = `<div  class="page-no" onclick="pagination(1)">First</div>`;
  if (page >= 3) {
    for (let i = page - 2; i <= last; i++) {
      if (i == page) {
        get(".page-container").innerHTML += `
            <div style="border: solid 1px black;" class="page-no"  onclick="pagination(${i})">${i}</div>
        `;
      } else {
        get(".page-container").innerHTML += `
            <div class="page-no" onclick="pagination(${i})">${i}</div>
        `;
      }
    }
    get(
      ".page-container"
    ).innerHTML += `<div class="page-no" onclick="pagination(${totalButtonPage})">Last</div>`;
  } else {
    var last = page + 2 > totalButtonPage ? totalButtonPage : page + 3;
    get(
      ".page-container"
    ).innerHTML = `<div  class="page-no" onclick="pagination(1)">First</div>`;
    for (let i = page - 0; i <= last; i++) {
      if (i == page) {
        get(".page-container").innerHTML += `
            <div style="border: solid 1px black;" class="page-no"  onclick="pagination(${i})">${i}</div>
        `;
      } else {
        get(".page-container").innerHTML += `
            <div class="page-no" onclick="pagination(${i})">${i}</div>
        `;
      }
    }
    get(
      ".page-container"
    ).innerHTML += `<div class="page-no" onclick="pagination(${totalButtonPage})">Last</div>`;
  }

  console.log(getAll(".page-no"));
};

var editUser = function (email) {
  console.log(email);
  hideLastPage();
  showPage("daftar");

  var selectedUser = "";
  for (let index = 0; index < userList.length; index++) {
    const user = userList[index];

    if (user.email == email) {
      selectedUser = user;
      break;
    }
  }

  if (selectedUser) {
    var form = document.register;
    form.nama.value = selectedUser.name;
    form.email.value = selectedUser.email;
    form.email.readOnly = true;
    form.password.value = selectedUser.password;
    form.jk.value = selectedUser.gender;
    form.id.value = selectedUser.email;
  } else alert("Data tidak dapat ditemukan!!");
};

var init = function () {
  // add event to list menu
  var navbarList = getAll(".navbar-list:not([content='keluar'])");
  for (i = 0; i < navbarList.length; i++) {
    var element = navbarList[i];
    element.addEventListener("click", onMenuClicked);
  }

  // add event to logout menu
  var buttonReg = get(".navbar-list[content='keluar']");
  buttonReg.addEventListener("click", doLogout);

  // add event to register button
  var buttonReg = get("#buttonRegister");
  buttonReg.addEventListener("click", register);

  // add event to login button
  var buttonReg = get("#buttonLogin");
  buttonReg.addEventListener("click", doLogin);

  // add event to pagination no
  // var buttonPage = getAll(".page-no")
  // for (i = 0; i < buttonPage.length; i++) {
  //     var element = buttonPage[i];
  //     element.setAttribute("onclick", `pagination(${i + 1})`)
  // }

  showPage("home");
};

init();

const promiseA = new Promise((resolve, reject) => {
  // resolutionFunc(777);
  var a = 1 + 1;

  setTimeout(() => resolve(a), 10000);

  if (a == 2) resolve(a);
  else reject("Salah");
});
// At this point, "promiseA" is already settled.
promiseA.then((val) => console.log("asynchronous logging has val:", val));
promiseA.catch((err) => console.warn("PromiseA err:", err));
promiseA.finally(() => console.log("Finally.."));
console.log("immediate logging");
