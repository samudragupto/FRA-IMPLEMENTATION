// Application data
const appData = {
    states: ["All States", "Madhya Pradesh", "Tripura", "Odisha", "Telangana"],
    stateData: {
        "Madhya Pradesh": {
            totalClaims: 627000,
            approvedClaims: 309000,
            rejectedClaims: 340000,
            pendingClaims: 78000,
            rejectionRate: 54.0
        },
        "Tripura": {
            totalClaims: 188532,
            approvedClaims: 122583,
            rejectedClaims: 64832,
            pendingClaims: 1117,
            rejectionRate: 34.36
        },
        "Odisha": {
            totalClaims: 720000,
            approvedClaims: 388133,
            rejectedClaims: 194400,
            pendingClaims: 137467,
            rejectionRate: 27.0
        },
        "Telangana": {
            totalClaims: 655000,
            approvedClaims: 331070,
            rejectedClaims: 294750,
            pendingClaims: 29180,
            rejectionRate: 45.0
        }
    },
    sampleClaims: [
        {
            id: "MP001234",
            name: "Ramesh Kumar",
            state: "Madhya Pradesh",
            type: "IFR",
            status: "Pending",
            submittedDate: "2024-08-15",
            mlPrediction: 0.73
        },
        {
            id: "TR002456",
            name: "Bijoy Tripura",
            state: "Tripura",
            type: "CFR",
            status: "Approved",
            submittedDate: "2024-07-22",
            mlPrediction: 0.89
        },
        {
            id: "OD003789",
            name: "Sarita Naik",
            state: "Odisha",
            type: "IFR",
            status: "Under Review",
            submittedDate: "2024-09-01",
            mlPrediction: 0.45
        },
        {
            id: "TS004567",
            name: "Venkat Reddy",
            state: "Telangana",
            type: "CFR",
            status: "Rejected",
            submittedDate: "2024-06-10",
            mlPrediction: 0.28
        },
        {
            id: "MP005678",
            name: "Priya Devi",
            state: "Madhya Pradesh",
            type: "CFR",
            status: "Approved",
            submittedDate: "2024-09-05",
            mlPrediction: 0.82
        },
        {
            id: "OD006789",
            name: "Ravi Patel",
            state: "Odisha",
            type: "IFR",
            status: "Pending",
            submittedDate: "2024-08-30",
            mlPrediction: 0.67
        },
        {
            id: "TS007890",
            name: "Lakshmi Rao",
            state: "Telangana",
            type: "IFR",
            status: "Under Review",
            submittedDate: "2024-09-10",
            mlPrediction: 0.55
        },
        {
            id: "TR008901",
            name: "Arjun Das",
            state: "Tripura",
            type: "CFR",
            status: "Pending",
            submittedDate: "2024-08-25",
            mlPrediction: 0.71
        }
    ]
};

// Chart instances
let stateChart, statusChart, trendChart;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    setupStateSelector();
    setupClaimsManagement();
    setupModal();
    setupGISMap();
    initializeCharts();
    updateDashboardMetrics('All States');
    renderClaimsTable(appData.sampleClaims);
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
            
            // Initialize charts when dashboard is shown
            if (targetTab === 'dashboard') {
                setTimeout(() => initializeCharts(), 100);
            }
        });
    });
}

// State Selector
function setupStateSelector() {
    const stateSelector = document.getElementById('stateSelector');
    
    stateSelector.addEventListener('change', function() {
        const selectedState = this.value;
        updateDashboardMetrics(selectedState);
        updateCharts(selectedState);
    });
}

// Update Dashboard Metrics
function updateDashboardMetrics(selectedState) {
    let totalClaims = 0, approvedClaims = 0, rejectedClaims = 0, pendingClaims = 0;
    
    if (selectedState === 'All States') {
        Object.values(appData.stateData).forEach(data => {
            totalClaims += data.totalClaims;
            approvedClaims += data.approvedClaims;
            rejectedClaims += data.rejectedClaims;
            pendingClaims += data.pendingClaims;
        });
    } else {
        const data = appData.stateData[selectedState];
        totalClaims = data.totalClaims;
        approvedClaims = data.approvedClaims;
        rejectedClaims = data.rejectedClaims;
        pendingClaims = data.pendingClaims;
    }
    
    document.getElementById('totalClaims').textContent = formatNumber(totalClaims);
    document.getElementById('approvedClaims').textContent = formatNumber(approvedClaims);
    document.getElementById('rejectedClaims').textContent = formatNumber(rejectedClaims);
    document.getElementById('pendingClaims').textContent = formatNumber(pendingClaims);
}

// Format numbers with commas
function formatNumber(num) {
    return num.toLocaleString();
}

// Initialize Charts
function initializeCharts() {
    initializeStateChart();
    initializeStatusChart();
    initializeTrendChart();
}

