import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return NextResponse.json("this is api/group/establish test");
}

export async function POST(req:Request) {
    const {user_id, group_name, tags} = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: existingGroup, error: checkError } = await supabase
    .from('Groups')
    .select('id')
    .eq('name', group_name)
    .single();
    if (checkError && checkError.code !== 'PGRST116') return NextResponse.json({ error: checkError.message }, { status: 500 });
    if (existingGroup) return NextResponse.json({ error: 'Group name already exists' }, { status: 400 });
    const { data:groupInfo, error:err } = await supabase
    .from('Groups')
    .insert([
        {founder:user_id, name:group_name, tags:tags},
    ])
    .select()
    const { data:groupMember, error:error } = await supabase
    .from('GroupMembers')
    .insert([
        {group_id:groupInfo![0].group_id, user_id:user_id},
    ])
    .select()

    if(err||error) return NextResponse.json({error:err},{status:500});
    if(err) NextResponse.json({error: err}, {status:500});
    return NextResponse.json({data:groupInfo}, {status:200});
}

export async function DELETE(req: Request) {
  const { group_id } = await req.json();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Group 삭제
  const { data, error } = await supabase
    .from('Groups')
    .delete()
    .eq('id', group_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
}