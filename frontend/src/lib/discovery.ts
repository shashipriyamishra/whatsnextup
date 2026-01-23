// Discovery API calls (no auth required)
import { getApiUrl } from "./api"

const API_URL = getApiUrl()

export async function getDiscoverySuggestions(
  category: string,
  params?: Record<string, string>,
) {
  try {
    const queryParams = new URLSearchParams(params || {}).toString()
    const url = `${API_URL}/api/discovery/${category}${queryParams ? `?${queryParams}` : ""}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Discovery API failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${category} suggestions:`, error)
    return { suggestions: [], error: true }
  }
}

export async function getEntertainmentSuggestions(
  category: "movies" | "tv" = "movies",
) {
  return getDiscoverySuggestions("entertainment", { category })
}

export async function getFoodSuggestions(cuisine?: string) {
  return getDiscoverySuggestions("food", cuisine ? { cuisine } : {})
}

export async function getLearningSuggestions(topic?: string) {
  return getDiscoverySuggestions("learning", topic ? { topic } : {})
}

export async function getTravelSuggestions(location?: string) {
  return getDiscoverySuggestions("travel", location ? { location } : {})
}

export async function getWellnessSuggestions(focus?: string) {
  return getDiscoverySuggestions("wellness", focus ? { focus } : {})
}

export async function getShoppingSuggestions(category?: string) {
  return getDiscoverySuggestions("shopping", category ? { category } : {})
}

export async function getHobbiesSuggestions(interest?: string) {
  return getDiscoverySuggestions("hobbies", interest ? { interest } : {})
}

export async function getHomeSuggestions(room?: string) {
  return getDiscoverySuggestions("home", room ? { room } : {})
}

export async function getCareerSuggestions(field?: string) {
  return getDiscoverySuggestions("career", field ? { field } : {})
}

export async function getEventsSuggestions(location?: string) {
  return getDiscoverySuggestions("events", location ? { location } : {})
}