function initializeStateChart() {
    const ctx = document.getElementById('stateChart');
    if (!ctx) return;
    
    if (stateChart) {
        stateChart.destroy();
    }
    
    const states = Object.keys(appData.stateData);
    const totalData = states.map(state => appData.stateData[state].totalClaims / 1000);
    const approvedData = states.map(state => appData.stateData[state].approvedClaims / 1000);
    
    stateChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: states,
            datasets: [
                {
                    label: 'Total Claims (K)',
                    data: totalData,
                    backgroundColor: '#1FB8CD',
                    borderRadius: 4
                },
                {
                    label: 'Approved Claims (K)',
                    data: approvedData,
                    backgroundColor: '#5D878F',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Claims (Thousands)'
                    }
                }
            }
        }
    });
}

function initializeStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    if (statusChart) {
        statusChart.destroy();
    }
    
    let totalApproved = 0, totalRejected = 0, totalPending = 0;
    Object.values(appData.stateData).forEach(data => {
        totalApproved += data.approvedClaims;
        totalRejected += data.rejectedClaims;
        totalPending += data.pendingClaims;
    });
    
    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Rejected', 'Pending'],
            datasets: [{
                data: [totalApproved, totalRejected, totalPending],
                backgroundColor: ['#1FB8CD', '#B4413C', '#FFC185'],
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

function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    if (trendChart) {
        trendChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const trendData = [45, 52, 48, 61, 55, 67, 73, 69, 78];
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Claims Processed (K)',
                data: trendData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1FB8CD',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Claims (Thousands)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month (2024)'
                    }
                }
            }
        }
    });
}

function updateCharts(selectedState) {
    if (selectedState === 'All States') {
        initializeCharts();
    } else {
        updateStateChart(selectedState);
        updateStatusChart(selectedState);
    }
}

function updateStateChart(selectedState) {
    if (!stateChart) return;
    
    const data = appData.stateData[selectedState];
    stateChart.data.labels = [selectedState];
    stateChart.data.datasets[0].data = [data.totalClaims / 1000];
    stateChart.data.datasets[1].data = [data.approvedClaims / 1000];
    stateChart.update();
}

function updateStatusChart(selectedState) {
    if (!statusChart) return;
    
    const data = appData.stateData[selectedState];
    statusChart.data.datasets[0].data = [data.approvedClaims, data.rejectedClaims, data.pendingClaims];
    statusChart.update();
}

// Claims Management
function setupClaimsManagement() {
    const stateFilter = document.getElementById('claimStateFilter');
    const typeFilter = document.getElementById('claimTypeFilter');
    const statusFilter = document.getElementById('claimStatusFilter');
    const searchInput = document.getElementById('claimSearch');
    
    [stateFilter, typeFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', filterClaims);
    });
    
    // Use both input and keyup events for better search responsiveness
    searchInput.addEventListener('input', filterClaims);
    searchInput.addEventListener('keyup', filterClaims);
}

