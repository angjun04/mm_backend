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
    const { data:groupInfo, error:err } = await supabase
    .from('Groups')
    .insert([
        {founder:user_id, name:group_name, tags:tags},
    ])
    .select()
    if(err) NextResponse.json({error: err}, {status:500});
    return NextResponse.json({data:groupInfo}, {status:200});
}