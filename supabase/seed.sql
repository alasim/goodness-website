-- GOODNESS OS — seed data.
-- GENERATED FILE — do not edit by hand. Regenerate with: npm run gen:seed (in app/).
-- Source of truth: the prototype data modules at the repository root.

begin;

insert into public.organisations (id, name, slug, tagline, registration_ref) values
  ('org-goodness-society', 'Goodness Society', 'goodness-society', 'Together for a Better Tomorrow', 'Government-registered non-profit')
on conflict do nothing;

insert into public.countries (id, organisation_id, name, iso2, currency_code, currency_symbol, locale, is_default) values
  ('ctry-bd', 'org-goodness-society', 'Bangladesh', 'BD', 'BDT', '৳', 'en-BD', true)
on conflict do nothing;

insert into public.programs (slug, name, short_name, summary, color, bg_color, light_color, sort_order, is_operations) values
  ('education-career-readiness', 'Education & Career Readiness', 'Education & Careers', null, '#1B7A34', '#f0faf3', '#4DC86A', 0, false),
  ('ai-digital-skills', 'AI & Digital Skills Development', 'AI & Digital Skills', null, '#1565C0', '#e8f0fc', '#1976D2', 1, false),
  ('youth-empowerment', 'Youth Empowerment', 'Youth Empowerment', null, '#1B7A34', '#f0faf3', '#4DC86A', 2, false),
  ('community-development', 'Community Development', 'Community Development', null, '#1565C0', '#e8f0fc', '#1976D2', 3, false),
  ('innovation-social-good', 'Innovation for Social Good', 'Innovation', null, '#6B21A8', '#f5f0ff', '#9333EA', 4, false),
  ('operations', 'Operations & Administration', 'Operations', 'Running the organisation — the overhead every honest ledger shows.', '#4B5563', '#f7f9f8', '#9CA3AF', 90, true)
on conflict do nothing;

insert into public.projects (id, program_slug, chapter_id, name, year, summary) values
  ('prj-career-launch-2026', 'education-career-readiness', null, 'Career Launch 2026', 2026, null),
  ('prj-digital-bangladesh-skills-drive', 'ai-digital-skills', null, 'Digital Bangladesh Skills Drive', 2026, null),
  ('prj-youth-futures-2026', 'youth-empowerment', null, 'Youth Futures 2026', 2026, null),
  ('prj-khulna-ward-scorecard-2026', 'community-development', null, 'Khulna Ward Scorecard 2026', 2026, null),
  ('prj-open-impact-tools', 'innovation-social-good', null, 'Open Impact Tools', 2026, null),
  ('prj-running-the-organisation', 'operations', null, 'Running the organisation', 2026, null)
on conflict do nothing;

insert into public.chapters (id, country_id, parent_id, name, slug, type, status, city, division, since_label, coverage, story, campus_note, standards_done, standards_total) values
  ('chp-dhaka', 'ctry-bd', null, 'Goodness Dhaka', 'goodness-dhaka', 'district', 'active', 'Dhaka', 'Dhaka', 'Jan 2024', ARRAY['Dhaka', 'Gazipur', 'Narayanganj', 'Mymensingh']::text[], 'The founding chapter — where Goodness started and where national programmes are piloted.', null, 6, 6),
  ('chp-du', 'ctry-bd', 'chp-dhaka', 'Goodness University of Dhaka', 'goodness-university-of-dhaka', 'university', 'active', 'Dhaka', 'Dhaka', 'Feb 2026', '{}', 'Our first university chapter — students, faculty and campus venues powering Career Launch.', '26 campus volunteers · 210 service hours via the University of Dhaka Career Club partnership', 5, 6),
  ('chp-chattogram', 'ctry-bd', null, 'Goodness Chattogram', 'goodness-chattogram', 'district', 'active', 'Chattogram', 'Chattogram', 'Jun 2024', ARRAY['Chattogram', 'Cox''s Bazar', 'Cumilla']::text[], 'Port-city chapter focused on career readiness and digital certification cohorts.', null, 6, 6),
  ('chp-sylhet', 'ctry-bd', null, 'Goodness Sylhet', 'goodness-sylhet', 'district', 'active', 'Sylhet', 'Sylhet', 'Mar 2025', ARRAY['Sylhet']::text[], 'Flood-response and community development — our fastest mobilising chapter.', null, 6, 6),
  ('chp-rajshahi', 'ctry-bd', null, 'Goodness Rajshahi', 'goodness-rajshahi', 'district', 'active', 'Rajshahi', 'Rajshahi', 'Sep 2025', ARRAY['Rajshahi', 'Bogura', 'Rangpur', 'Dinajpur']::text[], 'Youth bootcamps and micro-grants across the north-west.', null, 6, 6),
  ('chp-khulna', 'ctry-bd', null, 'Goodness Khulna', 'goodness-khulna', 'district', 'active', 'Khulna', 'Khulna', 'Jan 2026', ARRAY['Khulna', 'Jashore', 'Barishal']::text[], 'Community scorecards and ward-level development in the south-west.', null, 4, 6),
  ('chp-cumilla', 'ctry-bd', null, 'Goodness Cumilla', 'goodness-cumilla', 'district', 'forming', 'Cumilla', 'Chattogram', 'Aug 2026', '{}', 'Community interest confirmed — leadership team being established with support from Goodness Chattogram.', null, 2, 6)
on conflict do nothing;

insert into public.chapter_goals (id, chapter_id, label, metric, target, period_label) values
  ('c79af4bd-2d62-5d73-94ee-1e55329ead7d', 'chp-dhaka', 'People supported', 'people', 800, '2026'),
  ('ca9691c0-3884-51cf-84aa-60e108c28e08', 'chp-dhaka', 'Verified service hours', 'hours', 600, '2026'),
  ('5a624a80-0090-5ae5-99ec-6562ce411cb0', 'chp-dhaka', 'Missions run', 'missions', 12, '2026'),
  ('f7b49d4b-03fd-5039-bc19-3c143aba590b', 'chp-dhaka', 'Active partners', 'partners', 5, '2026'),
  ('ea7d1e3d-ef71-5258-9266-1acca45fa24a', 'chp-du', 'Students reached on campus', 'people', 500, '2026'),
  ('a4d076af-f624-5183-a14e-59767aab818d', 'chp-du', 'Campus missions', 'missions', 6, '2026'),
  ('e81e3add-6829-5a8f-97fc-4225d246bc2d', 'chp-chattogram', 'People supported', 'people', 300, '2026'),
  ('68a83503-6957-5491-8ce5-2713a6a00539', 'chp-chattogram', 'Verified service hours', 'hours', 400, '2026'),
  ('f33608f8-ff9b-5fb8-890b-acaee3d250b3', 'chp-chattogram', 'Missions run', 'missions', 8, '2026'),
  ('71d927a7-6a5a-5f46-bbee-1a0a6926f140', 'chp-sylhet', 'People supported', 'people', 400, '2026'),
  ('a2e66f0e-f6e9-560d-9018-1ea55e579028', 'chp-sylhet', 'Missions run', 'missions', 10, '2026'),
  ('6f35bac0-e5fb-517b-af08-9addfd0260b9', 'chp-sylhet', 'Active partners', 'partners', 2, '2026'),
  ('a314ee38-7cef-5caf-b228-aa357c3b5f5a', 'chp-rajshahi', 'People supported', 'people', 300, '2026'),
  ('83b24494-c6f0-51a3-a66e-177790197871', 'chp-rajshahi', 'Verified service hours', 'hours', 350, '2026'),
  ('e75fcc75-6de3-5d2d-8aaa-dc5cd4998f94', 'chp-khulna', 'People supported', 'people', 250, '2026'),
  ('1eda7f59-a932-5901-9b3b-1868329c9a0c', 'chp-khulna', 'Missions run', 'missions', 6, '2026')
on conflict do nothing;

