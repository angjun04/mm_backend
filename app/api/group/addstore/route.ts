import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return NextResponse.json("this is api/group/addstore get");
}

export async function POST(req:Request) {
    const {group_id, store_id} = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: existingGroup, error: checkError } = await supabase
    .from('GroupStores')
    .select('store_id')
    .eq('group_id', group_id)
    .eq('store_id', store_id)
    .single();

    if (checkError && checkError.code !== 'PGRST116') return NextResponse.json({ error: checkError.message }, { status: 500 });
    if (existingGroup) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const { data:groupStore, error:err } = await supabase
    .from('GroupStores')
    .insert([
        {group_id:group_id, store_id:store_id},
    ])
    .select()
    if(err) return NextResponse.json({error:err},{status:500})
    return NextResponse.json({data:groupStore}, {status:200});
}

export async function DELETE(req: Request) {
    const { group_id, store_id } = await req.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  
    const { data, error } = await supabase
      .from('GroupStores')
      .delete()
      .eq('group_id', group_id)
      .eq('store_id', store_id);
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  }