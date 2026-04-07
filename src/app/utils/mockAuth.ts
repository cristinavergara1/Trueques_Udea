// Mock user for authentication
export const MOCK_USER = {
  id: 1,
  nombre: "Estudiante UdeA",
  email: "estudiante@udea.edu.co",
  password: "password123",
  avatar: "EU",
};

// Mock login function
export const mockLogin = (email: string, password: string) => {
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    return {
      success: true,
      user: {
        id: MOCK_USER.id,
        nombre: MOCK_USER.nombre,
        email: MOCK_USER.email,
        avatar: MOCK_USER.avatar,
      },
    };
  }

  return {
    success: false,
    message: "Email o contraseña incorrectos",
  };
};

// Get mock user (for reference)
export const getMockUser = () => {
  return {
    email: MOCK_USER.email,
    password: MOCK_USER.password,
    nombre: MOCK_USER.nombre,
  };
};
