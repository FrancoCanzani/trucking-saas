import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { sql } from '@vercel/postgres';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.WEBHOOK_SECRET || '');

    let evt: WebhookEvent;

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Error verifying webhook' },
        { status: 400 }
      );
    }

    // Handle the webhook
    switch (evt.type) {
      case 'user.created':
        await sql`
          INSERT INTO users (user_id, fullname, email)
          VALUES (${evt.data.id}, ${
          evt.data.first_name && evt.data.last_name
            ? `${evt.data.first_name} ${evt.data.last_name}`
            : evt.data.username || ''
        }, ${evt.data.email_addresses[0]?.email_address || ''})
          ON CONFLICT (user_id) DO UPDATE SET
            fullname = EXCLUDED.fullname,
            email = EXCLUDED.email,
            updated_at = CURRENT_TIMESTAMP;
        `;
        break;
      case 'user.updated':
        await sql`
          UPDATE users
          SET fullname = ${
            evt.data.first_name && evt.data.last_name
              ? `${evt.data.first_name} ${evt.data.last_name}`
              : evt.data.username || ''
          },
              email = ${evt.data.email_addresses[0]?.email_address || ''},
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${evt.data.id};
        `;
        break;
      case 'user.deleted':
        await sql`
          DELETE FROM users
          WHERE user_id = ${evt.data.id};
        `;
        break;
      default:
        console.log('Unhandled event type:', evt.type);
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
