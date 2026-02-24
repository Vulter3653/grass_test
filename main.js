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
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  alert("Firebase 초기화 오류: " + error.message);
}

const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('add-user-form');
  const usernameInput = document.getElementById('username-input');
  const userGrid = document.getElementById('user-grid');
  const emptyState = document.getElementById('empty-state');
  const userCardTemplate = document.getElementById('user-card-template');

  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('visitorId', visitorId);
  }

  const renderUsers = (usersData) => {
    const cards = userGrid.querySelectorAll('.user-card');
    cards.forEach(card => card.remove());

    if (usersData.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

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
      usernameDisplay.textContent = username;
      grassChart.src = `https://ghchart.rshah.org/39d353/${username}`;
      githubLink.href = `https://github.com/${username}`;

      if (addedBy === visitorId) {
        removeBtn.style.display = 'flex';
        removeBtn.addEventListener('click', () => removeUser(id));
      }

      userGrid.appendChild(cardClone);
    });
  };

  const addUser = async (username) => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return;
    
    console.log("Adding user to Firestore:", cleanUsername);
    try {
      const querySnapshot = await db.collection('grass_trackers')
        .where('username', '==', cleanUsername)
        .get();

      if (!querySnapshot.empty) {
        alert('이미 등록된 유저입니다.');
        return;
      }

      await db.collection('grass_trackers').add({
        username: cleanUsername,
        addedBy: visitorId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log("User added successfully to Firestore");
      usernameInput.value = '';
    } catch (error) {
      console.error("Firestore Error (Add):", error);
      alert("데이터 저장 실패! Firebase 콘솔에서 Firestore를 생성했는지, 보안 규칙을 '테스트 모드'로 설정했는지 확인해주세요.\n\n에러 내용: " + error.message);
    }
  };

  const removeUser = async (docId) => {
    if (confirm('유저를 삭제하시겠습니까?')) {
      try {
        await db.collection('grass_trackers').doc(docId).delete();
        console.log("User deleted from Firestore");
      } catch (error) {
        console.error("Firestore Error (Delete):", error);
        alert("삭제 실패: " + error.message);
      }
    }
  };

  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addUser(usernameInput.value);
  });

  db.collection('grass_trackers').onSnapshot((snapshot) => {
    console.log("Firestore data updated, count:", snapshot.size);
    const usersData = [];
    snapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    renderUsers(usersData);
  }, (error) => {
    console.error("Firestore Snapshot Error:", error);
    if (error.code === 'permission-denied') {
      alert("Firebase 보안 규칙에 의해 접근이 거부되었습니다. Firestore 규칙을 '테스트 모드'로 수정해주세요.");
    }
  });
});