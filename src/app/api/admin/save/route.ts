import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const FILE_PATH = 'src/lib/courses-data.ts';

export async function POST(request: Request) {
  try {
    const { courses } = await request.json();

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return NextResponse.json({ error: 'Missing GitHub config' }, { status: 500 });
    }

    // 1. Формуємо контент
    const fileContent = `export const courses = ${JSON.stringify(courses, null, 2)};`;
    const contentBase64 = Buffer.from(fileContent).toString('base64');

    // 2. Отримуємо SHA
    const getFileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const getResponse = await fetch(getFileUrl, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
      cache: 'no-store',
    });

    if (!getResponse.ok) throw new Error('Failed to fetch SHA');
    const fileData = await getResponse.json();

    // 3. Коміт
    const putResponse = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Admin Update',
        content: contentBase64,
        sha: fileData.sha,
        branch: 'main',
      }),
    });

    if (!putResponse.ok) throw new Error('GitHub Update Failed');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
