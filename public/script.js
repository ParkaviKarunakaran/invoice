// function fetchItemDetails() {
//     const itemId = document.getElementById('itemId').value;

//     fetch(`/api/invoice/item/${itemId}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.error) {
//                 alert(data.error);
//                 return;
//             }

//             const tbody = document.querySelector('#invoiceTable tbody');
//             tbody.innerHTML = ''; // Clear existing rows except the input row

//             data.forEach(item => {
//                 const row = document.createElement('tr');

//                 row.innerHTML = `
//                     <td><input type="number" class="form-control" value="${item.item_id}" readonly></td>
//                     <td><input type="text" class="form-control" value="${item.name}" readonly></td>
//                     <td><input type="text" class="form-control" value="${item.description}" readonly></td>
//                     <td><input type="number" class="form-control" value="${item.price}" readonly></td>
//                     <td><input type="number" class="form-control" value="${item.cgst || 0}" onchange="calculateTotal(this)"></td>
//                     <td><input type="number" class="form-control" value="${item.sgst || 0}" onchange="calculateTotal(this)"></td>
//                     <td><input type="number" class="form-control" value="${item.discount || 0}" onchange="calculateTotal(this)"></td>
//                     <td><input class="form-control" onchange="calculateTotal(this)"></td>
//                     <td><input class="form-control" readonly></td>
//                 `;

//                 tbody.appendChild(row);
//             });

//             // Append subtotal row
//             const subtotalRow = document.createElement('tr');
//             subtotalRow.innerHTML = `
//                 <td colspan="8" class="text-right"><strong>Subtotal</strong></td>
//                 <td><input id="subtotal" class="form-control" readonly></td>
//             `;
//             tbody.appendChild(subtotalRow);
//         })
//         .catch(error => {
//             console.error('Error fetching item details:', error);
//         });
// }

// function calculateTotal(inputElement) {
//     const row = inputElement.closest('tr');
//     const price = parseFloat(row.cells[3].querySelector('input').value) || 0;
//     const cgstRate = parseFloat(row.cells[4].querySelector('input').value) || 0;
//     const sgstRate = parseFloat(row.cells[5].querySelector('input').value) || 0;
//     const discountRate = parseFloat(row.cells[6].querySelector('input').value) || 0;
//     const quantity = parseFloat(row.cells[7].querySelector('input').value) || 0;

//     const discount = (price * discountRate) / 100;
//     const priceAfterDiscount = price - discount;
//     const cgst = (priceAfterDiscount * cgstRate) / 100;
//     const sgst = (priceAfterDiscount * sgstRate) / 100;
//     const total = (priceAfterDiscount + cgst + sgst) * quantity;

//     row.cells[8].querySelector('input').value = total.toFixed(2);
//     calculateSubtotal();
// }

// function calculateSubtotal() {
//     const rows = document.querySelectorAll('#invoiceTable tbody tr:not(:last-child)'); //Exclude subtotal row
//     let subtotal = 0;

//     rows.forEach(row => {
//         const total = parseFloat(row.cells[8].querySelector('input').value) || 0;
//         subtotal += total;
//     });

//     document.getElementById('subtotal').value = subtotal.toFixed(2);
// }

document
  .getElementById("addItemForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const newItem = {
      item_id: document.getElementById("newItemId").value,
      name: document.getElementById("newItemName").value,
      description: document.getElementById("newItemDescription").value,
      price: document.getElementById("newItemPrice").value,
      // cgst: document.getElementById('newItemCgst').value,
      // sgst: document.getElementById('newItemSgst').value,
      // discount: document.getElementById('newItemDiscount').value
    };

    fetch("/api/invoice/item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then(response => response.json())
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Item added successfully");
          document.getElementById("addItemForm").reset();
          $("#addItemModal").modal("hide"); // Hide modal after successful submission
          // Optionally, you may want to refresh the table or perform other actions here
        }
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
  });

function fetchItemDetails() {
  const itemId = document.getElementById("itemId").value;

  fetch(`/api/invoice/item/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      const tbody = document.querySelector("#invoiceTable tbody");
      tbody.innerHTML = ""; // Clear existing rows except the input row

      data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                        <td><input type="number" class="form-control" value="${
                          item.item_id
                        }" readonly></td>
                        <td><input type="text" class="form-control" value="${
                          item.name
                        }" readonly></td>
                        <td><input type="text" class="form-control" value="${
                          item.description
                        }" readonly></td>
                        <td><input type="number" class="form-control" value="${
                          item.price
                        }" readonly></td>
                        <td><input class="form-control" value="${
                          item.cgst || 0
                        }" onchange="calculateTotal(this)"></td>
                        <td><input class="form-control" value="${
                          item.sgst || 0
                        }" onchange="calculateTotal(this)"></td>
                        <td><input class="form-control" value="${
                          item.discount || 0
                        }" onchange="calculateTotal(this)"></td>
                        <td><input type="number" class="form-control" onchange="calculateTotal(this)"></td>
                        <td><input type="number" class="form-control" readonly></td>
                    `;

        tbody.appendChild(row);
      });

      // Append subtotal row
      const subtotalRow = document.createElement("tr");
      subtotalRow.innerHTML = `
                    <td colspan="8" class="text-right"><strong>Subtotal</strong></td>
                    <td><input id="subtotal" class="form-control" readonly></td>
                `;
      tbody.appendChild(subtotalRow);
    })
    .catch((error) => {
      console.error("Error fetching item details:", error);
    });
}

function calculateTotal(inputElement) {
  const row = inputElement.closest("tr");
  const price = parseFloat(row.cells[3].querySelector("input").value) || 0;
  const cgstRate = parseFloat(row.cells[4].querySelector("input").value) || 0;
  const sgstRate = parseFloat(row.cells[5].querySelector("input").value) || 0;
  const discountRate =
    parseFloat(row.cells[6].querySelector("input").value) || 0;
  const quantity = parseFloat(row.cells[7].querySelector("input").value) || 0;

  const cgst = (price * cgstRate) / 100;
  const sgst = (price * sgstRate) / 100;
  const discount = (price * discountRate) / 100;
  const total = (price + cgst + sgst - discount) * quantity;

  row.cells[8].querySelector("input").value = total.toFixed(2);

  let subtotal = 0;
  const rows = document.querySelectorAll("#invoiceTable tbody tr");
  rows.forEach((row) => {
    const totalCell = row.cells[8]?.querySelector("input");
    if (totalCell && !isNaN(parseFloat(totalCell.value))) {
      subtotal += parseFloat(totalCell.value);
    }
  });
  document.getElementById("subtotal").value = subtotal.toFixed(2);
}
