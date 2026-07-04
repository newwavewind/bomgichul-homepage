-- archive 버킷 파일 크기 상한을 MP4(100MB)에 맞춤
update storage.buckets
set file_size_limit = 104857600
where id = 'archive';
