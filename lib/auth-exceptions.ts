export const AUTH_EXCEPTION_MESSAGES = {
  INVALID_CREDENTIALS: "Incorrect username or password.",
  USER_NOT_FOUND: "No account found with that username.",
  ACCOUNT_NOT_VERIFIED:
    "Your account has not been verified. Please check your email for a verification link.",
  UNKNOWN_ERROR: "An unknown error occurred. Please try again.",
};

export function getAuthErrorMessage(error: any): string {
  if (!error) return AUTH_EXCEPTION_MESSAGES.UNKNOWN_ERROR;
  const msg = error.message?.toLowerCase?.() || "";
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid password")
  ) {
    return AUTH_EXCEPTION_MESSAGES.INVALID_CREDENTIALS;
  }
  if (msg.includes("user not found") || msg.includes("no user found")) {
    return AUTH_EXCEPTION_MESSAGES.USER_NOT_FOUND;
  }
  if (msg.includes("email not confirmed") || msg.includes("not verified")) {
    return AUTH_EXCEPTION_MESSAGES.ACCOUNT_NOT_VERIFIED;
  }
  return AUTH_EXCEPTION_MESSAGES.UNKNOWN_ERROR;
}
