export function renderMagicLinkEmail({
  token,
}: {
  token: string;
}) {
  const html = `
  <div style="background: #f6f8fa; color: #222; font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; min-width: 320px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 400px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,37,64,0.08);">
      <tr>
        <td style="background: #222; padding: 32px 0; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; font-weight: 700; color: #fff;">Sign in</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 32px 24px 32px; color: #222;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #222;">Welcome back!</h2>
          <p style="font-size: 1rem; margin-bottom: 24px;">Enter the 6-digit code below on the sign-in page to securely access your account:</p>
          <div style="text-align: center; margin-bottom: 32px;">
            <code style="font-size: 2rem; letter-spacing: 0.3em; background: #fff; color: #222; padding: 16px 32px; border-radius: 8px; border: 1px solid #eaeaea; display: inline-block;">
              ${token}
            </code>
          </div>
          <div style="background: #eaeaea; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px 0; font-size: 1rem; color: #222;">Having trouble?</h3>
            <p style="margin: 0 0 8px 0; font-size: 0.98rem;">If you did not request this email, you can safely ignore it. This code will expire after a short time for your security.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background: #222; color: #fff; text-align: center; font-size: 0.95rem; padding: 18px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
  `;
  return html;
}

export default renderMagicLinkEmail;