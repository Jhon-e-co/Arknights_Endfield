-- ==========================================
-- Storage RLS 策略补充
-- 解决图片上传和公开访问问题
-- ==========================================

-- 1. 允许公开读取 blueprints 桶的图片（解决图片显示问题）
CREATE POLICY "Public blueprints images are viewable by everyone"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'blueprints');

-- 2. 允许认证用户上传到 blueprints 桶（解决上传问题）
CREATE POLICY "Authenticated users can upload to blueprints bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blueprints');

-- 3. 允许公开读取 avatars 桶的图片
CREATE POLICY "Public avatars are viewable by everyone"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- 4. 允许认证用户上传到 avatars 桶
CREATE POLICY "Authenticated users can upload to avatars bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');
