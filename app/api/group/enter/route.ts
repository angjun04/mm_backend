import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return Response.json("this is api/group/enter get");
}

export async function POST(req:Request) {
    const {group_id, user_id} = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: existingGroup, error: checkError } = await supabase
    .from('GroupMembers')
    .select('user_id')
    .eq('group_id', group_id)
    .eq('user_id', user_id)
    .single();

    if (checkError && checkError.code !== 'PGRST116') return NextResponse.json({ error: checkError.message }, { status: 500 });
    if (existingGroup) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const { data:groupMember, error:err } = await supabase
    .from('GroupMembers')
    .insert([
        {group_id:group_id, user_id:user_id},
    ])
    .select()

    if(err) return NextResponse.json({error:err},{status:500});

    return NextResponse.json({data:groupMember}, {status:200});
}

export async function DELETE(req:Request) {
    const { group_id, user_id } = await req.json();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('Groups')
    .delete()
    .eq('group_id', group_id)
    .eq('user_id', user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User deleted from group successfully' }, { status: 200 });
}

