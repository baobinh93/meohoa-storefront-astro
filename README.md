# Mèo Hoa Storefront

Website cửa hàng Mèo Hoa được xây dựng bằng Astro, Tailwind CSS v4 và Supabase.
Đây là dự án storefront độc lập, không chứa hoặc thay đổi source code của Admin.

## Yêu cầu

- Node.js 22.12 trở lên (khuyến nghị phiên bản LTS mới).
- Một Supabase project đã có các bảng `products`, `product_images`, `categories`, `colors`, `badges`.
- Public read policies (RLS) cho dữ liệu công khai.

## Chạy local

```powershell
npm install
Copy-Item .env.example .env
```

Mở `.env`, điền `SUPABASE_URL` và `SUPABASE_PUBLISHABLE_KEY`, sau đó:

```powershell
npm run dev
```

Mở `http://localhost:4321`.

Build website tĩnh:

```powershell
npm run build
npm run preview
```

Nếu chưa cấu hình `.env`, website vẫn build được nhưng sẽ hiển thị trạng thái chưa có sản phẩm. Khi có biến môi trường, Astro đọc dữ liệu Supabase trong lúc build.

## Tính năng

- Trang chủ thiết kế tối giản, tone ivory / burgundy / quiet luxury.
- Tìm kiếm theo tên, slug và mô tả.
- Lọc danh mục, màu sắc và nhãn sản phẩm.
- Sắp xếp theo thứ tự, giá tăng dần hoặc giảm dần.
- Thẻ sản phẩm có nhãn như `CÓ SẴN` hoặc `THEO YÊU CẦU`.
- Trang chi tiết `/san-pham/[slug]/` chỉ được tạo cho sản phẩm `published`.
- Metadata title, description, Open Graph cơ bản.
- Responsive desktop và mobile.
- Tailwind CSS v4.
- Không dùng `service_role` key ở storefront.

## Supabase schema dự kiến

Dự án dùng các cột đã xác nhận trong bảng `products`:
`id`, `category_id`, `color_id`, `badge_id`, `name`, `slug`, `price`,
`original_price`, `description`, `status`, `sort_order`, `meta_title`,
`meta_description`.

Bảng `product_images`:
`id`, `product_id`, `image_url`, `alt`, `is_primary`, `sort_order`.

Các bảng danh mục/màu/nhãn được đọc bằng `select("*")` và tìm trường hiển thị
phổ biến như `name`, `label`, `title`, `slug`. Nếu schema của bảng đó dùng tên
khác, hãy chỉnh hàm `getLabel()` trong `src/lib/products.ts`.

## Xuất bản lên GitHub Pages

Workflow nằm tại `.github/workflows/deploy.yml`. Trong repository GitHub, bật
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Trong **Settings → Secrets and variables → Actions → Variables**, tạo:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Workflow build trang tĩnh và deploy khi push lên nhánh `main`. Publishable key
được dùng ở build server; không đưa `service_role` hoặc secret key vào workflow.

Tên miền cấu hình trong `astro.config.mjs` và `public/CNAME` hiện là
`meohoa.io.vn`. Hãy xác nhận DNS và custom domain đã trỏ đúng GitHub Pages trước
khi bật domain trên repository.

## Lưu ý về cập nhật sản phẩm

Đây là site SSG. Thay đổi dữ liệu Supabase không tự thay đổi HTML đã deploy.
Sau khi xuất bản hoặc chỉnh sửa sản phẩm trong Admin, cần chạy build/deploy lại.
Workflow hiện deploy khi có commit/push lên `main`; bước gọi workflow tự động từ
nút Xuất bản trong Admin cần được tích hợp riêng.
