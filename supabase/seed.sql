-- ============================================================
-- Initial seed data — run after schema.sql
-- ============================================================

insert into public.tags (name, color_hex) values
  ('需會員',        '#DCEBDD'),
  ('需 APP',        '#F3E3D3'),
  ('需綁定手機',    '#F5DFE6'),
  ('限本人',        '#E7E4DE'),
  ('可提前領取',    '#DCEBDD'),
  ('生日當天限定',  '#F0C9A0'),
  ('生日當月',      '#DCEBDD'),
  ('線上兌換',      '#E4E9F0'),
  ('門市兌換',      '#F3E3D3'),
  ('外帶限定',      '#E7E4DE'),
  ('內用限定',      '#E7E4DE'),
  ('全台適用',      '#DCEBDD'),
  ('指定門市',      '#F5DFE6'),
  ('新會員限定',    '#E4E9F0'),
  ('消費門檻',      '#F3E3D3'),
  ('可重複使用',    '#DCEBDD')
on conflict (name) do nothing;

insert into public.rewards (store_name, category, content, date_category, score, official_url, is_favorite, is_used, click_count, expiry_date, notes)
values
  ('星巴克', '飲料', '生日當月憑會員載具兌換一杯中杯飲料。', '生日當月'::text, 5, 'https://www.starbucks.com.tw', true, false, 42, (current_date + interval '20 days')::date, '需先加入星禮程會員，兌換碼在 APP 錢包裡。'),
  ('路易莎咖啡', '飲料', '生日當週出示會員條碼享大杯拿鐵買一送一。', '其他', 4, 'https://www.louisacoffee.com.tw', false, false, 11, (current_date + interval '5 days')::date, ''),
  ('王品集團', '食物', '生日當月至任一品牌用餐享主餐 8 折優惠。', '生日當月'::text, 4, 'https://www.wangsteak.com.tw', true, false, 30, (current_date + interval '10 days')::date, '需提前一週用 APP 預約並輸入生日資訊。'),
  ('唐吉軻德', '美妝', '會員生日當月全館消費滿額贈品。', '月底', 3, 'https://www.donki.com.tw', false, true, 8, null, '去年兌換過，贈品是小包面膜。'),
  ('松本清', '美妝', '會員生日禮金 200 元，兌換期限一個月。', '次月底', 4, 'https://www.matsukiyo.com.tw', true, false, 19, (current_date + interval '2 days')::date, '記得先在 APP 內領取，才會出現在錢包。'),
  ('BIC CAMERA', '其他', '會員生日當月消費享額外 5% 點數回饋。', '月底', 3, 'https://www.biccamera.com', false, false, 6, null, ''),
  ('多那之', '食物', '生日當月憑證件享甜甜圈一盒 6 折。', '生日當月'::text, 3, 'https://www.donutes.com.tw', false, false, 4, (current_date - interval '3 days')::date, '已過期，明年記得提早使用。'),
  ('屈臣氏', '美妝', '會員生日當月滿 500 折 100。', '月底', 4, 'https://www.watsons.com.tw', true, false, 15, (current_date + interval '15 days')::date, '');

-- Tag a few rewards for demo purposes
with r as (select id from public.rewards where store_name = '星巴克' limit 1),
     t1 as (select id from public.tags where name = '需會員'),
     t2 as (select id from public.tags where name = '生日當月')
insert into public.reward_tags (reward_id, tag_id)
select r.id, t1.id from r, t1
union all
select r.id, t2.id from r, t2
on conflict do nothing;

with r as (select id from public.rewards where store_name = '松本清' limit 1),
     t1 as (select id from public.tags where name = '需 APP'),
     t2 as (select id from public.tags where name = '消費門檻')
insert into public.reward_tags (reward_id, tag_id)
select r.id, t1.id from r, t1
union all
select r.id, t2.id from r, t2
on conflict do nothing;
