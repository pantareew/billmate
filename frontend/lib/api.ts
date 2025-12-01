const BASE_URL = "http://localhost:8000"; //api server
//api function
export async function apiFetch<T>(
  endpoint: string, //route
  options?: RequestInit //method, boady, header
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, { //fetch call
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  //api errors
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json(); //return data
}