insert into public.profiles (id, user_id, slug, full_name, initials, avatar_color, role_title, program_slug, city, chapter_id, joined_month, quote, bio, skills, impact_stat, impact_label, level, featured, status, certificate_enabled, goodness_id, baseline_missions, baseline_hours, baseline_people, baseline_programs, email, phone, address, emergency_contact, id_document_ref, admin_notes) values
  ('8e684a3a-15d1-5999-abfc-7e4156191505', null, 'nusrat-j', 'Nusrat Jahan', 'NJ', 'green', 'AI Skills Trainer', 'ai-digital-skills', 'Dhaka', 'chp-dhaka', 'Jan 2024', 'Teaching someone to use AI tools is like handing them a superpower they never knew existed.', 'Nusrat is a machine learning engineer at a fintech company who spends her weekends training underserved youth in AI literacy. She has facilitated over 20 workshops and personally mentored 14 participants into tech jobs.', ARRAY['Machine Learning', 'Prompt Engineering', 'Facilitation', 'Python']::text[], '240+', 'Students trained', 'Team Lead', true, 'active', true, 'GS-1000', 26, 104, 240, 2, null, null, null, null, null, null),
  ('63ea6191-db78-5a42-b8f4-208fc3972d7f', null, 'tanvir-a', 'Tanvir Ahmed', 'TA', 'blue', 'Career Readiness Coach', 'education-career-readiness', 'Chattogram', 'chp-chattogram', 'Feb 2024', 'Every CV I review is someone''s dream waiting to be unlocked.', 'Tanvir is a senior HR professional with 10 years of experience in talent acquisition. He runs bi-weekly mock interview sessions and has helped over 60 graduates land their first formal employment.', ARRAY['Career Coaching', 'CV Writing', 'Interviewing', 'HR']::text[], '68', 'Job placements', 'Senior Volunteer', false, 'active', true, 'GS-1017', 13, 65, 68, 2, null, null, null, null, null, null),
  ('ca4edc48-13a1-51e1-b9fe-d4ff4d8bbb2c', null, 'sadia-i', 'Sadia Islam', 'SI', 'green', 'Youth Bootcamp Facilitator', 'youth-empowerment', 'Rajshahi', 'chp-rajshahi', 'Mar 2024', 'Young people don''t need saving — they need space, resources, and someone who believes in them.', 'Sadia is a social entrepreneur and founder of a women-led cooperative. She designs and facilitates weekend bootcamps focused on financial literacy and confidence-building for young women aged 16–25.', ARRAY['Facilitation', 'Financial Literacy', 'Public Speaking', 'Community Organizing']::text[], '3', 'Bootcamps delivered', 'Volunteer', false, 'active', false, 'GS-1034', 18, 108, 114, 3, null, null, null, null, null, null),
  ('872953d6-4328-53d2-b461-5770bf522614', null, 'rakibul-h', 'Rakibul Hasan', 'RH', 'blue', 'Community Liaison', 'community-development', 'Khulna', 'chp-khulna', 'Mar 2024', 'Real change doesn''t come from outside a community. It comes from within it.', 'Rakibul is a civil engineer and local government adviser who helps Goodness Society identify, scope, and execute community development projects in underserved areas of Khulna district.', ARRAY['Project Management', 'Community Engagement', 'Civil Engineering', 'Stakeholder Relations']::text[], '2', 'Projects launched', 'Volunteer', false, 'active', true, 'GS-1051', 22, 88, 151, 1, null, null, null, null, null, null),
  ('97af410c-ad7e-5b9d-a4e3-d1d2c508fd21', null, 'mehedi-h', 'Mehedi Hasan', 'MH', 'teal', 'Software Developer', 'innovation-social-good', 'Sylhet', 'chp-sylhet', 'Apr 2024', 'The best code I''ve ever written was for a cause — not a client.', 'Mehedi is a full-stack developer who contributes to open-source civic tech tools built under the Innovation for Social Good program. She led the development of the organization''s public impact dashboard.', ARRAY['React', 'Node.js', 'Open Source', 'UX Design']::text[], '1', 'Product shipped', 'Team Lead', false, 'active', true, 'GS-1068', 22, 110, 188, 2, null, null, null, null, null, null),
  ('33a7ee5d-9a62-5339-a286-4991d7b8c8f0', null, 'imran-k', 'Imran Kabir', 'IK', 'green', 'No-Code Automation Trainer', 'ai-digital-skills', 'Rangpur', 'chp-rajshahi', 'Apr 2024', 'You don''t need to code to automate your work. I''m proof of that.', 'Imran is a business process consultant who teaches entrepreneurs how to use no-code tools like Zapier, Notion, and Make to automate their daily workflows — freeing up time to focus on what matters.', ARRAY['No-Code', 'Automation', 'Zapier', 'Business Process']::text[], '85', 'Professionals trained', 'Volunteer', false, 'active', false, 'GS-1085', 14, 84, 85, 3, null, null, null, null, null, null),
  ('e4147d85-5631-565a-9312-098c232992dc', null, 'farhana-a', 'Farhana Akter', 'FA', 'blue', 'Mock Interview Coach', 'education-career-readiness', 'Barishal', 'chp-khulna', 'May 2024', 'Confidence is the most underrated skill on any resume.', 'Farhana is a communications manager who volunteers every Saturday running one-on-one mock interviews. She focuses on communication clarity, body language, and storytelling in interviews.', ARRAY['Coaching', 'Communication', 'Storytelling', 'Interview Prep']::text[], '112', 'Mock interviews done', 'Volunteer', false, 'active', true, 'GS-1102', 17, 68, 112, 1, null, null, null, null, null, null),
  ('0c55edf0-5fd2-54ce-b45f-04b9ba5f6f38', null, 'sabbir-r', 'Sabbir Rahman', 'SR', 'green', 'Mentorship Circle Lead', 'youth-empowerment', 'Dhaka', 'chp-dhaka', 'May 2024', 'A mentor''s job isn''t to give answers — it''s to ask better questions.', 'Sabbir is a product manager at a leading Dhaka-based startup who leads a monthly mentorship circle for 15 young professionals. His circle has grown a waitlist of over 80 people.', ARRAY['Mentorship', 'Product Management', 'Leadership', 'Networking']::text[], '15', 'Mentees guided', 'Senior Volunteer', false, 'active', true, 'GS-1119', 21, 105, 139, 2, null, null, null, null, null, null),
  ('bc3b0dec-7d04-5f3e-92e0-59c600ccd3d9', null, 'anika-t', 'Anika Tabassum', 'AT', 'teal', 'Research Partner', 'innovation-social-good', 'Mymensingh', 'chp-dhaka', 'Jun 2024', 'Data without context is just noise. My job is to find the signal.', 'Anika is a PhD researcher in public health who partners with Goodness Society to design impact measurement frameworks and analyse community well-being data for annual reports.', ARRAY['Research', 'Data Analysis', 'Public Health', 'Report Writing']::text[], '4', 'Impact reports co-authored', 'Volunteer', false, 'active', false, 'GS-1136', 21, 126, 176, 3, null, null, null, null, null, null),
  ('2d37b34f-aea4-5bb5-b887-be4dc621d372', null, 'shakib-m', 'Shakib Mahmud', 'SM', 'blue', 'Data Collector', 'community-development', 'Cumilla', 'chp-chattogram', 'Jun 2024', 'Every number in our reports represents a real person. I never forget that.', 'Shakib is a sociology graduate who leads field data collection in Cumilla district, designing survey instruments and coordinating community well-being assessments with local stakeholders.', ARRAY['Field Research', 'Survey Design', 'Community Relations', 'SPSS']::text[], '340', 'Households surveyed', 'Team Lead', false, 'active', true, 'GS-1153', 35, 140, 340, 1, null, null, null, null, null, null),
  ('5d6ced7c-fb99-58e7-bc22-cc2666ec2e63', null, 'nadia-s', 'Nadia Sultana', 'NS', 'green', 'Curriculum Designer', 'education-career-readiness', 'Bogura', 'chp-rajshahi', 'Jul 2024', 'Good curriculum doesn''t just teach skills — it changes how people see themselves.', 'Nadia is an instructional designer with 8 years of experience building e-learning content. She leads the redesign of Goodness Society''s career readiness curriculum to meet current employer expectations.', ARRAY['Curriculum Design', 'Instructional Design', 'E-learning', 'Assessment']::text[], '2', 'Curricula rebuilt', 'Senior Volunteer', false, 'active', true, 'GS-1170', 16, 80, 90, 2, null, null, null, null, null, null),
  ('4f18bc22-f979-57fd-bcc8-647ac8af89a4', null, 'arif-c', 'Arif Chowdhury', 'AC', 'teal', 'UX Designer', 'innovation-social-good', 'Dhaka', 'chp-dhaka', 'Aug 2024', 'Every interface I design has to be usable by someone who has never used the internet before.', 'Arif is a product designer who ensures that all digital tools built under the Innovation program are accessible, intuitive, and appropriate for low-literacy users in underserved communities.', ARRAY['UX Design', 'Figma', 'Accessibility', 'User Research']::text[], '3', 'Products designed', 'Volunteer', false, 'active', false, 'GS-1187', 20, 120, 127, 3, null, null, null, null, null, null),
  ('0d735c5d-ed84-5c80-a4ca-f61ffab239d3', null, 'tasnim-h', 'Tasnim Haque', 'TH', 'blue', 'Youth Micro-Grant Evaluator', 'youth-empowerment', 'Narayanganj', 'chp-dhaka', 'Aug 2024', 'Some of the best business ideas I''ve ever seen came from teenagers with ৳50,000 budgets.', 'Tasnim is an investor and startup advisor who evaluates youth micro-grant applications, providing written feedback to every applicant regardless of outcome — because she believes feedback is a gift.', ARRAY['Business Evaluation', 'Startup Advisory', 'Mentorship', 'Finance']::text[], '24', 'Grants evaluated', 'Volunteer', false, 'active', true, 'GS-1204', 20, 80, 164, 1, null, null, null, null, null, null),
  ('594536bf-f83d-57ef-bad7-225c11555e6d', null, 'rashedul-a', 'Rashedul Alam', 'RA', 'green', 'AI Literacy Facilitator', 'ai-digital-skills', 'Cox''s Bazar', 'chp-chattogram', 'Sep 2024', 'AI isn''t coming for our jobs — but people who understand AI might.', 'Rashedul teaches AI awareness sessions to market traders and small business owners in Cox''s Bazar, helping them understand and use simple AI tools to improve their operations.', ARRAY['AI Literacy', 'Adult Education', 'Bangla Language', 'Business Training']::text[], '160', 'Business owners reached', 'Senior Volunteer', false, 'active', true, 'GS-1221', 20, 100, 160, 2, null, null, null, null, null, null),
  ('b438a36d-bc76-5533-8a6f-6bda7863a932', null, 'sumaiya-k', 'Sumaiya Khatun', 'SK', 'blue', 'Event Organiser', 'community-development', 'Jashore', 'chp-khulna', 'Oct 2024', 'A well-run community event can shift the entire energy of a neighbourhood.', 'Sumaiya coordinates logistics for all community development events in Jashore district — from site selection to vendor management to post-event impact documentation.', ARRAY['Event Management', 'Logistics', 'Volunteer Coordination', 'Budgeting']::text[], '6', 'Events organised', 'Team Lead', false, 'active', false, 'GS-1238', 15, 90, 78, 3, null, null, null, null, null, null),
  ('aa401f30-232e-54ce-b073-796d45f28b1e', null, 'jubayer-k', 'Jubayer Karim', 'JK', 'teal', 'Portfolio Lab Mentor', 'education-career-readiness', 'Gazipur', 'chp-dhaka', 'Oct 2024', 'Your portfolio is your autobiography. Make it worth reading.', 'Jubayer is a senior graphic designer who runs weekly Portfolio Lab sessions helping young creatives build compelling portfolios that get them noticed by agencies and hiring managers.', ARRAY['Graphic Design', 'Portfolio Building', 'Adobe Suite', 'Personal Branding']::text[], '38', 'Portfolios built', 'Volunteer', false, 'active', true, 'GS-1255', 12, 48, 38, 1, null, null, null, null, null, null),
  ('de9916fc-e315-5c23-a78f-f4699f315195', null, 'maliha-z', 'Maliha Zaman', 'MZ', 'green', 'Social Innovation Advisor', 'innovation-social-good', 'Dinajpur', 'chp-rajshahi', 'Nov 2024', 'The best social innovations aren''t built in boardrooms — they''re built in communities.', 'Maliha has spent 12 years working in international development across South Asia. She advises the Innovation team on strategy, impact measurement, and stakeholder alignment.', ARRAY['Social Innovation', 'Strategy', 'International Development', 'Impact Measurement']::text[], '2', 'Innovations advised', 'Senior Volunteer', false, 'active', true, 'GS-1272', 19, 95, 152, 2, null, null, null, null, null, null),
  ('fc62d6ff-8574-5c93-ac00-58ca854feb38', null, 'asif-m', 'Asif Mahmud', 'AM', 'blue', 'Civic Engagement Trainer', 'community-development', 'Dhaka', 'chp-dhaka', 'Nov 2024', 'Most people don''t vote because nobody ever explained why it matters. That''s what I fix.', 'Asif is a lawyer and civic education advocate who designs and delivers workshops helping communities understand their rights, civic responsibilities, and how to engage with local government.', ARRAY['Civic Education', 'Law', 'Public Speaking', 'Community Organizing']::text[], '500+', 'People civically trained', 'Volunteer', false, 'active', false, 'GS-1289', 44, 264, 500, 3, null, null, null, null, null, null)
