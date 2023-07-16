// Obtener referencias a los elementos del DOM
const crudForm = document.getElementById('crudForm');
const crudTable = document.getElementById('crudTable');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordValidationMessage = document.getElementById('passwordValidationMessage');
const deleteButtons = document.getElementsByClassName('boton3');

// Cargar los registros del localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
});

// Agregar evento de envío del formulario
crudForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validar la contraseña
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    passwordValidationMessage.textContent = passwordValidation.message;
    return;
  }

  // Validar el nombre y el correo
  const nameAndEmailValidation = validateNameAndEmail(name, email);
  if (!nameAndEmailValidation.valid) {
    passwordValidationMessage.textContent = nameAndEmailValidation.message;
    return;
  }

  // Restablecer el mensaje de validación
  passwordValidationMessage.textContent = '';

  if (submitButton.textContent === 'Agregar') {
    addRecord(name, email, password);
  } else if (submitButton.textContent === 'Guardar cambios') {
    const editIndex = parseInt(localStorage.getItem('editIndex'));
    saveEditedRecord(editIndex, name, email, password);
  }

  nameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
});

// Función para validar la contraseña
function validatePassword(password) {
  // La contraseña debe tener al menos 6 caracteres
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  // La contraseña debe contener al menos una mayúscula o un símbolo
  const pattern = /[A-Z!@#$%^&*()]/;
  if (!pattern.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una mayúscula o un símbolo.' };
  }

  // Contraseña válida
  return { valid: true };
}

// Función para validar el nombre y el correo
function validateNameAndEmail(name, email) {
  const records = JSON.parse(localStorage.getItem('records')) || [];

  // Verificar si ya existe un registro con el mismo nombre o correo, pero no en la misma posición de edición
  const editIndex = parseInt(localStorage.getItem('editIndex'));
  const duplicateName = records.some((record, index) => index !== editIndex && record.name === name);
  const duplicateEmail = records.some((record, index) => index !== editIndex && record.email === email);

  if (duplicateName) {
    return { valid: false, message: 'El nombre ya está registrado.' };
  }

  if (duplicateEmail) {
    return { valid: false, message: 'El correo ya está registrado.' };
  }

  // Validación exitosa
  return { valid: true };
}

// Función para agregar un registro
function addRecord(name, email, password) {
  const record = { name, email, password };

  let records = JSON.parse(localStorage.getItem('records')) || [];
  records.push(record);

  localStorage.setItem('records', JSON.stringify(records));

  renderTable();
}

// Función para editar un registro
function editRecord(index) {
  const records = JSON.parse(localStorage.getItem('records')) || [];

  const recordToEdit = records[index];
  nameInput.value = recordToEdit.name;
  emailInput.value = recordToEdit.email;
  passwordInput.value = recordToEdit.password;

  localStorage.setItem('editIndex', index);

  submitButton.textContent = 'Guardar cambios';

  // Deshabilitar los botones de eliminar
  Array.from(deleteButtons).forEach(button => {
    button.disabled = true;
  });
}

// Función para guardar los cambios al editar un registro
function saveEditedRecord(index, name, email, password) {
  const records = JSON.parse(localStorage.getItem('records')) || [];

  records[index].name = name;
  records[index].email = email;
  records[index].password = password;

  localStorage.setItem('records', JSON.stringify(records));

  localStorage.removeItem('editIndex');

  submitButton.textContent = 'Agregar';

  renderTable();
}

// Función para eliminar un registro
function deleteRecord(index) {
  const records = JSON.parse(localStorage.getItem('records')) || [];

  records.splice(index, 1);

  localStorage.setItem('records', JSON.stringify(records));

  renderTable();
}

// Función para renderizar la tabla en el DOM
function renderTable() {
  const records = JSON.parse(localStorage.getItem('records')) || [];

  const tbody = crudTable.querySelector('tbody');
  tbody.innerHTML = '';

  records.forEach((record, index) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = record.name;

    const emailCell = document.createElement('td');
    emailCell.textContent = record.email;

    const passwordCell = document.createElement('td');
    passwordCell.textContent = record.password;

    const actionsCell = document.createElement('td');

    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('boton2');
    editButton.addEventListener('click', () => {
      editRecord(index);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('boton3');
    deleteButton.addEventListener('click', () => {
      deleteRecord(index);
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(passwordCell);
    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });

  // Habilitar los botones de eliminar
  Array.from(deleteButtons).forEach(button => {
    button.disabled = false;
  });
}

// Obtener la referencia al botón del formulario
const submitButton = document.querySelector('#crudForm button');

// Renderizar la tabla al cargar la página
renderTable();
