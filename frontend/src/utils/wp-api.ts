// wp-api.ts — 자동 변환: WordPress PHP/JS 함수 → TypeScript
// 원본: get_posts(), get_post(), get_page(), bloginfo(), get_the_category() 등
const API = 'https://cp-ec2b0bf7-wp.workers.dev/wp-json/wp/v2';

export interface WpPost {
  id: number; slug: string; link: string; status: string; type: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  date: string; modified: string;
  author: number; featured_media: number;
  categories: number[]; tags: number[];
  _embedded?: {
    author?: Array<{ id: number; name: string; slug: string; avatar_urls: Record<string, string> }>;
    'wp:featuredmedia'?: Array<{ id: number; source_url: string; alt_text: string; media_details: { width: number; height: number; sizes: Record<string, { source_url: string }> } }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>;
  };
}
export interface WpPage {
  id: number; slug: string; link: string; parent: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string; modified: string; menu_order: number;
}
export interface WpCategory {
  id: number; slug: string; name: string; description: string;
  count: number; parent: number; link: string;
}
export interface WpTag {
  id: number; slug: string; name: string; description: string; count: number;
}
export interface WpMedia {
  id: number; slug: string; source_url: string; alt_text: string;
  media_type: string; mime_type: string;
  media_details: { width: number; height: number; sizes: Record<string, { source_url: string; width: number; height: number }> };
}
export interface WpUser {
  id: number; slug: string; name: string; description: string;
  avatar_urls: Record<string, string>; link: string;
}
export interface WpMenu {
  id: number; slug: string; name: string;
  items: Array<{ id: number; title: string; url: string; parent: number; order: number }>;
}
export interface WpSiteInfo {
  name: string; description: string; url: string; home: string;
  gmt_offset: number; timezone_string: string;
  namespaces: string[];
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch { return null; }
}

// get_posts() — 포스트 목록
export async function getPosts(args: { perPage?: number; page?: number; categoryId?: number; tagId?: number; authorId?: number; search?: string; embed?: boolean } = {}): Promise<WpPost[]> {
  const { perPage = 10, page = 1, categoryId, tagId, authorId, search, embed = true } = args;
  const params = new URLSearchParams({ per_page: String(perPage), page: String(page) });
  if (categoryId) params.set('categories', String(categoryId));
  if (tagId)      params.set('tags', String(tagId));
  if (authorId)   params.set('author', String(authorId));
  if (search)     params.set('search', search);
  if (embed)      params.set('_embed', '1');
  return await apiFetch<WpPost[]>(`/posts?${params}`) ?? [];
}

// get_post() — 단일 포스트 (slug 기반)
export async function getPost(slug: string): Promise<WpPost | null> {
  const posts = await apiFetch<WpPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
  return posts?.[0] ?? null;
}

// get_page() — 단일 페이지 (slug 기반)
export async function getPage(slug: string): Promise<WpPage | null> {
  const pages = await apiFetch<WpPage[]>(`/pages?slug=${encodeURIComponent(slug)}&_embed=1`);
  return pages?.[0] ?? null;
}

// get_pages() — 페이지 목록
export async function getPages(perPage = 100): Promise<WpPage[]> {
  return await apiFetch<WpPage[]>(`/pages?per_page=${perPage}&_embed=1`) ?? [];
}

// get_categories() — 카테고리 목록
export async function getCategories(hideEmpty = true): Promise<WpCategory[]> {
  return await apiFetch<WpCategory[]>(`/categories?per_page=100&hide_empty=${hideEmpty}`) ?? [];
}

// get_category() — 카테고리 상세 (slug 기반)
export async function getCategory(slug: string): Promise<WpCategory | null> {
  const cats = await apiFetch<WpCategory[]>(`/categories?slug=${encodeURIComponent(slug)}`);
  return cats?.[0] ?? null;
}

// get_tags() — 태그 목록
export async function getTags(): Promise<WpTag[]> {
  return await apiFetch<WpTag[]>('/tags?per_page=100&hide_empty=true') ?? [];
}

// get_tag() — 태그 상세 (slug 기반)
export async function getTag(slug: string): Promise<WpTag | null> {
  const tags = await apiFetch<WpTag[]>(`/tags?slug=${encodeURIComponent(slug)}`);
  return tags?.[0] ?? null;
}

// get_userdata() / get_author_posts_url() — 작성자 정보
export async function getAuthor(slugOrId: string | number): Promise<WpUser | null> {
  if (typeof slugOrId === 'number') return await apiFetch<WpUser>(`/users/${slugOrId}`);
  const users = await apiFetch<WpUser[]>(`/users?slug=${encodeURIComponent(String(slugOrId))}`);
  return users?.[0] ?? null;
}

// wp_get_attachment_url() — 미디어 URL
export async function getMedia(id: number): Promise<WpMedia | null> {
  return await apiFetch<WpMedia>(`/media/${id}`);
}

// bloginfo() — 사이트 정보
export async function getSiteInfo(): Promise<WpSiteInfo | null> {
  try {
    const res = await fetch('https://cp-ec2b0bf7-wp.workers.dev/wp-json');
    return res.ok ? await res.json() : null;
  } catch { return null; }
}

// get_search_results() — 검색
export async function searchPosts(query: string, perPage = 10): Promise<WpPost[]> {
  return await getPosts({ search: query, perPage });
}

// get_post_thumbnail_url() — 대표 이미지 URL 추출 (헬퍼)
export function getFeaturedImageUrl(post: WpPost, size: 'thumbnail' | 'medium' | 'large' | 'full' = 'large'): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.[size]?.source_url ?? media.source_url ?? null;
}

// get_the_date() — 날짜 포맷
export function formatDate(dateString: string, locale = 'ko-KR'): string {
  try {
    return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateString; }
}

// get_avatar_url() — 아바타 URL
export function getAvatarUrl(post: WpPost, size = 96): string | null {
  return post._embedded?.author?.[0]?.avatar_urls?.[String(size)] ?? null;
}

// the_excerpt() — 발췌문 텍스트 추출
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

// get_post_class() — 포스트 CSS 클래스
export function getPostClass(post: WpPost): string {
  return ['post', `post-${post.id}`, post.type, `status-${post.status}`].join(' ');
}