on conflict do nothing;

insert into public.member_roles (id, profile_id, role, chapter_id) values
  ('6a4c582c-5161-5aff-a461-916d6e686b46', '8e684a3a-15d1-5999-abfc-7e4156191505', 'chapter_lead', 'chp-dhaka'),
  ('c76b0d68-5e24-5b21-b198-31d2d46f3a33', '0c55edf0-5fd2-54ce-b45f-04b9ba5f6f38', 'team_lead', 'chp-dhaka'),
  ('7dc78d2a-a555-502f-9ebb-11c3c946fbd2', '4f18bc22-f979-57fd-bcc8-647ac8af89a4', 'team_lead', 'chp-dhaka'),
  ('e2eb9d07-a5aa-536d-956f-5984576ee250', 'fc62d6ff-8574-5c93-ac00-58ca854feb38', 'volunteer', 'chp-dhaka'),
  ('877c6372-6a02-527f-904f-448124c7c0b0', 'b438a36d-bc76-5533-8a6f-6bda7863a932', 'chapter_lead', 'chp-du'),
  ('7ec35bc9-f997-594b-9819-110b8f87b15a', '63ea6191-db78-5a42-b8f4-208fc3972d7f', 'chapter_lead', 'chp-chattogram'),
  ('b6d9c997-969e-5220-bd97-b3ce93ad3971', '2d37b34f-aea4-5bb5-b887-be4dc621d372', 'team_lead', 'chp-chattogram'),
  ('55343ab4-90f7-5ccf-8f8d-0c075bf366c6', '97af410c-ad7e-5b9d-a4e3-d1d2c508fd21', 'chapter_lead', 'chp-sylhet'),
  ('3deff8a9-36c7-58f6-9779-e952aa2b5816', 'e4147d85-5631-565a-9312-098c232992dc', 'team_lead', 'chp-sylhet'),
  ('fe16f598-8bd7-5851-a005-f34c36ef02d2', 'ca4edc48-13a1-51e1-b9fe-d4ff4d8bbb2c', 'chapter_lead', 'chp-rajshahi'),
  ('6261606b-2873-5d76-ad64-a7516c96d876', '5d6ced7c-fb99-58e7-bc22-cc2666ec2e63', 'team_lead', 'chp-rajshahi'),
  ('ee5425c2-8890-5b1e-9554-4a42b3fea78c', '872953d6-4328-53d2-b461-5770bf522614', 'chapter_lead', 'chp-khulna')
on conflict do nothing;

insert into public.credentials (id, profile_id, ref, title, program_slug, service_summary, issued_label, status, download_enabled, revoked_reason) values
  ('crd-gs-vol-2024-0100', '8e684a3a-15d1-5999-abfc-7e4156191505', 'GS-VOL-2024-0100', 'Certificate of Volunteer Service', 'ai-digital-skills', '104 verified service hours across 26 missions', 'Jan 2024', 'valid', true, null),
  ('crd-gs-crd-2024-0400', '8e684a3a-15d1-5999-abfc-7e4156191505', 'GS-CRD-2024-0400', 'AI Literacy Trainer', 'ai-digital-skills', 'Facilitator credential — AI & Digital Skills Development', 'Sep 2024', 'valid', true, null),
  ('crd-gs-crd-2024-0700', '8e684a3a-15d1-5999-abfc-7e4156191505', 'GS-CRD-2024-0700', 'Volunteer Leadership', 'ai-digital-skills', 'Leadership credential — team coordination and mission delivery', 'Nov 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0103', '63ea6191-db78-5a42-b8f4-208fc3972d7f', 'GS-VOL-2024-0103', 'Certificate of Volunteer Service', 'education-career-readiness', '65 verified service hours across 13 missions', 'Feb 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0106', 'ca4edc48-13a1-51e1-b9fe-d4ff4d8bbb2c', 'GS-VOL-2024-0106', 'Certificate of Volunteer Service', 'youth-empowerment', '108 verified service hours across 18 missions', 'Mar 2024', 'valid', false, null),
  ('crd-gs-vol-2024-0109', '872953d6-4328-53d2-b461-5770bf522614', 'GS-VOL-2024-0109', 'Certificate of Volunteer Service', 'community-development', '88 verified service hours across 22 missions', 'Mar 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0112', '97af410c-ad7e-5b9d-a4e3-d1d2c508fd21', 'GS-VOL-2024-0112', 'Certificate of Volunteer Service', 'innovation-social-good', '110 verified service hours across 22 missions', 'Apr 2024', 'valid', true, null),
  ('crd-gs-crd-2024-0704', '97af410c-ad7e-5b9d-a4e3-d1d2c508fd21', 'GS-CRD-2024-0704', 'Volunteer Leadership', 'innovation-social-good', 'Leadership credential — team coordination and mission delivery', 'Nov 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0115', '33a7ee5d-9a62-5339-a286-4991d7b8c8f0', 'GS-VOL-2024-0115', 'Certificate of Volunteer Service', 'ai-digital-skills', '84 verified service hours across 14 missions', 'Apr 2024', 'valid', false, null),
  ('crd-gs-crd-2024-0405', '33a7ee5d-9a62-5339-a286-4991d7b8c8f0', 'GS-CRD-2024-0405', 'AI Literacy Trainer', 'ai-digital-skills', 'Facilitator credential — AI & Digital Skills Development', 'Sep 2024', 'valid', false, null),
  ('crd-gs-vol-2024-0118', 'e4147d85-5631-565a-9312-098c232992dc', 'GS-VOL-2024-0118', 'Certificate of Volunteer Service', 'education-career-readiness', '68 verified service hours across 17 missions', 'May 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0121', '0c55edf0-5fd2-54ce-b45f-04b9ba5f6f38', 'GS-VOL-2024-0121', 'Certificate of Volunteer Service', 'youth-empowerment', '105 verified service hours across 21 missions', 'May 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0124', 'bc3b0dec-7d04-5f3e-92e0-59c600ccd3d9', 'GS-VOL-2024-0124', 'Certificate of Volunteer Service', 'innovation-social-good', '126 verified service hours across 21 missions', 'Jun 2024', 'valid', false, null),
  ('crd-gs-vol-2024-0127', '2d37b34f-aea4-5bb5-b887-be4dc621d372', 'GS-VOL-2024-0127', 'Certificate of Volunteer Service', 'community-development', '140 verified service hours across 35 missions', 'Jun 2024', 'valid', true, null),
  ('crd-gs-crd-2024-0709', '2d37b34f-aea4-5bb5-b887-be4dc621d372', 'GS-CRD-2024-0709', 'Volunteer Leadership', 'community-development', 'Leadership credential — team coordination and mission delivery', 'Nov 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0130', '5d6ced7c-fb99-58e7-bc22-cc2666ec2e63', 'GS-VOL-2024-0130', 'Certificate of Volunteer Service', 'education-career-readiness', '80 verified service hours across 16 missions', 'Jul 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0133', '4f18bc22-f979-57fd-bcc8-647ac8af89a4', 'GS-VOL-2024-0133', 'Certificate of Volunteer Service', 'innovation-social-good', '120 verified service hours across 20 missions', 'Aug 2024', 'valid', false, null),
  ('crd-gs-vol-2024-0136', '0d735c5d-ed84-5c80-a4ca-f61ffab239d3', 'GS-VOL-2024-0136', 'Certificate of Volunteer Service', 'youth-empowerment', '80 verified service hours across 20 missions', 'Aug 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0139', '594536bf-f83d-57ef-bad7-225c11555e6d', 'GS-VOL-2024-0139', 'Certificate of Volunteer Service', 'ai-digital-skills', '100 verified service hours across 20 missions', 'Sep 2024', 'valid', true, null),
  ('crd-gs-crd-2024-0413', '594536bf-f83d-57ef-bad7-225c11555e6d', 'GS-CRD-2024-0413', 'AI Literacy Trainer', 'ai-digital-skills', 'Facilitator credential — AI & Digital Skills Development', 'Sep 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0142', 'b438a36d-bc76-5533-8a6f-6bda7863a932', 'GS-VOL-2024-0142', 'Certificate of Volunteer Service', 'community-development', '90 verified service hours across 15 missions', 'Oct 2024', 'valid', false, null),
  ('crd-gs-crd-2024-0714', 'b438a36d-bc76-5533-8a6f-6bda7863a932', 'GS-CRD-2024-0714', 'Volunteer Leadership', 'community-development', 'Leadership credential — team coordination and mission delivery', 'Nov 2024', 'valid', false, null),
  ('crd-gs-vol-2024-0145', 'aa401f30-232e-54ce-b073-796d45f28b1e', 'GS-VOL-2024-0145', 'Certificate of Volunteer Service', 'education-career-readiness', '48 verified service hours across 12 missions', 'Oct 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0148', 'de9916fc-e315-5c23-a78f-f4699f315195', 'GS-VOL-2024-0148', 'Certificate of Volunteer Service', 'innovation-social-good', '95 verified service hours across 19 missions', 'Nov 2024', 'valid', true, null),
  ('crd-gs-vol-2024-0151', 'fc62d6ff-8574-5c93-ac00-58ca854feb38', 'GS-VOL-2024-0151', 'Certificate of Volunteer Service', 'community-development', '264 verified service hours across 44 missions', 'Nov 2024', 'valid', false, null)
