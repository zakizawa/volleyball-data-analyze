import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log('受信したデータ:', data);

  // バリデーション・保存処理など必要に応じて追加
  return NextResponse.json({ message: '保存成功', data });
}
