let nameInput = document.getElementById("nameInput");
let priceInput = document.getElementById("priceInput");
let barcodeInput = document.getElementById("barcodeInput");
let mainBtn = document.getElementById("mainBtn");
let tableBody = document.getElementById("tableBody");

let products = JSON.parse(localStorage.getItem("products")) || [];
let currentEditIndex = null;

// حفظ أو تعديل المنتج
mainBtn.onclick = () => {
  let name = nameInput.value.trim();
  let price = priceInput.value.trim();
  let barcode = barcodeInput.value.trim();

  if (name && price && barcode) {
    let product = { Name: name, Price: price, Barcode: barcode };

    if (currentEditIndex === null) {
      // إضافة منتج جديد
      products.push(product);
    } else {
      // تعديل منتج موجود
      products[currentEditIndex] = product;
      currentEditIndex = null;
      mainBtn.textContent = "Submit"; // إعادة الزر للوضع الطبيعي
    }

    localStorage.setItem("products", JSON.stringify(products));
    clearInputs();
    renderTable();
  }
};

// مسح الحقول
function clearInputs() {
  nameInput.value = "";
  priceInput.value = "";
  barcodeInput.value = "";
}

// عرض البيانات في الجدول
function renderTable() {
  tableBody.innerHTML = "";

  products.forEach((product, index) => {
    const bgColor = index % 2 === 0 ? "bg-slate-900" : "bg-slate-800";

    tableBody.innerHTML += `
      <div class="grid grid-cols-12">
        <p class="px-2 py-1 ${bgColor} border-r-1 col-span-1">${index}</p>
        <p class="px-2 py-1 ${bgColor} border-r-1 col-span-3">${product.Name}</p>
        <p class="px-2 py-1 ${bgColor} border-r-1 col-span-2">${product.Price}</p>
        <p class="px-2 py-1 ${bgColor} border-r-1 col-span-3">${product.Barcode}</p>
        <div class="px-2 py-1 flex gap-2 ${bgColor} col-span-3">
          <p onclick="deleteProduct(${index})" class="bg-red-600 px-2 w-fit py-1 rounded-sm hover:bg-red-500 transition-all cursor-pointer">Delete</p>
          <p onclick="editProduct(${index})" class="bg-yellow-600 px-2 w-fit py-1 rounded-sm hover:bg-yellow-500 transition-all cursor-pointer">Edit</p>
        </div>
      </div>
    `;
  });
}

// حذف منتج
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderTable();
}

// تعبئة النموذج لتعديل منتج
function editProduct(index) {
  let product = products[index];
  nameInput.value = product.Name;
  priceInput.value = product.Price;
  barcodeInput.value = product.Barcode;

  currentEditIndex = index;
  mainBtn.textContent = "Update";
}

// عرض الجدول عند تحميل الصفحة
renderTable();
// ################## scan and calculate products ####################

// search
let sugList = document.getElementById("sug-list");
let searchInp = document.getElementById("searchInput");

function search() {
  let products = JSON.parse(window.localStorage.getItem("products") || "[]");
  let query = searchInp.value.trim().toLowerCase();

  sugList.innerHTML = "";

  if (query === "") {
    sugList.classList.add("hidden");
    return;
  }

  let matched = 0;
  products.forEach((product) => {
    if (
      product.Name.toLowerCase().includes(query) ||
      product.Barcode.toLowerCase().includes(query)
    ) {
      if (matched < 4) {
        let li = document.createElement("li");
        li.innerHTML = `
          <p class="hover:bg-slate-700 px-2 py-2 rounded cursor-pointer transition-colors">
            ${product.Name} | ${product.Price}
          </p>`;
        sugList.appendChild(li);
        li.addEventListener("click", () => {
          searchInp.value = product.Name;
          sugList.classList.add("hidden");
        });
        matched++;
      }
    }
  });

  if (matched > 0) {
    sugList.classList.remove("hidden");
  } else {
    sugList.classList.add("hidden");
  }
}

searchInp.addEventListener("blur", () => {
  setTimeout(() => {
    sugList.classList.add("hidden");
  }, 200); // تأخير بسيط للسماح بالنقر على العناصر
});


// ################################################

let facture = document.getElementById("factureBody");
let productsToFacture = [];
let totalp = document.getElementById("total");
let total = 0;
let b = 0;
renderFacture(productsToFacture);

function addToFacture() {
  let products = JSON.parse(window.localStorage.products);

  for (let index = 0; index < products.length; index++) {
    if (
      products[index].Name === searchInp.value ||
      products[index].Barcode === searchInp.value
    ) {
      // for add count before push
      let existing = productsToFacture.find(
        (p) => p.Name === products[index].Name
      );
      if (existing) {
        existing.Count += 1;
      } else {
        productsToFacture.push({ ...products[index], Count: 1 });
      }

      total += +products[index].Price;
    }
  }

  renderFacture(productsToFacture);
  searchInp.value = "";
}

function deletefromFacture(index) {
  total -= productsToFacture[index].Price * productsToFacture[index].Count;
  productsToFacture.splice(index, 1);
  // you need to check if total is empty or not
  renderFacture(productsToFacture);
}
// for render the table of facture
function renderFacture(products) {
  facture.innerHTML = "";
  products.forEach((product, index) => {
    let bgColor = index % 2 === 0 ? "bg-slate-900" : "bg-slate-800";

    const row = document.createElement("div");
    row.className = "grid grid-cols-16";

    row.innerHTML = `
      <p class="px-2 py-1 ${bgColor} border-r-1 col-span-1">${index + 1}</p>
      <p class="px-2 py-1 ${bgColor} border-r-1 col-span-5">${product.Name}</p>
      <p class="px-2 py-1 ${bgColor} border-r-1 col-span-3">${product.Price}</p>
      <p class="px-2 py-1 ${bgColor} border-r-1 col-span-3">${product.Count}</p>
          <div class="px-2 py-1 flex gap-2 ${bgColor} col-span-4">
          <p onclick="deletefromFacture(${index})" class="bg-red-600 px-2 w-fit py-1 rounded-sm hover:bg-red-500 transition-all cursor-pointer">Delete</p>
          <p onclick="editCount(${index})" class="bg-yellow-600 px-2 w-fit py-1 rounded-sm hover:bg-yellow-500 transition-all cursor-pointer">Edit</p>
        </div>

    `;

    facture.appendChild(row);
  });
  totalp.innerHTML = `${total} DZD`;
}
// save facture to localStorage

document.getElementById("save").onclick = function () {
  if (productsToFacture.length > 0) {
    let allFactures = JSON.parse(localStorage.getItem("AllFactures") || "[]");
    allFactures.push(productsToFacture);
    localStorage.setItem("AllFactures", JSON.stringify(allFactures));
    productsToFacture = [];
    total = 0;
    renderFacture(productsToFacture);
  }
};

// function for swap betwee tabs on click
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => {
      btn.classList.remove(
        "border-blue-500",
        "text-blue-300",
        "font-semibold",
        "bg-slate-800"
      );
    });

    // إخفاء جميع المحتويات
    tabPanels.forEach((panel) => panel.classList.add("hidden"));

    // تفعيل الزر الحالي
    button.classList.add(
      "border-blue-500",
      "text-blue-300",
      "font-semibold",
      "bg-slate-800"
    );

    // عرض التبويب المطابق
    const target = document.getElementById(button.dataset.tab);
    target.classList.remove("hidden");
  });
});


//######################

// ######################

