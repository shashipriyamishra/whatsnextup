// Trending API Client
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://whatsnextup-api-214675476458.us-central1.run.app"

export interface RedditPost {
  title: string
  subreddit: string
  author: string
  upvotes: number
  comments: number
  url: string
  created: string
  thumbnail?: string
}

export interface YouTubeVideo {
  title: string
  channel: string
  description: string
  thumbnail?: string
  views: number
  likes: number
  url: string
  published_at: string
}

export interface NewsArticle {
  title: string
  description: string
  source: string
  author: string
  url: string
  image?: string
  published_at: string
}

export interface WeatherData {
  city: string
  country: string
  temperature: number
  feels_like: number
  description: string
  icon: string
  humidity: number
  wind_speed: number
}

export interface HackerNewsStory {
  title: string
  author: string
  score: number
  comments: number
  url: string
  hn_url: string
  time: string
}

export interface GitHubRepo {
  name: string
  full_name: string
  author: string
  description: string
  language: string
  stars: number
  forks: number
  stars_today: number
  url: string
}

export interface PersonalizedFeed {
  reddit?: RedditPost[]
  youtube?: YouTubeVideo[]
  news?: NewsArticle[]
  weather?: WeatherData
  tech?: HackerNewsStory[]
  github?: GitHubRepo[]
}

export async function getRedditTrending(
  subreddit: string = "popular",
  limit: number = 10,
): Promise<RedditPost[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/trending/reddit?subreddit=${subreddit}&limit=${limit}`,
    )
    const data = await response.json()
    return data.posts || []
  } catch (error) {
    console.error("Error fetching Reddit trending:", error)
    return []
  }
}

export async function getYouTubeTrending(
  region: string = "US",
  category: string = "0",
  limit: number = 10,
): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/trending/youtube?region=${region}&category=${category}&limit=${limit}`,
    )
    const data = await response.json()
    return data.videos || []
  } catch (error) {
    console.error("Error fetching YouTube trending:", error)
    return []
  }
}

export async function getTopNews(
  country: string = "us",
  category: string = "general",
  limit: number = 10,
): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/trending/news?country=${country}&category=${category}&limit=${limit}`,
    )
    const data = await response.json()
    return data.articles || []
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}

export async function getWeather(
  city: string = "New York",
  country: string = "US",
): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/trending/weather?city=${city}&country=${country}`,
    )
    const data = await response.json()
    return data.weather || null
  } catch (error) {
    console.error("Error fetching weather:", error)
    return null
  }
}

export async function getHackerNewsTrending(
  limit: number = 10,
): Promise<HackerNewsStory[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/trending/hackernews?limit=${limit}`,
    )
    const data = await response.json()
    return data.stories || []
  } catch (error) {
    console.error("Error fetching Hacker News:", error)
    return []
  }
}

export async function getGitHubTrending(
  language: string = "",
  since: string = "daily",
): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/trending/github?language=${language}&since=${since}`,
    )
    const data = await response.json()
    return data.repositories || []
  } catch (error) {
    console.error("Error fetching GitHub trending:", error)
    return []
  }
}

export async function getPersonalizedFeed(
  city?: string,
  country?: string,
): Promise<PersonalizedFeed> {
  try {
    const params = new URLSearchParams()
    if (city) params.append("city", city)
    if (country) params.append("country", country)

    const response = await fetch(
      `${API_URL}/api/trending/feed?${params.toString()}`,
    )
    const data = await response.json()
    return data.feed || {}
  } catch (error) {
    console.error("Error fetching personalized feed:", error)
    return {}
  }
}
