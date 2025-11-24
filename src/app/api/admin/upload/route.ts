import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не знайдено' }, { status: 400 });
    }

    // Конвертуємо файл для GitHub
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString('base64');

    // Генеруємо унікальне ім'я
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const path = `public/images/${filename}`;

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      return NextResponse.json({ error: 'GitHub config missing' }, { status: 500 });
    }

    // Відправляємо на GitHub
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload image ${filename}`,
        content: content,
      })
    });

    if (!response.ok) throw new Error('Failed to upload to GitHub');

    // Повертаємо готове посилання
    return NextResponse.json({ url: `/images/${filename}` });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
