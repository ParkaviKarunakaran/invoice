document.getElementById("addItemForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const newItem = {
        item_id: document.getElementById("newItemId").value,
        name: document.getElementById("newItemName").value,
        description: document.getElementById("newItemDescription").value,
        price: parseFloat(document.getElementById("newItemPrice").value) || 0,
        cgst: parseFloat(document.getElementById("newItemCgst").value) || 0,
        sgst: parseFloat(document.getElementById("newItemSgst").value) || 0,
    };
  
    fetch("/api/invoice/item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                alert("Item added successfully");
                document.getElementById("addItemForm").reset();
                $("#addItemModal").modal("hide"); // Hide modal after successful submission
                fetchItemDetails(); // Refresh the table
            }
        })
        .catch((error) => {
            console.error("Error adding item:", error);
        });
  });
  
  
function fetchItemDetails() {
    const searchTerm = document.getElementById('searchTerm').value;
    fetch(`/api/invoice/item?search=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('invoiceTableBody');
            // tbody.innerHTML = ''; // Clear existing rows

            if (data.length > 0) {
                data.sort((a, b) => a.item_id - b.item_id); // Sort items by item_id in ascending order
                data.forEach(item => {
                    const tableRow = `
                        <tr>
                            <td>${item.item_id}</td>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${item.cgst.toFixed(2)}</td>
                            <td>${item.sgst.toFixed(2)}</td>
                            <td>
                                <select class="form-control discountType" onchange="calculateTotal(this)">
                                    <option value="percent">%</option>
                                    <option value="rupees">₹</option>
                                </select>
                            </td>
                            <td><input onchange="calculateTotal(this)" /></td>
                            <td><input onchange="calculateTotal(this)" /></td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editItem(this)">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteItem(this)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                            <td><span class="total">0.00</span></td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', tableRow);
                });

                appendTotalRows();
            } else {
                alert('Item not found');
            }

            const searchInput = document.getElementById('searchTerm');
            searchInput.value = '';
            searchInput.placeholder = 'Enter item id or name';
            searchInput.focus();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching item details');

            const searchInput = document.getElementById('searchTerm');
            searchInput.value = '';
            searchInput.placeholder = 'Enter item id or name';
            searchInput.focus();
        });
}

function editItem(button) {
    const row = button.closest('tr');
    const itemId = row.cells[0].innerText;

    // Populate the form fields with current values
    document.getElementById('editItemId').value = itemId;
    document.getElementById('editItemName').value = row.cells[1].innerText;
    document.getElementById('editItemDescription').value = row.cells[2].innerText;
    document.getElementById('editItemPrice').value = parseFloat(row.cells[3].innerText);
    document.getElementById('editItemCgst').value = parseFloat(row.cells[4].innerText);
    document.getElementById('editItemSgst').value = parseFloat(row.cells[5].innerText);

    $('#editItemModal').modal('show');
}

