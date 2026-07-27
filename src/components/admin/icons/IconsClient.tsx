'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/form';
import { useRouter } from 'next/navigation';

export default function IconsClient({ initialIcons }: { initialIcons: any[] }) {
  const [icons, setIcons] = useState(initialIcons);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this icon?')) {
      await fetch(`/api/admin/icons/${id}`, { method: 'DELETE' });
      setIcons(icons.filter(i => i.id !== id));
      router.refresh();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Image upload failed');
      const uploadedImage = await uploadRes.json();

      const res = await fetch('/api/admin/icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageId: uploadedImage.id }),
      });
      if (!res.ok) throw new Error('Icon creation failed');
      
      const newIcon = await res.json();
      setIcons([newIcon, ...icons]);
      setName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Icons Library</h1>
          <p className="text-neutral-500 mt-1">Manage and upload custom icons</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleUpload} className="flex gap-4 items-end flex-wrap md:flex-nowrap">
            <div className="flex-1 w-full md:w-auto">
              <Input
                required
                type="text"
                label="Icon Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Activity, Sun, Bed"
              />
            </div>
            <div className="space-y-1.5 flex-1 w-full md:w-auto">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Icon File (SVG, PNG)</label>
              <input
                required
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>
            <Button type="submit" disabled={isUploading} className="w-full md:w-auto h-[42px] px-6">
              {isUploading ? 'Uploading...' : 'Upload Icon'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {icons.map((icon) => (
          <Card key={icon.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow items-center p-4">
            <div className="w-16 h-16 relative mb-2 flex items-center justify-center">
              <img src={icon.image?.url} alt={icon.name} className="w-full h-full object-contain" />
            </div>
            <h3 className="font-medium text-sm text-center truncate w-full">{icon.name}</h3>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(icon.id)} className="text-red-500 hover:text-red-600 mt-2 w-full">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </Card>
        ))}
        {icons.length === 0 && <p className="text-neutral-500 col-span-full">No icons found. Upload one above.</p>}
      </div>
    </div>
  );
}
