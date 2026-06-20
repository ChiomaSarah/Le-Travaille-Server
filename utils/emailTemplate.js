const passwordResetTemplate = (username, resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Le-Travaille</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @media only screen and (max-width: 480px) {
            .header-table {
              padding: 20px !important;
            }
            .logo-cell {
              width: 44px !important;
              padding-right: 12px !important;
            }
            .logo-img {
              width: 40px !important;
              height: 40px !important;
            }
            .brand-name {
              font-size: 20px !important;
            }
            .body-cell {
              padding: 24px 20px !important;
            }
            .greeting {
              font-size: 20px !important;
            }
            .message-text {
              font-size: 14px !important;
            }
            .reset-button {
              padding: 14px 32px !important;
              font-size: 14px !important;
            }
            .fallback-link {
              font-size: 12px !important;
            }
            .footer-cell {
              padding: 16px 20px !important;
            }
          }
        </style>
      </head>
      <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #f0f4f8; padding: 40px 20px; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background: #003d38; padding: 28px 40px;" class="header-table">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Logo -->
                  <td style="width: 60px; vertical-align: middle; padding-right: 16px;" class="logo-cell">
                    <img
                      src="https://i.ibb.co/mh7GRRf/Man-Searching-for-a-Job-removebg.png"
                      alt="Le-Travaille Logo"
                      style="width: 56px; height: 56px; border-radius: 14px; background-color: #eef1f3; padding: 6px; display: block; object-fit: contain; box-sizing: border-box;"
                      class="logo-img"
                    />
                  </td>
                  <!-- Brand Name -->
                  <td style="vertical-align: middle;">
                    <h1 style="color: #FFD700; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; line-height: 1.2;" class="brand-name">
                      Le-Travaille
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;" class="body-cell">

              <!-- Heading -->
              <h2 style="color: #1A2332; font-size: 22px; font-weight: 600; margin: 0 0 16px 0;" class="greeting">
                Password Reset Request
              </h2>

              <!-- Greeting -->
              <p style="color: #5a6a7a; font-size: 16px; line-height: 1.7; margin: 0 0 8px 0;" class="message-text">
                Hey ${username}! 👋
              </p>

              <p style="color: #5a6a7a; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;" class="message-text">
                We received a request to reset your password. No worries — it happens to the best of us!
                Click the button below to set up a new password for your Le-Travaille account.
              </p>

              <!-- Note: If you didn't request this -->
              <p style="color: #9aabba; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; text-align: center; font-style: italic;">
                If you did not request this, you can safely ignore this email.
              </p>

              <!-- Reset Button -->
              <div style="text-align: center; margin: 32px 0 28px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 16px 48px; font-size: 16px; font-weight: 600; color: #ffffff; background: #00786F; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 120, 111, 0.3);" class="reset-button">
                  Reset Password
                </a>
              </div>

              <!-- Security Notice -->
              <div style="padding: 12px 0; margin: 0 0 24px 0; text-align: center;">
                <span style="color: #5a6a7a; font-size: 14px;">
                  This link will expire in <strong style="color: #1A2332;">1 hour</strong>.
                </span>
              </div>

              <!-- Divider -->
              <div style="border-top: 2px solid #f0f4f8; margin: 24px 0 20px 0;"></div>

              <!-- Fallback Link -->
              <p style="color: #7a8a9a; font-size: 13px; text-align: center; margin: 0 0 6px 0;" class="fallback-link">
                Button not working? Copy and paste this link in a browser:
              </p>
              <p style="color: #00786F; font-size: 13px; text-align: center; word-break: break-all; margin: 0; font-weight: 500; background-color: #f8fafc; padding: 10px 16px; border-radius: 8px; border: 1px dashed #e0e8f0;" class="fallback-link">
                ${resetLink}
              </p>

              <!-- Divider -->
              <div style="border-top: 2px solid #f0f4f8; margin: 24px 0 16px 0;"></div>

              <!-- Footer Notes -->
              <p style="color: #9aabba; font-size: 12px; text-align: center; margin: 0; line-height: 1.6;">
                This is an automated security message. Please do not reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e8edf2;" class="footer-cell">
              <p style="color: #9aabba; font-size: 12px; margin: 0;">
                &copy; 2024 Le-Travaille. All rights reserved.
              </p>
              <p style="color: #b0c0d0; font-size: 11px; margin: 4px 0 0 0;">
                Made with ❤️ for job seekers everywhere
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

module.exports = {
  passwordResetTemplate,
};
