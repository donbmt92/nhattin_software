import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nhất Tín Software',
    short_name: 'Nhất Tín',
    description: 'Nhất Tín Software cung cấp các giải pháp phần mềm, dịch vụ công nghệ và ứng dụng di động chất lượng cao.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/images/icon/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/icon/logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    categories: ['business', 'productivity', 'technology'],
    lang: 'vi',
    orientation: 'portrait-primary',
  }
}
