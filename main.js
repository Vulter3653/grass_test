// Firebase configuration from user's project
const firebaseConfig = {
  apiKey: "AIzaSyAbopKaQTLQCaS-JUU4XD7rCw8cxFqLoXQ",
  authDomain: "grass-test-117aa.firebaseapp.com",
  projectId: "grass-test-117aa",
  storageBucket: "grass-test-117aa.firebasestorage.app",
  messagingSenderId: "671085921274",
  appId: "1:671085921274:web:fa8589743b927b7db35a43",
  measurementId: "G-30HJKE03JH"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('add-user-form');
  const usernameInput = document.getElementById('username-input');
  const userGrid = document.getElementById('user-grid');
  const emptyState = document.getElementById('empty-state');
  const userCardTemplate = document.getElementById('user-card-template');

  // Generate or retrieve a persistent visitorId for this browser
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('visitorId', visitorId);
  }

  const renderUsers = (usersData) => {
    // Clear existing cards (except empty state)
    const cards = userGrid.querySelectorAll('.user-card');
    cards.forEach(card => card.remove());

    if (usersData.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    // Sort by creation date (newest first)
    usersData.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    usersData.forEach(user => {
      const { username, addedBy, id } = user;
      const cardClone = userCardTemplate.content.cloneNode(true);
      
      const avatarImg = cardClone.querySelector('.user-avatar');
      const usernameDisplay = cardClone.querySelector('.username');
      const grassChart = cardClone.querySelector('.grass-chart');
      const githubLink = cardClone.querySelector('.github-link');
      const removeBtn = cardClone.querySelector('.remove-btn');

      avatarImg.src = `https://github.com/${username}.png`;
      avatarImg.alt = `${username}'s avatar`;
      usernameDisplay.textContent = username;
      
      // Using ghchart.rshah.org for the contribution graph
      grassChart.src = `https://ghchart.rshah.org/39d353/${username}`;
      grassChart.alt = `${username}'s GitHub contribution graph`;
      
      githubLink.href = `https://github.com/${username}`;

      // Only show remove button if the visitorId matches the person who added it
      if (addedBy === visitorId) {
        removeBtn.style.display = 'flex';
        removeBtn.addEventListener('click', () => {
          removeUser(id);
        });
      }

      userGrid.appendChild(cardClone);
    });
  };

  const addUser = async (username) => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return;
    
    try {
      // Check if user already exists in Firestore to prevent duplicates
      const querySnapshot = await db.collection('grass_trackers')
        .where('username', '==', cleanUsername)
        .get();

      if (!querySnapshot.empty) {
        alert('This GitHub user is already being tracked!');
        return;
      }

      await db.collection('grass_trackers').add({
        username: cleanUsername,
        addedBy: visitorId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      usernameInput.value = '';
    } catch (error) {
      console.error("Error adding user: ", error);
      alert("Failed to add user. Check console for details.");
    }
  };

  const removeUser = async (docId) => {
    if (confirm('Are you sure you want to remove this user?')) {
      try {
        await db.collection('grass_trackers').doc(docId).delete();
      } catch (error) {
        console.error("Error removing user: ", error);
        alert("Failed to remove user.");
      }
    }
  };

  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addUser(usernameInput.value);
  });

  // Real-time listener for Firestore updates
  db.collection('grass_trackers').onSnapshot((snapshot) => {
    const usersData = [];
    snapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    renderUsers(usersData);
  }, (error) => {
    console.error("Firestore snapshot error: ", error);
  });
});