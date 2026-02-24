document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('add-user-form');
  const usernameInput = document.getElementById('username-input');
  const userGrid = document.getElementById('user-grid');
  const emptyState = document.getElementById('empty-state');
  const userCardTemplate = document.getElementById('user-card-template');

  let trackedUsers = JSON.parse(localStorage.getItem('trackedUsers')) || [];

  const saveUsers = () => {
    localStorage.setItem('trackedUsers', JSON.stringify(trackedUsers));
  };

  const renderUsers = () => {
    // Clear existing cards (except empty state)
    const cards = userGrid.querySelectorAll('.user-card');
    cards.forEach(card => card.remove());

    if (trackedUsers.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    trackedUsers.forEach(username => {
      const cardClone = userCardTemplate.content.cloneNode(true);
      const cardElement = cardClone.querySelector('.user-card');
      
      const avatarImg = cardClone.querySelector('.user-avatar');
      const usernameDisplay = cardClone.querySelector('.username');
      const grassChart = cardClone.querySelector('.grass-chart');
      const githubLink = cardClone.querySelector('.github-link');
      const removeBtn = cardClone.querySelector('.remove-btn');

      avatarImg.src = `https://github.com/${username}.png`;
      avatarImg.alt = `${username}'s avatar`;
      usernameDisplay.textContent = username;
      
      // Using ghchart.rshah.org for the contribution graph
      // Theme color: 39d353 (GitHub green)
      grassChart.src = `https://ghchart.rshah.org/39d353/${username}`;
      grassChart.alt = `${username}'s GitHub contribution graph`;
      
      githubLink.href = `https://github.com/${username}`;

      removeBtn.addEventListener('click', () => {
        removeUser(username);
      });

      userGrid.appendChild(cardClone);
    });
  };

  const addUser = (username) => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return;
    
    if (trackedUsers.includes(cleanUsername)) {
      alert('User is already being tracked!');
      return;
    }

    trackedUsers.push(cleanUsername);
    saveUsers();
    renderUsers();
    usernameInput.value = '';
  };

  const removeUser = (username) => {
    trackedUsers = trackedUsers.filter(u => u !== username);
    saveUsers();
    renderUsers();
  };

  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addUser(usernameInput.value);
  });

  // Initial render
  renderUsers();
});