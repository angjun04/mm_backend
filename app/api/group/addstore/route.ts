import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return Response.json("this is api/group/enter get");
}

export async function POST(req:Request) {
    const {group_id, store_id} = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data:groupStore, error:err } = await supabase
    .from('GroupStores')
    .insert([
        {group_id:group_id, store_id:store_id},
    ])
    .select()
    if(err) return NextResponse.json({error:err},{status:500})
    return NextResponse.json({data:groupStore}, {status:200});
}