on conflict do nothing;

insert into public.chapter_team (id, chapter_id, profile_id, person_name, role, since_label, until_label) values
  ('2a327d14-0724-5aef-9edf-18e805803236', 'chp-dhaka', '8e684a3a-15d1-5999-abfc-7e4156191505', null, 'Chapter Lead', 'Jan 2026', null),
  ('689e060e-ef42-5a59-a47d-96f64a6bcbcf', 'chp-dhaka', '0c55edf0-5fd2-54ce-b45f-04b9ba5f6f38', null, 'Operations Lead', 'Mar 2026', null),
  ('76322b73-e8e3-55d9-a81c-7a4e8c61fb48', 'chp-dhaka', '4f18bc22-f979-57fd-bcc8-647ac8af89a4', null, 'People Lead', 'Mar 2026', null),
  ('0a5106d9-a843-5efb-84a7-0af14b4a43e7', 'chp-dhaka', 'fc62d6ff-8574-5c93-ac00-58ca854feb38', null, 'Finance & Trust contact', 'Jun 2026', null),
  ('c7fd8254-b43e-5b42-a83d-0f2678a4be6f', 'chp-dhaka', null, 'Tanvir Ahmed', 'Founding Chapter Lead', '2024–2025', '2024–2025'),
  ('eacd86d9-9b52-5b44-b21e-ce0d9891f143', 'chp-du', 'b438a36d-bc76-5533-8a6f-6bda7863a932', null, 'Campus Lead', 'Feb 2026', null),
  ('326aca9d-cb73-5740-b9d5-45feb42f182c', 'chp-chattogram', '63ea6191-db78-5a42-b8f4-208fc3972d7f', null, 'Chapter Lead', 'Jun 2024', null),
  ('d2feefd5-418f-5617-a00b-0e15d50b646c', 'chp-chattogram', '2d37b34f-aea4-5bb5-b887-be4dc621d372', null, 'Operations Lead', 'Jan 2026', null),
  ('25eec689-1f1a-59ee-9e71-316239e87cbc', 'chp-sylhet', '97af410c-ad7e-5b9d-a4e3-d1d2c508fd21', null, 'Chapter Lead', 'Mar 2025', null),
  ('1f30449c-03fe-54fa-8b4c-309cc05e8f2f', 'chp-sylhet', 'e4147d85-5631-565a-9312-098c232992dc', null, 'People Lead', 'Feb 2026', null),
  ('e462e297-cc3a-5702-826a-e5add9b9db50', 'chp-rajshahi', 'ca4edc48-13a1-51e1-b9fe-d4ff4d8bbb2c', null, 'Chapter Lead', 'Sep 2025', null),
  ('2da9cea3-7751-599b-8674-5ae8e7a3245c', 'chp-rajshahi', '5d6ced7c-fb99-58e7-bc22-cc2666ec2e63', null, 'Operations Lead', 'Apr 2026', null),
  ('37ad9363-089d-5fa8-a247-567740beca6c', 'chp-khulna', '872953d6-4328-53d2-b461-5770bf522614', null, 'Chapter Lead', 'Jan 2026', null)
on conflict do nothing;

insert into public.missions (id, title, program_slug, project_id, chapter_id, scope, venue, date_label, time_label, starts_at, hours, impact_target, summary, status, priority, participation, lead_profile_id, lead_name, seed_filled, published) values
  ('msn-dhaka-digital-01', 'Teach Digital Skills to 30 Students', 'ai-digital-skills', null, 'chp-dhaka', 'chapter', 'Mirpur Community Centre, Dhaka', 'Sat 29 Aug 2026', '10:00 AM – 3:00 PM', null, 5, '30 students complete foundational AI training', 'A one-day foundation workshop introducing school students to practical AI tools, safe internet use, and basic digital productivity.', 'open', 'normal', 'onsite', '8e684a3a-15d1-5999-abfc-7e4156191505', 'Nusrat Jahan', 5, true),
  ('msn-ctg-career-01', 'CV Clinic & Mock Interviews', 'education-career-readiness', null, 'chp-chattogram', 'chapter', 'Agrabad Public Library, Chattogram', 'Sat 5 Sep 2026', '9:30 AM – 1:30 PM', null, 4, '60 graduates leave with a reviewed CV and interview feedback', 'Rotating one-to-one sessions where volunteers review CVs and run short mock interviews with recent graduates.', 'open', 'normal', 'onsite', '63ea6191-db78-5a42-b8f4-208fc3972d7f', 'Tanvir Ahmed', 6, true),
  ('msn-sylhet-flood-01', 'Flood Relief Packing Drive', 'community-development', null, 'chp-sylhet', 'chapter', 'GS Warehouse, Zindabazar, Sylhet', 'Sun 30 Aug 2026', '8:00 AM – 12:00 PM', null, 4, '400 family relief packs prepared and dispatched', 'Urgent packing and dispatch of dry food, water purification tablets, and hygiene kits for flood-affected families in Sunamganj.', 'open', 'urgent', 'onsite', '97af410c-ad7e-5b9d-a4e3-d1d2c508fd21', 'Mehedi Hasan', 32, true),
  ('msn-remote-design-01', 'Design Campaign Materials (Remote)', 'innovation-social-good', null, null, 'chapter', 'Remote — work from anywhere', 'Flexible · complete by 12 Sep 2026', 'Est. 4 hours total', null, 4, 'Full campaign kit for the youth education drive', 'Design social posts, a leaflet, and a banner for an upcoming education campaign. Brand kit and copy provided.', 'open', 'normal', 'remote', '4f18bc22-f979-57fd-bcc8-647ac8af89a4', 'Arif Chowdhury', 1, true),
  ('msn-rajshahi-youth-01', 'Youth Skills Bootcamp — Day 1', 'youth-empowerment', null, 'chp-rajshahi', 'chapter', 'Rajshahi University Auditorium', 'Fri 11 Sep 2026', '9:00 AM – 4:00 PM', null, 7, '80 young people complete financial literacy module', 'Opening day of the weekend bootcamp covering financial literacy, communication, and confidence building for ages 16–25.', 'open', 'normal', 'onsite', 'ca4edc48-13a1-51e1-b9fe-d4ff4d8bbb2c', 'Sadia Islam', 9, true),
  ('msn-khulna-community-01', 'Community Needs Assessment Survey', 'community-development', null, 'chp-khulna', 'chapter', 'Rupsha ward, Khulna', 'Sat 22 Aug 2026', '9:00 AM – 2:00 PM', null, 5, '150 households surveyed for the ward scorecard', 'Door-to-door structured survey collecting health, education, and livelihood indicators for the annual community scorecard.', 'completed', 'normal', 'onsite', '872953d6-4328-53d2-b461-5770bf522614', 'Rakibul Hasan', 12, true)
on conflict do nothing;

