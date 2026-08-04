'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Textarea, Checkbox } from '@/components/ui/form';
import { useRouter } from 'next/navigation';

type CountryItem = any;
type ImageItem = any;

export default function CountryEditor({
  country,
  images
}: {
  country: CountryItem | null;
  images: ImageItem[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localImages, setLocalImages] = useState(images);

  // Form State
  const [name, setName] = useState(country?.name || '');
  const [title, setTitle] = useState(country?.title || '');
  const [description, setDescription] = useState(country?.description || '');
  const [sortOrder, setSortOrder] = useState(country?.sortOrder || 0);
  const [isActive, setIsActive] = useState(country?.isActive ?? true);
  const [imageId, setImageId] = useState(country?.imageId || '');
  const [primaryColor, setPrimaryColor] = useState(country?.primaryColor || '');
  const [footerImageId, setFooterImageId] = useState(country?.footerImageId || '');
  const [heroDesktopImageId, setHeroDesktopImageId] = useState(country?.heroDesktopImageId || '');
  const [heroMobileImageId, setHeroMobileImageId] = useState(country?.heroMobileImageId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      title,
      description,
      sortOrder,
      isActive,
      imageId,
      primaryColor,
      footerImageId,
      heroDesktopImageId,
      heroMobileImageId
    };

    try {
      const url = country ? `/api/admin/countries/${country.id}` : '/api/admin/countries';
      const method = country ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save country');
      router.push('/admin/countries');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save country. Please check the inputs.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{country ? 'Edit Country' : 'Add New Country'}</h1>
          <p className="text-neutral-500 mt-1">{country ? 'Update destination details' : 'Create a new destination'}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/countries')}>
          Back to List
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                required
                type="text"
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. India"
              />
              <Input
                type="text"
                label="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. IND"
              />
            </div>

            <Textarea
              rows={4}
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the destination..."
            />

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Cover Image</label>
              <div className="space-y-4">
                {imageId && (
                  <div className="w-48 h-32 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100">
                    <img
                      src={localImages.find((img: any) => img.id === imageId)?.url || ''}
                      alt="Cover Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="relative max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData
                        });
                        if (!res.ok) throw new Error('Upload failed');
                        const newImage = await res.json();
                        setLocalImages(prev => [newImage, ...prev]);
                        setImageId(newImage.id);
                        router.refresh();
                      } catch (err) {
                        alert('Failed to upload image.');
                        console.error(err);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                  {isUploading && <p className="text-xs text-blue-600 mt-1 absolute -bottom-5">Uploading...</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Hero Desktop Image</label>
              <div className="space-y-4">
                {heroDesktopImageId && (
                  <div className="w-48 h-32 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100">
                    <img
                      src={localImages.find((img: any) => img.id === heroDesktopImageId)?.url || ''}
                      alt="Hero Desktop Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="relative max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData
                        });
                        if (!res.ok) throw new Error('Upload failed');
                        const newImage = await res.json();
                        setLocalImages(prev => [newImage, ...prev]);
                        setHeroDesktopImageId(newImage.id);
                        router.refresh();
                      } catch (err) {
                        alert('Failed to upload desktop hero image.');
                        console.error(err);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Hero Mobile Image</label>
              <div className="space-y-4">
                {heroMobileImageId && (
                  <div className="w-48 h-32 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100">
                    <img
                      src={localImages.find((img: any) => img.id === heroMobileImageId)?.url || ''}
                      alt="Hero Mobile Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="relative max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData
                        });
                        if (!res.ok) throw new Error('Upload failed');
                        const newImage = await res.json();
                        setLocalImages(prev => [newImage, ...prev]);
                        setHeroMobileImageId(newImage.id);
                        router.refresh();
                      } catch (err) {
                        alert('Failed to upload mobile hero image.');
                        console.error(err);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Primary Color</label>
              <input
                type="color"
                className="w-full h-10 px-1 py-1 bg-white border border-slate-200 rounded-xl cursor-pointer focus:outline-none transition-all"
                value={primaryColor || '#EAA923'}
                onChange={e => setPrimaryColor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Footer Image</label>
              <div className="space-y-4">
                {footerImageId && (
                  <div className="w-48 h-32 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100">
                    <img
                      src={localImages.find((img: any) => img.id === footerImageId)?.url || ''}
                      alt="Footer Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="relative max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData
                        });
                        if (!res.ok) throw new Error('Upload failed');
                        const newImage = await res.json();
                        setLocalImages(prev => [newImage, ...prev]);
                        setFooterImageId(newImage.id);
                        router.refresh();
                      } catch (err) {
                        alert('Failed to upload footer image.');
                        console.error(err);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Sort Order"
                value={sortOrder}
                onChange={e => setSortOrder(Number(e.target.value))}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Checkbox
                label="Active (Visible on site)"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100 mt-6">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/countries')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[150px]">
                {isSubmitting ? 'Saving...' : country ? 'Update Country' : 'Create Country'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
