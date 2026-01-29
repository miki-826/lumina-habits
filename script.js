document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habitInput');
    const addBtn = document.getElementById('addBtn');
    const habitList = document.getElementById('habitList');

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
        
        // If not completed today AND not completed yesterday, streak is broken
        if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
            return 0;
        }

        let streak = 0;
        let currentDate = new Date(sortedDates[0]);

        for (let i = 0; i < sortedDates.length; i++) {
            const dateStr = sortedDates[i];
            const diff = (new Date(sortedDates[0]) - new Date(dateStr)) / (1000 * 60 * 60 * 24);
            
            if (diff === streak) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const renderHabits = () => {
        habitList.innerHTML = '';
        const today = getTodayString();

        habits.forEach((habit, index) => {
            const isCompletedToday = habit.completedDates.includes(today);
            const streak = calculateStreak(habit.completedDates);

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
});
