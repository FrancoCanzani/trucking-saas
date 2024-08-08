import { sql } from "@vercel/postgres"
import { auth } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: { id: number } }) {
    const { userId } = await auth();

    const { rows } = await sql`
      SELECT 
        w.id AS website_id,
        w.user_id,
        w.url,
        w.check_interval,
        w.notify_email,
        w.created_at AS website_created_at,
        w.updated_at AS website_updated_at,
        hc.id AS health_check_id,
        hc.status,
        hc.response_time,
        hc.checked_at AS health_check_checked_at
      FROM 
        websites w
      LEFT JOIN 
        health_checks hc ON w.id = hc.website_id
      WHERE 
        w.user_id = ${userId}
        AND
        w.id = ${params.id}
    `;

    console.log(rows);
    
    return <div>My Post: {params.id}</div>
  }