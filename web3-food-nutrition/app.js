// Web3 Food Nutrition App JavaScript

// App Data
const AppData = {
  sampleFoods: [
    {
      name: "Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4,
      sugar: 19,
      sodium: 2,
      potassium: 195,
      vitaminC: 14,
      credits: 15,
      emoji: "🍎"
    },
    {
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      potassium: 256,
      vitaminB6: 0.5,
      credits: 20,
      emoji: "🍗"
    },
    {
      name: "Broccoli",
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      potassium: 288,
      vitaminC: 89,
      credits: 18,
      emoji: "🥦"
    },
    {
      name: "Salmon Fillet",
      calories: 208,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 93,
      potassium: 628,
      omega3: 1.8,
      credits: 25,
      emoji: "🐟"
    },
    {
      name: "Avocado",
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7,
      sodium: 7,
      potassium: 485,
      vitaminK: 26,
      credits: 22,
      emoji: "🥑"
    },
    {
      name: "Pizza Slice",
      calories: 285,
      protein: 12,
      carbs: 36,
      fat: 10,
      fiber: 2,
      sugar: 4,
      sodium: 640,
      potassium: 184,
      calcium: 144,
      credits: 8,
      emoji: "🍕"
    }
  ],
  
  rewardMarketplace: [
    {
      id: 1,
      name: "30-min Nutrition Consultation",
      description: "Get personalized advice from a certified nutritionist",
      cost: 500,
      category: "Health Services",
      emoji: "👩‍⚕️"
    },
    {
      id: 2,
      name: "Premium App Features",
      description: "Unlock advanced analytics and meal planning",
      cost: 200,
      category: "App Features",
      emoji: "⭐"
    },
    {
      id: 3,
      name: "Fitness Tracker Watch",
      description: "Smart watch to track your daily activity",
      cost: 1500,
      category: "Fitness Gear",
      emoji: "⌚"
    },
    {
      id: 4,
      name: "Organic Supplements Pack",
      description: "Monthly supply of organic vitamins",
      cost: 300,
      category: "Supplements",
      emoji: "💊"
    },
    {
      id: 5,
      name: "Yoga Class Pass",
      description: "10-class pass for local yoga studio",
      cost: 400,
      category: "Fitness",
      emoji: "🧘‍♀️"
    }
  ],
  
  userStats: {
    totalUsers: 12847,
    imagesAnalyzed: 45923,
    creditsDistributed: 892456,
    foodsRecognized: 3421
  }
};

// App State
let AppState = {
  currentPage: 'landing',
  isWalletConnected: false,
  userCredits: 1245,
  userFoodHistory: [],
  userTransactions: [
    { type: "Food Analysis", date: "2024-01-15", amount: "+20", positive: true },
    { type: "Premium Features", date: "2024-01-14", amount: "-200", positive: false },
    { type: "Food Analysis", date: "2024-01-14", amount: "+15", positive: true },
    { type: "Yoga Class Pass", date: "2024-01-13", amount: "-400", positive: false },
    { type: "Food Analysis", date: "2024-01-13", amount: "+18", positive: true }
  ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  initializeEventListeners();
  initializePages();
  renderMarketplace();
  renderFoodHistory();
  renderTransactions();
  updateStats();
  updateCreditsDisplay();
});

function initializeEventListeners() {
  console.log('Initializing event listeners');
  
  // Navigation links
  const navLinks = document.querySelectorAll('[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      console.log('Navigation clicked:', page);
      if (page) {
        navigateToPage(page);
      }
    });
  });
  
  // Get Started button
  const getStartedBtn = document.getElementById('getStarted');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      console.log('Get Started clicked');
      if (!AppState.isWalletConnected) {
        connectWallet().then(() => {
          navigateToPage('upload');
        });
      } else {
        navigateToPage('upload');
      }
    });
  }
  
  // Wallet connection
  const connectWalletBtn = document.getElementById('connectWallet');
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', () => {
      console.log('Wallet button clicked');
      toggleWalletConnection();
    });
  }
  
  // File upload
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
  }
  
  // Period selector
  document.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Profile form
  const goalsForm = document.getElementById('goalsForm');
  if (goalsForm) {
    goalsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('Goals saved successfully!', 'success');
    });
  }
  
  // Disconnect wallet
  const disconnectWalletBtn = document.getElementById('disconnectWallet');
  if (disconnectWalletBtn) {
    disconnectWalletBtn.addEventListener('click', disconnectWallet);
  }
}

