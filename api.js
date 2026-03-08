// api.js - Google Sheets API wrapper for GitHub Pages
const API = {
  // Replace with your Google Apps Script deployment URL
  baseUrl: 'https://script.google.com/macros/s/AKfycby9mZGt2G9CI9HZqel8YTmExiR2HWqDb2iEk7McgYYp5Iz2eWXkrcZFhNAPdu9HQtHE/exec',
  
  // Generic request function
  async request(action, params = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.append('action', action);
    
    // Add all params to URL
    Object.keys(params).forEach(key => {
      if (typeof params[key] === 'object') {
        url.searchParams.append(key, JSON.stringify(params[key]));
      } else {
        url.searchParams.append(key, params[key]);
      }
    });
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  },
  
  // Login
  async login(username, password) {
    return this.request('login', { username, password });
  },
  
  // Get team members
  async getTeamMembers() {
    return this.request('getTeam');
  },
  
  // Save activity
  async saveActivity(activityData) {
    return this.request('saveActivity', { data: JSON.stringify(activityData) });
  },
  
  // Get user activities
  async getUserActivities(staffId, filter = 'all') {
    return this.request('getActivities', { staffId, filter });
  },
  
  // Get dashboard stats
  async getDashboardStats(staffId) {
    return this.request('getDashboard', { staffId });
  },
  
  // Update activity
  async updateActivity(rowId, updatedData) {
    return this.request('updateActivity', { 
      rowId, 
      data: JSON.stringify(updatedData) 
    });
  },
  
  // Approve activity
  async approveActivity(approvalId, staffId, action) {
    return this.request('approveActivity', { approvalId, staffId, action });
  },
  
  // Generate report
  async generateReport(staffId, reportType, format, month, year) {
    return this.request('generateReport', { staffId, reportType, format, month, year });
  }
};
