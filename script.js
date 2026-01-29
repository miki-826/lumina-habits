const habitInput = document.getElementById('habitInput');
const addBtn = document.getElementById('addBtn');
const habitList = document.getElementById('habitList');

console.log('Script loaded');

let habits = JSON.parse(localStorage.getItem('lumina-habits')) || [];

const saveHabits = () => {
    localStorage.setItem('lumina-habits', JSON.stringify(habits));
};

const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
};

const calculateStreak = (completedDates) => {
    if (!completedDates.length) return 0;
    
    const sortedDates = [...new Set(completedDates)].sort().reverse();
    const today = getTodayString();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
        return 0;
    }

    let streak = 0;
    let lastDate = null;

    for (const dateStr of sortedDates) {
        const currentDate = new Date(dateStr);
        if (!lastDate) {
            streak = 1;
        } else {
            const diff = (lastDate - currentDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak++;
            } else if (diff > 1) {
                break;
            }
        }
        lastDate = currentDate;
    }
    return streak;
};

const renderHabits = () => {
    console.log('Rendering habits', habits);
    habitList.innerHTML = '';
    const today = getTodayString();

    habits.forEach((habit, index) => {
        const completedDates = habit.completedDates || [];
        const isCompletedToday = completedDates.includes(today);
        const streak = calculateStreak(completedDates);

        const card = document.createElement('div');
        card.className = `habit-card ${isCompletedToday ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="habit-info">
                <div class="checkbox" onclick="toggleHabit(${index})"></div>
                <span class="habit-name">${habit.name}</span>
            </div>
            <div class="habit-stats">
                <span class="streak">🔥 ${streak} day streak</span>
                <button class="delete-btn" onclick="deleteHabit(${index})" aria-label="Delete habit">×</button>
            </div>
        `;
        habitList.appendChild(card);
    });
};

window.addHabit = () => {
    const name = habitInput.value.trim();
    if (name) {
        habits.push({
            name,
            completedDates: []
        });
        habitInput.value = '';
        saveHabits();
        renderHabits();
    }
};

window.toggleHabit = (index) => {
    const today = getTodayString();
    const dateIndex = habits[index].completedDates.indexOf(today);

    if (dateIndex === -1) {
        habits[index].completedDates.push(today);
    } else {
        habits[index].completedDates.splice(dateIndex, 1);
    }
    saveHabits();
    renderHabits();
};

window.deleteHabit = (index) => {
    if (confirm('Delete this habit?')) {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
    }
};

addBtn.addEventListener('click', window.addHabit);
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') window.addHabit();
});

renderHabits();