insert into public.mission_roles (id, mission_id, role, need, skills, sort_order) values
  ('msn-dhaka-digital-01-role-1', 'msn-dhaka-digital-01', 'Trainer', 2, ARRAY['Facilitation', 'AI Literacy']::text[], 0),
  ('msn-dhaka-digital-01-role-2', 'msn-dhaka-digital-01', 'Photographer', 1, ARRAY['Photography']::text[], 1),
  ('msn-dhaka-digital-01-role-3', 'msn-dhaka-digital-01', 'Support Volunteer', 3, '{}', 2),
  ('msn-ctg-career-01-role-1', 'msn-ctg-career-01', 'CV Reviewer', 4, ARRAY['CV Writing', 'HR']::text[], 0),
  ('msn-ctg-career-01-role-2', 'msn-ctg-career-01', 'Mock Interview Coach', 3, ARRAY['Coaching', 'Communication']::text[], 1),
  ('msn-ctg-career-01-role-3', 'msn-ctg-career-01', 'Registration Desk', 2, '{}', 2),
  ('msn-sylhet-flood-01-role-1', 'msn-sylhet-flood-01', 'Packing Volunteer', 30, '{}', 0),
  ('msn-sylhet-flood-01-role-2', 'msn-sylhet-flood-01', 'Logistics Coordinator', 4, ARRAY['Logistics']::text[], 1),
  ('msn-sylhet-flood-01-role-3', 'msn-sylhet-flood-01', 'Data Collector', 6, ARRAY['Survey Design']::text[], 2),
  ('msn-remote-design-01-role-1', 'msn-remote-design-01', 'Graphic Designer', 2, ARRAY['Graphic Design', 'Figma']::text[], 0),
  ('msn-remote-design-01-role-2', 'msn-remote-design-01', 'Copy Reviewer', 1, ARRAY['Communication']::text[], 1),
  ('msn-rajshahi-youth-01-role-1', 'msn-rajshahi-youth-01', 'Bootcamp Facilitator', 4, ARRAY['Facilitation', 'Financial Literacy']::text[], 0),
  ('msn-rajshahi-youth-01-role-2', 'msn-rajshahi-youth-01', 'Youth Mentor', 6, ARRAY['Mentorship']::text[], 1),
  ('msn-rajshahi-youth-01-role-3', 'msn-rajshahi-youth-01', 'Support Volunteer', 4, '{}', 2),
  ('msn-khulna-community-01-role-1', 'msn-khulna-community-01', 'Field Surveyor', 10, ARRAY['Field Research']::text[], 0),
  ('msn-khulna-community-01-role-2', 'msn-khulna-community-01', 'Community Liaison', 2, ARRAY['Community Engagement']::text[], 1)
on conflict do nothing;

insert into public.impact_records (id, mission_id, program_slug, project_id, chapter_id, title, project_label, date_label, published, unit, unit_label, primary_value, beneficiaries, measurement_due_label) values
  ('imp-khulna-survey-2026', 'msn-khulna-community-01', 'community-development', 'prj-khulna-ward-scorecard-2026', 'chp-khulna', 'Community Needs Assessment — Rupsha ward', 'Khulna Ward Scorecard 2026', 'Aug 2026', true, 'households', 'households surveyed', 162, 150, null),
  ('imp-career-bootcamp-2026', null, 'education-career-readiness', 'prj-career-launch-2026', 'chp-dhaka', 'Career Bootcamp — Dhaka Cohort 01', 'Career Launch 2026', 'Jun 2026', true, 'people', 'people supported', 120, 120, null),
  ('imp-ai-literacy-2026', null, 'ai-digital-skills', 'prj-digital-bangladesh-skills-drive', null, 'AI Literacy Workshops — 8 districts', 'Digital Bangladesh Skills Drive', 'May 2026', true, 'people', 'people supported', 486, 486, null),
  ('imp-youth-bootcamp-2026', null, 'youth-empowerment', 'prj-youth-futures-2026', 'chp-rajshahi', 'Youth Skills Bootcamp — Rajshahi', 'Youth Futures 2026', 'Apr 2026', true, 'youth', 'young people supported', 201, 201, null),
  ('imp-innovation-lab-2026', null, 'innovation-social-good', 'prj-open-impact-tools', 'chp-dhaka', 'Tech for Good Lab — first cohort', 'Open Impact Tools', 'Jul 2026', true, 'tools', 'tools deployed', 2, 86, null),
  ('imp-ai-cohort-nov-2026', null, 'ai-digital-skills', 'prj-digital-bangladesh-skills-drive', 'chp-chattogram', 'Digital Skills Certification — Cohort 04', 'Digital Bangladesh Skills Drive', 'Aug 2026', true, 'people', 'people supported', 80, 80, null),
  ('imp-dhaka-draft-2026', null, 'ai-digital-skills', 'prj-digital-bangladesh-skills-drive', 'chp-dhaka', 'School Digital Corner — Mirpur (draft)', 'Digital Bangladesh Skills Drive', 'Aug 2026', false, 'students', 'students supported', 30, 30, null)
on conflict do nothing;

insert into public.impact_outputs (id, record_id, label, value, target, sort_order) values
  ('1e74bf06-637d-5001-9a6b-abe43a87698b', 'imp-khulna-survey-2026', 'Households surveyed', 162, 150, 0),
  ('d771ac07-5712-5525-a95d-9be4a9d08a39', 'imp-khulna-survey-2026', 'Volunteer hours contributed', 60, 60, 1),
  ('a215b8cc-b88b-58bd-9f9f-992ae3d77726', 'imp-khulna-survey-2026', 'Ward scorecards produced', 1, 1, 2),
  ('145c537a-d654-52a6-9778-506f725dce0d', 'imp-career-bootcamp-2026', 'Participants enrolled', 120, 120, 0),
  ('ea5cfcdd-a631-51c3-bec1-781abd704034', 'imp-career-bootcamp-2026', 'Participants completed', 104, 110, 1),
  ('cfbac856-5544-5d2c-81d5-0a7f95df3364', 'imp-career-bootcamp-2026', 'CVs reviewed', 118, 120, 2),
  ('9f74a1b1-8030-532f-94dc-2b33ba825e9b', 'imp-career-bootcamp-2026', 'Mock interviews delivered', 96, 90, 3),
  ('5fa9ffe0-ec12-524c-a943-004d1a19a998', 'imp-ai-literacy-2026', 'Workshops delivered', 22, 20, 0),
  ('da546461-c78b-5f44-aaa4-7c28d97480eb', 'imp-ai-literacy-2026', 'Participants trained', 486, 450, 1),
  ('4f5071bc-4c65-5ac0-a276-ff4158bd4d64', 'imp-ai-literacy-2026', 'Districts reached', 8, 6, 2),
  ('bffb7874-e24c-58b1-9a8c-eab5623e8967', 'imp-youth-bootcamp-2026', 'Young people attending', 201, 180, 0),
  ('6ca4a21a-cd15-534d-a4f5-19e75bb3f64a', 'imp-youth-bootcamp-2026', 'Financial literacy modules run', 6, 6, 1),
  ('7fb6ad55-b501-50fa-9a69-b0d19c016a4a', 'imp-youth-bootcamp-2026', 'Micro-grants awarded', 12, 15, 2),
  ('4e4fbe4e-22d6-5dbd-a8d5-a8efaf4c9041', 'imp-innovation-lab-2026', 'Prototypes built', 5, 4, 0),
  ('98f2bcbc-9736-5be2-a455-56450c28472c', 'imp-innovation-lab-2026', 'Open-source tools published', 2, 2, 1),
  ('86c9bd88-92bf-53a0-98b5-67564e24d04a', 'imp-innovation-lab-2026', 'Contributors involved', 31, 25, 2),
  ('ab327685-d9d2-5a5c-b730-b2c5584adeed', 'imp-ai-cohort-nov-2026', 'Participants enrolled', 80, 80, 0),
  ('6c00d64b-c28b-5516-87d0-1ae5487d06e8', 'imp-ai-cohort-nov-2026', 'Participants certified', 71, 70, 1),
  ('930fae0a-0e91-533e-964c-b5f030e5b49d', 'imp-ai-cohort-nov-2026', 'Training hours delivered', 240, 240, 2),
  ('98c5197c-6559-5df0-97c1-d1ab49c12fc0', 'imp-dhaka-draft-2026', 'Students attending', 30, 30, 0),
  ('ea79fe0d-413d-5f02-be71-a98f5858c6b8', 'imp-dhaka-draft-2026', 'Devices set up', 6, 8, 1)
on conflict do nothing;

insert into public.impact_outcomes (id, record_id, label, value, basis, note, evidence_label, due_label, sort_order) values
  ('ae66b952-7b8a-5ddc-91d1-95a573f7c085', 'imp-khulna-survey-2026', 'Priority needs formally documented', 4, 'observed', 'Water access, girls'' schooling, drainage, waste collection', 'Ward council minutes', null, 0),
  ('3ee61c64-fd5b-5bc5-98ac-75570384a7d9', 'imp-khulna-survey-2026', 'Council commitments secured', 2, 'verified', 'Ward council agreed to fund drainage repair and a waste pickup route', 'Ward council minutes', null, 1),
  ('942c398e-f08d-5358-a58e-b274c09d45f0', 'imp-career-bootcamp-2026', 'Interviewed within 90 days', 73, 'self-reported', '70% of those who completed the programme, from the exit survey', 'Cohort exit survey', null, 0),
  ('c2c9022e-51a9-5f3c-a9bc-4cc61af64bb1', 'imp-career-bootcamp-2026', 'Secured employment', 29, 'verified', 'Confirmed by employer letter or contract copy', 'Employer confirmation letters (29)', null, 1),
  ('fba97077-8280-563d-9450-5d0ee938809d', 'imp-career-bootcamp-2026', 'Progressed to further study', 11, 'self-reported', 'Diploma or certification programmes', 'Cohort exit survey', null, 2),
  ('4c51cb74-63e7-5447-bbcd-da62c2267d20', 'imp-ai-literacy-2026', 'Using AI tools weekly after 60 days', 214, 'self-reported', '44% of participants, from the 60-day follow-up survey', '60-day follow-up survey data', null, 0),
  ('af5526c8-1fcf-590a-9ea6-b9192ef5d6f6', 'imp-ai-literacy-2026', 'Small businesses automating a task', 63, 'observed', 'Recorded during follow-up interviews', 'Business interview recordings', null, 1),
  ('a1d0d11d-bc80-57e6-b4d7-39830db6f1a4', 'imp-ai-literacy-2026', 'Participants now volunteering as trainers', 9, 'verified', 'Listed on the public volunteer directory', 'Volunteer records', null, 2),
  ('0d3b14bb-cada-59e6-9e95-ca9152de32a8', 'imp-youth-bootcamp-2026', 'Opened a first savings account', 88, 'verified', 'Confirmed against partner bank onboarding records', 'Partner bank onboarding list', null, 0),
  ('d4ba32bc-08eb-5828-b943-9a1965c48e92', 'imp-youth-bootcamp-2026', 'Micro-grant ventures still trading at 6 months', 9, 'observed', 'Of 12 funded, ৳50,000 average grant', '6-month venture check-in notes', null, 1),
  ('33f937c4-fc29-5a18-b712-a5dcfc0607a2', 'imp-youth-bootcamp-2026', 'Joined a mentorship circle', 46, 'verified', 'Continuing engagement beyond the bootcamp', 'Bootcamp attendance register', null, 2),
  ('849e0847-fbf5-5bda-8ead-864b1839f008', 'imp-innovation-lab-2026', 'Tools in active use by partner NGOs', 2, 'verified', 'Impact dashboard and volunteer attendance tool', 'Partner adoption confirmations', null, 0),
  ('38d13651-9339-5487-a3de-2f98ab92a05b', 'imp-innovation-lab-2026', 'People served through deployed tools', 86, 'observed', 'Counted from tool usage logs, not estimated', 'Usage log extracts', null, 1),
  ('3681f3c9-569b-5bf0-b6b9-9b7e2c0d3971', 'imp-ai-cohort-nov-2026', 'Employment outcome at 90 days', null, 'pending', 'Measurement due 30 Nov 2026 — we do not publish an outcome before we can measure it', 'Follow-up survey scheduled', null, 0),
  ('e9ab555b-7891-5a62-ada6-6c71c2a0bb74', 'imp-dhaka-draft-2026', 'Students continuing weekly sessions', null, 'pending', 'First follow-up scheduled for Oct 2026', 'Session log', null, 0)