function filterClaims() {
    const stateFilter = document.getElementById('claimStateFilter').value;
    const typeFilter = document.getElementById('claimTypeFilter').value;
    const statusFilter = document.getElementById('claimStatusFilter').value;
    const searchTerm = document.getElementById('claimSearch').value.toLowerCase().trim();
    
    let filteredClaims = appData.sampleClaims.filter(claim => {
        const matchesState = !stateFilter || claim.state === stateFilter;
        const matchesType = !typeFilter || claim.type === typeFilter;
        const matchesStatus = !statusFilter || claim.status === statusFilter;
        const matchesSearch = !searchTerm || 
            claim.name.toLowerCase().includes(searchTerm) ||
            claim.id.toLowerCase().includes(searchTerm) ||
            claim.state.toLowerCase().includes(searchTerm);
            
        return matchesState && matchesType && matchesStatus && matchesSearch;
    });
    
    renderClaimsTable(filteredClaims);
    
    // Show no results message if needed
    if (filteredClaims.length === 0) {
        const tbody = document.getElementById('claimsTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: var(--space-24); color: var(--color-text-secondary);">
                    No claims found matching your criteria. Try adjusting your filters or search terms.
                </td>
            </tr>
        `;
    }
}

function renderClaimsTable(claims) {
    const tbody = document.getElementById('claimsTableBody');
    tbody.innerHTML = '';
    
    if (claims.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: var(--space-24); color: var(--color-text-secondary);">
                    No claims found matching your criteria.
                </td>
            </tr>
        `;
        return;
    }
    
    claims.forEach(claim => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${claim.id}</td>
            <td>${claim.name}</td>
            <td>${claim.state}</td>
            <td>${claim.type}</td>
            <td><span class="claim-status ${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
            <td>${formatDate(claim.submittedDate)}</td>
            <td>
                <button class="btn btn--primary btn--sm process-btn" onclick="showMLPrediction('${claim.id}')">
                    Process Claim
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Modal Management
function setupModal() {
    const modal = document.getElementById('mlModal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function showMLPrediction(claimId) {
    const claim = appData.sampleClaims.find(c => c.id === claimId);
    if (!claim) return;
    
    const modal = document.getElementById('mlModal');
    const scoreDisplay = document.getElementById('predictionScore');
    const factorsList = document.getElementById('predictionFactors');
    
    const probability = Math.round(claim.mlPrediction * 100);
    scoreDisplay.textContent = `${probability}%`;
    
    // Update score color based on probability
    if (probability >= 70) {
        scoreDisplay.style.color = 'var(--color-success)';
    } else if (probability >= 50) {
        scoreDisplay.style.color = 'var(--color-warning)';
    } else {
        scoreDisplay.style.color = 'var(--color-error)';
    }
    
    // Generate prediction factors
    const factors = generatePredictionFactors(claim);
    factorsList.innerHTML = factors.map(factor => `<li>${factor}</li>`).join('');
    
    modal.classList.remove('hidden');
    
    // Add event listeners to modal action buttons
    const modalButtons = modal.querySelectorAll('.modal-actions .btn');
    modalButtons.forEach(btn => {
        btn.onclick = function() {
            handleClaimAction(this.textContent.trim(), claim);
        };
    });
}

function generatePredictionFactors(claim) {
    const factors = [
        'Complete documentation: ✅',
        'Valid GPS coordinates: ✅',
        'Community endorsement: ✅'
    ];
    
    if (claim.mlPrediction > 0.7) {
        factors.push('Historical occupation proof: ✅');
        factors.push('Environmental clearance: ✅');
    } else if (claim.mlPrediction > 0.5) {
        factors.push('Historical occupation proof: ⚠️');
        factors.push('Environmental clearance: ✅');
    } else {
        factors.push('Historical occupation proof: ❌');
        factors.push('Environmental clearance: ⚠️');
    }
    
    return factors;
}

function handleClaimAction(action, claim) {
    let message = '';
    let newStatus = '';
    
    switch(action) {
        case 'Approve Claim':
            message = `Claim ${claim.id} has been approved successfully!`;
            newStatus = 'Approved';
            break;
        case 'Request Additional Documents':
            message = `Additional documents requested for claim ${claim.id}. Notification sent to claimant.`;
            newStatus = 'Under Review';
            break;
        case 'Reject Claim':
            message = `Claim ${claim.id} has been rejected. Rejection notice will be sent to claimant.`;
            newStatus = 'Rejected';
            break;
    }
    
    // Update the claim status in the data
    const claimIndex = appData.sampleClaims.findIndex(c => c.id === claim.id);
    if (claimIndex !== -1) {
        appData.sampleClaims[claimIndex].status = newStatus;
    }
    
    // Close modal and show success message
    closeModal();
    alert(message);
    
    // Re-render the claims table to reflect changes
    filterClaims();
}

function closeModal() {
    const modal = document.getElementById('mlModal');
    modal.classList.add('hidden');
}

// GIS Map Setup
function setupGISMap() {
    const stateRegions = document.querySelectorAll('.state-region');
    const checkboxes = document.querySelectorAll('.map-controls input[type="checkbox"]');
    
    stateRegions.forEach(region => {
        region.addEventListener('click', function() {
            const stateName = this.getAttribute('data-state');
            showStateInfo(stateName);
        });
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateMapLayers);
    });
}

function showStateInfo(stateName) {
    const data = appData.stateData[stateName];
    if (!data) return;
    
    const info = `${stateName} Information:\n\n` +
                `Total Claims: ${formatNumber(data.totalClaims)}\n` +
                `Approved: ${formatNumber(data.approvedClaims)}\n` +
                `Rejected: ${formatNumber(data.rejectedClaims)}\n` +
                `Pending: ${formatNumber(data.pendingClaims)}\n` +
                `Rejection Rate: ${data.rejectionRate}%`;
    
    alert(info);
}

function updateMapLayers() {
    const showClaims = document.getElementById('showClaims').checked;
    const showForest = document.getElementById('showForest').checked;
    const showBoundaries = document.getElementById('showBoundaries').checked;
    
    const stateRegions = document.querySelectorAll('.state-region');
    const claimIndicators = document.querySelectorAll('.claim-indicator');
    
    // Update visibility based on checkboxes
    claimIndicators.forEach(indicator => {
        indicator.style.display = showClaims ? 'block' : 'none';
    });
    
    stateRegions.forEach(region => {
        if (showBoundaries) {
            region.style.border = '2px solid var(--color-border)';
        } else {
            region.style.border = '2px solid transparent';
        }
        
        if (showForest) {
            region.style.background = `linear-gradient(45deg, ${getComputedStyle(region).backgroundColor}, var(--color-bg-3))`;
        }
    });
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}