function initializePages() {
  console.log('Initializing pages');
  // Show landing page by default
  navigateToPage('landing');
}

// Navigation Functions
function navigateToPage(pageName) {
  console.log('Navigating to page:', pageName);
  
  // Update nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    }
  });
  
  // Update pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
    if (page.id === pageName) {
      page.classList.add('active');
    }
  });
  
  AppState.currentPage = pageName;
  
  // Initialize page-specific content
  if (pageName === 'history') {
    setTimeout(() => initializeHistoryCharts(), 100);
  } else if (pageName === 'credits') {
    updateCreditsDisplay();
  }
}

// Wallet Functions
function connectWallet() {
  console.log('Connecting wallet...');
  return new Promise((resolve) => {
    showLoading();
    
    setTimeout(() => {
      AppState.isWalletConnected = true;
      const connectWalletBtn = document.getElementById('connectWallet');
      if (connectWalletBtn) {
        connectWalletBtn.innerHTML = '<span class="wallet-status">0x742d...3b2f</span>';
        connectWalletBtn.classList.add('connected');
      }
      
      const walletConnectionStatus = document.getElementById('walletConnectionStatus');
      if (walletConnectionStatus) {
        walletConnectionStatus.innerHTML = '<span class="status-dot"></span><span>Connected</span>';
        walletConnectionStatus.classList.add('connected');
      }
      
      hideLoading();
      showNotification('Wallet connected successfully!', 'success');
      resolve();
    }, 2000);
  });
}

function toggleWalletConnection() {
  if (AppState.isWalletConnected) {
    // Already connected, show wallet info
    navigateToPage('profile');
  } else {
    connectWallet();
  }
}

function disconnectWallet() {
  AppState.isWalletConnected = false;
  const connectWalletBtn = document.getElementById('connectWallet');
  if (connectWalletBtn) {
    connectWalletBtn.innerHTML = '<span class="wallet-status">Connect Wallet</span>';
    connectWalletBtn.classList.remove('connected');
  }
  
  const walletConnectionStatus = document.getElementById('walletConnectionStatus');
  if (walletConnectionStatus) {
    walletConnectionStatus.innerHTML = '<span class="status-dot"></span><span>Disconnected</span>';
    walletConnectionStatus.classList.remove('connected');
  }
  
  showNotification('Wallet disconnected', 'info');
}

// File Upload Functions
function handleDragOver(e) {
  e.preventDefault();
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    uploadArea.classList.add('dragover');
  }
}

function handleDrop(e) {
  e.preventDefault();
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) {
    uploadArea.classList.remove('dragover');
  }
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  if (!file.type.startsWith('image/')) {
    showNotification('Please select an image file', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    analyzeFood(e.target.result);
  };
  reader.readAsDataURL(file);
}

function analyzeFood(imageSrc) {
  showLoading();
  const foodImage = document.getElementById('foodImage');
  const analysisSection = document.getElementById('analysisSection');
  
  if (foodImage) foodImage.src = imageSrc;
  if (analysisSection) analysisSection.style.display = 'block';
  
  // Simulate AI analysis
  setTimeout(() => {
    const randomFood = AppData.sampleFoods[Math.floor(Math.random() * AppData.sampleFoods.length)];
    displayFoodAnalysis(randomFood);
    hideLoading();
  }, 3000);
}

