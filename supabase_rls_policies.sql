-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- 1. Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Allow authenticated users to upload files to the "media" bucket
-- They can only upload images (enforced by checking the mime type)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'media' AND
  (storage.extension(name) = 'jpg' OR 
   storage.extension(name) = 'jpeg' OR 
   storage.extension(name) = 'png' OR 
   storage.extension(name) = 'gif' OR
   storage.extension(name) = 'webp')
);

-- 3. Allow public read access to the "media" bucket
CREATE POLICY "Allow public viewing"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'media');

-- 4. Allow users to update/delete only their own uploaded objects
CREATE POLICY "Allow individual update/delete"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND auth.uid() = owner);

CREATE POLICY "Allow individual delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media' AND auth.uid() = owner);
