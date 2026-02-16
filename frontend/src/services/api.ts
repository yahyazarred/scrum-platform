const API_URL = "http://localhost:5000/api";

interface AuthResponse {
  message?: string;
  token?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
}

export const signup = async (data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Signup failed');
  }

  return json;
};

export const verifyEmail = async (data: {
  email: string;
  code: string;
}): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Verification failed');
  }

  return json;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Login failed');
  }

  return json;
};

export const getMe = async (token: string) => {
  const res = await fetch(`${API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch user data');
  }

  return json;
};