on conflict do nothing;

insert into public.impact_evidence (id, record_id, label, kind, verified, sort_order) values
  ('9ec1b2dd-4f00-596d-b561-83045a44b7d7', 'imp-khulna-survey-2026', 'Signed survey sheets (162)', 'document', true, 0),
  ('b6dc04dd-5faa-5263-be4d-7f3c3af85f02', 'imp-khulna-survey-2026', 'Field photographs', 'photo', true, 1),
  ('695022b5-2e95-5468-8a9e-c4fe6953c431', 'imp-khulna-survey-2026', 'Ward council minutes', 'document', true, 2),
  ('56a8fc1f-fa3b-52d0-b3b2-86c48ba07b97', 'imp-khulna-survey-2026', 'Scorecard PDF', 'report', false, 3),
  ('0de10db9-5316-586b-b22b-6e9a7b371d19', 'imp-career-bootcamp-2026', 'Attendance register', 'document', true, 0),
  ('74b02b09-80bc-5ce1-b766-7a2e748c8b5d', 'imp-career-bootcamp-2026', 'Employer confirmation letters (29)', 'document', true, 1),
  ('14b3215b-769d-5903-a146-0a7081d09d83', 'imp-career-bootcamp-2026', 'Completion certificates issued', 'document', true, 2),
  ('d0cbce49-c7a0-5e95-bdb7-e41d991a1dd0', 'imp-career-bootcamp-2026', 'Cohort exit survey', 'report', true, 3),
  ('0671a9f4-321b-54ee-918d-a486d0d0de55', 'imp-ai-literacy-2026', 'Workshop sign-in sheets', 'document', true, 0),
  ('632e2cf5-0436-56ec-bbc5-98e68690457c', 'imp-ai-literacy-2026', '60-day follow-up survey data', 'report', true, 1),
  ('29e149d9-c83f-542b-b2d1-c6833fa3862a', 'imp-ai-literacy-2026', 'Session photographs', 'photo', true, 2),
  ('4914dfec-3041-56f5-95f7-ac5f75743956', 'imp-ai-literacy-2026', 'Volunteer records', 'document', true, 3),
  ('f0f79aad-e73f-5943-97b2-e1529d10a20e', 'imp-ai-literacy-2026', 'Business interview recordings', 'document', false, 4),
  ('203aea70-0828-510a-95bd-99538446338e', 'imp-youth-bootcamp-2026', 'Bootcamp attendance register', 'document', true, 0),
  ('98432591-1805-5339-b241-e1964ecd87a3', 'imp-youth-bootcamp-2026', 'Grant disbursement receipts', 'document', true, 1),
  ('c77971f7-4210-5995-acbb-53f1cbfc3743', 'imp-youth-bootcamp-2026', 'Partner bank onboarding list', 'document', true, 2),
  ('9358e48e-9f04-5b6e-8cf7-678b8963a5ce', 'imp-youth-bootcamp-2026', '6-month venture check-in notes', 'report', false, 3),
  ('a6a439df-942f-51a2-afc5-1f7e1160527b', 'imp-innovation-lab-2026', 'Public repositories', 'document', true, 0),
  ('ba469817-3b49-5a91-b525-7f7b984cdcfb', 'imp-innovation-lab-2026', 'Partner adoption confirmations', 'document', true, 1),
  ('51bba3b1-4463-5dd5-8421-1cf30739c260', 'imp-innovation-lab-2026', 'Usage log extracts', 'report', false, 2),
  ('4b6d72ed-de6a-5492-a337-e18ea8a36d3d', 'imp-ai-cohort-nov-2026', 'Attendance register', 'document', true, 0),
  ('a29f9877-be99-59d7-a262-2d016e6e42dc', 'imp-ai-cohort-nov-2026', 'Certificates issued (71)', 'document', true, 1),
  ('721bc817-9abb-5647-ba44-604a7f756a9b', 'imp-ai-cohort-nov-2026', 'Follow-up survey scheduled', 'report', false, 2),
  ('0003ad87-160e-5764-b301-d0c91cd592e5', 'imp-dhaka-draft-2026', 'Session log', 'document', false, 0),
  ('377e4c71-4c3e-5d74-9348-ac153003678d', 'imp-dhaka-draft-2026', 'Setup photographs', 'photo', false, 1)
on conflict do nothing;

insert into public.partners (id, slug, name, kind, tier, stage, since_label, renewal_label, contact, story, goal_label, goal_target, committed, currency, districts, disclose_funding, employees_participated, employees_hours, employees_sessions, logo_path) values
  ('ptr-brightworks', 'brightworks-bangladesh-ltd', 'BrightWorks Bangladesh Ltd', 'Corporate sponsorship', 'Strategic Impact Partner', 'active', 'Jun 2026', 'Jun 2027', 'Farid Hossain, Head of CSR', 'Building digital opportunity for young Bangladeshis — practical AI skills, verified certifications, and pathways into work.', 'Support 1,000 young people with digital skills', 1000, 2500000, 'BDT', ARRAY['Dhaka', 'Chattogram']::text[], true, 9, 62, 3, null),
  ('ptr-rahman-foundation', 'rahman-family-foundation', 'Rahman Family Foundation', 'Restricted grant', 'Impact Partner', 'active', 'Aug 2026', 'Aug 2027', 'Grants office', 'Funding career readiness for graduates across Dhaka division.', '500 graduates through Career Launch', 500, 2500000, 'BDT', ARRAY['Dhaka']::text[], false, 0, 0, 0, null),
  ('ptr-delta', 'delta-textiles-csr', 'Delta Textiles CSR', 'CSR partnership', 'Impact Partner', 'active', 'Jul 2026', 'Jul 2027', 'CSR desk', 'Backing youth micro-grants and bootcamps in Rajshahi.', '200 young people through skills bootcamps', 200, 900000, 'BDT', ARRAY['Rajshahi']::text[], false, 4, 18, 1, null),
  ('ptr-nagorik', 'nagorik-trust', 'Nagorik Trust', 'Grant', 'Impact Partner', 'active', 'Jul 2026', 'Jan 2027', 'Programme officer', 'Community-led development in Khulna and Sylhet.', '3 community projects delivered', 3, 1200000, 'BDT', ARRAY['Khulna', 'Sylhet']::text[], false, 0, 0, 0, null),
  ('ptr-techhub', 'techhub-dhaka', 'TechHub Dhaka', 'Corporate sponsorship + in-kind', 'Founding Partner', 'renewal', 'Jun 2024', 'Oct 2026', 'Partnerships team', 'Our longest-running technology partner — powering the Tech for Good Lab since 2024.', '2 open-source tools in the field', 2, 600000, 'BDT', ARRAY['Dhaka']::text[], true, 12, 96, 5, null),
  ('ptr-dhaka-university', 'university-of-dhaka-career-club', 'University of Dhaka Career Club', 'Institutional partner — venue, faculty & participants (in-kind)', 'Knowledge Partner', 'active', 'Feb 2026', 'Feb 2027', 'Faculty adviser', 'No cash changes hands — the university contributes venues, faculty time, and student participation.', 'Reach 500 students through campus programmes', 500, 0, 'BDT', ARRAY['Dhaka']::text[], true, 26, 210, 7, null),
  ('ptr-prospect-bank', 'eastern-capital-bank', 'Eastern Capital Bank', 'Prospect — CSR partnership', 'Prospect', 'proposal', '—', '—', 'Head of Sustainability', '', 'Proposal: Mock Interview Days with employee volunteers', 0, 0, 'BDT', ARRAY['Dhaka']::text[], false, 0, 0, 0, null)
on conflict do nothing;