function displayFoodAnalysis(food) {
  const foodName = document.getElementById('foodName');
  const confidence = document.getElementById('confidence');
  const nutritionDetails = document.getElementById('nutritionDetails');
  
  if (foodName) foodName.textContent = food.name;
  if (confidence) confidence.textContent = '95%';
  
  // Create nutrition details
  if (nutritionDetails) {
    nutritionDetails.innerHTML = `
      <div class="nutrition-item">
        <div class="nutrition-value">${food.calories}</div>
        <div class="nutrition-label">Calories</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${food.protein}g</div>
        <div class="nutrition-label">Protein</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${food.carbs}g</div>
        <div class="nutrition-label">Carbs</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${food.fat}g</div>
        <div class="nutrition-label">Fat</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${food.fiber}g</div>
        <div class="nutrition-label">Fiber</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${food.sodium}mg</div>
        <div class="nutrition-label">Sodium</div>
      </div>
    `;
  }
  
  // Create charts
  setTimeout(() => {
    createMacroChart(food);
    createNutritionChart(food);
  }, 100);
  
  // Show credits earned
  setTimeout(() => {
    showCreditsEarned(food.credits);
    addToFoodHistory(food);
    updateCredits(food.credits);
  }, 1000);
}

function createMacroChart(food) {
  const canvas = document.getElementById('macroChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        data: [food.protein * 4, food.carbs * 4, food.fat * 9],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createNutritionChart(food) {
  const canvas = document.getElementById('nutritionChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Calories', 'Protein', 'Carbs', 'Fat', 'Fiber'],
      datasets: [{
        data: [food.calories / 10, food.protein, food.carbs, food.fat, food.fiber],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function showCreditsEarned(credits) {
  const earnedAmount = document.getElementById('earnedAmount');
  const creditsEarned = document.getElementById('creditsEarned');
  
  if (earnedAmount) earnedAmount.textContent = credits;
  if (creditsEarned) creditsEarned.style.display = 'block';
}

function addToFoodHistory(food) {
  const historyItem = {
    ...food,
    date: new Date().toISOString(),
    timestamp: Date.now()
  };
  AppState.userFoodHistory.unshift(historyItem);
  
  // Add transaction
  AppState.userTransactions.unshift({
    type: "Food Analysis",
    date: new Date().toLocaleDateString(),
    amount: `+${food.credits}`,
    positive: true
  });
}

function updateCredits(amount) {
  AppState.userCredits += amount;
  updateCreditsDisplay();
}

function updateCreditsDisplay() {
  const totalCredits = document.getElementById('totalCredits');
  if (totalCredits) {
    totalCredits.textContent = AppState.userCredits.toLocaleString();
  }
}

// Marketplace Functions
function renderMarketplace() {
  const marketplaceGrid = document.getElementById('marketplaceGrid');
  if (!marketplaceGrid) return;
  
  marketplaceGrid.innerHTML = AppData.rewardMarketplace.map(item => `
    <div class="marketplace-item">
      <div class="item-image">${item.emoji}</div>
      <div class="item-content">
        <h4 class="item-title">${item.name}</h4>
        <p class="item-description">${item.description}</p>
        <div class="item-footer">
          <span class="item-cost">${item.cost} Credits</span>
          <button class="btn btn--primary btn--sm" onclick="purchaseItem(${item.id}, ${item.cost})" ${AppState.userCredits < item.cost ? 'disabled' : ''}>
            ${AppState.userCredits >= item.cost ? 'Purchase' : 'Not enough credits'}
          </button>
        </div>
        <div class="item-category">${item.category}</div>
      </div>
    </div>
  `).join('');
}

function purchaseItem(itemId, cost) {
  if (AppState.userCredits < cost) {
    showNotification('Not enough credits!', 'error');
    return;
  }
  
  const item = AppData.rewardMarketplace.find(item => item.id === itemId);
  AppState.userCredits -= cost;
  
  // Add transaction
  AppState.userTransactions.unshift({
    type: item.name,
    date: new Date().toLocaleDateString(),
    amount: `-${cost}`,
    positive: false
  });
  
  updateCreditsDisplay();
  renderMarketplace();
  renderTransactions();
  showNotification(`${item.name} purchased successfully!`, 'success');
}

// History Functions
function renderFoodHistory() {
  const foodLogList = document.getElementById('foodLogList');
  if (!foodLogList) return;
  
  // Generate some sample history if empty
  if (AppState.userFoodHistory.length === 0) {
    const sampleHistory = AppData.sampleFoods.slice(0, 4).map((food, index) => ({
      ...food,
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
      timestamp: Date.now() - index * 24 * 60 * 60 * 1000
    }));
    AppState.userFoodHistory = sampleHistory;
  }
  
  foodLogList.innerHTML = AppState.userFoodHistory.map(food => `
    <div class="food-log-item">
      <div class="food-log-info">
        <div class="food-emoji">${food.emoji}</div>
        <div class="food-details">
          <h4>${food.name}</h4>
          <p>${food.calories} cal • ${new Date(food.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="food-credits">+${food.credits}</div>
    </div>
  `).join('');
  
  renderFoodCalendar();
}

function renderFoodCalendar() {
  const foodCalendar = document.getElementById('foodCalendar');
  if (!foodCalendar) return;
  
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  let calendarHTML = '';
  for (let day = 1; day <= daysInMonth; day++) {
    const hasFood = AppState.userFoodHistory.some(food => {
      const foodDate = new Date(food.date);
      return foodDate.getDate() === day && 
             foodDate.getMonth() === today.getMonth() &&
             foodDate.getFullYear() === today.getFullYear();
    });
    
    calendarHTML += `<div class="calendar-day ${hasFood ? 'has-food' : ''}">${day}</div>`;
  }
  
  foodCalendar.innerHTML = calendarHTML;
}

function initializeHistoryCharts() {
  const canvas = document.getElementById('trendsChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Calories',
        data: [1800, 2100, 1900, 2200, 1750, 2000, 1850],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 1500
        }
      }
    }
  });
}

