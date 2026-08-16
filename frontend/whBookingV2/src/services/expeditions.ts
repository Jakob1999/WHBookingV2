import { tripCardData } from "../types/propTypes";

type TripListResponse = [tripCardData[], number];
const API_BASE_URL = "http://localhost:8080/api";

if (import.meta.env.DEV) {
  console.info("[Data source] Frontend -> Backend API -> Sanity");
}

export async function trip(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/trip/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trip data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching trip data:", error);
    throw error;
  }
}

export async function trips(limit : number, offset : number): Promise<TripListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit,
        offset
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trips");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching trips data:", error);
    throw error;
  }
}

export async function oldTrips(limit : number, offset : number): Promise<TripListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/oldTrips/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit,
        offset
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trips");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching trips data:", error);
    throw error;
  }
}

  export async function getImage(imageUrl: string) {
    return imageUrl;
  }
  