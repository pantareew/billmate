const BASE_URL = process.env.NEXT_PUBLIC_API_URL!; //api server
//api function
export async function apiFetch<T>(
  endpoint: string, //route
  options?: RequestInit //method, boady, header
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, { //fetch call
    ...options,
  });
  //api errors
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json(); //return data
}
