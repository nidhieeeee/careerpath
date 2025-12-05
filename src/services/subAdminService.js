import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

function getAuthHeader() {
  // Try multiple possible token keys in order of preference
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("token");

  // Check token expiry
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry);
    const currentTime = new Date().getTime();

    if (currentTime >= expiryTime) {
      console.warn("Token has expired");
      clearAuthStorage();
      return {};
    }
  }

  if (!token) {
    console.warn(
      "No authentication token found in localStorage or sessionStorage"
    );
  }

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function clearAuthStorage() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("user");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("token");
}

// ============ FETCH FUNCTIONS ============

// Fetch all subadmins
export async function fetchAllSubAdmins() {
  try {
    const res = await axios.get(`${API_BASE}/subadmins`, {
      headers: getAuthHeader(),
    });
    return res.data.data || [];
  } catch (err) {
    console.error(
      "Error fetching subadmins:",
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch subadmins");
  }
}

// Fetch single subadmin by ID
export async function fetchSubAdminById(id) {
  try {
    const res = await axios.get(`${API_BASE}/subadmins/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error(
      `Error fetching subadmin ${id}:`,
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch subadmin");
  }
}

// Fetch subadmins by institute
export async function fetchSubAdminsByInstitute(instituteId) {
  try {
    const res = await axios.get(
      `${API_BASE}/institute/${instituteId}/subadmins`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data.data || [];
  } catch (err) {
    console.error(
      `Error fetching subadmins for institute:`,
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch subadmins");
  }
}

// Fetch subadmin dashboard (with full data)
export async function fetchSubAdminDashboard(id) {
  try {
    const res = await axios.get(`${API_BASE}/subadmins/${id}/dashboard`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error(
      `Error fetching dashboard for ${id}:`,
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch dashboard");
  }
}

// Fetch all subadmins with stats
export async function fetchSubAdminsWithStats() {
  try {
    const res = await axios.get(`${API_BASE}/subadmins/overview/stats`, {
      headers: getAuthHeader(),
    });
    return res.data.data || [];
  } catch (err) {
    console.error(
      "Error fetching subadmins overview:",
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch overview");
  }
}

// Fetch complete subadmin details with all related data
export async function fetchSubAdminFullDetails(id) {
  try {
    const res = await axios.get(`${API_BASE}/subadmins/${id}/full-details`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error(
      `Error fetching full details for ${id}:`,
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.error || "Failed to fetch full details"
    );
  }
}
