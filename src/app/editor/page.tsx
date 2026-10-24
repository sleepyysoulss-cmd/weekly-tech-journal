import type { Metadata } from 'next';
import { isEditorAuthed, passcodeConfigured } from '@/lib/editor-auth';
import { EditorForm } from './EditorForm';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Editor · Weekly Tech Journal',
  robots: { index: false, follow: false },
};

// The passcode check runs on the server. Until it passes, the editor is never rendered.
export default async function EditorPage() {
  if (!passcodeConfigured()) return <LoginForm locked />;
  if (!(await isEditorAuthed())) return <LoginForm />;
  return <EditorForm />;
}