// Profile Functions
function renderTransactions() {
  const transactionList = document.getElementById('transactionList');
  if (!transactionList) return;
  
  transactionList.innerHTML = AppState.userTransactions.map(transaction => `
    <div class="transaction-item">
      <div class="transaction-info">
        <div class="transaction-type">${transaction.type}</div>
        <div class="transaction-date">${transaction.date}</div>
      </div>
      <div class="transaction-amount ${transaction.positive ? 'positive' : 'negative'}">
        ${transaction.amount}
      </div>
    </div>
  `).join('');
}

// Utility Functions
function showLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-16);
    box-shadow: var(--shadow-lg);
    z-index: 1001;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;
  
  if (type === 'success') {
    notification.style.borderColor = 'var(--color-success)';
    notification.style.color = 'var(--color-success)';
  } else if (type === 'error') {
    notification.style.borderColor = 'var(--color-error)';
    notification.style.color = 'var(--color-error)';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function updateStats() {
  const elements = {
    totalUsers: document.getElementById('totalUsers'),
    imagesAnalyzed: document.getElementById('imagesAnalyzed'), 
    creditsDistributed: document.getElementById('creditsDistributed'),
    foodsRecognized: document.getElementById('foodsRecognized')
  };
  
  if (elements.totalUsers) elements.totalUsers.textContent = AppData.userStats.totalUsers.toLocaleString();
  if (elements.imagesAnalyzed) elements.imagesAnalyzed.textContent = AppData.userStats.imagesAnalyzed.toLocaleString();
  if (elements.creditsDistributed) elements.creditsDistributed.textContent = AppData.userStats.creditsDistributed.toLocaleString();
  if (elements.foodsRecognized) elements.foodsRecognized.textContent = AppData.userStats.foodsRecognized.toLocaleString();
}

// Make functions globally available
window.purchaseItem = purchaseItem;

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }
`;
document.head.appendChild(style);