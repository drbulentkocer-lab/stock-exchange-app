// Time Zones List
const TIMEZONES = [
    // Americas
    { name: 'New York', tz: 'America/New_York', offset: 'EST' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles', offset: 'PST' },
    { name: 'Chicago', tz: 'America/Chicago', offset: 'CST' },
    { name: 'Denver', tz: 'America/Denver', offset: 'MST' },
    { name: 'Mexico City', tz: 'America/Mexico_City', offset: 'CST' },
    { name: 'Toronto', tz: 'America/Toronto', offset: 'EST' },
    { name: 'São Paulo', tz: 'America/Sao_Paulo', offset: 'BRT' },
    { name: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires', offset: 'ART' },

    // Europe
    { name: 'London', tz: 'Europe/London', offset: 'GMT' },
    { name: 'Paris', tz: 'Europe/Paris', offset: 'CET' },
    { name: 'Berlin', tz: 'Europe/Berlin', offset: 'CET' },
    { name: 'Amsterdam', tz: 'Europe/Amsterdam', offset: 'CET' },
    { name: 'Madrid', tz: 'Europe/Madrid', offset: 'CET' },
    { name: 'Rome', tz: 'Europe/Rome', offset: 'CET' },
    { name: 'Istanbul', tz: 'Europe/Istanbul', offset: 'EET' },
    { name: 'Moscow', tz: 'Europe/Moscow', offset: 'MSK' },

    // Asia
    { name: 'Dubai', tz: 'Asia/Dubai', offset: 'GST' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', offset: 'ICT' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong', offset: 'HKT' },
    { name: 'Singapore', tz: 'Asia/Singapore', offset: 'SGT' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', offset: 'JST' },
    { name: 'Seoul', tz: 'Asia/Seoul', offset: 'KST' },
    { name: 'Shanghai', tz: 'Asia/Shanghai', offset: 'CST' },
    { name: 'New Delhi', tz: 'Asia/Kolkata', offset: 'IST' },
    { name: 'Manila', tz: 'Asia/Manila', offset: 'PHT' },

    // Africa
    { name: 'Cairo', tz: 'Africa/Cairo', offset: 'EET' },
    { name: 'Johannesburg', tz: 'Africa/Johannesburg', offset: 'SAST' },
    { name: 'Lagos', tz: 'Africa/Lagos', offset: 'WAT' },

    // Australia & Pacific
    { name: 'Sydney', tz: 'Australia/Sydney', offset: 'AEDT' },
    { name: 'Melbourne', tz: 'Australia/Melbourne', offset: 'AEDT' },
    { name: 'Perth', tz: 'Australia/Perth', offset: 'AWST' },
    { name: 'Auckland', tz: 'Pacific/Auckland', offset: 'NZDT' },
    { name: 'Fiji', tz: 'Pacific/Fiji', offset: 'FJT' },
];

// State Management
let selectedTimezones = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    populateTimezoneSelector();
    setupEventListeners();
    loadFromLocalStorage();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
});

function initializeApp() {
    // Set dark mode if saved
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeButton();
    }
}

function populateTimezoneSelector() {
    const select = document.getElementById('tzSelect');
    TIMEZONES.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.tz;
        option.textContent = `${tz.name} (${tz.offset})`;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    // Add button
    document.getElementById('addBtn').addEventListener('click', addTimezone);

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Quick add buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tz = e.target.dataset.tz;
            addTimezoneByValue(tz);
        });
    });

    // Enter key in select
    document.getElementById('tzSelect').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTimezone();
    });
}

function addTimezone() {
    const select = document.getElementById('tzSelect');
    const tzValue = select.value;

    if (!tzValue) {
        alert('Please select a time zone');
        return;
    }

    addTimezoneByValue(tzValue);
    select.value = '';
}

function addTimezoneByValue(tzValue) {
    // Check if already added
    if (selectedTimezones.find(tz => tz.tz === tzValue)) {
        alert('This timezone is already added');
        return;
    }

    const tzData = TIMEZONES.find(tz => tz.tz === tzValue);
    if (!tzData) return;

    selectedTimezones.push(tzData);
    saveToLocalStorage();
    renderClocks();
}

function removeTimezone(tz) {
    selectedTimezones = selectedTimezones.filter(t => t.tz !== tz);
    saveToLocalStorage();
    renderClocks();
}

function renderClocks() {
    const container = document.getElementById('clocksContainer');

    if (selectedTimezones.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No Time Zones Selected</h2>
                <p>Choose a timezone from the selector above or use quick add buttons below.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = selectedTimezones.map(tz => `
        <div class="clock-card">
            <div class="clock-header">
                <div class="timezone-info">
                    <div class="timezone-name">${tz.name}</div>
                    <div class="timezone-offset">${tz.offset}</div>
                </div>
                <button class="remove-btn" onclick="removeTimezone('${tz.tz}')">Remove</button>
            </div>
            <div class="digital-display" id="clock-${tz.tz}">00:00:00</div>
            <div class="time-info">
                <div class="info-item">
                    <span class="info-label">Date</span>
                    <span class="info-value" id="date-${tz.tz}">-</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Day</span>
                    <span class="info-value" id="day-${tz.tz}">-</span>
                </div>
                <div class="info-item">
                    <span class="info-label">UTC Offset</span>
                    <span class="info-value" id="offset-${tz.tz}">-</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Format</span>
                    <span class="info-value" id="format-${tz.tz}">24h</span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateAllClocks() {
    selectedTimezones.forEach(tz => {
        updateClock(tz);
    });
}

function updateClock(tz) {
    const now = new Date();
    
    // Get time in specific timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.tz,
        weekday: 'long',
    });

    const timeString = formatter.format(now);
    const dateString = dateFormatter.format(now);
    const dayString = dayFormatter.format(now);

    // Update digital display
    const clockElement = document.getElementById(`clock-${tz.tz}`);
    if (clockElement) {
        clockElement.textContent = timeString;
    }

    // Update date
    const dateElement = document.getElementById(`date-${tz.tz}`);
    if (dateElement) {
        dateElement.textContent = dateString;
    }

    // Update day
    const dayElement = document.getElementById(`day-${tz.tz}`);
    if (dayElement) {
        dayElement.textContent = dayString;
    }

    // Calculate UTC offset
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz.tz }));
    const offsetMs = tzDate - utcDate;
    const offsetHours = Math.floor(offsetMs / 3600000);
    const offsetMinutes = Math.floor((Math.abs(offsetMs) % 3600000) / 60000);
    const sign = offsetHours >= 0 ? '+' : '';
    const offsetString = `UTC ${sign}${offsetHours}:${String(offsetMinutes).padStart(2, '0')}`;

    // Update offset
    const offsetElement = document.getElementById(`offset-${tz.tz}`);
    if (offsetElement) {
        offsetElement.textContent = offsetString;
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.getElementById('themeToggle');
    if (isDarkMode) {
        btn.innerHTML = '<span class="theme-icon">☀️</span> Light Mode';
    } else {
        btn.innerHTML = '<span class="theme-icon">🌙</span> Dark Mode';
    }
}

function saveToLocalStorage() {
    localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('selectedTimezones');
    if (saved) {
        try {
            selectedTimezones = JSON.parse(saved);
            renderClocks();
        } catch (e) {
            console.error('Error loading timezones:', e);
        }
    }
}

// Export functions for HTML onclick handlers
window.removeTimezone = removeTimezone;
