# 生日優惠整理 Birthday Rewards

一個可自行維護的生日優惠整理網站。Next.js 15 (App Router) + Supabase + TypeScript + Tailwind CSS。

首頁直接顯示優惠列表，支援即時搜尋、多重篩選、排序、卡片／表格切換、收藏、到期提醒、
多標籤、點擊統計、統計儀表板；後台（Supabase Auth 登入）可新增／修改／刪除／批次操作／
CSV·Excel·JSON 匯入匯出。

## v2 更新（安全性強化）

> **部署前請先在 Supabase SQL Editor 執行以下兩份新的 migration**（依序）：
> `supabase/migrations/002_reward_reports.sql` → `supabase/migrations/003_tighten_rls.sql`
> 這兩份都是「新增」而非「修改」，不會動到既有資料表或欄位。

- **移除前台新增優惠**：首頁不再有「新增優惠」按鈕，一般使用者只能瀏覽／搜尋／篩選／
  排序／收藏。原本前台的「貼上網址自動擷取」功能保留，但搬到後台新增優惠頁面。
- **一般使用者權限收斂**：「已使用」標記、「使用心得」編輯，現在都只有登入後台才能操作
  （之前這兩個是公開可寫的）。「收藏」維持公開可用。
- **新增「資料回報」按鈕**：一般使用者發現優惠資料有誤時，只能送出回報（店家＋問題描述＋
  選填聯絡 Email），不能直接修改內容。回報會出現在後台的「資料回報」清單，管理員可標記
  已處理或刪除。
- **RLS 全面收緊**：`rewards` 資料表的匿名新增／更新政策已移除，改成僅限登入使用者。收藏
  改用一個只能寫入 `is_favorite` 欄位的 SECURITY DEFINER RPC（`toggle_reward_favorite`），
  不再需要對 `rewards` 開放大範圍的匿名 UPDATE 政策。所有變更詳見
  `supabase/migrations/003_tighten_rls.sql` 內的註解。
- **UI**：所有標籤（Tag）保證有柔和色背景，不會再出現白色 Tag；調色盤擴充為 10 種低飽和
  色系（奶茶、珊瑚、綠、紫、粉、黃、青、灰藍、沙、石灰）。卡片與表格的留白、圖示尺寸、
  Badge 尺寸都做了統一。

---


## 1. 技術棧

| 項目 | 使用套件 |
| --- | --- |
| 框架 | Next.js 15 (App Router), React 19, TypeScript |
| 樣式 | Tailwind CSS |
| 資料庫 | Supabase (Postgres + Row Level Security) |
| 登入 | Supabase Auth（Email + 密碼） |
| 表單 | React Hook Form + Zod |
| 表格 | TanStack Table |
| 圖示 | Lucide Icons |
| 動畫 | Framer Motion（Tailwind keyframes 為主） |
| 匯入匯出 | papaparse (CSV) / xlsx (Excel) |
| PWA | 原生 `app/manifest.ts` + 自訂 `public/sw.js` |
| 主題 | next-themes（Light / Dark / System） |

---

## 2. 快速開始

### 2.1 建立 Supabase 專案

