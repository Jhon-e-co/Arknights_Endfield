-- 允许用户删除自己的蓝图图片（通过文件名中的 user.id 判断）
DROP POLICY IF EXISTS "Users can delete their own blueprint images" ON storage.objects;
CREATE POLICY "Users can delete their own blueprint images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blueprints' AND 
    (name ~ ('^\\d+-' || auth.id || '\\.'))::boolean
  );

-- 允许 Admin 删除任何蓝图图片
DROP POLICY IF EXISTS "Admins can delete any blueprint images" ON storage.objects;
CREATE POLICY "Admins can delete any blueprint images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blueprints' AND 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
