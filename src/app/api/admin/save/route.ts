import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = 'src/lib/courses-data.ts';

    if (!token || !owner || !repo) {
      return NextResponse.json({ error: 'GitHub config missing' }, { status: 500 });
    }

    // 1. Отримуємо SHA поточного файлу (вимога GitHub для перезапису)
    const getFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!getFile.ok) throw new Error('File not found on GitHub');
    
    const fileData = await getFile.json();

    // 2. Оновлюємо файл
    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update courses via Admin Panel',
        content: Buffer.from(content).toString('base64'), // Кодуємо в Base64
        sha: fileData.sha
      })
    });

    if (!updateResponse.ok) {
      const errText = await updateResponse.text();
      throw new Error(`GitHub Error: ${errText}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
