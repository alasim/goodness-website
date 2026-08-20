-- Publish the JWT secret to the database so PostgREST, GoTrue and the RLS helpers agree.
-- Adapted from the Supabase self-hosting bundle (docker/volumes/db/jwt.sql).
\set jwt_secret `echo "$JWT_SECRET"`
\set jwt_exp `echo "$JWT_EXP"`

ALTER DATABASE postgres SET "app.settings.jwt_secret" TO :'jwt_secret';
ALTER DATABASE postgres SET "app.settings.jwt_exp" TO :'jwt_exp';
