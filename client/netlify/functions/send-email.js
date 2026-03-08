exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured — skipping email');
    return { statusCode: 200, headers, body: JSON.stringify({ skipped: true, message: 'Email not configured' }) };
  }

  try {
    const { to, senderName, messagePreview } = JSON.parse(event.body);

    if (!to || !senderName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DroidBRB <notifications@droidbrb.com>',
        to: [to],
        subject: `New message from ${senderName} on DroidBRB`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #111111;">DroidBRB</span>
            </div>
            <div style="background: #f8f8f6; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 15px; color: #111111; margin: 0 0 8px 0;">
                <strong>${senderName}</strong> sent you a message:
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.6;">
                "${messagePreview.length > 200 ? messagePreview.substring(0, 200) + '...' : messagePreview}"
              </p>
            </div>
            <div style="text-align: center;">
              <a href="https://droidbrb.com/messages"
                style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 100px; font-size: 14px; font-weight: 500;">
                View Message
              </a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px;">
              You received this because someone messaged you on DroidBRB.
            </p>
          </div>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return { statusCode: response.status, headers, body: JSON.stringify({ error: 'Failed to send email', details: result }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: result.id }) };
  } catch (error) {
    console.error('Email function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