1. 到 [supabase.com](https://supabase.com) 建立新專案。
2. 進入 **SQL Editor**，依序執行：
   - `supabase/schema.sql`（建立資料表、索引、RLS 政策、觸發器）
   - `supabase/seed.sql`（寫入標籤與 8 筆示範優惠資料，可略過）
   - `supabase/migrations/002_reward_reports.sql`（v2：資料回報功能）
   - `supabase/migrations/003_tighten_rls.sql`（v2：收緊 RLS，只有登入才能寫入）
3. 進入 **Authentication → Users**，手動新增一個管理員帳號（Email + 密碼），
   這組帳密將用於登入 `/admin` 後台。
4. 進入 **Project Settings → API**，複製 `Project URL`、`anon public key`、
   `service_role key`（僅伺服器使用，勿外流）。

### 2.2 設定環境變數

複製 `.env.example` 為 `.env.local`，填入上一步取得的金鑰：

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.3 安裝與啟動

```bash
npm install
npm run dev
```

開啟 http://localhost:3000 即可看到優惠列表；到 http://localhost:3000/admin/login
登入後台。

---

## 3. 專案結構（Feature Folder 精簡版）

```
app/
  page.tsx                    首頁（優惠列表）
  reward/[id]/page.tsx        店家詳細頁
  admin/
    login/page.tsx            後台登入
    page.tsx                  後台管理列表（批次刪除／修改／匯入匯出入口）
    rewards/new/page.tsx      新增優惠
    rewards/[id]/edit/page.tsx  編輯優惠
  actions/                    Server Actions（rewards / tags / auth / import-export / reports）
  api/extract/route.ts        Smart Import：貼網址自動擷取（extractReward 擴充點，v2 移至後台使用）
  manifest.ts / robots.ts / sitemap.ts  SEO / PWA
components/
  ui/                         基礎元件（Button／Input／Dialog／Checkbox…）
  reward-explorer.tsx         首頁主邏輯：搜尋／篩選／排序／view mode／lazy load
  reward-card.tsx / reward-table.tsx   卡片／表格兩種檢視
  report-dialog.tsx           v2：資料回報對話框
  admin-table.tsx             後台批次操作表格
  admin/reports-panel.tsx     v2：後台資料回報清單
lib/
  supabase/                   client / server / middleware 三種 Supabase client
  database.types.ts           手刻型別（正式上線後可用 supabase gen types 覆蓋）
  queries.ts                  伺服器端資料查詢
  stats.ts                    儀表板統計計算（純函式，client/server 皆可用）
  schema.ts                   Zod 驗證（含 v2 reportSchema）
  constants.ts                類別、標籤調色盤、排序選項
supabase/
  schema.sql                  完整資料庫 Schema + RLS
  seed.sql                    初始測試資料
  migrations/
    002_reward_reports.sql    v2：資料回報資料表
    003_tighten_rls.sql       v2：收緊 RLS，寫入動作限登入使用者
```

---

## 4. 資料庫 Schema 摘要

`rewards` 主表包含 PRD 要求的所有欄位（店家、類別、內容、日期分類、分數、網址、
收藏、已使用、點擊數、到期日、心得、時間戳），並預留第 13 節列出的擴充欄位
（`is_active`, `is_featured`, `reward_type`, `region`, `city`, `country`, `brand`,
`source`, `last_verified_at`, `verified_by`, `ai_summary`, `ai_tags`, `ai_score`,
`metadata jsonb`），未來可直接串接 AI 自動整理優惠而不需改動表結構。

其餘資料表：

- `tags` / `reward_tags`：多標籤，多對多
- `collections` / `collection_rewards`：收藏資料夾（需登入才能建立，各自私有）
- `reward_history`：店家詳細頁的「歷史更新紀錄」

**RLS 原則（v2）**：所有人可讀取；一般使用者僅能透過 `toggle_reward_favorite` RPC 切換收藏、
透過 `increment_click` RPC 累計點擊、以及新增 `reward_reports`（資料回報）。新增優惠、修改
優惠（含已使用、心得）、刪除、批次操作，全部僅限登入後的管理員（`auth.role() = 'authenticated'`）。

---

## 5. 主要功能對照 PRD

- ✅ 首頁即列表，無介紹頁，即時搜尋（店家／內容／標籤／心得／分類，模糊搜尋）
- ✅ 多重篩選（類別、日期分類、分數、收藏、已使用、標籤）可同時多選
- ✅ 6 種排序（日期近→遠、分數高→低、熱門度、店名 A–Z、建立時間、更新時間）
- ✅ Table View / Card View 切換，記住使用者選擇（localStorage）
- ✅ **v2**：前台不可新增／修改資料，僅能瀏覽／搜尋／篩選／排序／收藏；新增優惠、修改、
  刪除、批次操作、CSV/Excel/JSON 匯入全部限登入後台
- ✅ **v2**：資料回報按鈕（`components/report-dialog.tsx`），一般使用者發現錯誤只能送出
  回報，後台「資料回報」清單可標記已處理或刪除
- ✅ CSV / Excel / JSON 匯入（可選擇覆蓋／略過／新增）與匯出（後台限定）
- ✅ 收藏（公開可用）、已使用（**v2：後台限定**，可隱藏已使用）、點擊統計
- ✅ 多標籤 + 低飽和自動配色（**v2：保證無白色 Tag**）+ 依標籤篩選／搜尋
- ✅ 到期提醒（還有 N 天 / 今天截止 / 已截止 / 即將截止標籤）
- ✅ 使用心得（**v2：後台可編輯，前台唯讀顯示**）
- ✅ 統計 Dashboard（乾淨卡片式，可展開/收合）
- ✅ Smart Import 擴充點：`app/api/extract/route.ts` 內的 `extractReward()`（**v2：UI 移到
  後台新增優惠頁面**）
- ✅ Logo 系統（網址或無圖時顯示店名字首）
- ✅ 收藏資料夾（`collections` 資料表，需登入，之後可加 UI）
- ✅ 店家詳細頁（`/reward/[id]`，含歷史紀錄）
- ✅ PWA（manifest + service worker）、Dark Mode（Light/Dark/System）、SEO
  （metadata、OpenGraph、sitemap.xml、robots.txt）
- ✅ 效能：搜尋 debounce、IntersectionObserver 漸進渲染（lazy load 24 筆一批）

> 收藏資料夾（`collections`）目前只完成資料層與 Server Actions，尚未接上獨立 UI；
> 若要在畫面上使用，可在 `components/reward-card.tsx` 加一個「加入資料夾」選單，
> 呼叫 `app/actions/tags.ts` 內的 `addRewardToCollection`。

---

## 6. PWA 圖示

`public/icons/` 內已放入以腳本產生的暫用圖示（192 / 512 / maskable 512），
正式上線前建議替換成正式設計稿的 PNG，保持相同檔名與尺寸即可。

---

## 7. 部署到 Vercel

1. 將專案推上 GitHub。
2. 在 Vercel 建立新專案並匯入該 repo。
3. 在 Vercel 專案設定的 Environment Variables 貼上 `.env.local` 內的四組變數。
4. Deploy。Vercel 會自動偵測 Next.js 並完成建置。

---

## 8. 之後想擴充可以怎麼做

- **AI 自動整理優惠**：`ai_summary` / `ai_tags` / `ai_score` 欄位已預留，
  搭配 `extractReward()` 串接 LLM API 即可自動填寫。
- **多人維護**：`reward_history` 已記錄每次修改，之後可加上 `changed_by`
  綁定 Supabase Auth 使用者 email，做出完整的協作紀錄。
- **地區篩選**：`region` / `city` / `country` 欄位已存在，之後可在
  `FilterPanel` 加入對應篩選項。
