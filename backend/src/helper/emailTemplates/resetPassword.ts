export const generateResetPasswordEmail = (name: string, resetLink: string): string => {
    return `
    <div style="font-family: Arial, sans-serif;">
      <h3>Password Reset Request</h3>
      <p>Hi ${name || 'User'},</p>
      <p>You recently requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}" target="_blank" style="color: #2f67f6;">Reset Password</a></p>
      <p><small>This link will expire in 15 minutes.</small></p>
    </div>
  `;
};
