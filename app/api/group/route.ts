import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let { data: Groups, error } = await supabase
        .from('Groups')
        .select('*')

    if(error) return NextResponse.json({ error: error }, { status: 500 });
    if(!Groups) return NextResponse.json({error: "internal server error"}, {status:200});
    // 각 그룹의 멤버 수를 계산
    const groupsWithPopulation = await Promise.all(Groups.map(async (group) => {
        const { count, error: countError } = await supabase
            .from('GroupMembers')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.group_id);

        if (countError) {
            console.error(`Error counting members for group ${group.id}:`, countError);
            return { ...group, population: 0 };
        }

        return { ...group, population: count };
    }));

    return NextResponse.json({ data: groupsWithPopulation }, { status: 200 });
}

export async function POST(req:Request) {
    return NextResponse.json("this is api/group post");
}