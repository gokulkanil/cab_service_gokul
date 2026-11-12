-- Public bucket for site photos (destinations, fleet, sharing image).
-- Anyone can view files by URL; only admins can upload, replace or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp'] -- no SVG: it can carry scripts
)
on conflict (id) do nothing;

create policy "Admins upload site media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins update site media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins delete site media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin());
