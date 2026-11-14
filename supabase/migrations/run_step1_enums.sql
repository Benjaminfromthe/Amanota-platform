-- STEP 1: Extensions + ENUMs
create extension if not exists "uuid-ossp";

create type campus_type as enum ('masoro', 'gishushu');
create type user_role   as enum ('student', 'tutor');
create type tier_type   as enum ('recorded', 'online', 'campus', 'custom_location');
create type booking_status as enum ('pending', 'upcoming', 'completed', 'cancelled');
create type faculty_type as enum (
  'Software Engineering',
  'Networking',
  'Information Management',
  'Business',
  'Theology',
  'Nursing',
  'Education'
);
