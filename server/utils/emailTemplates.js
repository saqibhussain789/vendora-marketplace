export const getResetPasswordEmailTemplate = ({ name, resetUrl }) => {
  const safeName = name || "User";

  return {
    subject: "Reset Your Password",
    text: `Hello ${safeName},

We received a request to reset your password.

Please use the link below to set a new password:
${resetUrl}

This link will expire in 15 minutes.

If you did not request this, you can safely ignore this email.
`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Reset Your Password</h2>
        <p>Hello ${safeName},</p>
        <p>We received a request to reset your password.</p>
        <p>
          <a
            href="${resetUrl}"
            style="display:inline-block;padding:12px 20px;background:#0f766e;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;"
          >
            Reset Password
          </a>
        </p>
        <p>If the button above does not work, use this link:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };
};