insert into public.partner_programs (partner_id, program_slug) values
  ('ptr-brightworks', 'ai-digital-skills'),
  ('ptr-brightworks', 'education-career-readiness'),
  ('ptr-rahman-foundation', 'education-career-readiness'),
  ('ptr-delta', 'youth-empowerment'),
  ('ptr-nagorik', 'community-development'),
  ('ptr-techhub', 'innovation-social-good'),
  ('ptr-techhub', 'ai-digital-skills'),
  ('ptr-dhaka-university', 'education-career-readiness'),
  ('ptr-dhaka-university', 'youth-empowerment'),
  ('ptr-prospect-bank', 'education-career-readiness')
on conflict do nothing;

insert into public.partner_inkind (id, partner_id, label, est_value) values
  ('44f1a088-d6f2-548f-bed9-718c003e2275', 'ptr-brightworks', 'Training venue, Gulshan (12 sessions)', 300000),
  ('a6e1eb9a-b9d6-5887-88ea-d4c33a2c9265', 'ptr-techhub', 'Co-working space for Tech for Good Lab', 240000),
  ('f62d9f08-f514-5ba1-bd4b-cf9818ee110a', 'ptr-techhub', 'Cloud credits', 90000),
  ('3d6ae27f-9799-57d6-83ed-4c1653a44289', 'ptr-dhaka-university', 'Auditorium & classrooms for bootcamps', 350000),
  ('4813f1df-6493-5918-9531-d55e928ca379', 'ptr-dhaka-university', 'Faculty mentoring hours', 120000)
on conflict do nothing;

insert into public.partner_commitments (id, partner_id, side, label, done, total, unit, note, sort_order) values
  ('c8f20724-ff07-5a0a-a8c6-ec3f2ba4f62e', 'ptr-brightworks', 'goodness', 'Digital-skills cohorts delivered', 3, 4, null, null, 0),
  ('f3c49609-cfca-5c82-bfcb-8570010e5c12', 'ptr-brightworks', 'goodness', 'Quarterly impact reports', 2, 4, null, null, 1),
  ('d261458f-cbbd-5dda-8bbb-71df43b327e6', 'ptr-brightworks', 'goodness', '90-day outcome measurement', null, null, null, 'Next due 30 Nov 2026', 2),
  ('9b4d4ecc-ad69-5b61-9206-52aa5ddffed8', 'ptr-brightworks', 'partner', 'Funding commitment received', 15, 25, 'L', null, 0),
  ('54ba3cd2-1b4a-5e6e-88d3-115cb7f9a928', 'ptr-brightworks', 'partner', 'Employee volunteers', 9, 20, null, null, 1),
  ('9d188416-8804-5a7c-bb6a-531fd1f254b0', 'ptr-brightworks', 'partner', 'Training venue sessions', 8, 12, null, null, 2)
on conflict do nothing;

insert into public.partner_timeline (id, partner_id, date_label, happened_on, kind, text) values
  ('2c694024-240d-5262-8ca3-e206a7690085', 'ptr-brightworks', '18 Aug 2026', null, 'evidence', 'Attendance registers checked for Cohort 04 — 71 certificates issued'),
  ('872ae03f-acc3-51d7-8fe7-36f5bcacc4c3', 'ptr-brightworks', '12 Aug 2026', null, 'money', 'Second instalment received — ৳15.0L of ৳25.0L commitment'),
  ('b3dad2dd-1034-54bd-a147-bbfed315ea9b', 'ptr-brightworks', '02 Aug 2026', null, 'mission', 'Digital Skills Certification Cohort 04 completed in Chattogram'),
  ('44a69df0-43e9-598a-9509-17a5c138f3e1', 'ptr-brightworks', '14 Jul 2026', null, 'people', '6 BrightWorks employees volunteered at the Dhaka AI workshop'),
  ('3998b572-5d45-5498-90c4-c0271d1e0772', 'ptr-brightworks', '28 Jun 2026', null, 'money', '৳5.0L allocated to the Digital Bangladesh Skills Drive'),
  ('58a54de1-8ed1-5c02-8ce4-9c7624b78cee', 'ptr-brightworks', '15 Jun 2026', null, 'start', 'Partnership signed — ৳25.0L committed over 12 months'),
  ('48936777-7d62-59c5-85d6-13cd2a2c674c', 'ptr-rahman-foundation', '05 Aug 2026', null, 'money', 'Grant received in full — ৳25.0L, restricted to Education & Career Readiness'),
  ('c6980dda-bde1-569d-86df-89863c0a55cb', 'ptr-rahman-foundation', '01 Aug 2026', null, 'start', 'Grant agreement signed with quarterly reporting'),
  ('0d372b6e-bcb1-5932-b674-634c31e29288', 'ptr-delta', '20 Jul 2026', null, 'money', '৳9.0L received for Youth Futures 2026'),
  ('c78117c1-0106-5ad2-bae8-4555835fb002', 'ptr-nagorik', '08 Jul 2026', null, 'money', '৳12.0L received for community development work'),
  ('941e52cf-907c-56ae-a9b3-a77322f50d7a', 'ptr-techhub', '18 Jun 2026', null, 'money', '2026 sponsorship received — ৳6.0L'),
  ('5f0fa0fa-5822-5159-ad13-54c288f4e3e6', 'ptr-techhub', '05 Jun 2026', null, 'people', 'TechHub engineers mentored the Innovation Sprint'),
  ('47d1ba4f-94bb-5bb8-8973-b404b2278faa', 'ptr-dhaka-university', '11 Aug 2026', null, 'people', '26 student volunteers completed the Career Launch support missions'),
  ('03a98084-e254-54a1-b1d1-3828649dda52', 'ptr-dhaka-university', '02 Feb 2026', null, 'start', 'MoU signed — venue and faculty support for 2026'),
  ('8adde975-d567-5e70-869a-f259c1009e06', 'ptr-prospect-bank', '14 Aug 2026', null, 'note', 'Proposal sent — Career Launch co-funding + employee volunteering')
on conflict do nothing;

insert into public.partner_employee_sessions (id, partner_id, mission_id, people, hours, date_label) values
  ('fa716701-4f7b-5bb3-8449-ba62593bc9e0', 'ptr-brightworks', null, 9, 62, 'Jun 2026'),
  ('923fa575-92d9-531d-80a4-ec08534ad753', 'ptr-delta', null, 4, 18, 'Jul 2026'),
  ('d39dad01-4321-5a82-ad44-db3c9baf66c4', 'ptr-techhub', null, 12, 96, 'Jun 2024'),
  ('28e997ca-73bc-5411-9e30-06ee06be7201', 'ptr-dhaka-university', null, 26, 210, 'Feb 2026')
on conflict do nothing;

insert into public.opportunities (id, title, program_slug, chapter_id, where_label, urgent, target, secured, seeking, expected, note, open) values
  ('opp-ai-500', 'AI skills for 500 young people', 'ai-digital-skills', null, 'Dhaka · Chattogram', false, 1800000, 1140000, ARRAY['Lead Partner — ৳10L+', 'Supporting partners — ৳2L+', '20 employee volunteers']::text[], ARRAY['500 learners complete foundation training', '400 certifications', '90-day follow-up measured and published']::text[], 'Contributions join the funding pool for this initiative; results are reported collectively with evidence.', true),
  ('opp-sylhet-floods', 'Rebuild learning access after the Sylhet floods', 'community-development', null, 'Sylhet division', true, 1200000, 380000, ARRAY['Relief partners — any amount', 'In-kind: school supplies, transport']::text[], ARRAY['400 family relief packs', '6 learning spaces restored', 'Household recovery tracked on the ward scorecard']::text[], 'Urgent — packing missions are already scheduled and waiting on funding.', true),
  ('opp-career-rajshahi', 'Career Launch — Rajshahi', 'education-career-readiness', null, 'Rajshahi', false, 950000, 250000, ARRAY['Anchor partner — ৳5L', 'Mock-interview employee volunteers']::text[], ARRAY['250 graduating students coached', 'CVs and mock interviews for all participants', 'Employment outcomes measured at 90 days']::text[], 'Extends the Dhaka cohort model whose outcomes are already published.', true),
  ('opp-open-tools', 'Open Impact Tools — close the funding gap', 'innovation-social-good', null, 'Dhaka · remote', false, 800000, 560000, ARRAY['Technology partner — ৳2.4L', 'In-kind: cloud hosting, design time']::text[], ARRAY['2 open-source tools maintained in the field', 'Partner NGOs onboarded', 'Usage logged, not estimated']::text[], 'This is the same ৳2.4L gap shown on the Trust Ledger''s Innovation fund.', true)
on conflict do nothing;

insert into public.funds (id, program_slug, chapter_id, project_label, budget, allocated, currency) values
  ('fnd-education', 'education-career-readiness', null, 'Career Launch 2026', 2200000, 2200000, 'BDT'),
  ('fnd-digital', 'ai-digital-skills', null, 'Digital Bangladesh Skills Drive', 1450000, 1450000, 'BDT'),
  ('fnd-youth', 'youth-empowerment', null, 'Youth Futures 2026', 850000, 850000, 'BDT'),
  ('fnd-community', 'community-development', null, 'Khulna Ward Scorecard 2026', 1000000, 1000000, 'BDT'),
  ('fnd-innovation', 'innovation-social-good', null, 'Open Impact Tools', 800000, 560000, 'BDT'),
  ('fnd-operations', 'operations', null, 'Running the organisation', 620000, 620000, 'BDT')
on conflict do nothing;

