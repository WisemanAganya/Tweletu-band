import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload: (url: string) => void;
  path: string;
  accept?: string;
}

export function FileUpload({ onUpload, path, accept }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filePath = `${path}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);

      onUpload(publicUrl);
      setUploaded(true);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={uploading}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
        />
        <Button
          type="button"
          variant="outline"
          className={`w-full border-dashed border-zinc-800 h-24 flex flex-col gap-2 ${uploaded ? 'border-green-500/50 bg-green-500/5' : ''}`}
        >
          {uploading ? (
            <Loader2 className="animate-spin text-zinc-500" />
          ) : uploaded ? (
            <Check className="text-green-500" />
          ) : (
            <Upload className="text-zinc-500" />
          )}
          <span className="text-xs uppercase tracking-widest text-zinc-500">
            {uploading ? 'Uploading...' : uploaded ? 'Uploaded' : 'Click to Upload'}
          </span>
        </Button>
      </div>
    </div>
  );
}
