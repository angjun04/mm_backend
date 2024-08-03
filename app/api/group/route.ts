import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search');

    if(!search) return NextResponse.json({error: "No search param"}, {status:400});
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    let { data: Groups, error } = await supabase
        .from('Groups')
        .select('*')
        .ilike('name',search!);
    
    if(error) return NextResponse.json({error: error}, {status:500});
    return NextResponse.json({data:Groups}, {status:200});
}

export async function POST(req:Request) {
    return NextResponse.json("this is api/group post");
}