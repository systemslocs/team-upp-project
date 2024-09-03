export const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'As senhas não coincidem';
    }
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    return null;
  };
  