// api.js - Google Sheets API wrapper using JSONP (bypasses CORS)
const API = {
  // Replace with your Google Apps Script deployment URL
  baseUrl: 'https://script.google.com/macros/s/AKfycbwipm9x7hgC31sRiBNPueBxBuO9ulgfXXibiYdnK7rBg8178VbZoj-s5PkW6BNvyM1-sA/exec',
  
  // Generate unique callback name
  generateCallback() {
    return 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // JSONP request function
  jsonp(url, callbackName) {
    return new Promise((resolve, reject) => {
      // Create script element
      const script = document.createElement('script');
      script.src = url + '&callback=' + callbackName;
      
      // Set a timeout
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout'));
      }, 30000); // 30 second timeout
      
      // Cleanup function
      const cleanup = () => {
        clearTimeout(timeout);
        if (window[callbackName]) {
          delete window[callbackName];
        }
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
      
      // Define callback function globally
      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };
      
      // Handle errors
      script.onerror = (error) => {
        cleanup();
        reject(new Error('JSONP request failed'));
      };
      
      // Add script to document
      document.body.appendChild(script);
    });
  },
  
  // Generic request function using JSONP
  async request(action, params = {}) {
    const callbackName = this.generateCallback();
    
    // Build URL
    let url = this.baseUrl + '?action=' + encodeURIComponent(action);
    
    // Add all params to URL
    Object.keys(params).forEach(key => {
      if (typeof params[key] === 'object') {
        url += '&' + key + '=' + encodeURIComponent(JSON.stringify(params[key]));
      } else {
        url += '&' + key + '=' + encodeURIComponent(params[key]);
      }
    });
    
    console.log('Request URL:', url);
    
    try {
      const data = await this.jsonp(url, callbackName);
      console.log('Response:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'Network error: ' + error.message };
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
