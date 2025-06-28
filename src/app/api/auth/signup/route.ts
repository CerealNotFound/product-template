import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  console.log(body);

  const { error, data } = await supabase.auth.signUp(body);

  if (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ user: data.user }), { status: 200 });
}