document.getElementById('editItemForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const itemId = document.getElementById('editItemId').value;
    const updatedItem = {
        name: document.getElementById('editItemName').value,
        description: document.getElementById('editItemDescription').value,
        price: parseFloat(document.getElementById('editItemPrice').value) || 0,
        cgst: parseFloat(document.getElementById('editItemCgst').value) || 0,
        sgst: parseFloat(document.getElementById('editItemSgst').value) || 0,
    };

    fetch(`/api/invoice/item/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Item updated successfully');
            $('#editItemModal').modal('hide');
            // Update the HTML table directly
            const rows = document.querySelectorAll("#invoiceTableBody tr");
            rows.forEach(row => {
                if (row.cells[0].innerText === itemId) {
                    row.cells[1].innerText = updatedItem.name;
                    row.cells[2].innerText = updatedItem.description;
                    row.cells[3].innerText = updatedItem.price.toFixed(2);
                    row.cells[4].innerText = updatedItem.cgst.toFixed(2);
                    row.cells[5].innerText = updatedItem.sgst.toFixed(2);
                    calculateTotal(row.cells[7].querySelector('input'));
                }
            });
            // fetchItemDetails(); // Refresh the table
        })
        .catch(error => {
            console.error('Error updating item:', error);
        });
});


function deleteItem(button) {
    const row = button.closest('tr');
    const itemId = row.cells[0].innerText;

    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/invoice/item/${itemId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert('Item deleted successfully');
                fetchItemDetails(); // Refresh the table
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
    }
}
  
  function appendTotalRows() {
    const tbody = document.getElementById('invoiceTableBody');
    const existingSubtotalRow = document.getElementById("subtotalRow");
    const existingDiscountRow = document.getElementById("discountRow");
    const existingFinalTotalRow = document.getElementById("finalTotalRow");
  
    if (existingSubtotalRow) existingSubtotalRow.remove();
    if (existingDiscountRow) existingDiscountRow.remove();
    if (existingFinalTotalRow) existingFinalTotalRow.remove();
  
    const subtotalRow = document.createElement('tr');
    subtotalRow.id = "subtotalRow";
    subtotalRow.innerHTML = `
        <td colspan="10" class="text-right"><strong>Subtotal</strong></td>
        <td><input id="subtotal" class="form-control" readonly /></td>
    `;
    tbody.appendChild(subtotalRow);
  
    const discountRow = document.createElement('tr');
    discountRow.id = "discountRow";
    discountRow.innerHTML = `
        <td colspan="10" class="text-right"><strong>Discount</strong></td>
        <td>
            <div class="input-group">
                <input id="overallDiscount" class="form-control" placeholder="Enter discount" onchange="updateTotals()" />
                <select id="discountType" class="form-control" onchange="updateTotals()">
                    <option value="percent">%</option>
                    <option value="rupees">₹</option>
                </select>
            </div>
        </td>
    `;
    tbody.appendChild(discountRow);
  
    const finalTotalRow = document.createElement('tr');
    finalTotalRow.id = "finalTotalRow";
    finalTotalRow.innerHTML = `
        <td colspan="10" class="text-right"><strong>Final Total</strong></td>
        <td><input id="finalTotal" class="form-control" readonly /></td>
    `;
    tbody.appendChild(finalTotalRow);
  
    updateTotals();
  }
  
  function calculateTotal(inputElement) {
    const row = inputElement.closest("tr");
    const price = parseFloat(row.cells[3].innerText) || 0;
    const cgstRate = parseFloat(row.cells[4].innerText) || 0;
    const sgstRate = parseFloat(row.cells[5].innerText) || 0;
    const discountRate = parseFloat(row.cells[7].querySelector("input").value) || 0;
    const quantity = parseFloat(row.cells[8].querySelector("input").value) || 0;
    const discountType = row.cells[6].querySelector("select").value;
  
    const cgst = (price * cgstRate) / 100;
    const sgst = (price * sgstRate) / 100;
  
    let discount = 0;
    if (discountType === 'percent') {
        discount = (price * discountRate) / 100;
    } else if (discountType === 'rupees') {
        discount = discountRate;
    }
  
    const total = (price + cgst + sgst - discount) * quantity;
  
    row.cells[10].querySelector(".total").innerText = total.toFixed(2);
  
    updateTotals();
  }
  
  function updateTotals() {
    const subtotalElement = document.getElementById("subtotal");
    const finalTotalElement = document.getElementById("finalTotal");
    const overallDiscountElement = document.getElementById("overallDiscount");
    const discountTypeElement = document.getElementById("discountType");
  
    if (!subtotalElement || !finalTotalElement || !overallDiscountElement || !discountTypeElement) {
        console.error('Required elements for totals are missing.');
        return;
    }
  
    let subtotal = 0;
    const rows = document.querySelectorAll("#invoiceTable tbody tr:not(#subtotalRow):not(#discountRow):not(#finalTotalRow)");
    rows.forEach((row) => {
        const totalCell = row.cells[10]?.querySelector(".total");
        if (totalCell && !isNaN(parseFloat(totalCell.innerText))) {
            subtotal += parseFloat(totalCell.innerText);
        }
    });
  
    const discount = parseFloat(overallDiscountElement.value) || 0;
    const discountType = discountTypeElement.value;
  
    let discountAmount = 0;
    if (discountType === 'percent') {
        discountAmount = (subtotal * discount) / 100;
    } else if (discountType === 'rupees') {
        discountAmount = discount;
    }
  
    const finalTotal = subtotal - discountAmount;
  
    subtotalElement.value = subtotal.toFixed(2);
    finalTotalElement.value = finalTotal.toFixed(2);
  }
  