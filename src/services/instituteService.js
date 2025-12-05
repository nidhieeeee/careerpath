import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

function getAuthHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============ INSTITUTE FETCH FUNCTIONS ============

// Fetch logged-in subadmin's institute information
export async function fetchMyInstitute() {
  try {
    const res = await axios.get(`${API_BASE}/subadmin/my-institute`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error(
      "Error fetching my institute:",
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch institute");
  }
}

// Fetch specific subadmin's institute
export async function fetchSubAdminInstitute(subAdminId) {
  try {
    const res = await axios.get(
      `${API_BASE}/subadmin/${subAdminId}/institute`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      `Error fetching institute for ${subAdminId}:`,
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch institute");
  }
}

// Fetch all institutes
export async function fetchAllInstitutes() {
  try {
    const res = await axios.get(`${API_BASE}/institutes`, {
      headers: getAuthHeader(),
    });
    return res.data.data || [];
  } catch (err) {
    console.error(
      "Error fetching institutes:",
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch institutes");
  }
}

// Fetch specific institute by ID (with stats)
export async function fetchInstituteById(id) {
  try {
    const res = await axios.get(`${API_BASE}/institutes/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error(
      `Error fetching institute ${id}:`,
      err.response?.data || err.message
    );
    throw new Error(err.response?.data?.error || "Failed to fetch institute");
  }
}

// Fetch institute by code (e.g., "801753")
export async function fetchInstituteByCode(code) {
  try {
    const res = await axios.get(`${API_BASE}/institute/code/${code}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error(
      `Error fetching institute with code ${code}:`,
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.error || "Failed to fetch institute by code"
    );
  }
}

// Fetch all top institutes
export async function fetchTopInstitutes() {
  try {
    const res = await axios.get(`${API_BASE}/institutes/top/list`, {
      headers: getAuthHeader(),
    });
    return res.data.data || [];
  } catch (err) {
    console.error(
      "Error fetching top institutes:",
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.error || "Failed to fetch top institutes"
    );
  }
}

// Fetch institutes by location
export async function fetchInstitutesByLocation(location) {
  try {
    const res = await axios.get(`${API_BASE}/institutes/location/${location}`, {
      headers: getAuthHeader(),
    });
    return res.data.data || [];
  } catch (err) {
    console.error(
      `Error fetching institutes in ${location}:`,
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.error || "Failed to fetch institutes by location"
    );
  }
}

// Fetch courses in a specific institute
export async function fetchInstituteCourses(instituteId) {
  try {
    const res = await axios.get(
      `${API_BASE}/institutes/${instituteId}/courses`,
      {
        headers: getAuthHeader(),
      }
    );
    return res.data.data || [];
  } catch (err) {
    console.error(
      `Error fetching courses for institute ${instituteId}:`,
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.error || "Failed to fetch institute courses"
    );
  }
}
