// URL API и токен авторизации
const API_URL = 'https://api.example.com';
const API_TOKEN = 'ba67df6a-a17c-476f-8e95-bcdb75ed3958';

async function sendLeadData(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const data = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        phone: document.querySelector('#phone').value,
        email: document.querySelector('#email').value,
        box_id: 28,
        offer_id: 5,
        countryCode: 'GB',
        language: 'en',
        password: 'qwerty12',
        ip: await getUserIP(), // Получаем IP пользователя
        landingUrl: window.location.origin,
    };

    // Отправляем запрос на API
    const response = await fetch(`${API_URL}/addlead`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(`Lead added: ${result.message}`); // Показываем результат
}

// Функция для получения IP пользователя
async function getUserIP() {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip; // Возвращаем IP
}

// Функция для получения статусов лидов
async function fetchLeadStatuses(filterDate = null) {
    // Отправляем запрос на API с фильтром по дате (если указан)
    const response = await fetch(`${API_URL}/getstatuses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ date: filterDate }),
    });

    const statuses = await response.json();
    populateTable(statuses); // Обновляем таблицу данными
}

// Функция для обновления таблицы данными лидов
function populateTable(leads) {
    const tableBody = document.querySelector('#leads-table tbody');
    tableBody.innerHTML = ''; // Очищаем таблицу

    // Добавляем строки с данными для каждого лида
    leads.forEach(lead => {
        const row = `<tr>
            <td>${lead.id}</td>
            <td>${lead.email}</td>
            <td>${lead.status}</td>
            <td>${lead.ftd}</td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Добавляем обработчик отправки формы
document.querySelector('#lead-form').addEventListener('submit', sendLeadData);

// Добавляем обработчик фильтрации по дате
document.querySelector('#filter-date').addEventListener('change', (event) => {
    const date = event.target.value; // Получаем выбранную дату
    fetchLeadStatuses(date); // Получаем данные по фильтру
});

// При загрузке страницы загружаем статусы, если находимся на нужной странице
window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#view-statuses')) {
        fetchLeadStatuses();
    }
});