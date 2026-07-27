'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Textarea, Checkbox } from '@/components/ui/form';

export default function TestimonialEditor({ testimonial }: { testimonial: any }) {
  const router = useRouter();
  const isNew = !testimonial;
  
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    content: testimonial?.content || ''
  });

  const [imageId, setImageId] = useState<string | null>(testimonial?.imageId || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(testimonial?.image?.url || null);
  const [isActive, setIsActive] = useState(testimonial !== undefined ? (testimonial?.isActive ?? true) : true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error('Upload failed');
      const uploaded = await res.json();
      setImageId(uploaded.id);
      setPreviewUrl(uploaded.url);
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { ...formData, imageId, isActive };
      const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${testimonial.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Save failed');
      
      router.push('/admin/testimonials');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save testimonial');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isNew ? 'Add Testimonial' : 'Edit Testimonial'}
        </h1>
        <Button variant="outline" onClick={() => router.push('/admin/testimonials')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Input
                  required
                  type="text"
                  label="Reviewer Name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
                


                <Textarea
                  required
                  label="Review Content"
                  className="h-32"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter the testimonial review text..."
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Avatar Image</label>
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300 focus-within:ring-4 focus-within:ring-primary/10 transition-all rounded-xl p-4 flex flex-col items-center justify-center relative h-40 cursor-pointer">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-slate-400 text-sm text-center font-medium">Click to upload avatar</div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  </div>
                </div>

                <div className="pt-2">
                  <Checkbox
                    label="Active (Visible on site)"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                  />
                </div>


              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </div>
      </form>
    </div>
  );
}