insert into public.donations (id, donor_name, donor_profile_id, partner_id, kind, amount, currency, donated_on, date_label, method, restricted_program_slug, restricted_chapter_id, receipt_ref, acknowledged) values
  ('don-2026-041', 'BrightWorks Bangladesh Ltd', null, 'ptr-brightworks', 'Corporate', 1500000, 'BDT', null, '12 Aug 2026', 'Bank transfer', 'ai-digital-skills', null, 'GS-RCP-2026-0041', true),
  ('don-2026-040', 'Rahman Family Foundation', null, 'ptr-rahman-foundation', 'Foundation', 2500000, 'BDT', null, '05 Aug 2026', 'Bank transfer', 'education-career-readiness', null, 'GS-RCP-2026-0040', true),
  ('don-2026-039', 'Tasnim Haque', '0d735c5d-ed84-5c80-a4ca-f61ffab239d3', null, 'Individual', 50000, 'BDT', null, '02 Aug 2026', 'bKash', null, null, 'GS-RCP-2026-0039', true),
  ('don-2026-038', 'Anonymous donor', null, null, 'Individual', 25000, 'BDT', null, '28 Jul 2026', 'bKash', null, null, 'GS-RCP-2026-0038', false),
  ('don-2026-037', 'Delta Textiles CSR', null, 'ptr-delta', 'Corporate', 900000, 'BDT', null, '20 Jul 2026', 'Cheque', 'youth-empowerment', null, 'GS-RCP-2026-0037', true),
  ('don-2026-036', 'Nagorik Trust', null, 'ptr-nagorik', 'Foundation', 1200000, 'BDT', null, '08 Jul 2026', 'Bank transfer', 'community-development', null, 'GS-RCP-2026-0036', true),
  ('don-2026-035', 'Arif Chowdhury', '4f18bc22-f979-57fd-bcc8-647ac8af89a4', null, 'Individual', 15000, 'BDT', null, '01 Jul 2026', 'Card', null, null, 'GS-RCP-2026-0035', true),
  ('don-2026-034', 'TechHub Dhaka', null, 'ptr-techhub', 'Corporate', 600000, 'BDT', null, '18 Jun 2026', 'Bank transfer', 'innovation-social-good', null, 'GS-RCP-2026-0034', true)
on conflict do nothing;

insert into public.expenses (id, fund_id, item, amount, spent_on, date_label, payee, status, approved_by_label, approved_by, approved_at, mission_id, impact_record_id) values
  ('exp-2026-118', 'fnd-education', 'Venue hire — Career Bootcamp, 4 weeks', 420000, null, '10 Jun 2026', 'Dhaka Community Hall', 'approved', 'Executive Director', null, null, null, 'imp-career-bootcamp-2026'),
  ('exp-2026-117', 'fnd-education', 'Trainer stipends (6 trainers)', 360000, null, '12 Jun 2026', '6 payees', 'approved', 'Executive Director', null, null, null, 'imp-career-bootcamp-2026'),
  ('exp-2026-116', 'fnd-education', 'Printed workbooks (120 sets)', 96000, null, '02 Jun 2026', 'Nabin Press', 'approved', 'Programs Lead', null, null, null, 'imp-career-bootcamp-2026'),
  ('exp-2026-115', 'fnd-digital', 'Laptops for training labs (8 units)', 640000, null, '22 May 2026', 'Byte Solutions', 'approved', 'Executive Director', null, null, null, 'imp-ai-literacy-2026'),
  ('exp-2026-114', 'fnd-digital', 'Workshop travel — 8 districts', 186000, null, '28 May 2026', 'Various', 'approved', 'Programs Lead', null, null, null, 'imp-ai-literacy-2026'),
  ('exp-2026-113', 'fnd-youth', 'Micro-grants disbursed (12 ventures)', 600000, null, '18 Apr 2026', '12 grantees', 'approved', 'Executive Director', null, null, null, 'imp-youth-bootcamp-2026'),
  ('exp-2026-112', 'fnd-youth', 'Bootcamp catering, Rajshahi', 118000, null, '15 Apr 2026', 'Padma Caterers', 'approved', 'Programs Lead', null, null, 'msn-rajshahi-youth-01', 'imp-youth-bootcamp-2026'),
  ('exp-2026-111', 'fnd-community', 'Survey materials & field kits', 74000, null, '18 Aug 2026', 'Rupsha Supplies', 'approved', 'Programs Lead', null, null, 'msn-khulna-community-01', 'imp-khulna-survey-2026'),
  ('exp-2026-110', 'fnd-community', 'Flood relief packs (400 families)', 520000, null, '26 Aug 2026', 'Sylhet Wholesale', 'pending', null, null, null, 'msn-sylhet-flood-01', null),
  ('exp-2026-109', 'fnd-innovation', 'Cloud hosting, 12 months', 144000, null, '05 Jul 2026', 'CloudBD', 'approved', 'Executive Director', null, null, null, 'imp-innovation-lab-2026'),
  ('exp-2026-104', 'fnd-innovation', 'Prototype hardware — sensors & tablets', 96000, null, '14 Jul 2026', 'Byte Solutions', 'approved', 'Programs Lead', null, null, null, 'imp-innovation-lab-2026'),
  ('exp-2026-108', 'fnd-innovation', 'Designer contract — accessibility audit', 90000, null, '12 Jul 2026', 'Arif Chowdhury', 'pending', null, null, null, null, null),
  ('exp-2026-107', 'fnd-operations', 'Office rent, Q3', 270000, null, '01 Jul 2026', 'Gulshan Properties', 'approved', 'Executive Director', null, null, null, null),
  ('exp-2026-106', 'fnd-operations', 'Accounting & audit fees', 165000, null, '20 Jun 2026', 'Hoque & Co.', 'approved', 'Executive Director', null, null, null, null),
  ('exp-2026-105', 'fnd-operations', 'Platform & communications tools', 82000, null, '08 Jun 2026', 'Various SaaS', 'approved', 'Programs Lead', null, null, null, null)
on conflict do nothing;

insert into public.expense_evidence (id, expense_id, label, checked) values
  ('4256e32b-9971-5c22-ad97-9f3bba8ac8b5', 'exp-2026-118', 'Invoice DCH-4471', true),
  ('b011ad47-e9f3-5a55-b7de-b76eb3844d16', 'exp-2026-118', 'Bank debit advice', true),
  ('43a11cee-7596-5829-921e-1fd5c3dfaff1', 'exp-2026-117', 'Signed stipend register', true),
  ('3aa39a2f-ce9a-58af-b0c8-05471ed1361c', 'exp-2026-117', 'Bank transfer list', true),
  ('445c84af-7aaf-5816-8e39-676238f553fa', 'exp-2026-116', 'Invoice NP-2213', true),
  ('fd3f01a0-2280-5b94-b966-8ce07cde685a', 'exp-2026-116', 'Delivery note', false),
  ('90c36569-f5af-51d9-85b7-66be7205db1c', 'exp-2026-115', 'Invoice BS-8891', true),
  ('d44c08dd-ce15-5ab1-a0e5-ea247b1713a4', 'exp-2026-115', 'Asset register entry', true),
  ('b865b0db-c242-5f5b-b088-1891f320afc3', 'exp-2026-115', 'Delivery photographs', true),
  ('cf456cd5-0776-5e37-8be2-27d308372c24', 'exp-2026-114', 'Travel claim forms', true),
  ('b3e226f3-3a72-57d8-bcbc-8bba920318a9', 'exp-2026-114', 'Ticket copies', false),
  ('2a5b2780-7d62-5e96-a263-b30a72b646ed', 'exp-2026-113', 'Grant agreements (12)', true),
  ('2f26cb33-5bd5-55c3-bbea-9806edd05d16', 'exp-2026-113', 'Disbursement receipts', true),
  ('26ce2686-3773-57a4-9cfb-27f99defd3b2', 'exp-2026-112', 'Invoice PC-331', true),
  ('0805ba92-1f41-54ca-8141-2438934c9cdf', 'exp-2026-111', 'Invoice RS-129', true),
  ('4c3c361f-b992-560e-b0ac-2b1e4b15b1b3', 'exp-2026-111', 'Field photographs', true),
  ('ffc31859-d11e-5442-806b-13577f22b096', 'exp-2026-110', 'Quotation SW-902', false),
  ('5723c0b4-91ca-550b-84d3-9f1beacfd08f', 'exp-2026-109', 'Annual invoice CB-7712', true),
  ('7ba1f2fd-4047-510c-9f62-d7ee2b2e6cda', 'exp-2026-108', 'Contract draft', false),
  ('d7a4e60e-9ce2-5832-bfe2-c2c3a8c85f15', 'exp-2026-107', 'Lease agreement', true),
  ('0d1634c0-a19a-5022-9f76-5e1feede05a5', 'exp-2026-107', 'Rent receipt Q3', true),
  ('57eb0f85-2aeb-57a2-82b1-44622c7ed0e3', 'exp-2026-106', 'Invoice HC-556', true),
  ('131ddf44-f3a7-50bd-93f1-16d085debebe', 'exp-2026-106', 'Audit engagement letter', true),
  ('bd62ec9b-56c4-5501-b6c0-c5c933793ef0', 'exp-2026-105', 'Card statements', true),
  ('07942415-c142-5b88-ad49-4721e1a0b101', 'exp-2026-105', 'Vendor receipts', false)
on conflict do nothing;

insert into public.announcements (id, title, body, audience, chapter_id, created_by) values
  ('fb7728aa-9c88-5d9a-94c1-96049a6448f3', 'Goodness Standards check-in — Q3', 'Every chapter reviews its six standards this quarter. Chapter Control shows where you stand; HQ reviews anything below 4/6 with you, not at you.', 'network', null, null),
  ('84782c39-0f2d-5f73-8f1a-25a30ef957ce', 'Evidence before publication', 'An impact record can be published while evidence is still being checked — but the record must say so. Publication and verification are separate promises.', 'network', null, null)
on conflict do nothing;

-- Capacity, hours, chapter rollups and ledger totals are all derived at read time.
-- Nothing above stores a computed number.
commit;
